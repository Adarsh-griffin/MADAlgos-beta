import React from "react";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import PracticeTestModel from "@/models/PracticeTest";
import { getSiteSettings } from "@/lib/site-settings";
import { SuperSiteSettingsClient, type PracticeRow } from "@/components/admin/super/SuperSiteSettingsClient";

export const metadata = {
  title: "Site & practice | Super admin | MADAlgos",
};

export const dynamic = "force-dynamic";

export default async function SuperSiteSettingsPage() {
  const session = await getSessionFromRequestCookies();
  if (!session) redirect("/auth");
  if (session.role !== "SUPER_ADMIN") redirect("/admin");

  await connectDB();
  const settings = await getSiteSettings();
  const raw = await PracticeTestModel.find({ publicSlug: { $exists: true, $ne: "" } })
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

  const initialTests: PracticeRow[] = raw.map((t) => ({
    id: String(t._id),
    title: t.title,
    publicSlug: String(t.publicSlug ?? "").trim(),
    showOnHomepage: t.showOnHomepage !== false,
    demoSortOrder: typeof t.demoSortOrder === "number" ? t.demoSortOrder : 0,
  }));

  return (
    <SuperSiteSettingsClient initialFreeLimit={settings.freePracticeStartsPerWeek} initialTests={initialTests} />
  );
}
