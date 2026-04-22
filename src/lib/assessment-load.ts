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

/**
 * Load assessment content for a session token — platform `tests` row or `practice_test` row.
 */
export async function loadAssessmentForToken(tokenDoc: {
  testId?: mongoose.Types.ObjectId | null;
  practiceTestId?: mongoose.Types.ObjectId | null;
}): Promise<AssessmentLean | null> {
  if (tokenDoc.practiceTestId) {
    const p = await PracticeTestModel.findById(tokenDoc.practiceTestId).lean();
    if (p) return p as AssessmentLean;
  }
  if (tokenDoc.testId) {
    const t = await TestModel.findById(tokenDoc.testId).lean();
    if (t) return t as AssessmentLean;
  }
  return null;
}
