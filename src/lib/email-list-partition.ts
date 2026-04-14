/**
 * Shared email list parsing for assessment dispatch (client + server).
 * Does not import Node-only modules.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type InvalidEmailEntry = { value: string; reason: string };

export type PartitionedEmailList = {
  /** Unique lowercased valid addresses, first occurrence wins */
  valid: string[];
  /** Non-empty tokens that are not valid emails */
  invalid: InvalidEmailEntry[];
  /** Lowercased emails that appeared again after the first valid occurrence */
  ignoredDuplicates: string[];
};

function reasonForInvalid(token: string): string {
  const t = token.trim();
  if (!t.includes("@")) return "Missing @ symbol";
  if (/\s/.test(t)) return "Contains whitespace";
  if (!EMAIL_RE.test(t.toLowerCase())) return "Invalid email format";
  return "Invalid email format";
}

/**
 * Split bulk input: lines, commas, semicolons, tabs; also splits spaces between separate tokens.
 */
function tokenizeInput(raw: string): string[] {
  const out: string[] = [];
  for (const line of raw.split(/[\n\r]+/)) {
    for (const seg of line.split(/[;\t]+/)) {
      for (const commaChunk of seg.split(",")) {
        for (const piece of commaChunk.split(/\s+/)) {
          const t = piece.trim();
          if (t) out.push(t);
        }
      }
    }
  }
  return out;
}

export function isValidEmailToken(token: string): boolean {
  const e = token.trim().toLowerCase();
  return e.length > 0 && e.includes("@") && EMAIL_RE.test(e);
}

/**
 * Parses pasted lists and Excel-joined strings. Valid emails are deduped (case-insensitive).
 */
export function partitionEmailList(raw: string): PartitionedEmailList {
  const tokens = tokenizeInput(raw);
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: InvalidEmailEntry[] = [];
  const ignoredDuplicates: string[] = [];

  for (const token of tokens) {
    const lower = token.trim().toLowerCase();
    if (!token.trim()) continue;

    if (isValidEmailToken(token)) {
      if (seen.has(lower)) {
        ignoredDuplicates.push(lower);
        continue;
      }
      seen.add(lower);
      valid.push(lower);
    } else {
      const display = token.trim().slice(0, 120);
      invalid.push({ value: display || token.slice(0, 120), reason: reasonForInvalid(token) });
    }
  }

  return { valid, invalid, ignoredDuplicates };
}

/** Backwards-compatible: unique valid emails only. */
export function parseEmailList(raw: string): string[] {
  return partitionEmailList(raw).valid;
}
