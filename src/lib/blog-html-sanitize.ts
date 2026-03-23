import DOMPurify from "isomorphic-dompurify";
import { stripHtmlForCount } from "@/lib/blog-plain-text";

/**
 * Sanitize mentor/admin blog HTML before storage or public render.
 * Keeps inline styles (colors, font-size) from the rich editor; blocks scripts/iframes.
 */
export function sanitizeBlogHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    WHOLE_DOCUMENT: false,
    ADD_ATTR: ["style", "class", "id", "target", "rel"],
    ADD_TAGS: ["mark"],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ["script", "iframe", "object", "embed", "form", "input", "button"],
  });
}

/** Plain text length for validation (after sanitize). */
export function blogPlainTextLength(html: string): number {
  const safe = sanitizeBlogHtml(html);
  return stripHtmlForCount(safe).length;
}
