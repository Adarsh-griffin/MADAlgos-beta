import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import QuestionBankItemModel, { type QuestionBankKind } from "@/models/QuestionBankItem";
import type { CodingProblem, MCQQuestion } from "@/models/Test";
import {
  ensureCatalogPacksSeeded,
  fingerprintForCoding,
  fingerprintForMcq,
  searchTextForBankEntry,
} from "@/lib/question-bank";
import { getMcqCorrectIndices } from "@/lib/assessment-mcq";
import { normalizeQuestionBankCodingProblem } from "@/lib/assessment-payload-normalize";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function requireAdmin() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) return null;
  return session;
}

function validateMcq(mcq: MCQQuestion | undefined): { ok: true } | { ok: false; message: string } {
  if (!mcq?.questionText?.trim()) return { ok: false, message: "Question text is required." };
  const options = Array.isArray(mcq.options) ? mcq.options.map((o) => String(o ?? "").trim()) : [];
  if (options.length < 2) return { ok: false, message: "At least 2 options are required." };
  if (options.some((opt) => !opt)) return { ok: false, message: "Options cannot be empty." };
  const corr = getMcqCorrectIndices(mcq);
  if (corr.length < 1) return { ok: false, message: "Choose at least one correct option." };
  if (mcq.selectionType === "multiple" && corr.length < 2) {
    return { ok: false, message: "Multi-select MCQ needs at least two correct options." };
  }
  return { ok: true };
}

function validateCoding(coding: CodingProblem | undefined): { ok: true } | { ok: false; message: string } {
  if (!coding?.title?.trim() || !coding?.description?.trim()) {
    return { ok: false, message: "Coding title and description are required." };
  }
  const sampleOk = (coding.sampleTestCases || []).some((t) => t.input.trim() && t.output.trim());
  const hiddenOk = (coding.hiddenTestCases || []).some((t) => t.input.trim() && t.output.trim());
  if (!sampleOk || !hiddenOk) {
    return { ok: false, message: "Add at least one valid sample and hidden test case." };
  }
  return { ok: true };
}

export async function GET(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const kind = searchParams.get("kind");
    const section = (searchParams.get("section") || "").trim();
    const tag = (searchParams.get("tag") || "").trim().toLowerCase();
    const pageParam = Number.parseInt(searchParams.get("page") || "1", 10);
    const limitParam = Number.parseInt(searchParams.get("limit") || "25", 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Math.min(100, Math.max(1, Number.isFinite(limitParam) ? limitParam : 25));
    const skip = (page - 1) * limit;

    await connectDB();
    await ensureCatalogPacksSeeded();

    const filter: Record<string, unknown> = {};
    if (q) filter.searchText = { $regex: escapeRegex(q), $options: "i" };
    if (kind === "MCQ" || kind === "CODING") filter.kind = kind;
    if (section) filter.section = section;
    if (tag) filter.tags = tag;

    const [items, total] = await Promise.all([
      QuestionBankItemModel.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean().exec(),
      QuestionBankItemModel.countDocuments(filter),
    ]);
    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      items: items.map((doc) => ({
        id: String(doc._id),
        kind: doc.kind,
        fingerprint: doc.fingerprint,
        mcq: doc.mcq,
        coding: doc.coding,
        section: doc.section || "",
        tags: doc.tags || [],
        leetcodeSlug: doc.leetcodeSlug || "",
        sourcePack: doc.sourcePack || "",
        updatedAt: doc.updatedAt,
      })),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json()) as {
      kind?: QuestionBankKind;
      mcq?: MCQQuestion;
      coding?: CodingProblem;
      section?: string;
      tags?: string[];
      leetcodeSlug?: string;
    };

    const kind = body.kind;
    if (kind !== "MCQ" && kind !== "CODING") {
      return NextResponse.json({ message: "kind must be MCQ or CODING." }, { status: 400 });
    }

    const normalizedCoding =
      kind === "CODING"
        ? (normalizeQuestionBankCodingProblem(body.coding as unknown as Record<string, unknown>) as CodingProblem)
        : undefined;

    const validation = kind === "MCQ" ? validateMcq(body.mcq) : validateCoding(normalizedCoding);
    if (!validation.ok) return NextResponse.json({ message: validation.message }, { status: 400 });

    await connectDB();
    await ensureCatalogPacksSeeded();

    const fingerprint =
      kind === "MCQ"
        ? fingerprintForMcq(body.mcq as MCQQuestion)
        : fingerprintForCoding(normalizedCoding as CodingProblem);
    const existing = await QuestionBankItemModel.findOne({ fingerprint }).lean();
    if (existing) {
      return NextResponse.json({ message: "Same question already exists.", id: String(existing._id) }, { status: 409 });
    }

    const section = String(body.section ?? "").trim();
    const tags = Array.isArray(body.tags) ? body.tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean) : [];
    const leetcodeSlug = String(body.leetcodeSlug ?? "").trim().toLowerCase();

    const created = await QuestionBankItemModel.create({
      kind,
      mcq: kind === "MCQ" ? body.mcq : undefined,
      coding: kind === "CODING" ? normalizedCoding : undefined,
      fingerprint,
      searchText: searchTextForBankEntry(kind, body.mcq, normalizedCoding as CodingProblem),
      section,
      tags,
      leetcodeSlug: leetcodeSlug || undefined,
      createdBy: new mongoose.Types.ObjectId(session.uid),
    });

    return NextResponse.json({
      ok: true,
      id: String(created._id),
      kind: created.kind,
      mcq: created.mcq,
      coding: created.coding,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
