import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import PracticeTestModel from "@/models/PracticeTest";
import { cleanCodingProblemsForCreate, normalizeMcqsForCreate } from "@/lib/assessment-payload-normalize";
import { syncTestContentToQuestionBank } from "@/lib/question-bank";
import TestModel from "@/models/Test";

function requireAdmin() {
  return getSessionFromRequestCookies().then((s) =>
    s && (s.role === "ADMIN" || s.role === "SUPER_ADMIN") ? s : null
  );
}

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** GET — list all practice tests (admin). */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const items = await PracticeTestModel.find()
    .sort({ demoSortOrder: 1, createdAt: -1 })
    .lean<
      Array<{
        _id: mongoose.Types.ObjectId;
        title: string;
        publicSlug: string;
        duration: number;
        demoSortOrder?: number;
        createdAt: Date;
      }>
    >()
    .exec();
  return NextResponse.json({ items });
}

/** POST — create practice test. */
export async function POST(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json(
        {
          message:
            "URL slug: lowercase letters, numbers, hyphens only (e.g. acme-hiring-practice).",
        },
        { status: 400 }
      );
    }

    const mcqNorm = normalizeMcqsForCreate(mcqs);
    if (!mcqNorm.ok) {
      return NextResponse.json({ message: mcqNorm.message }, { status: 400 });
    }

    await connectDB();

    const [dupPractice, dupTest] = await Promise.all([
      PracticeTestModel.findOne({ publicSlug: slug }).select("_id").lean(),
      TestModel.findOne({ publicSlug: slug }).select("_id").lean(),
    ]);
    if (dupPractice || dupTest) {
      return NextResponse.json({ message: "That public slug is already in use." }, { status: 400 });
    }

    const cleanedCoding = cleanCodingProblemsForCreate(codingProblems);

    const showOnHomepage =
      session.role === "SUPER_ADMIN" && typeof showOnHomepageRaw === "boolean" ? showOnHomepageRaw : true;

    const doc = await PracticeTestModel.create({
      title: String(title).trim(),
      duration: Number.isFinite(Number(duration)) ? Number(duration) : 60,
      linkValidity: Number.isFinite(Number(linkValidity)) ? Number(linkValidity) : 168,
      mcqs: mcqNorm.mcqs,
      codingProblems: cleanedCoding,
      createdBy: new mongoose.Types.ObjectId(session.uid),
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
      showOnHomepage,
    });

    await syncTestContentToQuestionBank(mcqNorm.mcqs as never[], cleanedCoding as never[], session.uid).catch((err) =>
      console.error("Question bank sync (non-fatal):", err)
    );

    return NextResponse.json({
      message: "Practice test created.",
      id: String(doc._id),
      publicSlug: doc.publicSlug,
    });
  } catch (e: unknown) {
    console.error("[admin/practice-tests POST]", e);
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
