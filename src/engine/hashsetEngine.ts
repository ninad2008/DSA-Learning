import { AnimationStep, HashSetState } from '../types/dsa';

export function createInitialHashSetState(capacity: number = 8): HashSetState {
  return {
    buckets: Array.from({ length: capacity }, () => []),
    capacity,
    size: 0,
  };
}

function cloneHashSetState(state: HashSetState): HashSetState {
  return {
    ...state,
    buckets: state.buckets.map(b => [...b]),
  };
}

export function hashString(val: string, capacity: number): { hash: number; explanation: string } {
  let sum = 0;
  for (let i = 0; i < val.length; i++) {
    sum += val.charCodeAt(i);
  }
  const hash = sum % capacity;
  return {
    hash,
    explanation: `hash("${val}") = sum(ASCII) % ${capacity} = ${sum} % ${capacity} = ${hash}`
  };
}

// Record ADD to HashSet (with duplicate detection & rejection)
export function recordHashSetAdd(
  initialState: HashSetState,
  val: string
): AnimationStep<HashSetState>[] {
  const steps: AnimationStep<HashSetState>[] = [];
  const curState = cloneHashSetState(initialState);
  const { hash, explanation: hashExpl } = hashString(val, curState.capacity);

  // Step 1: Hash calculation
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'hash_calc',
    title: `Step 1: Compute Hash for Value "${val}"`,
    description: `Compute bucket index for "${val}".`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: cloneHashSetState(curState),
    highlights: [{ bucketIndex: hash, color: 'yellow' }],
    explanation: {
      whatHappened: `Calculated bucket index: ${hashExpl}.`,
      why: 'A HashSet hashes only the element itself (unlike HashMap which hashes a key associated with a value).',
    }
  });

  const bucket = curState.buckets[hash];

  // Step 2: Check bucket for existing duplicate
  steps.push({
    stepIndex: 1,
    totalSteps: 0,
    type: 'bucket_select',
    title: `Step 2: Inspect Bucket #${hash}`,
    description: `Checking bucket #${hash} containing ${bucket.length} existing unique elements.`,
    codeHighlight: { java: 4, python: 4, cpp: 4 },
    state: cloneHashSetState(curState),
    highlights: [{ bucketIndex: hash, color: 'blue' }],
    explanation: {
      whatHappened: `Navigated to bucket array[${hash}]. Elements present: [${bucket.join(', ')}].`,
      why: 'To guarantee uniqueness, HashSet must verify whether "${val}" already exists in the target bucket.',
    }
  });

  const isDuplicate = bucket.includes(val);

  if (isDuplicate) {
    // REJECTION ANIMATION
    steps.push({
      stepIndex: 2,
      totalSteps: 0,
      type: 'duplicate_reject',
      title: `DUPLICATE DETECTED: Element "${val}" REJECTED!`,
      description: `HashSet enforces strict uniqueness. "${val}" already exists in bucket #${hash}.`,
      codeHighlight: { java: 5, python: 5, cpp: 5 },
      state: {
        ...cloneHashSetState(curState),
        lastCheckedItem: val,
        isDuplicate: true,
      },
      highlights: [{ bucketIndex: hash, color: 'red' }],
      explanation: {
        whatHappened: `Attempted to add existing item "${val}". The operation aborted and returned false!`,
        why: 'The core invariant of a HashSet is that no duplicate elements are permitted: S ∩ {x} = S.',
      }
    });
  } else {
    // Add new unique element
    curState.buckets[hash].push(val);
    curState.size += 1;

    steps.push({
      stepIndex: 2,
      totalSteps: 0,
      type: 'insert',
      title: `Unique Element "${val}" Successfully Added!`,
      description: `Inserted into bucket #${hash}. Total unique items: ${curState.size}.`,
      codeHighlight: { java: 7, python: 7, cpp: 7 },
      state: {
        ...cloneHashSetState(curState),
        lastCheckedItem: val,
        isDuplicate: false,
      },
      highlights: [{ bucketIndex: hash, color: 'green' }],
      explanation: {
        whatHappened: `Added "${val}" to bucket #${hash}. HashSet size increased to ${curState.size}.`,
        why: 'Since the element was absent, adding it maintained set uniqueness and took O(1) average time.',
      }
    });
  }

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

// Record CONTAINS in HashSet
export function recordHashSetContains(
  initialState: HashSetState,
  val: string
): AnimationStep<HashSetState>[] {
  const steps: AnimationStep<HashSetState>[] = [];
  const curState = cloneHashSetState(initialState);
  const { hash, explanation: hashExpl } = hashString(val, curState.capacity);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'hash_calc',
    title: `Compute Hash for "${val}"`,
    description: `Target bucket: #${hash}.`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: cloneHashSetState(curState),
    highlights: [{ bucketIndex: hash, color: 'yellow' }],
    explanation: {
      whatHappened: `Calculated hash: ${hashExpl}`,
      why: 'Hashing jumps directly to bucket index in O(1) time.',
    }
  });

  const bucket = curState.buckets[hash];
  const found = bucket.includes(val);

  steps.push({
    stepIndex: 1,
    totalSteps: 0,
    type: found ? 'found' : 'not_found',
    title: found ? `Found: "${val}" exists in HashSet (true)` : `Not Found: "${val}" is NOT in HashSet (false)`,
    description: found
      ? `"${val}" is present in bucket #${hash}.`
      : `Bucket #${hash} does not contain "${val}".`,
    codeHighlight: { java: found ? 5 : 7, python: found ? 5 : 7, cpp: found ? 5 : 7 },
    state: cloneHashSetState(curState),
    highlights: [{ bucketIndex: hash, color: found ? 'green' : 'red' }],
    explanation: {
      whatHappened: `Bucket examination: ${found ? 'Match found!' : 'No matching element.'}`,
      why: 'Contains lookup in HashSet has O(1) average time complexity, drastically faster than O(N) array search.',
    }
  });

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

// Record REMOVE in HashSet
export function recordHashSetRemove(
  initialState: HashSetState,
  val: string
): AnimationStep<HashSetState>[] {
  const steps: AnimationStep<HashSetState>[] = [];
  const curState = cloneHashSetState(initialState);
  const { hash, explanation: hashExpl } = hashString(val, curState.capacity);

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'hash_calc',
    title: `Locating Bucket for Deletion of "${val}"`,
    description: `Target bucket: #${hash}.`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: cloneHashSetState(curState),
    highlights: [{ bucketIndex: hash, color: 'yellow' }],
    explanation: {
      whatHappened: `Hash calculation: ${hashExpl}`,
      why: 'Find target bucket before removing element.',
    }
  });

  const bucket = curState.buckets[hash];
  const idx = bucket.indexOf(val);

  if (idx !== -1) {
    curState.buckets[hash] = bucket.filter(item => item !== val);
    curState.size -= 1;

    steps.push({
      stepIndex: 1,
      totalSteps: 0,
      type: 'delete',
      title: `Removed "${val}" from Bucket #${hash}`,
      description: `Element removed from set. New size: ${curState.size}.`,
      codeHighlight: { java: 6, python: 6, cpp: 6 },
      state: cloneHashSetState(curState),
      highlights: [{ bucketIndex: hash, color: 'red' }],
      explanation: {
        whatHappened: `Deleted "${val}". Removed from bucket #${hash}.`,
        why: 'HashSet remove runs in O(1) average time.',
      }
    });
  } else {
    steps.push({
      stepIndex: 1,
      totalSteps: 0,
      type: 'not_found',
      title: `Cannot Remove: "${val}" Not Found`,
      description: `Element was not in the HashSet.`,
      codeHighlight: { java: 9, python: 9, cpp: 9 },
      state: cloneHashSetState(curState),
      highlights: [{ bucketIndex: hash, color: 'yellow' }],
      explanation: {
        whatHappened: `Element "${val}" not found in bucket #${hash}. Return false.`,
        why: 'Removing a non-existent element leaves the set unchanged.',
      }
    });
  }

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

