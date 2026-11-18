import { PredictQuestion, FixBrokenStructureCase, SpeedRoundItem } from '../types/gameModes';

export const PREDICT_QUESTIONS: PredictQuestion[] = [
  {
    id: 'pq_1',
    moduleId: 'minheap',
    question: 'A new node with value 8 is inserted at the end (index 6) of a Min Heap. Its parent at index 2 has value 14. What will happen in the next animation step?',
    contextState: {
      heapArray: [4, 10, 14, 12, 15, 20, 8],
      lastIndex: 6,
      parentIndex: 2
    },
    options: [
      {
        id: 'o1',
        text: 'Node 8 remains at index 6 because it is already a leaf.',
        isCorrect: false,
        explanation: 'Min Heap property requires parent <= children. Since parent (14) > child (8), this violates the heap property.'
      },
      {
        id: 'o2',
        text: 'Bubble up: Swap node 8 at [6] with parent 14 at [2].',
        isCorrect: true,
        explanation: 'Correct! 8 < 14 violates min-heap property. They must swap to bubble the smaller value upward.'
      },
      {
        id: 'o3',
        text: 'Node 8 is immediately moved to index 0, replacing root 4.',
        isCorrect: false,
        explanation: 'Nodes cannot jump directly to root without comparing level by level.'
      }
    ],
    xp: 40
  },
  {
    id: 'pq_2',
    moduleId: 'hashmap',
    question: 'In a 10-bucket HashMap with Separate Chaining, key "banana" (ASCII sum = 609) is being inserted. Which bucket index will be selected?',
    contextState: {
      capacity: 10,
      asciiSum: 609
    },
    options: [
      {
        id: 'o1',
        text: 'Bucket #6',
        isCorrect: false,
        explanation: 'Modulo arithmetic: 609 % 10 = 9, not 6.'
      },
      {
        id: 'o2',
        text: 'Bucket #9',
        isCorrect: true,
        explanation: 'Correct! 609 % 10 = 9. The entry will be placed into bucket array[9].'
      },
      {
        id: 'o3',
        text: 'Bucket #0',
        isCorrect: false,
        explanation: '609 is not a multiple of 10.'
      }
    ],
    xp: 35
  },
  {
    id: 'pq_3',
    moduleId: 'indexheap',
    question: 'In an Index Heap, Item ID 3 is at heap position pq[1], and Item ID 5 is at heap position pq[2]. If pq[1] and pq[2] swap, what must happen to qp?',
    contextState: {
      pos1: 1,
      id1: 3,
      pos2: 2,
      id2: 5
    },
    options: [
      {
        id: 'o1',
        text: 'qp[3] remains 1, qp[5] remains 2.',
        isCorrect: false,
        explanation: 'That would break the fundamental invariant qp[pq[i]] == i.'
      },
      {
        id: 'o2',
        text: 'qp[3] becomes 2, and qp[5] becomes 1.',
        isCorrect: true,
        explanation: 'Spot on! qp maps original IDs to heap positions. Since ID 3 moved to pos 2 and ID 5 moved to pos 1, qp must update accordingly.'
      },
      {
        id: 'o3',
        text: 'Both qp[3] and qp[5] are reset to -1.',
        isCorrect: false,
        explanation: '-1 denotes an item deleted from the heap.'
      }
    ],
    xp: 50
  }
];

export const FIX_STRUCTURE_CASES: FixBrokenStructureCase[] = [
  {
    id: 'fix_minheap_1',
    moduleId: 'minheap',
    title: 'Broken Min Heap: Inverted Parent-Child',
    description: 'The complete binary tree below violates the Min Heap property at index [1] and [3]. Fix the violation by swapping the offending nodes!',
    flawDescription: 'Parent at index [1] has value 30, but its left child at index [3] has value 12 (30 > 12).',
    instructions: 'Click the "Swap [1] & [3]" action to restore min heap order.',
    initialBrokenState: {
      array: [5, 30, 18, 12, 35, 22, 28]
    },
    validationCheck: (state: any) => {
      const arr = state.array;
      for (let i = 0; i < arr.length; i++) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < arr.length && arr[i] > arr[left]) return { valid: false, message: `Parent ${arr[i]} at [${i}] > Left child ${arr[left]} at [${left}]` };
        if (right < arr.length && arr[i] > arr[right]) return { valid: false, message: `Parent ${arr[i]} at [${i}] > Right child ${arr[right]} at [${right}]` };
      }
      return { valid: true, message: 'Valid Min Heap restored! Every parent <= children.' };
    },
    fixActions: [
      { type: 'SWAP', label: 'Swap [1] (30) with [3] (12)', payload: { i: 1, j: 3 } },
      { type: 'SWAP', label: 'Swap [0] (5) with [1] (30)', payload: { i: 0, j: 1 } },
    ]
  },
  {
    id: 'fix_indexheap_1',
    moduleId: 'indexheap',
    title: 'Broken Index Heap Invariant',
    description: 'The inverse array qp[] is desynchronized from pq[]. The invariant qp[pq[i]] == i is currently broken at heap position 1!',
    flawDescription: 'pq[1] = Item ID 4, but qp[4] is incorrectly set to 3 instead of 1.',
    instructions: 'Click the fix action to re-align qp[4] = 1.',
    initialBrokenState: {
      pq: [0, 4, 2],
      qp: [0, -1, 2, -1, 3], // qp[4] is 3 instead of 1!
      keys: [10, null, 25, null, 18]
    },
    validationCheck: (state: any) => {
      for (let i = 0; i < state.pq.length; i++) {
        const id = state.pq[i];
        if (state.qp[id] !== i) {
          return { valid: false, message: `Invariant broken! qp[pq[${i}]] = qp[${id}] = ${state.qp[id]} != ${i}` };
        }
      }
      return { valid: true, message: 'Invariant qp[pq[i]] == i is now 100% VALID for all elements!' };
    },
    fixActions: [
      { type: 'SET_QP', label: 'Set qp[4] = 1 (Align with pq[1])', payload: { id: 4, val: 1 } },
      { type: 'SET_QP', label: 'Set qp[4] = -1', payload: { id: 4, val: -1 } },
    ]
  }
];

export const SPEED_ROUND_QUESTIONS: SpeedRoundItem[] = [
  {
    id: 'sr_1',
    moduleId: 'hashmap',
    prompt: 'What is the average time complexity of HashMap lookup?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIndex: 0,
    timeLimitSec: 8
  },
  {
    id: 'sr_2',
    moduleId: 'minheap',
    prompt: 'In a 0-indexed Min Heap, what is the parent of node at index 6?',
    options: ['Index 2', 'Index 3', 'Index 1', 'Index 5'],
    correctIndex: 0, // floor((6-1)/2) = floor(5/2) = 2
    timeLimitSec: 8
  },
  {
    id: 'sr_3',
    moduleId: 'hashset',
    prompt: 'What does set.add(x) return if x already exists in a HashSet?',
    options: ['false', 'true', 'null', 'undefined'],
    correctIndex: 0,
    timeLimitSec: 8
  },
  {
    id: 'sr_4',
    moduleId: 'indexheap',
    prompt: 'In an Index Heap, which array allows O(1) position lookup by item ID?',
    options: ['qp[]', 'pq[]', 'keys[]', 'values[]'],
    correctIndex: 0,
    timeLimitSec: 8
  },
  {
    id: 'sr_5',
    moduleId: 'minheap',
    prompt: 'Which operation converts an unsorted array into a heap in O(N) time?',
    options: ['Heapify', 'QuickSort', 'Binary Search', 'Linear Sift'],
    correctIndex: 0,
    timeLimitSec: 8
  },
  {
    id: 'sr_6',
    moduleId: 'hashmap',
    prompt: 'Which collision resolution stores multiple elements in linked lists per bucket?',
    options: ['Separate Chaining', 'Linear Probing', 'Double Hashing', 'Quadratic Probing'],
    correctIndex: 0,
    timeLimitSec: 8
  }
];
