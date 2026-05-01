# Company Detailed Question Bank

This document is based on your selected company-wise list and expanded into reusable detailed prompts.
Use these prompts to rewrite language per company while keeping test difficulty consistent.

## 1) Company-wise Selected Questions

### Facebook / Meta
- Easy: `Valid Parentheses`, `Two Sum`
- Medium: `Kth Largest Element in an Array`, `Binary Tree Right Side View`
- Hard: `Merge k Sorted Lists`, `Random Pick with Weight`

### Wipro
- Easy: `Two Sum`, `Valid Palindrome`
- Medium: `Longest Substring Without Repeating Characters`, `Kth Largest Element in an Array`
- Hard: `Median of Two Sorted Arrays`, `Jump Game`

### Infosys
- Easy: `Two Sum`, `Sort the People`
- Medium: `Longest Substring Without Repeating Characters`, `Maximum Product After K Increments`
- Hard: `Minimum Total Distance Traveled`, `Stone Game VIII`

### Accenture
- Easy: `Two Sum`, `Palindrome Number`
- Medium: `Maximum Subarray`, `Longest Palindromic Substring`
- Hard: `Delete and Earn`, `Largest Number`

### Walmart
- Easy: `Two Sum`, `Valid Parentheses`
- Medium: `LRU Cache`, `Merge Intervals`
- Hard: `Trapping Rain Water`, `Word Break`

### Capgemini
- Easy: `Two Sum`, `Palindrome Number`
- Medium: `Subarray Sum Equals K`, `Longest Substring Without Repeating Characters`
- Hard: `Median of Two Sorted Arrays`, `Trapping Rain Water`

### Google
- Easy: `Two Sum`, `Valid Parentheses`
- Medium: `Longest Substring Without Repeating Characters`, `3Sum`
- Hard: `Trapping Rain Water`, `Median of Two Sorted Arrays`

### Amazon
- Easy: `Two Sum`, `Best Time to Buy and Sell Stock`
- Medium: `Number of Islands`, `Top K Frequent Elements`
- Hard: `Merge k Sorted Lists`, `Trapping Rain Water`

### Apple
- Easy: `Best Time to Buy and Sell Stock`, `Valid Parentheses`
- Medium: `Top K Frequent Elements`, `Kth Largest Element in an Array`
- Hard: `Merge k Sorted Lists`, `Number of Islands`

### Netflix
- Easy: `Contains Duplicate II`, `Summary Ranges`
- Medium: `LRU Cache`, `Meeting Rooms II`
- Hard: `Reconstruct Itinerary`, `First Missing Positive`

### TCS
- Easy: `Two Sum`, `Palindrome Number`
- Medium: `Maximum Subarray`, `Subarray Sum Equals K`
- Hard: `3Sum`, `Longest Palindromic Substring`

### Tech Mahindra
- Easy: `Two Sum`, `Reverse Integer`
- Medium: `Best Time to Buy and Sell Stock`, `Valid Anagram`
- Hard: `Count Primes`, `Longest Substring Without Repeating Characters` (upgrade)

---

## 2) Detailed Prompts (Reusable)

### 1. Two Sum
**Difficulty:** Easy  
**Prompt:** Given an integer array `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.  
**Rules:** Exactly one valid answer exists; do not use the same element twice.  
**Input:** `n`, array of `n` integers, and `target`.  
**Output:** Two indices (0-based) in any order.  
**Constraints:** `2 <= n <= 1e5`, values can be negative.

### 2. Valid Parentheses
**Difficulty:** Easy  
**Prompt:** Given a string containing only `'(' , ')' , '{' , '}' , '[' , ']'`, determine if it is valid.  
**Valid means:** every open bracket closes with the same type, and in correct order.  
**Input:** single bracket string.  
**Output:** `true/false` or `YES/NO`.

### 3. Kth Largest Element in an Array
**Difficulty:** Medium  
**Prompt:** Given an unsorted array, return the `k`th largest element (not distinct rank unless specified).  
**Input:** array `nums`, integer `k`.  
**Output:** single integer.  
**Expected approach:** heap or quickselect.

### 4. Binary Tree Right Side View
**Difficulty:** Medium  
**Prompt:** Given a binary tree root, return the values of nodes visible when looking from the right side.  
**Input:** binary tree (level-order form allowed).  
**Output:** list of integers from top to bottom.  
**Hint:** level-order traversal or depth-first right-first traversal.

### 5. Merge k Sorted Lists
**Difficulty:** Hard  
**Prompt:** You are given `k` sorted linked lists. Merge them into one sorted list and return its head.  
**Input:** array of linked-list heads.  
**Output:** merged sorted linked list.  
**Expected complexity:** `O(N log k)` using min-heap/divide-and-conquer.

### 6. Random Pick with Weight
**Difficulty:** Hard  
**Prompt:** Design a picker so index `i` is chosen with probability proportional to `weights[i]`.  
**Input:** constructor takes `weights`; method `pickIndex()` returns one index.  
**Output:** random index respecting distribution.  
**Hint:** prefix sums + binary search.

### 7. Valid Palindrome
**Difficulty:** Easy  
**Prompt:** Check if a string is a palindrome after converting to lowercase and removing non-alphanumeric characters.  
**Input:** string `s`.  
**Output:** `true/false`.  
**Hint:** two pointers.

### 8. Longest Substring Without Repeating Characters
**Difficulty:** Medium  
**Prompt:** Return length of the longest substring with all unique characters.  
**Input:** string `s`.  
**Output:** integer length.  
**Expected approach:** sliding window + hash map/set.

### 9. Median of Two Sorted Arrays
**Difficulty:** Hard  
**Prompt:** Given two sorted arrays, return median of the combined sorted sequence.  
**Input:** arrays `nums1`, `nums2`.  
**Output:** median as float/double.  
**Target complexity:** `O(log(min(m,n)))`.

### 10. Jump Game
**Difficulty:** Hard (as requested in your mapping)  
**Prompt:** Given array `nums` where each value is max jump length at that index, determine if you can reach last index from first.  
**Input:** integer array.  
**Output:** `true/false`.  
**Hint:** greedy farthest-reach.

### 11. Sort the People
**Difficulty:** Easy  
**Prompt:** Given arrays `names` and `heights`, sort people in descending order of height and return sorted names.  
**Input:** `names[]`, `heights[]`.  
**Output:** reordered `names[]`.

### 12. Maximum Product After K Increments
**Difficulty:** Medium  
**Prompt:** You may increment any element by `1`, exactly `k` times. Maximize product of all elements, modulo `1e9+7`.  
**Input:** array `nums`, integer `k`.  
**Output:** maximum product modulo `1e9+7`.  
**Hint:** min-heap.

### 13. Minimum Total Distance Traveled
**Difficulty:** Hard  
**Prompt:** Robots and factories are on a number line. Each factory has a repair capacity. Assign each robot to a factory minimizing total travel distance.  
**Input:** `robots[]`, `factories[] = [position, capacity]`.  
**Output:** minimum total distance.  
**Hint:** sorting + DP.

### 14. Stone Game VIII
**Difficulty:** Hard  
**Prompt:** Two players play optimally on prefix merges of a stone array. Return maximum score difference first player can guarantee.  
**Input:** integer array `stones`.  
**Output:** integer score difference.  
**Hint:** prefix sums + backward DP.

### 15. Palindrome Number
**Difficulty:** Easy  
**Prompt:** Determine whether integer `x` reads same forward and backward (without string conversion if possible).  
**Input:** integer `x`.  
**Output:** `true/false`.

### 16. Maximum Subarray
**Difficulty:** Medium  
**Prompt:** Find contiguous subarray with maximum sum and return that sum.  
**Input:** integer array.  
**Output:** maximum sum.  
**Hint:** Kadane's algorithm.

### 17. Longest Palindromic Substring
**Difficulty:** Medium  
**Prompt:** Return the longest palindromic substring in input string `s`.  
**Input:** string `s`.  
**Output:** substring.  
**Hint:** expand-around-center or DP.

### 18. Delete and Earn
**Difficulty:** Hard (as requested in your mapping)  
**Prompt:** Picking number `x` earns `x * frequency(x)` but removes ability to pick `x-1` and `x+1`. Maximize points.  
**Input:** integer array.  
**Output:** maximum points.  
**Hint:** transform to House Robber on value-frequency axis.

### 19. Largest Number
**Difficulty:** Hard  
**Prompt:** Arrange non-negative integers so they form the largest possible number when concatenated.  
**Input:** integer array.  
**Output:** string representation of largest number.  
**Hint:** custom comparator by `ab` vs `ba`.

### 20. LRU Cache
**Difficulty:** Medium  
**Prompt:** Implement LRU cache with `get(key)` and `put(key, value)` in `O(1)` average time.  
**Input:** capacity and operation sequence.  
**Output:** values from `get` operations.  
**Hint:** hashmap + doubly linked list.

### 21. Merge Intervals
**Difficulty:** Medium  
**Prompt:** Merge all overlapping intervals and return non-overlapping result.  
**Input:** intervals `[[start,end], ...]`.  
**Output:** merged intervals sorted by start.

### 22. Trapping Rain Water
**Difficulty:** Hard  
**Prompt:** Given elevation map heights, compute total trapped rainwater.  
**Input:** integer array `height`.  
**Output:** total trapped units.  
**Hint:** two pointers / prefix-suffix max.

### 23. Word Break
**Difficulty:** Hard  
**Prompt:** Determine if string `s` can be segmented into one or more dictionary words.  
**Input:** string `s`, list `wordDict`.  
**Output:** `true/false`.  
**Hint:** DP over prefixes.

### 24. Best Time to Buy and Sell Stock
**Difficulty:** Easy  
**Prompt:** Given stock prices by day, return max profit with one buy and one sell (buy before sell).  
**Input:** prices array.  
**Output:** integer max profit.

### 25. Number of Islands
**Difficulty:** Medium  
**Prompt:** Count number of connected components of `'1'` in a 2D grid (horizontal/vertical).  
**Input:** `m x n` grid of `'1'/'0'`.  
**Output:** integer island count.  
**Hint:** DFS/BFS/Union-Find.

### 26. Top K Frequent Elements
**Difficulty:** Medium  
**Prompt:** Return `k` most frequent elements in array.  
**Input:** integer array `nums`, integer `k`.  
**Output:** list of `k` elements in any order.  
**Hint:** hashmap + heap/bucket sort.

### 27. Contains Duplicate II
**Difficulty:** Easy  
**Prompt:** Check if there exist indices `i != j` such that `nums[i] == nums[j]` and `|i - j| <= k`.  
**Input:** array `nums`, integer `k`.  
**Output:** `true/false`.

### 28. Summary Ranges
**Difficulty:** Easy  
**Prompt:** Given sorted unique integers, summarize consecutive runs as range strings (`a->b`) or single number (`a`).  
**Input:** sorted unique array.  
**Output:** array of range strings.

### 29. Meeting Rooms II
**Difficulty:** Medium  
**Prompt:** Given meeting intervals, return minimum number of conference rooms required.  
**Input:** intervals `[[start,end], ...]`.  
**Output:** integer rooms count.  
**Hint:** sweep line or min-heap of end times.

### 30. Reconstruct Itinerary
**Difficulty:** Hard  
**Prompt:** Given flight tickets `[from, to]`, reconstruct itinerary starting at `JFK` using all tickets exactly once. If multiple, return lexicographically smallest.  
**Input:** list of directed edges.  
**Output:** ordered airport path.  
**Hint:** Hierholzer + min-order adjacency.

### 31. First Missing Positive
**Difficulty:** Hard  
**Prompt:** Find smallest missing positive integer from unsorted array in `O(n)` time and `O(1)` extra space.  
**Input:** integer array.  
**Output:** smallest missing positive integer.

### 32. Subarray Sum Equals K
**Difficulty:** Medium  
**Prompt:** Count number of continuous subarrays whose sum equals `k`.  
**Input:** integer array `nums`, integer `k`.  
**Output:** count.  
**Hint:** prefix sum + hashmap frequencies.

### 33. Reverse Integer
**Difficulty:** Easy  
**Prompt:** Reverse digits of signed 32-bit integer. Return `0` if reversed value overflows signed 32-bit range.  
**Input:** integer `x`.  
**Output:** reversed integer or `0`.

### 34. Valid Anagram
**Difficulty:** Medium (as requested in your mapping)  
**Prompt:** Determine if two strings are anagrams (same character counts).  
**Input:** strings `s`, `t`.  
**Output:** `true/false`.

### 35. Count Primes
**Difficulty:** Hard (as requested in your mapping)  
**Prompt:** Count number of prime numbers strictly less than `n`.  
**Input:** integer `n`.  
**Output:** prime count.  
**Hint:** Sieve of Eratosthenes.

