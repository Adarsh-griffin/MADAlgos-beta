import { BLIND_75 } from "./blind75-slugs";
import { DSA_MCQ_LIBRARY } from "./dsa-mcq-library";

/** Section labels for admin filters (Blind 75 + DSA MCQ theory). */
export const QUESTION_BANK_SECTIONS = Array.from(
  new Set([...BLIND_75.map((r) => r.section), ...DSA_MCQ_LIBRARY.map((x) => x.section)])
).sort((a, b) => a.localeCompare(b));

export const COMMON_TAGS = ["dsa", "complexity", "graphs", "trees", "dp", "sorting"];
