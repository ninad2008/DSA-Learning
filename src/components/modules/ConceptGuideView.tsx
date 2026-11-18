import React from 'react';
import { ModuleId } from '../../types/dsa';
import { MODULES_DATA } from '../../data/modules';
import { useUser } from '../../state/userContext';
import { BookOpen, CheckCircle2, ArrowRight, Clock, Zap, Globe, Sparkles } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

interface ConceptGuideViewProps {
  moduleId: ModuleId;
  onProceedToVisualizer: () => void;
}

export const ConceptGuideView: React.FC<ConceptGuideViewProps> = ({ moduleId, onProceedToVisualizer }) => {
  const { stats, completeLevel } = useUser();
  const moduleData = MODULES_DATA[moduleId];
  const isCompleted = !!stats.completedLevels[`${moduleId}_concept`];

  const handleCompleteConcept = () => {
    sounds.playClick();
    completeLevel(moduleId, 'concept');
    onProceedToVisualizer();
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/60 shadow-xl bg-slate-900/90 space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
          <BookOpen className="w-4 h-4" />
          <span>Level 1: Deep Concept Foundations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
          Understanding {moduleData.title}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          {moduleData.conceptGuide.introduction}
        </p>
      </div>

      {/* Key Terminology Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Core Terminology & Invariants
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {moduleData.conceptGuide.keyTerms.map((term, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
              <strong className="text-xs font-mono text-purple-300 block">{term.term}</strong>
              <p className="text-xs text-slate-400 leading-relaxed">{term.definition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Mechanics List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Internal Algorithmic Mechanics
        </h3>
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          {moduleData.conceptGuide.coreMechanics.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-mono">
              <span className="text-emerald-400 font-bold">{idx + 1}.</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time & Space Complexity Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Time & Space Complexity
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-3">Operation</th>
                <th className="p-3">Average Case</th>
                <th className="p-3">Worst Case</th>
                <th className="p-3">Mathematical Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {moduleData.conceptGuide.timeComplexity.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-bold text-slate-200">{row.operation}</td>
                  <td className="p-3 text-emerald-400 font-bold">{row.average}</td>
                  <td className="p-3 text-rose-400 font-bold">{row.worst}</td>
                  <td className="p-3 text-slate-400">{row.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-slate-400 font-mono mt-1">
          Space Complexity: <strong className="text-purple-400">{moduleData.conceptGuide.spaceComplexity}</strong>
        </div>
      </div>

      {/* Real-World Systems Applications */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Where is this used in Production?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {moduleData.conceptGuide.realWorldExamples.map((ex, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>{ex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action: Proceed to Simulation */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="text-xs text-slate-400">
          {isCompleted ? (
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Concept Mastered (+50 XP)
            </span>
          ) : (
            <span>Ready to see it in action?</span>
          )}
        </div>

        <button
          onClick={handleCompleteConcept}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
        >
          <span>{isCompleted ? 'Go to Visual Simulation' : 'Complete & Launch Simulation (+50 XP)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
