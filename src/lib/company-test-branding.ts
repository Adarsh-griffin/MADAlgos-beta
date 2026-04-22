/**
 * Company logos for public demo test cards — same img.logo.dev source as {@link ../components/sections/alumni}.
 * Override with `demoBrandLogoUrl` on the Test doc, or `demoLogoDomain` for logo.dev lookup.
 */
const LOGO_DEV_TOKEN = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN ?? process.env.LOGO_DEV_TOKEN ?? "pk_J68nV3eLS8C3y2kWZfKEFw";

export function logoDevUrl(domain: string): string {
  const d = domain.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  return `https://img.logo.dev/${d}?token=${LOGO_DEV_TOKEN}&retina=true`;
}

/** Default logo.dev domain by public slug (hiring-practice packs). */
const SLUG_TO_LOGO_DOMAIN: Record<string, string> = {
  "google-hiring-practice": "google.com",
  "microsoft-hiring-practice": "microsoft.com",
  "tcs-hiring-practice": "tcs.com",
  "capgemini-hiring-practice": "capgemini.com",
};

export function resolvePublicDemoLogo(input: {
  publicSlug: string;
  /** Full URL — wins if set */
  demoBrandLogoUrl?: string | null;
  /** e.g. google.com — used with logo.dev if no full URL */
  demoLogoDomain?: string | null;
  /** Hero / fallback image */
  demoCardImageUrl?: string | null;
}): string {
  const override = input.demoBrandLogoUrl?.trim();
  if (override) return override;

  const domain = input.demoLogoDomain?.trim();
  if (domain) return logoDevUrl(domain);

  const fromSlug = SLUG_TO_LOGO_DOMAIN[input.publicSlug.trim().toLowerCase()];
  if (fromSlug) return logoDevUrl(fromSlug);

  const fallback = input.demoCardImageUrl?.trim();
  if (fallback) return fallback;

  return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80&auto=format&fit=crop";
}
