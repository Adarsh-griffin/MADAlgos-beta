/**
 * Canonical site origin for server-side emails, redirects, and API links.
 * Set `APP_BASE_URL` in production (Azure App Settings); `NEXT_PUBLIC_APP_URL` is a fallback
 * (also used at build time for client). No trailing slash.
 */
export function getAppBaseUrl(): string {
  return (
    process.env.APP_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

/** Full URL to a path on the app, e.g. getAppUrl("/auth"), getAppUrl("/"). */
export function getAppUrl(path: string): string {
  const base = getAppBaseUrl();
  if (!path || path === "/") return `${base}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
