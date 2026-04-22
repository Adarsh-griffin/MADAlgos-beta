import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import PracticeTestModel from "@/models/PracticeTest";
import TestTokenModel from "@/models/TestToken";
import UserModel from "@/models/User";
import { getSiteSettings, getUtcMondayStart } from "@/lib/site-settings";

const BodySchema = z.object({
  slug: z.string().min(1).max(200),
});

/**
 * Mint or resume a TestToken for a logged-in user on a public practice pack (`/available-tests/[slug]`).
 * Assessment content is loaded from `practice_test` via `practiceTestId` on the token.
 */
export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ message: "Sign in required." }, { status: 401 });
    }

    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid request." }, { status: 400 });
    }

    const slug = parsed.data.slug.trim().toLowerCase();
    await connectDB();

    const practice = await PracticeTestModel.findOne({
      publicSlug: slug,
      $or: [{ showOnHomepage: true }, { showOnHomepage: { $exists: false } }],
    })
      .select("_id linkValidity")
      .lean<{ _id: mongoose.Types.ObjectId; linkValidity: number } | null>();

    if (!practice) {
      return NextResponse.json({ message: "Practice test not found." }, { status: 404 });
    }

    const user = await UserModel.findById(session.uid)
      .select("email username")
      .lean<{ email?: string; username?: string | null } | null>();

    if (!user?.email?.trim()) {
      return NextResponse.json({ message: "User email missing." }, { status: 400 });
    }

    const emailLower = String(user.email).trim().toLowerCase();
    const displayName =
      user.username?.trim() || emailLower.split("@")[0] || "Student";

    const now = new Date();
    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headerList.get("x-real-ip") ||
      "unknown";

    const existing = await TestTokenModel.findOne({
      practiceTestId: practice._id,
      studentEmail: emailLower,
      submittedAt: null,
    })
      .sort({ createdAt: -1 })
      .exec();

    if (existing) {
      const exp = new Date(existing.expiresAt);
      if (now <= exp) {
        if (!existing.profileSubmittedAt) {
          existing.profileSubmittedAt = now;
          existing.studentName = displayName;
          existing.linkedUserId = new mongoose.Types.ObjectId(session.uid);
        }
        if (!existing.isStarted) {
          existing.isStarted = true;
          existing.usedAt = now;
          existing.activatedIp = ip;
        }
        await existing.save();
        return NextResponse.json({
          url: `/test/${existing.token}`,
          resumed: true,
        });
      }
    }

    if (session.role !== "SUPER_ADMIN") {
      const { freePracticeStartsPerWeek } = await getSiteSettings();
      if (freePracticeStartsPerWeek > 0) {
        const weekStart = getUtcMondayStart(now);
        const uid = new mongoose.Types.ObjectId(session.uid);
        const used = await TestTokenModel.countDocuments({
          $or: [{ linkedUserId: uid }, { studentEmail: emailLower }],
          practiceTestId: { $exists: true, $ne: null },
          createdAt: { $gte: weekStart },
        });
        if (used >= freePracticeStartsPerWeek) {
          return NextResponse.json(
            {
              message: `Free practice limit reached for this week (${freePracticeStartsPerWeek} new starts, UTC week). Try again next Monday or contact support.`,
            },
            { status: 403 }
          );
        }
      }
    }

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + practice.linkValidity);

    const token = nanoid();

    await TestTokenModel.create({
      token,
      practiceTestId: practice._id,
      studentEmail: emailLower,
      studentName: displayName,
      profileSubmittedAt: now,
      linkedUserId: new mongoose.Types.ObjectId(session.uid),
      expiresAt: expirationDate,
      isStarted: true,
      usedAt: now,
      activatedIp: ip,
    });

    return NextResponse.json({
      url: `/test/${token}`,
      resumed: false,
    });
  } catch (e: unknown) {
    console.error("[public-demo/start]", e);
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
