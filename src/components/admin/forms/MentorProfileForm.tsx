"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type MentorProfileFormProps = {
    initialData: {
        userId: string;
        username: string | null;
        email: string;
        headline?: string;
        companies?: string;
        location?: string | null;
        skills?: string[];
        linkedin?: string | null;
        imageUrl?: string | null;
        description?: string;
    };
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
    isBusy: boolean;
};

export function MentorProfileForm({ initialData, onSave, onCancel, isBusy }: MentorProfileFormProps) {
    const [formData, setFormData] = useState({
        userId: initialData.userId,
        name: initialData.username || "",
        email: initialData.email || "",
        headline: initialData.headline || "",
        companies: initialData.companies || "",
        location: initialData.location || "",
        skills: (initialData.skills || []).join(" | "),
        linkedin: initialData.linkedin || "",
        imageUrl: initialData.imageUrl || "",
        description: initialData.description || "",
    });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-slate-300">Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} className="bg-[#111] border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                    <Label className="text-slate-300">Email</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} className="bg-[#111] border-white/10 text-white" />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300">Headline</Label>
                <Input name="headline" value={formData.headline} onChange={handleChange} className="bg-[#111] border-white/10 text-white" />
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300">Companies (separate with | or ,)</Label>
                <Input name="companies" value={formData.companies} onChange={handleChange} className="bg-[#111] border-white/10 text-white" />
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300">Location</Label>
                <Input name="location" value={formData.location} onChange={handleChange} className="bg-[#111] border-white/10 text-white" />
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300">Skills (separate with | or ,)</Label>
                <Input name="skills" value={formData.skills} onChange={handleChange} className="bg-[#111] border-white/10 text-white" />
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300">LinkedIn URL</Label>
                <Input name="linkedin" value={formData.linkedin} onChange={handleChange} className="bg-[#111] border-white/10 text-white" />
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300">Profile image (upload from device)</Label>
                <p className="text-[11px] text-slate-500">
                    Stored in Azure (same as mentor dashboard). JPG/PNG/WebP, max 5MB.
                </p>
                <Input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage || isBusy}
                    onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setUploadError(null);
                        setUploadingImage(true);
                        try {
                            const fd = new FormData();
                            fd.append("image", f);
                            fd.append("userId", formData.userId);
                            const res = await fetch("/api/admin/mentors/profile/upload-image", {
                                method: "POST",
                                body: fd,
                            });
                            const data = (await res.json().catch(() => null)) as { error?: string; imageUrl?: string };
                            if (!res.ok) throw new Error(data?.error || "Upload failed");
                            setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl ?? "" }));
                        } catch (err) {
                            setUploadError(err instanceof Error ? err.message : "Upload failed");
                        } finally {
                            setUploadingImage(false);
                            e.target.value = "";
                        }
                    }}
                    className="bg-[#111] border-white/10 text-white file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border file:border-white/10 file:bg-white/5 file:text-white/80 file:text-xs hover:file:bg-white/10"
                />
                {uploadError ? <p className="text-xs text-red-400">{uploadError}</p> : null}
                {formData.imageUrl ? (
                    <div className="flex items-center gap-4 pt-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={formData.imageUrl}
                            alt="Profile preview"
                            className="w-16 h-16 rounded-2xl border border-white/10 object-cover"
                        />
                        <p className="text-xs text-slate-400">
                            {uploadingImage ? "Uploading…" : "Preview — include when you save changes."}
                        </p>
                    </div>
                ) : (
                    <p className="text-xs text-slate-500">No image yet.</p>
                )}
            </div>

            <div className="space-y-2">
                <Label className="text-slate-300">Bio</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="bg-[#111] border-white/10 text-white" />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button variant="ghost" onClick={onCancel} disabled={isBusy} className="text-slate-400 hover:text-white">Cancel</Button>
                <Button
                    onClick={() =>
                        onSave({
                            userId: formData.userId,
                            name: formData.name,
                            email: formData.email,
                            headline: formData.headline,
                            companies: formData.companies,
                            location: formData.location || null,
                            skills: formData.skills
                                .split(/[,|]/g)
                                .map((s) => s.trim())
                                .filter(Boolean),
                            linkedin: formData.linkedin || null,
                            imageUrl: formData.imageUrl || null,
                            description: formData.description,
                        })
                    }
                    disabled={isBusy}
                    className="bg-primary text-black hover:bg-primary/90"
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
