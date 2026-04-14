/**
 * Canonical Blind 75 style curated list (titles + LeetCode slugs + section).
 * Sections match common DSA groupings (NeetCode / interview handbook style).
 * Official statement & tests: https://leetcode.com/problems/<slug>/
 *
 * LeetCode collection list id (community): oizxjoit — may differ slightly; this list is the standard Blind 75 set.
 */

export type Blind75Section =
  | "Arrays & Hashing"
  | "Two Pointers"
  | "Sliding Window"
  | "Stack"
  | "Binary Search"
  | "Linked List"
  | "Trees"
  | "Tries"
  | "Heap"
  | "Backtracking"
  | "Graphs"
  | "Advanced Graphs"
  | "Dynamic Programming"
  | "Greedy"
  | "Intervals"
  | "Bit Manipulation";

export interface Blind75Row {
  title: string;
  slug: string;
  section: Blind75Section;
}

/** Explicit titles (avoid slug→title errors for 3Sum, II, etc.) */
export const BLIND_75: Blind75Row[] = [
  { title: "Two Sum", slug: "two-sum", section: "Arrays & Hashing" },
  { title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", section: "Arrays & Hashing" },
  { title: "Contains Duplicate", slug: "contains-duplicate", section: "Arrays & Hashing" },
  { title: "Product of Array Except Self", slug: "product-of-array-except-self", section: "Arrays & Hashing" },
  { title: "Maximum Subarray", slug: "maximum-subarray", section: "Arrays & Hashing" },
  { title: "Maximum Product Subarray", slug: "maximum-product-subarray", section: "Arrays & Hashing" },
  { title: "Find Minimum in Rotated Sorted Array", slug: "find-minimum-in-rotated-sorted-array", section: "Arrays & Hashing" },
  { title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", section: "Arrays & Hashing" },
  { title: "3Sum", slug: "3sum", section: "Arrays & Hashing" },
  { title: "Container With Most Water", slug: "container-with-most-water", section: "Arrays & Hashing" },

  { title: "Sum of Two Integers", slug: "sum-of-two-integers", section: "Bit Manipulation" },
  { title: "Number of 1 Bits", slug: "number-of-1-bits", section: "Bit Manipulation" },
  { title: "Counting Bits", slug: "counting-bits", section: "Bit Manipulation" },
  { title: "Missing Number", slug: "missing-number", section: "Bit Manipulation" },
  { title: "Reverse Bits", slug: "reverse-bits", section: "Bit Manipulation" },

  { title: "Climbing Stairs", slug: "climbing-stairs", section: "Dynamic Programming" },
  { title: "Coin Change", slug: "coin-change", section: "Dynamic Programming" },
  { title: "Longest Increasing Subsequence", slug: "longest-increasing-subsequence", section: "Dynamic Programming" },
  { title: "Longest Common Subsequence", slug: "longest-common-subsequence", section: "Dynamic Programming" },
  { title: "Word Break", slug: "word-break", section: "Dynamic Programming" },
  { title: "Combination Sum", slug: "combination-sum", section: "Dynamic Programming" },
  { title: "House Robber", slug: "house-robber", section: "Dynamic Programming" },
  { title: "House Robber II", slug: "house-robber-ii", section: "Dynamic Programming" },
  { title: "Decode Ways", slug: "decode-ways", section: "Dynamic Programming" },
  { title: "Unique Paths", slug: "unique-paths", section: "Dynamic Programming" },
  { title: "Jump Game", slug: "jump-game", section: "Dynamic Programming" },

  { title: "Clone Graph", slug: "clone-graph", section: "Graphs" },
  { title: "Course Schedule", slug: "course-schedule", section: "Graphs" },
  { title: "Number of Islands", slug: "number-of-islands", section: "Graphs" },
  { title: "Word Search", slug: "word-search", section: "Graphs" },

  { title: "Longest Consecutive Sequence", slug: "longest-consecutive-sequence", section: "Arrays & Hashing" },
  { title: "Valid Palindrome", slug: "valid-palindrome", section: "Two Pointers" },
  { title: "Two Sum II — Input Array Is Sorted", slug: "two-sum-ii-input-array-is-sorted", section: "Two Pointers" },
  { title: "3Sum Closest", slug: "3sum-closest", section: "Two Pointers" },
  { title: "Trapping Rain Water", slug: "trapping-rain-water", section: "Two Pointers" },

  { title: "Best Time to Buy and Sell Stock II", slug: "best-time-to-buy-and-sell-stock-ii", section: "Greedy" },
  { title: "Jump Game II", slug: "jump-game-ii", section: "Greedy" },
  { title: "Merge Intervals", slug: "merge-intervals", section: "Intervals" },
  { title: "Insert Interval", slug: "insert-interval", section: "Intervals" },
  { title: "Non-overlapping Intervals", slug: "non-overlapping-intervals", section: "Intervals" },

  { title: "Reverse Linked List", slug: "reverse-linked-list", section: "Linked List" },
  { title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", section: "Linked List" },
  { title: "Reorder List", slug: "reorder-list", section: "Linked List" },
  { title: "Remove Nth Node From End of List", slug: "remove-nth-node-from-end-of-list", section: "Linked List" },
  { title: "Linked List Cycle II", slug: "linked-list-cycle-ii", section: "Linked List" },

  { title: "Set Matrix Zeroes", slug: "set-matrix-zeroes", section: "Arrays & Hashing" },
  { title: "Spiral Matrix", slug: "spiral-matrix", section: "Arrays & Hashing" },

  { title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", section: "Sliding Window" },
  { title: "Minimum Window Substring", slug: "minimum-window-substring", section: "Sliding Window" },
  { title: "Sliding Window Maximum", slug: "sliding-window-maximum", section: "Sliding Window" },
  { title: "Minimum Size Subarray Sum", slug: "minimum-size-subarray-sum", section: "Sliding Window" },

  { title: "Valid Parentheses", slug: "valid-parentheses", section: "Stack" },
  { title: "Daily Temperatures", slug: "daily-temperatures", section: "Stack" },
  { title: "Car Fleet", slug: "car-fleet", section: "Stack" },
  { title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram", section: "Stack" },

  { title: "Binary Search", slug: "binary-search", section: "Binary Search" },
  { title: "Search a 2D Matrix", slug: "search-a-2d-matrix", section: "Binary Search" },
  { title: "Invert Binary Tree", slug: "invert-binary-tree", section: "Trees" },
  { title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", section: "Trees" },
  { title: "Diameter of Binary Tree", slug: "diameter-of-binary-tree", section: "Trees" },
  { title: "Validate Binary Search Tree", slug: "validate-binary-search-tree", section: "Trees" },
  { title: "Kth Smallest Element in a BST", slug: "kth-smallest-element-in-a-bst", section: "Trees" },
  { title: "Lowest Common Ancestor of a Binary Search Tree", slug: "lowest-common-ancestor-of-a-binary-search-tree", section: "Trees" },
  { title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", section: "Trees" },
  { title: "Serialize and Deserialize Binary Tree", slug: "serialize-and-deserialize-binary-tree", section: "Trees" },
  { title: "Subtree of Another Tree", slug: "subtree-of-another-tree", section: "Trees" },
  { title: "Construct Binary Tree from Preorder and Inorder Traversal", slug: "construct-binary-tree-from-preorder-and-inorder-traversal", section: "Trees" },

  { title: "Implement Trie (Prefix Tree)", slug: "implement-trie-prefix-tree", section: "Tries" },
  { title: "Word Search II", slug: "word-search-ii", section: "Tries" },

  { title: "Top K Frequent Elements", slug: "top-k-frequent-elements", section: "Heap" },
  { title: "Find Median from Data Stream", slug: "find-median-from-data-stream", section: "Heap" },

  { title: "Subsets", slug: "subsets", section: "Backtracking" },
  { title: "Combination Sum II", slug: "combination-sum-ii", section: "Backtracking" },

  { title: "Course Schedule II", slug: "course-schedule-ii", section: "Advanced Graphs" },
];

if (BLIND_75.length !== 75 && process.env.NODE_ENV !== "production") {
  console.warn(`BLIND_75 expected 75 entries, got ${BLIND_75.length}`);
}
