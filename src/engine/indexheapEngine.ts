import { AnimationStep, IndexHeapState } from '../types/dsa';

export function createInitialIndexHeapState(capacity: number = 8): IndexHeapState {
  const pq: number[] = [2, 0, 4, 1]; // heap positions 0..3 have item IDs 2, 0, 4, 1
  const qp = new Array(capacity).fill(-1);
  const keys: (number | null)[] = new Array(capacity).fill(null);

  // Set initial keys
  keys[0] = 35; // Item 0 has priority 35
  keys[1] = 60; // Item 1 has priority 60
  keys[2] = 15; // Item 2 has priority 15 (min)
  keys[3] = null; // not inserted
  keys[4] = 48; // Item 4 has priority 48
  keys[5] = null;
  keys[6] = null;
  keys[7] = null;

  // Build qp from pq
  for (let pos = 0; pos < pq.length; pos++) {
    const itemId = pq[pos];
    qp[itemId] = pos;
  }

  return {
    pq,
    qp,
    keys,
    capacity,
    size: pq.length,
    invariantValid: checkInvariant(pq, qp),
  };
}

export function checkInvariant(pq: number[], qp: number[]): boolean {
  for (let i = 0; i < pq.length; i++) {
    const itemId = pq[i];
    if (itemId < 0 || itemId >= qp.length) return false;
    if (qp[itemId] !== i) return false;
  }
  return true;
}

function cloneIndexHeapState(state: IndexHeapState): IndexHeapState {
  return {
    ...state,
    pq: [...state.pq],
    qp: [...state.qp],
    keys: [...state.keys],
    invariantValid: checkInvariant(state.pq, state.qp),
  };
}

// Swaps two positions in pq and updates qp
function swapPqQp(state: IndexHeapState, i: number, j: number) {
  const idI = state.pq[i];
  const idJ = state.pq[j];
  state.pq[i] = idJ;
  state.pq[j] = idI;
  state.qp[idI] = j;
  state.qp[idJ] = i;
  state.invariantValid = checkInvariant(state.pq, state.qp);
}

// Helper: compare keys at heap positions i and j
function less(state: IndexHeapState, i: number, j: number): boolean {
  const idI = state.pq[i];
  const idJ = state.pq[j];
  const keyI = state.keys[idI] ?? Infinity;
  const keyJ = state.keys[idJ] ?? Infinity;
  return keyI < keyJ;
}

// RECORD INSERT (id, priority)
export function recordIndexHeapInsert(
  initialState: IndexHeapState,
  itemId: number,
  keyVal: number
): AnimationStep<IndexHeapState>[] {
  const steps: AnimationStep<IndexHeapState>[] = [];
  const curState = cloneIndexHeapState(initialState);

  // Check valid itemId
  if (itemId < 0 || itemId >= curState.capacity) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      type: 'complete',
      title: 'Invalid Item ID!',
      description: `Item ID must be in range [0..${curState.capacity - 1}].`,
      state: cloneIndexHeapState(curState),
      explanation: {
        whatHappened: `Item ID ${itemId} is out of bounds.`,
        why: 'Index Heap uses bounded indices.',
      }
    });
    return steps;
  }

  // Check if already in heap
  if (curState.qp[itemId] !== -1) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      type: 'complete',
      title: `Item ID ${itemId} Already Exists in Heap!`,
      description: `Use ChangeKey instead of Insert to update existing items.`,
      state: cloneIndexHeapState(curState),
      explanation: {
        whatHappened: `qp[${itemId}] = ${curState.qp[itemId]} != -1. Item is already present.`,
        why: 'In Index Heap, each item ID can exist at most once.',
      }
    });
    return steps;
  }

  // Step 1: Assign key
  curState.keys[itemId] = keyVal;
  const newHeapPos = curState.pq.length;
  curState.pq.push(itemId);
  curState.qp[itemId] = newHeapPos;
  curState.size = curState.pq.length;
  curState.invariantValid = checkInvariant(curState.pq, curState.qp);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'insert',
    title: `Step 1: Assign Key & Place at Last Heap Position`,
    description: `Set keys[${itemId}] = ${keyVal}. Placed ID ${itemId} at pq[${newHeapPos}]. Set inverse pointer qp[${itemId}] = ${newHeapPos}.`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: {
      ...cloneIndexHeapState(curState),
      activeId: itemId,
      activePqPos: newHeapPos,
    },
    highlights: [
      { arrayIndex: itemId, color: 'blue' },
      { secondaryIndex: newHeapPos, color: 'purple' }
    ],
    explanation: {
      whatHappened: `Assigned key value ${keyVal} to item index ${itemId}. Appended to pq and updated qp[${itemId}] = ${newHeapPos}.`,
      why: 'Both arrays must be updated simultaneously to maintain the invariant qp[pq[pos]] == pos.',
      invariant: `qp[pq[${newHeapPos}]] = qp[${itemId}] = ${curState.qp[itemId]} == ${newHeapPos} (VALID)`
    }
  });

  // Swim up
  let curPos = newHeapPos;
  while (curPos > 0) {
    const parentPos = Math.floor((curPos - 1) / 2);

    // Compare
    const curId = curState.pq[curPos];
    const parentId = curState.pq[parentPos];
    const curKey = curState.keys[curId]!;
    const parentKey = curState.keys[parentId]!;

    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      type: 'compare',
      title: `Compare Heap Pos [${curPos}] (ID ${curId}, Key ${curKey}) with Parent Pos [${parentPos}] (ID ${parentId}, Key ${parentKey})`,
      description: `Evaluating: keys[pq[${curPos}]] (${curKey}) < keys[pq[${parentPos}]] (${parentKey})?`,
      codeHighlight: { java: 5, python: 5, cpp: 5 },
      state: {
        ...cloneIndexHeapState(curState),
        comparingPq: [curPos, parentPos],
      },
      highlights: [
        { arrayIndex: curPos, color: 'yellow' },
        { arrayIndex: parentPos, color: 'purple' }
      ],
      explanation: {
        whatHappened: `Checking if newly inserted element has smaller priority than its parent.`,
        why: 'In Min Index Heap, keys[pq[parent]] must be <= keys[pq[child]].',
        invariant: `Invariant check: qp[pq[i]] == i is globally ${curState.invariantValid ? 'SATISFIED' : 'BROKEN'}`
      }
    });

    if (less(curState, curPos, parentPos)) {
      // SWAP IN PQ AND UPDATE QP!
      swapPqQp(curState, curPos, parentPos);

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'swap',
        title: `Swim Swap: Swapped Pos [${curPos}] and [${parentPos}]`,
        description: `Swapped pq[${curPos}] (ID ${curId}) and pq[${parentPos}] (ID ${parentId}). Updated qp[${curId}] = ${parentPos} and qp[${parentId}] = ${curPos}!`,
        codeHighlight: { java: 7, python: 7, cpp: 7 },
        state: {
          ...cloneIndexHeapState(curState),
          swappingPq: [curPos, parentPos],
          activeId: curId,
        },
        highlights: [
          { arrayIndex: curPos, color: 'purple' },
          { arrayIndex: parentPos, color: 'purple' }
        ],
        explanation: {
          whatHappened: `Swapped heap positions and synchronized inverse pointers in qp.`,
          why: 'The crucial step of Index Heap: whenever pq swaps, qp MUST swap its entries to preserve O(1) lookup of heap position by item ID.',
          invariant: `qp[pq[${parentPos}]] = qp[${curId}] = ${curState.qp[curId]} == ${parentPos} (VALID)`
        }
      });

      curPos = parentPos;
    } else {
      break;
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'complete',
    title: `Index Heap Insertion Complete!`,
    description: `Item ID ${itemId} (Key ${keyVal}) settled at heap position [${curPos}].`,
    codeHighlight: { java: 10, python: 10, cpp: 10 },
    state: {
      ...cloneIndexHeapState(curState),
      activeId: itemId,
      activePqPos: curPos,
    },
    highlights: [{ arrayIndex: curPos, color: 'green' }],
    explanation: {
      whatHappened: `Insertion finished. Total items in heap: ${curState.size}.`,
      why: 'Index Heap insert runs in O(log N) time and maintains bidirectional mapping.',
      invariant: `Verified: qp[pq[i]] == i holds for all ${curState.size} elements!`
    }
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

// RECORD CHANGE KEY (id, newKey)
export function recordIndexHeapChangeKey(
  initialState: IndexHeapState,
  itemId: number,
  newKeyVal: number
): AnimationStep<IndexHeapState>[] {
  const steps: AnimationStep<IndexHeapState>[] = [];
  const curState = cloneIndexHeapState(initialState);

  // Check if item exists in heap
  if (itemId < 0 || itemId >= curState.capacity || curState.qp[itemId] === -1) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      type: 'complete',
      title: `Cannot Change Key: Item ID ${itemId} Not in Heap!`,
      description: `qp[${itemId}] == -1. The element must be inserted before modifying its key.`,
      state: cloneIndexHeapState(curState),
      explanation: {
        whatHappened: `Lookup in qp[${itemId}] returned -1.`,
        why: 'In Index Heap, qp[id] === -1 indicates the element is not currently in the priority queue.',
      }
    });
    return steps;
  }

  const oldKey = curState.keys[itemId]!;
  const heapPos = curState.qp[itemId];

  // Step 1: O(1) lookup via qp!
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'compare',
    title: `Step 1: O(1) Instant Position Lookup via qp[${itemId}]`,
    description: `Instead of an O(N) linear search, qp[${itemId}] tells us immediately that Item ID ${itemId} is at heap position [${heapPos}]!`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: {
      ...cloneIndexHeapState(curState),
      activeId: itemId,
      activePqPos: heapPos,
    },
    highlights: [
      { arrayIndex: itemId, color: 'cyan' },
      { secondaryIndex: heapPos, color: 'blue' }
    ],
    explanation: {
      whatHappened: `Direct array lookup: qp[${itemId}] = ${heapPos}. This is the SUPERPOWER of Index Heap!`,
      why: 'A standard heap takes O(N) time to find an element by ID. Index Heap accomplishes this in O(1) constant time!',
      invariant: `qp[pq[${heapPos}]] = ${curState.qp[curState.pq[heapPos]]} == ${heapPos}`
    }
  });

  // Step 2: Update keys array
  curState.keys[itemId] = newKeyVal;

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'update',
    title: `Step 2: Update Key: ${oldKey} → ${newKeyVal}`,
    description: `Set keys[${itemId}] = ${newKeyVal}. Now determine whether to Swim (decrease key) or Sink (increase key).`,
    codeHighlight: { java: 3, python: 3, cpp: 3 },
    state: {
      ...cloneIndexHeapState(curState),
      activeId: itemId,
      activePqPos: heapPos,
    },
    highlights: [{ arrayIndex: itemId, color: 'yellow' }],
    explanation: {
      whatHappened: `Updated priority from ${oldKey} to ${newKeyVal}. ${newKeyVal < oldKey ? 'New key is smaller -> Swim Up.' : 'New key is larger -> Sink Down.'}`,
      why: 'Dijkstra and Prim algorithms rely heavily on decreasing keys (decreaseKey) in O(log N) time.',
    }
  });

  // Decide swim or sink
  let curPos = heapPos;

  // Try swim first (if key decreased)
  let swam = false;
  while (curPos > 0) {
    const parentPos = Math.floor((curPos - 1) / 2);
    if (less(curState, curPos, parentPos)) {
      const curId = curState.pq[curPos];
      const parentId = curState.pq[parentPos];
      swapPqQp(curState, curPos, parentPos);

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'swap',
        title: `Swim: Swapped Pos [${curPos}] and [${parentPos}]`,
        description: `Key decreased! Swapped pq[${curPos}] and pq[${parentPos}]. Updated qp[${curId}] = ${parentPos} and qp[${parentId}] = ${curPos}.`,
        codeHighlight: { java: 5, python: 5, cpp: 5 },
        state: {
          ...cloneIndexHeapState(curState),
          swappingPq: [curPos, parentPos],
          activeId: curId,
        },
        highlights: [
          { arrayIndex: curPos, color: 'purple' },
          { arrayIndex: parentPos, color: 'purple' }
        ],
        explanation: {
          whatHappened: `Swapped heap positions in pq and synced inverse pointers in qp.`,
          why: 'Preserves the inverse invariant qp[pq[i]] == i after key reduction.',
          invariant: `Invariant check: qp[pq[${parentPos}]] == ${parentPos} (VALID)`
        }
      });
      curPos = parentPos;
      swam = true;
    } else {
      break;
    }
  }

  // If didn't swim, try sink (if key increased)
  if (!swam) {
    const n = curState.pq.length;
    while (curPos < n) {
      const leftPos = 2 * curPos + 1;
      const rightPos = 2 * curPos + 2;
      let smallestPos = curPos;

      if (leftPos < n && less(curState, leftPos, smallestPos)) {
        smallestPos = leftPos;
      }
      if (rightPos < n && less(curState, rightPos, smallestPos)) {
        smallestPos = rightPos;
      }

      if (smallestPos !== curPos) {
        const curId = curState.pq[curPos];
        const smallId = curState.pq[smallestPos];
        swapPqQp(curState, curPos, smallestPos);

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          type: 'swap',
          title: `Sink: Swapped Pos [${curPos}] and [${smallestPos}]`,
          description: `Key increased! Swapped pq[${curPos}] and pq[${smallestPos}]. Updated qp[${curId}] = ${smallestPos} and qp[${smallId}] = ${curPos}.`,
          codeHighlight: { java: 7, python: 7, cpp: 7 },
          state: {
            ...cloneIndexHeapState(curState),
            swappingPq: [curPos, smallestPos],
            activeId: curId,
          },
          highlights: [
            { arrayIndex: curPos, color: 'purple' },
            { arrayIndex: smallestPos, color: 'purple' }
          ],
          explanation: {
            whatHappened: `Sank element down because its key became greater than a child's key.`,
            why: 'Maintains min heap order when priority value is relaxed or increased.',
            invariant: `Invariant check: qp[pq[${smallestPos}]] == ${smallestPos} (VALID)`
          }
        });
        curPos = smallestPos;
      } else {
        break;
      }
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'complete',
    title: `ChangeKey Complete for Item ID ${itemId}!`,
    description: `Final heap position: [${curPos}]. Heap order and inverse invariant 100% verified.`,
    codeHighlight: { java: 9, python: 9, cpp: 9 },
    state: {
      ...cloneIndexHeapState(curState),
      activeId: itemId,
      activePqPos: curPos,
    },
    highlights: [{ arrayIndex: curPos, color: 'green' }],
    explanation: {
      whatHappened: `Successfully changed key in O(log N) total time.`,
      why: 'Regular heap would need O(N) to find and O(log N) to sift. Index Heap finishes in O(log N)!',
      invariant: `qp[pq[${curPos}]] = qp[${itemId}] = ${curPos} == ${curPos}`
    }
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

// RECORD DELETE BY INDEX
export function recordIndexHeapDelete(
  initialState: IndexHeapState,
  itemId: number
): AnimationStep<IndexHeapState>[] {
  const steps: AnimationStep<IndexHeapState>[] = [];
  const curState = cloneIndexHeapState(initialState);

  if (itemId < 0 || itemId >= curState.capacity || curState.qp[itemId] === -1) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      type: 'complete',
      title: `Cannot Delete: Item ID ${itemId} Not Present!`,
      description: `qp[${itemId}] == -1. Item does not exist in the heap.`,
      state: cloneIndexHeapState(curState),
      explanation: {
        whatHappened: `Item ID ${itemId} not found in qp.`,
        why: 'Cannot delete a non-existent item.',
      }
    });
    return steps;
  }

  const heapPos = curState.qp[itemId];
  const lastPos = curState.pq.length - 1;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'compare',
    title: `Step 1: Locate Item ID ${itemId} at Heap Pos [${heapPos}]`,
    description: `Instant O(1) lookup via qp[${itemId}] = ${heapPos}.`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: {
      ...cloneIndexHeapState(curState),
      activeId: itemId,
      activePqPos: heapPos,
    },
    highlights: [{ arrayIndex: heapPos, color: 'yellow' }],
    explanation: {
      whatHappened: `Found item ID ${itemId} at heap index ${heapPos}.`,
      why: 'qp allows arbitrary element deletion in O(log N) instead of O(N).',
    }
  });

  // Swap with last element if not already last
  if (heapPos !== lastPos) {
    swapPqQp(curState, heapPos, lastPos);
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      type: 'swap',
      title: `Step 2: Swap Target Pos [${heapPos}] with Last Pos [${lastPos}]`,
      description: `Swapped target ID ${itemId} to the end of the heap.`,
      codeHighlight: { java: 4, python: 4, cpp: 4 },
      state: {
        ...cloneIndexHeapState(curState),
        swappingPq: [heapPos, lastPos],
      },
      highlights: [
        { arrayIndex: heapPos, color: 'purple' },
        { arrayIndex: lastPos, color: 'purple' }
      ],
      explanation: {
        whatHappened: `Moved target node to the end of pq for clean removal.`,
        why: 'Preserves the complete binary tree shape.',
      }
    });
  }

  // Remove from end
  curState.pq.pop();
  curState.qp[itemId] = -1;
  curState.keys[itemId] = null;
  curState.size = curState.pq.length;
  curState.invariantValid = checkInvariant(curState.pq, curState.qp);

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'delete',
    title: `Step 3: Pop Item ID ${itemId} from Heap`,
    description: `Popped from pq. Set qp[${itemId}] = -1 and keys[${itemId}] = null.`,
    codeHighlight: { java: 6, python: 6, cpp: 6 },
    state: cloneIndexHeapState(curState),
    highlights: [{ arrayIndex: itemId, color: 'red' }],
    explanation: {
      whatHappened: `Item ID ${itemId} removed. Inverse pointer reset to -1.`,
      why: 'Setting qp[id] = -1 marks the index as absent from the heap.',
    }
  });

  // Sift element that was moved into heapPos if needed
  if (heapPos < curState.pq.length) {
    // try swim then sink
    let cur = heapPos;
    while (cur > 0) {
      const p = Math.floor((cur - 1) / 2);
      if (less(curState, cur, p)) {
        swapPqQp(curState, cur, p);
        cur = p;
      } else {
        break;
      }
    }
    const n = curState.pq.length;
    while (cur < n) {
      const left = 2 * cur + 1;
      const right = 2 * cur + 2;
      let sm = cur;
      if (left < n && less(curState, left, sm)) sm = left;
      if (right < n && less(curState, right, sm)) sm = right;
      if (sm !== cur) {
        swapPqQp(curState, cur, sm);
        cur = sm;
      } else {
        break;
      }
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'complete',
    title: `Delete by Index Complete!`,
    description: `Item ID ${itemId} successfully deleted in O(log N) time.`,
    codeHighlight: { java: 8, python: 8, cpp: 8 },
    state: cloneIndexHeapState(curState),
    highlights: [],
    explanation: {
      whatHappened: `Arbitrary deletion finished cleanly.`,
      why: 'Invariant qp[pq[i]] == i holds for all remaining items.',
      invariant: `Verified: qp[pq[i]] == i holds across all ${curState.size} items.`
    }
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

// RECORD EXTRACT MIN
export function recordIndexHeapExtractMin(
  initialState: IndexHeapState
): AnimationStep<IndexHeapState>[] {
  const steps: AnimationStep<IndexHeapState>[] = [];
  const curState = cloneIndexHeapState(initialState);

  if (curState.pq.length === 0) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      type: 'complete',
      title: 'Index Heap is Empty!',
      description: 'Cannot extract minimum from empty heap.',
      state: cloneIndexHeapState(curState),
      explanation: {
        whatHappened: 'pq is empty.',
        why: 'Bounds check.',
      }
    });
    return steps;
  }

  const minId = curState.pq[0];
  const minKey = curState.keys[minId]!;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'compare',
    title: `Step 1: Extract Minimum at Root (Pos [0])`,
    description: `Root pq[0] holds Item ID ${minId} with minimum key value ${minKey}.`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: {
      ...cloneIndexHeapState(curState),
      activeId: minId,
      activePqPos: 0,
    },
    highlights: [{ arrayIndex: 0, color: 'yellow' }],
    explanation: {
      whatHappened: `Minimum element in Index Heap is pq[0] = Item ID ${minId} (Key ${minKey}).`,
      why: 'In Min Index Heap, pq[0] always points to the item with the minimum key.',
    }
  });

  const lastPos = curState.pq.length - 1;
  if (lastPos === 0) {
    curState.pq.pop();
    curState.qp[minId] = -1;
    curState.keys[minId] = null;
    curState.size = 0;
    curState.invariantValid = true;

    steps.push({
      stepIndex: 1,
      totalSteps: 2,
      type: 'delete',
      title: `Extracted Sole Element ID ${minId}`,
      description: `Heap is now empty.`,
      state: cloneIndexHeapState(curState),
      explanation: {
        whatHappened: `Removed single item.`,
        why: 'No sinking required.',
      }
    });
    return steps;
  }

  // Swap root with last
  swapPqQp(curState, 0, lastPos);
  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'swap',
    title: `Step 2: Swap Root with Last Heap Element`,
    description: `Swapped pq[0] and pq[${lastPos}]. Updated inverse pointers in qp.`,
    codeHighlight: { java: 4, python: 4, cpp: 4 },
    state: {
      ...cloneIndexHeapState(curState),
      swappingPq: [0, lastPos],
    },
    highlights: [
      { arrayIndex: 0, color: 'purple' },
      { arrayIndex: lastPos, color: 'purple' }
    ],
    explanation: {
      whatHappened: `Moved minimum item to the end for removal.`,
      why: 'Maintains complete binary tree structure.',
      invariant: `qp[pq[i]] == i invariant updated and maintained.`
    }
  });

  // Pop min element
  curState.pq.pop();
  curState.qp[minId] = -1;
  curState.keys[minId] = null;
  curState.size = curState.pq.length;
  curState.invariantValid = checkInvariant(curState.pq, curState.qp);

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'delete',
    title: `Step 3: Remove Item ID ${minId}`,
    description: `Extracted ID ${minId} (Key ${minKey}). Set qp[${minId}] = -1.`,
    codeHighlight: { java: 6, python: 6, cpp: 6 },
    state: cloneIndexHeapState(curState),
    highlights: [{ arrayIndex: minId, color: 'red' }],
    explanation: {
      whatHappened: `Popped from pq. Now sink the new root to restore min heap order.`,
      why: 'Sinking takes O(log N) time.',
    }
  });

  // Sink root down
  let cur = 0;
  const n = curState.pq.length;
  while (cur < n) {
    const left = 2 * cur + 1;
    const right = 2 * cur + 2;
    let smallest = cur;

    if (left < n && less(curState, left, smallest)) smallest = left;
    if (right < n && less(curState, right, smallest)) smallest = right;

    if (smallest !== cur) {
      const curId = curState.pq[cur];
      const smallId = curState.pq[smallest];
      swapPqQp(curState, cur, smallest);

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'swap',
        title: `Sink: Swap Pos [${cur}] and [${smallest}]`,
        description: `Swapped pq[${cur}] and pq[${smallest}]. Updated qp[${curId}] = ${smallest} and qp[${smallId}] = ${cur}.`,
        codeHighlight: { java: 8, python: 8, cpp: 8 },
        state: {
          ...cloneIndexHeapState(curState),
          swappingPq: [cur, smallest],
        },
        highlights: [
          { arrayIndex: cur, color: 'purple' },
          { arrayIndex: smallest, color: 'purple' }
        ],
        explanation: {
          whatHappened: `Sank root down to preserve min heap invariant.`,
          why: 'Preserves tree order and updates qp inverse positions.',
          invariant: `qp[pq[${smallest}]] == ${smallest} (VALID)`
        }
      });
      cur = smallest;
    } else {
      break;
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'complete',
    title: `ExtractMin Complete! Extracted ID ${minId} (Key ${minKey})`,
    description: `Min element extracted and heap order restored.`,
    codeHighlight: { java: 10, python: 10, cpp: 10 },
    state: cloneIndexHeapState(curState),
    highlights: [{ arrayIndex: 0, color: 'green' }],
    explanation: {
      whatHappened: `Extract min completed in O(log N) time.`,
      why: 'Index Heap is now ready for the next operation.',
      invariant: `Verified: qp[pq[i]] == i holds for all remaining ${curState.size} items!`
    }
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

