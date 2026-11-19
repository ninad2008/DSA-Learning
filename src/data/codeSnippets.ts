import { SupportedLanguage } from '../types/dsa';

export interface CodeSet {
  java: string[];
  python: string[];
  cpp: string[];
}

export const CODE_SNIPPETS: Record<string, CodeSet> = {
  hashmap_insert: {
    java: [
      '// Java: HashMap Insert',
      'int hash = Math.abs(key.hashCode()) % capacity;',
      'Node head = table[hash];',
      'for (Node curr = head; curr != null; curr = curr.next) {',
      '    if (curr.key.equals(key)) {',
      '        curr.value = value; // Update existing',
      '        return;',
      '    }',
      '}',
      'Node newNode = new Node(key, value, head);',
      'table[hash] = newNode; // Separate chaining',
      'size++;'
    ],
    python: [
      '# Python: HashMap Insert',
      'bucket_idx = hash(key) % capacity',
      'bucket = table[bucket_idx]',
      'for i, (k, v) in enumerate(bucket):',
      '    if k == key:',
      '        bucket[i] = (key, value) # Update existing',
      '        return',
      'bucket.append((key, value)) # Separate chaining',
      'size += 1'
    ],
    cpp: [
      '// C++: HashMap Insert',
      'size_t bucket_idx = std::hash<string>{}(key) % capacity;',
      'auto& chain = table[bucket_idx];',
      'for (auto& pair : chain) {',
      '    if (pair.first == key) {',
      '        pair.second = value; // Update',
      '        return;',
      '    }',
      '}',
      'chain.emplace_back(key, value); // Chaining',
      'size++;'
    ]
  },
  hashmap_search: {
    java: [
      '// Java: HashMap Search (get)',
      'int hash = Math.abs(key.hashCode()) % capacity;',
      'Node curr = table[hash];',
      'while (curr != null) {',
      '    if (curr.key.equals(key)) {',
      '        return curr.value; // Found!',
      '    }',
      '    curr = curr.next;',
      '}',
      'return null; // Not found'
    ],
    python: [
      '# Python: HashMap Search',
      'bucket_idx = hash(key) % capacity',
      'bucket = table[bucket_idx]',
      'for k, v in bucket:',
      '    if k == key:',
      '        return v # Found!',
      'return None # Not found'
    ],
    cpp: [
      '// C++: HashMap Search',
      'size_t idx = std::hash<string>{}(key) % capacity;',
      'for (const auto& pair : table[idx]) {',
      '    if (pair.first == key) {',
      '        return pair.second; // Found!',
      '    }',
      '}',
      'return std::nullopt; // Not found'
    ]
  },
  hashset_add: {
    java: [
      '// Java: HashSet Add',
      'int hash = Math.abs(val.hashCode()) % capacity;',
      'List<String> bucket = buckets[hash];',
      'if (bucket.contains(val)) {',
      '    return false; // Duplicate rejected!',
      '}',
      'bucket.add(val);',
      'size++;',
      'return true;'
    ],
    python: [
      '# Python: HashSet Add',
      'idx = hash(val) % capacity',
      'bucket = buckets[idx]',
      'if val in bucket:',
      '    return False # Duplicate rejected!',
      'bucket.append(val)',
      'size += 1',
      'return True'
    ],
    cpp: [
      '// C++: HashSet Add',
      'size_t idx = std::hash<string>{}(val) % capacity;',
      'auto& bucket = buckets[idx];',
      'if (std::find(bucket.begin(), bucket.end(), val) != bucket.end()) {',
      '    return false; // Duplicate rejected!',
      '}',
      'bucket.push_back(val);',
      'size++;',
      'return true;'
    ]
  },
  minheap_insert: {
    java: [
      '// Java: Min Heap Insert (Bubble Up)',
      'heap.add(val); // Insert at end',
      'int curr = heap.size() - 1;',
      'while (curr > 0) {',
      '    int parent = (curr - 1) / 2;',
      '    if (heap.get(curr) < heap.get(parent)) {',
      '        Collections.swap(heap, curr, parent);',
      '        curr = parent;',
      '    } else break;',
      '}'
    ],
    python: [
      '# Python: Min Heap Insert (Bubble Up)',
      'heap.append(val) # Insert at end',
      'curr = len(heap) - 1',
      'while curr > 0:',
      '    parent = (curr - 1) // 2',
      '    if heap[curr] < heap[parent]:',
      '        heap[curr], heap[parent] = heap[parent], heap[curr]',
      '        curr = parent',
      '    else: break'
    ],
    cpp: [
      '// C++: Min Heap Insert (Bubble Up)',
      'heap.push_back(val); // Insert at end',
      'int curr = heap.size() - 1;',
      'while (curr > 0) {',
      '    int parent = (curr - 1) / 2;',
      '    if (heap[curr] < heap[parent]) {',
      '        std::swap(heap[curr], heap[parent]);',
      '        curr = parent;',
      '    } else break;',
      '}'
    ]
  },
  minheap_extract_min: {
    java: [
      '// Java: Min Heap Extract Min (Bubble Down)',
      'int min = heap.get(0); // Root is min',
      'int last = heap.remove(heap.size() - 1);',
      'if (!heap.isEmpty()) {',
      '    heap.set(0, last); // Move last to root',
      '    sink(0); // Bubble down to restore min-heap property',
      '}',
      'return min;'
    ],
    python: [
      '# Python: Min Heap Extract Min',
      'min_val = heap[0] # Root is min',
      'last_val = heap.pop()',
      'if heap:',
      '    heap[0] = last_val # Move last to root',
      '    sink(0) # Bubble down',
      'return min_val'
    ],
    cpp: [
      '// C++: Min Heap Extract Min',
      'int min_val = heap[0];',
      'heap[0] = heap.back();',
      'heap.pop_back();',
      'if (!heap.empty()) {',
      '    sink(0); // Bubble down',
      '}',
      'return min_val;'
    ]
  },
  indexheap_operations: {
    java: [
      '// Java: Index Min Heap (pq, qp, keys)',
      '// Invariant: qp[pq[i]] == i && pq[qp[id]] == id',
      'public void changeKey(int id, int newKey) {',
      '    int pos = qp[id]; // O(1) direct position lookup!',
      '    keys[id] = newKey;',
      '    swim(pos); // Try bubble up',
      '    sink(pos); // Try bubble down',
      '}',
      'private void swap(int i, int j) {',
      '    int t = pq[i]; pq[i] = pq[j]; pq[j] = t;',
      '    qp[pq[i]] = i; qp[pq[j]] = j; // Keep qp in sync!',
      '}'
    ],
    python: [
      '# Python: Index Min Heap (pq, qp, keys)',
      '# Invariant: qp[pq[i]] == i',
      'def change_key(self, item_id, new_key):',
      '    pos = self.qp[item_id] # O(1) position lookup!',
      '    self.keys[item_id] = new_key',
      '    self.swim(pos)',
      '    self.sink(pos)',
      'def swap(self, i, j):',
      '    self.pq[i], self.pq[j] = self.pq[j], self.pq[i]',
      '    self.qp[self.pq[i]] = i',
      '    self.qp[self.pq[j]] = j'
    ],
    cpp: [
      '// C++: Index Min Heap (pq, qp, keys)',
      '// Invariant: qp[pq[i]] == i',
      'void changeKey(int id, int newKey) {',
      '    int pos = qp[id]; // O(1) direct position lookup!',
      '    keys[id] = newKey;',
      '    swim(pos);',
      '    sink(pos);',
      '}',
      'void swap(int i, int j) {',
      '    std::swap(pq[i], pq[j]);',
      '    qp[pq[i]] = i; qp[pq[j]] = j; // Sync inverse array',
      '}'
    ]
  }
};

