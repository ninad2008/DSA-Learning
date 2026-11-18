import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserStats, DailyMission } from '../types/gamification';
import { ModuleId, LevelId } from '../types/dsa';
import { ALL_BADGES } from '../data/badges';
import { sounds } from '../sound/soundEffects';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'dsa_quest_user_stats_v1';

const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Hash Collisions Explorer',
    description: 'Trigger a collision in the HashMap visualizer.',
    xpReward: 50,
    coinReward: 20,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    category: 'hashmap',
  },
  {
    id: 'm2',
    title: 'Heap Extractor',
    description: 'Perform 2 extract-min operations in the Min Heap visualizer.',
    xpReward: 60,
    coinReward: 25,
    targetCount: 2,
    currentCount: 0,
    completed: false,
    category: 'minheap',
  },
  {
    id: 'm3',
    title: 'Invariant Guardian',
    description: 'Update a key in the Index Heap and verify qp[pq[i]] == i.',
    xpReward: 75,
    coinReward: 30,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    category: 'indexheap',
  },
  {
    id: 'm4',
    title: 'Code Solver',
    description: 'Pass at least 1 coding challenge.',
    xpReward: 100,
    coinReward: 50,
    targetCount: 1,
    currentCount: 0,
    completed: false,
    category: 'challenge',
  }
];

const INITIAL_STATS: UserStats = {
  xp: 120,
  coins: 50,
  level: 1,
  rankTitle: 'Apprentice Seeker',
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLevels: {
    // Level 1 concept unlocked and completed for hashmap so user has quick start
    'hashmap_concept': true,
  },
  completedChallenges: {},
  masteryQuizzesPassed: {},
  unlockedBadges: ['first_steps', 'streak_flame'],
  solvedDailyMissions: [],
  soundEnabled: true,
};

interface UserContextType {
  stats: UserStats;
  dailyMissions: DailyMission[];
  awardXp: (amount: number, reason?: string) => void;
  awardCoins: (amount: number) => void;
  completeLevel: (moduleId: ModuleId, levelId: LevelId) => void;
  completeChallenge: (challengeId: string) => void;
  passMasteryQuiz: (moduleId: ModuleId) => void;
  toggleSound: () => void;
  isLevelUnlocked: (moduleId: ModuleId, levelId: LevelId) => boolean;
  getModuleProgress: (moduleId: ModuleId) => number;
  getOverallProgress: () => number;
  incrementMission: (category: DailyMission['category']) => void;
  resetProgress: () => void;
  recentReward: { text: string; xp: number } | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const LEVEL_ORDER: LevelId[] = ['concept', 'visual', 'manual', 'code', 'challenges', 'project', 'mastery'];

const RANKS = [
  { minXp: 0, title: 'Novice Coder' },
  { minXp: 200, title: 'Apprentice Seeker' },
  { minXp: 500, title: 'Data Explorer' },
  { minXp: 1000, title: 'Algorithm Knight' },
  { minXp: 2000, title: 'Structure Sorcerer' },
  { minXp: 3500, title: 'Heap Architect' },
  { minXp: 5000, title: 'Grandmaster of DSA' },
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...INITIAL_STATS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return INITIAL_STATS;
  });

  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(INITIAL_MISSIONS);
  const [recentReward, setRecentReward] = useState<{ text: string; xp: number } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // storage unavailable
    }
    sounds.setEnabled(stats.soundEnabled);
  }, [stats]);

  const awardXp = (amount: number, reason?: string) => {
    sounds.playXpChime();
    setRecentReward({ text: reason || 'XP Earned!', xp: amount });
    setTimeout(() => setRecentReward(null), 3000);

    setStats((prev) => {
      const nextXp = prev.xp + amount;
      const rank = [...RANKS].reverse().find(r => nextXp >= r.minXp)?.title || 'Novice Coder';
      const level = Math.floor(nextXp / 250) + 1;

      // Check badges
      const newBadges = [...prev.unlockedBadges];
      if (nextXp >= 1000 && !newBadges.includes('heap_hero')) {
        // can auto check
      }

      return {
        ...prev,
        xp: nextXp,
        level,
        rankTitle: rank,
        unlockedBadges: newBadges,
      };
    });
  };

  const awardCoins = (amount: number) => {
    setStats((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

  const completeLevel = (moduleId: ModuleId, levelId: LevelId) => {
    const key = `${moduleId}_${levelId}`;
    if (!stats.completedLevels[key]) {
      sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
      });

      setStats((prev) => {
        const updated = { ...prev.completedLevels, [key]: true };
        const unlockedBadges = [...prev.unlockedBadges];

        // Check if full module is completed
        const allModuleLevels = LEVEL_ORDER.every(lvl => updated[`${moduleId}_${lvl}`]);
        if (allModuleLevels) {
          if (moduleId === 'hashmap' && !unlockedBadges.includes('hash_hunter')) unlockedBadges.push('hash_hunter');
          if (moduleId === 'hashset' && !unlockedBadges.includes('duplicate_detective')) unlockedBadges.push('duplicate_detective');
          if (moduleId === 'minheap' && !unlockedBadges.includes('heap_hero')) unlockedBadges.push('heap_hero');
          if (moduleId === 'indexheap' && !unlockedBadges.includes('index_master')) unlockedBadges.push('index_master');
        }

        // Check overall completion
        const allFourDone = ['hashmap', 'hashset', 'minheap', 'indexheap'].every(m =>
          LEVEL_ORDER.every(l => updated[`${m}_${l}`])
        );
        if (allFourDone && !unlockedBadges.includes('dsa_legend')) {
          unlockedBadges.push('dsa_legend');
        }

        return {
          ...prev,
          completedLevels: updated,
          unlockedBadges,
        };
      });

      awardXp(80, `Completed ${levelId.toUpperCase()} Level!`);
      awardCoins(25);
    }
  };

  const completeChallenge = (challengeId: string) => {
    if (!stats.completedChallenges[challengeId]) {
      sounds.playSuccess();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      });

      setStats((prev) => {
        const updated = { ...prev.completedChallenges, [challengeId]: true };
        const newBadges = [...prev.unlockedBadges];
        const count = Object.keys(updated).length;
        if (count >= 5 && !newBadges.includes('coder_elite')) {
          newBadges.push('coder_elite');
        }
        return {
          ...prev,
          completedChallenges: updated,
          unlockedBadges: newBadges,
        };
      });

      awardXp(120, 'Challenge Solved!');
      awardCoins(40);
      incrementMission('challenge');
    }
  };

  const passMasteryQuiz = (moduleId: ModuleId) => {
    setStats((prev) => ({
      ...prev,
      masteryQuizzesPassed: { ...prev.masteryQuizzesPassed, [moduleId]: true }
    }));
    completeLevel(moduleId, 'mastery');
    awardXp(150, `${moduleId.toUpperCase()} Mastery Achieved!`);
    awardCoins(60);
  };

  const toggleSound = () => {
    setStats((prev) => {
      const next = !prev.soundEnabled;
      sounds.setEnabled(next);
      return { ...prev, soundEnabled: next };
    });
  };

  const isLevelUnlocked = (moduleId: ModuleId, levelId: LevelId): boolean => {
    // Level 1 ('concept') is always unlocked
    if (levelId === 'concept') return true;

    const idx = LEVEL_ORDER.indexOf(levelId);
    if (idx <= 0) return true;

    // A level is unlocked if the immediate previous level in this module is completed
    const prevLevel = LEVEL_ORDER[idx - 1];
    return !!stats.completedLevels[`${moduleId}_${prevLevel}`];
  };

  const getModuleProgress = (moduleId: ModuleId): number => {
    const total = LEVEL_ORDER.length;
    const completed = LEVEL_ORDER.filter(l => stats.completedLevels[`${moduleId}_${l}`]).length;
    return Math.round((completed / total) * 100);
  };

  const getOverallProgress = (): number => {
    const modules: ModuleId[] = ['hashmap', 'hashset', 'minheap', 'indexheap'];
    const totalLevels = modules.length * LEVEL_ORDER.length;
    let completed = 0;
    modules.forEach(m => {
      LEVEL_ORDER.forEach(l => {
        if (stats.completedLevels[`${m}_${l}`]) completed++;
      });
    });
    return Math.round((completed / totalLevels) * 100);
  };

  const incrementMission = (category: DailyMission['category']) => {
    setDailyMissions((prev) =>
      prev.map((m) => {
        if (m.category === category && !m.completed) {
          const nextCount = m.currentCount + 1;
          const completed = nextCount >= m.targetCount;
          if (completed) {
            awardXp(m.xpReward, `Daily Mission: ${m.title}`);
            awardCoins(m.coinReward);
          }
          return {
            ...m,
            currentCount: nextCount,
            completed,
          };
        }
        return m;
      })
    );
  };

  const resetProgress = () => {
    if (window.confirm('Are you sure you want to reset all DSA Quest progress?')) {
      localStorage.removeItem(STORAGE_KEY);
      setStats(INITIAL_STATS);
    }
  };

  return (
    <UserContext.Provider
      value={{
        stats,
        dailyMissions,
        awardXp,
        awardCoins,
        completeLevel,
        completeChallenge,
        passMasteryQuiz,
        toggleSound,
        isLevelUnlocked,
        getModuleProgress,
        getOverallProgress,
        incrementMission,
        resetProgress,
        recentReward,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
