"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Save, Send } from "lucide-react";

export type BlogFormData = {
    title: string;
    slug: string;
    thumbnail: string;
    category: string;
    tags: string;
    seoKeywords: string;
    content: string;
    seoDescription: string;
    status?: string;
};

type BlogEditorProps = {
    initialData?: Partial<BlogFormData>;
    onSubmit: (data: BlogFormData, action: "DRAFT" | "PENDING_REVIEW") => void;
    isBusy?: boolean;
    primaryActionLabel?: string;
};

export function BlogEditor({ initialData, onSubmit, isBusy, primaryActionLabel }: BlogEditorProps) {
    const [formData, setFormData] = useState<BlogFormData>({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        thumbnail: initialData?.thumbnail || "",
        category: initialData?.category || "",
        tags: initialData?.tags || "",
        seoKeywords: initialData?.seoKeywords || "",
        content: initialData?.content || "",
        seoDescription: initialData?.seoDescription || "",
    });
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

    // Auto-generate slug when title changes
    useEffect(() => {
        if (!initialData?.slug && formData.title) {
            const generatedSlug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setFormData((prev) => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title, initialData?.slug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (val: string) => {
        setFormData((prev) => ({ ...prev, category: val }));
    };

    return (
        <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 sm:p-8 text-white space-y-8 max-w-4xl mx-auto shadow-2xl">

            {/* Header Section */}
            <div className="border-b border-white/10 pb-6 space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">Create Blog</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-300">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Master React in 10 Days"
                            className="bg-[#111] border-white/10 focus-visible:ring-primary h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-slate-300">Slug (Auto-generated)</Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="master-react-in-10-days"
                            className="bg-[#111] border-white/10 text-slate-400 h-12"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="thumbnail" className="text-slate-300">Thumbnail (upload)</Label>
                        <div className="space-y-3">
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                                <Input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadingThumbnail}
                                    onChange={async (e) => {
                                        const f = e.target.files?.[0];
                                        if (!f) return;
                                        setUploadingThumbnail(true);
                                        try {
                                            const fd = new FormData();
                                            fd.append("image", f);
                                            const res = await fetch("/api/uploads/blog-banner", {
                                                method: "POST",
                                                body: fd,
                                            });
                                            const data = await res.json().catch(() => null);
                                            if (!res.ok) throw new Error(data?.error || "Thumbnail upload failed");
                                            setFormData((prev) => ({ ...prev, thumbnail: data?.imageUrl ?? "" }));
                                        } catch (err) {
                                            // keep UI simple: error will be shown by the caller save action generally
                                            // (we can add toast later if you want)
                                        } finally {
                                            setUploadingThumbnail(false);
                                        }
                                    }}
                                    className="bg-[#111] border-white/10 pl-10 focus-visible:ring-primary h-12
                                        file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border file:border-white/10 file:bg-white/5 file:text-white/80 file:text-xs hover:file:bg-white/10"
                                />
                            </div>

                            {formData.thumbnail ? (
                                <div className="flex items-center gap-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={formData.thumbnail}
                                        alt="Thumbnail preview"
                                        className="w-16 h-16 rounded-2xl border border-white/10 object-cover"
                                    />
                                    <p className="text-xs text-slate-400 truncate">
                                        {uploadingThumbnail ? "Uploading..." : "Preview ready"}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500">Optional: upload a thumbnail image.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-slate-300">Category</Label>
                        <Select value={formData.category} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="bg-[#111] border-white/10 h-12 focus:ring-primary">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] border-white/10 text-white">
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="career">Career Advice</SelectItem>
                                <SelectItem value="algorithms">Algorithms</SelectItem>
                                <SelectItem value="tutorials">Tutorials</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags" className="text-slate-300">Tags (comma separated)</Label>
                    <Input
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="React, Node.js, Web Development"
                        className="bg-[#111] border-white/10 focus-visible:ring-primary h-12"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="seoKeywords" className="text-slate-300">SEO Keywords (comma separated)</Label>
                    <Input
                        id="seoKeywords"
                        name="seoKeywords"
                        value={formData.seoKeywords}
                        onChange={handleChange}
                        placeholder="system design, dsa, interview prep"
                        className="bg-[#111] border-white/10 focus-visible:ring-primary h-12"
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-300">Content Editor</Label>
                <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your blog content here..."
                    className="bg-[#111] border-white/10 focus-visible:ring-primary min-h-[300px] resize-y p-4 text-base leading-relaxed font-mono"
                />
                <p className="text-xs text-slate-500 mt-2">Markdown is supported.</p>
            </div>

            {/* SEO Section */}
            <div className="space-y-2 pt-4 border-t border-white/10">
                <Label htmlFor="seoDescription" className="text-slate-300">SEO Description</Label>
                <Textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    placeholder="Brief description for search engines (max 160 chars)"
                    className="bg-[#111] border-white/10 focus-visible:ring-primary h-24"
                    maxLength={160}
                />
                <div className="text-xs text-right text-slate-500">
                    {formData.seoDescription.length} / 160
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end items-center border-t border-white/10">
                <Button
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => onSubmit(formData, "DRAFT")}
                    className="w-full sm:w-auto border-white/20 bg-transparent text-white hover:bg-white/5 h-12 px-6 rounded-xl"
                >
                    <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
                <Button
                    disabled={isBusy}
                    onClick={() => onSubmit(formData, "PENDING_REVIEW")}
                    className="w-full sm:w-auto bg-primary text-black hover:bg-primary/90 h-12 px-6 rounded-xl font-medium"
                >
                    <Send className="mr-2 h-4 w-4" /> {primaryActionLabel ?? "Submit for Review"}
                </Button>
            </div>

        </div>
    );
}
