import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import PracticeTestModel from "@/models/PracticeTest";
import TestTokenModel from "@/models/TestToken";
import TestModel from "@/models/Test";
import { cleanCodingProblemsForCreate, normalizeMcqsForCreate } from "@/lib/assessment-payload-normalize";
import { syncTestContentToQuestionBank } from "@/lib/question-bank";

async function requireAdmin() {
  const s = await getSessionFromRequestCookies();
  return s && (s.role === "ADMIN" || s.role === "SUPER_ADMIN") ? s : null;
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }
  await connectDB();
  const doc = await PracticeTestModel.findById(id).lean();
  if (!doc) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await ctx.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const {
      title,
      duration,
      linkValidity,
      mcqs,
      codingProblems,
      publicSlug: publicSlugRaw,
      demoCardSubtitle,
      demoCardImageUrl,
      demoBrandLogoUrl,
      demoLogoDomain,
      demoSortOrder,
      showOnHomepage: showOnHomepageRaw,
    } = body as Record<string, unknown>;

    if (!title || typeof title !== "string" || !String(title).trim()) {
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }
    if (!Array.isArray(mcqs) || !Array.isArray(codingProblems)) {
      return NextResponse.json({ message: "mcqs and codingProblems must be arrays." }, { status: 400 });
    }
    if (!mcqs.length && !codingProblems.length) {
      return NextResponse.json({ message: "Add at least one MCQ or coding problem." }, { status: 400 });
    }

    const slug = String(publicSlugRaw ?? "")
      .trim()
      .toLowerCase();
    if (!slug || !SLUG_REGEX.test(slug)) {
      return NextResponse.json({ message: "Invalid URL slug." }, { status: 400 });
    }

    const mcqNorm = normalizeMcqsForCreate(mcqs);
    if (!mcqNorm.ok) {
      return NextResponse.json({ message: mcqNorm.message }, { status: 400 });
    }

    await connectDB();

    const existing = await PracticeTestModel.findById(id);
    if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const dupPractice = await PracticeTestModel.findOne({
      publicSlug: slug,
      _id: { $ne: new mongoose.Types.ObjectId(id) },
    })
      .select("_id")
      .lean();
    const dupTest = await TestModel.findOne({ publicSlug: slug }).select("_id").lean();
    if (dupPractice || dupTest) {
      return NextResponse.json({ message: "That public slug is already in use." }, { status: 400 });
    }

    const cleanedCoding = cleanCodingProblemsForCreate(codingProblems);

    const patch: Record<string, unknown> = {
      title: String(title).trim(),
      duration: Number.isFinite(Number(duration)) ? Number(duration) : existing.duration,
      linkValidity: Number.isFinite(Number(linkValidity)) ? Number(linkValidity) : existing.linkValidity,
      mcqs: mcqNorm.mcqs,
      codingProblems: cleanedCoding,
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
    if (session.role === "SUPER_ADMIN" && typeof showOnHomepageRaw === "boolean") {
      patch.showOnHomepage = showOnHomepageRaw;
    }
    existing.set(patch);
    await existing.save();

    await syncTestContentToQuestionBank(mcqNorm.mcqs as never[], cleanedCoding as never[], session.uid).catch((err) =>
      console.error("Question bank sync (non-fatal):", err)
    );

    return NextResponse.json({ message: "Saved.", id: String(existing._id) });
  } catch (e: unknown) {
    console.error("[admin/practice-tests PATCH]", e);
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const { id } = await ctx.params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }
    await connectDB();
    const oid = new mongoose.Types.ObjectId(id);
    const inUse = await TestTokenModel.countDocuments({ practiceTestId: oid });
    if (inUse > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete: ${inUse} session token(s) reference this practice test.`,
        },
        { status: 409 }
      );
    }
    const r = await PracticeTestModel.deleteOne({ _id: oid });
    if (r.deletedCount === 0) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted." });
  } catch (e: unknown) {
    console.error("[admin/practice-tests DELETE]", e);
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
