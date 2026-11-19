export type ModuleId = 'hashmap' | 'hashset' | 'minheap' | 'indexheap';

export type LevelId = 
  | 'concept'       // Level 1: Understand concept
  | 'visual'        // Level 2: Visual simulation
  | 'manual'        // Level 3: Hands-on manual operations
  | 'code'          // Level 4: Underlying code inspection
  | 'challenges'    // Level 5: Interactive coding challenges
  | 'project'       // Level 6: Real-world mini-project
  | 'mastery';      // Level 7: Final mastery quiz/test

export type SupportedLanguage = 'java' | 'python' | 'cpp';

export type StepType = 
  | 'init'
  | 'hash_calc'
  | 'bucket_select'
  | 'compare'
  | 'collision'
  | 'probing'
  | 'insert'
  | 'update'
  | 'delete'
  | 'found'
  | 'not_found'
  | 'duplicate_reject'
  | 'bubble_up'
  | 'bubble_down'
  | 'swap'
  | 'heapify_step'
  | 'invariant_check'
  | 'complete';

export interface StepHighlight {
  nodeId?: string | number;
  bucketIndex?: number;
  arrayIndex?: number;
  secondaryIndex?: number;
  lineNumbers?: {
    java?: number[];
    python?: number[];
    cpp?: number[];
  };
  color?: 'default' | 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'cyan';
}

export interface AnimationStep<TState = any> {
  stepIndex: number;
  totalSteps: number;
  type: StepType;
  title: string;
  description: string;
  codeHighlight?: {
    java?: number;
    python?: number;
    cpp?: number;
  };
  state: TState;
  highlights?: StepHighlight[];
  explanation: {
    why: string;
    whatHappened: string;
    invariant?: string;
  };
}

// HashMap types
export interface HashNode {
  key: string;
  value: string;
  hash: number;
  id: string;
}

export type CollisionMode = 'chaining' | 'linear_probing' | 'quadratic_probing';
export type HashFunctionType = 'sum_mod' | 'polynomial' | 'first_char';

export interface HashMapState {
  buckets: (HashNode[] | HashNode | null)[];
  capacity: number;
  size: number;
  collisionMode: CollisionMode;
  hashFunction: HashFunctionType;
  lastCalculatedHash?: number;
  lastTargetBucket?: number;
}

// HashSet types
export interface HashSetState {
  buckets: string[][];
  capacity: number;
  size: number;
  lastCheckedItem?: string;
  isDuplicate?: boolean;
}

// MinHeap types
export interface MinHeapNode {
  val: number;
  id: string;
}

export interface MinHeapState {
  array: MinHeapNode[];
  activeIndices?: number[];
  comparingIndices?: [number, number];
  swappingIndices?: [number, number];
}

// IndexHeap types
export interface IndexHeapState {
  pq: number[];     // heap array: pq[pos] = itemId (0-based heap pos to itemId)
  qp: number[];     // inverse array: qp[itemId] = heap pos (-1 if not in heap)
  keys: (number | null)[]; // keys[itemId] = actual priority value
  capacity: number;
  size: number;
  invariantValid: boolean;
  activeId?: number;
  activePqPos?: number;
  swappingPq?: [number, number];
  comparingPq?: [number, number];
}

