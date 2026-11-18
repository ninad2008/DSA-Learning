import { ModuleId, LevelId } from '../types/dsa';

export interface ModuleMetadata {
  id: ModuleId;
  title: string;
  tagline: string;
  icon: string;
  themeColor: string;
  accentColor: string;
  gradient: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedHours: string;
  realWorldUseCase: string;
  levels: {
    id: LevelId;
    title: string;
    description: string;
    xp: number;
    coins: number;
  }[];
  conceptGuide: {
    introduction: string;
    keyTerms: { term: string; definition: string }[];
    coreMechanics: string[];
    timeComplexity: { operation: string; average: string; worst: string; explanation: string }[];
    spaceComplexity: string;
    realWorldExamples: string[];
  };
  quizQuestions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export const MODULES_DATA: Record<ModuleId, ModuleMetadata> = {
  hashmap: {
    id: 'hashmap',
    title: 'HashMap Explorer',
    tagline: 'Master associative arrays, hash functions, and collision resolution.',
    icon: 'Hash',
    themeColor: '#8b5cf6',
    accentColor: '#a78bfa',
    gradient: 'from-purple-900/60 via-purple-950/40 to-slate-950',
    description: 'Learn how HashMaps deliver blistering O(1) average key-value lookups by transforming arbitrary keys into array bucket indices.',
    difficulty: 'Beginner',
    estimatedHours: '2.5 hrs',
    realWorldUseCase: 'Caches (Redis), Database indexing, Compiler symbol tables, JSON object lookups.',
    levels: [
      { id: 'concept', title: 'Level 1: Understand Concept', description: 'What is a HashMap, key-value pairs, hash functions, and collisions.', xp: 50, coins: 20 },
      { id: 'visual', title: 'Level 2: Visual Simulation', description: 'Interact with 10 visual buckets. Watch hash math and collisions live.', xp: 80, coins: 25 },
      { id: 'manual', title: 'Level 3: Manual Operations', description: 'Insert, search, and delete keys with custom hash functions.', xp: 90, coins: 30 },
      { id: 'code', title: 'Level 4: Code Inspection', description: 'Step through Java, Python, and C++ implementations line by line.', xp: 100, coins: 35 },
      { id: 'challenges', title: 'Level 5: Solve Challenges', description: 'Two Sum, Group Anagrams, Element Frequencies, and First Non-Repeating.', xp: 150, coins: 50 },
      { id: 'project', title: 'Level 6: Mini-Project', description: 'Build a Student Marks & Frequency Tracker application.', xp: 180, coins: 60 },
      { id: 'mastery', title: 'Level 7: Final Mastery Test', description: 'Test your deep knowledge to earn the Hash Hunter badge.', xp: 200, coins: 80 },
    ],
    conceptGuide: {
      introduction: 'A HashMap (or Hash Table) is an associative data structure that stores key-value pairs. Given a key, a hash function computes an integer bucket index in O(1) average time, enabling instantaneous inserts, lookups, and deletions.',
      keyTerms: [
        { term: 'Key-Value Pair', definition: 'The fundamental unit stored in a map. The key is unique and used for addressing; the value is the associated data.' },
        { term: 'Hash Function', definition: 'A deterministic algorithm that maps keys of arbitrary size to a fixed-size integer index within [0..capacity-1].' },
        { term: 'Hash Collision', definition: 'When two different keys produce the exact same bucket index: hash(k1) == hash(k2).' },
        { term: 'Separate Chaining', definition: 'Resolves collisions by having each bucket point to a linked list or dynamic list of colliding elements.' },
        { term: 'Open Addressing', definition: 'Resolves collisions by probing subsequent slots in the table (e.g. Linear Probing: index + 1, + 2, etc.) until an empty slot is found.' },
        { term: 'Load Factor (α)', definition: 'Ratio of stored elements to table capacity: α = N / capacity. Usually rehashed when α > 0.75.' },
      ],
      coreMechanics: [
        '1. Compute integer hash: index = hash(key) % capacity.',
        '2. Inspect bucket[index].',
        '3. If key matches an existing entry, update its value.',
        '4. If slot is occupied by a different key (collision), append to chain or probe next slot.',
        '5. If load factor threshold exceeded, allocate larger table (typically 2x) and rehash all keys.',
      ],
      timeComplexity: [
        { operation: 'Insert', average: 'O(1)', worst: 'O(N)', explanation: 'O(1) with uniform hash distribution; O(N) if all keys hash to the same bucket (worst-case collision cascade).' },
        { operation: 'Search / Get', average: 'O(1)', worst: 'O(N)', explanation: 'O(1) direct bucket lookup; O(N) if searching an elongated linked list in a single bucket.' },
        { operation: 'Delete', average: 'O(1)', worst: 'O(N)', explanation: 'O(1) pointer unlinking or tombstone marking.' },
      ],
      spaceComplexity: 'O(N) where N is the number of inserted key-value pairs.',
      realWorldExamples: [
        'Web Server Session Caches: Session ID -> User profile state.',
        'DNS Resolver Caches: Domain name -> IP address.',
        'Database Primary Key Indexing (Hash Indexes in Postgres/MySQL).',
        'JSON Object representation in V8 (JavaScript engines).'
      ]
    },
    quizQuestions: [
      {
        id: 'hm_q1',
        question: 'What is the primary purpose of a hash function in a HashMap?',
        options: [
          'To sort the elements in ascending order',
          'To map arbitrary keys to fixed-range numerical bucket indices',
          'To compress the values to save disk space',
          'To encrypt passwords securely'
        ],
        correctIndex: 1,
        explanation: 'A hash function deterministically translates keys into integer bucket indices so lookups can jump straight to the right memory location.'
      },
      {
        id: 'hm_q2',
        question: 'What causes a hash collision?',
        options: [
          'When two identical keys are inserted twice',
          'When the HashMap runs out of memory',
          'When two distinct keys produce the same bucket index via the hash function',
          'When a key contains special characters'
        ],
        correctIndex: 2,
        explanation: 'By the Pigeonhole Principle, since the domain of possible keys is larger than the number of buckets, distinct keys will eventually yield the same bucket index.'
      },
      {
        id: 'hm_q3',
        question: 'In Separate Chaining, how are colliding elements stored?',
        options: [
          'The older element is overwritten and discarded',
          'Colliding elements are stored in a linked list or chain attached to that bucket',
          'They are placed in the next adjacent bucket',
          'The table size is immediately doubled'
        ],
        correctIndex: 1,
        explanation: 'In Separate Chaining, each bucket slot is the head of a linked list. Colliding nodes are simply appended to this chain.'
      },
      {
        id: 'hm_q4',
        question: 'What is the standard load factor threshold used in Java HashMap before triggering rehashing?',
        options: ['0.25', '0.50', '0.75', '1.00'],
        correctIndex: 2,
        explanation: 'Java HashMap defaults to a load factor of 0.75, which offers a mathematically optimal balance between time performance and memory overhead.'
      }
    ]
  },

  hashset: {
    id: 'hashset',
    title: 'HashSet Adventure',
    tagline: 'Master uniqueness guarantees, mathematical sets, and instant duplicate detection.',
    icon: 'ShieldCheck',
    themeColor: '#06b6d4',
    accentColor: '#67e8f9',
    gradient: 'from-cyan-900/60 via-cyan-950/40 to-slate-950',
    description: 'Explore mathematical sets in code. Understand how HashSet uses hashing to enforce uniqueness and reject duplicate elements in O(1) time.',
    difficulty: 'Beginner',
    estimatedHours: '2.0 hrs',
    realWorldUseCase: 'Deduplicating streaming data, Graph visited sets (BFS/DFS), Spellcheckers, Unique username registration.',
    levels: [
      { id: 'concept', title: 'Level 1: Understand Concept', description: 'HashSet vs HashMap, unique sets, and duplicate rejection.', xp: 50, coins: 20 },
      { id: 'visual', title: 'Level 2: Visual Simulation', description: 'Watch duplicate insertions get rejected with visual red alerts.', xp: 80, coins: 25 },
      { id: 'manual', title: 'Level 3: Manual Operations', description: 'Add, test membership with contains(), and remove elements.', xp: 90, coins: 30 },
      { id: 'code', title: 'Level 4: Code Inspection', description: 'Study HashSet internals and how it wraps a backing HashMap.', xp: 100, coins: 35 },
      { id: 'challenges', title: 'Level 5: Solve Challenges', description: 'Duplicate Detection, Intersection of Two Arrays, and Longest Consecutive Sequence.', xp: 150, coins: 50 },
      { id: 'project', title: 'Level 6: Mini-Project', description: 'Build a Live Unique Username Validator & Stream Deduplicator.', xp: 180, coins: 60 },
      { id: 'mastery', title: 'Level 7: Final Mastery Test', description: 'Prove set theory mastery to earn the Duplicate Detective badge.', xp: 200, coins: 80 },
    ],
    conceptGuide: {
      introduction: 'A HashSet represents an unordered collection of unique elements. Internally, most standard libraries (Java, Python, C++) implement a HashSet using a HashMap under the hood, where elements are stored as keys and associated with a dummy sentinel value.',
      keyTerms: [
        { term: 'Uniqueness Invariant', definition: 'A HashSet can never contain duplicate elements. Adding an existing element returns false and leaves the set unchanged.' },
        { term: 'Backing Map', definition: 'In Java and C++, HashSet is essentially a HashMap<K, Object> where all values point to a static dummy object.' },
        { term: 'Set Intersection (A ∩ B)', definition: 'Elements present in both set A and set B.' },
        { term: 'Set Union (A ∪ B)', definition: 'All unique elements present in either set A or set B.' },
        { term: 'Set Difference (A \\ B)', definition: 'Elements present in A that are not in B.' },
      ],
      coreMechanics: [
        '1. To add element X: compute bucket = hash(X) % capacity.',
        '2. Scan bucket for an item equal to X.',
        '3. If found: reject addition (return false), leaving the set unchanged.',
        '4. If not found: insert X into bucket, increment size, and return true.',
      ],
      timeComplexity: [
        { operation: 'Add', average: 'O(1)', worst: 'O(N)', explanation: 'O(1) hash check; returns false if already present.' },
        { operation: 'Contains (Membership)', average: 'O(1)', worst: 'O(N)', explanation: 'O(1) bucket jump to verify if element is stored.' },
        { operation: 'Remove', average: 'O(1)', worst: 'O(N)', explanation: 'O(1) bucket unlinking.' },
      ],
      spaceComplexity: 'O(N) to store N distinct elements.',
      realWorldExamples: [
        'Search Engine Crawlers: Visited URLs set to avoid infinite loops.',
        'Social Media: Unique user follower counts.',
        'Network Firewalls: Blocklisted IP addresses lookup.',
        'Spell Checkers: Dictionary of valid unique words.'
      ]
    },
    quizQuestions: [
      {
        id: 'hs_q1',
        question: 'What is the fundamental difference between a HashSet and a HashMap?',
        options: [
          'HashSet allows duplicates, HashMap does not',
          'HashMap stores key-value pairs; HashSet stores only unique values (keys)',
          'HashSet is always sorted; HashMap is not',
          'HashSet uses a binary search tree while HashMap uses an array'
        ],
        correctIndex: 1,
        explanation: 'A HashMap maps unique keys to values. A HashSet stores only keys (elements), guaranteeing uniqueness.'
      },
      {
        id: 'hs_q2',
        question: 'What happens when you call set.add(x) with an element x that is already inside the HashSet?',
        options: [
          'A runtime exception is thrown',
          'The existing element is duplicated',
          'The operation returns false and the set remains unchanged',
          'The entire set is cleared'
        ],
        correctIndex: 2,
        explanation: 'HashSet preserves uniqueness: if x is already present, add() rejects it and returns false without modifying the set.'
      },
      {
        id: 'hs_q3',
        question: 'How is HashSet typically implemented in Java under the hood?',
        options: [
          'Using a dynamic array that checks all elements with a for loop',
          'Using a backing HashMap where elements are keys and values are a dummy constant',
          'Using a doubly-linked list',
          'Using a heap'
        ],
        correctIndex: 1,
        explanation: 'Java `java.util.HashSet` is backed by a `HashMap`, reusing its bucket hashing and collision mechanisms directly.'
      }
    ]
  },

  minheap: {
    id: 'minheap',
    title: 'Min Heap Master',
    tagline: 'Master complete binary trees, array indexing, and priority queues.',
    icon: 'GitPullRequest',
    themeColor: '#3b82f6',
    accentColor: '#93c5fd',
    gradient: 'from-blue-900/60 via-blue-950/40 to-slate-950',
    description: 'Master binary heaps. Visualize complete binary trees mapped seamlessly to 1D arrays, with synchronized bubbling up (swim) and bubbling down (sink).',
    difficulty: 'Intermediate',
    estimatedHours: '3.0 hrs',
    realWorldUseCase: 'Operating System task schedulers, Dijkstra shortest paths, Huffman coding, Kth-element finders.',
    levels: [
      { id: 'concept', title: 'Level 1: Understand Concept', description: 'Binary heaps, complete binary trees, and parent-child array math.', xp: 50, coins: 20 },
      { id: 'visual', title: 'Level 2: Visual Simulation', description: 'Synchronized visual tree alongside its 1D array representation.', xp: 80, coins: 25 },
      { id: 'manual', title: 'Level 3: Manual Operations', description: 'Perform Insert (bubble-up) and Extract-Min (bubble-down) step by step.', xp: 90, coins: 30 },
      { id: 'code', title: 'Level 4: Code Inspection', description: 'Analyze swim/sink and bottom-up O(N) heapify implementations.', xp: 100, coins: 35 },
      { id: 'challenges', title: 'Level 5: Solve Challenges', description: 'Kth Largest Element, K Smallest Elements, Merge K Sorted Lists.', xp: 150, coins: 50 },
      { id: 'project', title: 'Level 6: Mini-Project', description: 'Build an Operating System CPU Priority Task Scheduler.', xp: 180, coins: 60 },
      { id: 'mastery', title: 'Level 7: Final Mastery Test', description: 'Pass the heap certification test to earn the Heap Hero badge.', xp: 200, coins: 80 },
    ],
    conceptGuide: {
      introduction: 'A Min Heap is a Complete Binary Tree where every parent node has a value less than or equal to its children. This ensures the root node (index 0) is always the minimum element in the entire structure.',
      keyTerms: [
        { term: 'Complete Binary Tree', definition: 'Every tree level is completely filled except possibly the last level, which is filled strictly from left to right.' },
        { term: 'Min Heap Invariant', definition: 'For every node i (except root): heap[parent(i)] <= heap[i].' },
        { term: 'Array Indexing Math', definition: 'Parent(i) = floor((i-1)/2), LeftChild(i) = 2i + 1, RightChild(i) = 2i + 2.' },
        { term: 'Bubble Up (Swim / Sift Up)', definition: 'Moving a newly inserted element upward by swapping with its parent until parent <= child.' },
        { term: 'Bubble Down (Sink / Sift Down)', definition: 'Restoring heap order after root extraction by swapping with the smaller of its two children.' },
        { term: 'Heapify', definition: 'Converting an arbitrary array of N elements into a valid heap in linear O(N) time.' },
      ],
      coreMechanics: [
        '1. Insert: Append to end of array -> bubble up while child < parent.',
        '2. Get Min: Inspect heap[0] in O(1) time.',
        '3. Extract Min: Swap root with last element -> pop last -> bubble down root with smaller child.',
        '4. Heapify: Iterate from floor(N/2) - 1 down to 0, sinking each subtree.',
      ],
      timeComplexity: [
        { operation: 'Get Minimum', average: 'O(1)', worst: 'O(1)', explanation: 'Direct access to root array[0].' },
        { operation: 'Insert', average: 'O(log N)', worst: 'O(log N)', explanation: 'Swaps upward along at most the tree height h = floor(log2 N).' },
        { operation: 'Extract Min', average: 'O(log N)', worst: 'O(log N)', explanation: 'Sinks downward along tree height h = floor(log2 N).' },
        { operation: 'Build Heap (Heapify)', average: 'O(N)', worst: 'O(N)', explanation: 'Bottom-up mathematical summation yields linear time O(N).' },
      ],
      spaceComplexity: 'O(N) contiguous array storage with zero pointer overhead.',
      realWorldExamples: [
        'Operating System CPU schedulers selecting highest priority threads.',
        'Dijkstra Shortest Path Algorithm for network packet routing.',
        'Event-Driven Simulation engines processing timestamped events.',
        'Data streaming algorithms finding real-time top-K percentiles.'
      ]
    },
    quizQuestions: [
      {
        id: 'mh_q1',
        question: 'Given a node at index i in a 0-indexed heap array, what is the formula for its left child?',
        options: ['2 * i', '2 * i + 1', '2 * i + 2', '(i - 1) / 2'],
        correctIndex: 1,
        explanation: 'For 0-based indexing: left child is 2*i + 1, right child is 2*i + 2, and parent is floor((i-1)/2).'
      },
      {
        id: 'mh_q2',
        question: 'Why can a binary heap be stored in a simple array without pointers?',
        options: [
          'Because all heap values are prime numbers',
          'Because it is a Complete Binary Tree with deterministic child/parent index math',
          'Because it only has one child per node',
          'Because modern CPUs automatically convert trees to arrays'
        ],
        correctIndex: 1,
        explanation: 'Because complete binary trees have no missing nodes between indices 0 and N-1, parent and child positions are purely mathematical functions of the index.'
      },
      {
        id: 'mh_q3',
        question: 'When bubbling down during Extract-Min, which child must the parent swap with?',
        options: [
          'The larger child',
          'The left child always',
          'The smaller of the two children',
          'The right child always'
        ],
        correctIndex: 2,
        explanation: 'Swapping with the smaller child ensures that when that child becomes the new parent, it will be strictly smaller than both its new sibling and children.'
      },
      {
        id: 'mh_q4',
        question: 'What is the time complexity to build a Min Heap from an unsorted array of size N using bottom-up heapify?',
        options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(1)'],
        correctIndex: 1,
        explanation: 'Bottom-up heapify runs in linear O(N) time because the majority of nodes are near the bottom of the tree and sink at most 1 or 2 levels.'
      }
    ]
  },

  indexheap: {
    id: 'indexheap',
    title: 'Index Heap Challenge',
    tagline: 'Master the 3-array invariant: pq[], qp[], and keys[] for O(log N) changeKey & delete.',
    icon: 'Binary',
    themeColor: '#10b981',
    accentColor: '#6ee7b7',
    gradient: 'from-emerald-900/60 via-emerald-950/40 to-slate-950',
    description: 'Tackle the ultimate priority queue. Master Index Min Heap with pq (heap order), qp (inverse positions), and keys, maintaining the live invariant qp[pq[i]] == i.',
    difficulty: 'Advanced',
    estimatedHours: '3.5 hrs',
    realWorldUseCase: 'Dijkstra with decrease-key in O((V + E) log V), Prim minimum spanning tree, dynamic emergency room triage.',
    levels: [
      { id: 'concept', title: 'Level 1: Understand Concept', description: 'Why normal heaps fail at changeKey and how Index Heap solves it.', xp: 60, coins: 25 },
      { id: 'visual', title: 'Level 2: Visual Simulation', description: 'Watch the 3 arrays (pq, qp, keys) sync live with color-coded links.', xp: 90, coins: 30 },
      { id: 'manual', title: 'Level 3: Manual Operations', description: 'Perform Insert, ChangeKey, and Delete by ID with live invariant validation.', xp: 110, coins: 35 },
      { id: 'code', title: 'Level 4: Code Inspection', description: 'Study the bidirectional swap method: swap pq[i], pq[j] and update qp.', xp: 120, coins: 40 },
      { id: 'challenges', title: 'Level 5: Solve Challenges', description: 'Indexed Priority Queue implementation and Dynamic Task Rescheduling.', xp: 170, coins: 60 },
      { id: 'project', title: 'Level 6: Mini-Project', description: 'Build an ER Hospital Patient Triage & Dynamic Priority Dispatcher.', xp: 200, coins: 75 },
      { id: 'mastery', title: 'Level 7: Final Mastery Test', description: 'Conquer the toughest test to earn the prestigious Index Master badge.', xp: 250, coins: 100 },
    ],
    conceptGuide: {
      introduction: 'In a standard Min Heap, finding an element by its external ID requires an O(N) linear search, making operations like `changePriority(id, newPriority)` or `delete(id)` sluggish O(N). An Index Min Heap solves this by introducing an inverse array `qp[]` that maps every item ID to its current heap position in O(1) time!',
      keyTerms: [
        { term: 'pq[] (Priority Queue Array)', definition: 'Stores original item IDs arranged in min-heap order: pq[heap_pos] = item_id.' },
        { term: 'qp[] (Inverse Position Array)', definition: 'Maps original item ID to its current position in pq: qp[item_id] = heap_pos. Set to -1 if item is not in heap.' },
        { term: 'keys[] (Priority Values)', definition: 'Stores actual numerical priorities: keys[item_id] = priority.' },
        { term: 'The Golden Invariant', definition: 'qp[pq[i]] == i for every heap position i, and pq[qp[id]] == id for every item in the heap.' },
        { term: 'Decrease Key / Change Key', definition: 'Instantly find pos = qp[id], update keys[id], and swim/sink in O(log N) time.' },
      ],
      coreMechanics: [
        '1. Insert(id, key): keys[id] = key; pos = pq.length; pq.push(id); qp[id] = pos; swim(pos).',
        '2. Swap(i, j): swap(pq[i], pq[j]); qp[pq[i]] = i; qp[pq[j]] = j. (Always synchronize qp!).',
        '3. ChangeKey(id, newKey): pos = qp[id]; keys[id] = newKey; swim(pos); sink(pos).',
        '4. Delete(id): pos = qp[id]; swap(pos, last); pop(); qp[id] = -1; swim/sink(pos).',
      ],
      timeComplexity: [
        { operation: 'Get Minimum', average: 'O(1)', worst: 'O(1)', explanation: 'pq[0] gives min ID; keys[pq[0]] gives min value.' },
        { operation: 'Insert(id, key)', average: 'O(log N)', worst: 'O(log N)', explanation: 'Append and swim upward.' },
        { operation: 'ChangeKey(id, key)', average: 'O(log N)', worst: 'O(log N)', explanation: 'O(1) position lookup via qp[id] + O(log N) sift! (Standard heap is O(N)!).' },
        { operation: 'Delete(id)', average: 'O(log N)', worst: 'O(log N)', explanation: 'O(1) position lookup via qp[id] + O(log N) sift after swapping with last.' },
      ],
      spaceComplexity: 'O(Capacity) to store pq, qp, and keys arrays.',
      realWorldExamples: [
        'Dijkstra Shortest Path Algorithm: Updating tentative distances to vertices.',
        'Prim Minimum Spanning Tree: Updating edge weights to candidate vertices.',
        'Hospital Emergency Triage: Upgrading patient urgency if condition deteriorates.',
        'High-Frequency Trading: Updating price limits of existing order IDs in the book.'
      ]
    },
    quizQuestions: [
      {
        id: 'ih_q1',
        question: 'What is the main limitation of a normal Min Heap that Index Min Heap solves?',
        options: [
          'Normal heap cannot extract the minimum in O(1)',
          'Normal heap takes O(N) to locate an item by ID, making changePriority and arbitrary delete slow',
          'Normal heap cannot store integers',
          'Normal heap cannot be represented in an array'
        ],
        correctIndex: 1,
        explanation: 'In a regular heap, elements are reshuffled without tracking their original identity, requiring an O(N) scan to find an element before updating or deleting it.'
      },
      {
        id: 'ih_q2',
        question: 'What does the inverse array qp[id] store in an Index Heap?',
        options: [
          'The priority value of item id',
          'The parent of item id',
          'The current position of item id inside the heap array pq[]',
          'The number of times item id was swapped'
        ],
        correctIndex: 2,
        explanation: 'qp[id] maps the original item ID directly to its current heap index inside pq[]. When id is not in the heap, qp[id] is -1.'
      },
      {
        id: 'ih_q3',
        question: 'What is the fundamental invariant that MUST hold true in an Index Heap?',
        options: [
          'pq[i] == qp[i]',
          'qp[pq[i]] == i for all valid heap positions i',
          'keys[i] == i',
          'pq.length == keys.length'
        ],
        correctIndex: 1,
        explanation: 'Because qp is the inverse permutation of pq: if heap position i holds item id (pq[i] == id), then qp[id] MUST equal i!'
      },
      {
        id: 'ih_q4',
        question: 'When swapping two elements at heap positions i and j in pq, what must be done to qp?',
        options: [
          'Nothing, qp never changes',
          'qp is completely recomputed from scratch in O(N) time',
          'qp[pq[i]] = i and qp[pq[j]] = j must be updated immediately',
          'qp is deleted and recreated'
        ],
        correctIndex: 2,
        explanation: 'Whenever pq[i] and pq[j] swap, their inverse references in qp must also be swapped: qp[pq[i]] = i and qp[pq[j]] = j.'
      }
    ]
  }
};
