import { AnimationStep, HashMapState, HashNode, CollisionMode, HashFunctionType } from '../types/dsa';

export function calculateHash(key: string, capacity: number, fnType: HashFunctionType): { hash: number; explanation: string } {
  if (!key) return { hash: 0, explanation: 'Empty key has hash 0' };

  if (fnType === 'first_char') {
    const code = key.charCodeAt(0);
    const hash = code % capacity;
    return {
      hash,
      explanation: `'${key[0]}' ASCII (${code}) % ${capacity} = ${hash}`
    };
  }

  if (fnType === 'polynomial') {
    let pHash = 0;
    const p = 31;
    for (let i = 0; i < key.length; i++) {
      pHash = (pHash * p + key.charCodeAt(i)) % 1000000007;
    }
    const bucket = ((pHash % capacity) + capacity) % capacity;
    return {
      hash: bucket,
      explanation: `Polynomial hash("${key}") = ${pHash} % ${capacity} = ${bucket}`
    };
  }

  // Default: sum of ASCII mod capacity
  let sum = 0;
  const parts: string[] = [];
  for (let i = 0; i < key.length; i++) {
    const code = key.charCodeAt(i);
    sum += code;
    if (i < 4) parts.push(`'${key[i]}'(${code})`);
  }
  const bucket = sum % capacity;
  const partStr = parts.join(' + ') + (key.length > 4 ? ` + ...` : '');
  return {
    hash: bucket,
    explanation: `Sum(${partStr}) = ${sum} % ${capacity} = ${bucket}`
  };
}

export function createInitialHashMapState(capacity: number = 10, collisionMode: CollisionMode = 'chaining', hashFunction: HashFunctionType = 'sum_mod'): HashMapState {
  return {
    buckets: Array.from({ length: capacity }, () => (collisionMode === 'chaining' ? [] : null)),
    capacity,
    size: 0,
    collisionMode,
    hashFunction,
  };
}

function cloneState(state: HashMapState): HashMapState {
  return {
    ...state,
    buckets: state.buckets.map(b => {
      if (Array.isArray(b)) {
        return b.map(node => ({ ...node }));
      } else if (b) {
        return { ...b };
      }
      return null;
    })
  };
}

// Generates step-by-step recording of INSERT
export function recordHashMapInsert(
  initialState: HashMapState,
  key: string,
  value: string
): AnimationStep<HashMapState>[] {
  const steps: AnimationStep<HashMapState>[] = [];
  let curState = cloneState(initialState);
  const { hash, explanation: hashCalcExpl } = calculateHash(key, curState.capacity, curState.hashFunction);
  const targetBucket = hash;

  // Step 1: Compute Hash
  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'hash_calc',
    title: `Step 1: Calculate Hash for Key "${key}"`,
    description: `The hash function converts the string key into a numerical bucket index.`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: {
      ...cloneState(curState),
      lastCalculatedHash: hash,
      lastTargetBucket: targetBucket,
    },
    highlights: [{
      bucketIndex: targetBucket,
      color: 'yellow',
      lineNumbers: { java: [2], python: [2], cpp: [2] }
    }],
    explanation: {
      whatHappened: `Calculated hash: ${hashCalcExpl}`,
      why: 'Hash functions must deterministically map keys of arbitrary size to a fixed range of bucket indices [0..capacity-1].',
    }
  });

  if (curState.collisionMode === 'chaining') {
    const bucketList = curState.buckets[targetBucket] as HashNode[];

    // Step 2: Access Bucket
    steps.push({
      stepIndex: 1,
      totalSteps: 0,
      type: 'bucket_select',
      title: `Step 2: Inspect Bucket #${targetBucket}`,
      description: `Target bucket contains ${bucketList.length} existing elements.`,
      codeHighlight: { java: 4, python: 4, cpp: 4 },
      state: cloneState(curState),
      highlights: [{
        bucketIndex: targetBucket,
        color: bucketList.length > 0 ? 'purple' : 'blue',
      }],
      explanation: {
        whatHappened: `Navigated to bucket array[${targetBucket}]. Current bucket size: ${bucketList.length}.`,
        why: 'In Separate Chaining, each bucket stores a linked list (or dynamic chain) of key-value nodes.',
      }
    });

    // Check if key already exists to update
    let existingIndex = -1;
    for (let i = 0; i < bucketList.length; i++) {
      const node = bucketList[i];
      const isMatch = node.key === key;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'compare',
        title: `Comparing Key "${key}" with existing "${node.key}"`,
        description: isMatch ? `Key match found! Updating existing value.` : `Keys do not match. Continue traversing bucket chain.`,
        codeHighlight: { java: 6, python: 6, cpp: 6 },
        state: cloneState(curState),
        highlights: [{
          bucketIndex: targetBucket,
          nodeId: node.id,
          color: isMatch ? 'green' : 'yellow',
        }],
        explanation: {
          whatHappened: `Evaluated "${key}" == "${node.key}": ${isMatch ? 'TRUE' : 'FALSE'}.`,
          why: 'HashMaps must handle key updates without creating duplicate keys.',
        }
      });

      if (isMatch) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex !== -1) {
      // Update existing
      curState.buckets[targetBucket] = bucketList.map((n, i) =>
        i === existingIndex ? { ...n, value } : n
      );
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'update',
        title: `Updated Key "${key}" to New Value "${value}"`,
        description: `Existing node updated in place.`,
        codeHighlight: { java: 7, python: 7, cpp: 7 },
        state: cloneState(curState),
        highlights: [{ bucketIndex: targetBucket, color: 'green' }],
        explanation: {
          whatHappened: `Replaced value for "${key}" with "${value}". Total size unchanged (${curState.size}).`,
          why: 'Keys in a map are unique; setting a value on an existing key updates it.',
        }
      });
    } else {
      // Collision alert if bucket not empty
      if (bucketList.length > 0) {
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          type: 'collision',
          title: `Collision Handled via Separate Chaining`,
          description: `Bucket #${targetBucket} already has ${bucketList.length} element(s). Appending new node to the chain!`,
          codeHighlight: { java: 9, python: 9, cpp: 9 },
          state: cloneState(curState),
          highlights: [{ bucketIndex: targetBucket, color: 'purple' }],
          explanation: {
            whatHappened: `Multiple keys hash to index ${targetBucket}. They coexist via a linked list chain.`,
            why: 'Separate Chaining resolves collisions by allowing unbounded items per bucket index.',
          }
        });
      }

      // Insert new node
      const newNode: HashNode = {
        key,
        value,
        hash,
        id: `${key}_${Date.now()}_${Math.random()}`
      };
      (curState.buckets[targetBucket] as HashNode[]).push(newNode);
      curState.size += 1;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'insert',
        title: `Successfully Inserted ("${key}", "${value}")`,
        description: `Node appended to bucket #${targetBucket}. HashMap size is now ${curState.size}.`,
        codeHighlight: { java: 11, python: 11, cpp: 11 },
        state: cloneState(curState),
        highlights: [{ bucketIndex: targetBucket, nodeId: newNode.id, color: 'green' }],
        explanation: {
          whatHappened: `Inserted ("${key}", "${value}") into bucket #${targetBucket}. Current load factor: ${(curState.size / curState.capacity).toFixed(2)}.`,
          why: 'Average insertion time is O(1) when hash distribution is uniform.',
        }
      });
    }

  } else {
    // Open Addressing (Linear Probing)
    let probeIdx = targetBucket;
    let stepCount = 0;
    let placed = false;

    while (stepCount < curState.capacity) {
      const occupant = curState.buckets[probeIdx] as HashNode | null;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'probing',
        title: `Linear Probing: Checking Bucket #${probeIdx}`,
        description: occupant ? `Slot occupied by key "${occupant.key}". Collision! Probing next slot.` : `Slot is empty! Available for insertion.`,
        codeHighlight: { java: 5, python: 5, cpp: 5 },
        state: cloneState(curState),
        highlights: [{ bucketIndex: probeIdx, color: occupant ? 'purple' : 'yellow' }],
        explanation: {
          whatHappened: `Probe #${stepCount + 1}: Index = (${targetBucket} + ${stepCount}) % ${curState.capacity} = ${probeIdx}.`,
          why: 'In Open Addressing, collisions are resolved by searching for the next unoccupied slot in a deterministic sequence.',
        }
      });

      if (!occupant || occupant.key === key) {
        const isUpdate = occupant && occupant.key === key;
        const newNode: HashNode = {
          key,
          value,
          hash,
          id: `${key}_${Date.now()}`
        };
        curState.buckets[probeIdx] = newNode;
        if (!isUpdate) curState.size += 1;

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          type: 'insert',
          title: isUpdate ? `Updated Key "${key}" in Slot #${probeIdx}` : `Inserted into Slot #${probeIdx}`,
          description: `Key-value pair placed at open addressing slot #${probeIdx}.`,
          codeHighlight: { java: 8, python: 8, cpp: 8 },
          state: cloneState(curState),
          highlights: [{ bucketIndex: probeIdx, color: 'green' }],
          explanation: {
            whatHappened: `Placed ("${key}", "${value}") in slot #${probeIdx}. Total probes needed: ${stepCount + 1}.`,
            why: 'Open Addressing stores all entries directly in the table without dynamic pointer nodes.',
          }
        });
        placed = true;
        break;
      }

      stepCount++;
      probeIdx = (probeIdx + 1) % curState.capacity;
    }

    if (!placed) {
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'complete',
        title: `Table Full! Cannot Insert`,
        description: `All ${curState.capacity} slots probed and occupied. Rehashing required.`,
        state: cloneState(curState),
        highlights: [],
        explanation: {
          whatHappened: `Open addressing table reached maximum capacity (100% load factor).`,
          why: 'In production, HashMaps dynamically resize (rehash) when load factor exceeds threshold (typically 0.75).',
        }
      });
    }
  }

  // Update totalSteps on all steps
  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

// Generates step-by-step recording of SEARCH
export function recordHashMapSearch(
  initialState: HashMapState,
  key: string
): AnimationStep<HashMapState>[] {
  const steps: AnimationStep<HashMapState>[] = [];
  const curState = cloneState(initialState);
  const { hash, explanation: hashCalcExpl } = calculateHash(key, curState.capacity, curState.hashFunction);
  const targetBucket = hash;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'hash_calc',
    title: `Step 1: Calculate Hash for Search Key "${key}"`,
    description: `Compute hash code to jump directly to the target bucket in O(1) time.`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: cloneState(curState),
    highlights: [{ bucketIndex: targetBucket, color: 'yellow' }],
    explanation: {
      whatHappened: `Calculated hash: ${hashCalcExpl}`,
      why: 'Hashing allows us to eliminate searching through non-matching buckets.',
    }
  });

  if (curState.collisionMode === 'chaining') {
    const bucketList = curState.buckets[targetBucket] as HashNode[];

    steps.push({
      stepIndex: 1,
      totalSteps: 0,
      type: 'bucket_select',
      title: `Step 2: Inspect Bucket #${targetBucket}`,
      description: `Bucket #${targetBucket} has ${bucketList.length} item(s).`,
      codeHighlight: { java: 4, python: 4, cpp: 4 },
      state: cloneState(curState),
      highlights: [{ bucketIndex: targetBucket, color: 'blue' }],
      explanation: {
        whatHappened: `Navigated to bucket array[${targetBucket}].`,
        why: 'If the key exists, it must reside within this specific bucket.',
      }
    });

    let found = false;
    for (let i = 0; i < bucketList.length; i++) {
      const node = bucketList[i];
      const isMatch = node.key === key;

      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: isMatch ? 'found' : 'compare',
        title: isMatch ? `Key Found! ("${key}" -> "${node.value}")` : `Checking Node "${node.key}"`,
        description: isMatch ? `Matched key! Returning value "${node.value}".` : `Key "${node.key}" != "${key}". Checking next node.`,
        codeHighlight: { java: isMatch ? 7 : 5, python: isMatch ? 7 : 5, cpp: isMatch ? 7 : 5 },
        state: cloneState(curState),
        highlights: [{ bucketIndex: targetBucket, nodeId: node.id, color: isMatch ? 'green' : 'yellow' }],
        explanation: {
          whatHappened: isMatch ? `Found matching key "${key}" with value "${node.value}".` : `Keys do not match.`,
          why: 'In Separate Chaining, searching examines the chain linearly until match or end of chain.',
        }
      });

      if (isMatch) {
        found = true;
        break;
      }
    }

    if (!found) {
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'not_found',
        title: `Key "${key}" Not Found`,
        description: `Reached end of chain in bucket #${targetBucket}. Key does not exist in map.`,
        codeHighlight: { java: 10, python: 10, cpp: 10 },
        state: cloneState(curState),
        highlights: [{ bucketIndex: targetBucket, color: 'red' }],
        explanation: {
          whatHappened: `Key "${key}" was not found in bucket #${targetBucket}. Returned null / None.`,
          why: 'If an item is not in its computed bucket, it does not exist in the hash map.',
        }
      });
    }

  } else {
    // Open addressing search
    let probeIdx = targetBucket;
    let stepCount = 0;
    let found = false;

    while (stepCount < curState.capacity) {
      const occupant = curState.buckets[probeIdx] as HashNode | null;

      if (!occupant) {
        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          type: 'not_found',
          title: `Empty Slot Encountered at #${probeIdx}`,
          description: `Slot is empty, stopping probe sequence. Key "${key}" does not exist.`,
          codeHighlight: { java: 8, python: 8, cpp: 8 },
          state: cloneState(curState),
          highlights: [{ bucketIndex: probeIdx, color: 'red' }],
          explanation: {
            whatHappened: `Hit empty slot at #${probeIdx}. In linear probing, an empty slot guarantees the key was never inserted.`,
            why: 'Search terminates immediately upon encountering an empty slot in Open Addressing.',
          }
        });
        found = true;
        break;
      }

      const isMatch = occupant.key === key;
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: isMatch ? 'found' : 'probing',
        title: isMatch ? `Key Found at Slot #${probeIdx}!` : `Slot #${probeIdx} contains "${occupant.key}". Probing next.`,
        description: isMatch ? `Found value "${occupant.value}".` : `Continue linear probe.`,
        codeHighlight: { java: isMatch ? 6 : 4, python: isMatch ? 6 : 4, cpp: isMatch ? 6 : 4 },
        state: cloneState(curState),
        highlights: [{ bucketIndex: probeIdx, color: isMatch ? 'green' : 'yellow' }],
        explanation: {
          whatHappened: isMatch ? `Match found at slot #${probeIdx} after ${stepCount + 1} probe(s).` : `Slot #${probeIdx} has different key.`,
          why: 'Linear probing inspects consecutive buckets sequentially until match or empty slot.',
        }
      });

      if (isMatch) {
        found = true;
        break;
      }

      stepCount++;
      probeIdx = (probeIdx + 1) % curState.capacity;
    }
  }

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

// Generates step-by-step recording of DELETE
export function recordHashMapDelete(
  initialState: HashMapState,
  key: string
): AnimationStep<HashMapState>[] {
  const steps: AnimationStep<HashMapState>[] = [];
  const curState = cloneState(initialState);
  const { hash, explanation: hashCalcExpl } = calculateHash(key, curState.capacity, curState.hashFunction);
  const targetBucket = hash;

  steps.push({
    stepIndex: 0,
    totalSteps: 0,
    type: 'hash_calc',
    title: `Step 1: Compute Hash for Deletion`,
    description: `Locate bucket for key "${key}".`,
    codeHighlight: { java: 2, python: 2, cpp: 2 },
    state: cloneState(curState),
    highlights: [{ bucketIndex: targetBucket, color: 'yellow' }],
    explanation: {
      whatHappened: `Hash calculation: ${hashCalcExpl}`,
      why: 'Deletion uses the same hash calculation to find the bucket index.',
    }
  });

  if (curState.collisionMode === 'chaining') {
    const bucketList = curState.buckets[targetBucket] as HashNode[];
    const nodeIdx = bucketList.findIndex(n => n.key === key);

    if (nodeIdx !== -1) {
      const deletedNode = bucketList[nodeIdx];
      steps.push({
        stepIndex: 1,
        totalSteps: 0,
        type: 'compare',
        title: `Located Key "${key}" in Bucket #${targetBucket}`,
        description: `Node identified for removal.`,
        codeHighlight: { java: 5, python: 5, cpp: 5 },
        state: cloneState(curState),
        highlights: [{ bucketIndex: targetBucket, nodeId: deletedNode.id, color: 'purple' }],
        explanation: {
          whatHappened: `Identified target node at chain index ${nodeIdx}.`,
          why: 'We unlink the node from the bucket list by updating pointers.',
        }
      });

      // Remove node
      curState.buckets[targetBucket] = bucketList.filter((_, idx) => idx !== nodeIdx);
      curState.size -= 1;

      steps.push({
        stepIndex: 2,
        totalSteps: 0,
        type: 'delete',
        title: `Removed Key "${key}" from Bucket #${targetBucket}`,
        description: `Node unlinked. HashMap size is now ${curState.size}.`,
        codeHighlight: { java: 8, python: 8, cpp: 8 },
        state: cloneState(curState),
        highlights: [{ bucketIndex: targetBucket, color: 'red' }],
        explanation: {
          whatHappened: `Deleted node with key "${key}". Size decreased to ${curState.size}.`,
          why: 'Separate Chaining deletion simply removes the node from the bucket list in O(L) time.',
        }
      });
    } else {
      steps.push({
        stepIndex: 1,
        totalSteps: 0,
        type: 'not_found',
        title: `Key "${key}" Not Found`,
        description: `Cannot delete: key does not exist in bucket #${targetBucket}.`,
        codeHighlight: { java: 10, python: 10, cpp: 10 },
        state: cloneState(curState),
        highlights: [{ bucketIndex: targetBucket, color: 'red' }],
        explanation: {
          whatHappened: `Traversed bucket #${targetBucket}; key was not present.`,
          why: 'Delete returns false / null when the target key is absent.',
        }
      });
    }
  } else {
    // Open addressing deletion
    let probeIdx = targetBucket;
    let stepCount = 0;
    let found = false;

    while (stepCount < curState.capacity) {
      const occupant = curState.buckets[probeIdx] as HashNode | null;
      if (!occupant) break;

      if (occupant.key === key) {
        found = true;
        curState.buckets[probeIdx] = null;
        curState.size -= 1;

        steps.push({
          stepIndex: steps.length,
          totalSteps: 0,
          type: 'delete',
          title: `Removed Key "${key}" from Slot #${probeIdx}`,
          description: `Slot cleared. Size is now ${curState.size}.`,
          codeHighlight: { java: 7, python: 7, cpp: 7 },
          state: cloneState(curState),
          highlights: [{ bucketIndex: probeIdx, color: 'red' }],
          explanation: {
            whatHappened: `Removed occupant at slot #${probeIdx}.`,
            why: 'In Open Addressing, deleted slots are marked to prevent breaking subsequent probe chains.',
          }
        });
        break;
      }

      stepCount++;
      probeIdx = (probeIdx + 1) % curState.capacity;
    }

    if (!found) {
      steps.push({
        stepIndex: steps.length,
        totalSteps: 0,
        type: 'not_found',
        title: `Key "${key}" Not Found in Open Addressing Table`,
        description: `Probed table, key not present.`,
        state: cloneState(curState),
        highlights: [],
        explanation: {
          whatHappened: `Key was not located in probe sequence.`,
          why: 'Delete terminates without modification.',
        }
      });
    }
  }

  steps.forEach(s => s.totalSteps = steps.length);
  return steps;
}

