import React from 'react';
import { ModuleId } from '../../types/dsa';
import { ProfileHero } from './ProfileHero';
import { ModuleCard } from './ModuleCard';
import { DailyMissions } from './DailyMissions';
import { BadgesGrid } from './BadgesGrid';
import { Code2, Gamepad2, Sparkles, ArrowRight } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

interface DashboardProps {
  onOpenModule: (moduleId: ModuleId) => void;
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenModule, onNavigate }) => {
  const modules: ModuleId[] = ['hashmap', 'hashset', 'minheap', 'indexheap'];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Profile & XP Hero */}
      <ProfileHero />

      {/* The 4 Core Learning Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Core Learning Modules
            </h3>
            <p className="text-xs text-slate-400">
              Four interactive data structures with 7-level progressive mastery.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m) => (
            <ModuleCard key={m} moduleId={m} onOpenModule={onOpenModule} />
          ))}
        </div>
      </div>

      {/* Quick Launch Cards for Coding Arena & Special Game Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coding Arena Card */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigate('challenges');
          }}
          className="glass-panel rounded-2xl p-6 border border-slate-700/60 hover:border-amber-500/60 shadow-xl bg-gradient-to-r from-slate-900/90 via-amber-950/20 to-slate-900/90 cursor-pointer transition-all hover:scale-[1.01] group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
              <Code2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                LeetCode-Style Coding Arena
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                16 hand-crafted challenges (Two Sum, Kth Largest, Indexed Priority Queue, etc.)
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Special Game Modes Card */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigate('gamemodes');
          }}
          className="glass-panel rounded-2xl p-6 border border-slate-700/60 hover:border-rose-500/60 shadow-xl bg-gradient-to-r from-slate-900/90 via-rose-950/20 to-slate-900/90 cursor-pointer transition-all hover:scale-[1.01] group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-100 group-hover:text-rose-300 transition-colors">
                Special Game Modes
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Predict the Next Step, Fix the Broken Structure, and 45s Speed Blitz!
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* Daily Missions & Badges Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <DailyMissions />
        </div>
        <div className="lg:col-span-7">
          <BadgesGrid />
        </div>
      </div>
    </div>
  );
};

