import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { loadAssessmentForToken } from "@/lib/assessment-load";
import TestTokenModel from "@/models/TestToken";
import { persistGradedAssessment } from "@/lib/assessment-finalize";
import { requirePracticeTokenAccess } from "@/lib/assessment-access";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const tokenFromQuery = url.searchParams.get("token") ?? "";
    const rawBodyText = await req.text();
    let parsedBody: {
      token?: string;
      mcqAnswers?: unknown;
      codingSubmissions?: unknown;
      status?: "COMPLETED" | "AUTO_SUBMITTED";
    } = {};
    if (rawBodyText.trim()) {
      try {
        parsedBody = JSON.parse(rawBodyText) as typeof parsedBody;
      } catch {
        parsedBody = {};
      }
    }

    const token = String(parsedBody.token || tokenFromQuery || "").trim();
    const rawMcq = parsedBody.mcqAnswers;
    const rawCoding = parsedBody.codingSubmissions;
    const status = parsedBody.status;

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    const mcqAnswers = Array.isArray(rawMcq) ? rawMcq : [];
    const codingSubmissions = Array.isArray(rawCoding) ? rawCoding : [];

    await connectDB();

    const testToken = await TestTokenModel.findOne({ token });
    if (!testToken || testToken.submittedAt) {
      return NextResponse.json({ message: "Invalid token or already submitted" }, { status: 403 });
    }
    const denied = await requirePracticeTokenAccess(
      testToken as Parameters<typeof requirePracticeTokenAccess>[0]
    );
    if (denied) return denied;

    const test = await loadAssessmentForToken(testToken);
    if (!test) return NextResponse.json({ message: "Test not found" }, { status: 404 });

    // Exit/leave can interrupt request body; recover from last saved server draft when payload is missing.
    if (!mcqAnswers.length && !codingSubmissions.length && testToken.draftSubmission) {
      const draft = testToken.draftSubmission as {
        mcqAnswers?: unknown[];
        codingSubmissions?: unknown[];
      };
      if (Array.isArray(draft.mcqAnswers)) mcqAnswers.push(...draft.mcqAnswers);
      if (Array.isArray(draft.codingSubmissions)) codingSubmissions.push(...draft.codingSubmissions);
    }

    const persist = await persistGradedAssessment(
      testToken,
      test as Parameters<typeof persistGradedAssessment>[1],
      mcqAnswers,
      codingSubmissions,
      status || "COMPLETED"
    );

    if (persist.skipped) {
      return NextResponse.json({ message: "Invalid token or already submitted" }, { status: 403 });
    }

    return NextResponse.json({ message: "Assessment graded and saved", resultId: persist.resultId });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("Submission Error:", error);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
