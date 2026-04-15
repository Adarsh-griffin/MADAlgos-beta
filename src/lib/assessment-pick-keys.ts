/** Stable keys for deduping question-bank picks vs current assessment draft. */

export function mcqPickKey(m: { questionText: string; options: string[] }): string {
  const opts = (m.options || []).map((o) => String(o).trim().toLowerCase()).join("\x1f");
  return `mcq:${String(m.questionText).trim().toLowerCase()}|${opts}`;
}

export function codingPickKey(p: { title: string; leetcodeSlug?: string | null }): string {
  const slug = p.leetcodeSlug?.trim();
  if (slug) return `code:slug:${slug.toLowerCase()}`;
  return `code:title:${String(p.title).trim().toLowerCase()}`;
}
