import React, { useState } from 'react';
import { IndexHeapState, AnimationStep } from '../../types/dsa';
import {
  createInitialIndexHeapState,
  recordIndexHeapInsert,
  recordIndexHeapChangeKey,
  recordIndexHeapDelete,
  recordIndexHeapExtractMin
} from '../../engine/indexheapEngine';
import { PlaybackControls } from './PlaybackControls';
import { CodeViewer } from './CodeViewer';
import { Plus, ArrowDownToLine, RefreshCw, Trash2, CheckCircle2, XCircle, Sparkles, Binary } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';
import { useUser } from '../../state/userContext';

export const IndexHeapVisualizer: React.FC = () => {
  const { incrementMission } = useUser();
  const [capacity] = useState<number>(8);
  const [indexHeapState, setIndexHeapState] = useState<IndexHeapState>(() =>
    createInitialIndexHeapState(8)
  );

  // Form states
  const [insertId, setInsertId] = useState<number>(3);
  const [insertKey, setInsertKey] = useState<number>(20);

  const [changeKeyId, setChangeKeyId] = useState<number>(1);
  const [changeKeyNewVal, setChangeKeyNewVal] = useState<number>(5);

  const [deleteId, setDeleteId] = useState<number>(0);

  // Animation timeline state
  const [steps, setSteps] = useState<AnimationStep<IndexHeapState>[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const currentStep = steps[currentStepIdx];
  const renderedState = currentStep ? currentStep.state : indexHeapState;

  // Insert
  const handleInsert = () => {
    sounds.playClick();
    const recorded = recordIndexHeapInsert(indexHeapState, Number(insertId), Number(insertKey));
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    const finalState = recorded[recorded.length - 1].state;
    setIndexHeapState(finalState);
  };

  // Change Key
  const handleChangeKey = () => {
    sounds.playClick();
    const recorded = recordIndexHeapChangeKey(indexHeapState, Number(changeKeyId), Number(changeKeyNewVal));
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    const finalState = recorded[recorded.length - 1].state;
    setIndexHeapState(finalState);
    incrementMission('indexheap');
  };

  // Delete
  const handleDelete = () => {
    sounds.playClick();
    const recorded = recordIndexHeapDelete(indexHeapState, Number(deleteId));
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    const finalState = recorded[recorded.length - 1].state;
    setIndexHeapState(finalState);
  };

  // Extract Min
  const handleExtractMin = () => {
    sounds.playClick();
    const recorded = recordIndexHeapExtractMin(indexHeapState);
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    const finalState = recorded[recorded.length - 1].state;
    setIndexHeapState(finalState);
  };

  const handleReset = () => {
    sounds.playClick();
    setIndexHeapState(createInitialIndexHeapState(8));
    setSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Helper for binary tree node positioning
  const getNodePosition = (pos: number, width: number = 540) => {
    const level = Math.floor(Math.log2(pos + 1));
    const levelStart = Math.pow(2, level) - 1;
    const posInLevel = pos - levelStart;
    const nodesInLevel = Math.pow(2, level);
    const spacing = width / nodesInLevel;
    const x = spacing * (posInLevel + 0.5);
    const y = 35 + level * 65;
    return { x, y, level };
  };

  return (
    <div className="space-y-6">
      {/* Header and Live Invariant Alert */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Index Min Heap Lab</h3>
              <p className="text-xs text-slate-400">Master the 3-array invariant: pq[], qp[], and keys[] with O(1) position lookup.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Invariant Validation Badge */}
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              renderedState.invariantValid
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20'
                : 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/20 animate-pulse'
            }`}>
              {renderedState.invariantValid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>INVARIANT HELD: qp[pq[i]] == i</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>INVARIANT BROKEN!</span>
                </>
              )}
            </div>

            <button
              onClick={handleExtractMin}
              disabled={renderedState.pq.length === 0}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Extract Min</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              Reset Sample
            </button>
          </div>
        </div>

        {/* 3 Interactive Action Panels: Insert, ChangeKey, Delete */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1: Insert */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-emerald-400" /> 1. Insert Item
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Item ID [0..7]</label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={insertId}
                  onChange={(e) => setInsertId(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Priority Key</label>
                <input
                  type="number"
                  value={insertKey}
                  onChange={(e) => setInsertKey(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100"
                />
              </div>
            </div>
            <button
              onClick={handleInsert}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-emerald-600/30"
            >
              Insert Item
            </button>
          </div>

          {/* Action 2: ChangeKey (THE SUPERPOWER!) */}
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-2">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" /> 2. Change Key (O(log N))
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Target Item ID</label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={changeKeyId}
                  onChange={(e) => setChangeKeyId(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">New Priority</label>
                <input
                  type="number"
                  value={changeKeyNewVal}
                  onChange={(e) => setChangeKeyNewVal(parseInt(e.target.value, 10))}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100"
                />
              </div>
            </div>
            <button
              onClick={handleChangeKey}
              className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-purple-600/30"
            >
              Update Priority (Swim/Sink)
            </button>
          </div>

          {/* Action 3: Delete by Index */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-rose-400" /> 3. Delete by ID (O(log N))
            </span>
            <div>
              <label className="text-[10px] text-slate-400">Item ID to Delete</label>
              <input
                type="number"
                min="0"
                max="7"
                value={deleteId}
                onChange={(e) => setDeleteId(parseInt(e.target.value, 10))}
                className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100"
              />
            </div>
            <button
              onClick={handleDelete}
              className="w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-rose-600/30"
            >
              Delete Item ID
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Array Visualizer + SVG Tree & Code Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl bg-slate-900/90 space-y-5">
            {/* Array 1: keys[] (Item ID -> Actual Value) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-cyan-400 font-mono">
                  1. keys[itemId] → Priority Value
                </span>
                <span className="text-[11px] text-slate-400">Indexed by Item ID</span>
              </div>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                {renderedState.keys.map((k, id) => {
                  const isActive = renderedState.activeId === id;
                  return (
                    <div
                      key={`k-${id}`}
                      className={`flex flex-col items-center p-2 rounded-xl border min-w-[50px] transition-all duration-300 ${
                        isActive
                          ? 'border-cyan-400 bg-cyan-950/80 shadow-md shadow-cyan-400/20 scale-105'
                          : k !== null
                          ? 'border-slate-700 bg-slate-950/80 text-cyan-300'
                          : 'border-slate-800/60 bg-slate-950/30 text-slate-600 opacity-60'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold">
                        {k !== null ? k : '—'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5">ID:{id}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Array 2: pq[] (Heap Position -> Item ID) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-purple-400 font-mono">
                  2. pq[heapPos] → Item ID (Min Heap Order)
                </span>
                <span className="text-[11px] text-slate-400">Priority Queue Order</span>
              </div>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                {renderedState.pq.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">pq is empty</span>
                ) : (
                  renderedState.pq.map((id, pos) => {
                    const isSwapping = renderedState.swappingPq?.includes(pos);
                    const isComparing = renderedState.comparingPq?.includes(pos);
                    const isActive = renderedState.activePqPos === pos;

                    let borderClass = 'border-purple-800/70 bg-purple-950/40 text-purple-200';
                    if (isSwapping) borderClass = 'border-purple-400 bg-purple-600 text-white scale-105 shadow-md shadow-purple-500/30';
                    else if (isComparing) borderClass = 'border-amber-400 bg-amber-950/70 text-amber-200 scale-105';
                    else if (isActive) borderClass = 'border-cyan-400 bg-cyan-950/70 text-cyan-200 scale-105';

                    return (
                      <div
                        key={`pq-${pos}`}
                        className={`flex flex-col items-center p-2 rounded-xl border min-w-[50px] transition-all duration-300 ${borderClass}`}
                      >
                        <span className="text-xs font-mono font-bold">ID: {id}</span>
                        <span className="text-[10px] font-mono opacity-80 mt-0.5">
                          pos:[{pos}]
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Array 3: qp[] (Item ID -> Heap Position) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-emerald-400 font-mono">
                  3. qp[itemId] → Heap Pos in pq (-1 if absent)
                </span>
                <span className="text-[11px] text-slate-400">Inverse Pointer Array</span>
              </div>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                {renderedState.qp.map((pos, id) => {
                  const isActive = renderedState.activeId === id;
                  return (
                    <div
                      key={`qp-${id}`}
                      className={`flex flex-col items-center p-2 rounded-xl border min-w-[50px] transition-all duration-300 ${
                        isActive
                          ? 'border-emerald-400 bg-emerald-950/90 shadow-md shadow-emerald-400/20 scale-105'
                          : pos !== -1
                          ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-200'
                          : 'border-slate-800/60 bg-slate-950/30 text-slate-600 opacity-60'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold">
                        {pos !== -1 ? `pos:${pos}` : '-1'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 mt-0.5">ID:{id}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Visual Binary Tree Representation of Index Heap */}
            <div className="pt-4 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Index Min Heap Tree: (Node labeled with <code className="text-cyan-300">ID (Key)</code>)
              </span>
              <div className="w-full overflow-x-auto flex justify-center bg-slate-950/60 rounded-xl p-2 border border-slate-800/80">
                <svg width="540" height="230" className="overflow-visible select-none">
                  {/* Tree edges */}
                  {renderedState.pq.map((_, pos) => {
                    if (pos === 0) return null;
                    const pPos = Math.floor((pos - 1) / 2);
                    const p = getNodePosition(pPos, 540);
                    const c = getNodePosition(pos, 540);
                    const isSwapping =
                      renderedState.swappingPq?.includes(pos) &&
                      renderedState.swappingPq?.includes(pPos);

                    return (
                      <line
                        key={`edge-ih-${pos}`}
                        x1={p.x}
                        y1={p.y}
                        x2={c.x}
                        y2={c.y}
                        stroke={isSwapping ? '#c084fc' : '#334155'}
                        strokeWidth={isSwapping ? '3' : '2'}
                        strokeDasharray={isSwapping ? '4 2' : undefined}
                      />
                    );
                  })}

                  {/* Tree nodes */}
                  {renderedState.pq.map((id, pos) => {
                    const nodePos = getNodePosition(pos, 540);
                    const keyVal = renderedState.keys[id];
                    const isSwapping = renderedState.swappingPq?.includes(pos);
                    const isComparing = renderedState.comparingPq?.includes(pos);

                    let fill = '#1e293b';
                    let stroke = '#10b981';
                    if (isSwapping) {
                      fill = '#7e22ce';
                      stroke = '#c084fc';
                    } else if (isComparing) {
                      fill = '#b45309';
                      stroke = '#fbbf24';
                    } else if (pos === 0) {
                      fill = '#065f46';
                      stroke = '#34d399';
                    }

                    return (
                      <g key={`tree-node-${id}-${pos}`} className="transition-all duration-300">
                        <circle
                          cx={nodePos.x}
                          cy={nodePos.y}
                          r="20"
                          fill={fill}
                          stroke={stroke}
                          strokeWidth="2.5"
                          className="filter drop-shadow-md"
                        />
                        <text
                          x={nodePos.x}
                          y={nodePos.y - 2}
                          textAnchor="middle"
                          fill="#f8fafc"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          ID:{id}
                        </text>
                        <text
                          x={nodePos.x}
                          y={nodePos.y + 11}
                          textAnchor="middle"
                          fill="#67e8f9"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          ({keyVal})
                        </text>
                        <text
                          x={nodePos.x}
                          y={nodePos.y + 30}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          pos:{pos}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <PlaybackControls
            currentStep={currentStepIdx}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            speed={speed}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onStepForward={() => setCurrentStepIdx(i => Math.min(i + 1, steps.length - 1))}
            onStepBackward={() => setCurrentStepIdx(i => Math.max(i - 1, 0))}
            onReset={() => {
              setCurrentStepIdx(0);
              setIsPlaying(false);
            }}
            onSpeedChange={setSpeed}
            stepTitle={currentStep?.title}
            stepDescription={currentStep?.description}
          />
        </div>

        {/* Step Explanation & Live Code Viewer */}
        <div className="lg:col-span-5 space-y-4">
          {currentStep && (
            <div className="glass-panel rounded-2xl p-4 border border-emerald-500/40 bg-emerald-950/20 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Index Heap Internal Logic
              </h4>
              <p className="text-xs text-slate-200 font-mono leading-relaxed mb-2">
                {currentStep.explanation.whatHappened}
              </p>
              {currentStep.explanation.invariant && (
                <div className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 mb-2">
                  ⚡ {currentStep.explanation.invariant}
                </div>
              )}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                <strong className="text-cyan-400">Why this happens: </strong>
                {currentStep.explanation.why}
              </div>
            </div>
          )}

          <CodeViewer
            snippetKey="indexheap_operations"
            activeLine={currentStep?.codeHighlight?.python}
          />
        </div>
      </div>
    </div>
  );
};
