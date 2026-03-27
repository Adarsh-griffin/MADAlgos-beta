/** Local calendar date string YYYY-MM-DD, N days from today (local midnight). */
export function localDateStringPlusDays(daysFromToday: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysFromToday);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Earliest selectable mock booking day: today + 2 calendar days (local). */
export function earliestMockBookingDateLocalString(): string {
  return localDateStringPlusDays(2);
}

/** True if YYYY-MM-DD is on or after earliest mock booking day (local). */
export function isLocalDateAtLeastDaysAhead(yyyyMmDd: string, daysFromToday: number): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return false;
  const min = localDateStringPlusDays(daysFromToday);
  return yyyyMmDd >= min;
}

/** UTC midnight ms for the calendar day of an ISO date string. */
function utcDayMs(iso: string): number | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Earliest allowed booking day as UTC midnight ms: UTC today + 2 days. */
export function earliestMockBookingUtcDayMs(): number {
  const n = new Date();
  return Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()) + 2 * 86400000;
}

/** Server-side guard: booking day must be at least 2 days after UTC today. */
export function isMockBookingDateAllowedServer(isoDate: string): boolean {
  const day = utcDayMs(isoDate);
  if (day === null) return false;
  return day >= earliestMockBookingUtcDayMs();
}
