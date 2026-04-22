import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { loadAssessmentForToken } from "@/lib/assessment-load";
import TestTokenModel from "@/models/TestToken";
import { persistGradedAssessment } from "@/lib/assessment-finalize";

export async function POST(req: Request) {
  try {
    const { token, mcqAnswers: rawMcq, codingSubmissions: rawCoding, status } = await req.json();

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

    const test = await loadAssessmentForToken(testToken);
    if (!test) return NextResponse.json({ message: "Test not found" }, { status: 404 });

    const persist = await persistGradedAssessment(
      testToken,
      test as any,
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
