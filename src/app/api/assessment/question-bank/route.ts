import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import QuestionBankItemModel from "@/models/QuestionBankItem";
import type { MCQQuestion, CodingProblem } from "@/models/Test";
import {
  ensureDefaultQuestionBankSeeded,
  fingerprintForCoding,
  fingerprintForMcq,
  upsertBankItem,
} from "@/lib/question-bank";
import { getMcqCorrectIndices } from "@/lib/assessment-mcq";
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const kind = searchParams.get("kind"); // MCQ | CODING | null

    await connectDB();
    await ensureDefaultQuestionBankSeeded();

    const filter: Record<string, unknown> = {};
    if (q) {
      filter.searchText = { $regex: escapeRegex(q), $options: "i" };
    }
    if (kind === "MCQ" || kind === "CODING") {
      filter.kind = kind;
    }

    const items = await QuestionBankItemModel.find(filter)
      .sort({ updatedAt: -1 })
      .limit(80)
      .lean()
      .exec();

    return NextResponse.json({
      items: items.map((doc) => ({
        id: String(doc._id),
        kind: doc.kind,
        mcq: doc.mcq,
        coding: doc.coding,
      })),
    });
  } catch (e: unknown) {
    console.error("Question bank GET:", e);
    const msg = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const kind = body.kind as string;

    await connectDB();
    await ensureDefaultQuestionBankSeeded();

    if (kind === "MCQ") {
      const mcq = body.mcq as MCQQuestion | undefined;
      if (!mcq?.questionText?.trim()) {
        return NextResponse.json({ message: "MCQ question text is required" }, { status: 400 });
      }
      const corr = getMcqCorrectIndices(mcq);
      if (corr.length < 1) {
        return NextResponse.json({ message: "MCQ needs at least one valid correct option." }, { status: 400 });
      }
      if (mcq.selectionType === "multiple" && corr.length < 2) {
        return NextResponse.json(
          { message: "Multi-select MCQs need at least two correct options." },
          { status: 400 }
        );
      }
      await upsertBankItem("MCQ", { mcq }, session.uid);
      const fp = fingerprintForMcq(mcq);
      const saved = await QuestionBankItemModel.findOne({ fingerprint: fp }).lean();
      return NextResponse.json({ ok: true, id: saved ? String(saved._id) : null });
    }

    if (kind === "CODING") {
      const coding = body.coding as CodingProblem | undefined;
      if (!coding?.title?.trim() || !coding?.description?.trim()) {
        return NextResponse.json({ message: "Coding title and description are required" }, { status: 400 });
      }
      const sampleOk = (coding.sampleTestCases || []).some((t) => t.input.trim() && t.output.trim());
      const hiddenOk = (coding.hiddenTestCases || []).some((t) => t.input.trim() && t.output.trim());
      if (!sampleOk || !hiddenOk) {
        return NextResponse.json(
          { message: "Add at least one sample and one hidden test case with non-empty input and output." },
          { status: 400 }
        );
      }
      await upsertBankItem("CODING", { coding }, session.uid);
      const fp = fingerprintForCoding(coding);
      const saved = await QuestionBankItemModel.findOne({ fingerprint: fp }).lean();
      return NextResponse.json({ ok: true, id: saved ? String(saved._id) : null });
    }

    return NextResponse.json({ message: "Invalid kind" }, { status: 400 });
  } catch (e: unknown) {
    console.error("Question bank POST:", e);
    const msg = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
