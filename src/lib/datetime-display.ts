type DateTimeDisplayOptions = {
  locale?: string;
  timeZone?: string;
  dateStyle?: "full" | "long" | "medium" | "short";
  timeStyle?: "full" | "long" | "medium" | "short";
};

/**
 * App-wide display timezone for server-rendered dates (emails, exports, logs shown to users).
 * Keep DB values as UTC; only convert when formatting for humans.
 */
export function getDisplayTimeZone(): string {
  return (
    process.env.APP_DISPLAY_TIMEZONE?.trim() ||
    process.env.APP_TIMEZONE?.trim() ||
    process.env.TZ?.trim() ||
    "Asia/Kolkata"
  );
}

export function getDisplayLocale(): string {
  return process.env.APP_DISPLAY_LOCALE?.trim() || "en-IN";
}

export function formatDisplayDateTime(date: Date, options?: DateTimeDisplayOptions): string {
  const formatter = new Intl.DateTimeFormat(options?.locale || getDisplayLocale(), {
    timeZone: options?.timeZone || getDisplayTimeZone(),
    dateStyle: options?.dateStyle || "medium",
    timeStyle: options?.timeStyle || "short",
  });
  return formatter.format(date);
}
