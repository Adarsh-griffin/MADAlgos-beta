/** Normalize correct answer indices from test definition (supports legacy single-select). */
export function getMcqCorrectIndices(q: {
  selectionType?: string;
  correctOption?: number;
  correctOptions?: number[];
  options?: string[];
}): number[] {
  const n = q.options?.length ?? 0;
  if (q.selectionType === "multiple" && Array.isArray(q.correctOptions) && q.correctOptions.length > 0) {
    return [...new Set(q.correctOptions.filter((i) => typeof i === "number" && i >= 0 && i < n))].sort(
      (a, b) => a - b
    );
  }
  if (typeof q.correctOption === "number" && !Number.isNaN(q.correctOption) && q.correctOption >= 0 && q.correctOption < n) {
    return [q.correctOption];
  }
  return [];
}

export function isMcqMultiple(q: { selectionType?: string }): boolean {
  return q.selectionType === "multiple";
}

/** Student answer as sorted unique option indices. */
export function normalizeMcqStudentSelection(answer: {
  selectedOption?: number;
  selectedOptions?: number[];
}): number[] {
  if (Array.isArray(answer.selectedOptions) && answer.selectedOptions.length > 0) {
    return [...new Set(answer.selectedOptions.filter((i) => typeof i === "number" && !Number.isNaN(i)))].sort(
      (a, b) => a - b
    );
  }
  if (typeof answer.selectedOption === "number" && !Number.isNaN(answer.selectedOption)) {
    return [answer.selectedOption];
  }
  return [];
}

export function selectionsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
