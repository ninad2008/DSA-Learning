import React, { useState } from 'react';
import { Plus, Search, Trash2, GraduationCap, BarChart2, Sparkles } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';
import { useUser } from '../../state/userContext';

interface StudentRecord {
  id: string;
  name: string;
  grade: number;
}

export const HashMapMarksTracker: React.FC = () => {
  const { awardXp, completeLevel } = useUser();
  const [map, setMap] = useState<Record<string, StudentRecord>>({
    'STU101': { id: 'STU101', name: 'Alice Chen', grade: 94 },
    'STU102': { id: 'STU102', name: 'Bob Smith', grade: 82 },
    'STU103': { id: 'STU103', name: 'Charlie Kim', grade: 94 },
    'STU104': { id: 'STU104', name: 'Diana Prince', grade: 78 },
  });

  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<StudentRecord | null | 'NOT_FOUND'>(null);

  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState<number>(88);

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newName.trim()) return;
    sounds.playClick();
    setMap(prev => ({
      ...prev,
      [newId.trim().toUpperCase()]: {
        id: newId.trim().toUpperCase(),
        name: newName.trim(),
        grade: Number(newGrade),
      }
    }));
    setNewId('');
    setNewName('');
    awardXp(30, 'Added student record');
    completeLevel('hashmap', 'project');
  };

  const handleSearch = () => {
    sounds.playClick();
    const query = searchId.trim().toUpperCase();
    if (map[query]) {
      setSearchResult(map[query]);
      sounds.playSuccess();
    } else {
      setSearchResult('NOT_FOUND');
      sounds.playError();
    }
  };

  const handleDelete = (id: string) => {
    sounds.playClick();
    setMap(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (searchResult !== 'NOT_FOUND' && searchResult?.id === id) {
      setSearchResult(null);
    }
  };

  // Grade frequency calculation
  const gradeFrequency: Record<number, number> = {};
  Object.values(map).forEach(s => {
    gradeFrequency[s.grade] = (gradeFrequency[s.grade] || 0) + 1;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Mini-Project: Student Marks & Frequency Tracker</h3>
          <p className="text-xs text-slate-400">Uses an associative HashMap for O(1) student ID indexing and grade frequency distribution analytics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Form: Add Student & Search */}
        <div className="md:col-span-5 space-y-4">
          {/* Add Student Form */}
          <form onSubmit={handleInsert} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block">Add / Update Student Record</span>
            <div>
              <label className="text-[10px] text-slate-400">Student ID (Key)</label>
              <input
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="e.g. STU105"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Student Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Evan Wright"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Grade (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newGrade}
                onChange={(e) => setNewGrade(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Record (O(1) Map Put)</span>
            </button>
          </form>

          {/* Search by Key */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-200 block">O(1) Direct Lookup by Key</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Student ID"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>

            {searchResult && searchResult !== 'NOT_FOUND' && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono text-emerald-200 mt-2">
                ✓ Found: <strong>{searchResult.name}</strong> (Grade: {searchResult.grade}/100)
              </div>
            )}
            {searchResult === 'NOT_FOUND' && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs font-mono text-rose-200 mt-2">
                ✗ Student ID "{searchId}" not found in map.
              </div>
            )}
          </div>
        </div>

        {/* Right: Map Records Table + Grade Frequency Histogram */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-3 font-semibold text-slate-300">
              <span>HashMap Records ({Object.keys(map).length} Entries)</span>
              <span className="text-[11px] font-mono text-purple-400">Key: StudentID</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {Object.values(map).map((stu) => (
                <div
                  key={stu.id}
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-mono flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-cyan-300">{stu.id}</span>
                    <span className="text-slate-200">{stu.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                      Score: {stu.grade}
                    </span>
                    <button
                      onClick={() => handleDelete(stu.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Frequency Map Analytics */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
              <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
              Real-time Grade Frequency Distribution:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(gradeFrequency).map(([grade, count]) => (
                <div
                  key={grade}
                  className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-xs font-mono flex flex-col items-center min-w-[55px]"
                >
                  <span className="text-slate-400 text-[10px]">Grade {grade}</span>
                  <span className="text-sm font-bold text-cyan-300">{count}x</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
