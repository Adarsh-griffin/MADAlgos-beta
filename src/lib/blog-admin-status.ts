/**
 * Single source of truth for admin blog list / filters vs `status` + `reviewStatus` in MongoDB.
 * Some legacy or edge rows can have `status: "DRAFT"` while `reviewStatus: "PENDING_REVIEW"`.
 */

export type BlogAdminListStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";

export function deriveBlogAdminListStatus(b: {
  status?: string | null;
  reviewStatus?: string | null;
}): BlogAdminListStatus {
  const s = (b.status ?? "").trim();
  const rs = (b.reviewStatus ?? "").trim();

  if (s === "REJECTED" || rs === "REJECTED") return "REJECTED";
  if (s === "PUBLISHED" || rs === "APPROVED") return "PUBLISHED";
  if (s === "PENDING_REVIEW" || rs === "PENDING_REVIEW") return "PENDING_REVIEW";
  return "DRAFT";
}

/** Matches rows where {@link deriveBlogAdminListStatus} === "PENDING_REVIEW". */
export const blogPendingReviewMongoFilter = {
  $and: [
    { status: { $nin: ["PUBLISHED", "REJECTED"] } },
    { reviewStatus: { $nin: ["APPROVED", "REJECTED"] } },
    {
      $or: [{ status: "PENDING_REVIEW" }, { reviewStatus: "PENDING_REVIEW" }],
    },
  ],
};
