/**
 * Copy helpers for book-mock / book-mentorship: any logged-in user except STUDENT
 * purchases with their existing MADAlgos account (mentors, admins, etc.).
 */

export function isLoggedInNonStudent(role: string | null | undefined): boolean {
  return Boolean(role && role !== "STUDENT");
}

export function isLoggedInStudent(role: string | null | undefined): boolean {
  return role === "STUDENT";
}

/** Short phrase for the left-column paragraph, e.g. "as a mentor". */
export function checkoutRolePhrase(role: string | null): string {
  switch (role) {
    case "MENTOR":
      return "as a mentor";
    case "MENTOR_PENDING":
      return "with a pending mentor application";
    case "ADMIN":
      return "as an admin";
    case "SUPER_ADMIN":
      return "as a super admin";
    default:
      return "with your MADAlgos account";
  }
}

/** Parenthetical in footer, e.g. "(mentor)". */
export function checkoutRoleBadge(role: string | null): string {
  switch (role) {
    case "MENTOR":
      return "mentor";
    case "MENTOR_PENDING":
      return "mentor (pending)";
    case "ADMIN":
      return "admin";
    case "SUPER_ADMIN":
      return "super admin";
    case "STUDENT":
      return "student";
    default:
      return "";
  }
}
