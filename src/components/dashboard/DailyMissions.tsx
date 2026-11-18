import React from 'react';
import { useUser } from '../../state/userContext';
import { Target, CheckCircle2, Coins, Sparkles } from 'lucide-react';

export const DailyMissions: React.FC = () => {
  const { dailyMissions } = useUser();

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Target className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100">Daily Learning Missions</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Resets in 14h 22m
        </span>
      </div>

      <div className="space-y-3">
        {dailyMissions.map((m) => {
          const progressPercent = Math.min(100, Math.round((m.currentCount / m.targetCount) * 100));

          return (
            <div
              key={m.id}
              className={`p-3.5 rounded-xl border transition-all ${
                m.completed
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400">
                      {m.currentCount}
                    </div>
                  )}
                  <h4 className="text-xs font-bold">{m.title}</h4>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-amber-400 font-bold">+{m.xpReward} XP</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Coins className="w-3 h-3" />
                    <span>+{m.coinReward}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mb-2">{m.description}</p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    m.completed ? 'bg-emerald-400' : 'bg-purple-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
