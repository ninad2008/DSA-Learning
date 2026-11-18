import React from 'react';
import { ModuleId } from '../../types/dsa';
import { LayoutDashboard, Hash, ShieldCheck, GitPullRequest, Binary, Code2, Gamepad2 } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

interface ModuleNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const ModuleNav: React.FC<ModuleNavProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hashmap', label: 'HashMap Explorer', icon: Hash, color: 'text-purple-400' },
    { id: 'hashset', label: 'HashSet Adventure', icon: ShieldCheck, color: 'text-cyan-400' },
    { id: 'minheap', label: 'Min Heap Master', icon: GitPullRequest, color: 'text-blue-400' },
    { id: 'indexheap', label: 'Index Heap Challenge', icon: Binary, color: 'text-emerald-400' },
    { id: 'challenges', label: 'Coding Arena', icon: Code2, color: 'text-amber-400' },
    { id: 'gamemodes', label: 'Game Modes', icon: Gamepad2, color: 'text-rose-400' },
  ];

  return (
    <nav className="glass-panel border-b border-slate-800/80 bg-slate-950/40 px-4 lg:px-8 py-2 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                onNavigate(item.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-purple-600/20 text-white border border-purple-500/40 shadow-md shadow-purple-600/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-purple-300' : item.color || 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
