import React, { useState } from 'react';
import { MinHeapState, AnimationStep } from '../../types/dsa';
import {
  createInitialMinHeapState,
  recordMinHeapInsert,
  recordMinHeapExtractMin,
  recordMinHeapBuildHeap
} from '../../engine/minheapEngine';
import { PlaybackControls } from './PlaybackControls';
import { CodeViewer } from './CodeViewer';
import { Plus, ArrowDownToLine, RefreshCw, Sparkles, Layers, TreeDeciduous } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';
import { useUser } from '../../state/userContext';

export const MinHeapVisualizer: React.FC = () => {
  const { incrementMission } = useUser();
  const [heapState, setHeapState] = useState<MinHeapState>(() =>
    createInitialMinHeapState([12, 18, 25, 30, 42, 50, 32])
  );

  const [inputVal, setInputVal] = useState<number>(8);
  const [customArrayStr, setCustomArrayStr] = useState('45, 12, 85, 32, 89, 39, 69, 22');

  // Animation timeline state
  const [steps, setSteps] = useState<AnimationStep<MinHeapState>[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeSnippetKey, setActiveSnippetKey] = useState('minheap_insert');

  const currentStep = steps[currentStepIdx];
  const renderedState = currentStep ? currentStep.state : heapState;

  // Insert
  const handleInsert = () => {
    if (isNaN(inputVal)) return;
    if (heapState.array.length >= 15) {
      alert('Max 15 nodes for clear binary tree visualization.');
      return;
    }
    sounds.playClick();
    const recorded = recordMinHeapInsert(heapState, Number(inputVal));
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setActiveSnippetKey('minheap_insert');

    const finalState = recorded[recorded.length - 1].state;
    setHeapState(finalState);
  };

  // Extract Min
  const handleExtractMin = () => {
    if (heapState.array.length === 0) return;
    sounds.playClick();
    const recorded = recordMinHeapExtractMin(heapState);
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setActiveSnippetKey('minheap_extract_min');

    const finalState = recorded[recorded.length - 1].state;
    setHeapState(finalState);
    incrementMission('minheap');
  };

  // Build Heap from Array (Heapify)
  const handleBuildHeap = () => {
    sounds.playClick();
    const parsed = customArrayStr
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n))
      .slice(0, 11);

    if (parsed.length === 0) return;
    const recorded = recordMinHeapBuildHeap(parsed);
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setActiveSnippetKey('minheap_extract_min');

    const finalState = recorded[recorded.length - 1].state;
    setHeapState(finalState);
  };

  const handleReset = () => {
    sounds.playClick();
    const fresh = createInitialMinHeapState([12, 18, 25, 30, 42, 50, 32]);
    setHeapState(fresh);
    setSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Helper for binary tree node positioning
  const getNodePosition = (index: number, width: number = 600) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelStart = Math.pow(2, level) - 1;
    const posInLevel = index - levelStart;
    const nodesInLevel = Math.pow(2, level);
    const spacing = width / nodesInLevel;
    const x = spacing * (posInLevel + 0.5);
    const y = 35 + level * 65;
    return { x, y, level };
  };

  return (
    <div className="space-y-6">
      {/* Configuration & Input Controls */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <TreeDeciduous className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Min Heap Master Lab</h3>
              <p className="text-xs text-slate-400">Complete binary tree synchronized seamlessly with 1D array indexing.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExtractMin}
              disabled={renderedState.array.length === 0}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Extract Minimum</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              Reset Sample Heap
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Insert element */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1">Insert Value (Number)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                onClick={handleInsert}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Insert</span>
              </button>
            </div>
          </div>

          {/* Heapify builder input */}
          <div className="md:col-span-9">
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Heapify from Custom Array (comma-separated, max 11 items)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customArrayStr}
                onChange={(e) => setCustomArrayStr(e.target.value)}
                placeholder="e.g. 45, 12, 85, 32"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                onClick={handleBuildHeap}
                className="whitespace-nowrap px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Build Heap (O(N))</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualizer: Synchronized Binary Tree + Array Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl bg-slate-900/90">
            <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Total Heap Nodes:</span>
                <span className="font-mono text-blue-400 font-bold">{renderedState.array.length}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                <span>Left: 2i + 1</span>
                <span>Right: 2i + 2</span>
                <span>Parent: (i-1)/2</span>
              </div>
            </div>

            {/* SVG Complete Binary Tree Visualizer */}
            <div className="w-full overflow-x-auto flex justify-center bg-slate-950/60 rounded-xl p-2 border border-slate-800/80">
              <svg width="600" height="280" className="overflow-visible select-none">
                {/* Draw Parent-Child Tree Branches */}
                {renderedState.array.map((_, i) => {
                  if (i === 0) return null;
                  const parentIdx = Math.floor((i - 1) / 2);
                  const parentPos = getNodePosition(parentIdx, 600);
                  const childPos = getNodePosition(i, 600);

                  const isSwapping =
                    renderedState.swappingIndices?.includes(i) &&
                    renderedState.swappingIndices?.includes(parentIdx);

                  return (
                    <line
                      key={`edge-${i}`}
                      x1={parentPos.x}
                      y1={parentPos.y}
                      x2={childPos.x}
                      y2={childPos.y}
                      stroke={isSwapping ? '#a855f7' : '#334155'}
                      strokeWidth={isSwapping ? '3' : '2'}
                      strokeDasharray={isSwapping ? '4 2' : undefined}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Draw Nodes */}
                {renderedState.array.map((node, i) => {
                  const pos = getNodePosition(i, 600);
                  const isComparing = renderedState.comparingIndices?.includes(i);
                  const isSwapping = renderedState.swappingIndices?.includes(i);
                  const isActive = renderedState.activeIndices?.includes(i);

                  let fill = '#1e293b';
                  let stroke = '#475569';
                  let textColor = '#f8fafc';

                  if (isSwapping) {
                    fill = '#7e22ce';
                    stroke = '#c084fc';
                  } else if (isComparing) {
                    fill = '#b45309';
                    stroke = '#fbbf24';
                  } else if (isActive) {
                    fill = '#0369a1';
                    stroke = '#38bdf8';
                  } else if (i === 0) {
                    // Root is min
                    stroke = '#10b981';
                  }

                  return (
                    <g key={node.id} className="transition-all duration-300">
                      {/* Node Circle */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="18"
                        fill={fill}
                        stroke={stroke}
                        strokeWidth="2.5"
                        className="transition-all duration-300 filter drop-shadow-md"
                      />
                      {/* Node Value */}
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        fill={textColor}
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {node.val}
                      </text>
                      {/* Array Index Subscript */}
                      <text
                        x={pos.x}
                        y={pos.y + 28}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        [{i}]
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Synchronized Array Representation */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                <span>Synchronized Array Representation:</span>
                <span className="text-[11px] text-slate-400 font-mono">1D memory storage</span>
              </div>

              <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                {renderedState.array.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">Empty heap array []</span>
                ) : (
                  renderedState.array.map((node, i) => {
                    const isComparing = renderedState.comparingIndices?.includes(i);
                    const isSwapping = renderedState.swappingIndices?.includes(i);
                    const isActive = renderedState.activeIndices?.includes(i);

                    let borderClass = 'border-slate-800 bg-slate-950/80';
                    let textClass = 'text-slate-200';

                    if (isSwapping) {
                      borderClass = 'border-purple-500 bg-purple-950/60 shadow-md shadow-purple-500/20 scale-105';
                      textClass = 'text-purple-200 font-bold';
                    } else if (isComparing) {
                      borderClass = 'border-amber-500 bg-amber-950/60 shadow-md shadow-amber-500/20 scale-105';
                      textClass = 'text-amber-200 font-bold';
                    } else if (isActive) {
                      borderClass = 'border-blue-500 bg-blue-950/60 shadow-md shadow-blue-500/20';
                      textClass = 'text-blue-200 font-bold';
                    } else if (i === 0) {
                      borderClass = 'border-emerald-500/80 bg-emerald-950/40';
                      textClass = 'text-emerald-300 font-bold';
                    }

                    return (
                      <div
                        key={`arr-${i}`}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border min-w-[46px] transition-all duration-300 ${borderClass}`}
                      >
                        <span className="text-xs font-mono font-bold">{node.val}</span>
                        <span className="text-[10px] font-mono text-slate-400 mt-0.5">[{i}]</span>
                      </div>
                    );
                  })
                )}
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
            <div className="glass-panel rounded-2xl p-4 border border-blue-500/40 bg-blue-950/20 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Min Heap Step Logic
              </h4>
              <p className="text-xs text-slate-200 font-mono leading-relaxed mb-2">
                {currentStep.explanation.whatHappened}
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                <strong className="text-cyan-400">Why this happens: </strong>
                {currentStep.explanation.why}
              </div>
            </div>
          )}

          <CodeViewer
            snippetKey={activeSnippetKey}
            activeLine={currentStep?.codeHighlight?.python}
          />
        </div>
      </div>
    </div>
  );
};
