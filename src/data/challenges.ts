import { Challenge } from '../types/challenges';

export const ALL_CHALLENGES: Challenge[] = [
  // HASHMAP CHALLENGES
  {
    id: 'hm_frequency',
    moduleId: 'hashmap',
    title: 'Frequency of Elements',
    difficulty: 'Beginner',
    xpReward: 80,
    coinReward: 25,
    description: 'Given an array of strings, count the frequency of each distinct string using a HashMap and return the counts formatted as key-value pairs.',
    examples: [
      {
        input: '["apple", "banana", "apple", "cherry", "banana", "apple"]',
        output: '{"apple": 3, "banana": 2, "cherry": 1}',
        explanation: '"apple" appears 3 times, "banana" 2 times, and "cherry" 1 time.'
      }
    ],
    constraints: ['1 <= nums.length <= 10^5', 'Key strings have length <= 20'],
    starterCode: {
      python: `def element_frequency(items):\n    # TODO: Build frequency map using dictionary\n    freq = {}\n    for item in items:\n        freq[item] = freq.get(item, 0) + 1\n    return freq\n`,
      java: `public Map<String, Integer> elementFrequency(String[] items) {\n    Map<String, Integer> freq = new HashMap<>();\n    for (String item : items) {\n        freq.put(item, freq.getOrDefault(item, 0) + 1);\n    }\n    return freq;\n}`,
      cpp: `unordered_map<string, int> elementFrequency(const vector<string>& items) {\n    unordered_map<string, int> freq;\n    for (const auto& item : items) {\n        freq[item]++;\n    }\n    return freq;\n}`
    },
    solutionCode: {
      python: `def element_frequency(items):\n    freq = {}\n    for item in items:\n        freq[item] = freq.get(item, 0) + 1\n    return freq`,
      java: `public Map<String, Integer> elementFrequency(String[] items) {\n    Map<String, Integer> freq = new HashMap<>();\n    for (String item : items) freq.put(item, freq.getOrDefault(item, 0) + 1);\n    return freq;\n}`,
      cpp: `unordered_map<string, int> elementFrequency(const vector<string>& items) {\n    unordered_map<string, int> freq;\n    for (const auto& item : items) freq[item]++;\n    return freq;\n}`
    },
    hints: [
      'Iterate through the list of items.',
      'For each item, check if it already exists in the map.',
      'If it does, increment its count by 1. Otherwise, initialize it with count 1.'
    ],
    testCases: [
      {
        id: 'tc1',
        input: '["apple", "banana", "apple", "cherry", "banana", "apple"]',
        expectedOutput: '{"apple": 3, "banana": 2, "cherry": 1}',
      },
      {
        id: 'tc2',
        input: '["code", "dsa", "code", "quest"]',
        expectedOutput: '{"code": 2, "dsa": 1, "quest": 1}',
      }
    ],
    timeComplexity: 'O(N) where N is number of elements.',
    spaceComplexity: 'O(U) where U is number of unique elements.',
    explanation: 'A single pass through the array updates the hash map in O(1) average time per element, achieving linear overall performance.',
    validatorFnName: 'validateFrequency'
  },
  {
    id: 'hm_two_sum',
    moduleId: 'hashmap',
    title: 'Two Sum (Classic)',
    difficulty: 'Intermediate',
    xpReward: 120,
    coinReward: 40,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target using a HashMap for O(N) time.',
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] == 2 + 7 == 9, so return [0, 1].'
      }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      python: `def two_sum(nums, target):\n    # Store seen number -> index in hash map\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n`,
      java: `public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int comp = target - nums[i];\n        if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (map.count(comp)) return {map[comp], i};\n        map[nums[i]] = i;\n    }\n    return {};\n}`
    },
    solutionCode: {
      python: `def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []`,
      java: `public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int comp = target - nums[i];\n        if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (map.count(comp)) return {map[comp], i};\n        map[nums[i]] = i;\n    }\n    return {};\n}`
    },
    hints: [
      'Instead of an O(N^2) brute force nested loop, check for the complement: target - nums[i].',
      'Store each number and its index in the HashMap as you iterate.',
      'Check if target - currentNum is already in the HashMap in O(1) time.'
    ],
    testCases: [
      {
        id: 'tc1',
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
      },
      {
        id: 'tc2',
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]',
      }
    ],
    timeComplexity: 'O(N) with a single pass.',
    spaceComplexity: 'O(N) to store seen elements.',
    explanation: 'By checking for complement = target - nums[i] in the map during the pass, we trade O(N) space to reduce the time from O(N^2) down to O(N).',
    validatorFnName: 'validateTwoSum'
  },
  {
    id: 'hm_first_unique',
    moduleId: 'hashmap',
    title: 'First Non-Repeating Character',
    difficulty: 'Intermediate',
    xpReward: 100,
    coinReward: 35,
    description: 'Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.',
    examples: [
      { input: 's = "leetcode"', output: '0', explanation: '"l" is unique and at index 0.' },
      { input: 's = "loveleetcode"', output: '2', explanation: '"v" is the first unique character.' }
    ],
    constraints: ['1 <= s.length <= 10^5', 's consists of only lowercase English letters.'],
    starterCode: {
      python: `def first_uniq_char(s):\n    counts = {}\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    for i, c in enumerate(s):\n        if counts[c] == 1:\n            return i\n    return -1\n`,
      java: `public int firstUniqChar(String s) {\n    Map<Character, Integer> counts = new HashMap<>();\n    for (char c : s.toCharArray()) counts.put(c, counts.getOrDefault(c, 0) + 1);\n    for (int i = 0; i < s.length(); i++) {\n        if (counts.get(s.charAt(i)) == 1) return i;\n    }\n    return -1;\n}`,
      cpp: `int firstUniqChar(string s) {\n    unordered_map<char, int> counts;\n    for (char c : s) counts[c]++;\n    for (int i = 0; i < s.size(); i++) {\n        if (counts[s[i]] == 1) return i;\n    }\n    return -1;\n}`
    },
    solutionCode: {
      python: `def first_uniq_char(s):\n    counts = {}\n    for c in s:\n        counts[c] = counts.get(c, 0) + 1\n    for i, c in enumerate(s):\n        if counts[c] == 1: return i\n    return -1`,
      java: `public int firstUniqChar(String s) {\n    Map<Character, Integer> counts = new HashMap<>();\n    for (char c : s.toCharArray()) counts.put(c, counts.getOrDefault(c, 0) + 1);\n    for (int i = 0; i < s.length(); i++) if (counts.get(s.charAt(i)) == 1) return i;\n    return -1;\n}`,
      cpp: `int firstUniqChar(string s) {\n    unordered_map<char, int> counts;\n    for (char c : s) counts[c]++;\n    for (int i = 0; i < s.size(); i++) if (counts[s[i]] == 1) return i;\n    return -1;\n}`
    },
    hints: ['Pass 1: Build frequency map.', 'Pass 2: Iterate string again, returning the index of the first character with frequency 1.'],
    testCases: [
      { id: 'tc1', input: '"leetcode"', expectedOutput: '0' },
      { id: 'tc2', input: '"loveleetcode"', expectedOutput: '2' },
      { id: 'tc3', input: '"aabb"', expectedOutput: '-1' }
    ],
    timeComplexity: 'O(N) with two passes.',
    spaceComplexity: 'O(1) because alphabet size <= 26.',
    explanation: 'Count frequencies in pass 1, then identify the first character with frequency 1 in pass 2.',
    validatorFnName: 'validateFirstUnique'
  },
  {
    id: 'hm_group_anagrams',
    moduleId: 'hashmap',
    title: 'Group Anagrams',
    difficulty: 'Advanced',
    xpReward: 160,
    coinReward: 60,
    description: 'Given an array of strings strs, group the anagrams together. Return the list of groups.',
    examples: [
      {
        input: '["eat","tea","tan","ate","nat","bat"]',
        output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
        explanation: '"eat", "tea", and "ate" are anagrams of each other.'
      }
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
    starterCode: {
      python: `from collections import defaultdict\ndef group_anagrams(strs):\n    groups = defaultdict(list)\n    for s in strs:\n        key = "".join(sorted(s))\n        groups[key].append(s)\n    return list(groups.values())\n`,
      java: `public List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> map = new HashMap<>();\n    for (String s : strs) {\n        char[] ca = s.toCharArray();\n        Arrays.sort(ca);\n        String key = String.valueOf(ca);\n        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(map.values());\n}`,
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> map;\n    for (const string& s : strs) {\n        string key = s;\n        sort(key.begin(), key.end());\n        map[key].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& pair : map) res.push_back(pair.second);\n    return res;\n}`
    },
    solutionCode: {
      python: `from collections import defaultdict\ndef group_anagrams(strs):\n    groups = defaultdict(list)\n    for s in strs:\n        groups["".join(sorted(s))].append(s)\n    return list(groups.values())`,
      java: `public List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> map = new HashMap<>();\n    for (String s : strs) {\n        char[] ca = s.toCharArray(); Arrays.sort(ca);\n        map.computeIfAbsent(String.valueOf(ca), k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(map.values());\n}`,
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> map;\n    for (const string& s : strs) {\n        string key = s; sort(key.begin(), key.end());\n        map[key].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& p : map) res.push_back(p.second);\n    return res;\n}`
    },
    hints: [
      'Two strings are anagrams if and only if their sorted versions are identical.',
      'Use the sorted string as the HashMap key: e.g. "aet" -> ["eat", "tea", "ate"].'
    ],
    testCases: [
      { id: 'tc1', input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '3 groups' }
    ],
    timeComplexity: 'O(N * K log K) where N is number of words and K is max word length.',
    spaceComplexity: 'O(N * K) to store the grouped strings.',
    explanation: 'Sorted strings act as canonical keys that map all anagram variants to the same bucket.',
    validatorFnName: 'validateGroupAnagrams'
  },

  // HASHSET CHALLENGES
  {
    id: 'hs_detect_duplicates',
    moduleId: 'hashset',
    title: 'Contains Duplicate',
    difficulty: 'Beginner',
    xpReward: 80,
    coinReward: 25,
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct. Use a HashSet for O(N) performance.',
    examples: [
      { input: '[1, 2, 3, 1]', output: 'true', explanation: '1 appears twice.' },
      { input: '[1, 2, 3, 4]', output: 'false', explanation: 'All elements distinct.' }
    ],
    constraints: ['1 <= nums.length <= 10^5'],
    starterCode: {
      python: `def contains_duplicate(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False\n`,
      java: `public boolean containsDuplicate(int[] nums) {\n    Set<Integer> seen = new HashSet<>();\n    for (int num : nums) {\n        if (!seen.add(num)) return true;\n    }\n    return false;\n}`,
      cpp: `bool containsDuplicate(vector<int>& nums) {\n    unordered_set<int> seen;\n    for (int num : nums) {\n        if (seen.count(num)) return true;\n        seen.insert(num);\n    }\n    return false;\n}`
    },
    solutionCode: {
      python: `def contains_duplicate(nums):\n    return len(nums) != len(set(nums))`,
      java: `public boolean containsDuplicate(int[] nums) {\n    Set<Integer> seen = new HashSet<>();\n    for (int n : nums) if (!seen.add(n)) return true;\n    return false;\n}`,
      cpp: `bool containsDuplicate(vector<int>& nums) {\n    unordered_set<int> seen;\n    for (int n : nums) if (!seen.insert(n).second) return true;\n    return false;\n}`
    },
    hints: [
      'Store seen elements in a HashSet.',
      'If the element is already in the set, a duplicate has been found!'
    ],
    testCases: [
      { id: 'tc1', input: '[1, 2, 3, 1]', expectedOutput: 'true' },
      { id: 'tc2', input: '[1, 2, 3, 4]', expectedOutput: 'false' }
    ],
    timeComplexity: 'O(N) time with early return.',
    spaceComplexity: 'O(N) to store distinct elements.',
    explanation: 'Adding to a HashSet checks membership in O(1) average time.',
    validatorFnName: 'validateContainsDuplicate'
  },
  {
    id: 'hs_intersection',
    moduleId: 'hashset',
    title: 'Intersection of Two Arrays',
    difficulty: 'Intermediate',
    xpReward: 110,
    coinReward: 35,
    description: 'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique.',
    examples: [
      { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2]' },
      { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[4, 9]' }
    ],
    constraints: ['1 <= nums1.length, nums2.length <= 1000'],
    starterCode: {
      python: `def intersection(nums1, nums2):\n    set1 = set(nums1)\n    return list(set1.intersection(nums2))\n`,
      java: `public int[] intersection(int[] nums1, int[] nums2) {\n    Set<Integer> set1 = new HashSet<>();\n    for (int n : nums1) set1.add(n);\n    Set<Integer> res = new HashSet<>();\n    for (int n : nums2) if (set1.contains(n)) res.add(n);\n    return res.stream().mapToInt(i -> i).toArray();\n}`,
      cpp: `vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {\n    unordered_set<int> s1(nums1.begin(), nums1.end());\n    unordered_set<int> res;\n    for (int n : nums2) if (s1.count(n)) res.insert(n);\n    return vector<int>(res.begin(), res.end());\n}`
    },
    solutionCode: {
      python: `def intersection(nums1, nums2):\n    return list(set(nums1) & set(nums2))`,
      java: `public int[] intersection(int[] nums1, int[] nums2) {\n    Set<Integer> set1 = new HashSet<>(); for (int n : nums1) set1.add(n);\n    Set<Integer> res = new HashSet<>(); for (int n : nums2) if (set1.contains(n)) res.add(n);\n    return res.stream().mapToInt(i -> i).toArray();\n}`,
      cpp: `vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {\n    unordered_set<int> s(nums1.begin(), nums1.end()), r;\n    for (int n : nums2) if (s.count(n)) r.insert(n);\n    return vector<int>(r.begin(), r.end());\n}`
    },
    hints: ['Convert nums1 to a HashSet to allow O(1) membership lookups.'],
    testCases: [
      { id: 'tc1', input: 'nums1 = [1,2,2,1], nums2 = [2,2]', expectedOutput: '[2]' },
      { id: 'tc2', input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', expectedOutput: '[4, 9]' }
    ],
    timeComplexity: 'O(N + M) where N and M are the lengths of the two arrays.',
    spaceComplexity: 'O(min(N, M)) to store the set.',
    explanation: 'Converting to a set allows O(1) lookups for elements in the second array.',
    validatorFnName: 'validateIntersection'
  },
  {
    id: 'hs_longest_consecutive',
    moduleId: 'hashset',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Advanced',
    xpReward: 170,
    coinReward: 65,
    description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(N) time using a HashSet.',
    examples: [
      { input: '[100, 4, 200, 1, 3, 2]', output: '4', explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Its length is 4.' }
    ],
    constraints: ['0 <= nums.length <= 10^5'],
    starterCode: {
      python: `def longest_consecutive(nums):\n    num_set = set(nums)\n    max_len = 0\n    for num in num_set:\n        # Only check sequences starting at the beginning of a sequence\n        if num - 1 not in num_set:\n            curr_num = num\n            curr_len = 1\n            while curr_num + 1 in num_set:\n                curr_num += 1\n                curr_len += 1\n            max_len = max(max_len, curr_len)\n    return max_len\n`,
      java: `public int longestConsecutive(int[] nums) {\n    Set<Integer> set = new HashSet<>();\n    for (int n : nums) set.add(n);\n    int maxLen = 0;\n    for (int n : set) {\n        if (!set.contains(n - 1)) {\n            int curr = n;\n            int len = 1;\n            while (set.contains(curr + 1)) { curr++; len++; }\n            maxLen = Math.max(maxLen, len);\n        }\n    }\n    return maxLen;\n}`,
      cpp: `int longestConsecutive(vector<int>& nums) {\n    unordered_set<int> s(nums.begin(), nums.end());\n    int maxLen = 0;\n    for (int n : s) {\n        if (!s.count(n - 1)) {\n            int curr = n, len = 1;\n            while (s.count(curr + 1)) { curr++; len++; }\n            maxLen = max(maxLen, len);\n        }\n    }\n    return maxLen;\n}`
    },
    solutionCode: {
      python: `def longest_consecutive(nums):\n    num_set = set(nums)\n    max_streak = 0\n    for num in num_set:\n        if num - 1 not in num_set:\n            current_num = num\n            current_streak = 1\n            while current_num + 1 in num_set:\n                current_num += 1\n                current_streak += 1\n            max_streak = max(max_streak, current_streak)\n    return max_streak`,
      java: `public int longestConsecutive(int[] nums) {\n    Set<Integer> set = new HashSet<>(); for (int n : nums) set.add(n);\n    int max = 0;\n    for (int n : set) {\n        if (!set.contains(n - 1)) {\n            int cur = n, len = 1;\n            while (set.contains(cur + 1)) { cur++; len++; }\n            max = Math.max(max, len);\n        }\n    }\n    return max;\n}`,
      cpp: `int longestConsecutive(vector<int>& nums) {\n    unordered_set<int> s(nums.begin(), nums.end());\n    int maxLen = 0;\n    for (int n : s) {\n        if (!s.count(n - 1)) {\n            int cur = n, len = 1;\n            while (s.count(cur + 1)) { cur++; len++; }\n            maxLen = max(maxLen, len);\n        }\n    }\n    return maxLen;\n}`
    },
    hints: [
      'Load all numbers into a HashSet in O(N) time.',
      'A number can only be the start of a streak if (num - 1) is NOT in the set!',
      'This crucial check ensures each sequence is traversed only once, achieving O(N) total time.'
    ],
    testCases: [
      { id: 'tc1', input: '[100, 4, 200, 1, 3, 2]', expectedOutput: '4' },
      { id: 'tc2', input: '[0,3,7,2,5,8,4,6,0,1]', expectedOutput: '9' }
    ],
    timeComplexity: 'O(N) linear time.',
    spaceComplexity: 'O(N) to store set.',
    explanation: 'Filtering out non-starting numbers ensures each element is visited at most twice.',
    validatorFnName: 'validateLongestConsecutive'
  },

  // MIN HEAP CHALLENGES
  {
    id: 'mh_kth_largest',
    moduleId: 'minheap',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Intermediate',
    xpReward: 130,
    coinReward: 45,
    description: 'Find the kth largest element in an unsorted array using a Min Heap of size k.',
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: 'The 2nd largest element is 5.' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4', explanation: 'The 4th largest element is 4.' }
    ],
    constraints: ['1 <= k <= nums.length <= 10^5'],
    starterCode: {
      python: `import heapq\ndef find_kth_largest(nums, k):\n    # Maintain a Min Heap of size k\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if len(min_heap) > k:\n            heapq.heappop(min_heap) # Pop the smallest\n    return min_heap[0] # Root is the Kth largest!\n`,
      java: `public int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n    for (int num : nums) {\n        minHeap.offer(num);\n        if (minHeap.size() > k) minHeap.poll();\n    }\n    return minHeap.peek();\n}`,
      cpp: `int findKthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> minHeap;\n    for (int num : nums) {\n        minHeap.push(num);\n        if (minHeap.size() > k) minHeap.pop();\n    }\n    return minHeap.top();\n}`
    },
    solutionCode: {
      python: `import heapq\ndef find_kth_largest(nums, k):\n    min_heap = []\n    for num in nums:\n        heapq.heappush(min_heap, num)\n        if len(min_heap) > k:\n            heapq.heappop(min_heap)\n    return min_heap[0]`,
      java: `public int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> pq = new PriorityQueue<>();\n    for (int n : nums) { pq.offer(n); if (pq.size() > k) pq.poll(); }\n    return pq.peek();\n}`,
      cpp: `int findKthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int n : nums) { pq.push(n); if (pq.size() > k) pq.pop(); }\n    return pq.top();\n}`
    },
    hints: [
      'A Min Heap of size k keeps the k largest elements seen so far.',
      'The root of this Min Heap holds the minimum among those k largest elements, which is precisely the kth largest element!'
    ],
    testCases: [
      { id: 'tc1', input: 'nums = [3,2,1,5,6,4], k = 2', expectedOutput: '5' },
      { id: 'tc2', input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', expectedOutput: '4' }
    ],
    timeComplexity: 'O(N log k), significantly faster than sorting O(N log N) when k << N.',
    spaceComplexity: 'O(k) memory for the heap.',
    explanation: 'Retaining only k items in the min heap caps each insertion to O(log k).',
    validatorFnName: 'validateKthLargest'
  },
  {
    id: 'mh_merge_k_sorted',
    moduleId: 'minheap',
    title: 'Merge K Sorted Lists',
    difficulty: 'Expert',
    xpReward: 200,
    coinReward: 80,
    description: 'You are given an array of k linked lists, each sorted in ascending order. Merge all lists into one sorted linked list using a Min Heap.',
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'All lists merged in sorted order.'
      }
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', 'Total nodes <= 10^4'],
    starterCode: {
      python: `import heapq\ndef merge_k_lists(lists):\n    min_heap = []\n    for i, lst in enumerate(lists):\n        if lst:\n            heapq.heappush(min_heap, (lst[0], i, 0))\n    merged = []\n    while min_heap:\n        val, list_idx, elem_idx = heapq.heappop(min_heap)\n        merged.append(val)\n        if elem_idx + 1 < len(lists[list_idx]):\n            next_val = lists[list_idx][elem_idx + 1]\n            heapq.heappush(min_heap, (next_val, list_idx, elem_idx + 1))\n    return merged\n`,
      java: `public List<Integer> mergeKLists(List<List<Integer>> lists) {\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n    for (int i = 0; i < lists.size(); i++) {\n        if (!lists.get(i).isEmpty()) pq.offer(new int[]{lists.get(i).get(0), i, 0});\n    }\n    List<Integer> res = new ArrayList<>();\n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        res.add(curr[0]);\n        if (curr[2] + 1 < lists.get(curr[1]).size()) {\n            pq.offer(new int[]{lists.get(curr[1]).get(curr[2] + 1), curr[1], curr[2] + 1});\n        }\n    }\n    return res;\n}`,
      cpp: `vector<int> mergeKLists(vector<vector<int>>& lists) {\n    using Node = tuple<int, int, int>;\n    priority_queue<Node, vector<Node>, greater<Node>> pq;\n    for (int i = 0; i < lists.size(); i++) {\n        if (!lists[i].empty()) pq.push({lists[i][0], i, 0});\n    }\n    vector<int> res;\n    while (!pq.empty()) {\n        auto [val, li, ei] = pq.top(); pq.pop();\n        res.push_back(val);\n        if (ei + 1 < lists[li].size()) pq.push({lists[li][ei+1], li, ei+1});\n    }\n    return res;\n}`
    },
    solutionCode: {
      python: `import heapq\ndef merge_k_lists(lists):\n    min_heap = []\n    for i, lst in enumerate(lists):\n        if lst: heapq.heappush(min_heap, (lst[0], i, 0))\n    merged = []\n    while min_heap:\n        val, l_idx, e_idx = heapq.heappop(min_heap)\n        merged.append(val)\n        if e_idx + 1 < len(lists[l_idx]):\n            heapq.heappush(min_heap, (lists[l_idx][e_idx + 1], l_idx, e_idx + 1))\n    return merged`,
      java: `public List<Integer> mergeKLists(List<List<Integer>> lists) {\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n    for (int i = 0; i < lists.size(); i++) if (!lists.get(i).isEmpty()) pq.offer(new int[]{lists.get(i).get(0), i, 0});\n    List<Integer> res = new ArrayList<>();\n    while (!pq.isEmpty()) {\n        int[] c = pq.poll(); res.add(c[0]);\n        if (c[2] + 1 < lists.get(c[1]).size()) pq.offer(new int[]{lists.get(c[1]).get(c[2] + 1), c[1], c[2] + 1});\n    }\n    return res;\n}`,
      cpp: `vector<int> mergeKLists(vector<vector<int>>& lists) {\n    using Node = tuple<int, int, int>;\n    priority_queue<Node, vector<Node>, greater<Node>> pq;\n    for (int i = 0; i < lists.size(); i++) if (!lists[i].empty()) pq.push({lists[i][0], i, 0});\n    vector<int> res;\n    while (!pq.empty()) {\n        auto [val, li, ei] = pq.top(); pq.pop();\n        res.push_back(val);\n        if (ei + 1 < lists[li].size()) pq.push({lists[li][ei+1], li, ei+1});\n    }\n    return res;\n}`
    },
    hints: [
      'Store the heads of all k lists in a min heap.',
      'Pop the smallest element, append to result, and insert the next element from that same list.'
    ],
    testCases: [
      { id: 'tc1', input: 'lists = [[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]' }
    ],
    timeComplexity: 'O(N log k) where N is the total number of nodes across all k lists.',
    spaceComplexity: 'O(k) for the heap.',
    explanation: 'At any point, the heap holds at most k elements (one from each active list).',
    validatorFnName: 'validateMergeKLists'
  },

  // INDEX HEAP CHALLENGES
  {
    id: 'ih_change_priority',
    moduleId: 'indexheap',
    title: 'Dynamic Priority Scheduler (ChangeKey)',
    difficulty: 'Advanced',
    xpReward: 180,
    coinReward: 70,
    description: 'Implement an indexed min priority queue that supports decreaseKey / changeKey in O(log N) time using the qp inverse array.',
    examples: [
      {
        input: 'Insert (0, 40), (1, 10), (2, 50); then changeKey(2, 5); extractMin()',
        output: 'Extracted ID: 2 with priority 5',
        explanation: 'Item 2 was initially lowest priority (50), but changeKey updated it to 5, making it the minimum!'
      }
    ],
    constraints: ['1 <= capacity <= 10^4', 'IDs are 0-indexed integers'],
    starterCode: {
      python: `class IndexMinHeap:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.pq = [] # heap positions -> id\n        self.qp = [-1] * capacity # id -> heap pos\n        self.keys = [None] * capacity # id -> priority\n\n    def change_key(self, item_id, new_key):\n        pos = self.qp[item_id] # O(1) position lookup!\n        self.keys[item_id] = new_key\n        self._swim(pos)\n        self._sink(pos)\n\n    def _swim(self, k):\n        while k > 0 and self.keys[self.pq[k]] < self.keys[self.pq[(k-1)//2]]:\n            self._swap(k, (k-1)//2)\n            k = (k-1)//2\n\n    def _swap(self, i, j):\n        self.pq[i], self.pq[j] = self.pq[j], self.pq[i]\n        self.qp[self.pq[i]] = i\n        self.qp[self.pq[j]] = j\n`,
      java: `public class IndexMinHeap {\n    int[] pq, qp, keys;\n    int size = 0;\n    public IndexMinHeap(int capacity) {\n        pq = new int[capacity]; qp = new int[capacity]; keys = new int[capacity];\n        Arrays.fill(qp, -1);\n    }\n    public void changeKey(int id, int newKey) {\n        int pos = qp[id];\n        keys[id] = newKey;\n        swim(pos); sink(pos);\n    }\n    private void swap(int i, int j) {\n        int t = pq[i]; pq[i] = pq[j]; pq[j] = t;\n        qp[pq[i]] = i; qp[pq[j]] = j;\n    }\n}`,
      cpp: `class IndexMinHeap {\n    vector<int> pq, qp, keys;\npublic:\n    IndexMinHeap(int cap) : qp(cap, -1), keys(cap, 0) {}\n    void changeKey(int id, int newKey) {\n        int pos = qp[id];\n        keys[id] = newKey;\n        swim(pos); sink(pos);\n    }\n    void swap(int i, int j) {\n        std::swap(pq[i], pq[j]);\n        qp[pq[i]] = i; qp[pq[j]] = j;\n    }\n};`
    },
    solutionCode: {
      python: `class IndexMinHeap:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.pq = []\n        self.qp = [-1] * capacity\n        self.keys = [None] * capacity\n    def change_key(self, item_id, new_key):\n        pos = self.qp[item_id]\n        self.keys[item_id] = new_key\n        self._swim(pos); self._sink(pos)\n    def _swap(self, i, j):\n        self.pq[i], self.pq[j] = self.pq[j], self.pq[i]\n        self.qp[self.pq[i]] = i\n        self.qp[self.pq[j]] = j`,
      java: `public class IndexMinHeap {\n    int[] pq, qp, keys;\n    public void changeKey(int id, int newKey) {\n        int pos = qp[id]; keys[id] = newKey; swim(pos); sink(pos);\n    }\n    private void swap(int i, int j) {\n        int t = pq[i]; pq[i] = pq[j]; pq[j] = t;\n        qp[pq[i]] = i; qp[pq[j]] = j;\n    }\n}`,
      cpp: `class IndexMinHeap {\n    vector<int> pq, qp, keys;\npublic:\n    void changeKey(int id, int newKey) {\n        int pos = qp[id]; keys[id] = newKey; swim(pos); sink(pos);\n    }\n    void swap(int i, int j) {\n        std::swap(pq[i], pq[j]); qp[pq[i]] = i; qp[pq[j]] = j;\n    }\n};`
    },
    hints: [
      'Locate the heap position in O(1) via qp[item_id].',
      'Update keys[item_id] = new_key.',
      'Call swim(pos) to handle decrease-key, and sink(pos) to handle increase-key.',
      'Always update qp[pq[i]] = i whenever two nodes swap!'
    ],
    testCases: [
      { id: 'tc1', input: 'Change priority of ID 2 from 50 to 5', expectedOutput: 'Extracted ID 2 first' }
    ],
    timeComplexity: 'O(log N) for changeKey instead of O(N) in a normal heap.',
    spaceComplexity: 'O(N) for pq and qp arrays.',
    explanation: 'The inverse array qp avoids the O(N) search, achieving the gold standard O(log N) runtime required by Dijkstra.',
    validatorFnName: 'validateIndexHeap'
  }
];
