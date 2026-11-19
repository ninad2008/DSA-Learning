import React, { useState } from 'react';
import { FIX_STRUCTURE_CASES } from '../../data/gameModesData';
import { useUser } from '../../state/userContext';
import { sounds } from '../../sound/soundEffects';
import { Wrench, CheckCircle2, AlertTriangle, RotateCcw, Sparkles } from 'lucide-react';

export const FixStructureGame: React.FC = () => {
  const { awardXp, awardCoins } = useUser();
  const [caseIdx, setCaseIdx] = useState(0);

  const curCase = FIX_STRUCTURE_CASES[caseIdx];
  const [currentState, setCurrentState] = useState<any>(() => JSON.parse(JSON.stringify(curCase.initialBrokenState)));
  const [status, setStatus] = useState<{ valid: boolean; message: string }>(() => curCase.validationCheck(curCase.initialBrokenState));
  const [solved, setSolved] = useState(false);

  const handleApplyFix = (action: any) => {
    sounds.playClick();
    const next = JSON.parse(JSON.stringify(currentState));

    if (action.type === 'SWAP') {
      const { i, j } = action.payload;
      const t = next.array[i];
      next.array[i] = next.array[j];
      next.array[j] = t;
    } else if (action.type === 'SET_QP') {
      const { id, val } = action.payload;
      next.qp[id] = val;
    }

    setCurrentState(next);
    const check = curCase.validationCheck(next);
    setStatus(check);

    if (check.valid && !solved) {
      sounds.playSuccess();
      setSolved(true);
      awardXp(100, 'Structure Repaired!');
      awardCoins(30);
    } else if (!check.valid) {
      sounds.playError();
    }
  };

  const handleNextCase = () => {
    sounds.playClick();
    const nextIdx = (caseIdx + 1) % FIX_STRUCTURE_CASES.length;
    setCaseIdx(nextIdx);
    const nextCase = FIX_STRUCTURE_CASES[nextIdx];
    const initial = JSON.parse(JSON.stringify(nextCase.initialBrokenState));
    setCurrentState(initial);
    setStatus(nextCase.validationCheck(initial));
    setSolved(false);
  };

  const handleReset = () => {
    sounds.playClick();
    const initial = JSON.parse(JSON.stringify(curCase.initialBrokenState));
    setCurrentState(initial);
    setStatus(curCase.validationCheck(initial));
    setSolved(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Mode 2: Fix the Broken Structure</h3>
            <p className="text-xs text-slate-400">An invalid invariant has broken this data structure. Identify and fix it!</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all text-xs"
            title="Reset broken state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextCase}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-600/30 transition-all"
          >
            Next Scenario ({caseIdx + 1}/{FIX_STRUCTURE_CASES.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-bold text-purple-400">
            Scenario #{caseIdx + 1}: {curCase.title}
          </span>
          <p className="text-xs text-slate-300 mt-1">
            {curCase.description}
          </p>
        </div>

        {/* Flaw Alert Box */}
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-300">Flaw Detected: </strong>
            {curCase.flawDescription}
          </div>
        </div>

        {/* Current State Snapshot */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
          <span className="text-[10px] uppercase text-slate-500 block mb-2 font-bold">
            Live Memory State:
          </span>
          <pre className="text-cyan-300 whitespace-pre-wrap">
            {JSON.stringify(currentState, null, 2)}
          </pre>
        </div>

        {/* Available Fix Actions */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 block">
            Select Repair Action:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {curCase.fixActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleApplyFix(action)}
                disabled={solved}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 hover:bg-slate-800 hover:border-purple-500 text-xs font-mono text-slate-200 transition-all text-left flex items-center justify-between"
              >
                <span>{action.label}</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Validation Status */}
        <div className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-3 transition-all ${
          status.valid
            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20'
            : 'bg-amber-950/60 border-amber-500/60 text-amber-200'
        }`}>
          {status.valid ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-emerald-400">STRUCTURE REPAIRED: </strong>
                {status.message} (+100 XP awarded!)
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-amber-400">STATUS: </strong>
                {status.message}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

