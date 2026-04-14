import type { MCQQuestion } from "@/models/Test";

export interface DsaMcqSeed {
  mcq: MCQQuestion;
  section: string;
  tags: string[];
}

/** Curated DSA theory MCQs — correct answers stored for admin library picks. */
export const DSA_MCQ_LIBRARY: DsaMcqSeed[] = [
  {
    section: "Complexity",
    tags: ["dsa", "complexity", "big-o"],
    mcq: {
      questionText: "What is the average time complexity of binary search on a sorted array of n elements?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Complexity",
    tags: ["dsa", "complexity"],
    mcq: {
      questionText: "Which bound describes the worst-case height of a binary min-heap with n nodes?",
      options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
      selectionType: "single",
      correctOption: 0,
      marks: 1,
    },
  },
  {
    section: "Data structures",
    tags: ["dsa", "stack", "queue"],
    mcq: {
      questionText: "Which structure is typically FIFO?",
      options: ["Stack", "Queue", "Max-heap", "Trie"],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Data structures",
    tags: ["dsa", "hash-table"],
    mcq: {
      questionText: "Average-case lookup in a well-implemented hash map is usually:",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      selectionType: "single",
      correctOption: 0,
      marks: 1,
    },
  },
  {
    section: "Trees",
    tags: ["dsa", "bst", "trees"],
    mcq: {
      questionText: "In a valid BST with unique keys, an inorder traversal yields values in:",
      options: ["Random order", "Ascending order", "Descending order only if reversed", "Heap order"],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Graphs",
    tags: ["dsa", "graphs", "bfs"],
    mcq: {
      questionText: "BFS on an unweighted graph often finds:",
      options: [
        "Shortest path edge count from a source in an unweighted graph",
        "Minimum spanning tree always",
        "Topological order always",
        "The diameter only",
      ],
      selectionType: "single",
      correctOption: 0,
      marks: 1,
    },
  },
  {
    section: "Graphs",
    tags: ["dsa", "graphs", "dfs"],
    mcq: {
      questionText: "DFS is commonly used for (select all that apply):",
      options: [
        "Detecting cycles in directed graphs",
        "Topological sort (with postorder on DAGs)",
        "Guaranteed shortest path in unweighted graphs",
        "Connected components (undirected)",
      ],
      selectionType: "multiple",
      correctOptions: [0, 1, 3],
      correctOption: 0,
      marks: 2,
    },
  },
  {
    section: "Dynamic programming",
    tags: ["dsa", "dp"],
    mcq: {
      questionText: "Memoization in top-down DP mainly reduces:",
      options: ["Space always to O(1)", "Repeated subproblems time", "Input size", "None of the above"],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Sorting",
    tags: ["dsa", "sorting"],
    mcq: {
      questionText: "Merge sort worst-case time complexity is:",
      options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Sorting",
    tags: ["dsa", "sorting"],
    mcq: {
      questionText: "Quick sort’s worst-case time can be O(n²) when:",
      options: [
        "Random pivots are always chosen",
        "Bad pivot choices cause unbalanced partitions repeatedly",
        "The array is already sorted and we use merge step",
        "Never — it is always O(n log n)",
      ],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Two pointers",
    tags: ["dsa", "two-pointers"],
    mcq: {
      questionText: "On a sorted array, the 3Sum problem is often approached in:",
      options: ["O(n³) only", "O(n²) using sorting + two pointers per outer index", "O(n) always", "O(log n)"],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Bit manipulation",
    tags: ["dsa", "bit"],
    mcq: {
      questionText: "XOR of a number with itself is:",
      options: ["1", "0", "The number doubled", "Undefined"],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Dynamic programming",
    tags: ["dsa", "dp", "knapsack"],
    mcq: {
      questionText: "Which traits commonly indicate a dynamic programming approach? (select all that apply)",
      options: [
        "Optimal substructure",
        "Overlapping subproblems",
        "Always requires recursion only",
        "Memoization/tabulation can avoid recomputation",
      ],
      selectionType: "multiple",
      correctOptions: [0, 1, 3],
      correctOption: 0,
      marks: 2,
    },
  },
  {
    section: "Trees",
    tags: ["dsa", "trees", "traversal"],
    mcq: {
      questionText: "Which traversals are depth-first? (select all that apply)",
      options: ["Preorder", "Inorder", "Postorder", "Level order"],
      selectionType: "multiple",
      correctOptions: [0, 1, 2],
      correctOption: 0,
      marks: 2,
    },
  },
  {
    section: "Graphs",
    tags: ["dsa", "graphs", "topological-sort"],
    mcq: {
      questionText: "Topological sort is valid only for:",
      options: ["Undirected cyclic graphs", "Directed acyclic graphs (DAGs)", "Any weighted graph", "Trees only"],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Data structures",
    tags: ["dsa", "heap", "priority-queue"],
    mcq: {
      questionText: "Which statements about binary heaps are true? (select all that apply)",
      options: [
        "Insert in a binary heap is O(log n)",
        "Get-min in a min-heap is O(1)",
        "A binary heap is always a binary search tree",
        "Delete-min in a min-heap is O(log n)",
      ],
      selectionType: "multiple",
      correctOptions: [0, 1, 3],
      correctOption: 0,
      marks: 2,
    },
  },
  {
    section: "Complexity",
    tags: ["dsa", "complexity", "amortized"],
    mcq: {
      questionText: "For dynamic arrays (vector/ArrayList style), append is typically:",
      options: ["Worst-case O(1) and amortized O(n)", "Worst-case O(n) and amortized O(1)", "Worst-case O(log n)", "Always O(n)"],
      selectionType: "single",
      correctOption: 1,
      marks: 1,
    },
  },
  {
    section: "Greedy",
    tags: ["dsa", "greedy"],
    mcq: {
      questionText: "A greedy algorithm is guaranteed to be optimal when:",
      options: [
        "The problem has greedy-choice property and optimal substructure",
        "The input is already sorted",
        "The algorithm uses recursion",
        "The problem has overlapping subproblems",
      ],
      selectionType: "single",
      correctOption: 0,
      marks: 1,
    },
  },
  {
    section: "Bit manipulation",
    tags: ["dsa", "bit", "binary"],
    mcq: {
      questionText: "Which expressions can be used to test if n is even? (select all that apply)",
      options: ["n % 2 == 0", "(n & 1) == 0", "(n | 1) == 0", "(n ^ 1) == n + 1"],
      selectionType: "multiple",
      correctOptions: [0, 1],
      correctOption: 0,
      marks: 2,
    },
  },
  {
    section: "Sliding window",
    tags: ["dsa", "sliding-window", "strings"],
    mcq: {
      questionText: "Sliding window is especially useful when:",
      options: [
        "Handling contiguous subarray/substring constraints",
        "Enumerating all subsets",
        "Computing shortest paths in weighted graphs",
        "Maintaining dynamic frequency/count in a moving range",
      ],
      selectionType: "multiple",
      correctOptions: [0, 3],
      correctOption: 0,
      marks: 2,
    },
  },
];
