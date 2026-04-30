"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import { cn } from "@/lib/utils";

type TocItem = { id: string; label: string; depth: number };
type CoursePage = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  toc?: TocItem[];
  content: Record<string, unknown>;
};
type CourseChapter = { id: string; title: string; pages: CoursePage[] };
type Course = { title: string; chapters: CourseChapter[] };

export default function SystemDesignCourseCMSClient() {
  const [course, setCourse] = React.useState<Course | null>(null);
  const [activeSlug, setActiveSlug] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    fetch("/api/learn/system-design")
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        setCourse(d.course as Course);
        setActiveSlug((d.page?.slug as string) || "");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const pages = React.useMemo(() => course?.chapters.flatMap((c) => c.pages) ?? [], [course]);
  const activePage = pages.find((p) => p.slug === activeSlug) ?? pages[0];

  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [StarterKit, Link, Highlight, Image],
    content: activePage?.content ?? { type: "doc", content: [] },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[240px] focus:outline-none",
      },
    },
  });

  React.useEffect(() => {
    if (!editor || !activePage) return;
    editor.commands.setContent(activePage.content ?? { type: "doc", content: [] }, { emitUpdate: false });
  }, [editor, activePage]);

  if (loading) {
    return <div className="p-8 text-sm text-slate-400">Loading System Design course...</div>;
  }
  if (!course || !activePage) {
    return <div className="p-8 text-sm text-slate-400">No published pages yet.</div>;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[300px_1fr_250px]">
      <aside className="border-r border-white/10 bg-[#0b0c14]/90 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{course.title}</p>
        <div className="mt-4 space-y-4">
          {course.chapters.map((chapter) => (
            <div key={chapter.id}>
              <p className="mb-2 text-sm font-semibold text-white">{chapter.title}</p>
              <div className="space-y-1">
                {chapter.pages.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setActiveSlug(page.slug)}
                    className={cn(
                      "block w-full rounded-md px-2 py-1.5 text-left text-sm",
                      page.slug === activePage.slug ? "bg-teal-500/20 text-teal-300" : "text-slate-300 hover:bg-white/5"
                    )}
                  >
                    {page.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main className="p-8">
        <h1 className="text-3xl font-semibold text-white">{activePage.title}</h1>
        {activePage.summary ? <p className="mt-2 text-sm text-slate-400">{activePage.summary}</p> : null}
        <div className="mt-6 rounded-xl border border-white/10 bg-[#0f111a] p-6">
          <EditorContent editor={editor} />
        </div>
      </main>

      <aside className="hidden border-l border-white/10 p-4 xl:block">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">On this page</p>
        <ul className="mt-3 space-y-2">
          {(activePage.toc ?? []).map((item) => (
            <li key={item.id} style={{ paddingLeft: item.depth * 12 }}>
              <a href={`#${item.id}`} className="text-sm text-slate-400 hover:text-teal-300">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
