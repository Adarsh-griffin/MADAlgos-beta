/**
 * Seeds MongoDB from ALL_PRICING_AND_OFFERINGS.json:
 * - mock_interview_offerings, mentorship_offerings (app catalog)
 * - Reference collections: pricing_* (verbatim JSON tables)
 * - mock_interview_offerings_test (from mockinterviewofferingstest)
 *
 * Does not modify time_slots (use npm run seed:booking for slot fixtures).
 *
 * Usage (from madalgos-final):
 *   npm run seed:pricing
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const JSON_PATH = path.join(projectRoot, "ALL_PRICING_AND_OFFERINGS.json");

const MOCK_TYPES = new Set(["DSA", "SYS_DES", "BEH_LED"]);

const MOCK_TOPIC_LINE = {
  DSA: "DSA",
  SYS_DES: "System Design",
  BEH_LED: "Behavioural / Leadership",
};

function formatExpPhrase(expId) {
  if (expId >= 5) return "5+ yr exp (senior)";
  return `${expId} yr exp`;
}

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

/** Normalize legacy Buffer export for Mongo */
function normalizeDoc(doc) {
  if (doc === null || typeof doc !== "object") return doc;
  if (Array.isArray(doc)) return doc.map(normalizeDoc);
  if (doc.type === "Buffer" && Array.isArray(doc.data)) {
    return Buffer.from(doc.data);
  }
  const out = {};
  for (const [k, v] of Object.entries(doc)) {
    out[k] = normalizeDoc(v);
  }
  return out;
}

function mapMockRow(row) {
  const mockType = row.mockType;
  if (!MOCK_TYPES.has(mockType)) {
    throw new Error(`Unsupported mockType: ${mockType} (id ${row.id})`);
  }
  const topic = MOCK_TOPIC_LINE[mockType] ?? mockType;
  const label = `${topic} · ${formatExpPhrase(row.expId)}`;
  return {
    id: row.id,
    mockType,
    expLevel: row.expId,
    label,
    price: row.price,
    rushPrice: row.rushPrice ?? row.price,
    currency: row.currency ?? "INR",
    region: row.region,
  };
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI (e.g. from .env.local).");
    process.exit(1);
  }
  if (!fs.existsSync(JSON_PATH)) {
    console.error("Missing file:", JSON_PATH);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  const {
    experience = [],
    packagedetails = [],
    currentmarkets = [],
    resumeofferings = [],
    mockinterviewofferings = [],
    mockinterviewofferingstest = [],
    negotiationofferings = [],
    premiumpackages = [],
    globaloffer = [],
    offers = [],
    salaryhikeresults = [],
    course = [],
  } = raw;

  const mockRows = mockinterviewofferings.map(mapMockRow);

  /** Canonical 3 packages — keep in sync with src/lib/mentorship-simple-packages.ts */
  const mentRows = [
    {
      id: 1,
      durationMonths: 1,
      ifSolo: true,
      groupSizes: 0,
      price: 4999,
      currency: "INR",
      personalSessions: 2,
      mockInterviews: 2,
      expLabel: "Standard",
      region: "IND",
    },
    {
      id: 2,
      durationMonths: 3,
      ifSolo: true,
      groupSizes: 0,
      price: 9999,
      currency: "INR",
      personalSessions: 5,
      mockInterviews: 5,
      expLabel: "Standard",
      region: "IND",
    },
    {
      id: 3,
      durationMonths: 6,
      ifSolo: true,
      groupSizes: 0,
      price: 18999,
      currency: "INR",
      personalSessions: 10,
      mockInterviews: 10,
      expLabel: "Standard",
      region: "IND",
    },
  ];

  const testRows = mockinterviewofferingstest.map((row) => {
    const base = mapMockRow({
      ...row,
      rushPrice: row.rushPrice ?? row.price,
      description: row.description || "Test mock",
    });
    return base;
  });

  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME });
  const db = mongoose.connection.db;
  if (!db) throw new Error("No db");

  const refCollections = [
    ["pricing_experience", experience],
    ["pricing_packagedetails", packagedetails],
    ["pricing_currentmarkets", currentmarkets],
    ["pricing_resumeofferings", resumeofferings],
    ["pricing_negotiationofferings", negotiationofferings],
    ["pricing_premiumpackages", premiumpackages],
    ["pricing_globaloffer", globaloffer],
    ["pricing_offers", offers.map(normalizeDoc)],
    ["pricing_salaryhikeresults", salaryhikeresults],
    ["pricing_course", course],
  ];

  for (const [name, docs] of refCollections) {
    await db.collection(name).deleteMany({});
    if (docs.length) await db.collection(name).insertMany(docs);
  }

  await db.collection("mock_interview_offerings").deleteMany({});
  await db.collection("mock_interview_offerings_test").deleteMany({});
  await db.collection("mentorship_offerings").deleteMany({});

  await db.collection("mock_interview_offerings").insertMany(mockRows);
  if (testRows.length) await db.collection("mock_interview_offerings_test").insertMany(testRows);
  await db.collection("mentorship_offerings").insertMany(mentRows);

  console.log("Seeded pricing reference:", refCollections.map(([n, d]) => `${n}(${d.length})`).join(", "));
  console.log(
    "Seeded app catalog: mock_interview_offerings(",
    mockRows.length,
    "), mentorship_offerings(",
    mentRows.length,
    "), mock_interview_offerings_test(",
    testRows.length,
    ")"
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
