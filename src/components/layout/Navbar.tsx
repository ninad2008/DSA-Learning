import React from 'react';
import { useUser } from '../../state/userContext';
import { Flame, Coins, Trophy, Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

interface NavbarProps {
  onOpenLeaderboard: () => void;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLeaderboard, activeView, onNavigate }) => {
  const { stats, toggleSound, resetProgress, recentReward } = useUser();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigate('dashboard');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                DSA QUEST
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Play with Data Structures, Visualize & Master Them!
            </p>
          </div>
        </div>

        {/* Gamification Stats: Streak, Coins, XP, Level */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Recent Reward Toast */}
          {recentReward && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold animate-bounce shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>+{recentReward.xp} XP: {recentReward.text}</span>
            </div>
          )}

          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400 shadow-sm"
            title={`${stats.streakDays} Day Learning Streak`}
          >
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{stats.streakDays}</span>
          </div>

          {/* Coins */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-yellow-400 shadow-sm"
            title={`${stats.coins} Quest Coins`}
          >
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{stats.coins}</span>
          </div>

          {/* XP & Level Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-bold text-purple-300 shadow-lg shadow-purple-600/10 cursor-pointer hover:bg-purple-950/90 transition-all"
            onClick={onOpenLeaderboard}
            title="Open Leaderboard"
          >
            <Trophy className="w-4 h-4 text-purple-400" />
            <span className="font-mono text-cyan-300">{stats.xp} XP</span>
            <span className="px-1.5 py-0.2 rounded bg-purple-800/60 text-[10px] text-white">
              Lv.{stats.level}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              toggleSound();
            }}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={stats.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {stats.soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset progress (subtle) */}
          <button
            onClick={resetProgress}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors hidden sm:block"
            title="Reset All Progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

