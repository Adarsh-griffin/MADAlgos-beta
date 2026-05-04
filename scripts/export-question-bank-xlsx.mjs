/**
 * Exports all rows from `assessment_question_bank` to an Excel file for manual verification
 * against the Admin → Question bank page (same collection the UI reads from).
 *
 * Columns: Title, Tick (empty — mark ✓ in Excel when you’ve confirmed the row appears on the Question bank page).
 *
 * Usage (from repo root, with MONGODB_URI in .env.local):
 *   npm run export:question-bank
 *
 * Output: exports/question-bank-titles.xlsx
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import XLSX from "xlsx";

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

function titleForDoc(doc) {
  const kind = doc.kind;
  if (kind === "MCQ") {
    const t = doc.mcq?.questionText?.trim();
    return t || "(MCQ — missing question text)";
  }
  if (kind === "CODING") {
    const t = doc.coding?.title?.trim();
    return t || "(Coding — missing title)";
  }
  return "(Unknown kind)";
}

loadEnvFiles();

const uri = process.env.MONGODB_URI?.trim() || process.env.DATABASE_URI?.trim();
const dbName = process.env.MONGODB_DB_NAME?.trim() || process.env.DATABASE_NAME?.trim();

async function main() {
  if (!uri) {
    console.error("Set MONGODB_URI or DATABASE_URI (e.g. in .env.local).");
    process.exit(1);
  }

  await mongoose.connect(uri, dbName ? { dbName } : {});

  const coll = mongoose.connection.db.collection("assessment_question_bank");
  const docs = await coll.find({}).sort({ kind: 1, updatedAt: -1 }).toArray();

  const rows = docs.map((doc) => ({
    title: titleForDoc(doc),
    kind: doc.kind === "MCQ" ? "MCQ" : doc.kind === "CODING" ? "Coding" : String(doc.kind ?? ""),
    tick: "",
  }));

  rows.sort((a, b) => {
    const byKind = a.kind.localeCompare(b.kind);
    if (byKind !== 0) return byKind;
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });

  const wb = XLSX.utils.book_new();

  const sheetData = [
    ["Title", "Tick"],
    ...rows.map((r) => [r.title, r.tick]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws["!cols"] = [{ wch: 72 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws, "Questions");

  const summary = [
    ["Question bank export"],
    ["Generated (UTC)", new Date().toISOString()],
    ["Total rows (matches DB count)", rows.length],
    ["MCQ count", rows.filter((r) => r.kind === "MCQ").length],
    ["Coding count", rows.filter((r) => r.kind === "Coding").length],
    [""],
    [
      "Verify against Admin → Question bank: total count should match the footer (e.g. “Showing X of Y”) when filters are cleared.",
    ],
  ];
  const wsSum = XLSX.utils.aoa_to_sheet(summary);
  wsSum["!cols"] = [{ wch: 48 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsSum, "Summary");

  const outDir = path.join(projectRoot, "exports");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "question-bank-titles.xlsx");
  XLSX.writeFile(wb, outPath);

  console.log(`Wrote ${rows.length} questions to ${outPath}`);
  console.log("Compare Total rows with the Question bank page (filters cleared, search empty).");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
