"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type BlogStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";

type BlogForReview = {
  id: number;
  title: string;
  bannerImageLink: string | null;
  authorName: string;
  publishDate: string;
  status: BlogStatus;
  reviewStatus: string;
  likes: number;
  category?: string;
  tags?: string[];
  seoDescription?: string;
  seoKeywords?: string[];
  descriptionDetails: string;
};

async function setBlogStatus(id: number, status: BlogStatus) {
  const res = await fetch("/api/admin/blogs/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Failed to update blog status");
}

async function rejectBlog(id: number, reason: string) {
  const res = await fetch("/api/admin/blogs/reject", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, reason }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || "Failed to reject blog");
}

export default function BlogReviewClient({ blog }: { blog: BlogForReview }) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<BlogStatus>(blog.status);
  const [busy, setBusy] = useState(false);

  const canApprove = currentStatus === "PENDING_REVIEW";
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const statusTone = useMemo(() => {
    if (currentStatus === "PUBLISHED") return "success";
    if (currentStatus === "REJECTED") return "danger";
    if (currentStatus === "PENDING_REVIEW") return "warning";
    return "default";
  }, [currentStatus]);

  const publish = async () => {
    setBusy(true);
    try {
      await setBlogStatus(blog.id, "PUBLISHED");
      setCurrentStatus("PUBLISHED");
      toast.success("Approved and published.");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update blog");
    } finally {
      setBusy(false);
    }
  };

  const confirmReject = async () => {
    setBusy(true);
    try {
      await rejectBlog(blog.id, rejectReason.trim());
      setCurrentStatus("REJECTED");
      toast.success("Blog rejected.");
      router.refresh();
      setRejectOpen(false);
      setRejectReason("");
    } catch (e: any) {
      toast.error(e?.message || "Failed to reject blog");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Review"
        description="Review the content and then publish or reject with a message."
        backHref="/admin/blogs"
        backLabel="Blogs"
        action={
          <div className="flex flex-wrap items-center gap-2">
            {canApprove && (
              <>
                <Button
                  type="button"
                  className="rounded-full bg-primary text-black hover:bg-primary/90"
                  disabled={busy}
                  onClick={publish}
                >
                  Approve &amp; publish
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full border-red-500/30 bg-transparent text-red-200 hover:bg-red-500/10"
                  disabled={busy}
                  onClick={() => setRejectOpen(true)}
                >
                  Reject
                </Button>
              </>
            )}
            {currentStatus === "PUBLISHED" && (
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/5"
              >
                <Link href={`/blogs/${blog.id}`} target="_blank" rel="noopener noreferrer">
                  View on website
                </Link>
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge label={currentStatus} tone={statusTone as any} />
        {blog.reviewStatus ? <StatusBadge label={blog.reviewStatus} tone="default" /> : null}
        <span className="text-xs text-slate-400">
          • {blog.authorName} • {new Date(blog.publishDate).toLocaleDateString()}
          {blog.likes ? ` • ${blog.likes} likes` : ""}
        </span>
      </div>

      {blog.bannerImageLink ? (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#050505]/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={blog.bannerImageLink} alt={blog.title} className="w-full max-h-[360px] object-cover" />
        </div>
      ) : null}

      <div className="rounded-3xl border border-white/10 bg-[#050505]/60 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">{blog.title}</h2>

        <div className="mb-6 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-1">Category</p>
            <p className="text-sm text-white">{blog.category || "—"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-1">SEO Description</p>
            <p className="text-sm text-white">{blog.seoDescription || "—"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-1">Tags</p>
            {(blog.tags?.length ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-2">
                {blog.tags!.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.18em] text-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white">—</p>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-1">SEO Keywords</p>
            {(blog.seoKeywords?.length ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-2">
                {blog.seoKeywords!.map((k) => (
                  <span key={k} className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.18em] text-slate-200">
                    {k}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white">—</p>
            )}
          </div>
        </div>

        <div className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-strong:text-white/90 prose-img:rounded-2xl prose-img:border prose-img:border-white/10">
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: blog.descriptionDetails }} />
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="bg-[#050505] border-white/10 text-white max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="text-xl">Reject blog</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-slate-400">
              Write a short reason. This will be visible to the mentor in their dashboard.
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={5}
              placeholder="e.g. Add more explanation in section 2 and include code examples."
              className="rounded-2xl border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/5"
                onClick={() => setRejectOpen(false)}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-full bg-red-500 text-white hover:bg-red-500/90"
                onClick={confirmReject}
                disabled={busy || rejectReason.trim().length < 3}
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

