import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import { runJudge0Submission } from "@/lib/judge0";

const LANGUAGE_MAP: Record<string, number> = {
  C: 50,
  "C++": 54,
  Java: 62,
  Javascript: 93,
  Python: 71,
};

/**
 * POST /api/assessment/run
 * Runs the student's code against public sample cases only (never hidden tests).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, problemIndex, sourceCode, language, runScope } = body as {
      token?: string;
      problemIndex?: number;
      sourceCode?: string;
      language?: string;
      runScope?: "sample" | "all";
    };

    if (!token || typeof problemIndex !== "number" || sourceCode === undefined || !language) {
      return NextResponse.json({ message: "token, problemIndex, sourceCode, and language are required" }, { status: 400 });
    }

    await connectDB();

    const testToken = await TestTokenModel.findOne({ token });
    if (!testToken || testToken.submittedAt) {
      return NextResponse.json({ message: "Invalid token or already submitted" }, { status: 403 });
    }
    if (!testToken.isStarted) {
      return NextResponse.json({ message: "Assessment not started" }, { status: 403 });
    }

    const test = await TestModel.findById(testToken.testId);
    if (!test) {
      return NextResponse.json({ message: "Test not found" }, { status: 404 });
    }

    const problem = test.codingProblems[problemIndex];
    if (!problem) {
      return NextResponse.json({ message: "Invalid problem index" }, { status: 400 });
    }

    const langId = LANGUAGE_MAP[language] ?? 93;
    const samples = problem.sampleTestCases || [];
    const hidden = problem.hiddenTestCases || [];
    const scope = runScope === "all" ? "all" : "sample";

    if (scope === "sample" && samples.length === 0) {
      return NextResponse.json({ message: "No sample test cases for this problem" }, { status: 400 });
    }
    if (scope === "all" && samples.length === 0 && hidden.length === 0) {
      return NextResponse.json({ message: "No test cases configured for this problem" }, { status: 400 });
    }

    const results = [];
    const allCases =
      scope === "all"
        ? [
            ...samples.map((tc: { input: string; output: string }) => ({ ...tc, visibility: "sample" as const })),
            ...hidden.map((tc: { input: string; output: string }) => ({ ...tc, visibility: "hidden" as const })),
          ]
        : samples.map((tc: { input: string; output: string }) => ({ ...tc, visibility: "sample" as const }));

    for (const tc of allCases) {
      const r = await runJudge0Submission(sourceCode, langId, tc.input, tc.output);
      results.push({
        visibility: tc.visibility,
        ...(tc.visibility === "sample" ? { input: tc.input, expected: tc.output } : {}),
        passed: r.passed,
        status: r.status,
        stdout: r.stdout ?? "",
        stderr: r.stderr ?? "",
        compile_output: r.compile_output ?? "",
        time: r.time,
        memory: r.memory,
      });
    }

    return NextResponse.json({ results, scope });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("Assessment run error:", error);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
