import React, { useState, useEffect } from 'react';
import { SPEED_ROUND_QUESTIONS } from '../../data/gameModesData';
import { useUser } from '../../state/userContext';
import { sounds } from '../../sound/soundEffects';
import { Zap, Timer, Award, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';

export const SpeedChallengeGame: React.FC = () => {
  const { awardXp, awardCoins } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleGameOver();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleStart = () => {
    sounds.playClick();
    setIsActive(true);
    setTimeLeft(45);
    setCurrentIdx(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setCompleted(false);
  };

  const handleAnswer = (optionIdx: number) => {
    sounds.playClick();
    const curQ = SPEED_ROUND_QUESTIONS[currentIdx % SPEED_ROUND_QUESTIONS.length];
    if (optionIdx === curQ.correctIndex) {
      sounds.playSuccess();
      const points = 25 + Math.round(timeLeft / 2);
      setScore(s => s + points);
      setCorrectCount(c => c + 1);
    } else {
      sounds.playError();
      setWrongCount(w => w + 1);
    }

    if (currentIdx + 1 >= SPEED_ROUND_QUESTIONS.length) {
      handleGameOver();
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  const handleGameOver = () => {
    setIsActive(false);
    setCompleted(true);
    sounds.playSuccess();
    awardXp(score, 'Speed Challenge Blitz');
    awardCoins(Math.round(score / 3));
  };

  const curQ = SPEED_ROUND_QUESTIONS[currentIdx % SPEED_ROUND_QUESTIONS.length];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Mode 3: Speed Challenge Blitz</h3>
            <p className="text-xs text-slate-400">Race the clock! High accuracy and speed earn maximum XP multipliers.</p>
          </div>
        </div>

        {isActive && (
          <div className="flex items-center gap-2 bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-500/40 text-rose-300 font-mono text-sm font-bold animate-pulse">
            <Timer className="w-4 h-4 text-rose-400" />
            <span>{timeLeft}s</span>
          </div>
        )}
      </div>

      {!isActive && !completed ? (
        /* Welcome / Start Screen */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 mx-auto flex items-center justify-center">
            <Zap className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-100">Ready for the 45-Second Blitz?</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Answer rapid-fire questions covering HashMap bucket math, Min Heap parent formulas, HashSet duplicate rules, and Index Heap invariants!
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-rose-600/30 inline-flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Start Speed Challenge</span>
          </button>
        </div>
      ) : isActive ? (
        /* Active Question */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question {currentIdx + 1} of {SPEED_ROUND_QUESTIONS.length}</span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-mono">✓ {correctCount}</span>
              <span className="text-rose-400 font-mono">✗ {wrongCount}</span>
              <span className="text-amber-400 font-mono font-bold">Score: {score}</span>
            </div>
          </div>

          <h4 className="text-sm font-bold text-slate-100 p-4 rounded-xl bg-slate-950/80 border border-slate-800 leading-snug font-mono">
            {curQ.prompt}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {curQ.options.map((opt, oIdx) => (
              <button
                key={oIdx}
                onClick={() => handleAnswer(oIdx)}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:bg-purple-950/50 hover:border-purple-500 text-slate-200 text-xs font-semibold font-mono transition-all text-left flex items-center justify-between"
              >
                <span>{opt}</span>
                <span className="text-[10px] text-slate-500 font-mono">[{oIdx + 1}]</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Completed Screen */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-100">Speed Challenge Finished!</h4>
          <div className="flex items-center justify-center gap-4 text-xs font-mono">
            <span className="text-emerald-400 font-bold">{correctCount} Correct</span>
            <span className="text-rose-400 font-bold">{wrongCount} Wrong</span>
            <span className="text-amber-400 font-bold">Total: {score} XP</span>
          </div>
          <button
            onClick={handleStart}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
