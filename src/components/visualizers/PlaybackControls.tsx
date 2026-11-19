import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number; // 0.5, 1, 2
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  stepTitle?: string;
  stepDescription?: string;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  stepTitle,
  stepDescription,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const delay = Math.round(1400 / speed);
      timerRef.current = setTimeout(() => {
        if (currentStep < totalSteps - 1) {
          onStepForward();
        } else {
          onPause();
        }
      }, delay);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep, totalSteps, speed, onStepForward, onPause]);

  const handleStepForward = () => {
    sounds.playStep();
    onStepForward();
  };

  const handleStepBackward = () => {
    sounds.playStep();
    onStepBackward();
  };

  const handlePlayToggle = () => {
    sounds.playClick();
    if (isPlaying) onPause();
    else onPlay();
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-700/60 shadow-xl bg-slate-900/80">
      {/* Step info header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            Step {totalSteps > 0 ? currentStep + 1 : 0} of {totalSteps}
          </div>
          <span className="text-sm font-semibold text-slate-200 line-clamp-1">
            {stepTitle || 'Ready for operation'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 min-w-[140px]">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-300"
              style={{
                width: totalSteps > 0 ? `${((currentStep + 1) / totalSteps) * 100}%` : '0%',
              }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400">
            {totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0}%
          </span>
        </div>
      </div>

      {stepDescription && (
        <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-3 font-mono">
          💡 {stepDescription}
        </p>
      )}

      {/* Button controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={() => {
              sounds.playClick();
              onReset();
            }}
            disabled={totalSteps === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            title="Reset to initial state"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Previous Step */}
          <button
            onClick={handleStepBackward}
            disabled={currentStep <= 0 || isPlaying}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors flex items-center gap-1 text-xs"
            title="Step Backward"
          >
            <SkipBack className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Play / Pause button */}
          <button
            onClick={handlePlayToggle}
            disabled={totalSteps === 0 || currentStep >= totalSteps - 1 && !isPlaying}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25'
            } disabled:opacity-40`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Play Animation</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={handleStepForward}
            disabled={currentStep >= totalSteps - 1 || isPlaying}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors flex items-center gap-1 text-xs"
            title="Step Forward"
          >
            <span className="hidden sm:inline">Next</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <FastForward className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => {
                sounds.playClick();
                onSpeedChange(s);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                speed === s
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

