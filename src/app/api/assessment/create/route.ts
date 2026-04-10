import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { nanoid } from "nanoid";
import { parseEmailList, sendAssessmentInvitationEmails } from "@/lib/assessment-emails";

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, duration, linkValidity, mcqs, codingProblems, emails: emailsRaw } = await req.json();

    const emails = Array.isArray(emailsRaw)
      ? parseEmailList(emailsRaw.map((e: unknown) => String(e)).join("\n"))
      : typeof emailsRaw === "string"
        ? parseEmailList(emailsRaw)
        : [];

    if (!title || (!mcqs.length && !codingProblems.length)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    for (const m of mcqs as { options?: string[]; correctOption?: number }[]) {
      const n = m.options?.length ?? 0;
      const c = m.correctOption;
      if (typeof c !== "number" || Number.isNaN(c) || c < 0 || c >= n) {
        return NextResponse.json(
          { message: "Each MCQ must include a valid correct answer (option index)." },
          { status: 400 }
        );
      }
    }

    await connectDB();

    const cleanedCodingProblems = codingProblems.map((p: any) => ({
      ...p,
      sampleTestCases: p.sampleTestCases.filter((tc: any) => tc.input.trim() || tc.output.trim()),
      hiddenTestCases: p.hiddenTestCases.filter((tc: any) => tc.input.trim() || tc.output.trim()),
    }));

    const newTest = await TestModel.create({
      title,
      duration,
      linkValidity,
      mcqs,
      codingProblems: cleanedCodingProblems,
      createdBy: session.uid,
    });

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + linkValidity);

    const tokens =
      emails.length > 0
        ? emails.map((email: string) => ({
            token: nanoid(),
            testId: newTest._id,
            studentEmail: email,
            expiresAt: expirationDate,
          }))
        : [];

    if (tokens.length > 0) {
      await TestTokenModel.insertMany(tokens);
    }

    const sendResult = await sendAssessmentInvitationEmails(
      tokens.map((t) => ({ studentEmail: t.studentEmail, token: t.token })),
      { title, duration, linkValidity }
    );

    const emailError = sendResult.emailError;
    const emailsDispatched = sendResult.emailsDispatched;
    const emailSkipped = sendResult.emailSkipped;

    return NextResponse.json({
      message: emailError
        ? "Test created, but sending invitation emails failed."
        : tokens.length === 0
          ? "Test created. Add students from the test monitor page to send invites."
          : emailSkipped
            ? "Test created. Configure SendGrid to email invitation links."
            : "Test created and links sent.",
      testId: newTest._id,
      previewToken: tokens[0]?.token,
      emailsDispatched,
      emailSkipped: tokens.length > 0 ? emailSkipped : false,
      ...(emailError ? { emailError } : {}),
    });
  } catch (error: unknown) {
    console.error("Create Test Error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
