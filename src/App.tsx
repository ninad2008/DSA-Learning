import React, { useState } from 'react';
import { UserProvider, useUser } from './state/userContext';
import { Navbar } from './components/layout/Navbar';
import { ModuleNav } from './components/layout/ModuleNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { ModuleContainer } from './components/modules/ModuleContainer';
import { ChallengeRunner } from './components/challenges/ChallengeRunner';
import { GameModesView } from './components/gameModes/GameModesView';
import { LeaderboardModal } from './components/dashboard/LeaderboardModal';
import { ModuleId } from './types/dsa';

const AppContent: React.FC = () => {
  const { stats } = useUser();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  const handleOpenModule = (moduleId: ModuleId) => {
    setActiveView(moduleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        activeView={activeView}
        onNavigate={setActiveView}
      />

      {/* Module Navigation Bar */}
      <ModuleNav activeView={activeView} onNavigate={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'dashboard' && (
          <Dashboard
            onOpenModule={handleOpenModule}
            onNavigate={setActiveView}
          />
        )}

        {(['hashmap', 'hashset', 'minheap', 'indexheap'] as ModuleId[]).includes(activeView as ModuleId) && (
          <ModuleContainer
            moduleId={activeView as ModuleId}
            onBackToDashboard={() => setActiveView('dashboard')}
          />
        )}

        {activeView === 'challenges' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90">
              <h2 className="text-xl font-black text-slate-100">
                Interactive DSA Coding Arena
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Practice classic algorithm challenges with instant feedback, test cases, and multi-language support (Java, Python, C++).
              </p>
            </div>
            <ChallengeRunner />
          </div>
        )}

        {activeView === 'gamemodes' && (
          <GameModesView />
        )}
      </main>

      {/* Leaderboard & Tournament Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUserXp={stats.xp}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 bg-slate-950/90 py-6 px-4 text-center mt-12 text-xs text-slate-500 font-mono">
        <p className="text-slate-400 font-semibold mb-1">
          DSA Quest – Master the Data Structures
        </p>
        <p className="text-[11px] text-slate-500">
          "Don't just learn data structures. Play with them, visualize them, and master them!"
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;

