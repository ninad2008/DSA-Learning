import React, { useState } from 'react';
import { Activity, Plus, ArrowUpRight, CheckCircle2, UserCheck, HeartPulse } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';
import { useUser } from '../../state/userContext';

interface Patient {
  id: number;
  name: string;
  condition: string;
  priority: number; // 1 = Critical, 5 = Mild
}

export const IndexHeapHospitalER: React.FC = () => {
  const { awardXp, completeLevel } = useUser();

  // Three parallel structures of Index Heap:
  // pq: heap pos -> patient id
  // qp: patient id -> heap pos
  // keys: patient id -> priority
  const [pq, setPq] = useState<number[]>([1, 0, 2]);
  const [qp, setQp] = useState<number[]>([1, 0, 2, -1, -1, -1]);
  const [keys, setKeys] = useState<(number | null)[]>([3, 1, 4, null, null, null]);

  const [patients, setPatients] = useState<Record<number, Patient>>({
    0: { id: 0, name: 'Alice Walker', condition: 'Severe Asthma', priority: 3 },
    1: { id: 1, name: 'Bob Roberts', condition: 'Cardiac Arrest', priority: 1 },
    2: { id: 2, name: 'Charlie Green', condition: 'Fractured Arm', priority: 4 },
  });

  const [triageId, setTriageId] = useState<number>(2);
  const [newPriority, setNewPriority] = useState<number>(1);
  const [treatedLog, setTreatedLog] = useState<Patient[]>([]);

  // Swap helper that updates both pq and qp
  const swap = (curPq: number[], curQp: number[], i: number, j: number) => {
    const t = curPq[i];
    curPq[i] = curPq[j];
    curPq[j] = t;
    curQp[curPq[i]] = i;
    curQp[curPq[j]] = j;
  };

  // Change key operation
  const handleChangePriority = () => {
    sounds.playClick();
    const id = Number(triageId);
    const heapPos = qp[id];
    if (heapPos === -1) {
      alert('Patient not in triage queue.');
      return;
    }

    const nextKeys = [...keys];
    nextKeys[id] = Number(newPriority);
    setKeys(nextKeys);

    setPatients(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        priority: Number(newPriority),
        condition: Number(newPriority) === 1 ? 'CRITICAL - Heart Event' : prev[id].condition
      }
    }));

    // Swim up in pq
    const nextPq = [...pq];
    const nextQp = [...qp];
    let k = heapPos;

    while (k > 0) {
      const parent = Math.floor((k - 1) / 2);
      if ((nextKeys[nextPq[k]] ?? Infinity) < (nextKeys[nextPq[parent]] ?? Infinity)) {
        swap(nextPq, nextQp, k, parent);
        k = parent;
      } else {
        break;
      }
    }

    setPq(nextPq);
    setQp(nextQp);
    sounds.playSuccess();
    awardXp(50, 'ER Dynamic Priority Updated via Index Heap');
    completeLevel('indexheap', 'project');
  };

  // Call Next Patient
  const handleCallNext = () => {
    if (pq.length === 0) return;
    sounds.playSuccess();
    const minPatientId = pq[0];
    const patient = patients[minPatientId];

    const nextPq = [...pq];
    const nextQp = [...qp];
    const nextKeys = [...keys];

    // Swap root with last
    const lastPos = nextPq.length - 1;
    swap(nextPq, nextQp, 0, lastPos);

    // Pop min
    nextPq.pop();
    nextQp[minPatientId] = -1;
    nextKeys[minPatientId] = null;

    // Sink down
    let cur = 0;
    const n = nextPq.length;
    while (cur < n) {
      const left = 2 * cur + 1;
      const right = 2 * cur + 2;
      let smallest = cur;

      if (left < n && (nextKeys[nextPq[left]] ?? Infinity) < (nextKeys[nextPq[smallest]] ?? Infinity)) {
        smallest = left;
      }
      if (right < n && (nextKeys[nextPq[right]] ?? Infinity) < (nextKeys[nextPq[smallest]] ?? Infinity)) {
        smallest = right;
      }

      if (smallest !== cur) {
        swap(nextPq, nextQp, cur, smallest);
        cur = smallest;
      } else {
        break;
      }
    }

    setPq(nextPq);
    setQp(nextQp);
    setKeys(nextKeys);
    setTreatedLog(prev => [patient, ...prev]);
    awardXp(40, 'Patient admitted to surgery');
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Mini-Project: Hospital ER Triage (Index Heap)</h3>
          <p className="text-xs text-slate-400">Dynamically update a waiting patient's urgency priority in O(log N) using the qp inverse array!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Dynamic Change Priority Control */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block">
              Emergency Condition Update: changeKey(patientId, newPriority)
            </span>
            <p className="text-[11px] text-slate-400">
              When a patient's vital signs deteriorate, the doctor updates priority from 4 to 1. Index Heap immediately jumps to their heap position via qp[id] in O(1) and bubbles them to the front in O(log N)!
            </p>

            <div>
              <label className="text-[10px] text-slate-400">Patient in Waiting Room</label>
              <select
                value={triageId}
                onChange={(e) => setTriageId(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {pq.map(id => (
                  <option key={id} value={id}>
                    Patient #{id}: {patients[id]?.name} (Priority {keys[id]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400">New Triage Urgency Level</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value={1}>1 - CRITICAL RESUSCITATION (Highest Priority)</option>
                <option value={2}>2 - EMERGENCY</option>
                <option value={3}>3 - URGENT</option>
                <option value={4}>4 - SEMI-URGENT</option>
                <option value={5}>5 - NON-URGENT</option>
              </select>
            </div>

            <button
              onClick={handleChangePriority}
              disabled={pq.length === 0}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 disabled:opacity-40"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Update Urgency (O(log N) Swim)</span>
            </button>
          </div>

          <button
            onClick={handleCallNext}
            disabled={pq.length === 0}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-40"
          >
            <UserCheck className="w-4 h-4" />
            <span>Admit Highest Priority Patient to Trauma Bay</span>
          </button>
        </div>

        {/* Right: Hospital Waiting Room Priority Queue */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-3 font-semibold text-slate-300">
              <span>Active ER Triage Queue ({pq.length} Patients in Index Min Heap Order)</span>
              <span className="text-[11px] font-mono text-emerald-400">Root pq[0] = Top Urgency</span>
            </div>

            <div className="space-y-2">
              {pq.length === 0 ? (
                <span className="text-xs text-slate-600 italic">No patients in ER queue.</span>
              ) : (
                pq.map((id, pos) => {
                  const p = patients[id];
                  const prio = keys[id];
                  return (
                    <div
                      key={id}
                      className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                        pos === 0
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-md shadow-emerald-500/10'
                          : 'border-slate-800 bg-slate-900 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 text-[11px]">#{pos}</span>
                        <div>
                          <strong className="text-slate-100">{p?.name}</strong>
                          <span className="text-slate-400 text-[11px] block">{p?.condition} (ID:{id})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">qp[{id}]={pos}</span>
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          prio === 1 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-emerald-300'
                        }`}>
                          Urgency {prio} {pos === 0 && '⚡ Next in Line'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Treated log */}
          {treatedLog.length > 0 && (
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold block mb-1.5">Recently Admitted to Surgery:</span>
              <div className="flex flex-wrap gap-2">
                {treatedLog.map((t, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono text-[11px]">
                    ✓ {t.name} (Treated)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

