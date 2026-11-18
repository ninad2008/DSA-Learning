import React, { useState } from 'react';
import {
  HashMapState,
  CollisionMode,
  HashFunctionType,
  AnimationStep,
  HashNode
} from '../../types/dsa';
import {
  createInitialHashMapState,
  recordHashMapInsert,
  recordHashMapSearch,
  recordHashMapDelete
} from '../../engine/hashmapEngine';
import { PlaybackControls } from './PlaybackControls';
import { CodeViewer } from './CodeViewer';
import { Plus, Search, Trash2, Sliders, Layers, Sparkles } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';
import { useUser } from '../../state/userContext';

export const HashMapVisualizer: React.FC = () => {
  const { incrementMission } = useUser();
  const [capacity] = useState<number>(10);
  const [collisionMode, setCollisionMode] = useState<CollisionMode>('chaining');
  const [hashFunction, setHashFunction] = useState<HashFunctionType>('sum_mod');

  const [mapState, setMapState] = useState<HashMapState>(() =>
    createInitialHashMapState(10, 'chaining', 'sum_mod')
  );

  const [inputKey, setInputKey] = useState('apple');
  const [inputValue, setInputValue] = useState('100');

  // Animation timeline state
  const [steps, setSteps] = useState<AnimationStep<HashMapState>[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeSnippetKey, setActiveSnippetKey] = useState('hashmap_insert');

  const currentStep = steps[currentStepIdx];
  const renderedState = currentStep ? currentStep.state : mapState;

  // Execute Insert
  const handleInsert = () => {
    if (!inputKey.trim()) return;
    sounds.playClick();
    const recorded = recordHashMapInsert(mapState, inputKey.trim(), inputValue.trim() || 'val');
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setActiveSnippetKey('hashmap_insert');

    // Update base state to final step upon completion
    const finalState = recorded[recorded.length - 1].state;
    setMapState(finalState);

    // If collision happened
    if (recorded.some(s => s.type === 'collision')) {
      incrementMission('hashmap');
    }
  };

  // Execute Search
  const handleSearch = () => {
    if (!inputKey.trim()) return;
    sounds.playClick();
    const recorded = recordHashMapSearch(mapState, inputKey.trim());
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setActiveSnippetKey('hashmap_search');
  };

  // Execute Delete
  const handleDelete = () => {
    if (!inputKey.trim()) return;
    sounds.playClick();
    const recorded = recordHashMapDelete(mapState, inputKey.trim());
    setSteps(recorded);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    setActiveSnippetKey('hashmap_insert');
    const finalState = recorded[recorded.length - 1].state;
    setMapState(finalState);
  };

  // Preset scenarios
  const handleLoadCollidingPreset = () => {
    sounds.playClick();
    let state = createInitialHashMapState(capacity, collisionMode, hashFunction);
    // Keys that often collide in sum % 10: e.g. "cat" (99+97+116=312 -> 2), "act" (97+99+116=312 -> 2), "tac" (116+97+99=312 -> 2)
    const rec1 = recordHashMapInsert(state, 'cat', 'feline');
    state = rec1[rec1.length - 1].state;
    const rec2 = recordHashMapInsert(state, 'act', 'perform');
    state = rec2[rec2.length - 1].state;
    const rec3 = recordHashMapInsert(state, 'tac', 'tack');
    state = rec3[rec3.length - 1].state;

    setMapState(state);
    setSteps(rec3);
    setCurrentStepIdx(0);
    setIsPlaying(true);
    incrementMission('hashmap');
  };

  const handleReset = () => {
    sounds.playClick();
    const fresh = createInitialHashMapState(capacity, collisionMode, hashFunction);
    setMapState(fresh);
    setSteps([]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const loadFactor = (renderedState.size / renderedState.capacity).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Configuration & Input Controls */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl bg-slate-900/90">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">HashMap Interactive Lab</h3>
              <p className="text-xs text-slate-400">10-Bucket associative array with live hash computation & collision resolution.</p>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadCollidingPreset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Load Colliding Keys ("cat", "act", "tac")</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              Clear Table
            </button>
          </div>
        </div>

        {/* Input Bar & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          {/* Key Input */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1">Key (String)</label>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="e.g. apple"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Value Input */}
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-400 mb-1">Value</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. 100"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-6 flex flex-wrap gap-2">
            <button
              onClick={handleInsert}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Insert</span>
            </button>

            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Algorithm Settings: Collision Mode & Hash Function */}
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-slate-300">Collision Resolution:</span>
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
              <button
                onClick={() => {
                  sounds.playClick();
                  setCollisionMode('chaining');
                  setMapState(createInitialHashMapState(capacity, 'chaining', hashFunction));
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  collisionMode === 'chaining' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Separate Chaining
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setCollisionMode('linear_probing');
                  setMapState(createInitialHashMapState(capacity, 'linear_probing', hashFunction));
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  collisionMode === 'linear_probing' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Linear Probing
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Hash Function:</span>
            <select
              value={hashFunction}
              onChange={(e) => {
                sounds.playClick();
                const fn = e.target.value as HashFunctionType;
                setHashFunction(fn);
                setMapState(createInitialHashMapState(capacity, collisionMode, fn));
              }}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500 font-mono"
            >
              <option value="sum_mod">Sum of ASCII % Capacity</option>
              <option value="polynomial">Polynomial Rolling Hash</option>
              <option value="first_char">First Char ASCII % Capacity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Visualizer Canvas & Code Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual 10 Buckets Canvas */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-700/60 shadow-xl bg-slate-900/90">
            {/* Table Stats */}
            <div className="flex items-center justify-between text-xs mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <span className="text-slate-400">
                  Elements: <strong className="text-purple-400 font-mono text-sm">{renderedState.size}</strong>
                </span>
                <span className="text-slate-400">
                  Capacity: <strong className="text-cyan-400 font-mono text-sm">{renderedState.capacity}</strong>
                </span>
                <span className="text-slate-400">
                  Load Factor: <strong className={`font-mono text-sm ${Number(loadFactor) > 0.75 ? 'text-amber-400' : 'text-emerald-400'}`}>{loadFactor}</strong>
                </span>
              </div>
              <div className="text-slate-400 text-[11px] font-mono">
                h(k) = k % 10
              </div>
            </div>

            {/* Buckets Grid */}
            <div className="space-y-2">
              {renderedState.buckets.map((bucket, bucketIdx) => {
                // Check highlight for this bucket
                const highlight = currentStep?.highlights?.find(h => h.bucketIndex === bucketIdx);
                const isTarget = highlight !== undefined;
                let highlightClass = 'border-slate-800/80 bg-slate-950/40';

                if (highlight?.color === 'yellow') highlightClass = 'border-amber-500/80 bg-amber-950/30 shadow-lg shadow-amber-500/10';
                else if (highlight?.color === 'green') highlightClass = 'border-emerald-500/80 bg-emerald-950/30 shadow-lg shadow-emerald-500/10';
                else if (highlight?.color === 'purple') highlightClass = 'border-purple-500/80 bg-purple-950/30 shadow-lg shadow-purple-500/10';
                else if (highlight?.color === 'blue') highlightClass = 'border-blue-500/80 bg-blue-950/30 shadow-lg shadow-blue-500/10';
                else if (highlight?.color === 'red') highlightClass = 'border-rose-500/80 bg-rose-950/30 shadow-lg shadow-rose-500/10';

                return (
                  <div
                    key={bucketIdx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ${highlightClass}`}
                  >
                    {/* Bucket Slot Badge */}
                    <div className={`w-14 text-center py-1 rounded-lg font-mono text-xs font-bold transition-all ${
                      isTarget ? 'bg-purple-600 text-white scale-105' : 'bg-slate-800 text-slate-400'
                    }`}>
                      [{bucketIdx}]
                    </div>

                    {/* Bucket contents */}
                    <div className="flex-1 flex flex-wrap items-center gap-2 min-h-[36px]">
                      {Array.isArray(bucket) ? (
                        bucket.length === 0 ? (
                          <span className="text-xs text-slate-600 italic select-none">Empty chain</span>
                        ) : (
                          bucket.map((node: HashNode, nIdx) => {
                            const isNodeHighlighted = highlight?.nodeId === node.id;
                            return (
                              <div key={node.id} className="flex items-center gap-1.5">
                                {nIdx > 0 && <span className="text-purple-400 text-xs">→</span>}
                                <div
                                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 flex items-center gap-2 ${
                                    isNodeHighlighted
                                      ? 'bg-purple-600 border-purple-400 text-white shadow-md scale-105 animate-pulse'
                                      : 'bg-slate-900 border-slate-700 text-slate-200'
                                  }`}
                                >
                                  <span className="font-bold text-cyan-300">"{node.key}"</span>
                                  <span className="text-slate-400">:</span>
                                  <span className="text-emerald-300">"{node.value}"</span>
                                </div>
                              </div>
                            );
                          })
                        )
                      ) : bucket ? (
                        <div
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 flex items-center gap-2 ${
                            isTarget
                              ? 'bg-purple-600 border-purple-400 text-white shadow-md scale-105'
                              : 'bg-slate-900 border-slate-700 text-slate-200'
                          }`}
                        >
                          <span className="font-bold text-cyan-300">"{bucket.key}"</span>
                          <span className="text-slate-400">:</span>
                          <span className="text-emerald-300">"{bucket.value}"</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 italic select-none">Empty slot</span>
                      )}
                    </div>
                  </div>
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
          {/* Step Explanation Box */}
          {currentStep && (
            <div className="glass-panel rounded-2xl p-4 border border-purple-500/40 bg-purple-950/20 shadow-lg">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Algorithm Internal Logic
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

          {/* Synchronized Code Viewer */}
          <CodeViewer
            snippetKey={activeSnippetKey}
            activeLine={currentStep?.codeHighlight?.python}
          />
        </div>
      </div>
    </div>
  );
};
