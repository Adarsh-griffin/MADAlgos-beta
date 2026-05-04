import { NextResponse } from "next/server";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { runJudge0Submission } from "@/lib/judge0";
import type { CodingProblem } from "@/models/Test";

const LANGUAGE_MAP: Record<string, number> = {
  C: 50,
  "C++": 54,
  Java: 62,
  Javascript: 93,
  JavaScript: 93,
  Python: 71,
};

async function requireAdmin() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) return null;
  return session;
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as {
      coding?: CodingProblem;
      sourceCode?: string;
      language?: string;
      runScope?: "sample" | "all";
    };

    if (!body.coding) return NextResponse.json({ message: "coding payload is required." }, { status: 400 });
    if (!body.sourceCode?.trim()) return NextResponse.json({ message: "sourceCode is required." }, { status: 400 });
    if (!body.language?.trim()) return NextResponse.json({ message: "language is required." }, { status: 400 });

    const samples = body.coding.sampleTestCases || [];
    const hidden = body.coding.hiddenTestCases || [];
    const scope = body.runScope === "sample" ? "sample" : "all";
    const allCases =
      scope === "all"
        ? [
            ...samples.map((tc) => ({ ...tc, visibility: "sample" as const })),
            ...hidden.map((tc) => ({ ...tc, visibility: "hidden" as const })),
          ]
        : samples.map((tc) => ({ ...tc, visibility: "sample" as const }));

    if (allCases.length === 0) {
      return NextResponse.json({ message: "No test cases available for selected run scope." }, { status: 400 });
    }

    const langId = LANGUAGE_MAP[body.language] ?? 93;
    const results = [];
    for (const tc of allCases) {
      const r = await runJudge0Submission(body.sourceCode, langId, tc.input, tc.output);
      results.push({
        visibility: tc.visibility,
        input: tc.input,
        expected: tc.output,
        passed: r.passed,
        status: r.status,
        stdout: r.stdout ?? "",
        stderr: r.stderr ?? "",
        compile_output: r.compile_output ?? "",
        time: r.time,
        memory: r.memory,
      });
    }

    return NextResponse.json({ scope, results });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
