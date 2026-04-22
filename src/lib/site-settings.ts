import { connectDB } from "@/lib/mongodb";
import SiteSettingsModel from "@/models/SiteSettings";

export const SITE_SETTINGS_ID = "site";

export type SiteSettingsPayload = {
  freePracticeStartsPerWeek: number;
};

/** Monday 00:00:00.000 UTC for the week containing `d`. */
export function getUtcMondayStart(d: Date = new Date()): Date {
  const day = d.getUTCDay();
  const distanceToMonday = (day + 6) % 7;
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - distanceToMonday);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

export async function getSiteSettings(): Promise<SiteSettingsPayload> {
  await connectDB();
  const doc = await SiteSettingsModel.findById(SITE_SETTINGS_ID)
    .lean<{ freePracticeStartsPerWeek?: number } | null>()
    .exec();
  return {
    freePracticeStartsPerWeek:
      typeof doc?.freePracticeStartsPerWeek === "number" ? doc.freePracticeStartsPerWeek : 0,
  };
}
