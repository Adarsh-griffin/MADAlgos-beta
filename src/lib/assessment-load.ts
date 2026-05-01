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

type DifficultyValue = "easy" | "medium" | "hard";
type DeliveryConfig = {
  mcqPerAttempt: number;
  codingPerAttempt: number;
  easyDurationMinutes: number;
  mediumDurationMinutes: number;
  hardDurationMinutes: number;
};

function normalizeDifficulty(input: unknown): DifficultyValue {
  const value = String(input || "").trim().toLowerCase();
  if (value === "easy" || value === "medium" || value === "hard") return value;
  return "medium";
}

function filterByDifficulty(items: unknown[], selected: DifficultyValue): unknown[] {
  const filtered = items.filter((item) => {
    const raw = (item as { difficulty?: unknown })?.difficulty;
    return String(raw || "").trim().toLowerCase() === selected;
  });
  // Backward compatibility for legacy tests without difficulty tagging.
  return filtered.length ? filtered : items;
}

function pickLimited(items: unknown[], count: number): unknown[] {
  if (!Array.isArray(items)) return [];
  return items.slice(0, Math.max(0, count));
}

function toPositiveInt(value: unknown, fallback: number, min = 1, max = 300): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  const intVal = Math.round(num);
  return Math.min(max, Math.max(min, intVal));
}

function normalizeDeliveryConfig(raw: unknown): DeliveryConfig {
  const cfg = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    mcqPerAttempt: toPositiveInt(cfg.mcqPerAttempt, 4, 1, 50),
    codingPerAttempt: toPositiveInt(cfg.codingPerAttempt, 2, 1, 20),
    easyDurationMinutes: toPositiveInt(cfg.easyDurationMinutes, 35, 5, 180),
    mediumDurationMinutes: toPositiveInt(cfg.mediumDurationMinutes, 45, 5, 180),
    hardDurationMinutes: toPositiveInt(cfg.hardDurationMinutes, 55, 5, 180),
  };
}

function adjustDurationByDifficulty(
  selectedMcqDifficulty: DifficultyValue,
  selectedCodingDifficulty: DifficultyValue,
  deliveryConfig: DeliveryConfig
): number {
  const selected = [selectedMcqDifficulty, selectedCodingDifficulty];
  if (selected.includes("hard")) return deliveryConfig.hardDurationMinutes;
  if (selected.includes("medium")) return deliveryConfig.mediumDurationMinutes;
  return deliveryConfig.easyDurationMinutes;
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
    ...(assessment as Record<string, unknown>),
    ...assessment,
    ...(function () {
      const deliveryConfig = normalizeDeliveryConfig(
        (assessment as Record<string, unknown>).assessmentDelivery
      );
      return {
        duration: adjustDurationByDifficulty(
          selectedMcqDifficulty,
          selectedCodingDifficulty,
          deliveryConfig
        ),
        mcqs: pickLimited(
          filterByDifficulty(Array.isArray(assessment.mcqs) ? assessment.mcqs : [], selectedMcqDifficulty),
          deliveryConfig.mcqPerAttempt
        ),
        codingProblems: pickLimited(
          filterByDifficulty(Array.isArray(assessment.codingProblems) ? assessment.codingProblems : [], selectedCodingDifficulty),
          deliveryConfig.codingPerAttempt
        ),
      };
    })(),
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
