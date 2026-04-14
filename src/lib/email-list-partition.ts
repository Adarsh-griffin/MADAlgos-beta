/**
 * Shared email list parsing for assessment dispatch (client + server).
 * Does not import Node-only modules.
 *
 * Validation is stricter than a loose "has @ and a dot" check: structure must match
 * typical deliverable addresses, with common domain typos (gmai.com, gmail.con, etc.) rejected.
 */

export type InvalidEmailEntry = { value: string; reason: string };

export type PartitionedEmailList = {
  /** Unique lowercased valid addresses, first occurrence wins */
  valid: string[];
  /** Non-empty tokens that are not valid emails */
  invalid: InvalidEmailEntry[];
  /** Lowercased emails that appeared again after the first valid occurrence */
  ignoredDuplicates: string[];
};

/** Obvious typos / fake TLDs that look like gmail.com / yahoo / outlook etc. */
const TYPICAL_DOMAIN_TYPOS = new Set([
  "gmai.com",
  "gmial.com",
  "gmaill.com",
  "gamil.com",
  "gnail.com",
  "gmail.con",
  "gmail.coom",
  "gmail.comm",
  "gmail.om",
  "yahooo.com",
  "yaho.com",
  "yahoo.com.com",
  "yahou.com",
  "hotmial.com",
  "hotmal.com",
  "hotmail.con",
  "outlok.com",
  "outlook.con",
  "rediffmai.com",
  "rediffmail.con",
]);

/**
 * Validates a single address for assessment invites.
 * Returns normalized lowercased email when valid.
 */
export function validateAssessmentInviteEmail(raw: string): { ok: true; normalized: string } | { ok: false; reason: string } {
  const e = raw.trim().toLowerCase();
  if (!e) return { ok: false, reason: "Empty" };
  if (e.length > 254) return { ok: false, reason: "Address too long" };

  const atCount = (e.match(/@/g) || []).length;
  if (atCount === 0) return { ok: false, reason: "Missing @ symbol" };
  if (atCount > 1) return { ok: false, reason: "Only one @ symbol is allowed" };
  if (/\s/.test(e)) return { ok: false, reason: "Contains whitespace" };

  const [local, domain] = e.split("@");
  if (!local || !domain) return { ok: false, reason: "Invalid email format" };
  if (local.length > 64) return { ok: false, reason: "Local part is too long (max 64 characters)" };

  // Local part: printable, no leading/trailing dot, no consecutive dots
  if (!/^[a-z0-9](?:[a-z0-9._%+-]*[a-z0-9])?$/.test(local) && !/^[a-z0-9]$/.test(local)) {
    return { ok: false, reason: "Invalid characters before @" };
  }
  if (local.includes("..")) return { ok: false, reason: "Cannot contain .. in the name before @" };

  if (!domain.includes(".")) {
    return { ok: false, reason: "Domain needs an extension (e.g. .com, .in, .edu)" };
  }

  const labels = domain.split(".");
  if (labels.some((l) => !l || l.length > 63)) {
    return { ok: false, reason: "Invalid domain name" };
  }

  for (const label of labels) {
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)) {
      return { ok: false, reason: "Invalid domain name" };
    }
  }

  const tld = labels[labels.length - 1];
  if (tld.length < 2 || !/^[a-z]{2,24}$/.test(tld)) {
    return { ok: false, reason: "Invalid domain extension" };
  }
  // Reject obviously fake / non-domain TLDs used in typos
  if (tld === "con" || tld === "om" || tld === "comm" || tld === "coom") {
    return { ok: false, reason: "Invalid or mistyped domain extension" };
  }

  if (TYPICAL_DOMAIN_TYPOS.has(domain)) {
    return {
      ok: false,
      reason: "Domain looks mistyped (check spelling of gmail.com, yahoo.com, etc.)",
    };
  }

  return { ok: true, normalized: e };
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
  const v = validateAssessmentInviteEmail(token);
  return v.ok;
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
    const trimmed = token.trim();
    if (!trimmed) continue;

    const v = validateAssessmentInviteEmail(trimmed);
    if (v.ok) {
      const lower = v.normalized;
      if (seen.has(lower)) {
        ignoredDuplicates.push(lower);
        continue;
      }
      seen.add(lower);
      valid.push(lower);
    } else {
      const display = trimmed.slice(0, 120);
      invalid.push({ value: display || trimmed.slice(0, 120), reason: v.reason });
    }
  }

  return { valid, invalid, ignoredDuplicates };
}

/** Backwards-compatible: unique valid emails only. */
export function parseEmailList(raw: string): string[] {
  return partitionEmailList(raw).valid;
}
