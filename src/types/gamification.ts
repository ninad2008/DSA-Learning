export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  module?: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  category: 'hashmap' | 'hashset' | 'minheap' | 'indexheap' | 'challenge' | 'general';
}

export interface UserStats {
  xp: number;
  coins: number;
  level: number;
  rankTitle: string;
  streakDays: number;
  lastActiveDate: string;
  completedLevels: Record<string, boolean>; // e.g., 'hashmap_concept': true
  completedChallenges: Record<string, boolean>; // e.g., 'hm_two_sum': true
  masteryQuizzesPassed: Record<string, boolean>;
  unlockedBadges: string[];
  solvedDailyMissions: string[];
  soundEnabled: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  badge: string;
  rank: number;
}
