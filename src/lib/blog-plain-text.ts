/** Strip tags for character counting (client + server, no DOMPurify). */
export function stripHtmlForCount(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
