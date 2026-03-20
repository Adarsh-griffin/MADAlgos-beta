import React from "react";
import EditBlogPageClient from "./client-page";
import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Admin | Edit Blog",
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN" && session.role !== "MENTOR")) {
        redirect("/auth");
    }

    await connectDB();

    const { id } = await params;
    const blogId = Number(id);
    const blog = await BlogModel.findOne({ id: blogId }).lean().exec();

    if (!blog) {
        redirect("/admin/blogs"); // or 404
    }

    // Map to form data
    const initialData = {
        title: blog.title || "",
        // Slug is UI-only right now; keep blank and auto-generate from title.
        slug: "",
        thumbnail: blog.bannerImageLink || "",
        category: (blog as any).category || "",
        tags: Array.isArray((blog as any).tags) ? (blog as any).tags.join(", ") : "",
        seoKeywords: Array.isArray((blog as any).seoKeywords) ? (blog as any).seoKeywords.join(", ") : "",
        content: blog.descriptionDetails ?? "",
        seoDescription: (blog as any).seoDescription || "",
        status: blog.status || "DRAFT",
    };

    return <EditBlogPageClient id={blogId} initialData={initialData} />;
}
