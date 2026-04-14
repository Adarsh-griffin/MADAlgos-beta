export type AssessmentInviteMonitorStatus = "Active" | "InProgress" | "Completed" | "Expired";

/**
 * Row status for admin monitor: invite lifecycle per token.
 * - Completed: graded result exists or token marked submitted.
 * - InProgress: student started the test but has not completed.
 * - Expired: not started and invite link past expiresAt.
 * - Active: not started and invite still valid.
 */
export function getAssessmentInviteMonitorStatus(
  token: {
    isStarted?: boolean;
    usedAt?: Date | string | null;
    submittedAt?: Date | string | null;
    expiresAt?: Date | string | null;
  },
  hasResult: boolean,
  now: Date = new Date()
): AssessmentInviteMonitorStatus {
  const completed = Boolean(hasResult || token.submittedAt);
  if (completed) return "Completed";

  const started = Boolean(token.isStarted || token.usedAt);
  if (started) return "InProgress";

  const exp = token.expiresAt != null ? new Date(token.expiresAt) : null;
  if (exp && !Number.isNaN(exp.getTime()) && now > exp) return "Expired";

  return "Active";
}
