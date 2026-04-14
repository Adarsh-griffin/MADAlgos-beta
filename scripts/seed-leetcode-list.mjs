/**
 * Downloads problems from a LeetCode public problem list (favorite slug, e.g. Blind 75: oizxjoit)
 * via the official GraphQL endpoint, then upserts into MongoDB `assessment_question_bank`.
 *
 * Usage (from repo root, with MONGODB_URI in .env.local):
 *   npm run seed:leetcode
 *   node scripts/seed-leetcode-list.mjs --dry-run
 *   node scripts/seed-leetcode-list.mjs --list-slug=oizxjoit
 *
 * Notes:
 * - LeetCode examples are function-style; this platform uses stdin/stdout judges. We store real
 *   statement + snippets; sample/hidden tests are minimal placeholders so rows validate — edit before grading.
 * - Be respectful: one request per problem + short delay.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

const LIST_SLUG = process.argv.find((a) => a.startsWith("--list-slug="))?.split("=")[1] || "oizxjoit";
const DRY = process.argv.includes("--dry-run");

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

const LC_LANG_TO_PLATFORM = {
  javascript: "Javascript",
  typescript: "Javascript",
  python: "Python",
  python3: "Python",
  java: "Java",
  cpp: "C++",
  "c++": "C++",
  c: "C",
};

const PLACEHOLDER_TESTS = {
  sampleTestCases: [{ input: "2 2\n", output: "4\n" }],
  hiddenTestCases: [
    { input: "1 1\n", output: "2\n" },
    { input: "0 0\n", output: "0\n" },
  ],
};

function htmlToPlain(html) {
  if (!html) return "";
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stableFingerprint(slug) {
  return crypto.createHash("sha256").update(`leetcode-import:${LIST_SLUG}:${slug}`).digest("hex");
}

function buildStarterRecord(codeSnippets) {
  const out = {};
  if (!Array.isArray(codeSnippets)) return out;
  for (const sn of codeSnippets) {
    const slug = (sn.langSlug || "").toLowerCase();
    const key = LC_LANG_TO_PLATFORM[slug];
    if (key && typeof sn.code === "string" && sn.code.trim()) {
      out[key] = sn.code;
    }
  }
  return out;
}

async function gql(query, variables) {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com/",
      "User-Agent": "Mozilla/5.0 (compatible; MADAlgos-seed/1)",
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function fetchListSlugs(favoriteSlug) {
  const data = await gql(
    `query fav($favoriteSlug: String!) {
      favoriteQuestionList(favoriteSlug: $favoriteSlug) {
        questions {
          title
          titleSlug
          difficulty
          topicTags {
            name
            slug
          }
        }
      }
    }`,
    { favoriteSlug }
  );
  const err = data?.errors?.[0]?.message;
  if (err) throw new Error(`LeetCode list error: ${err}`);
  const qs = data?.data?.favoriteQuestionList?.questions;
  if (!Array.isArray(qs)) throw new Error("No questions returned from favoriteQuestionList");
  return qs;
}

async function fetchQuestionDetail(titleSlug) {
  const data = await gql(
    `query q($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        title
        difficulty
        content
        codeSnippets {
          lang
          langSlug
          code
        }
        exampleTestcaseList
      }
    }`,
    { titleSlug }
  );
  const err = data?.errors?.[0]?.message;
  if (err) throw new Error(`${titleSlug}: ${err}`);
  const q = data?.data?.question;
  if (!q) throw new Error(`${titleSlug}: empty question`);
  return q;
}

function buildDescription(lc, slug) {
  const url = `https://leetcode.com/problems/${slug}/`;
  const body = htmlToPlain(lc.content);
  const examples =
    Array.isArray(lc.exampleTestcaseList) && lc.exampleTestcaseList.length
      ? `\n\n---\n**Examples (LeetCode test case format — not stdin)**\n${lc.exampleTestcaseList.map((e, i) => `${i + 1}. ${String(e).replace(/\n/g, "\\n ")}`).join("\n")}`
      : "";
  return (
    `**Difficulty:** ${lc.difficulty || "—"}\n\n` +
    `${body}\n\n` +
    `**Source:** ${url}\n\n` +
    `⚠️ **MADAlgos judge uses stdin/stdout.** The sample/hidden rows on this card are minimal placeholders so the question can be saved. Replace them with your own I/O when you run a real exam.${examples}`
  );
}

const BankSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["MCQ", "CODING"], required: true },
    mcq: { type: mongoose.Schema.Types.Mixed },
    coding: { type: mongoose.Schema.Types.Mixed },
    fingerprint: { type: String, required: true, unique: true },
    searchText: { type: String, required: true },
    sourcePack: { type: String, index: true },
    section: { type: String, index: true },
    tags: [{ type: String, index: true }],
    leetcodeSlug: { type: String, index: true },
  },
  { collection: "assessment_question_bank", timestamps: true }
);

const Bank = mongoose.models.SeedLeetCodeBank || mongoose.model("SeedLeetCodeBank", BankSchema);

async function main() {
  console.log(`Fetching list "${LIST_SLUG}" from LeetCode…`);
  const list = await fetchListSlugs(LIST_SLUG);
  console.log(`Found ${list.length} problem(s).`);

  const uri = process.env.MONGODB_URI?.trim();
  if (!DRY && !uri) {
    console.error("MONGODB_URI is not set. Add it to .env.local or use --dry-run.");
    process.exit(1);
  }

  if (!DRY) {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 30_000 });
    console.log("Connected to MongoDB.");
  }

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < list.length; i++) {
    const meta = list[i];
    const slug = meta.titleSlug;
    process.stdout.write(`\r[${i + 1}/${list.length}] ${slug}…`);

    try {
      await new Promise((r) => setTimeout(r, 180));
      const lc = await fetchQuestionDetail(slug);
      const starterCode = buildStarterRecord(lc.codeSnippets);
      const tags = [
        "dsa",
        "leetcode",
        "imported",
        ...(meta.topicTags || []).map((t) => t.slug || t.name).filter(Boolean),
      ];
      const section = meta.topicTags?.[0]?.name || "LeetCode";

      const coding = {
        title: `[LC] ${lc.title || meta.title}`,
        description: buildDescription(lc, slug),
        inputFormat:
          "LeetCode function-style I/O in the statement; configure stdin/stdout for your MADAlgos test before grading.",
        outputFormat: "As per your chosen stdin/stdout test cases.",
        marks: 10,
        starterCode: Object.keys(starterCode).length ? starterCode : undefined,
        ...PLACEHOLDER_TESTS,
      };

      const fingerprint = stableFingerprint(slug);
      const searchText = [slug, lc.title, section, coding.title, ...tags, "blind", "leetcode"]
        .join(" ")
        .toLowerCase();

      const doc = {
        kind: "CODING",
        coding,
        fingerprint,
        searchText,
        sourcePack: `leetcode-list-${LIST_SLUG}`,
        section,
        tags,
        leetcodeSlug: slug,
      };

      if (!DRY) {
        await Bank.findOneAndUpdate(
          { sourcePack: doc.sourcePack, leetcodeSlug: slug },
          { $set: doc },
          { upsert: true, new: true }
        );
      }
      ok++;
    } catch (e) {
      fail++;
      console.error(`\nFailed ${slug}:`, e.message || e);
    }
  }

  console.log(`\nDone. Upserted ${ok}, failed ${fail}.`);
  if (!DRY) await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
