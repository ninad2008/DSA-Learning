import React from 'react';
import { useUser } from '../../state/userContext';
import { Trophy, Flame, Coins, ShieldCheck, Sparkles, Target } from 'lucide-react';

export const ProfileHero: React.FC = () => {
  const { stats, getOverallProgress } = useUser();
  const overallProgress = getOverallProgress();

  const xpInCurrentLevel = stats.xp % 250;
  const xpNeeded = 250;
  const levelProgress = Math.round((xpInCurrentLevel / xpNeeded) * 100);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl bg-gradient-to-br from-slate-900/90 via-purple-950/20 to-slate-950 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: User Profile Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-xl shadow-purple-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-cyan-300 font-mono">
                DQ
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                  Data Structure Knight
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/30">
                  {stats.rankTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Level {stats.level} Explorer • Maintaining a {stats.streakDays}-day streak!
              </p>
            </div>
          </div>

          {/* XP Progress to Next Level */}
          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Next Level: {xpInCurrentLevel} / {xpNeeded} XP</span>
              <span className="text-purple-400 font-bold">{levelProgress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500 shadow-md shadow-purple-500/30"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>

          {/* Highlights pills */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-slate-300">{stats.streakDays} Days Streak</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">{stats.xp} Total XP</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-slate-300">{stats.coins} Quest Coins</span>
            </div>
          </div>
        </div>

        {/* Right: Overall Course Completion Progress Card */}
        <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-5 border border-slate-800/80 shadow-xl flex items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" /> Course Progress
            </span>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {overallProgress}% <span className="text-xs text-slate-500 font-normal">completed</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Complete all 4 data structures, challenges, and mastery tests to earn the coveted <strong>DSA Legend</strong> badge.
            </p>
          </div>

          {/* Circular progress visual */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                className="text-purple-500 transition-all duration-700"
                strokeDasharray="201"
                strokeDashoffset={201 - (201 * overallProgress) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-sm font-black font-mono text-cyan-300">
              {overallProgress}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
