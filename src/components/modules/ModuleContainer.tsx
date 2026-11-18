import React, { useState } from 'react';
import { ModuleId, LevelId } from '../../types/dsa';
import { MODULES_DATA } from '../../data/modules';
import { LevelProgressionBar } from '../layout/LevelProgressionBar';
import { ConceptGuideView } from './ConceptGuideView';
import { HashMapVisualizer } from '../visualizers/HashMapVisualizer';
import { HashSetVisualizer } from '../visualizers/HashSetVisualizer';
import { MinHeapVisualizer } from '../visualizers/MinHeapVisualizer';
import { IndexHeapVisualizer } from '../visualizers/IndexHeapVisualizer';
import { ChallengeRunner } from '../challenges/ChallengeRunner';
import { ConceptQuiz } from '../quizzes/ConceptQuiz';
import { CodeViewer } from '../visualizers/CodeViewer';

// Real-world mini projects
import { HashMapMarksTracker } from '../miniProjects/HashMapMarksTracker';
import { HashSetUsernameValidator } from '../miniProjects/HashSetUsernameValidator';
import { MinHeapCpuScheduler } from '../miniProjects/MinHeapCpuScheduler';
import { IndexHeapHospitalER } from '../miniProjects/IndexHeapHospitalER';

interface ModuleContainerProps {
  moduleId: ModuleId;
  onBackToDashboard: () => void;
}

export const ModuleContainer: React.FC<ModuleContainerProps> = ({ moduleId, onBackToDashboard }) => {
  const [activeLevel, setActiveLevel] = useState<LevelId>('concept');
  const moduleData = MODULES_DATA[moduleId];

  const renderVisualizer = () => {
    switch (moduleId) {
      case 'hashmap':
        return <HashMapVisualizer />;
      case 'hashset':
        return <HashSetVisualizer />;
      case 'minheap':
        return <MinHeapVisualizer />;
      case 'indexheap':
        return <IndexHeapVisualizer />;
    }
  };

  const renderMiniProject = () => {
    switch (moduleId) {
      case 'hashmap':
        return <HashMapMarksTracker />;
      case 'hashset':
        return <HashSetUsernameValidator />;
      case 'minheap':
        return <MinHeapCpuScheduler />;
      case 'indexheap':
        return <IndexHeapHospitalER />;
    }
  };

  const getCodeSnippetKey = () => {
    switch (moduleId) {
      case 'hashmap': return 'hashmap_insert';
      case 'hashset': return 'hashset_add';
      case 'minheap': return 'minheap_insert';
      case 'indexheap': return 'indexheap_operations';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Level Progression Stepper */}
      <LevelProgressionBar
        moduleId={moduleId}
        activeLevel={activeLevel}
        onSelectLevel={setActiveLevel}
      />

      {/* Level Content View */}
      {activeLevel === 'concept' && (
        <ConceptGuideView
          moduleId={moduleId}
          onProceedToVisualizer={() => setActiveLevel('visual')}
        />
      )}

      {(activeLevel === 'visual' || activeLevel === 'manual') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              {activeLevel === 'visual' ? 'Level 2: Interactive Simulation' : 'Level 3: Manual Operations Lab'}
            </span>
            <span className="text-xs text-slate-400">
              Record, inspect, and step through operations
            </span>
          </div>
          {renderVisualizer()}
        </div>
      )}

      {activeLevel === 'code' && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 space-y-4">
            <h3 className="text-base font-bold text-slate-100">
              Level 4: Code Architecture & Line-by-Line Inspection
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore how {moduleData.title} is implemented across production languages: Java, Python, and C++.
              Observe how memory management, pointers, and hash maps interact.
            </p>
            <div className="h-[420px]">
              <CodeViewer snippetKey={getCodeSnippetKey()} activeLine={2} />
            </div>
          </div>
        </div>
      )}

      {activeLevel === 'challenges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Level 5: Practical Coding Challenges
            </span>
          </div>
          <ChallengeRunner initialModuleId={moduleId} />
        </div>
      )}

      {activeLevel === 'project' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Level 6: Real-World Software Application
            </span>
          </div>
          {renderMiniProject()}
        </div>
      )}

      {activeLevel === 'mastery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Level 7: Final Certification Test
            </span>
          </div>
          <ConceptQuiz moduleId={moduleId} />
        </div>
      )}
    </div>
  );
};
