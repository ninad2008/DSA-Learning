import React from 'react';
import { ModuleId, LevelId } from '../../types/dsa';
import { useUser } from '../../state/userContext';
import { Lock, Check, BookOpen, Eye, Play, Code, Trophy, Sparkles, Award } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

interface LevelProgressionBarProps {
  moduleId: ModuleId;
  activeLevel: LevelId;
  onSelectLevel: (levelId: LevelId) => void;
}

const LEVELS_CONFIG: {
  id: LevelId;
  label: string;
  shortLabel: string;
  icon: any;
  levelNum: number;
}[] = [
  { id: 'concept', label: '1. Understand Concept', shortLabel: 'Concept', icon: BookOpen, levelNum: 1 },
  { id: 'visual', label: '2. Visual Simulation', shortLabel: 'Simulation', icon: Eye, levelNum: 2 },
  { id: 'manual', label: '3. Manual Operations', shortLabel: 'Manual Lab', icon: Play, levelNum: 3 },
  { id: 'code', label: '4. Underlying Code', shortLabel: 'Code Dive', icon: Code, levelNum: 4 },
  { id: 'challenges', label: '5. Interactive Challenges', shortLabel: 'Challenges', icon: Trophy, levelNum: 5 },
  { id: 'project', label: '6. Real Mini-Project', shortLabel: 'Mini-Project', icon: Sparkles, levelNum: 6 },
  { id: 'mastery', label: '7. Final Mastery Test', shortLabel: 'Mastery Test', icon: Award, levelNum: 7 },
];

export const LevelProgressionBar: React.FC<LevelProgressionBarProps> = ({
  moduleId,
  activeLevel,
  onSelectLevel,
}) => {
  const { stats, isLevelUnlocked } = useUser();

  return (
    <div className="glass-panel rounded-2xl p-3 border border-slate-700/60 shadow-xl bg-slate-900/90 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[700px] gap-2">
        {LEVELS_CONFIG.map((lvl, index) => {
          const isUnlocked = isLevelUnlocked(moduleId, lvl.id);
          const isDone = !!stats.completedLevels[`${moduleId}_${lvl.id}`];
          const isActive = activeLevel === lvl.id;
          const Icon = lvl.icon;

          return (
            <React.Fragment key={lvl.id}>
              {/* Stepper node */}
              <button
                onClick={() => {
                  if (isUnlocked) {
                    sounds.playClick();
                    onSelectLevel(lvl.id);
                  } else {
                    sounds.playError();
                  }
                }}
                disabled={!isUnlocked}
                className={`flex-1 flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-[1.03]'
                    : isDone
                    ? 'bg-slate-900/90 border-emerald-500/50 text-slate-200 hover:border-emerald-400'
                    : isUnlocked
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : isUnlocked
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-950 text-slate-700'
                  }`}>
                    {isDone ? <Check className="w-3.5 h-3.5" /> : !isUnlocked ? <Lock className="w-3.5 h-3.5" /> : lvl.levelNum}
                  </div>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <span className="text-[11px] font-bold line-clamp-1">
                  {lvl.shortLabel}
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">
                  Lvl {lvl.levelNum}
                </span>
              </button>

              {/* Connecting line between steps */}
              {index < LEVELS_CONFIG.length - 1 && (
                <div
                  className={`w-3 h-0.5 shrink-0 ${
                    isDone ? 'bg-emerald-500/70' : 'bg-slate-800'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
