import mongoose from "mongoose";
import TestModel from "@/models/Test";
import PracticeTestModel from "@/models/PracticeTest";

/** Lean document used by TestRoom / grading (same shape for platform tests and practice packs). */
export type AssessmentLean = Record<string, unknown> & {
  _id: mongoose.Types.ObjectId;
  title: string;
  duration: number;
  mcqs: unknown[];
  codingProblems: unknown[];
};

type DifficultyValue = "all" | "easy" | "medium" | "hard";

function normalizeDifficulty(input: unknown): DifficultyValue {
  const value = String(input || "").trim().toLowerCase();
  if (value === "easy" || value === "medium" || value === "hard") return value;
  return "all";
}

function filterByDifficulty(items: unknown[], selected: DifficultyValue): unknown[] {
  if (selected === "all") return items;
  const filtered = items.filter((item) => {
    const raw = (item as { difficulty?: unknown })?.difficulty;
    return String(raw || "").trim().toLowerCase() === selected;
  });
  // Backward compatibility for legacy tests without difficulty tagging.
  return filtered.length ? filtered : items;
}

/**
 * Load assessment content for a session token — platform `tests` row or `practice_test` row.
 */
export async function loadAssessmentForToken(tokenDoc: {
  testId?: mongoose.Types.ObjectId | null;
  practiceTestId?: mongoose.Types.ObjectId | null;
  difficultyPreference?: { mcq?: unknown; coding?: unknown } | null;
}): Promise<AssessmentLean | null> {
  const selectedMcqDifficulty = normalizeDifficulty(tokenDoc.difficultyPreference?.mcq);
  const selectedCodingDifficulty = normalizeDifficulty(tokenDoc.difficultyPreference?.coding);

  const withDifficultyFilters = (assessment: AssessmentLean): AssessmentLean => ({
    ...assessment,
    mcqs: filterByDifficulty(Array.isArray(assessment.mcqs) ? assessment.mcqs : [], selectedMcqDifficulty),
    codingProblems: filterByDifficulty(
      Array.isArray(assessment.codingProblems) ? assessment.codingProblems : [],
      selectedCodingDifficulty
    ),
  });

  if (tokenDoc.practiceTestId) {
    const p = await PracticeTestModel.findById(tokenDoc.practiceTestId).lean();
    if (p) return withDifficultyFilters(p as AssessmentLean);
  }
  if (tokenDoc.testId) {
    const t = await TestModel.findById(tokenDoc.testId).lean();
    if (t) return withDifficultyFilters(t as AssessmentLean);
  }
  return null;
}
