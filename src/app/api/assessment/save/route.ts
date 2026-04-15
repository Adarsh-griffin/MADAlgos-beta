import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TestTokenModel from "@/models/TestToken";

type McqAnswer = { questionIndex: number; selectedOption?: number; selectedOptions?: number[] };
type CodingDraft = { problemIndex: number; sourceCode: string; language: string };

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) return NextResponse.json({ message: "Token is required" }, { status: 400 });

    await connectDB();
    const testToken = await TestTokenModel.findOne({ token }).lean<{ submittedAt?: Date; isStarted?: boolean; draftSubmission?: unknown }>();
    if (!testToken || testToken.submittedAt) {
      return NextResponse.json({ message: "Invalid token or already submitted" }, { status: 403 });
    }
    if (!testToken.isStarted) {
      return NextResponse.json({ message: "Assessment not started" }, { status: 403 });
    }

    return NextResponse.json({
      draft: testToken.draftSubmission || null,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, mcqAnswers: rawMcq, codingSubmissions: rawCoding } = body as {
      token?: string;
      mcqAnswers?: unknown;
      codingSubmissions?: unknown;
    };
    if (!token) return NextResponse.json({ message: "Token is required" }, { status: 400 });

    const mcqAnswers = (Array.isArray(rawMcq) ? rawMcq : []) as McqAnswer[];
    const codingSubmissions = (Array.isArray(rawCoding) ? rawCoding : []) as CodingDraft[];

    await connectDB();
    const testToken = await TestTokenModel.findOne({ token });
    if (!testToken || testToken.submittedAt) {
      return NextResponse.json({ message: "Invalid token or already submitted" }, { status: 403 });
    }
    if (!testToken.isStarted) {
      return NextResponse.json({ message: "Assessment not started" }, { status: 403 });
    }

    testToken.draftSubmission = {
      mcqAnswers: mcqAnswers.map((m) => ({
        questionIndex: Number(m.questionIndex),
        ...(typeof m.selectedOption === "number" ? { selectedOption: m.selectedOption } : {}),
        selectedOptions: Array.isArray(m.selectedOptions) ? m.selectedOptions : [],
      })),
      codingSubmissions: codingSubmissions.map((c) => ({
        problemIndex: Number(c.problemIndex),
        sourceCode: String(c.sourceCode ?? ""),
        language: String(c.language ?? "Javascript"),
      })),
      savedAt: new Date(),
    };
    await testToken.save();

    return NextResponse.json({ message: "Draft saved", savedAt: testToken.draftSubmission.savedAt });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
