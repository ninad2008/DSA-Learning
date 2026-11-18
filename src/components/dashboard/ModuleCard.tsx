import React from 'react';
import { ModuleId } from '../../types/dsa';
import { MODULES_DATA } from '../../data/modules';
import { useUser } from '../../state/userContext';
import { Hash, ShieldCheck, GitPullRequest, Binary, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

interface ModuleCardProps {
  moduleId: ModuleId;
  onOpenModule: (moduleId: ModuleId) => void;
}

const ICON_MAP = {
  hashmap: Hash,
  hashset: ShieldCheck,
  minheap: GitPullRequest,
  indexheap: Binary,
};

export const ModuleCard: React.FC<ModuleCardProps> = ({ moduleId, onOpenModule }) => {
  const { getModuleProgress, stats } = useUser();
  const data = MODULES_DATA[moduleId];
  const progress = getModuleProgress(moduleId);
  const Icon = ICON_MAP[moduleId];
  const isMastered = !!stats.masteryQuizzesPassed[moduleId];

  return (
    <div
      onClick={() => {
        sounds.playClick();
        onOpenModule(moduleId);
      }}
      className="glass-panel rounded-2xl p-6 border border-slate-700/60 hover:border-purple-500/60 shadow-xl bg-slate-900/80 hover:bg-slate-850 cursor-pointer transition-all duration-300 group flex flex-col justify-between hover:scale-[1.02]"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="p-3 rounded-2xl border transition-all"
            style={{
              backgroundColor: `${data.themeColor}20`,
              borderColor: `${data.themeColor}50`,
              color: data.themeColor,
            }}
          >
            <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {data.difficulty}
            </span>
            {isMastered && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
              </span>
            )}
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
          {data.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {data.tagline}
        </p>

        {/* Real world note */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
          <strong className="text-purple-400">Used in: </strong>
          <span className="text-slate-400">{data.realWorldUseCase}</span>
        </div>
      </div>

      {/* Progress & Launch Button */}
      <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Mastery Progress</span>
            <span className="font-bold text-slate-200">{progress}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: data.themeColor,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400">7 Interactive Levels</span>
          <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            <span>{progress === 0 ? 'Start Quest' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
