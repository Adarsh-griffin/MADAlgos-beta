/**
 * Canonical display labels for mock interview catalog rows (topic · experience tier).
 * Prefer this over stored `label` so copy stays consistent across DB seeds.
 */

const MOCK_TOPIC_LINE: Record<string, string> = {
  DSA: "DSA",
  SYS_DES: "System Design",
  BEH_LED: "Behavioural / Leadership",
  ML: "ML / Data",
  FRONTEND: "Frontend · React",
  DEVOPS: "DevOps / Cloud",
};

/** Preferred order for the category dropdown (unknown types sort last). */
const MOCK_CATEGORY_ORDER = ["DSA", "SYS_DES", "BEH_LED", "ML", "FRONTEND", "DEVOPS"] as const;

export function formatMockCategoryLabel(mockType: string): string {
  return MOCK_TOPIC_LINE[mockType] ?? mockType;
}

/** Experience tier for the mock interview row (1–4 yr, 5+ senior). */
export function formatMockTierLabel(expLevel: number): string {
  if (expLevel >= 5) return "5+ yr exp (senior)";
  return `${expLevel} yr exp`;
}

export function sortMockCategoryKeys(types: string[]): string[] {
  return [...types].sort((a, b) => {
    const ia = MOCK_CATEGORY_ORDER.indexOf(a as (typeof MOCK_CATEGORY_ORDER)[number]);
    const ib = MOCK_CATEGORY_ORDER.indexOf(b as (typeof MOCK_CATEGORY_ORDER)[number]);
    const fa = ia === -1 ? 999 : ia;
    const fb = ib === -1 ? 999 : ib;
    return fa - fb || a.localeCompare(b);
  });
}

function formatExpPhrase(expLevel: number): string {
  return formatMockTierLabel(expLevel);
}

export function formatMockOfferingLabel(m: { mockType: string; expLevel: number }): string {
  const topic = MOCK_TOPIC_LINE[m.mockType] ?? m.mockType;
  const exp = formatExpPhrase(m.expLevel);
  return `${topic} · ${exp}`;
}
