import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import QuestionBankItemModel, { type QuestionBankKind } from "@/models/QuestionBankItem";
import type { MCQQuestion, CodingProblem } from "@/models/Test";
import { fingerprintForCoding, fingerprintForMcq, searchTextForBankEntry } from "@/lib/question-bank";
import { getMcqCorrectIndices } from "@/lib/assessment-mcq";
import { cleanCodingProblemsForCreate } from "@/lib/assessment-payload-normalize";

async function requireAdmin() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) return null;
  return session;
}

function validateMcq(mcq: MCQQuestion | undefined): string | null {
  if (!mcq?.questionText?.trim()) return "Question text is required.";
  const options = Array.isArray(mcq.options) ? mcq.options.map((o) => String(o ?? "").trim()) : [];
  if (options.length < 2) return "At least 2 options are required.";
  if (options.some((opt) => !opt)) return "Options cannot be empty.";
  const corr = getMcqCorrectIndices(mcq);
  if (corr.length < 1) return "Choose at least one correct option.";
  if (mcq.selectionType === "multiple" && corr.length < 2) return "Multi-select MCQ needs at least two correct options.";
  return null;
}

function validateCoding(coding: CodingProblem | undefined): string | null {
  if (!coding?.title?.trim() || !coding?.description?.trim()) return "Coding title and description are required.";
  const sampleOk = (coding.sampleTestCases || []).some((t) => t.input.trim() && t.output.trim());
  const hiddenOk = (coding.hiddenTestCases || []).some((t) => t.input.trim() && t.output.trim());
  if (!sampleOk || !hiddenOk) return "Add at least one valid sample and hidden test case.";
  return null;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = (await req.json()) as {
      kind?: QuestionBankKind;
      mcq?: MCQQuestion;
      coding?: CodingProblem;
      section?: string;
      tags?: string[];
      leetcodeSlug?: string;
    };

    await connectDB();
    const existing = await QuestionBankItemModel.findById(id);
    if (!existing) return NextResponse.json({ message: "Question not found." }, { status: 404 });

    const kind = body.kind ?? existing.kind;
    if (kind !== "MCQ" && kind !== "CODING") {
      return NextResponse.json({ message: "kind must be MCQ or CODING." }, { status: 400 });
    }

    const mcq = kind === "MCQ" ? (body.mcq ?? existing.mcq) : undefined;
    const coding =
      kind === "CODING"
        ? (cleanCodingProblemsForCreate([
            (body.coding ?? existing.coding) as unknown as Record<string, unknown>,
          ])[0] as CodingProblem)
        : undefined;
    const error = kind === "MCQ" ? validateMcq(mcq) : validateCoding(coding);
    if (error) return NextResponse.json({ message: error }, { status: 400 });

    const nextFingerprint = kind === "MCQ" ? fingerprintForMcq(mcq as MCQQuestion) : fingerprintForCoding(coding as CodingProblem);
    const conflict = await QuestionBankItemModel.findOne({
      _id: { $ne: existing._id },
      fingerprint: nextFingerprint,
    })
      .select("_id")
      .lean();
    if (conflict) {
      return NextResponse.json({ message: "Another question already has same content." }, { status: 409 });
    }

    existing.kind = kind;
    existing.mcq = kind === "MCQ" ? (mcq as MCQQuestion) : undefined;
    existing.coding = kind === "CODING" ? (coding as CodingProblem) : undefined;
    existing.fingerprint = nextFingerprint;
    existing.searchText = searchTextForBankEntry(kind, existing.mcq, existing.coding);
    existing.section = String(body.section ?? existing.section ?? "").trim();
    existing.tags = Array.isArray(body.tags)
      ? body.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
      : existing.tags ?? [];
    existing.leetcodeSlug = String(body.leetcodeSlug ?? existing.leetcodeSlug ?? "").trim().toLowerCase();
    await existing.save();

    return NextResponse.json({ ok: true, id: String(existing._id) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const deleted = await QuestionBankItemModel.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ message: "Question not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
