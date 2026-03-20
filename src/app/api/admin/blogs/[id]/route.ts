import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import { getSessionFromRequestCookies } from "@/lib/auth";

const BodySchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    thumbnail: z.string().optional(),
    category: z.string().optional(),
    tags: z.string().optional(),
    seoKeywords: z.string().optional(),
    content: z.string().min(1),
    seoDescription: z.string().max(160).optional(),
    status: z.enum(["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED"]),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN" && session.role !== "MENTOR")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    await connectDB();

    const { id: rawId } = await params;
    const blog = await BlogModel.findOne({ id: Number(rawId) }).exec();
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // If MENTOR, ensure they only edit their own blogs
    if (session.role === "MENTOR" && blog.submittedByUid !== session.uid) {
        return NextResponse.json({ error: "Forbidden: Can only edit your own blogs" }, { status: 403 });
    }

    blog.title = parsed.data.title;
    blog.status = parsed.data.status;
    blog.bannerImageLink = parsed.data.thumbnail ?? null;
    blog.category = parsed.data.category || "";
    blog.tags = parsed.data.tags
        ? parsed.data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];
    blog.seoDescription = parsed.data.seoDescription || "";
    blog.seoKeywords = parsed.data.seoKeywords
        ? parsed.data.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
        : [];

    // Blog schema stores the full HTML/content as a single string.
    // Never treat `descriptionDetails` as an object.
    blog.descriptionDetails = parsed.data.content;

    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
    const finalStatus =
        isAdmin && parsed.data.status === "PENDING_REVIEW" ? "PUBLISHED" : parsed.data.status;

    // Review Status logic
    blog.status = finalStatus;

    if (finalStatus === "DRAFT") {
        blog.reviewStatus = "DRAFT";
    } else if (finalStatus === "PENDING_REVIEW") {
        blog.reviewStatus = "PENDING_REVIEW";
    }
    // If moving straight to PUBLISHED and they are ADMIN, automatically approve
    if (finalStatus === "PUBLISHED" && isAdmin) {
        blog.reviewStatus = "APPROVED";
        blog.reviewer = session.role;
        blog.reviewDate = new Date().toISOString();
    }

    await blog.save();

    return NextResponse.json({ ok: true });
}
