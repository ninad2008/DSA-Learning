import React, { useState } from 'react';
import { PREDICT_QUESTIONS } from '../../data/gameModesData';
import { useUser } from '../../state/userContext';
import { sounds } from '../../sound/soundEffects';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Award, RotateCcw } from 'lucide-react';

export const PredictStepGame: React.FC = () => {
  const { awardXp, awardCoins } = useUser();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = PREDICT_QUESTIONS[currentIdx];

  const handleSelectOption = (optId: string) => {
    if (isAnswered) return;
    sounds.playClick();
    setSelectedOptionId(optId);
    setIsAnswered(true);

    const opt = currentQ.options.find(o => o.id === optId);
    if (opt?.isCorrect) {
      sounds.playSuccess();
      setScore(s => s + currentQ.xp);
      awardXp(currentQ.xp, 'Predict Step: Correct!');
      awardCoins(15);
    } else {
      sounds.playError();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIdx < PREDICT_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    sounds.playClick();
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Mode 1: Predict the Next Step</h3>
            <p className="text-xs text-slate-400">Analyze the data structure state and predict the exact subsequent algorithmic step.</p>
          </div>
        </div>

        <div className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-500/30">
          Score: {score} XP
        </div>
      </div>

      {!completed ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question {currentIdx + 1} of {PREDICT_QUESTIONS.length}</span>
            <span className="capitalize font-mono text-purple-400">Module: {currentQ.moduleId}</span>
          </div>

          <h4 className="text-sm font-bold text-slate-100 leading-snug">
            {currentQ.question}
          </h4>

          {/* Context State Snapshot */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block mb-1">Current State Snapshot:</span>
            <pre className="text-cyan-300 whitespace-pre-wrap">
              {JSON.stringify(currentQ.contextState, null, 2)}
            </pre>
          </div>

          {/* Options */}
          <div className="space-y-2.5 pt-2">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let btnClass = 'border-slate-800 bg-slate-950/60 hover:bg-slate-850 hover:border-slate-700 text-slate-200';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-md shadow-emerald-500/20';
                } else if (isSelected) {
                  btnClass = 'border-rose-500 bg-rose-950/60 text-rose-200 shadow-md shadow-rose-500/20';
                } else {
                  btnClass = 'border-slate-800 bg-slate-950/30 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start justify-between gap-3 ${btnClass}`}
                >
                  <span>{opt.text}</span>
                  {isAnswered && (
                    opt.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : isSelected ? (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : null
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation after answering */}
          {isAnswered && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-cyan-400 block">Explanation:</span>
              <p className="text-slate-300 leading-relaxed">
                {currentQ.options.find(o => o.id === selectedOptionId)?.explanation ||
                  currentQ.options.find(o => o.isCorrect)?.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <span>{currentIdx < PREDICT_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Round'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Round Completed */
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-100">Predict Round Complete!</h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            You tested your algorithmic foresight and earned <strong className="text-amber-400">{score} XP</strong>!
          </p>
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      )}
    </div>
  );
};

