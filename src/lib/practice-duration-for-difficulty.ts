/**
 * Client-safe duration helper aligned with `adjustDurationByDifficulty` in assessment-load.ts
 * when MCQ and coding both use the same selected difficulty (public demo flow).
 */

export type AssessmentDeliveryMinutes = {
  easyDurationMinutes?: unknown;
  mediumDurationMinutes?: unknown;
  hardDurationMinutes?: unknown;
};

function clampInt(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function toMinute(value: unknown, fallback: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return clampInt(num, 5, 180);
}

/** Defaults match normalizeDeliveryConfig in assessment-load.ts */
export function resolveUnifiedDifficultyDurationMinutes(
  difficulty: "easy" | "medium" | "hard",
  delivery: AssessmentDeliveryMinutes | null | undefined,
  fallbackTotalMinutes: number
): number {
  const fb = toMinute(fallbackTotalMinutes, 45);
  const easy = toMinute(delivery?.easyDurationMinutes, 35);
  const medium = toMinute(delivery?.mediumDurationMinutes, 45);
  const hard = toMinute(delivery?.hardDurationMinutes, 55);

  if (difficulty === "hard") return hard;
  if (difficulty === "medium") return medium;
  return easy;
}
