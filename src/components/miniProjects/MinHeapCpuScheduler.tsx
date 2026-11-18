import React, { useState } from 'react';
import { Cpu, Play, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../sound/soundEffects';
import { useUser } from '../../state/userContext';

interface CpuTask {
  pid: number;
  name: string;
  priority: number; // lower number = higher priority
}

export const MinHeapCpuScheduler: React.FC = () => {
  const { awardXp, completeLevel } = useUser();
  const [taskQueue, setTaskQueue] = useState<CpuTask[]>([
    { pid: 101, name: 'Render UI Thread', priority: 1 },
    { pid: 102, name: 'Disk I/O Write', priority: 3 },
    { pid: 103, name: 'Network Sync', priority: 5 },
    { pid: 104, name: 'Garbage Collection', priority: 8 },
  ]);

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<number>(2);
  const [executedTasks, setExecutedTasks] = useState<CpuTask[]>([]);
  const [currentExecuting, setCurrentExecuting] = useState<CpuTask | null>(null);

  // Min Heap bubble up helper
  const bubbleUp = (queue: CpuTask[]) => {
    let curr = queue.length - 1;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);
      if (queue[curr].priority < queue[parent].priority) {
        const temp = queue[curr];
        queue[curr] = queue[parent];
        queue[parent] = temp;
        curr = parent;
      } else {
        break;
      }
    }
    return [...queue];
  };

  // Min Heap bubble down helper
  const bubbleDown = (queue: CpuTask[]) => {
    let curr = 0;
    const n = queue.length;
    while (curr < n) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let smallest = curr;

      if (left < n && queue[left].priority < queue[smallest].priority) smallest = left;
      if (right < n && queue[right].priority < queue[smallest].priority) smallest = right;

      if (smallest !== curr) {
        const temp = queue[curr];
        queue[curr] = queue[smallest];
        queue[smallest] = temp;
        curr = smallest;
      } else {
        break;
      }
    }
    return [...queue];
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    sounds.playClick();
    const task: CpuTask = {
      pid: Math.floor(Math.random() * 800 + 200),
      name: newTaskName.trim(),
      priority: Number(newTaskPriority),
    };

    const nextQueue = bubbleUp([...taskQueue, task]);
    setTaskQueue(nextQueue);
    setNewTaskName('');
    awardXp(25, 'Scheduled CPU Task');
    completeLevel('minheap', 'project');
  };

  const handleExecuteNext = () => {
    if (taskQueue.length === 0) return;
    sounds.playSuccess();
    const highestPriorityTask = taskQueue[0];
    setCurrentExecuting(highestPriorityTask);

    const remaining = [...taskQueue];
    const last = remaining.pop()!;
    if (remaining.length > 0) {
      remaining[0] = last;
      const settled = bubbleDown(remaining);
      setTaskQueue(settled);
    } else {
      setTaskQueue([]);
    }

    setExecutedTasks(prev => [highestPriorityTask, ...prev].slice(0, 5));
    awardXp(35, 'Dispatched CPU process');
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl bg-slate-900/90 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">Mini-Project: Operating System CPU Task Scheduler</h3>
          <p className="text-xs text-slate-400">Min Heap priority queue dispatches highest-urgency tasks in O(1) peek and O(log N) extraction.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Schedule New Task */}
        <div className="md:col-span-5 space-y-4">
          <form onSubmit={handleAddTask} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block">Spawn New CPU Process</span>
            <div>
              <label className="text-[10px] text-slate-400">Process Name</label>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="e.g. Video Decoder"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400">Urgency Priority (1 = Critical, 10 = Idle)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enqueue Task (Bubble Up)</span>
            </button>
          </form>

          {/* Dispatch Button */}
          <button
            onClick={handleExecuteNext}
            disabled={taskQueue.length === 0}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Dispatch Next Priority Task (Extract-Min)</span>
          </button>
        </div>

        {/* Right: Heap Queue Visualization & Running CPU */}
        <div className="md:col-span-7 space-y-4">
          {/* Active Process Execution Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">CPU Core State</span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  {currentExecuting ? `Executing: ${currentExecuting.name} (PID: ${currentExecuting.pid})` : 'CPU Idle — Waiting for priority tasks'}
                </span>
              </div>
            </div>
            {currentExecuting && (
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                Priority {currentExecuting.priority}
              </span>
            )}
          </div>

          {/* Priority Queue (Heap Order) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-3 font-semibold text-slate-300">
              <span>Ready Task Queue ({taskQueue.length} Processes in Min Heap Order)</span>
              <span className="text-[11px] font-mono text-blue-400">Root = Heap[0]</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {taskQueue.length === 0 ? (
                <span className="text-xs text-slate-600 italic">No tasks queued.</span>
              ) : (
                taskQueue.map((t, idx) => (
                  <div
                    key={t.pid}
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      idx === 0
                        ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-md shadow-emerald-500/10'
                        : 'border-slate-800 bg-slate-900 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-[11px]">#{idx}</span>
                      <span className="font-bold">{t.name}</span>
                      <span className="text-slate-400 text-[10px]">PID:{t.pid}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      idx === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-blue-300'
                    }`}>
                      Priority {t.priority} {idx === 0 && '⚡ Next'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
