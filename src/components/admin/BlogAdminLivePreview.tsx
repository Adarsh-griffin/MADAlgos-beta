"use client";

import React, { useMemo } from "react";
import { sanitizeBlogHtml } from "@/lib/blog-html-sanitize";

const CATEGORY_LABEL: Record<string, string> = {
  technology: "Technology",
  career: "Career Advice",
  algorithms: "Algorithms",
  tutorials: "Tutorials",
};

function tagList(tags: string): string[] {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}

type BlogAdminLivePreviewProps = {
  title: string;
  thumbnail: string;
  category: string;
  tags: string;
  contentHtml: string;
};

/**
 * Renders a read-only preview matching the public /blogs/[id] article layout (sanitized HTML).
 */
export function BlogAdminLivePreview({
  title,
  thumbnail,
  category,
  tags,
  contentHtml,
}: BlogAdminLivePreviewProps) {
  const safeBody = useMemo(() => sanitizeBlogHtml(contentHtml), [contentHtml]);
  const tagItems = useMemo(() => tagList(tags), [tags]);
  const categoryLabel = category ? CATEGORY_LABEL[category] ?? category : "";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#080808] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary/90">
          Live preview
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Matches public blog styling (sanitized). Not saved until you save the post.
        </p>
      </div>

      <article className="p-5 md:p-6 max-h-[min(75vh,900px)] overflow-y-auto">
        <header className="space-y-3 mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
            MadAlgos Blog
          </p>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white leading-tight">
            {title.trim() || "Untitled post"}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-slate-400 border border-white/10">
              Draft preview
            </span>
            {categoryLabel ? (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary border border-primary/25">
                {categoryLabel}
              </span>
            ) : null}
            {tagItems.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white/5 px-2 py-0.5 text-slate-400 border border-white/5"
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        {thumbnail ? (
          <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt=""
              className="w-full h-44 md:h-52 object-cover"
            />
            <div className="pointer-events-none h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        ) : null}

        {safeBody.trim() ? (
          <section className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-strong:text-white/90 prose-img:rounded-2xl prose-img:border prose-img:border-white/10 text-sm md:text-base">
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: safeBody }} />
          </section>
        ) : (
          <p className="text-sm text-slate-500 italic py-8 text-center border border-dashed border-white/10 rounded-xl">
            Content will appear here as you write in the editor.
          </p>
        )}
      </article>
    </div>
  );
}
