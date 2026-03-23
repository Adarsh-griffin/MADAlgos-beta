import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import UserModel from "@/models/User";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { blogPlainTextLength, sanitizeBlogHtml } from "@/lib/blog-html-sanitize";

const BodySchema = z.object({
  title: z.string().min(5).max(200),
  bannerImageLink: z.string().url().nullable().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords: z.string().optional(),
  descriptionDetails: z.string().min(1).max(200_000),
  status: z.enum(["DRAFT", "PENDING_REVIEW"]).optional(),
});

async function requireMentor() {
  const session = await getSessionFromRequestCookies();
  if (!session || session.role !== "MENTOR") return null;
  return session;
}

export async function POST(req: Request) {
  const session = await requireMentor();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const sanitizedBody = sanitizeBlogHtml(parsed.data.descriptionDetails);
  if (blogPlainTextLength(sanitizedBody) < 50) {
    return NextResponse.json(
      { error: "Blog content must be at least 50 characters of text (excluding formatting)." },
      { status: 400 }
    );
  }

  await connectDB();
  const user = await UserModel.findById(session.uid).exec();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const max = await BlogModel.findOne().sort({ id: -1 }).lean().exec();
  const nextId = (max?.id ?? 0) + 1;

  const now = new Date();
  const status = parsed.data.status ?? "PENDING_REVIEW";

  await BlogModel.create({
    id: nextId,
    title: parsed.data.title,
    publisher: "MADAlgos",
    bannerImageLink: parsed.data.bannerImageLink ?? null,
    category: parsed.data.category || "",
    tags: parsed.data.tags ? parsed.data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    seoDescription: parsed.data.seoDescription || "",
    seoKeywords: parsed.data.seoKeywords
      ? parsed.data.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
      : [],
    descriptionId: `mentor-${session.uid}-${nextId}`,
    partitionKey: "0",
    publishDate: now.toISOString(),
    authorId: 0,
    status,
    reviewStatus: status,
    submittedByUid: session.uid,
    rejectionReason: null,
    likes: 0,
    reviewer: "",
    reviewDate: "",
    descriptionDetails: sanitizedBody,
    authorDetails: {
      firstName: user.username || user.email,
      lastName: null,
      dispImageLink: null,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await requireMentor();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const docs = await BlogModel.find({
    $or: [
      { submittedByUid: session.uid },
      { descriptionId: { $regex: `^mentor-${session.uid}-` } },
    ],
  })
    .sort({ publishDate: -1 })
    .lean()
    .exec();

  return NextResponse.json({
    ok: true,
    blogs: docs.map((b: any) => ({
      id: b.id,
      title: b.title,
      category: b.category ?? "",
      tags: Array.isArray(b.tags) ? b.tags : [],
      seoDescription: b.seoDescription ?? "",
      seoKeywords: Array.isArray(b.seoKeywords) ? b.seoKeywords : [],
      status: b.status ?? "DRAFT",
      reviewStatus: b.reviewStatus ?? "",
      rejectionReason: b.rejectionReason ?? null,
      publishDate: b.publishDate,
      reviewDate: b.reviewDate ?? "",
    })),
  });
}

