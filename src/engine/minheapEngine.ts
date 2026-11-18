import { AnimationStep, MinHeapState, MinHeapNode } from '../types/dsa';

export function createInitialMinHeapState(initialValues: number[] = [12, 18, 25, 30, 42, 50]): MinHeapState {
  return {
    array: initialValues.map(v => ({ val: v, id: `node_${v}_${Math.random()}` })),
  };
}

function cloneHeapState(state: MinHeapState): MinHeapState {
  return {
    ...state,
    array: state.array.map(n => ({ ...n })),
  };
}

// RECORD INSERT (Bubble Up / Swim)
export function recordMinHeapInsert(
  initialState: MinHeapState,
  val: number
): AnimationStep<MinHeapState>[] {
  const steps: AnimationStep<MinHeapState>[] = [];
  const curState = cloneHeapState(initialState);
  const newNode: MinHeapNode = { val, id: `node_${val}_${Date.now()}` };

  // Step 1: Place at end of array (last position in complete binary tree)
  curState.array.push(newNode);
  let curIdx = curState.array.length - 1;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'insert',
    title: `Step 1: Insert ${val} at the End of the Heap`,
    description: `Placed at index [${curIdx}] (the next available position in the complete binary tree).`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: {
      ...cloneHeapState(curState),
      activeIndices: [curIdx],
    },
    highlights: [{
      arrayIndex: curIdx,
      color: 'blue',
      lineNumbers: { java: [2], python: [2], cpp: [2] }
    }],
    explanation: {
      whatHappened: `Appended ${val} at heap index ${curIdx}. Array size is now ${curState.array.length}.`,
      why: 'A binary heap must maintain the Complete Binary Tree structural property: all levels full except possibly the last, filled left to right.',
    }
  });

  // Bubble up / Swim loop
  while (curIdx > 0) {
    const parentIdx = Math.floor((curIdx - 1) / 2);
    const parentVal = curState.array[parentIdx].val;
    const curVal = curState.array[curIdx].val;

    // Step: Compare with parent
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      type: 'compare',
      title: `Compare Node (${curVal}) at [${curIdx}] with Parent (${parentVal}) at [${parentIdx}]`,
      description: `Formula: parentIndex = floor((${curIdx} - 1) / 2) = ${parentIdx}. Evaluating: ${curVal} < ${parentVal}?`,
      codeHighlight: { java: 4, python: 4, cpp: 4 },
      state: {
        ...cloneHeapState(curState),
        comparingIndices: [curIdx, parentIdx],
        activeIndices: [curIdx],
      },
      highlights: [
        { arrayIndex: curIdx, color: 'yellow' },
        { arrayIndex: parentIdx, color: 'purple' }
      ],
      explanation: {
        whatHappened: `Checked if child (${curVal}) violates Min Heap property with parent (${parentVal}).`,
        why: 'In a Min Heap, every parent node must be less than or equal to its children: parent <= child.',
      }
    });

    if (curVal < parentVal) {
      // Must swap!
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'swap',
        title: `Bubble Up: Swap ${curVal} and ${parentVal}`,
        description: `Violation! Child (${curVal}) < Parent (${parentVal}). Swapping to restore min heap order.`,
        codeHighlight: { java: 5, python: 5, cpp: 5 },
        state: {
          ...cloneHeapState(curState),
          swappingIndices: [curIdx, parentIdx],
        },
        highlights: [
          { arrayIndex: curIdx, color: 'purple' },
          { arrayIndex: parentIdx, color: 'purple' }
        ],
        explanation: {
          whatHappened: `Swapped array[${curIdx}] and array[${parentIdx}].`,
          why: 'Bubbling up moves the smaller value towards the root until the heap property is satisfied.',
        }
      });

      // Perform actual swap
      const temp = curState.array[curIdx];
      curState.array[curIdx] = curState.array[parentIdx];
      curState.array[parentIdx] = temp;
      curIdx = parentIdx;

      // Post-swap state
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'bubble_up',
        title: `Node ${val} Moved to Index [${curIdx}]`,
        description: `Node successfully bubbled up one level.`,
        codeHighlight: { java: 6, python: 6, cpp: 6 },
        state: {
          ...cloneHeapState(curState),
          activeIndices: [curIdx],
        },
        highlights: [{ arrayIndex: curIdx, color: 'green' }],
        explanation: {
          whatHappened: `Node ${val} now resides at heap index ${curIdx}.`,
          why: 'We continue checking parents up to the root if necessary (at most O(log N) comparisons).',
        }
      });
    } else {
      // Satisfied! Stop bubbling up
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'complete',
        title: `Min Heap Property Satisfied!`,
        description: `Child (${curVal}) >= Parent (${parentVal}). No further swaps required.`,
        codeHighlight: { java: 8, python: 8, cpp: 8 },
        state: {
          ...cloneHeapState(curState),
          activeIndices: [curIdx],
        },
        highlights: [{ arrayIndex: curIdx, color: 'green' }],
        explanation: {
          whatHappened: `Insertion complete. Min Heap invariant parent <= children is preserved throughout the tree.`,
          why: 'Bubble-up halts as soon as parent <= child or the root is reached.',
        }
      });
      break;
    }
  }

  if (curIdx === 0 && steps[steps.length - 1].type !== 'complete') {
    steps.push({
      stepIndex: steps.length,
      totalSteps: 0,
      type: 'complete',
      title: `${val} is now the Root (Minimum Element)`,
      description: `The inserted value bubbled all the way to index [0]. It is now the smallest element in the entire heap!`,
      codeHighlight: { java: 9, python: 9, cpp: 9 },
      state: {
        ...cloneHeapState(curState),
        activeIndices: [0],
      },
      highlights: [{ arrayIndex: 0, color: 'green' }],
      explanation: {
        whatHappened: `Reached root position (index 0). Minimum element = ${val}.`,
        why: 'In a Min Heap, index 0 always holds the minimum element in O(1) retrieval time.',
      }
    });
  }

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

// RECORD EXTRACT MIN (Bubble Down / Sink)
export function recordMinHeapExtractMin(
  initialState: MinHeapState
): AnimationStep<MinHeapState>[] {
  const steps: AnimationStep<MinHeapState>[] = [];
  const curState = cloneHeapState(initialState);

  if (curState.array.length === 0) {
    steps.push({
      stepIndex: 0,
      totalSteps: 1,
      type: 'complete',
      title: 'Heap is Empty!',
      description: 'Cannot extract minimum from an empty heap.',
      codeHighlight: { java: 1, python: 1, cpp: 1 },
      state: cloneHeapState(curState),
      explanation: {
        whatHappened: 'Extract min called on empty heap.',
        why: 'Check bounds before removing.',
      }
    });
    return steps;
  }

  const minVal = curState.array[0].val;

  // Step 1: Highlight Root Minimum
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'compare',
    title: `Step 1: Identify Minimum Element at Root (${minVal})`,
    description: `The root at index [0] always holds the minimum element in a Min Heap.`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: {
      ...cloneHeapState(curState),
      activeIndices: [0],
    },
    highlights: [{ arrayIndex: 0, color: 'yellow' }],
    explanation: {
      whatHappened: `Inspecting root element array[0] = ${minVal}.`,
      why: 'Retrieving the minimum takes O(1) time in any binary heap.',
    }
  });

  if (curState.array.length === 1) {
    curState.array.pop();
    steps.push({
      stepIndex: 1,
      totalSteps: 2,
      type: 'delete',
      title: `Extracted Last Element (${minVal})`,
      description: `The heap is now empty.`,
      codeHighlight: { java: 4, python: 4, cpp: 4 },
      state: cloneHeapState(curState),
      highlights: [],
      explanation: {
        whatHappened: `Removed the sole element ${minVal}.`,
        why: 'No bubbling down needed when heap has only 1 element.',
      }
    });
    return steps;
  }

  // Step 2: Move last element to root
  const lastElement = curState.array.pop()!;
  const lastVal = lastElement.val;
  curState.array[0] = lastElement;

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'swap',
    title: `Step 2: Move Last Element (${lastVal}) to Root`,
    description: `Extracted ${minVal}. Moved the last leaf element (${lastVal}) to index [0] to maintain tree shape.`,
    codeHighlight: { java: 4, python: 4, cpp: 4 },
    state: {
      ...cloneHeapState(curState),
      activeIndices: [0],
    },
    highlights: [{ arrayIndex: 0, color: 'purple' }],
    explanation: {
      whatHappened: `Root replaced with ${lastVal}. Previous root ${minVal} removed.`,
      why: 'Moving the last element preserves the Complete Binary Tree shape constraint.',
    }
  });

  // Bubble down / Sink loop
  let curIdx = 0;
  const n = curState.array.length;

  while (curIdx < n) {
    const leftIdx = 2 * curIdx + 1;
    const rightIdx = 2 * curIdx + 2;
    let smallestIdx = curIdx;

    if (leftIdx < n && curState.array[leftIdx].val < curState.array[smallestIdx].val) {
      smallestIdx = leftIdx;
    }
    if (rightIdx < n && curState.array[rightIdx].val < curState.array[smallestIdx].val) {
      smallestIdx = rightIdx;
    }

    if (smallestIdx !== curIdx) {
      const curV = curState.array[curIdx].val;
      const smallV = curState.array[smallestIdx].val;

      // Comparison step
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'compare',
        title: `Compare Parent (${curV}) at [${curIdx}] with Children`,
        description: `Left child: ${leftIdx < n ? curState.array[leftIdx].val : 'none'}, Right child: ${rightIdx < n ? curState.array[rightIdx].val : 'none'}. Smaller child is at [${smallestIdx}] with value ${smallV}.`,
        codeHighlight: { java: 6, python: 6, cpp: 6 },
        state: {
          ...cloneHeapState(curState),
          comparingIndices: [curIdx, smallestIdx],
        },
        highlights: [
          { arrayIndex: curIdx, color: 'yellow' },
          { arrayIndex: smallestIdx, color: 'purple' }
        ],
        explanation: {
          whatHappened: `Compared parent with children. Smallest is at index ${smallestIdx} (${smallV}).`,
          why: 'We must swap with the smaller child to ensure the new parent is smaller than both children.',
        }
      });

      // Swap step
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'swap',
        title: `Bubble Down: Swap ${curV} and ${smallV}`,
        description: `Parent (${curV}) > Child (${smallV}). Swapping down.`,
        codeHighlight: { java: 9, python: 9, cpp: 9 },
        state: {
          ...cloneHeapState(curState),
          swappingIndices: [curIdx, smallestIdx],
        },
        highlights: [
          { arrayIndex: curIdx, color: 'purple' },
          { arrayIndex: smallestIdx, color: 'purple' }
        ],
        explanation: {
          whatHappened: `Swapped array[${curIdx}] and array[${smallestIdx}].`,
          why: 'Bubbling down sinks large values toward the leaves in O(log N) time.',
        }
      });

      const temp = curState.array[curIdx];
      curState.array[curIdx] = curState.array[smallestIdx];
      curState.array[smallestIdx] = temp;
      curIdx = smallestIdx;
    } else {
      // Satisfied
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'complete',
        title: `Min Heap Property Restored!`,
        description: `Current element (${curState.array[curIdx].val}) is smaller than or equal to both children. Sink complete.`,
        codeHighlight: { java: 12, python: 12, cpp: 12 },
        state: {
          ...cloneHeapState(curState),
          activeIndices: [curIdx],
        },
        highlights: [{ arrayIndex: curIdx, color: 'green' }],
        explanation: {
          whatHappened: `Extract-min finished. Extracted minimum value: ${minVal}.`,
          why: 'The remaining elements now satisfy all Min Heap properties.',
        }
      });
      break;
    }
  }

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

// RECORD HEAPIFY (Build Heap from Unsorted Array)
export function recordMinHeapBuildHeap(
  values: number[]
): AnimationStep<MinHeapState>[] {
  const steps: AnimationStep<MinHeapState>[] = [];
  const curState: MinHeapState = {
    array: values.map((v, i) => ({ val: v, id: `node_${v}_${i}_${Math.random()}` })),
  };
  const n = curState.array.length;
  const startIdx = Math.floor(n / 2) - 1;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'init',
    title: `Initialize Heapify on Unsorted Array [${values.join(', ')}]`,
    description: `Bottom-up Heapify starts from the last non-leaf node: floor(${n}/2) - 1 = index [${startIdx}].`,
    codeHighlight: { java: 1, python: 1, cpp: 1 },
    state: cloneHeapState(curState),
    highlights: [{ arrayIndex: startIdx, color: 'blue' }],
    explanation: {
      whatHappened: `Loaded array of size ${n}. Leaf nodes (indices ${startIdx + 1}..${n - 1}) are already trivial 1-node heaps.`,
      why: 'Building a heap bottom-up runs in O(N) linear time, which is mathematically faster than inserting N elements one-by-one (O(N log N)).',
    }
  });

  for (let i = startIdx; i >= 0; i--) {
    let cur = i;
    while (cur < n) {
      const left = 2 * cur + 1;
      const right = 2 * cur + 2;
      let smallest = cur;

      if (left < n && curState.array[left].val < curState.array[smallest].val) {
        smallest = left;
      }
      if (right < n && curState.array[right].val < curState.array[smallest].val) {
        smallest = right;
      }

      if (smallest !== cur) {
        const pVal = curState.array[cur].val;
        const cVal = curState.array[smallest].val;

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          type: 'swap',
          title: `Heapify Subtree at [${cur}]: Swap ${pVal} and ${cVal}`,
          description: `Child (${cVal}) < Parent (${pVal}). Swapping to satisfy min heap property for this subtree.`,
          codeHighlight: { java: 5, python: 5, cpp: 5 },
          state: {
            ...cloneHeapState(curState),
            swappingIndices: [cur, smallest],
          },
          highlights: [
            { arrayIndex: cur, color: 'purple' },
            { arrayIndex: smallest, color: 'purple' }
          ],
          explanation: {
            whatHappened: `Swapped parent [${cur}] with smaller child [${smallest}].`,
            why: 'Bottom-up heapify recursively fixes smaller subtrees first, ensuring correctness when sinking higher nodes.',
          }
        });

        const temp = curState.array[cur];
        curState.array[cur] = curState.array[smallest];
        curState.array[smallest] = temp;
        cur = smallest;
      } else {
        break;
      }
    }
  }

  steps.push({
    stepIndex: steps.length,
    totalSteps: 0,
    type: 'complete',
    title: `Heapify Complete! Array is now a Valid Min Heap`,
    description: `All nodes satisfy parent <= children. Root [0] holds overall minimum: ${curState.array[0]?.val}.`,
    codeHighlight: { java: 10, python: 10, cpp: 10 },
    state: {
      ...cloneHeapState(curState),
      activeIndices: [0],
    },
    highlights: [{ arrayIndex: 0, color: 'green' }],
    explanation: {
      whatHappened: `Successfully converted unsorted array into a valid Min Heap in O(N) time.`,
      why: 'Summing heights of all nodes yields ∑ h * (N / 2^(h+1)) = O(N).',
    }
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}
