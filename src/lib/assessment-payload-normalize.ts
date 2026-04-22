/** Shared MCQ / coding normalization for platform tests and practice_test documents. */

export function normalizeMcqsForCreate(
  mcqs: unknown[]
): { ok: true; mcqs: Record<string, unknown>[] } | { ok: false; message: string } {
  const out: Record<string, unknown>[] = [];
  for (const raw of mcqs as Record<string, unknown>[]) {
    const n = (raw.options as unknown[] | undefined)?.length ?? 0;
    const selectionType = raw.selectionType === "multiple" ? "multiple" : "single";
    if (selectionType === "single") {
      const c = raw.correctOption as number;
      if (typeof c !== "number" || Number.isNaN(c) || c < 0 || c >= n) {
        return { ok: false, message: "Each single-choice MCQ needs a valid correct option index." };
      }
      out.push({ ...raw, selectionType: "single", correctOption: c, correctOptions: [] });
    } else {
      const arr = Array.isArray(raw.correctOptions) ? (raw.correctOptions as number[]) : [];
      const uniq = [...new Set(arr.filter((i) => typeof i === "number" && !Number.isNaN(i) && i >= 0 && i < n))].sort(
        (a, b) => a - b
      );
      if (uniq.length < 2) {
        return { ok: false, message: "Multi-select MCQs need at least two distinct correct options." };
      }
      out.push({ ...raw, selectionType: "multiple", correctOptions: uniq, correctOption: uniq[0] });
    }
  }
  return { ok: true, mcqs: out };
}

export function cleanCodingProblemsForCreate(codingProblems: unknown[]): Record<string, unknown>[] {
  return (codingProblems as Record<string, unknown>[]).map((p) => ({
    ...p,
    sampleTestCases: ((p.sampleTestCases as { input: string; output: string }[]) || []).filter(
      (tc) => tc.input.trim() || tc.output.trim()
    ),
    hiddenTestCases: ((p.hiddenTestCases as { input: string; output: string }[]) || []).filter(
      (tc) => tc.input.trim() || tc.output.trim()
    ),
  }));
}
