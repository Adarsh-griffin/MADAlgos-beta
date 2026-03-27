/**
 * Seeds mock interview offerings, time slots, and mentorship offerings for local testing.
 * Usage (from madalgos-final):
 *   npm run seed:booking
 * Loads `.env.local` then `.env` from the project root (same vars as Next.js).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

/** Minimal KEY=value loader — enough for MONGODB_URI / MONGODB_DB_NAME. Does not override existing env. */
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

const MOCK = "mock_interview_offerings";
const SLOTS = "time_slots";
const MENT = "mentorship_offerings";

/** Extra variety for QA — prices are fake / round numbers only. */
const mockRows = [
  { id: 1, mockType: "DSA", expLevel: 1, label: "DSA · 1 yr exp", price: 1999, rushPrice: 2499, currency: "INR" },
  { id: 2, mockType: "DSA", expLevel: 3, label: "DSA · 3 yr exp", price: 2499, rushPrice: 2999, currency: "INR" },
  { id: 3, mockType: "SYS_DES", expLevel: 2, label: "System Design · 2 yr exp", price: 2999, rushPrice: 3499, currency: "INR" },
  { id: 4, mockType: "BEH_LED", expLevel: 2, label: "Behavioural / Leadership · 2 yr exp", price: 1799, rushPrice: 2199, currency: "INR" },
  { id: 5, mockType: "DSA", expLevel: 5, label: "DSA · 5+ yr exp (senior)", price: 3299, rushPrice: 3899, currency: "INR" },
  { id: 6, mockType: "ML", expLevel: 2, label: "ML / Data · 2 yr exp", price: 2699, rushPrice: 3199, currency: "INR" },
  { id: 7, mockType: "FRONTEND", expLevel: 2, label: "Frontend · React · 2 yr exp", price: 2199, rushPrice: 2599, currency: "INR" },
  { id: 8, mockType: "DEVOPS", expLevel: 3, label: "DevOps / Cloud · 3 yr exp", price: 2899, rushPrice: 3399, currency: "INR" },
];

const slotRows = [
  { id: 1, dayLabel: "Weekday", startTime: "19:00", endTime: "20:00", displayLabel: "Evening (IST)" },
  { id: 2, dayLabel: "Weekday", startTime: "21:00", endTime: "22:00", displayLabel: "Late evening (IST)" },
  { id: 3, dayLabel: "Weekend", startTime: "10:00", endTime: "11:00", displayLabel: "Weekend morning" },
  { id: 4, dayLabel: "Weekend", startTime: "15:00", endTime: "16:00", displayLabel: "Weekend afternoon" },
  { id: 5, dayLabel: "Weekday", startTime: "07:00", endTime: "08:00", displayLabel: "Early morning (IST)" },
];

/** Keep in sync with src/lib/mentorship-simple-packages.ts */
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

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI (e.g. from .env.local).");
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME });

  const db = mongoose.connection.db;
  if (!db) throw new Error("No db");

  await db.collection(MOCK).deleteMany({});
  await db.collection(SLOTS).deleteMany({});
  await db.collection(MENT).deleteMany({});

  await db.collection(MOCK).insertMany(mockRows);
  await db.collection(SLOTS).insertMany(slotRows);
  await db.collection(MENT).insertMany(mentRows);

  console.log("Seeded:", MOCK, SLOTS, MENT);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
