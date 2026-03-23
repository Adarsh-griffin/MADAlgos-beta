/**
 * Where to send a user after sign-in or when visiting /auth while already logged in.
 * MENTOR_PENDING stays on /auth to show the "under verification" screen.
 */
export function getDashboardPathForRole(role: string | undefined): string {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return "/admin";
  if (role === "MENTOR") return "/mentor";
  if (role === "MENTOR_PENDING") return "/auth";
  return "/";
}
