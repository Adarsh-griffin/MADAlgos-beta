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

/** Used only when a pack omits `assessmentDelivery` (all current packs define it). */
const DEFAULT_ASSESSMENT_DELIVERY = {
  mcqPerAttempt: 4,
  codingPerAttempt: 6,
  easyDurationMinutes: 35,
  mediumDurationMinutes: 45,
  hardDurationMinutes: 55,
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
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=90",
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
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=90",
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
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=90",
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
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=90",
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
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=90",
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
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=90",
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
      "https://images.unsplash.com/photo-1517336714731-489689fd4908?auto=format&fit=crop&w=1920&q=90",
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
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=90",
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
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=90",
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
      "https://images.unsplash.com/photo-1486406146926-c627a92ad4ab?auto=format&fit=crop&w=1920&q=90",
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
    Array.isArray(codingProblems) && codingProblems.length >= 6
      ? codingProblems
      : googleHiringCodingProblems;
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
      assessmentDelivery,
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
          assessmentDelivery:
            assessmentDelivery && typeof assessmentDelivery === "object"
              ? assessmentDelivery
              : DEFAULT_ASSESSMENT_DELIVERY,
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
