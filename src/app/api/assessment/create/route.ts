import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { nanoid } from "nanoid";
import { partitionEmailList, sendAssessmentInvitationEmails } from "@/lib/assessment-emails";
import { syncTestContentToQuestionBank } from "@/lib/question-bank";

function normalizeMcqsForCreate(mcqs: unknown[]): { ok: true; mcqs: Record<string, unknown>[] } | { ok: false; message: string } {
  const out: Record<string, unknown>[] = [];
  for (const raw of mcqs as Record<string, unknown>[]) {
    const n = (raw.options as unknown[] | undefined)?.length ?? 0;
    const selectionType = raw.selectionType === "multiple" ? "multiple" : "single";
    if (selectionType === "single") {
      const c = raw.correctOption as number;
      if (typeof c !== "number" || Number.isNaN(c) || c < 0 || c >= n) {
        return { ok: false, message: "Each single-choice MCQ needs a valid correct option index." };
      }
      out.push({ ...raw, selectionType: "single", correctOption: c, correctOptions: [] });
    } else {
      const arr = Array.isArray(raw.correctOptions) ? (raw.correctOptions as number[]) : [];
      const uniq = [...new Set(arr.filter((i) => typeof i === "number" && !Number.isNaN(i) && i >= 0 && i < n))].sort(
        (a, b) => a - b
      );
      if (uniq.length < 2) {
        return { ok: false, message: "Multi-select MCQs need at least two distinct correct options." };
      }
      out.push({ ...raw, selectionType: "multiple", correctOptions: uniq, correctOption: uniq[0] });
    }
  }
  return { ok: true, mcqs: out };
}

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, duration, linkValidity, mcqs, codingProblems, emails: emailsRaw } = await req.json();

    const rawEmailBlock = Array.isArray(emailsRaw)
      ? emailsRaw.map((e: unknown) => String(e)).join("\n")
      : typeof emailsRaw === "string"
        ? emailsRaw
        : "";
    const { valid: emails, invalid: invalidEmailEntries, ignoredDuplicates } =
      partitionEmailList(rawEmailBlock);

    if (!title || (!mcqs.length && !codingProblems.length)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const mcqNorm = normalizeMcqsForCreate(mcqs);
    if (!mcqNorm.ok) {
      return NextResponse.json({ message: mcqNorm.message }, { status: 400 });
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
      mcqs: mcqNorm.mcqs,
      codingProblems: cleanedCodingProblems,
      createdBy: session.uid,
    });

    await syncTestContentToQuestionBank(mcqNorm.mcqs as never[], cleanedCodingProblems, session.uid).catch((err) =>
      console.error("Question bank sync (non-fatal):", err)
    );

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
      invalidEmailEntries,
      ignoredDuplicatesFromPaste: ignoredDuplicates,
      ...(emailError ? { emailError } : {}),
    });
  } catch (error: unknown) {
    console.error("Create Test Error:", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
