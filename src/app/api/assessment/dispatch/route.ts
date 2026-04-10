import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { nanoid } from "nanoid";
import mongoose from "mongoose";
import { parseEmailList, sendAssessmentInvitationEmails } from "@/lib/assessment-emails";

const MAX_EMAILS_PER_REQUEST = 500;

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const testId = typeof body.testId === "string" ? body.testId.trim() : "";
    const rawEmails = typeof body.emails === "string" ? body.emails : Array.isArray(body.emails) ? body.emails.join("\n") : "";

    if (!testId || !mongoose.Types.ObjectId.isValid(testId)) {
      return NextResponse.json({ message: "Invalid test id." }, { status: 400 });
    }

    const emails = parseEmailList(rawEmails);
    if (emails.length === 0) {
      return NextResponse.json({ message: "No valid email addresses provided." }, { status: 400 });
    }
    if (emails.length > MAX_EMAILS_PER_REQUEST) {
      return NextResponse.json(
        { message: `Too many emails at once (max ${MAX_EMAILS_PER_REQUEST}). Split into multiple batches.` },
        { status: 400 }
      );
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

    const existingEmails = await TestTokenModel.distinct("studentEmail", { testId: test._id });
    const already = new Set(existingEmails.map((e) => String(e).toLowerCase()));
    const newEmails = emails.filter((e) => !already.has(e));
    const skippedEmails = emails.filter((e) => already.has(e));

    if (newEmails.length === 0) {
      return NextResponse.json({
        message: "All addresses already have an invitation for this test.",
        added: 0,
        skippedExisting: skippedEmails.length,
        skippedEmails,
      });
    }

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + test.linkValidity);

    const tokenDocs = newEmails.map((studentEmail) => ({
      token: nanoid(),
      testId: test._id,
      studentEmail,
      expiresAt: expirationDate,
    }));

    await TestTokenModel.insertMany(tokenDocs);

    const sendResult = await sendAssessmentInvitationEmails(
      tokenDocs.map((t) => ({ studentEmail: t.studentEmail, token: t.token })),
      {
        title: test.title,
        duration: test.duration,
        linkValidity: test.linkValidity,
      }
    );

    return NextResponse.json({
      message: sendResult.emailError
        ? "Tokens created, but sending some or all invitation emails failed."
        : sendResult.emailSkipped
          ? `Added ${newEmails.length} token(s). Configure SendGrid to send invitation emails.`
          : `Invitation emails sent to ${sendResult.emailsDispatched} address(es).`,
      added: newEmails.length,
      skippedExisting: skippedEmails.length,
      skippedEmails,
      emailsDispatched: sendResult.emailsDispatched,
      emailSkipped: sendResult.emailSkipped,
      ...(sendResult.emailError ? { emailError: sendResult.emailError } : {}),
    });
  } catch (error: unknown) {
    console.error("[assessment-dispatch]", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
