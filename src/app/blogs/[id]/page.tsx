import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ThumbsUp } from "lucide-react";
import {
  getAllBlogs,
  getBlogById,
  formatBlogDate,
  getAuthorDisplayName,
} from "@/lib/blogs";
import { sanitizeBlogHtml } from "@/lib/blog-html-sanitize";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface BlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const blog = Number.isNaN(id) ? undefined : await getBlogById(id);

  if (!blog) {
    return {
      title: "Blog | MADAlgos",
    };
  }

  const author = getAuthorDisplayName(blog);
  const date = formatBlogDate(blog.publishDate);

  return {
    title: `${blog.title} | MADAlgos`,
    description: `${blog.title} — a MADAlgos blog by ${author}${
      date ? `, published on ${date}` : ""
    }.`,
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    notFound();
  }

  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  const author = getAuthorDisplayName(blog);
  const date = formatBlogDate(blog.publishDate);
  const safeBody = sanitizeBlogHtml(blog.descriptionDetails || "");

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased font-sans selection:bg-primary/30">
      <Header />
      <main className="pt-24 md:pt-28 pb-20 px-4 md:px-6">
        <article className="max-w-5xl mx-auto">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to all blogs
          </Link>

          <header className="space-y-4 mb-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
              MadAlgos Blog
            </p>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  {author.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
                    {author}
                  </span>
                  {date && (
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3" />
                      {date}
                    </span>
                  )}
                </div>
              </div>
              {blog.likes > 0 && (
                <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                  <ThumbsUp className="h-3 w-3" />
                  {blog.likes} liked this
                </div>
              )}
            </div>
          </header>

          {blog.bannerImageLink && (
            <div className="mb-10 overflow-hidden rounded-3xl border border-white/5 bg-slate-950/60 shadow-[0_28px_80px_rgba(0,0,0,0.7)]">
              <div className="relative h-64 md:h-80 w-full">
                <Image
                  src={blog.bannerImageLink}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>
            </div>
          )}

          <section className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary prose-strong:text-white/90 prose-img:rounded-2xl prose-img:border prose-img:border-white/10">
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: safeBody }} />
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

