import React, { useState } from 'react';
import { PredictStepGame } from './PredictStepGame';
import { FixStructureGame } from './FixStructureGame';
import { SpeedChallengeGame } from './SpeedChallengeGame';
import { HelpCircle, Wrench, Zap, Gamepad2 } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

export const GameModesView: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'predict' | 'fix' | 'speed'>('predict');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Mode Switcher Tabs */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-700/60 shadow-xl bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Special Game Modes</h3>
            <p className="text-xs text-slate-400">Gamified drills to test algorithmic intuition and speed.</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveMode('predict');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'predict' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Mode 1: Predict Step</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveMode('fix');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'fix' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Mode 2: Fix Structure</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveMode('speed');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'speed' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Mode 3: Speed Blitz</span>
          </button>
        </div>
      </div>

      {/* Active Game View */}
      {activeMode === 'predict' && <PredictStepGame />}
      {activeMode === 'fix' && <FixStructureGame />}
      {activeMode === 'speed' && <SpeedChallengeGame />}
    </div>
  );
};
