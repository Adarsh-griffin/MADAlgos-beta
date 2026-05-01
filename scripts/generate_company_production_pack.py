from pathlib import Path


LANG_BLOCK = """### Default Code Templates
#### Python
```python
{py}
```
#### Java
```java
{java}
```
#### C++
```cpp
{cpp}
```
#### C
```c
{c}
```
#### JavaScript
```javascript
{js}
```
"""


QUESTION_BANK = {
    "Two Sum": {
        "type": "Easy",
        "description": "Find two indices such that their values add up to target.",
        "input": "nums[] (int array), target (int)",
        "output": "Two indices [i, j]",
        "cases": ["nums=[2,7,11,15], target=9 -> [0,1]", "nums=[3,2,4], target=6 -> [1,2]"],
        "hints": [
            "Brute-force checks all pairs.",
            "Store seen values in a hashmap.",
            "For each x, search target-x in hashmap.",
        ],
        "py": "def solve(nums, target):\n    # TODO\n    return []",
        "java": "static int[] solve(int[] nums, int target) {\n    // TODO\n    return new int[]{};\n}",
        "cpp": "vector<int> solve(vector<int>& nums, int target) {\n    // TODO\n    return {};\n}",
        "js": "function solve(nums, target) {\n  // TODO\n  return [];\n}",
    },
    "Valid Parentheses": {
        "type": "Easy",
        "description": "Return true if brackets are balanced and properly nested.",
        "input": "s (string of ()[]{} chars)",
        "output": "boolean",
        "cases": ['s="()[]{}" -> true', 's="([)]" -> false'],
        "hints": ["Use stack.", "Push opening brackets.", "On closing bracket, top must match."],
        "py": "def solve(s):\n    # TODO\n    return False",
        "java": "static boolean solve(String s) {\n    // TODO\n    return false;\n}",
        "cpp": "bool solve(string s) {\n    // TODO\n    return false;\n}",
        "js": "function solve(s) {\n  // TODO\n  return false;\n}",
    },
    "Kth Largest Element in an Array": {
        "type": "Medium",
        "description": "Return kth largest element (not kth distinct).",
        "input": "nums[] (int array), k (int)",
        "output": "int",
        "cases": ["nums=[3,2,1,5,6,4], k=2 -> 5", "nums=[3,2,3,1,2,4,5,5,6], k=4 -> 4"],
        "hints": ["Sort is valid but not optimal.", "Use min-heap of size k.", "Quickselect is another option."],
        "py": "def solve(nums, k):\n    # TODO\n    return 0",
        "java": "static int solve(int[] nums, int k) {\n    // TODO\n    return 0;\n}",
        "cpp": "int solve(vector<int>& nums, int k) {\n    // TODO\n    return 0;\n}",
        "js": "function solve(nums, k) {\n  // TODO\n  return 0;\n}",
    },
    "Binary Tree Right Side View": {
        "type": "Medium",
        "description": "Return nodes visible from right side of binary tree.",
        "input": "root (binary tree)",
        "output": "array of int",
        "cases": ["[1,2,3,null,5,null,4] -> [1,3,4]", "[1,null,3] -> [1,3]"],
        "hints": ["Use level-order BFS.", "Take last node per level.", "Or DFS with right-first traversal."],
        "py": "def solve(root):\n    # TODO\n    return []",
        "java": "static List<Integer> solve(TreeNode root) {\n    // TODO\n    return new ArrayList<>();\n}",
        "cpp": "vector<int> solve(TreeNode* root) {\n    // TODO\n    return {};\n}",
        "js": "function solve(root) {\n  // TODO\n  return [];\n}",
    },
    "Merge k Sorted Lists": {
        "type": "Hard",
        "description": "Merge k sorted linked lists into one sorted list.",
        "input": "lists[] (array of list heads)",
        "output": "merged list head",
        "cases": ["[[1,4,5],[1,3,4],[2,6]] -> [1,1,2,3,4,4,5,6]", "[] -> []"],
        "hints": ["Repeated merge is slow.", "Use min-heap on current list heads.", "Total complexity O(N log k)."],
        "py": "def solve(lists):\n    # TODO\n    return None",
        "java": "static ListNode solve(ListNode[] lists) {\n    // TODO\n    return null;\n}",
        "cpp": "ListNode* solve(vector<ListNode*>& lists) {\n    // TODO\n    return nullptr;\n}",
        "js": "function solve(lists) {\n  // TODO\n  return null;\n}",
    },
    "Random Pick with Weight": {
        "type": "Hard",
        "description": "Implement weighted random index picker.",
        "input": "weights[] via constructor, pickIndex() query",
        "output": "index sampled by weight probability",
        "cases": ["w=[1,3] -> pick(1) ~ 75%", "w=[2,5,3] -> pick(1) most frequent"],
        "hints": ["Build prefix sum.", "Pick random in [1,total].", "Binary search first prefix >= rand."],
        "py": "class Solution:\n    def __init__(self, w):\n        # TODO\n        pass\n    def pickIndex(self):\n        # TODO\n        return 0",
        "java": "class Solution {\n    Solution(int[] w) { /* TODO */ }\n    int pickIndex() { return 0; }\n}",
        "cpp": "class Solution { public: Solution(vector<int>& w){} int pickIndex(){ return 0; } };",
        "js": "class Solution {\n  constructor(w) { /* TODO */ }\n  pickIndex() { return 0; }\n}",
    },
    "Valid Palindrome": {
        "type": "Easy",
        "description": "Check palindrome after lowercasing and removing non-alphanumeric chars.",
        "input": "s (string)",
        "output": "boolean",
        "cases": ['"A man, a plan, a canal: Panama" -> true', '"race a car" -> false'],
        "hints": ["Use two pointers.", "Skip non-alphanumeric chars.", "Compare lowercase chars."],
        "py": "def solve(s):\n    # TODO\n    return False",
        "java": "static boolean solve(String s) {\n    // TODO\n    return false;\n}",
        "cpp": "bool solve(string s) {\n    // TODO\n    return false;\n}",
        "js": "function solve(s) {\n  // TODO\n  return false;\n}",
    },
    "Longest Substring Without Repeating Characters": {
        "type": "Medium",
        "description": "Return length of longest substring with all unique characters.",
        "input": "s (string)",
        "output": "int",
        "cases": ['"abcabcbb" -> 3', '"bbbbb" -> 1'],
        "hints": ["Sliding window.", "Track last index of each char.", "Move left pointer when repeated char appears."],
        "py": "def solve(s):\n    # TODO\n    return 0",
        "java": "static int solve(String s) {\n    // TODO\n    return 0;\n}",
        "cpp": "int solve(string s) {\n    // TODO\n    return 0;\n}",
        "js": "function solve(s) {\n  // TODO\n  return 0;\n}",
    },
    "Median of Two Sorted Arrays": {
        "type": "Hard",
        "description": "Find median of two sorted arrays in logarithmic time.",
        "input": "nums1[], nums2[]",
        "output": "double",
        "cases": ["[1,3],[2] -> 2.0", "[1,2],[3,4] -> 2.5"],
        "hints": ["Use binary search partition.", "Search on smaller array.", "Balance left and right halves."],
        "py": "def solve(nums1, nums2):\n    # TODO\n    return 0.0",
        "java": "static double solve(int[] a, int[] b) {\n    // TODO\n    return 0.0;\n}",
        "cpp": "double solve(vector<int>& a, vector<int>& b) {\n    // TODO\n    return 0.0;\n}",
        "js": "function solve(a, b) {\n  // TODO\n  return 0;\n}",
    },
    "Jump Game": {
        "type": "Hard",
        "description": "Decide if last index is reachable from first index.",
        "input": "nums[] where nums[i] is max jump length",
        "output": "boolean",
        "cases": ["[2,3,1,1,4] -> true", "[3,2,1,0,4] -> false"],
        "hints": ["Greedy works.", "Track farthest reachable index.", "Fail if current index exceeds farthest."],
        "py": "def solve(nums):\n    # TODO\n    return False",
        "java": "static boolean solve(int[] nums) {\n    // TODO\n    return false;\n}",
        "cpp": "bool solve(vector<int>& nums) {\n    // TODO\n    return false;\n}",
        "js": "function solve(nums) {\n  // TODO\n  return false;\n}",
    },
    "Sort the People": {"type": "Easy", "description": "Sort names by descending heights.",
        "input": "names[], heights[]", "output": "names[] sorted by heights desc",
        "cases": ['["Mary","John","Emma"],[180,165,170] -> ["Mary","Emma","John"]', '["A","B"],[155,155] -> order by stable/index rule'],
        "hints": ["Pair name-height.", "Sort by height descending.", "Return names only."],
        "py":"def solve(names, heights):\n    # TODO\n    return []","java":"static String[] solve(String[] names, int[] heights) {\n    // TODO\n    return new String[]{};\n}","cpp":"vector<string> solve(vector<string>& names, vector<int>& heights) {\n    // TODO\n    return {};\n}","js":"function solve(names, heights) {\n  // TODO\n  return [];\n}"},
    "Maximum Product After K Increments": {"type":"Medium","description":"After k increments on any elements, maximize product modulo 1e9+7.","input":"nums[], k","output":"int product mod 1e9+7","cases":["[0,4],k=5 -> 20","[6,3,3,2],k=2 -> 216"],"hints":["Use min-heap.","Always increment current smallest.","Multiply with modulo at end."],"py":"def solve(nums, k):\n    # TODO\n    return 0","java":"static int solve(int[] nums, int k) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<int>& nums, int k) {\n    // TODO\n    return 0;\n}","js":"function solve(nums, k) {\n  // TODO\n  return 0;\n}"},
    "Minimum Total Distance Traveled": {"type":"Hard","description":"Assign robots to factories with capacities minimizing total distance.","input":"robots[], factories[[pos,cap],...]","output":"minimum total distance","cases":["robots=[0,4,6], factories=[[2,2],[6,2]] -> 4","robots=[1,-1], factories=[[-2,1],[2,1]] -> 2"],"hints":["Sort robots and factories.","DP over indices and used capacity.","State compression helps."],"py":"def solve(robots, factories):\n    # TODO\n    return 0","java":"static long solve(int[] robots, int[][] factories) {\n    // TODO\n    return 0L;\n}","cpp":"long long solve(vector<int>& robots, vector<vector<int>>& factories) {\n    // TODO\n    return 0;\n}","js":"function solve(robots, factories) {\n  // TODO\n  return 0;\n}"},
    "Stone Game VIII": {"type":"Hard","description":"Compute max score difference under optimal play in Stone Game VIII.","input":"stones[]","output":"int max diff","cases":["[-1,2,-3,4,-5] -> 5","[7,-6,5,10,5,-2,-6] -> 13"],"hints":["Use prefix sums.","Backward DP transition.","Track best future value."],"py":"def solve(stones):\n    # TODO\n    return 0","java":"static int solve(int[] stones) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<int>& stones) {\n    // TODO\n    return 0;\n}","js":"function solve(stones) {\n  // TODO\n  return 0;\n}"},
    "Palindrome Number": {"type":"Easy","description":"Return true if integer reads same backward.","input":"x (int)","output":"boolean","cases":["121 -> true","-121 -> false"],"hints":["Negative is never palindrome.","Reverse half of number.","Compare halves."],"py":"def solve(x):\n    # TODO\n    return False","java":"static boolean solve(int x) {\n    // TODO\n    return false;\n}","cpp":"bool solve(int x) {\n    // TODO\n    return false;\n}","js":"function solve(x) {\n  // TODO\n  return false;\n}"},
    "Maximum Subarray": {"type":"Medium","description":"Find maximum sum over all contiguous subarrays.","input":"nums[]","output":"int","cases":["[-2,1,-3,4,-1,2,1,-5,4] -> 6","[1] -> 1"],"hints":["Kadane algorithm.","current=max(x,current+x).","Track global maximum."],"py":"def solve(nums):\n    # TODO\n    return 0","java":"static int solve(int[] nums) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<int>& nums) {\n    // TODO\n    return 0;\n}","js":"function solve(nums) {\n  // TODO\n  return 0;\n}"},
    "Longest Palindromic Substring": {"type":"Medium","description":"Return longest palindromic substring of s.","input":"s (string)","output":"string","cases":['"babad" -> "bab" or "aba"','"cbbd" -> "bb"'],"hints":["Expand around center.","Try odd/even centers.","Track best window."],"py":"def solve(s):\n    # TODO\n    return \"\"","java":"static String solve(String s) {\n    // TODO\n    return \"\";\n}","cpp":"string solve(string s) {\n    // TODO\n    return \"\";\n}","js":"function solve(s) {\n  // TODO\n  return \"\";\n}"},
    "Delete and Earn": {"type":"Hard","description":"Pick values for points while removing neighbors x-1 and x+1.","input":"nums[]","output":"int max points","cases":["[3,4,2] -> 6","[2,2,3,3,3,4] -> 9"],"hints":["Aggregate value sums by number.","Equivalent to House Robber.","DP on value line."],"py":"def solve(nums):\n    # TODO\n    return 0","java":"static int solve(int[] nums) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<int>& nums) {\n    // TODO\n    return 0;\n}","js":"function solve(nums) {\n  // TODO\n  return 0;\n}"},
    "Largest Number": {"type":"Hard","description":"Arrange numbers to form largest concatenated number.","input":"nums[]","output":"string","cases":["[10,2] -> \"210\"","[3,30,34,5,9] -> \"9534330\""],"hints":["Custom comparator by ab vs ba.","Sort using comparator.","Handle all-zero result."],"py":"def solve(nums):\n    # TODO\n    return \"\"","java":"static String solve(int[] nums) {\n    // TODO\n    return \"\";\n}","cpp":"string solve(vector<int>& nums) {\n    // TODO\n    return \"\";\n}","js":"function solve(nums) {\n  // TODO\n  return \"\";\n}"},
    "LRU Cache": {"type":"Medium","description":"Design cache with O(1) get and put under LRU eviction.","input":"capacity + operations","output":"results of get operations","cases":["LRUCache(2): put(1,1),put(2,2),get(1)->1","put(3,3) evicts 2"],"hints":["Need O(1) lookup and update.","Use hashmap + doubly linked list.","Most recent at head, least at tail."],"py":"class LRUCache:\n    def __init__(self, capacity):\n        # TODO\n        pass\n    def get(self, key):\n        # TODO\n        return -1\n    def put(self, key, value):\n        # TODO\n        pass","java":"class LRUCache {\n    LRUCache(int capacity) { /* TODO */ }\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n}","cpp":"class LRUCache { public: LRUCache(int capacity){} int get(int key){ return -1; } void put(int key,int value){} };","js":"class LRUCache {\n  constructor(capacity) { /* TODO */ }\n  get(key) { return -1; }\n  put(key, value) {}\n}"},
    "Merge Intervals": {"type":"Medium","description":"Merge overlapping intervals and return merged result.","input":"intervals[][]","output":"merged intervals[][]","cases":["[[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]]","[[1,4],[4,5]] -> [[1,5]]"],"hints":["Sort by start.","Track current merged interval.","Extend or push new interval."],"py":"def solve(intervals):\n    # TODO\n    return []","java":"static int[][] solve(int[][] intervals) {\n    // TODO\n    return new int[][]{};\n}","cpp":"vector<vector<int>> solve(vector<vector<int>>& intervals) {\n    // TODO\n    return {};\n}","js":"function solve(intervals) {\n  // TODO\n  return [];\n}"},
    "Trapping Rain Water": {"type":"Hard","description":"Compute total water trapped between bars.","input":"height[]","output":"int trapped water","cases":["[0,1,0,2,1,0,1,3,2,1,2,1] -> 6","[4,2,0,3,2,5] -> 9"],"hints":["Brute force per bar is slow.","Use left/right max arrays or two pointers.","Accumulate min(leftMax,rightMax)-height[i]."],"py":"def solve(height):\n    # TODO\n    return 0","java":"static int solve(int[] height) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<int>& height) {\n    // TODO\n    return 0;\n}","js":"function solve(height) {\n  // TODO\n  return 0;\n}"},
    "Word Break": {"type":"Hard","description":"Check if string can be segmented into dictionary words.","input":"s, wordDict[]","output":"boolean","cases":["s='leetcode', dict=['leet','code'] -> true","s='catsandog', dict=['cats','dog','sand','and','cat'] -> false"],"hints":["Try prefix splitting.","DP[i] indicates s[:i] breakable.","For each i, test previous valid j."],"py":"def solve(s, wordDict):\n    # TODO\n    return False","java":"static boolean solve(String s, List<String> wordDict) {\n    // TODO\n    return false;\n}","cpp":"bool solve(string s, vector<string>& wordDict) {\n    // TODO\n    return false;\n}","js":"function solve(s, wordDict) {\n  // TODO\n  return false;\n}"},
    "Best Time to Buy and Sell Stock": {"type":"Easy","description":"Max profit from one buy and one sell.","input":"prices[]","output":"int max profit","cases":["[7,1,5,3,6,4] -> 5","[7,6,4,3,1] -> 0"],"hints":["Track minimum price so far.","Compute profit at each step.","Keep max profit."],"py":"def solve(prices):\n    # TODO\n    return 0","java":"static int solve(int[] prices) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<int>& prices) {\n    // TODO\n    return 0;\n}","js":"function solve(prices) {\n  // TODO\n  return 0;\n}"},
    "Number of Islands": {"type":"Medium","description":"Count connected components of 1s in grid.","input":"grid[][] of '0'/'1'","output":"int count","cases":["[['1','1','0'],['1','0','0'],['0','0','1']] -> 2","[['0']] -> 0"],"hints":["Scan all cells.","When land found, flood fill.","Increment count per new component."],"py":"def solve(grid):\n    # TODO\n    return 0","java":"static int solve(char[][] grid) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<vector<char>>& grid) {\n    // TODO\n    return 0;\n}","js":"function solve(grid) {\n  // TODO\n  return 0;\n}"},
    "Top K Frequent Elements": {"type":"Medium","description":"Return k elements with highest frequencies.","input":"nums[], k","output":"array of k elements","cases":["[1,1,1,2,2,3], k=2 -> [1,2]","[1], k=1 -> [1]"],"hints":["Count frequencies.","Use heap or bucket sort.","Return top k keys."],"py":"def solve(nums, k):\n    # TODO\n    return []","java":"static int[] solve(int[] nums, int k) {\n    // TODO\n    return new int[]{};\n}","cpp":"vector<int> solve(vector<int>& nums, int k) {\n    // TODO\n    return {};\n}","js":"function solve(nums, k) {\n  // TODO\n  return [];\n}"},
    "Contains Duplicate II": {"type":"Easy","description":"Check if duplicate values appear within distance k.","input":"nums[], k","output":"boolean","cases":["[1,2,3,1],k=3 -> true","[1,0,1,1],k=1 -> true"],"hints":["Track last seen index per value.","If i-last <= k return true.","Update index each step."],"py":"def solve(nums, k):\n    # TODO\n    return False","java":"static boolean solve(int[] nums, int k) {\n    // TODO\n    return false;\n}","cpp":"bool solve(vector<int>& nums, int k) {\n    // TODO\n    return false;\n}","js":"function solve(nums, k) {\n  // TODO\n  return false;\n}"},
    "Summary Ranges": {"type":"Easy","description":"Compress sorted unique array into minimal ranges.","input":"nums[] sorted unique","output":"array of range strings","cases":["[0,1,2,4,5,7] -> ['0->2','4->5','7']","[0,2,3,4,6,8,9] -> ['0','2->4','6','8->9']"],"hints":["Track start of current range.","When gap appears, close previous range.","Format single vs range."],"py":"def solve(nums):\n    # TODO\n    return []","java":"static List<String> solve(int[] nums) {\n    // TODO\n    return new ArrayList<>();\n}","cpp":"vector<string> solve(vector<int>& nums) {\n    // TODO\n    return {};\n}","js":"function solve(nums) {\n  // TODO\n  return [];\n}"},
    "Meeting Rooms II": {"type":"Medium","description":"Minimum number of rooms to host all intervals.","input":"intervals[][]","output":"int room count","cases":["[[0,30],[5,10],[15,20]] -> 2","[[7,10],[2,4]] -> 1"],"hints":["Sort by start time.","Track earliest end via min-heap.","Reuse room if start >= earliest end."],"py":"def solve(intervals):\n    # TODO\n    return 0","java":"static int solve(int[][] intervals) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<vector<int>>& intervals) {\n    // TODO\n    return 0;\n}","js":"function solve(intervals) {\n  // TODO\n  return 0;\n}"},
    "Reconstruct Itinerary": {"type":"Hard","description":"Build lexicographically smallest itinerary using all tickets from JFK.","input":"tickets[[from,to],...]","output":"airport path[]","cases":["[['MUC','LHR'],['JFK','MUC'],['LHR','SFO'],['SFO','SJC']] -> ['JFK','MUC','LHR','SFO','SJC']","[['JFK','KUL'],['JFK','NRT'],['NRT','JFK']] -> ['JFK','NRT','JFK','KUL']"],"hints":["Graph edges used exactly once.","Eulerian path pattern.","Sort adjacency and DFS/post-order."],"py":"def solve(tickets):\n    # TODO\n    return []","java":"static List<String> solve(List<List<String>> tickets) {\n    // TODO\n    return new ArrayList<>();\n}","cpp":"vector<string> solve(vector<vector<string>>& tickets) {\n    // TODO\n    return {};\n}","js":"function solve(tickets) {\n  // TODO\n  return [];\n}"},
    "First Missing Positive": {"type":"Hard","description":"Find smallest missing positive in O(n) time and O(1) extra space.","input":"nums[]","output":"int","cases":["[1,2,0] -> 3","[3,4,-1,1] -> 2"],"hints":["Only positives up to n matter.","Place value x at index x-1.","First mismatch index gives answer."],"py":"def solve(nums):\n    # TODO\n    return 0","java":"static int solve(int[] nums) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<int>& nums) {\n    // TODO\n    return 0;\n}","js":"function solve(nums) {\n  // TODO\n  return 0;\n}"},
    "Subarray Sum Equals K": {"type":"Medium","description":"Count subarrays whose sum equals k.","input":"nums[], k","output":"int count","cases":["[1,1,1],k=2 -> 2","[1,2,3],k=3 -> 2"],"hints":["Prefix sum method.","If prefix-k seen before, add its frequency.","Update map each step."],"py":"def solve(nums, k):\n    # TODO\n    return 0","java":"static int solve(int[] nums, int k) {\n    // TODO\n    return 0;\n}","cpp":"int solve(vector<int>& nums, int k) {\n    // TODO\n    return 0;\n}","js":"function solve(nums, k) {\n  // TODO\n  return 0;\n}"},
    "Reverse Integer": {"type":"Easy","description":"Reverse digits of 32-bit signed integer; return 0 on overflow.","input":"x (int)","output":"int","cases":["123 -> 321","-120 -> -21"],"hints":["Pop digits one by one.","Push into reversed number.","Check overflow before push."],"py":"def solve(x):\n    # TODO\n    return 0","java":"static int solve(int x) {\n    // TODO\n    return 0;\n}","cpp":"int solve(int x) {\n    // TODO\n    return 0;\n}","js":"function solve(x) {\n  // TODO\n  return 0;\n}"},
    "Valid Anagram": {"type":"Medium","description":"Check whether two strings are anagrams.","input":"s, t","output":"boolean","cases":["'anagram','nagaram' -> true","'rat','car' -> false"],"hints":["Length mismatch => false.","Count chars in s.","Subtract counts using t."],"py":"def solve(s, t):\n    # TODO\n    return False","java":"static boolean solve(String s, String t) {\n    // TODO\n    return false;\n}","cpp":"bool solve(string s, string t) {\n    // TODO\n    return false;\n}","js":"function solve(s, t) {\n  // TODO\n  return false;\n}"},
    "Count Primes": {"type":"Hard","description":"Count prime numbers strictly less than n.","input":"n (int)","output":"int count","cases":["n=10 -> 4","n=0 -> 0"],"hints":["Use sieve array.","Mark multiples from i*i.","Count unmarked numbers >=2."],"py":"def solve(n):\n    # TODO\n    return 0","java":"static int solve(int n) {\n    // TODO\n    return 0;\n}","cpp":"int solve(int n) {\n    // TODO\n    return 0;\n}","js":"function solve(n) {\n  // TODO\n  return 0;\n}"},
    "3Sum": {"type":"Medium","description":"Return all unique triplets with sum zero.","input":"nums[]","output":"list of triplets","cases":["[-1,0,1,2,-1,-4] -> [[-1,-1,2],[-1,0,1]]","[0,1,1] -> []"],"hints":["Sort array first.","Fix i and two-pointer search.","Skip duplicates carefully."],"py":"def solve(nums):\n    # TODO\n    return []","java":"static List<List<Integer>> solve(int[] nums) {\n    // TODO\n    return new ArrayList<>();\n}","cpp":"vector<vector<int>> solve(vector<int>& nums) {\n    // TODO\n    return {};\n}","js":"function solve(nums) {\n  // TODO\n  return [];\n}"},
}


COMPANY_SET = {
    "Facebook / Meta": [("Easy", "Valid Parentheses"), ("Easy", "Two Sum"), ("Medium", "Kth Largest Element in an Array"), ("Medium", "Binary Tree Right Side View"), ("Hard", "Merge k Sorted Lists"), ("Hard", "Random Pick with Weight")],
    "Wipro": [("Easy", "Two Sum"), ("Easy", "Valid Palindrome"), ("Medium", "Longest Substring Without Repeating Characters"), ("Medium", "Kth Largest Element in an Array"), ("Hard", "Median of Two Sorted Arrays"), ("Hard", "Jump Game")],
    "Infosys": [("Easy", "Two Sum"), ("Easy", "Sort the People"), ("Medium", "Longest Substring Without Repeating Characters"), ("Medium", "Maximum Product After K Increments"), ("Hard", "Minimum Total Distance Traveled"), ("Hard", "Stone Game VIII")],
    "Accenture": [("Easy", "Two Sum"), ("Easy", "Palindrome Number"), ("Medium", "Maximum Subarray"), ("Medium", "Longest Palindromic Substring"), ("Hard", "Delete and Earn"), ("Hard", "Largest Number")],
    "Walmart": [("Easy", "Two Sum"), ("Easy", "Valid Parentheses"), ("Medium", "LRU Cache"), ("Medium", "Merge Intervals"), ("Hard", "Trapping Rain Water"), ("Hard", "Word Break")],
    "Capgemini": [("Easy", "Two Sum"), ("Easy", "Palindrome Number"), ("Medium", "Subarray Sum Equals K"), ("Medium", "Longest Substring Without Repeating Characters"), ("Hard", "Median of Two Sorted Arrays"), ("Hard", "Trapping Rain Water")],
    "Google": [("Easy", "Two Sum"), ("Easy", "Valid Parentheses"), ("Medium", "Longest Substring Without Repeating Characters"), ("Medium", "3Sum"), ("Hard", "Trapping Rain Water"), ("Hard", "Median of Two Sorted Arrays")],
    "Amazon": [("Easy", "Two Sum"), ("Easy", "Best Time to Buy and Sell Stock"), ("Medium", "Number of Islands"), ("Medium", "Top K Frequent Elements"), ("Hard", "Merge k Sorted Lists"), ("Hard", "Trapping Rain Water")],
    "Apple": [("Easy", "Best Time to Buy and Sell Stock"), ("Easy", "Valid Parentheses"), ("Medium", "Top K Frequent Elements"), ("Medium", "Kth Largest Element in an Array"), ("Hard", "Merge k Sorted Lists"), ("Hard", "Number of Islands")],
    "Netflix": [("Easy", "Contains Duplicate II"), ("Easy", "Summary Ranges"), ("Medium", "LRU Cache"), ("Medium", "Meeting Rooms II"), ("Hard", "Reconstruct Itinerary"), ("Hard", "First Missing Positive")],
    "TCS": [("Easy", "Two Sum"), ("Easy", "Palindrome Number"), ("Medium", "Maximum Subarray"), ("Medium", "Subarray Sum Equals K"), ("Hard", "3Sum"), ("Hard", "Longest Palindromic Substring")],
    "Tech Mahindra": [("Easy", "Two Sum"), ("Easy", "Reverse Integer"), ("Medium", "Best Time to Buy and Sell Stock"), ("Medium", "Valid Anagram"), ("Hard", "Count Primes"), ("Hard", "Longest Substring Without Repeating Characters")],
}


def company_intro(company: str) -> str:
    if company in {"Amazon", "Walmart"}:
        return f"{company} flavored wording focuses on logistics, scale, and operations."
    if company in {"Facebook / Meta", "Netflix", "Google", "Apple"}:
        return f"{company} flavored wording focuses on product scale and reliability."
    if company in {"TCS", "Infosys", "Wipro", "Tech Mahindra", "Capgemini", "Accenture"}:
        return f"{company} flavored wording focuses on service delivery and enterprise systems."
    return f"{company} flavored wording."


def build_question_block(company: str, idx: int, difficulty: str, qname: str) -> str:
    q = QUESTION_BANK[qname]
    c_template = q.get(
        "c",
        "/* C starter template */\nint solve() {\n    // TODO\n    return 0;\n}",
    )
    title = f"{difficulty} {idx}. {qname}"
    lines = [
        f"### {title}",
        "",
        f"**Company Context:** {company_intro(company)}",
        f"**Problem Description:** {q['description']}",
        f"**Type:** {difficulty}",
        f"**Input Case:** {q['input']}",
        f"**Expected Outcome:** {q['output']}",
        "",
        "**Sample Test Cases:**",
    ]
    for i, c in enumerate(q["cases"], start=1):
        lines.append(f"- Case {i}: `{c}`")
    lines.extend(["", "**Hints:**"])
    for i, h in enumerate(q["hints"], start=1):
        lines.append(f"- Hint {i}: {h}")
    lines.extend(
        [
            "",
            LANG_BLOCK.format(py=q["py"], java=q["java"], cpp=q["cpp"], c=c_template, js=q["js"]),
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    out = ["# Company Production Version Question Pack", ""]
    out.append(
        "Format included for each question: title, description, type, input case, expected outcome, hints, and starter code for Python/Java/C++/C/JavaScript."
    )
    out.append("")
    for company, items in COMPANY_SET.items():
        out.append(f"## {company} — Production Version")
        out.append("")
        for idx, (difficulty, qname) in enumerate(items, start=1):
            out.append(build_question_block(company, idx, difficulty, qname))
        out.append("---")
        out.append("")

    target = Path("docs/company-production-version-pack.md")
    target.write_text("\n".join(out), encoding="utf-8")
    print(f"Wrote {target}")


if __name__ == "__main__":
    main()

