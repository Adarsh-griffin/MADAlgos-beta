/**
 * Seeds public practice packs into the `practice_test` collection (see PracticeTest model).
 * Idempotent: upserts by publicSlug.
 *
 * Usage: npm run seed:public-tests
 *
 * Themes loosely mirror common hiring-assessment mixes (DSA-heavy OA-style for product companies;
 * aptitude + lighter code for IT services — not copied from any proprietary test).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import {
  googleHiringAssessmentDelivery,
  googleHiringCodingProblems,
} from "./google-hiring-practice-coding.mjs";
import {
  microsoftHiringAssessmentDelivery,
  microsoftHiringCodingProblems,
} from "./microsoft-hiring-practice-coding.mjs";
import {
  tcsHiringAssessmentDelivery,
  tcsHiringCodingProblems,
} from "./tcs-hiring-practice-coding.mjs";
import {
  capgeminiHiringAssessmentDelivery,
  capgeminiHiringCodingProblems,
} from "./capgemini-hiring-practice-coding.mjs";
import {
  infosysHiringAssessmentDelivery,
  infosysHiringCodingProblems,
} from "./infosys-hiring-practice-coding.mjs";
import {
  metaHiringAssessmentDelivery,
  metaHiringCodingProblems,
} from "./meta-hiring-practice-coding.mjs";
import {
  appleHiringAssessmentDelivery,
  appleHiringCodingProblems,
} from "./apple-hiring-practice-coding.mjs";
import {
  netflixHiringAssessmentDelivery,
  netflixHiringCodingProblems,
} from "./netflix-hiring-practice-coding.mjs";
import {
  amazonHiringAssessmentDelivery,
  amazonHiringCodingProblems,
} from "./amazon-hiring-practice-coding.mjs";
import {
  techMahindraHiringAssessmentDelivery,
  techMahindraHiringCodingProblems,
} from "./tech-mahindra-hiring-practice-coding.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

function loadEnvFiles() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(projectRoot, name);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

loadEnvFiles();

const PRACTICE = "practice_test";
const USERS = "users";
const LOGO_DEV_TOKEN =
  process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN ??
  process.env.LOGO_DEV_TOKEN ??
  "pk_J68nV3eLS8C3y2kWZfKEFw";

function logoDevUrl(domain) {
  const d = String(domain || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split("/")[0];
  if (!d) return "";
  return `https://img.logo.dev/${d}?token=${LOGO_DEV_TOKEN}&retina=true`;
}

const pyReadIntList = `import sys

def ints():
    return list(map(int, sys.stdin.read().split()))
`;

const starterKadane = {
  Python: `${pyReadIntList}
def main():
    data = ints()
    n = data[0]
    arr = data[1 : 1 + n]
    # TODO: maximum contiguous subarray sum (Kadane)
    print(0)

main()
`,
};

const starterBrackets = {
  Python: `import sys

def main():
    s = sys.stdin.readline().strip()
    # TODO: return YES if parentheses (), [] are balanced, else NO
    print("NO")

main()
`,
};

const starterBinarySearch = {
  Python: `${pyReadIntList}
def main():
    data = ints()
    n, target = data[0], data[1]
    arr = data[2 : 2 + n]
    # TODO: print 1 if target is in sorted arr, else 0
    print(0)

main()
`,
};

const starterReverse = {
  Python: `import sys

def main():
    s = sys.stdin.readline().strip()
    # TODO: print reversed string
    print("")

main()
`,
};

const starterSumDigits = {
  Python: `import sys

def main():
    n = int(sys.stdin.readline())
    # TODO: sum of decimal digits of n (n >= 0)
    print(0)

main()
`,
};

const starterPrime = {
  Python: `import sys

def main():
    n = int(sys.stdin.readline())
    # TODO: print 1 if n is prime, else 0 (assume n >= 2)
    print(0)

main()
`,
};

const starterFactorial = {
  Python: `import sys

def main():
    n = int(sys.stdin.readline())
    # TODO: print n! for 0 <= n <= 12
    print(1)

main()
`,
};

const starterGcd = {
  Python: `import sys

def main():
    a, b = map(int, sys.stdin.readline().split())
    # TODO: print gcd(a, b)
    print(0)

main()
`,
};

/** @type {Array<Record<string, unknown>>} */
const PACKS = [
  {
    publicSlug: "google-hiring-practice",
    title: "Google — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "OA-style mix: MCQs plus six stdin coding tasks (two-sum → trapping rain water). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "google.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 1,
    assessmentDelivery: googleHiringAssessmentDelivery,
    mcqs: [
      {
        questionText:
          "Which bound is typical for comparison-based general-purpose sorting of n items in the worst case?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctOption: 1,
        marks: 5,
        selectionType: "single",
      },
      {
        questionText:
          "A hash map with a good hash function averages which lookup time for keys (typical case)?",
        options: ["O(log n)", "O(1)", "O(n)", "O(n log n)"],
        correctOption: 1,
        marks: 5,
        selectionType: "single",
      },
      {
        questionText: "DFS on a binary tree with n nodes visits each node how many times in the standard implementation?",
        options: ["Once", "Twice", "Thrice", "Depends only on height"],
        correctOption: 0,
        marks: 5,
        selectionType: "single",
      },
      {
        questionText:
          "In Big-O, the space of the classic iterative Fibonacci using two variables is:",
        options: ["O(n)", "O(log n)", "O(1)", "O(2ⁿ)"],
        correctOption: 2,
        marks: 5,
        selectionType: "single",
      },
      {
        questionText: "Which structure is best suited for LRU cache eviction in O(1) amortized operations (conceptually)?",
        options: ["Queue only", "Hash map + doubly linked list", "Min-heap only", "Array only"],
        correctOption: 1,
        marks: 5,
        selectionType: "single",
      },
    ],
    codingProblems: googleHiringCodingProblems,
  },
  {
    publicSlug: "microsoft-hiring-practice",
    title: "Microsoft — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "Windows/Azure CS fundamentals plus six stdin coding tasks (OneDrive → pipeline backpressure). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "microsoft.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 2,
    assessmentDelivery: microsoftHiringAssessmentDelivery,
    mcqs: [
      {
        questionText: "In Win32-style processes, a crash in one user-mode process typically:",
        options: [
          "Terminates every other process",
          "Is isolated — other processes often keep running",
          "Always corrupts the kernel permanently",
          "Requires a full disk format",
        ],
        correctOption: 1,
        marks: 5,
        selectionType: "single",
      },
      {
        questionText: "Which construct is most often used to protect a shared variable across threads?",
        options: ["Garbage collector", "Mutex / lock", "TCP port", "CSS grid"],
        correctOption: 1,
        marks: 5,
        selectionType: "single",
      },
      {
        questionText: "Virtual memory allows:",
        options: [
          "Programs to use more address space than physical RAM (with paging)",
          "RAM to be replaced by DNS",
          "Guaranteed O(1) disk access",
          "Removing the need for any CPU caches",
        ],
        correctOption: 0,
        marks: 5,
        selectionType: "single",
      },
      {
        questionText: "TCP differs from UDP mainly in that TCP provides:",
        options: [
          "Connectionless best-effort delivery only",
          "Ordered, reliable byte streams (with congestion control)",
          "Always faster for live video",
          "Encryption by default without TLS",
        ],
        correctOption: 1,
        marks: 5,
        selectionType: "single",
      },
      {
        questionText: "Binary search on a sorted array of n distinct elements has worst-case time:",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctOption: 1,
        marks: 5,
        selectionType: "single",
      },
    ],
    codingProblems: microsoftHiringCodingProblems,
  },
  {
    publicSlug: "tcs-hiring-practice",
    title: "TCS — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "IT services pattern: aptitude MCQs plus six stdin tasks (payroll → data-centre cooling). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "tcs.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 3,
    assessmentDelivery: tcsHiringAssessmentDelivery,
    mcqs: [
      {
        questionText: "If a train 120 m long crosses a pole in 4 s, its speed in m/s is:",
        options: ["20", "30", "40", "50"],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
      {
        questionText: "10% of 200 plus 5% of 400 equals:",
        options: ["30", "40", "45", "50"],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
      {
        questionText: "In C/Java-style memory, which area typically holds local variables inside a function call?",
        options: ["Heap only", "Stack", "Text segment of PNG files", "DNS cache"],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
      {
        questionText: "The time complexity of binary search on a sorted array is:",
        options: ["O(n²)", "O(log n)", "O(n log n)", "O(1) always"],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
      {
        questionText: "Logical complement of (A AND B) is equivalent to:",
        options: ["(NOT A) AND (NOT B)", "(NOT A) OR (NOT B)", "A OR B", "Always true"],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
    ],
    codingProblems: tcsHiringCodingProblems,
  },
  {
    publicSlug: "capgemini-hiring-practice",
    title: "Capgemini — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "Consulting-tech blend: SQL/agile MCQs plus six stdin tasks (sprint budget → transformation bottlenecks). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "capgemini.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 4,
    assessmentDelivery: capgeminiHiringAssessmentDelivery,
    mcqs: [
      {
        questionText: "In SQL, which clause filters rows **before** aggregation is applied?",
        options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY alone"],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
      {
        questionText: "Agile Scrum: who owns ordering the product backlog for maximum value?",
        options: ["Scrum Master", "Product Owner", "QA only", "DevOps contractor"],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
      {
        questionText: "HTTP status 404 means:",
        options: ["Server error", "Not Found", "Created", "Unauthorized"],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
      {
        questionText: "REST APIs often use JSON because it is:",
        options: [
          "Binary-only and unreadable",
          "Human-readable and widely supported in web stacks",
          "Always encrypted without HTTPS",
          "Faster than RAM",
        ],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
      {
        questionText: "Normalization in relational DB design primarily reduces:",
        options: [
          "Only disk RPM",
          "Redundancy / update anomalies",
          "Need for any primary keys",
          "Internet latency",
        ],
        correctOption: 1,
        marks: 4,
        selectionType: "single",
      },
    ],
    codingProblems: capgeminiHiringCodingProblems,
  },
  {
    publicSlug: "amazon-hiring-practice",
    title: "Amazon — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "OA-style MCQs plus six stdin tasks (delivery truck match → S3 tier overflow). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "amazon.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 5,
    assessmentDelivery: amazonHiringAssessmentDelivery,
    mcqs: [
      { questionText: "Which data structure is ideal for BFS traversal?", options: ["Stack", "Queue", "Heap", "Trie"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Amortized time for push in dynamic array is typically:", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctOption: 2, marks: 5, selectionType: "single" },
      { questionText: "If a hash table load factor grows too much, preferred action is:", options: ["Reverse keys", "Rehash/resize", "Sort all keys", "Use recursion"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Two-pointer technique is most useful when:", options: ["Data is random graph", "Input often has ordering/monotonicity", "Only recursion allowed", "Memory is infinite"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Worst-case lookup in an unbalanced BST is:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctOption: 2, marks: 5, selectionType: "single" },
    ],
    codingProblems: amazonHiringCodingProblems,
  },
  {
    publicSlug: "meta-hiring-practice",
    title: "Meta — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "Product-style MCQs plus six stdin tasks (ads spend → Stories engagement trap). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "meta.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 6,
    assessmentDelivery: metaHiringAssessmentDelivery,
    mcqs: [
      { questionText: "Typical average lookup complexity in hash set:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctOption: 0, marks: 5, selectionType: "single" },
      { questionText: "A stable sort guarantees:", options: ["In-place only", "Equal keys keep relative order", "Always O(n)", "No recursion"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Prefix sums help answer range-sum queries in:", options: ["O(1) per query after preprocess", "O(n) per query", "O(log n) preprocess", "Impossible"], correctOption: 0, marks: 5, selectionType: "single" },
      { questionText: "When using sliding window, window movement is usually:", options: ["Random", "Monotonic over indices", "Recursive tree-only", "Hash collision-based"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Time to traverse graph with V nodes and E edges using BFS:", options: ["O(V)", "O(E)", "O(V+E)", "O(VE)"], correctOption: 2, marks: 5, selectionType: "single" },
    ],
    codingProblems: metaHiringCodingProblems,
  },
  {
    publicSlug: "apple-hiring-practice",
    title: "Apple — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "Core CS MCQs plus six stdin tasks (Music offline quota → camera lens flare trap). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "apple.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 7,
    assessmentDelivery: appleHiringAssessmentDelivery,
    mcqs: [
      { questionText: "Which sorting algorithm is NOT comparison-based?", options: ["Merge sort", "Heap sort", "Counting sort", "Quick sort"], correctOption: 2, marks: 5, selectionType: "single" },
      { questionText: "Binary search requires input to be:", options: ["Unique only", "Sorted", "Prime-sized", "2D"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "A min-heap guarantees:", options: ["Sorted traversal", "Root is minimum", "Leaves are sorted", "O(1) delete all"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Recursion depth risk in practice is mainly:", options: ["Hash collisions", "Stack overflow", "DNS failure", "Cache line split"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Which is best for fast membership checks?", options: ["Array scan", "Hash set", "Linked list", "Plain string"], correctOption: 1, marks: 5, selectionType: "single" },
    ],
    codingProblems: appleHiringCodingProblems,
  },
  {
    publicSlug: "netflix-hiring-practice",
    title: "Netflix — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "Streaming/CDN-style MCQs plus six stdin tasks (licensing slots → encoding buffer trap). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "netflix.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 8,
    assessmentDelivery: netflixHiringAssessmentDelivery,
    mcqs: [
      { questionText: "Asymptotically faster growth means:", options: ["Smaller input only", "Worse scalability for large n", "Always less memory", "No difference"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Which complexity is better at scale?", options: ["O(n²)", "O(n log n)", "O(2ⁿ)", "O(n!)"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Caching helps mainly by reducing:", options: ["Code readability", "Repeated expensive computation/latency", "Need for tests", "CPU clock speed"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Two-sum optimal common approach uses:", options: ["Nested loops only", "Hash map", "DFS tree", "Heap sort each step"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Space complexity of iterative binary search is:", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctOption: 2, marks: 5, selectionType: "single" },
    ],
    codingProblems: netflixHiringCodingProblems,
  },
  {
    publicSlug: "tech-mahindra-hiring-practice",
    title: "Tech Mahindra — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "Telecom / services MCQs plus six stdin tasks (plan budget → tower shadow). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "techmahindra.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 9,
    assessmentDelivery: techMahindraHiringAssessmentDelivery,
    mcqs: [
      { questionText: "Simple interest on P at rate R for T years is:", options: ["P*R*T", "P*R*T/100", "P+R+T", "P*R/100T"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "In OOP, encapsulation means:", options: ["Only inheritance", "Bundling data with methods + controlled access", "Only polymorphism", "No classes"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "HTTP 500 indicates:", options: ["Client typo", "Server-side error", "Auth success", "Redirect permanent"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "Queue follows:", options: ["LIFO", "FIFO", "Random order", "Priority always"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "Best known complexity for checking primality up to sqrt(n) is:", options: ["O(n)", "O(log n)", "O(sqrt(n))", "O(n²)"], correctOption: 2, marks: 4, selectionType: "single" },
    ],
    codingProblems: techMahindraHiringCodingProblems,
  },
  {
    publicSlug: "infosys-hiring-practice",
    title: "Infosys — hiring practice",
    duration: 130,
    demoCardSubtitle:
      "Campus / InfyTQ style: quant MCQs plus six stdin tasks (training calendar → campus rainwater). Multi-language starters. Timed, autosave.",
    demoLogoDomain: "infosys.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 10,
    assessmentDelivery: infosysHiringAssessmentDelivery,
    mcqs: [
      { questionText: "If x:y = 3:4 and y=20, x is:", options: ["10", "12", "15", "16"], correctOption: 2, marks: 4, selectionType: "single" },
      { questionText: "Which SQL command removes rows but keeps table structure?", options: ["DROP", "DELETE", "REMOVE", "ERASE"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "Binary representation of decimal 10 is:", options: ["1001", "1010", "1100", "1110"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "A function calling itself is:", options: ["Iteration", "Recursion", "Encapsulation", "Compilation"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "Time complexity of linear search is:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctOption: 2, marks: 4, selectionType: "single" },
    ],
    codingProblems: infosysHiringCodingProblems,
  },
];

function pickDifficultyByIndex(index, total) {
  if (total <= 1) return "medium";
  const ratio = index / (total - 1);
  if (ratio < 0.34) return "easy";
  if (ratio < 0.67) return "medium";
  return "hard";
}

const MCQ_DISTRIBUTION = [
  "easy", "easy", "easy", "easy",
  "medium", "medium", "medium", "medium",
  "hard", "hard", "hard", "hard",
];

const CODING_DISTRIBUTION = ["easy", "easy", "medium", "medium", "hard", "hard"];

const CURATED_CODING_SET = [
  {
    title: "Two Sum",
    description: `You are given an array of integers and a target value. Return the indices of the two numbers such that they add up to the target.

Constraints:
- Exactly one valid pair exists.
- You cannot use the same element twice.
- Aim for an O(n) solution using hashing.

Example:
- nums = [2, 7, 11, 15], target = 9
- Output: 0 1`,
    inputFormat: "Line 1: n target\nLine 2: n space-separated integers",
    outputFormat: "Print two indices i j in increasing order.",
    sampleTestCases: [{ input: "4 9\n2 7 11 15\n", output: "0 1\n" }],
    hiddenTestCases: [{ input: "3 6\n3 2 4\n", output: "1 2\n" }, { input: "2 6\n3 3\n", output: "0 1\n" }],
    marks: 20,
    starterCode: {
      Python: `${pyReadIntList}
def main():
    data = ints()
    n, target = data[0], data[1]
    nums = data[2:2+n]
    # TODO: print indices of the two numbers summing to target
    print("0 1")

main()
`,
    },
  },
  {
    title: "Valid Parentheses",
    description: `Given a string containing only the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

A string is valid if:
- Open brackets are closed by the same type of brackets.
- Open brackets are closed in the correct order.
- Every close bracket has a corresponding open bracket.

Use a stack-based approach.`,
    inputFormat: "Single line string s.",
    outputFormat: "Print YES if valid, else NO.",
    sampleTestCases: [{ input: "()[]{}\n", output: "YES\n" }],
    hiddenTestCases: [{ input: "(]\n", output: "NO\n" }, { input: "([{}])\n", output: "YES\n" }],
    marks: 20,
    starterCode: starterBrackets,
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: `Given a string s, find the length of the longest substring without repeating characters.

Expected approach:
- Sliding window with two pointers.
- Hash map / set for tracking seen characters.
- Time complexity target: O(n).`,
    inputFormat: "Single line string s.",
    outputFormat: "Single integer: maximum length.",
    sampleTestCases: [{ input: "abcabcbb\n", output: "3\n" }],
    hiddenTestCases: [{ input: "bbbbb\n", output: "1\n" }, { input: "pwwkew\n", output: "3\n" }],
    marks: 20,
    starterCode: {
      Python: `import sys

def main():
    s = sys.stdin.readline().rstrip("\\n")
    # TODO: print length of longest substring without repeating chars
    print(0)

main()
`,
    },
  },
  {
    title: "Kth Largest Element in an Array",
    description: `Given an integer array nums and an integer k, return the kth largest element in the array.

Notes:
- kth largest means position in sorted order, not kth distinct.
- Prefer O(n log k) using a min-heap of size k, or quickselect average O(n).`,
    inputFormat: "Line 1: n k\nLine 2: n space-separated integers",
    outputFormat: "Single integer: kth largest value.",
    sampleTestCases: [{ input: "6 2\n3 2 1 5 6 4\n", output: "5\n" }],
    hiddenTestCases: [{ input: "9 4\n3 2 3 1 2 4 5 5 6\n", output: "4\n" }],
    marks: 20,
    starterCode: {
      Python: `${pyReadIntList}
def main():
    data = ints()
    n, k = data[0], data[1]
    nums = data[2:2+n]
    # TODO: print kth largest element
    print(0)

main()
`,
    },
  },
  {
    title: "Merge k Sorted Lists (Flattened)",
    description: `You are given k sorted integer lists. Merge them into a single sorted list.

Input is provided as:
- k
- For each list: one line starts with m followed by m sorted integers.

Use a min-heap for an efficient O(N log k) solution, where N is total elements.`,
    inputFormat: "Line 1: k\nNext k lines: m followed by m sorted integers",
    outputFormat: "One line with merged sorted integers separated by spaces.",
    sampleTestCases: [{ input: "3\n3 1 4 5\n3 1 3 4\n2 2 6\n", output: "1 1 2 3 4 4 5 6\n" }],
    hiddenTestCases: [{ input: "2\n0\n3 2 2 2\n", output: "2 2 2\n" }],
    marks: 20,
    starterCode: {
      Python: `import sys

def main():
    # TODO: parse k lists and print merged sorted output
    print("")

main()
`,
    },
  },
  {
    title: "Trapping Rain Water",
    description: `Given n non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining.

Expected solution:
- Two-pointer approach with leftMax/rightMax in O(n) time and O(1) extra space.`,
    inputFormat: "Line 1: n\nLine 2: n space-separated non-negative integers",
    outputFormat: "Single integer: total trapped water.",
    sampleTestCases: [{ input: "12\n0 1 0 2 1 0 1 3 2 1 2 1\n", output: "6\n" }],
    hiddenTestCases: [{ input: "6\n4 2 0 3 2 5\n", output: "9\n" }],
    marks: 20,
    starterCode: {
      Python: `${pyReadIntList}
def main():
    data = ints()
    n = data[0]
    h = data[1:1+n]
    # TODO: print total trapped rain water
    print(0)

main()
`,
    },
  },
];

function cloneWithDifficulty(item, difficulty, seq) {
  const next = { ...item, difficulty };
  void seq;
  return next;
}

function normalizeMcqPool(mcqs) {
  const source = Array.isArray(mcqs) && mcqs.length ? mcqs : [];
  if (!source.length) return [];
  return MCQ_DISTRIBUTION.map((difficulty, idx) => {
    const base = source[idx % source.length];
    const seq = Math.floor(idx / source.length) + 1;
    return cloneWithDifficulty(base, difficulty, seq);
  });
}

function normalizeCodingPool(codingProblems) {
  const source =
    Array.isArray(codingProblems) && codingProblems.length >= 6 ? codingProblems : CURATED_CODING_SET;
  return CODING_DISTRIBUTION.map((difficulty, idx) => {
    const base = source[idx % source.length];
    const seq = Math.floor(idx / source.length) + 1;
    return cloneWithDifficulty(base, difficulty, seq);
  });
}

function withDifficultyTags(pack) {
  const mcqs = normalizeMcqPool(pack.mcqs).map((q, idx, arr) => ({
    ...q,
    difficulty: String(q?.difficulty || pickDifficultyByIndex(idx, arr.length)).toLowerCase(),
  }));

  const codingProblems = normalizeCodingPool(pack.codingProblems).map((q, idx, arr) => ({
    ...q,
    difficulty: String(q?.difficulty || pickDifficultyByIndex(idx, arr.length)).toLowerCase(),
  }));

  return {
    ...pack,
    mcqs,
    codingProblems,
  };
}

async function main() {
  const uri = process.env.MONGODB_URI?.trim() || process.env.DATABASE_URI?.trim();
  if (!uri) {
    console.error("MONGODB_URI / DATABASE_URI is not set.");
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB_NAME?.trim() || process.env.DATABASE_NAME?.trim();
  await mongoose.connect(uri, dbName ? { dbName } : {});

  const db = mongoose.connection.db;
  const usersCol = db.collection(USERS);
  const admin = await usersCol.findOne(
    { role: { $in: ["SUPER_ADMIN", "ADMIN"] } },
    { sort: { createdAt: 1 }, projection: { _id: 1 } }
  );
  if (!admin?._id) {
    console.error("No ADMIN or SUPER_ADMIN user found. Create one first, then re-run.");
    await mongoose.disconnect();
    process.exit(1);
  }

  const practiceCol = db.collection(PRACTICE);
  const now = new Date();

  for (const rawPack of PACKS) {
    const pack = withDifficultyTags(rawPack);
    const {
      publicSlug,
      title,
      duration,
      demoCardSubtitle,
      demoCardImageUrl,
      demoLogoDomain,
      demoBrandLogoUrl,
      demoSortOrder,
      mcqs,
      codingProblems,
    } = pack;

    const resolvedLogoUrl = String(demoBrandLogoUrl || "").trim() || logoDevUrl(demoLogoDomain);

    await practiceCol.updateOne(
      { publicSlug },
      {
        $set: {
          title,
          duration,
          linkValidity: 168,
          mcqs,
          codingProblems,
          publicSlug,
          demoCardSubtitle,
          demoCardImageUrl,
          demoLogoDomain,
          demoBrandLogoUrl: resolvedLogoUrl,
          demoSortOrder,
          showOnHomepage: true,
          assessmentDelivery: {
            mcqPerAttempt: 4,
            codingPerAttempt: 2,
            easyDurationMinutes: 35,
            mediumDurationMinutes: 45,
            hardDurationMinutes: 55,
          },
          updatedAt: now,
        },
        $setOnInsert: {
          createdBy: admin._id,
          createdAt: now,
        },
      },
      { upsert: true }
    );
    console.log("Upserted:", publicSlug, `(${duration} min — ${mcqs.length} MCQ, ${codingProblems.length} coding)`);
  }

  await mongoose.disconnect();
  console.log("Done. Restart dev server if needed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
