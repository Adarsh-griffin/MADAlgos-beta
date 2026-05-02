import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import UserModel from "@/models/User";
import TestTokenModel from "@/models/TestToken";
import PracticeTestModel from "@/models/PracticeTest";
import { getSiteSettings, getUtcMondayStart } from "@/lib/site-settings";

type PracticeDoc = {
  _id: mongoose.Types.ObjectId;
  title?: string;
  duration: number;
};

export async function GET() {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({
        hasResumableTest: false,
        count: 0,
        items: [],
        freeTestsRemaining: null,
        freeTestsWeeklyLimit: null,
      });
    }

    await connectDB();
    const user = await UserModel.findById(session.uid).select("email role").lean<{ email?: string; role?: string } | null>();
    if (!user?.email || user.role !== "STUDENT") {
      return NextResponse.json({
        hasResumableTest: false,
        count: 0,
        items: [],
        freeTestsRemaining: null,
        freeTestsWeeklyLimit: null,
      });
    }

    const emailLower = String(user.email).trim().toLowerCase();
    const uid = new mongoose.Types.ObjectId(session.uid);

    const candidateTokens = await TestTokenModel.find({
      practiceTestId: { $exists: true, $ne: null },
      submittedAt: null,
      $or: [{ linkedUserId: uid }, { studentEmail: emailLower }],
    })
      .select("token practiceTestId isStarted usedAt expiresAt updatedAt")
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(20)
      .lean<
        Array<{
          token: string;
          practiceTestId?: mongoose.Types.ObjectId | null;
          isStarted?: boolean;
          usedAt?: Date;
          expiresAt: Date;
        }>
      >()
      .exec();

    if (!candidateTokens.length) {
      const { freePracticeStartsPerWeek } = await getSiteSettings();
      if (freePracticeStartsPerWeek > 0) {
        const weekStart = getUtcMondayStart(new Date());
        const used = await TestTokenModel.countDocuments({
          $and: [
            { $or: [{ linkedUserId: uid }, { studentEmail: emailLower }] },
            { practiceTestId: { $exists: true, $ne: null } },
            {
              $or: [
                { createdAt: { $gte: weekStart } },
                { usedAt: { $gte: weekStart } },
                { submittedAt: { $gte: weekStart } },
              ],
            },
          ],
        });
        return NextResponse.json({
          hasResumableTest: false,
          count: 0,
          items: [],
          freeTestsRemaining: Math.max(0, freePracticeStartsPerWeek - used),
          freeTestsWeeklyLimit: freePracticeStartsPerWeek,
        });
      }
      return NextResponse.json({
        hasResumableTest: false,
        count: 0,
        items: [],
        freeTestsRemaining: null,
        freeTestsWeeklyLimit: null,
      });
    }

    const practiceIds = [
      ...new Map(
        candidateTokens
          .map((t) => (t.practiceTestId ? t.practiceTestId.toString() : null))
          .filter((id): id is string => Boolean(id))
          .map((id) => [id, new mongoose.Types.ObjectId(id)])
      ).values(),
    ];

    const practices = practiceIds.length
      ? await PracticeTestModel.find({ _id: { $in: practiceIds } })
          .select("title duration")
          .lean<PracticeDoc[]>()
          .exec()
      : [];
    const practiceMap = new Map(practices.map((p) => [p._id.toString(), p]));

    const nowMs = Date.now();

    const items: Array<{ message: string; url: string; testTitle: string }> = [];

    for (const tokenDoc of candidateTokens) {
      const expMs = new Date(tokenDoc.expiresAt).getTime();
      if (nowMs > expMs) continue;

      const pid = tokenDoc.practiceTestId ? String(tokenDoc.practiceTestId) : "";
      const practice = practiceMap.get(pid);
      if (!practice) continue;

      // Mid-test resume: started, not submitted, and still within test duration.
      if (tokenDoc.isStarted) {
        const usedAtMs = tokenDoc.usedAt ? new Date(tokenDoc.usedAt).getTime() : NaN;
        const activeUntilMs = Number.isFinite(usedAtMs)
          ? usedAtMs + Number(practice.duration || 0) * 60 * 1000
          : NaN;
        if (Number.isFinite(activeUntilMs) && nowMs <= activeUntilMs) {
          items.push({
            message: "You have an unfinished test. Resume to continue your attempt.",
            url: `/test/${tokenDoc.token}`,
            testTitle: practice.title || "Practice test",
          });
          continue;
        }
        continue;
      }

      // Not started yet, but token exists and is valid: continue from pre-instructions.
      items.push({
        message: "Your practice test is ready. Resume to continue.",
        url: `/test/${tokenDoc.token}?pre=1`,
        testTitle: practice.title || "Practice test",
      });
    }

    const deduped = [
      ...new Map(items.map((item) => [`${item.url}|${item.testTitle}`, item])).values(),
    ].slice(0, 8);

    const { freePracticeStartsPerWeek } = await getSiteSettings();
    let freeTestsRemaining: number | null = null;
    const freeTestsWeeklyLimit: number | null = freePracticeStartsPerWeek;
    if (freePracticeStartsPerWeek > 0) {
      const weekStart = getUtcMondayStart(new Date());
      const used = await TestTokenModel.countDocuments({
        $and: [
          { $or: [{ linkedUserId: uid }, { studentEmail: emailLower }] },
          { practiceTestId: { $exists: true, $ne: null } },
          {
            $or: [
              { createdAt: { $gte: weekStart } },
              { usedAt: { $gte: weekStart } },
              { submittedAt: { $gte: weekStart } },
            ],
          },
        ],
      });
      freeTestsRemaining = Math.max(0, freePracticeStartsPerWeek - used);
    }

    return NextResponse.json({
      hasResumableTest: deduped.length > 0,
      count: deduped.length,
      items: deduped,
      freeTestsRemaining,
      freeTestsWeeklyLimit,
    });
  } catch (error) {
    console.error("[public-demo/resume-status]", error);
    return NextResponse.json({
      hasResumableTest: false,
      count: 0,
      items: [],
      freeTestsRemaining: null,
      freeTestsWeeklyLimit: null,
    });
  }
}

