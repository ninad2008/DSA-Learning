import React from 'react';
import { X, Trophy, Flame, Crown, Medal, Sparkles } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserXp: number;
}

const LEADERBOARD_ENTRIES = [
  { rank: 1, name: 'Satoshi_Dev', xp: 4850, streak: 18, badge: 'Grandmaster' },
  { rank: 2, name: 'AlgorithmQueen', xp: 4120, streak: 12, badge: 'Heap Hero' },
  { rank: 3, name: 'ByteMaster', xp: 3680, streak: 9, badge: 'Index Master' },
  { rank: 4, name: 'You (Explorer)', xp: 0, streak: 3, badge: 'Apprentice' }, // placeholder
  { rank: 5, name: 'CodeNinja_99', xp: 1840, streak: 6, badge: 'Hash Hunter' },
  { rank: 6, name: 'DataWizard', xp: 1420, streak: 4, badge: 'Duplicate Detective' },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, currentUserXp }) => {
  if (!isOpen) return null;

  const entries = LEADERBOARD_ENTRIES.map(e =>
    e.name.startsWith('You') ? { ...e, xp: currentUserXp } : e
  ).sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, rank: idx + 1 }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-2xl bg-slate-900 max-w-xl w-full space-y-5 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Weekly Global Tournament
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30">
                  Tier 1
                </span>
              </h3>
              <p className="text-xs text-slate-400">Top 3 algorithms masters earn rare tournament crowns this Sunday.</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {entries.map((user) => {
            const isMe = user.name.startsWith('You');

            return (
              <div
                key={user.rank}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  isMe
                    ? 'bg-purple-950/70 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center font-mono text-xs ${
                    user.rank === 1 ? 'bg-amber-500 text-slate-950' :
                    user.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    user.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {user.rank === 1 ? <Crown className="w-4 h-4 fill-current" /> : user.rank}
                  </div>

                  <div>
                    <strong className="text-xs block text-slate-200">{user.name}</strong>
                    <span className="text-[10px] text-purple-400 font-mono">{user.badge}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{user.streak}d</span>
                  </div>
                  <span className="font-bold text-cyan-300">{user.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
