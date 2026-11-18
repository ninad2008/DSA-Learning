import React, { useState } from 'react';
import { HashSetState, AnimationStep } from '../../types/dsa';
import {
  createInitialHashSetState,
  recordHashSetAdd,
  recordHashSetContains,
  recordHashSetRemove
} from '../../engine/hashsetEngine';
import { PlaybackControls } from './PlaybackControls';
import { CodeViewer } from './CodeViewer';
import { Plus, Search, Trash2, ShieldAlert, Sparkles, CheckCircle2, AlertOctagon } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';
import { useUser } from '../../state/userContext';

export const HashSetVisualizer: React.FC = () => {
  const { incrementMission } = useUser();
  const [capacity] = useState(8);
  const [setState, setSetState] = useState<HashSetState>(() => createInitialHashSetState(8));
  const [inputVal, setInputVal] = useState('data');

  // Animation timeline state
  const [steps, setSteps] = useState<AnimationStep<HashSetState>[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Special mini game: Find duplicates from stream
  const [streamChallenge, setStreamChallenge] = useState<number[]>([42, 17, 99, 42, 5, 17, 88]);
  const [userFoundDuplicates, setUserFoundDuplicates] = useState<number[]>([]);
  const [streamChallengeDone, setStreamChallengeDone] = useState(false);

  const currentStep = steps[currentStepIdx];
  const renderedState = currentStep ? currentStep.state : setState;

  // Add element
  const handleAdd = () => {
    if (!inputVal.trim()) return;
    sounds.playClick();
    const recorded = recordHashSetAdd(setState, inputVal.trim());
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);

    const finalState = recorded[recorded.length - 1].state;
    setSetState(finalState);

    // Audio cue for duplicate rejection vs success
    if (recorded.some(s => s.type === 'duplicate_reject')) {
      sounds.playError();
    }
  };

  // Contains
  const handleContains = () => {
    if (!inputVal.trim()) return;
    sounds.playClick();
    const recorded = recordHashSetContains(setState, inputVal.trim());
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  // Remove
  const handleRemove = () => {
    if (!inputVal.trim()) return;
    sounds.playClick();
    const recorded = recordHashSetRemove(setState, inputVal.trim());
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    const finalState = recorded[recorded.length - 1].state;
    setSetState(finalState);
  };

  // Test duplicate insertion preset
  const handleTestDuplicatePreset = () => {
    sounds.playClick();
    // First ensure 'data' is added
    let state = setState;
    const r1 = recordHashSetAdd(state, 'quest');
    state = r1[r1.length - 1].state;
    setSetState(state);

    // Now try adding duplicate 'quest' again!
    setTimeout(() => {
      const r2 = recordHashSetAdd(state, 'quest');
      setSteps(r2);
      setCurrentStepIdx(0);
      setIsPlaying(true);
      sounds.playError();
    }, 400);
  };

  const handleReset = () => {
    sounds.playClick();
    setSetState(createInitialHashSetState(capacity));
    setSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Handle stream challenge click
  const handleStreamItemClick = (num: number) => {
    sounds.playClick();
    if (userFoundDuplicates.includes(num)) return;

    // Check if truly a duplicate in stream
    const occurrences = streamChallenge.filter(n => n === num).length;
    if (occurrences > 1) {
      sounds.playSuccess();
      const updated = [...userFoundDuplicates, num];
      setUserFoundDuplicates(updated);
      if (updated.length === 2) { // 42 and 17
        setStreamChallengeDone(true);
        incrementMission('hashset');
      }
    } else {
      sounds.playError();
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Input Panel */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">HashSet Adventure Lab</h3>
              <p className="text-xs text-slate-400">Enforcing strict mathematical uniqueness via O(1) hash buckets.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestDuplicatePreset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>Trigger Duplicate Rejection Alert</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              Clear Set
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-slate-400 mb-1">Element Value</label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="e.g. data"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="md:col-span-7 flex flex-wrap gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Element</span>
            </button>

            <button
              onClick={handleContains}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Contains?</span>
            </button>

            <button
              onClick={handleRemove}
              className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>

      {/* Duplicate Rejection Banner Alert */}
      {renderedState.isDuplicate && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border-2 border-rose-500/80 shadow-xl shadow-rose-600/20 animate-pulse flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 rounded-xl text-white">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-200">
                DUPLICATE DETECTED: "{renderedState.lastCheckedItem}" REJECTED!
              </h4>
              <p className="text-xs text-rose-300/90 font-mono mt-0.5">
                The uniqueness invariant was preserved. HashSet operation returned <code className="bg-rose-900/60 px-1 py-0.5 rounded">false</code> and table size remained {renderedState.size}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Visualizer Canvas & Code Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Set Buckets Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl bg-slate-900/90">
            <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b border-slate-800">
              <span className="text-slate-400">
                Unique Elements in Set: <strong className="text-cyan-400 font-mono text-sm">{renderedState.size}</strong>
              </span>
              <span className="text-slate-400 text-[11px] font-mono">
                No Duplicates Allowed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {renderedState.buckets.map((bucket, bIdx) => {
                const highlight = currentStep?.highlights?.find(h => h.bucketIndex === bIdx);
                const isTarget = highlight !== undefined;
                let borderClass = 'border-slate-800 bg-slate-950/50';

                if (highlight?.color === 'red') borderClass = 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-500/20';
                else if (highlight?.color === 'green') borderClass = 'border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-500/20';
                else if (highlight?.color === 'yellow') borderClass = 'border-amber-500 bg-amber-950/40 shadow-lg shadow-amber-500/20';
                else if (highlight?.color === 'blue') borderClass = 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-500/20';

                return (
                  <div
                    key={bIdx}
                    className={`p-3 rounded-xl border flex flex-col min-h-[90px] transition-all duration-300 ${borderClass}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        Bucket #{bIdx}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                        {bucket.length}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 flex-1 content-start">
                      {bucket.length === 0 ? (
                        <span className="text-[11px] text-slate-600 italic select-none">Empty</span>
                      ) : (
                        bucket.map((item, iIdx) => (
                          <span
                            key={iIdx}
                            className={`px-2 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                              isTarget
                                ? 'bg-cyan-600 text-white shadow-md scale-105'
                                : 'bg-slate-800 text-cyan-300 border border-slate-700'
                            }`}
                          >
                            "{item}"
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hands-on Mini Challenge: Duplicate Detector */}
          <div className="glass-panel rounded-2xl p-4 border border-cyan-500/30 bg-cyan-950/20 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Special Challenge: Spot the Duplicates Using HashSet!
              </h4>
              {streamChallengeDone && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Challenge Solved (+50 XP)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Click the duplicate numbers in this list. As you click, imagine inserting each into a HashSet: if <code className="text-cyan-300 font-mono">set.contains(num)</code> returns true, you found a duplicate!
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {streamChallenge.map((num, idx) => {
                const isSelected = userFoundDuplicates.includes(num);
                return (
                  <button
                    key={idx}
                    onClick={() => handleStreamItemClick(num)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
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
            <div className="glass-panel rounded-2xl p-4 border border-cyan-500/40 bg-cyan-950/20 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                HashSet Internal State Check
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
            snippetKey="hashset_add"
            activeLine={currentStep?.codeHighlight?.python}
          />
        </div>
      </div>
    </div>
  );
};
