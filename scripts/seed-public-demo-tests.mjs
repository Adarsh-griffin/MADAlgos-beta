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
];

async function main() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB_NAME?.trim();
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

  for (const pack of PACKS) {
    const {
      publicSlug,
      title,
      duration,
      demoCardSubtitle,
      demoCardImageUrl,
      demoLogoDomain,
      demoSortOrder,
      mcqs,
      codingProblems,
    } = pack;

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
          demoSortOrder,
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
