import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import SiteSettingsModel from "@/models/SiteSettings";
import PracticeTestModel from "@/models/PracticeTest";
import { SITE_SETTINGS_ID, getSiteSettings } from "@/lib/site-settings";

function requireSuperAdmin() {
  return getSessionFromRequestCookies().then((s) => (s?.role === "SUPER_ADMIN" ? s : null));
}

/** GET — weekly limit + practice tests for visibility toggles. */
export async function GET() {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const settings = await getSiteSettings();
  const practiceTests = await PracticeTestModel.find({ publicSlug: { $exists: true, $ne: "" } })
    .select("title publicSlug showOnHomepage demoSortOrder")
    .sort({ demoSortOrder: 1, createdAt: -1 })
    .lean<
      Array<{
        _id: mongoose.Types.ObjectId;
        title: string;
        publicSlug?: string;
        showOnHomepage?: boolean;
        demoSortOrder?: number;
      }>
    >()
    .exec();

  return NextResponse.json({
    ...settings,
    practiceTests: practiceTests.map((t) => ({
      id: String(t._id),
      title: t.title,
      publicSlug: t.publicSlug ?? "",
      showOnHomepage: t.showOnHomepage !== false,
      demoSortOrder: typeof t.demoSortOrder === "number" ? t.demoSortOrder : 0,
    })),
  });
}

/** PATCH — `freePracticeStartsPerWeek` only (`0` = unlimited). */
export async function PATCH(req: Request) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const raw = body?.freePracticeStartsPerWeek;
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw < 0) {
    return NextResponse.json(
      { message: "freePracticeStartsPerWeek must be a non-negative number (0 = unlimited)." },
      { status: 400 }
    );
  }
  const freePracticeStartsPerWeek = Math.floor(raw);

  await connectDB();
  await SiteSettingsModel.findOneAndUpdate(
    { _id: SITE_SETTINGS_ID },
    { $set: { freePracticeStartsPerWeek } },
    { upsert: true, new: true }
  ).exec();

  return NextResponse.json({ ok: true, freePracticeStartsPerWeek });
}
