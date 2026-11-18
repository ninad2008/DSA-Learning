import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, UserPlus, Sparkles } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';
import { useUser } from '../../state/userContext';

export const HashSetUsernameValidator: React.FC = () => {
  const { awardXp, completeLevel } = useUser();
  const [registeredSet, setRegisteredSet] = useState<Set<string>>(
    new Set(['admin', 'satoshi', 'ada_lovelace', 'linus', 'turing', 'shadow_ninja'])
  );

  const [inputUsername, setInputUsername] = useState('');
  const [feedback, setFeedback] = useState<{ isDuplicate: boolean; message: string } | null>(null);

  const checkAvailability = (username: string) => {
    const clean = username.trim().toLowerCase();
    if (!clean) {
      setFeedback(null);
      return;
    }

    if (registeredSet.has(clean)) {
      setFeedback({
        isDuplicate: true,
        message: `Username "${clean}" is already taken!`,
      });
    } else {
      setFeedback({
        isDuplicate: false,
        message: `Username "${clean}" is available!`,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputUsername(val);
    checkAvailability(val);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputUsername.trim().toLowerCase();
    if (!clean) return;

    if (registeredSet.has(clean)) {
      sounds.playError();
      setFeedback({ isDuplicate: true, message: `Rejected: "${clean}" is already registered!` });
      return;
    }

    sounds.playSuccess();
    setRegisteredSet(prev => new Set([...prev, clean]));
    setFeedback({ isDuplicate: false, message: `Successfully registered "${clean}"!` });
    setInputUsername('');
    awardXp(30, 'Registered unique username');
    completeLevel('hashset', 'project');
  };

  // Generate alternatives if duplicate
  const alternatives = feedback?.isDuplicate && inputUsername
    ? [
        `${inputUsername.trim().toLowerCase()}_${Math.floor(Math.random() * 90 + 10)}`,
        `real_${inputUsername.trim().toLowerCase()}`,
        `${inputUsername.trim().toLowerCase()}_dev`
      ]
    : [];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Mini-Project: Real-time Unique Username Validator</h3>
          <p className="text-xs text-slate-400">Enforces unique usernames with O(1) HashSet membership checks and suggested alternatives.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Registration Form */}
        <div className="md:col-span-6 space-y-4">
          <form onSubmit={handleRegister} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block">Register Username</span>
            <div>
              <label className="text-[10px] text-slate-400">Choose Username</label>
              <input
                type="text"
                value={inputUsername}
                onChange={handleInputChange}
                placeholder="e.g. satoshi"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Live Feedback */}
            {feedback && (
              <div className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                feedback.isDuplicate
                  ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                  : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              }`}>
                {feedback.isDuplicate ? (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Suggested Alternatives */}
            {alternatives.length > 0 && (
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                <span className="text-cyan-400 font-semibold block text-[11px]">Available Alternatives:</span>
                <div className="flex flex-wrap gap-1.5">
                  {alternatives.map((alt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setInputUsername(alt);
                        checkAvailability(alt);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono transition-all"
                    >
                      {alt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={feedback?.isDuplicate || !inputUsername.trim()}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/30 disabled:opacity-40"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Claim Username</span>
            </button>
          </form>
        </div>

        {/* Right: Active HashSet Records */}
        <div className="md:col-span-6 space-y-3">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-3 font-semibold text-slate-300">
              <span>Registered Usernames Set ({registeredSet.size} Unique Items)</span>
              <span className="text-[11px] font-mono text-cyan-400">set.has(x) in O(1)</span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto">
              {Array.from(registeredSet).map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-mono text-cyan-300"
                >
                  @{name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
