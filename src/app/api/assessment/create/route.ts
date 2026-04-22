import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { nanoid } from "nanoid";
import { partitionEmailList, sendAssessmentInvitationEmails } from "@/lib/assessment-emails";
import { syncTestContentToQuestionBank } from "@/lib/question-bank";
import PracticeTestModel from "@/models/PracticeTest";
import type { CodingProblem, MCQQuestion } from "@/models/Test";
import { cleanCodingProblemsForCreate, normalizeMcqsForCreate } from "@/lib/assessment-payload-normalize";

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      duration,
      linkValidity,
      mcqs,
      codingProblems,
      emails: emailsRaw,
      isPublicDemo: isPublicDemoRaw,
      publicSlug: publicSlugRaw,
      demoCardSubtitle,
      demoCardImageUrl,
      demoBrandLogoUrl,
      demoLogoDomain,
      demoSortOrder,
    } = await req.json();

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

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const isPublicDemo = Boolean(isPublicDemoRaw);
    let demoPayload: Record<string, unknown> = { isPublicDemo: false };
    if (isPublicDemo) {
      const slug = String(publicSlugRaw ?? "")
        .trim()
        .toLowerCase();
      if (!slug || !slugRegex.test(slug)) {
        return NextResponse.json(
          {
            message:
              "Public demo tests need a unique URL slug: lowercase letters, numbers, and hyphens only (e.g. tcs-hiring-practice).",
          },
          { status: 400 }
        );
      }
      const [dupTest, dupPractice] = await Promise.all([
        TestModel.findOne({ publicSlug: slug }).select("_id").lean(),
        PracticeTestModel.findOne({ publicSlug: slug }).select("_id").lean(),
      ]);
      if (dupTest || dupPractice) {
        return NextResponse.json(
          { message: "That public slug is already used (platform test or practice catalog)." },
          { status: 400 }
        );
      }
      demoPayload = {
        isPublicDemo: true,
        publicSlug: slug,
        demoCardSubtitle: String(demoCardSubtitle ?? "").trim().slice(0, 400),
        demoCardImageUrl: String(demoCardImageUrl ?? "").trim().slice(0, 2000),
        demoBrandLogoUrl: String(demoBrandLogoUrl ?? "").trim().slice(0, 2000),
        demoLogoDomain: String(demoLogoDomain ?? "")
          .trim()
          .toLowerCase()
          .replace(/^https?:\/\//, "")
          .split("/")[0]
          .slice(0, 120),
        demoSortOrder: Number.isFinite(Number(demoSortOrder)) ? Number(demoSortOrder) : 0,
      };
    }

    const cleanedCodingProblems = cleanCodingProblemsForCreate(codingProblems);

    const newTest = await TestModel.create({
      title,
      duration,
      linkValidity,
      mcqs: mcqNorm.mcqs,
      codingProblems: cleanedCodingProblems,
      createdBy: session.uid,
      ...demoPayload,
    });

    await syncTestContentToQuestionBank(
      mcqNorm.mcqs as unknown as MCQQuestion[],
      cleanedCodingProblems as unknown as CodingProblem[],
      session.uid
    ).catch((err) =>
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
