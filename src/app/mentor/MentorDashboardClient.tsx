"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import MentorCard from "@/components/mentors/MentorCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MentorBlogRichEditor } from "@/components/mentor/MentorBlogRichEditor";
import { BlogSitePreview } from "@/components/mentor/BlogSitePreview";
import { stripHtmlForCount } from "@/lib/blog-plain-text";

type MentorProfile = {
  headline: string;
  companies: string;
  location: string | null;
  description: string;
  skills: string[];
  imageUrl: string | null;
  linkedin: string | null;
  reviewStatus?: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
};

type MentorUser = {
  email: string;
  username: string | null;
  verificationStatus: string;
};

export default function MentorDashboardClient({
  initialUser,
  initialProfile,
}: {
  initialUser: MentorUser;
  initialProfile: MentorProfile;
}) {
  const [tab, setTab] = React.useState<"profile" | "blogs">("profile");
  const [profile, setProfile] = React.useState<MentorProfile>(initialProfile);
  const [lastSavedProfile, setLastSavedProfile] = React.useState<MentorProfile>(initialProfile);
  const [saving, setSaving] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [blogTitle, setBlogTitle] = React.useState("");
  const [blogBanner, setBlogBanner] = React.useState("");
  const [blogCategory, setBlogCategory] = React.useState("");
  const [blogTags, setBlogTags] = React.useState("");
  const [blogSeoDescription, setBlogSeoDescription] = React.useState("");
  const [blogSeoKeywords, setBlogSeoKeywords] = React.useState("");
  const [blogBody, setBlogBody] = React.useState("");
  const [uploadingBanner, setUploadingBanner] = React.useState(false);
  const [blogSaving, setBlogSaving] = React.useState(false);
  const [lastSubmittedBlog, setLastSubmittedBlog] = React.useState({
    title: "",
    banner: "",
    category: "",
    tags: "",
    seoDescription: "",
    seoKeywords: "",
    body: "",
  });
  const [myBlogs, setMyBlogs] = React.useState<
    { id: number; title: string; status: string; rejectionReason: string | null; publishDate: string }[]
  >([]);
  const [loadingMyBlogs, setLoadingMyBlogs] = React.useState(false);

  const normalizeProfile = React.useCallback((p: MentorProfile): MentorProfile => {
    const companies = (p.companies || "").trim();
    const headline = (p.headline || "").trim();
    const description = (p.description || "").trim();
    const location = (p.location || "").trim();
    const linkedin = (p.linkedin || "").trim();
    const imageUrl = (p.imageUrl || "").trim();
    const skills = Array.isArray(p.skills)
      ? p.skills.map((s) => String(s).trim()).filter(Boolean)
      : [];

    return {
      headline,
      companies,
      location: location ? location : null,
      description,
      skills,
      imageUrl: imageUrl ? imageUrl : null,
      linkedin: linkedin ? linkedin : null,
      reviewStatus: p.reviewStatus,
      rejectionReason: p.rejectionReason ?? null,
    };
  }, []);

  const isProfileDirty = React.useMemo(() => {
    const a = normalizeProfile(profile);
    const b = normalizeProfile(lastSavedProfile);
    return JSON.stringify(a) !== JSON.stringify(b);
  }, [lastSavedProfile, normalizeProfile, profile]);

  const saveProfile = async () => {
    setSaving(true);
    setStatus(null);
    setError(null);
    try {
      if (!isProfileDirty) {
        setStatus("No changes to save.");
        return;
      }
      const res = await fetch("/api/mentor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: profile.headline,
          companies: profile.companies,
          location: profile.location,
          description: profile.description,
          skills: profile.skills.filter(Boolean),
          imageUrl: profile.imageUrl,
          linkedin: profile.linkedin,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | {
            error?: string;
            profile?: { reviewStatus?: string; rejectionReason?: string | null };
            email?: { sent: boolean; reason?: string; detail?: string };
            teamEmail?: { sent: boolean; reason?: string; detail?: string };
          }
        | null;
      if (!res.ok) throw new Error(data?.error || "Failed to save");
      let msg = "Profile updated and sent for admin review.";
      if (data?.email && !data.email.sent) {
        const hint =
          data.email.reason === "missing_template_id"
            ? "Set SENDGRID_MENTOR_PROFILE_SUBMITTED_TEMPLATE_ID on the server."
            : data.email.reason === "no_api_key"
              ? "Set SENDGRID_API_KEY or SendGridDevKey on the server."
              : data.email.detail || "Check SendGrid / MAIL_FROM.";
        msg += ` Confirmation email was not sent (${hint})`;
      }
      if (data?.teamEmail && !data.teamEmail.sent) {
        const th =
          data.teamEmail.reason === "no_api_key"
            ? "Team notify skipped (no SendGrid key)."
            : data.teamEmail.detail || "Team notify failed.";
        msg += ` ${th}`;
      }
      setStatus(msg);
      setProfile((p) => ({
        ...p,
        reviewStatus: (data?.profile?.reviewStatus as any) || "PENDING_REVIEW",
        rejectionReason: data?.profile?.rejectionReason ?? null,
      }));
      setLastSavedProfile(normalizeProfile(profile));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const submitBlog = async (action: "DRAFT" | "PENDING_REVIEW") => {
    setBlogSaving(true);
    setStatus(null);
    setError(null);
    try {
      const normalizeBlog = (b: {
        title: string;
        banner: string;
        category: string;
        tags: string;
        seoDescription: string;
        seoKeywords: string;
        body: string;
      }) => ({
        title: (b.title || "").trim(),
        banner: (b.banner || "").trim(),
        category: (b.category || "").trim(),
        tags: (b.tags || "").trim(),
        seoDescription: (b.seoDescription || "").trim(),
        seoKeywords: (b.seoKeywords || "").trim(),
        body: (b.body || "").trim(),
      });

      const current = normalizeBlog({
        title: blogTitle,
        banner: blogBanner,
        category: blogCategory,
        tags: blogTags,
        seoDescription: blogSeoDescription,
        seoKeywords: blogSeoKeywords,
        body: blogBody,
      });
      const baseline = normalizeBlog(lastSubmittedBlog);
      const isBlogDirty = JSON.stringify(current) !== JSON.stringify(baseline);

      if (!isBlogDirty) {
        setStatus("No new blog content to submit.");
        return;
      }

      if (!current.title || !current.body) {
        throw new Error("Please add at least a title and content before submitting.");
      }
      if (stripHtmlForCount(current.body).length < 50) {
        throw new Error(
          "Blog content must be at least 50 characters of text (formatting doesn’t count toward this minimum)."
        );
      }

      const res = await fetch("/api/mentor/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: current.title,
          bannerImageLink: current.banner || null,
          category: current.category || "",
          tags: current.tags || "",
          seoDescription: current.seoDescription || "",
          seoKeywords: current.seoKeywords || "",
          descriptionDetails: current.body,
          status: action,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Failed to submit blog");
      setStatus(
        action === "DRAFT"
          ? "Blog saved as draft."
          : "Blog submitted. It will appear on the site once admin approves it."
      );
      setBlogTitle("");
      setBlogBanner("");
      setBlogCategory("");
      setBlogTags("");
      setBlogSeoDescription("");
      setBlogSeoKeywords("");
      setBlogBody("");
      setLastSubmittedBlog({
        title: "",
        banner: "",
        category: "",
        tags: "",
        seoDescription: "",
        seoKeywords: "",
        body: "",
      });
      await refreshMyBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit blog");
    } finally {
      setBlogSaving(false);
    }
  };

  const refreshMyBlogs = React.useCallback(async () => {
    setLoadingMyBlogs(true);
    try {
      const res = await fetch("/api/mentor/blogs", { method: "GET" });
      const data = (await res.json().catch(() => null)) as any;
      if (!res.ok) throw new Error(data?.error || "Failed to load blogs");
      setMyBlogs(Array.isArray(data?.blogs) ? data.blogs : []);
    } catch {
      // silent (dashboard still usable)
    } finally {
      setLoadingMyBlogs(false);
    }
  }, []);

  React.useEffect(() => {
    if (tab === "blogs") {
      refreshMyBlogs();
    }
  }, [refreshMyBlogs, tab]);

  const [skillsInput, setSkillsInput] = React.useState(profile.skills.join(" | "));

  const isBlogDirty = React.useMemo(() => {
    const normalizeBlog = (b: {
      title: string;
      banner: string;
      category: string;
      tags: string;
      seoDescription: string;
      seoKeywords: string;
      body: string;
    }) => ({
      title: (b.title || "").trim(),
      banner: (b.banner || "").trim(),
      category: (b.category || "").trim(),
      tags: (b.tags || "").trim(),
      seoDescription: (b.seoDescription || "").trim(),
      seoKeywords: (b.seoKeywords || "").trim(),
      body: (b.body || "").trim(),
    });
    const current = normalizeBlog({
      title: blogTitle,
      banner: blogBanner,
      category: blogCategory,
      tags: blogTags,
      seoDescription: blogSeoDescription,
      seoKeywords: blogSeoKeywords,
      body: blogBody,
    });
    const baseline = normalizeBlog(lastSubmittedBlog);
    return JSON.stringify(current) !== JSON.stringify(baseline);
  }, [
    blogBanner,
    blogBody,
    blogCategory,
    blogSeoDescription,
    blogSeoKeywords,
    blogTags,
    blogTitle,
    lastSubmittedBlog,
  ]);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="inline-flex rounded-full bg-[#050505]/80 border border-white/10 p-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
        <button
          type="button"
          onClick={() => setTab("profile")}
          className={`px-4 py-2 rounded-full ${
            tab === "profile" ? "bg-primary text-slate-950" : "text-slate-300"
          }`}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => setTab("blogs")}
          className={`px-4 py-2 rounded-full ${
            tab === "blogs" ? "bg-primary text-slate-950" : "text-slate-300"
          }`}
        >
          Blogs
        </button>
      </div>

      {status && <p className="text-sm text-emerald-300">{status}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {tab === "profile" && (
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
          {/* Edit form */}
          <div className="space-y-4">
            {profile.reviewStatus === "REJECTED" && profile.rejectionReason ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-xs text-red-100">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200/90 mb-1">
                  Profile rejected (fix and resubmit)
                </p>
                <p className="leading-relaxed">{profile.rejectionReason}</p>
              </div>
            ) : profile.reviewStatus === "PENDING_REVIEW" ? (
              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-xs text-amber-100">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/90 mb-1">
                  Profile pending review
                </p>
                <p className="leading-relaxed">
                  An admin will review your profile before it appears on the main site.
                </p>
              </div>
            ) : profile.reviewStatus === "APPROVED" ? (
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-xs text-emerald-100">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200/90 mb-1">
                  Profile approved
                </p>
                <p className="leading-relaxed">
                  Your profile is approved. Admin will publish you on the site when ready.
                </p>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Headline
                </label>
                <Input
                  value={profile.headline}
                  onChange={(e) => setProfile((p) => ({ ...p, headline: e.target.value }))}
                  placeholder="e.g. SDE 2 at Microsoft"
                  className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Companies line
                </label>
                <Input
                  value={profile.companies}
                  onChange={(e) => setProfile((p) => ({ ...p, companies: e.target.value }))}
                  placeholder="e.g. Google | Amazon | Uber"
                  className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Location
                </label>
                <Input
                  value={profile.location ?? ""}
                  onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value || null }))}
                  placeholder="City, Country"
                  className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  LinkedIn URL
                </label>
                <Input
                  value={profile.linkedin ?? ""}
                  onChange={(e) => setProfile((p) => ({ ...p, linkedin: e.target.value || null }))}
                  placeholder="https://linkedin.com/in/username"
                  className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Skills (separate with , or |)
              </label>
              <Input
                value={skillsInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSkillsInput(value);
                  setProfile((p) => ({
                    ...p,
                    skills: value
                      .split(/[,|]/g)
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }));
                }}
                placeholder="DSA | Python | System Design | Backend"
                className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Short bio (shown on mentor card)
              </label>
              <Textarea
                value={profile.description}
                onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
                rows={5}
                placeholder="Describe your background and what you help mentees with..."
                className="rounded-2xl border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Profile image (upload)
              </label>
              <div className="flex flex-col gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setUploadingImage(true);
                    try {
                      setError(null);
                      const fd = new FormData();
                      fd.append("image", f);
                      const res = await fetch("/api/mentor/profile/upload-image", {
                        method: "POST",
                        body: fd,
                      });
                      const data = await res.json().catch(() => null);
                      if (!res.ok) throw new Error(data?.error || "Image upload failed");
                      setProfile((p) => ({ ...p, imageUrl: data.imageUrl ?? null }));
                      setStatus("Image uploaded. Save profile to submit for review.");
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Image upload failed");
                    } finally {
                      setUploadingImage(false);
                    }
                  }}
                  className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border file:border-white/10 file:bg-white/5 file:text-white/80 file:text-xs hover:file:bg-white/10"
                />

                {profile.imageUrl ? (
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.imageUrl}
                      alt="Mentor profile"
                      className="w-14 h-14 rounded-2xl border border-white/10 object-cover"
                    />
                    <p className="text-xs text-slate-400 truncate">
                      {uploadingImage ? "Uploading..." : "Preview updated (save to submit)."}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Upload an image to preview it here.</p>
                )}
              </div>
            </div>

            <Button
              type="button"
              disabled={saving || !isProfileDirty}
              onClick={saveProfile}
              className="mt-2 w-full justify-center rounded-full bg-primary text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-950 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : isProfileDirty ? "Save profile" : "Saved"}
            </Button>
          </div>

          {/* Preview card */}
          <div className="mt-6 md:mt-0">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Public card preview
            </p>
            <MentorCard
              name={initialUser.username || initialUser.email}
              headline={profile.headline || "Mentor"}
              companies={profile.companies}
              location={profile.location}
              joined={new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              ratingAvg={0}
              ratingCount={0}
              description={
                profile.description ||
                "Mentorship focused on interview prep, system design, and practical engineering skills."
              }
              skills={profile.skills}
              isVerified={initialUser.verificationStatus === "VERIFIED"}
              image={profile.imageUrl}
              linkedin={profile.linkedin}
            />
          </div>
        </div>
      )}

      {tab === "blogs" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Submit a blog</h2>
          <p className="text-xs md:text-sm text-muted-foreground">
            Blogs you submit will go to Admin/Super Admin for review. Only approved blogs appear on the
            public site.
          </p>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Title
              </label>
              <Input
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="Blog title"
                className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Banner image (upload, optional)
              </label>
              <div className="flex flex-col gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  disabled={uploadingBanner}
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setUploadingBanner(true);
                    try {
                      setError(null);
                      const fd = new FormData();
                      fd.append("image", f);
                      const res = await fetch("/api/uploads/blog-banner", {
                        method: "POST",
                        body: fd,
                      });
                      const data = await res.json().catch(() => null);
                      if (!res.ok) throw new Error(data?.error || "Banner upload failed");
                      setBlogBanner(data?.imageUrl ?? "");
                      setStatus("Banner uploaded.");
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Banner upload failed");
                    } finally {
                      setUploadingBanner(false);
                    }
                  }}
                  className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white
                    file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border file:border-white/10 file:bg-white/5 file:text-white/80 file:text-xs hover:file:bg-white/10"
                />

                {blogBanner ? (
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blogBanner}
                      alt="Blog banner preview"
                      className="w-16 h-16 rounded-2xl border border-white/10 object-cover"
                    />
                    <p className="text-xs text-slate-400 truncate">
                      {uploadingBanner ? "Uploading..." : "Preview ready"}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Optional: upload a banner image.</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Content
              </label>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Use the toolbar for headings, colors, font size, alignment, lists, links, and more. The
                preview on the right matches the public blog page (desktop). On smaller screens, scroll
                down to see the preview.
              </p>
              <div className="flex flex-col xl:flex-row gap-6 items-start">
                <div className="flex-1 min-w-0 w-full space-y-2">
                  <MentorBlogRichEditor value={blogBody} onChange={setBlogBody} />
                  <p className="text-[10px] text-slate-500">
                    Plain text length: {stripHtmlForCount(blogBody).length} / 50 min
                  </p>
                </div>
                <div className="w-full xl:w-[min(100%,420px)] xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:sticky xl:top-24 shrink-0">
                  <BlogSitePreview
                    title={blogTitle}
                    bannerUrl={blogBanner}
                    authorName={initialUser.username?.trim() || initialUser.email}
                    html={blogBody}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Category
              </label>
              <Input
                value={blogCategory}
                onChange={(e) => setBlogCategory(e.target.value)}
                placeholder="technology / career / algorithms / tutorials"
                className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Tags (comma separated)
              </label>
              <Input
                value={blogTags}
                onChange={(e) => setBlogTags(e.target.value)}
                placeholder="React, Node.js, DSA"
                className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                SEO Keywords (comma separated)
              </label>
              <Input
                value={blogSeoKeywords}
                onChange={(e) => setBlogSeoKeywords(e.target.value)}
                placeholder="system design, interview prep, backend"
                className="h-10 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                SEO Description
              </label>
              <Textarea
                value={blogSeoDescription}
                onChange={(e) => setBlogSeoDescription(e.target.value)}
                rows={3}
                maxLength={160}
                placeholder="Brief description for search engines (max 160 chars)"
                className="rounded-2xl border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
              />
              <div className="text-xs text-right text-slate-500">{blogSeoDescription.length} / 160</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={blogSaving || !isBlogDirty}
                onClick={() => submitBlog("DRAFT")}
                className="w-full sm:w-auto border-white/20 bg-transparent text-white hover:bg-white/5 rounded-full"
              >
                {blogSaving ? "Saving..." : "Save Draft"}
              </Button>
              <Button
                type="button"
                disabled={blogSaving || !isBlogDirty}
                onClick={() => submitBlog("PENDING_REVIEW")}
                className="w-full sm:w-auto justify-center rounded-full bg-primary text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-950 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {blogSaving ? "Submitting..." : isBlogDirty ? "Submit blog for review" : "Submitted"}
              </Button>
            </div>
          </div>

          <div className="pt-8 space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Your submissions</h3>
                <p className="text-xs text-slate-400">Track review status and see rejection reasons.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/5"
                onClick={refreshMyBlogs}
                disabled={loadingMyBlogs}
              >
                Refresh
              </Button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#050505]/70 overflow-hidden">
              <div className="divide-y divide-white/5">
                {(myBlogs?.length ?? 0) === 0 ? (
                  <div className="px-5 py-8 text-xs text-slate-500 text-center">
                    {loadingMyBlogs ? "Loading..." : "No blog submissions yet."}
                  </div>
                ) : (
                  myBlogs.slice(0, 10).map((b) => (
                    <div key={b.id} className="px-5 py-4 space-y-2 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{b.title}</p>
                          <p className="text-[11px] text-slate-400">
                            Submitted {new Date(b.publishDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge
                            label={b.status}
                            tone={
                              b.status === "PUBLISHED"
                                ? "success"
                                : b.status === "REJECTED"
                                  ? "danger"
                                  : b.status === "PENDING_REVIEW"
                                    ? "warning"
                                    : "default"
                            }
                          />
                        </div>
                      </div>
                      {b.status === "REJECTED" && b.rejectionReason ? (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-100">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200/90 mb-1">
                            Rejection reason
                          </p>
                          <p className="leading-relaxed">{b.rejectionReason}</p>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

