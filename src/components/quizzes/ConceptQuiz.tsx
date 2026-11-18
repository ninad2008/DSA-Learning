import React, { useState } from 'react';
import { ModuleId } from '../../types/dsa';
import { MODULES_DATA } from '../../data/modules';
import { useUser } from '../../state/userContext';
import { sounds } from '../../sound/soundEffects';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface ConceptQuizProps {
  moduleId: ModuleId;
  onPass?: () => void;
}

export const ConceptQuiz: React.FC<ConceptQuizProps> = ({ moduleId, onPass }) => {
  const { stats, passMasteryQuiz } = useUser();
  const moduleData = MODULES_DATA[moduleId];
  const questions = moduleData.quizQuestions;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const curQ = questions[currentIdx];
  const hasAnsweredCurrent = selectedAnswers[currentIdx] !== undefined;

  const handleSelectOption = (optIdx: number) => {
    if (hasAnsweredCurrent || showResults) return;
    sounds.playClick();
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));

    if (optIdx === curQ.correctIndex) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.correctIndex) correct++;
      });

      setShowResults(true);
      const passed = correct >= Math.ceil(questions.length * 0.75);
      if (passed) {
        passMasteryQuiz(moduleId);
        if (onPass) onPass();
      }
    }
  };

  const handleRetake = () => {
    sounds.playClick();
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowResults(false);
  };

  // Score calculation
  let correctCount = 0;
  questions.forEach((q, i) => {
    if (selectedAnswers[i] === q.correctIndex) correctCount++;
  });
  const scorePercent = Math.round((correctCount / questions.length) * 100);
  const isMastered = !!stats.masteryQuizzesPassed[moduleId];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">{moduleData.title}: Mastery Certification</h3>
            <p className="text-xs text-slate-400">Score 75% or higher to unlock the official Mastery Badge.</p>
          </div>
        </div>

        {isMastered && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Certified Master
          </span>
        )}
      </div>

      {!showResults ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span className="font-mono text-purple-400">Passing criteria: 75%</span>
          </div>

          <h4 className="text-sm font-bold text-slate-100 leading-snug">
            {curQ.question}
          </h4>

          <div className="space-y-2.5 pt-2">
            {curQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              let btnClass = 'border-slate-800 bg-slate-950/60 hover:bg-slate-850 hover:border-slate-700 text-slate-200';

              if (hasAnsweredCurrent) {
                if (optIdx === curQ.correctIndex) {
                  btnClass = 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-md shadow-emerald-500/20';
                } else if (isSelected) {
                  btnClass = 'border-rose-500 bg-rose-950/60 text-rose-200 shadow-md shadow-rose-500/20';
                } else {
                  btnClass = 'border-slate-800 bg-slate-950/30 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnsweredCurrent}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start justify-between gap-3 ${btnClass}`}
                >
                  <span>{opt}</span>
                  {hasAnsweredCurrent && (
                    optIdx === curQ.correctIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : isSelected ? (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    ) : null
                  )}
                </button>
              );
            })}
          </div>

          {hasAnsweredCurrent && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <strong className="text-cyan-400">Explanation: </strong>
              {curQ.explanation}
            </div>
          )}

          {hasAnsweredCurrent && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="text-center py-6 space-y-4">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border ${
            scorePercent >= 75
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-lg shadow-emerald-500/20'
              : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
          }`}>
            {scorePercent >= 75 ? <Award className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>

          <h4 className="text-lg font-bold text-slate-100">
            {scorePercent >= 75 ? 'Mastery Test Passed!' : 'Need More Practice'}
          </h4>

          <p className="text-xs text-slate-300 max-w-md mx-auto">
            You scored <strong className="text-cyan-400 text-sm font-mono">{scorePercent}%</strong> ({correctCount} / {questions.length} correct).
            {scorePercent >= 75
              ? ` Congratulations! You have conquered ${moduleData.title} and earned +200 XP!`
              : ' Review the interactive simulations and try again to earn your certificate.'}
          </p>

          <button
            onClick={handleRetake}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Test</span>
          </button>
        </div>
      )}
    </div>
  );
};
