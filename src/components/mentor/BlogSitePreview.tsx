"use client";

import React from "react";
import { Clock } from "lucide-react";
import { sanitizeBlogHtml } from "@/lib/blog-html-sanitize";

type BlogSitePreviewProps = {
  title: string;
  bannerUrl: string;
  authorName: string;
  html: string;
};

/**
 * Mirrors `/blogs/[id]` article layout so mentors see how the post will look on the public site.
 */
export function BlogSitePreview({ title, bannerUrl, authorName, html }: BlogSitePreviewProps) {
  const safe = React.useMemo(() => sanitizeBlogHtml(html || ""), [html]);
  const displayTitle = title.trim() || "Your blog title";
  const author = authorName.trim() || "Author";
  const initials = author.charAt(0).toUpperCase();

  return (
    <div className="rounded-3xl border border-white/10 bg-[#050505]/80 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
      <div className="border-b border-white/10 px-5 py-3 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">Live preview</p>
        <span className="text-[10px] text-slate-500">Same styles as public blog page</span>
      </div>

      <article className="max-w-none px-5 sm:px-8 pb-8 pt-6">
        <header className="space-y-4 mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">MadAlgos Blog</p>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">{displayTitle}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">{author}</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="h-3 w-3" />
                  Preview
                </span>
              </div>
            </div>
          </div>
        </header>

        {bannerUrl ? (
          <div className="mb-8 overflow-hidden rounded-3xl border border-white/5 bg-slate-950/60">
            <div className="relative h-48 md:h-56 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
          </div>
        ) : null}

        <section className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-strong:text-white/90 prose-img:rounded-2xl prose-img:border prose-img:border-white/10">
          {safe ? (
            // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{ __html: safe }} />
          ) : (
            <p className="text-sm text-slate-500 not-prose">
              Start writing in the editor — your formatted content will appear here.
            </p>
          )}
        </section>
      </article>
    </div>
  );
}
