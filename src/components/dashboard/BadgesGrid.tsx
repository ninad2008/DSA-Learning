import React from 'react';
import { ALL_BADGES } from '../../data/badges';
import { useUser } from '../../state/userContext';
import {
  Award,
  Hash,
  ShieldAlert,
  GitPullRequest,
  Binary,
  Crown,
  Flame,
  Zap,
  Wrench,
  Code2,
  Compass,
  Lock
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Compass,
  Hash,
  ShieldAlert,
  GitPullRequest,
  Binary,
  Crown,
  Flame,
  Zap,
  Wrench,
  Code2,
};

export const BadgesGrid: React.FC = () => {
  const { stats } = useUser();

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-bold text-slate-100">Achievement Badges</h3>
        </div>
        <span className="text-xs font-mono text-purple-400 font-bold">
          {stats.unlockedBadges.length} / {ALL_BADGES.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {ALL_BADGES.map((badge) => {
          const isUnlocked = stats.unlockedBadges.includes(badge.id);
          const IconComponent = ICON_MAP[badge.icon] || Award;

          let rarityBorder = 'border-slate-800';
          let glowColor = 'from-slate-800 to-slate-900';

          if (badge.rarity === 'legendary') {
            rarityBorder = 'border-amber-500/60 shadow-lg shadow-amber-500/20';
            glowColor = 'from-amber-600/30 to-purple-600/30';
          } else if (badge.rarity === 'epic') {
            rarityBorder = 'border-purple-500/60 shadow-lg shadow-purple-500/20';
            glowColor = 'from-purple-600/30 to-indigo-600/30';
          } else if (badge.rarity === 'rare') {
            rarityBorder = 'border-cyan-500/60 shadow-lg shadow-cyan-500/20';
            glowColor = 'from-cyan-600/30 to-blue-600/30';
          }

          return (
            <div
              key={badge.id}
              className={`p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                isUnlocked
                  ? `${rarityBorder} bg-gradient-to-b ${glowColor} hover:scale-105`
                  : 'border-slate-900 bg-slate-950/40 text-slate-600 opacity-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-inner ${
                  isUnlocked
                    ? 'bg-slate-950/80 text-cyan-300 border border-slate-700/60'
                    : 'bg-slate-950 text-slate-700'
                }`}
              >
                {isUnlocked ? (
                  <IconComponent className="w-6 h-6" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-700" />
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
                {badge.name}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                {badge.description}
              </p>
              <span className={`text-[9px] uppercase tracking-wider font-extrabold mt-2 px-1.5 py-0.2 rounded ${
                badge.rarity === 'legendary' ? 'text-amber-400 bg-amber-950/60' :
                badge.rarity === 'epic' ? 'text-purple-400 bg-purple-950/60' :
                badge.rarity === 'rare' ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400 bg-slate-800'
              }`}>
                {badge.rarity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

