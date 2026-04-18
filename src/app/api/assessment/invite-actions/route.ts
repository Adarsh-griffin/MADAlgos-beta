import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import TestResultModel from "@/models/TestResult";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import { sendAssessmentInvitationEmails } from "@/lib/assessment-emails";

function hoursFromNowUntil(expiresAt: Date, now: Date): number {
  const ms = expiresAt.getTime() - now.getTime();
  return Math.max(1, Math.ceil(ms / (60 * 60 * 1000)));
}

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const testId = typeof body.testId === "string" ? body.testId.trim() : "";
    const tokenId = typeof body.tokenId === "string" ? body.tokenId.trim() : "";
    const action = body.action === "new_attempt" ? "new_attempt" : body.action === "resend" ? "resend" : null;
    const expiresAtRaw = typeof body.expiresAt === "string" ? body.expiresAt.trim() : "";

    if (!testId || !mongoose.Types.ObjectId.isValid(testId)) {
      return NextResponse.json({ message: "Invalid test id." }, { status: 400 });
    }
    if (!tokenId || !mongoose.Types.ObjectId.isValid(tokenId)) {
      return NextResponse.json({ message: "Invalid token id." }, { status: 400 });
    }
    if (!action) {
      return NextResponse.json({ message: 'action must be "resend" or "new_attempt".' }, { status: 400 });
    }
    if (!expiresAtRaw) {
      return NextResponse.json({ message: "expiresAt is required (ISO date/time)." }, { status: 400 });
    }

    const expiresAt = new Date(expiresAtRaw);
    if (Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json({ message: "Invalid expiresAt date." }, { status: 400 });
    }

    const now = new Date();
    if (expiresAt.getTime() <= now.getTime()) {
      return NextResponse.json({ message: "Invite expiry must be in the future." }, { status: 400 });
    }

    await connectDB();

    const test = await TestModel.findById(testId).lean<{
      _id: mongoose.Types.ObjectId;
      title: string;
      duration: number;
      linkValidity: number;
    } | null>();

    if (!test) {
      return NextResponse.json({ message: "Test not found." }, { status: 404 });
    }

    const existing = await TestTokenModel.findOne({ _id: tokenId, testId: test._id });
    if (!existing) {
      return NextResponse.json({ message: "Invite not found for this test." }, { status: 404 });
    }

    const validityHoursForEmail = hoursFromNowUntil(expiresAt, now);

    if (action === "resend") {
      existing.expiresAt = expiresAt;
      await existing.save();

      const sendResult = await sendAssessmentInvitationEmails(
        [{ studentEmail: existing.studentEmail, token: existing.token }],
        {
          title: test.title,
          duration: test.duration,
          linkValidity: test.linkValidity,
        },
        { validityHoursForEmail }
      );

      return NextResponse.json({
        message: sendResult.emailError
          ? "Expiry updated but sending the email failed."
          : sendResult.emailSkipped
            ? "Expiry updated. Configure SendGrid to send the invitation email."
            : "Invitation email sent.",
        action: "resend",
        emailSkipped: sendResult.emailSkipped,
        emailsDispatched: sendResult.emailsDispatched,
        ...(sendResult.emailError ? { emailError: sendResult.emailError } : {}),
      });
    }

    await TestResultModel.deleteOne({ tokenId: existing._id });

    existing.token = nanoid();
    existing.expiresAt = expiresAt;
    existing.isStarted = false;
    existing.usedAt = undefined;
    existing.submittedAt = undefined;
    existing.profileSubmittedAt = undefined;
    existing.draftSubmission = undefined;
    existing.studentName = undefined;
    existing.linkedUserId = undefined;
    existing.activatedIp = undefined;
    await existing.save();

    const sendResult = await sendAssessmentInvitationEmails(
      [{ studentEmail: existing.studentEmail, token: existing.token }],
      {
        title: test.title,
        duration: test.duration,
        linkValidity: test.linkValidity,
      },
      { validityHoursForEmail }
    );

    return NextResponse.json({
      message: sendResult.emailError
        ? "New link created and previous attempt cleared, but sending the email failed."
        : sendResult.emailSkipped
          ? "New link created. Configure SendGrid to send the invitation email."
          : "New invitation link created and emailed.",
      action: "new_attempt",
      emailSkipped: sendResult.emailSkipped,
      emailsDispatched: sendResult.emailsDispatched,
      ...(sendResult.emailError ? { emailError: sendResult.emailError } : {}),
    });
  } catch (error: unknown) {
    console.error("[assessment-invite-actions]", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
