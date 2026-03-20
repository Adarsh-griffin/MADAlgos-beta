import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import { getSessionFromRequestCookies } from "@/lib/auth";
import UserModel from "@/models/User";

const BodySchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    thumbnail: z.string().optional(),
    category: z.string().optional(),
    tags: z.string().optional(),
    seoKeywords: z.string().optional(),
    content: z.string().min(1),
    seoDescription: z.string().max(160).optional(),
    status: z.enum(["DRAFT", "PENDING_REVIEW"]),
});

export async function POST(req: Request) {
    const session = await getSessionFromRequestCookies();
    // Allow ADMIN, SUPER_ADMIN, and MENTOR to create blogs
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN" && session.role !== "MENTOR")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    await connectDB();

    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
    const finalStatus =
        isAdmin && parsed.data.status === "PENDING_REVIEW" ? "PUBLISHED" : parsed.data.status;

    const user = await UserModel.findById(session.uid).lean().exec();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Find highest ID to auto-increment
    const lastBlog = await BlogModel.findOne().sort({ id: -1 }).select("id").exec();
    const nextId = lastBlog ? lastBlog.id + 1 : 1;

    const now = new Date().toISOString();

    const newBlog = new BlogModel({
        id: nextId,
        title: parsed.data.title,
        publisher: "MADAlgos",
        bannerImageLink: parsed.data.thumbnail || null,
        category: parsed.data.category || "",
        tags: parsed.data.tags ? parsed.data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        seoDescription: parsed.data.seoDescription || "",
        seoKeywords: parsed.data.seoKeywords
            ? parsed.data.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
            : [],
        descriptionId: `admin-${session.uid}-${nextId}`,
        partitionKey: "0",
        publishDate: now,
        authorId: 0,
        descriptionDetails: parsed.data.content,
        status: finalStatus,
        reviewStatus:
            finalStatus === "PUBLISHED"
                ? "APPROVED"
                : finalStatus === "DRAFT"
                    ? "DRAFT"
                    : "PENDING_REVIEW",
        likes: 0,
        reviewer: "",
        reviewDate: "",
        submittedByUid: session.uid,
        rejectionReason: null,
        authorDetails: {
            firstName: user.username || user.email,
            lastName: null,
            dispImageLink: null,
        },
    });

    if (finalStatus === "PUBLISHED" && isAdmin) {
        newBlog.reviewer = session.role;
        newBlog.reviewDate = now;
    }

    await newBlog.save();

    return NextResponse.json({ ok: true, id: nextId });
}
