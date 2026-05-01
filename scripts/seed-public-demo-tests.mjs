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
    duration: 50,
    demoCardSubtitle:
      "OA-style mix: DSA fundamentals + 2 coding tasks (~45–60 min industry-style sprints). Timed, autosave.",
    demoLogoDomain: "google.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 1,
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
    codingProblems: [
      {
        title: "Maximum subarray sum (Kadane)",
        description: `Given an integer array, find the maximum sum of a contiguous subarray.

Read from stdin:
- Line 1: integer n (1 ≤ n ≤ 10⁵)
- Line 2: n space-separated integers (each |value| ≤ 10⁹)

Print one integer: the maximum sum. Use a single pass O(n).`,
        inputFormat: "Line 1: n. Line 2: n integers.",
        outputFormat: "Single integer (with newline).",
        sampleTestCases: [{ input: "5\n1 -3 2 1 -2\n", output: "3\n" }],
        hiddenTestCases: [
          { input: "1\n5\n", output: "5\n" },
          { input: "4\n-1 -2 -3 -4\n", output: "-1\n" },
          { input: "6\n3 -2 5 -1 3 -4\n", output: "8\n" },
        ],
        marks: 20,
        starterCode: starterKadane,
      },
      {
        title: "Balanced bracket string",
        description: `Determine if a string made only of '(', ')', '[', ']' is **validly** bracketed (properly nested and closed).

Read one line from stdin: the string (length ≤ 5000).

Print YES if valid, otherwise NO.`,
        inputFormat: "One line, bracket characters only.",
        outputFormat: "YES or NO (uppercase) with newline.",
        sampleTestCases: [{ input: "([])\n", output: "YES\n" }],
        hiddenTestCases: [
          { input: "([)]\n", output: "NO\n" },
          { input: "((\n", output: "NO\n" },
          { input: "()[]()\n", output: "YES\n" },
        ],
        marks: 20,
        starterCode: starterBrackets,
      },
    ],
  },
  {
    publicSlug: "microsoft-hiring-practice",
    title: "Microsoft — hiring practice",
    duration: 42,
    demoCardSubtitle:
      "Systems + coding: Windows/Azure-friendly CS concepts with two stdin tasks (multi-section screen ~40 min).",
    demoLogoDomain: "microsoft.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 2,
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
    codingProblems: [
      {
        title: "Sorted array search (exists?)",
        description: `Given **sorted** distinct integers, report whether a target appears.

Read stdin:
- Line 1: n and target (space-separated)
- Line 2: n increasing integers

Print 1 if target is present, else 0.`,
        inputFormat: "n target, then n sorted ints.",
        outputFormat: "1 or 0 with newline.",
        sampleTestCases: [{ input: "6 4\n1 3 4 5 7 9\n", output: "1\n" }],
        hiddenTestCases: [
          { input: "5 10\n1 2 3 4 5\n", output: "0\n" },
          { input: "1 7\n7\n", output: "1\n" },
        ],
        marks: 18,
        starterCode: starterBinarySearch,
      },
      {
        title: "Reverse the string",
        description: `Read one line (no leading/trailing spaces constraint beyond the line content). Print it reversed.

Example: abcde → edcba`,
        inputFormat: "Single line string, length 1–5000.",
        outputFormat: "Reversed string with newline.",
        sampleTestCases: [{ input: "hello\n", output: "olleh\n" }],
        hiddenTestCases: [
          { input: "a\n", output: "a\n" },
          { input: "stressed\n", output: "desserts\n" },
        ],
        marks: 18,
        starterCode: starterReverse,
      },
    ],
  },
  {
    publicSlug: "tcs-hiring-practice",
    title: "TCS — hiring practice",
    duration: 35,
    demoCardSubtitle:
      "IT services pattern: numerical/logical + CS basics; two short coding drills (~30–40 min total).",
    demoLogoDomain: "tcs.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 3,
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
    codingProblems: [
      {
        title: "Sum of digits",
        description: `Given a non-negative integer n (\`0 ≤ n ≤ 10¹²\`), print the sum of its decimal digits.

Example: 904 = 9+0+4 = 13`,
        inputFormat: "Single integer n on one line.",
        outputFormat: "Single integer with newline.",
        sampleTestCases: [{ input: "904\n", output: "13\n" }],
        hiddenTestCases: [
          { input: "0\n", output: "0\n" },
          { input: "999\n", output: "27\n" },
        ],
        marks: 16,
        starterCode: starterSumDigits,
      },
      {
        title: "Is prime?",
        description: `Given an integer n, print 1 if n is **prime**, else 0. Constraints: \`2 ≤ n ≤ 1000\`.`,
        inputFormat: "Single integer n.",
        outputFormat: "1 or 0 with newline.",
        sampleTestCases: [{ input: "7\n", output: "1\n" }],
        hiddenTestCases: [
          { input: "4\n", output: "0\n" },
          { input: "2\n", output: "1\n" },
        ],
        marks: 16,
        starterCode: starterPrime,
      },
    ],
  },
  {
    publicSlug: "capgemini-hiring-practice",
    title: "Capgemini — hiring practice",
    duration: 40,
    demoCardSubtitle:
      "Consulting-tech blend: SQL/process MCQs + two small programs (mixed screen ~35–45 min).",
    demoLogoDomain: "capgemini.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 4,
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
    codingProblems: [
      {
        title: "Factorial",
        description: `Compute n! for \`0 ≤ n ≤ 12\`.`,
        inputFormat: "Single integer n.",
        outputFormat: "Single integer with newline.",
        sampleTestCases: [{ input: "5\n", output: "120\n" }],
        hiddenTestCases: [
          { input: "0\n", output: "1\n" },
          { input: "7\n", output: "5040\n" },
        ],
        marks: 16,
        starterCode: starterFactorial,
      },
      {
        title: "GCD (Euclidean)",
        description: `Read two non-negative integers (not both zero). Print their **greatest common divisor**.

Example: gcd(48, 18) = 6.`,
        inputFormat: "One line: a b",
        outputFormat: "One integer with newline.",
        sampleTestCases: [{ input: "48 18\n", output: "6\n" }],
        hiddenTestCases: [
          { input: "7 13\n", output: "1\n" },
          { input: "100 25\n", output: "25\n" },
        ],
        marks: 16,
        starterCode: starterGcd,
      },
    ],
  },
  {
    publicSlug: "amazon-hiring-practice",
    title: "Amazon — hiring practice",
    duration: 50,
    demoCardSubtitle:
      "OA-style rounds: arrays/strings + implementation-focused coding with edge-case heavy hidden tests.",
    demoLogoDomain: "amazon.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 5,
    mcqs: [
      { questionText: "Which data structure is ideal for BFS traversal?", options: ["Stack", "Queue", "Heap", "Trie"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Amortized time for push in dynamic array is typically:", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctOption: 2, marks: 5, selectionType: "single" },
      { questionText: "If a hash table load factor grows too much, preferred action is:", options: ["Reverse keys", "Rehash/resize", "Sort all keys", "Use recursion"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Two-pointer technique is most useful when:", options: ["Data is random graph", "Input often has ordering/monotonicity", "Only recursion allowed", "Memory is infinite"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Worst-case lookup in an unbalanced BST is:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctOption: 2, marks: 5, selectionType: "single" },
    ],
    codingProblems: [
      {
        title: "Balanced bracket string",
        description: "Given a bracket string of (), [] characters, print YES if balanced, else NO.",
        inputFormat: "One line string.",
        outputFormat: "YES or NO with newline.",
        sampleTestCases: [{ input: "([])\n", output: "YES\n" }],
        hiddenTestCases: [{ input: "([)]\n", output: "NO\n" }, { input: "()[]\n", output: "YES\n" }],
        marks: 20,
        starterCode: starterBrackets,
      },
      {
        title: "Reverse the string",
        description: "Read one line and print the reversed string.",
        inputFormat: "Single line string.",
        outputFormat: "Reversed string with newline.",
        sampleTestCases: [{ input: "amazon\n", output: "nozama\n" }],
        hiddenTestCases: [{ input: "a\n", output: "a\n" }, { input: "madalgos\n", output: "sogladam\n" }],
        marks: 20,
        starterCode: starterReverse,
      },
    ],
  },
  {
    publicSlug: "meta-hiring-practice",
    title: "Meta — hiring practice",
    duration: 48,
    demoCardSubtitle:
      "Product-company style MCQ + coding mix focusing on linear scans, hashing, and clean implementation.",
    demoLogoDomain: "meta.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 6,
    mcqs: [
      { questionText: "Typical average lookup complexity in hash set:", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], correctOption: 0, marks: 5, selectionType: "single" },
      { questionText: "A stable sort guarantees:", options: ["In-place only", "Equal keys keep relative order", "Always O(n)", "No recursion"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Prefix sums help answer range-sum queries in:", options: ["O(1) per query after preprocess", "O(n) per query", "O(log n) preprocess", "Impossible"], correctOption: 0, marks: 5, selectionType: "single" },
      { questionText: "When using sliding window, window movement is usually:", options: ["Random", "Monotonic over indices", "Recursive tree-only", "Hash collision-based"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Time to traverse graph with V nodes and E edges using BFS:", options: ["O(V)", "O(E)", "O(V+E)", "O(VE)"], correctOption: 2, marks: 5, selectionType: "single" },
    ],
    codingProblems: [
      {
        title: "Maximum subarray sum (Kadane)",
        description: "Given n integers, print maximum contiguous subarray sum.",
        inputFormat: "Line 1: n. Line 2: n integers.",
        outputFormat: "One integer with newline.",
        sampleTestCases: [{ input: "5\n1 -3 2 1 -2\n", output: "3\n" }],
        hiddenTestCases: [{ input: "4\n-1 -2 -3 -4\n", output: "-1\n" }, { input: "6\n3 -2 5 -1 3 -4\n", output: "8\n" }],
        marks: 20,
        starterCode: starterKadane,
      },
      {
        title: "Is prime?",
        description: "Given n, print 1 if n is prime else 0.",
        inputFormat: "Single integer n.",
        outputFormat: "1 or 0 with newline.",
        sampleTestCases: [{ input: "7\n", output: "1\n" }],
        hiddenTestCases: [{ input: "4\n", output: "0\n" }, { input: "2\n", output: "1\n" }],
        marks: 20,
        starterCode: starterPrime,
      },
    ],
  },
  {
    publicSlug: "apple-hiring-practice",
    title: "Apple — hiring practice",
    duration: 45,
    demoCardSubtitle:
      "Core CS + implementation discipline: correctness-first questions with strict hidden validation.",
    demoLogoDomain: "apple.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 7,
    mcqs: [
      { questionText: "Which sorting algorithm is NOT comparison-based?", options: ["Merge sort", "Heap sort", "Counting sort", "Quick sort"], correctOption: 2, marks: 5, selectionType: "single" },
      { questionText: "Binary search requires input to be:", options: ["Unique only", "Sorted", "Prime-sized", "2D"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "A min-heap guarantees:", options: ["Sorted traversal", "Root is minimum", "Leaves are sorted", "O(1) delete all"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Recursion depth risk in practice is mainly:", options: ["Hash collisions", "Stack overflow", "DNS failure", "Cache line split"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Which is best for fast membership checks?", options: ["Array scan", "Hash set", "Linked list", "Plain string"], correctOption: 1, marks: 5, selectionType: "single" },
    ],
    codingProblems: [
      {
        title: "Sorted array search (exists?)",
        description: "Given sorted integers and target, print 1 if target exists else 0.",
        inputFormat: "Line 1: n target. Line 2: n sorted ints.",
        outputFormat: "1 or 0 with newline.",
        sampleTestCases: [{ input: "6 4\n1 3 4 5 7 9\n", output: "1\n" }],
        hiddenTestCases: [{ input: "5 10\n1 2 3 4 5\n", output: "0\n" }, { input: "1 7\n7\n", output: "1\n" }],
        marks: 20,
        starterCode: starterBinarySearch,
      },
      {
        title: "GCD (Euclidean)",
        description: "Read a and b, print gcd(a,b).",
        inputFormat: "One line: a b",
        outputFormat: "One integer with newline.",
        sampleTestCases: [{ input: "48 18\n", output: "6\n" }],
        hiddenTestCases: [{ input: "7 13\n", output: "1\n" }, { input: "100 25\n", output: "25\n" }],
        marks: 20,
        starterCode: starterGcd,
      },
    ],
  },
  {
    publicSlug: "netflix-hiring-practice",
    title: "Netflix — hiring practice",
    duration: 50,
    demoCardSubtitle:
      "Performance-minded coding set: arrays, search, and edge-case handling under timed pressure.",
    demoLogoDomain: "netflix.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 8,
    mcqs: [
      { questionText: "Asymptotically faster growth means:", options: ["Smaller input only", "Worse scalability for large n", "Always less memory", "No difference"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Which complexity is better at scale?", options: ["O(n²)", "O(n log n)", "O(2ⁿ)", "O(n!)"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Caching helps mainly by reducing:", options: ["Code readability", "Repeated expensive computation/latency", "Need for tests", "CPU clock speed"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Two-sum optimal common approach uses:", options: ["Nested loops only", "Hash map", "DFS tree", "Heap sort each step"], correctOption: 1, marks: 5, selectionType: "single" },
      { questionText: "Space complexity of iterative binary search is:", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctOption: 2, marks: 5, selectionType: "single" },
    ],
    codingProblems: [
      {
        title: "Reverse the string",
        description: "Read one line and print it reversed.",
        inputFormat: "Single line.",
        outputFormat: "Reversed line with newline.",
        sampleTestCases: [{ input: "stream\n", output: "maerts\n" }],
        hiddenTestCases: [{ input: "a\n", output: "a\n" }, { input: "planet\n", output: "tenalp\n" }],
        marks: 20,
        starterCode: starterReverse,
      },
      {
        title: "Sum of digits",
        description: "Given non-negative integer n, print sum of its digits.",
        inputFormat: "Single integer n.",
        outputFormat: "Single integer with newline.",
        sampleTestCases: [{ input: "904\n", output: "13\n" }],
        hiddenTestCases: [{ input: "0\n", output: "0\n" }, { input: "999\n", output: "27\n" }],
        marks: 20,
        starterCode: starterSumDigits,
      },
    ],
  },
  {
    publicSlug: "tech-mahindra-hiring-practice",
    title: "Tech Mahindra — hiring practice",
    duration: 35,
    demoCardSubtitle:
      "Services-style round: aptitude + CS fundamentals + two compact coding tasks for screening.",
    demoLogoDomain: "techmahindra.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 9,
    mcqs: [
      { questionText: "Simple interest on P at rate R for T years is:", options: ["P*R*T", "P*R*T/100", "P+R+T", "P*R/100T"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "In OOP, encapsulation means:", options: ["Only inheritance", "Bundling data with methods + controlled access", "Only polymorphism", "No classes"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "HTTP 500 indicates:", options: ["Client typo", "Server-side error", "Auth success", "Redirect permanent"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "Queue follows:", options: ["LIFO", "FIFO", "Random order", "Priority always"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "Best known complexity for checking primality up to sqrt(n) is:", options: ["O(n)", "O(log n)", "O(sqrt(n))", "O(n²)"], correctOption: 2, marks: 4, selectionType: "single" },
    ],
    codingProblems: [
      {
        title: "Is prime?",
        description: "Given integer n (>=2), print 1 if prime else 0.",
        inputFormat: "Single integer n.",
        outputFormat: "1 or 0 with newline.",
        sampleTestCases: [{ input: "7\n", output: "1\n" }],
        hiddenTestCases: [{ input: "4\n", output: "0\n" }, { input: "2\n", output: "1\n" }],
        marks: 16,
        starterCode: starterPrime,
      },
      {
        title: "Factorial",
        description: "Compute n! for 0 <= n <= 12.",
        inputFormat: "Single integer n.",
        outputFormat: "Single integer with newline.",
        sampleTestCases: [{ input: "5\n", output: "120\n" }],
        hiddenTestCases: [{ input: "0\n", output: "1\n" }, { input: "7\n", output: "5040\n" }],
        marks: 16,
        starterCode: starterFactorial,
      },
    ],
  },
  {
    publicSlug: "infosys-hiring-practice",
    title: "Infosys — hiring practice",
    duration: 38,
    demoCardSubtitle:
      "Campus screening style: quant/logical + programming basics with practical coding drills.",
    demoLogoDomain: "infosys.com",
    demoCardImageUrl:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80&auto=format&fit=crop",
    demoSortOrder: 10,
    mcqs: [
      { questionText: "If x:y = 3:4 and y=20, x is:", options: ["10", "12", "15", "16"], correctOption: 2, marks: 4, selectionType: "single" },
      { questionText: "Which SQL command removes rows but keeps table structure?", options: ["DROP", "DELETE", "REMOVE", "ERASE"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "Binary representation of decimal 10 is:", options: ["1001", "1010", "1100", "1110"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "A function calling itself is:", options: ["Iteration", "Recursion", "Encapsulation", "Compilation"], correctOption: 1, marks: 4, selectionType: "single" },
      { questionText: "Time complexity of linear search is:", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correctOption: 2, marks: 4, selectionType: "single" },
    ],
    codingProblems: [
      {
        title: "Sum of digits",
        description: "Given non-negative integer n, print sum of digits.",
        inputFormat: "Single integer n.",
        outputFormat: "One integer with newline.",
        sampleTestCases: [{ input: "904\n", output: "13\n" }],
        hiddenTestCases: [{ input: "0\n", output: "0\n" }, { input: "999\n", output: "27\n" }],
        marks: 16,
        starterCode: starterSumDigits,
      },
      {
        title: "GCD (Euclidean)",
        description: "Read a and b, print gcd(a,b).",
        inputFormat: "One line: a b",
        outputFormat: "One integer with newline.",
        sampleTestCases: [{ input: "48 18\n", output: "6\n" }],
        hiddenTestCases: [{ input: "7 13\n", output: "1\n" }, { input: "100 25\n", output: "25\n" }],
        marks: 16,
        starterCode: starterGcd,
      },
    ],
  },
];

function pickDifficultyByIndex(index, total) {
  if (total <= 1) return "medium";
  const ratio = index / (total - 1);
  if (ratio < 0.34) return "easy";
  if (ratio < 0.67) return "medium";
  return "hard";
}

function withDifficultyTags(pack) {
  const mcqs = Array.isArray(pack.mcqs)
    ? pack.mcqs.map((q, idx, arr) => ({
        ...q,
        difficulty: String(q?.difficulty || pickDifficultyByIndex(idx, arr.length)).toLowerCase(),
      }))
    : [];

  const codingProblems = Array.isArray(pack.codingProblems)
    ? pack.codingProblems.map((q, idx, arr) => ({
        ...q,
        difficulty: String(q?.difficulty || pickDifficultyByIndex(idx, arr.length)).toLowerCase(),
      }))
    : [];

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
