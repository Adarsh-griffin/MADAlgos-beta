"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { Extension, Node } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import {
  Plus,
  Save,
  Sparkles,
  ImagePlus,
  Upload,
  GripVertical,
  History,
  RefreshCw,
  Menu,
  X,
  ArrowLeft,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Link2,
  Unlink2,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eraser,
  TableProperties,
  Rows3,
  Columns3,
  Trash2,
  FileDown,
  ScissorsLineDashed,
} from "lucide-react";

type TocItem = { id: string; label: string; depth: number };
type PageNode = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  order: number;
  published: boolean;
  content: Record<string, unknown>;
  toc?: TocItem[];
};
type ChapterNode = { id: string; title: string; order: number; pages: PageNode[] };
type CourseNode = { title: string; chapters: ChapterNode[] };
type VersionItem = { id: string; savedAt: string; savedBy: string };
type Permissions = { canEdit: boolean; canPublish: boolean; canRestoreVersions: boolean };

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeOrders(course: CourseNode): CourseNode {
  return {
    ...course,
    chapters: course.chapters.map((chapter, chapterIdx) => ({
      ...chapter,
      order: chapterIdx,
      pages: chapter.pages.map((page, pageIdx) => ({ ...page, order: pageIdx })),
    })),
  };
}

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: { fontSize?: string | null }) =>
              attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

const PageBreak = Node.create({
  name: "pageBreak",
  group: "block",
  selectable: true,
  parseHTML() {
    return [{ tag: "hr[data-page-break='true']" }];
  },
  renderHTML() {
    return ["hr", { "data-page-break": "true", class: "page-break-marker" }];
  },
  addCommands() {
    return {
      insertPageBreak:
        () =>
        ({ chain }) =>
          chain().insertContent({ type: this.name }).run(),
    };
  },
});

export function SystemDesignBuilder() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const [ok, setOk] = React.useState<string>("");
  const [versions, setVersions] = React.useState<VersionItem[]>([]);
  const [permissions, setPermissions] = React.useState<Permissions>({
    canEdit: true,
    canPublish: false,
    canRestoreVersions: false,
  });
  const [course, setCourse] = React.useState<CourseNode>({ title: "System Design", chapters: [] });
  const [previewMobileNavOpen, setPreviewMobileNavOpen] = React.useState(false);
  const [editorFullscreen, setEditorFullscreen] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(true);
  const [wordLayout, setWordLayout] = React.useState(true);
  const [fontFamilyValue, setFontFamilyValue] = React.useState("Inter");
  const [fontSizeValue, setFontSizeValue] = React.useState("16px");
  const [printHeaderTemplate, setPrintHeaderTemplate] = React.useState("{{title}}");
  const [printFooterTemplate, setPrintFooterTemplate] = React.useState("Page {{page}} of {{total}}");
  const [focusTitleOnNextPaint, setFocusTitleOnNextPaint] = React.useState(false);
  const [previewReadProgress, setPreviewReadProgress] = React.useState(0);
  const [previewActiveHeading, setPreviewActiveHeading] = React.useState("");
  const [active, setActive] = React.useState<{ chapterIdx: number; pageIdx: number }>({
    chapterIdx: 0,
    pageIdx: 0,
  });
  const previewScrollDesktopRef = React.useRef<HTMLDivElement>(null);
  const previewScrollMobileRef = React.useRef<HTMLDivElement>(null);
  const previewFrameRef = React.useRef<HTMLDivElement>(null);
  const workbenchRef = React.useRef<HTMLDivElement>(null);
  const pageTitleInputRef = React.useRef<HTMLInputElement>(null);

  const getPreviewScrollRoot = React.useCallback(() => {
    const useDesktop = typeof window !== "undefined" && window.matchMedia("(min-width: 1280px)").matches;
    return useDesktop ? previewScrollDesktopRef.current : previewScrollMobileRef.current;
  }, []);

  React.useEffect(() => {
    let mounted = true;
    fetch("/api/admin/system-design/course")
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        const next = d?.course as CourseNode | undefined;
        if (next?.chapters?.length) {
          setCourse(next);
          setActive({ chapterIdx: 0, pageIdx: 0 });
        }
        setVersions(Array.isArray(d?.versions) ? (d.versions as VersionItem[]) : []);
        if (d?.permissions) setPermissions(d.permissions as Permissions);
      })
      .catch(() => {
        if (!mounted) return;
        setError("Could not load the course builder.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const activePage = course.chapters[active.chapterIdx]?.pages[active.pageIdx];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ history: true }),
      Placeholder.configure({ placeholder: "Type / start building this lesson page..." }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Underline,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      PageBreak,
    ],
    content: activePage?.content ?? { type: "doc", content: [] },
    editorProps: {
      attributes: {
        class:
          "min-h-[360px] rounded-xl border border-white/10 bg-[#0f1119] p-4 focus:outline-none [&_mark]:rounded-sm [&_mark]:bg-yellow-300 [&_mark]:px-1 [&_mark]:text-black [&_.tableWrapper]:overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_th]:border [&_td]:border-white/25 [&_th]:border-white/25 [&_td]:p-2 [&_th]:p-2 [&_.column-resize-handle]:pointer-events-auto [&_.column-resize-handle]:w-[2px] [&_.column-resize-handle]:bg-teal-400 [&_.column-resize-handle]:opacity-80 [&_.selectedCell:after]:border-2 [&_.selectedCell:after]:border-teal-400/70 [&_.resize-cursor]:cursor-col-resize [&_.page-break-marker]:my-6 [&_.page-break-marker]:border-0 [&_.page-break-marker]:border-t-2 [&_.page-break-marker]:border-dashed [&_.page-break-marker]:border-white/30",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (!activePage) return;
      const json = ed.getJSON();
      setCourse((prev) => {
        const next = structuredClone(prev) as CourseNode;
        next.chapters[active.chapterIdx].pages[active.pageIdx].content = json;
        setDirty(true);
        return next;
      });
    },
  });

  const previewEditor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      StarterKit,
      Link,
      Highlight,
      Underline,
      Image,
      TextStyle,
      FontFamily,
      FontSize,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      PageBreak,
    ],
    content: activePage?.content ?? { type: "doc", content: [] },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[220px] focus:outline-none [&_mark]:rounded-sm [&_mark]:bg-yellow-300 [&_mark]:px-1 [&_mark]:text-black [&_.tableWrapper]:overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_th]:border [&_td]:border-white/25 [&_th]:border-white/25 [&_td]:p-2 [&_th]:p-2 [&_.column-resize-handle]:w-[2px] [&_.column-resize-handle]:bg-teal-400 [&_.column-resize-handle]:opacity-80 [&_.page-break-marker]:my-6 [&_.page-break-marker]:border-0 [&_.page-break-marker]:border-t-2 [&_.page-break-marker]:border-dashed [&_.page-break-marker]:border-white/30",
      },
    },
  });

  React.useEffect(() => {
    if (!editor || !activePage) return;
    editor.commands.setContent(activePage.content ?? { type: "doc", content: [] }, { emitUpdate: false });
  }, [editor, activePage]);

  React.useEffect(() => {
    if (!previewEditor || !activePage) return;
    previewEditor.commands.setContent(activePage.content ?? { type: "doc", content: [] }, { emitUpdate: false });
  }, [previewEditor, activePage?.content, activePage]);

  React.useEffect(() => {
    const el = getPreviewScrollRoot();
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setPreviewReadProgress(max <= 0 ? 100 : Math.min(100, Math.round((el.scrollTop / max) * 100)));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activePage?.id, getPreviewScrollRoot]);

  React.useEffect(() => {
    const root = getPreviewScrollRoot();
    if (!root || !activePage?.toc?.length) {
      setPreviewActiveHeading("");
      return;
    }
    const headingNodes = Array.from(root.querySelectorAll("h1, h2, h3, h4")).filter(
      (node): node is HTMLElement => node instanceof HTMLElement
    );
    if (!headingNodes.length) {
      setPreviewActiveHeading(activePage.toc[0]?.id ?? "");
      return;
    }
    const resolveHeadingId = (node: HTMLElement) => {
      const raw = node.textContent?.trim().toLowerCase() ?? "";
      const match = activePage.toc?.find((item) => item.label.trim().toLowerCase() === raw);
      return match?.id ?? "";
    };
    const visibleMap = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = resolveHeadingId(entry.target as HTMLElement);
          if (!id) continue;
          if (entry.isIntersecting) visibleMap.set(id, entry.intersectionRatio);
          else visibleMap.delete(id);
        }
        let bestId = "";
        let bestScore = -1;
        for (const item of activePage.toc ?? []) {
          const score = visibleMap.get(item.id) ?? -1;
          if (score > bestScore) {
            bestScore = score;
            bestId = item.id;
          }
        }
        if (bestId) setPreviewActiveHeading(bestId);
      },
      { root, threshold: [0.25, 0.5, 0.75], rootMargin: "-10% 0px -55% 0px" }
    );
    headingNodes.forEach((node) => observer.observe(node));
    setPreviewActiveHeading(activePage.toc[0]?.id ?? "");
    return () => observer.disconnect();
  }, [activePage, previewEditor, getPreviewScrollRoot]);

  const scrollPreviewToHeading = React.useCallback(
    (headingId: string, label: string) => {
      const root = getPreviewScrollRoot();
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll("h1, h2, h3, h4")).filter(
        (node): node is HTMLElement => node instanceof HTMLElement
      );
      const normalizedLabel = label.trim().toLowerCase();
      const target =
        nodes.find((node) => (node.textContent?.trim().toLowerCase() ?? "") === normalizedLabel) ?? null;
      if (!target) return;
      const rootRect = root.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const top = root.scrollTop + (targetRect.top - rootRect.top) - 18;
      root.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      setPreviewActiveHeading(headingId);
    },
    [getPreviewScrollRoot]
  );

  const toggleEditorFullscreen = React.useCallback(async () => {
    const node = workbenchRef.current;
    if (!node) return;
    if (document.fullscreenElement === node) {
      await document.exitFullscreen().catch(() => null);
      setEditorFullscreen(false);
      return;
    }
    await node.requestFullscreen().catch(() => null);
    setEditorFullscreen(true);
  }, []);

  React.useEffect(() => {
    const onChange = () => {
      const fs = document.fullscreenElement;
      setEditorFullscreen(fs === workbenchRef.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  React.useEffect(() => {
    if (!focusTitleOnNextPaint) return;
    const id = window.requestAnimationFrame(() => {
      pageTitleInputRef.current?.focus();
      pageTitleInputRef.current?.select();
      setFocusTitleOnNextPaint(false);
    });
    return () => window.cancelAnimationFrame(id);
  }, [focusTitleOnNextPaint, active.chapterIdx, active.pageIdx]);

  const mutatePage = (fn: (page: PageNode) => void) => {
    if (!permissions.canEdit) return;
    setCourse((prev) => {
      const next = structuredClone(prev) as CourseNode;
      const page = next.chapters[active.chapterIdx]?.pages[active.pageIdx];
      if (!page) return prev;
      fn(page);
      setDirty(true);
      return next;
    });
  };

  const addChapter = () => {
    if (!permissions.canEdit) return;
    setCourse((prev) => {
      const chapterIdx = prev.chapters.length;
      const pageId = uid("page");
      const next: CourseNode = {
        ...prev,
        chapters: [
          ...prev.chapters,
          {
            id: uid("chapter"),
            title: `New Chapter ${chapterIdx + 1}`,
            order: chapterIdx,
            pages: [
              {
                id: pageId,
                title: "New Page",
                slug: `${pageId}`,
                summary: "",
                order: 0,
                published: false,
                content: { type: "doc", content: [] },
                toc: [],
              },
            ],
          },
        ],
      };
      setActive({ chapterIdx, pageIdx: 0 });
      setFocusTitleOnNextPaint(true);
      setDirty(true);
      return next;
    });
  };

  const addPage = (chapterIdx: number) => {
    if (!permissions.canEdit) return;
    setCourse((prev) => {
      const next = structuredClone(prev) as CourseNode;
      const chapter = next.chapters[chapterIdx];
      if (!chapter) return prev;
      const pageId = uid("page");
      chapter.pages.push({
        id: pageId,
        title: "New Page",
        slug: `${pageId}`,
        summary: "",
        order: chapter.pages.length,
        published: false,
        content: { type: "doc", content: [] },
        toc: [],
      });
      setActive({ chapterIdx, pageIdx: chapter.pages.length - 1 });
      setFocusTitleOnNextPaint(true);
      setDirty(true);
      return normalizeOrders(next);
    });
  };

  const onDragStartPage = (e: React.DragEvent, chapterIdx: number, pageIdx: number) => {
    e.dataTransfer.setData("text/plain", `page:${chapterIdx}:${pageIdx}`);
  };

  const onDragStartChapter = (e: React.DragEvent, chapterIdx: number) => {
    e.dataTransfer.setData("text/plain", `chapter:${chapterIdx}`);
  };

  const ensureChapterHasAtLeastOnePage = (next: CourseNode, chapterIdx: number) => {
    if (next.chapters[chapterIdx]?.pages.length) return;
    const pageId = uid("page");
    next.chapters[chapterIdx].pages.push({
      id: pageId,
      title: "New Page",
      slug: `${pageId}`,
      summary: "",
      order: 0,
      published: false,
      content: { type: "doc", content: [] },
      toc: [],
    });
  };

  const onDropPage = (e: React.DragEvent, chapterIdx: number, pageIdx: number) => {
    e.preventDefault();
    if (!permissions.canEdit) return;
    const raw = e.dataTransfer.getData("text/plain");
    const [kind, fromChapterRaw, fromPageRaw] = raw.split(":");
    if (kind !== "page") return;
    const fromChapter = Number(fromChapterRaw);
    const fromPage = Number(fromPageRaw);
    if (!Number.isFinite(fromChapter) || !Number.isFinite(fromPage)) return;
    if (fromChapter === chapterIdx && fromPage === pageIdx) return;

    setCourse((prev) => {
      const next = structuredClone(prev) as CourseNode;
      const fromPages = next.chapters[fromChapter]?.pages;
      const toPages = next.chapters[chapterIdx]?.pages;
      if (!fromPages || !toPages) return prev;
      const [moved] = fromPages.splice(fromPage, 1);
      if (!moved) return prev;
      const insertAt = Math.max(0, Math.min(pageIdx, toPages.length));
      toPages.splice(insertAt, 0, moved);

      if (active.chapterIdx === fromChapter && active.pageIdx === fromPage) {
        setActive({ chapterIdx, pageIdx: insertAt });
      }
      ensureChapterHasAtLeastOnePage(next, fromChapter);
      setDirty(true);
      return normalizeOrders(next);
    });
  };

  const onDropChapterBody = (e: React.DragEvent, chapterIdx: number) => {
    e.preventDefault();
    if (!permissions.canEdit) return;
    const raw = e.dataTransfer.getData("text/plain");
    const [kind, fromChapterRaw, fromPageRaw] = raw.split(":");
    if (kind !== "page") return;
    const fromChapter = Number(fromChapterRaw);
    const fromPage = Number(fromPageRaw);
    if (!Number.isFinite(fromChapter) || !Number.isFinite(fromPage)) return;

    setCourse((prev) => {
      const next = structuredClone(prev) as CourseNode;
      const fromPages = next.chapters[fromChapter]?.pages;
      const toPages = next.chapters[chapterIdx]?.pages;
      if (!fromPages || !toPages) return prev;
      const [moved] = fromPages.splice(fromPage, 1);
      if (!moved) return prev;
      const insertAt = toPages.length;
      toPages.push(moved);

      if (active.chapterIdx === fromChapter && active.pageIdx === fromPage) {
        setActive({ chapterIdx, pageIdx: insertAt });
      }
      ensureChapterHasAtLeastOnePage(next, fromChapter);
      setDirty(true);
      return normalizeOrders(next);
    });
  };

  const onDropChapter = (e: React.DragEvent, targetChapterIdx: number) => {
    e.preventDefault();
    if (!permissions.canEdit) return;
    const raw = e.dataTransfer.getData("text/plain");
    const [kind, fromChapterRaw] = raw.split(":");
    if (kind !== "chapter") return;
    const fromChapter = Number(fromChapterRaw);
    if (!Number.isFinite(fromChapter) || fromChapter === targetChapterIdx) return;

    setCourse((prev) => {
      const next = structuredClone(prev) as CourseNode;
      const [moved] = next.chapters.splice(fromChapter, 1);
      if (!moved) return prev;
      next.chapters.splice(targetChapterIdx, 0, moved);

      if (active.chapterIdx === fromChapter) {
        setActive({ chapterIdx: targetChapterIdx, pageIdx: active.pageIdx });
      }
      setDirty(true);
      return normalizeOrders(next);
    });
  };

  const insertImage = () => {
    const url = window.prompt("Paste image URL");
    if (!url || !editor) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Paste URL", current ?? "https://");
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: href.trim() }).run();
  };

  const exportPrintDocument = React.useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    const toPrintableTemplate = (template: string) =>
      template
        .replaceAll("{{title}}", activePage?.title || "Document")
        .replaceAll("{{date}}", new Date().toLocaleDateString())
        .replaceAll("{{page}}", "<span class='page-number'></span>")
        .replaceAll("{{total}}", "<span class='total-pages'></span>");

    const headerHtml = toPrintableTemplate(printHeaderTemplate);
    const footerHtml = toPrintableTemplate(printFooterTemplate);
    const win = window.open("", "_blank", "noopener,noreferrer,width=1200,height=900");
    if (!win) return;
    win.document.write(`<!doctype html>
<html>
<head>
  <title>${activePage?.title || "Document"}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f1f3f7; margin: 0; padding: 24px; }
    .page { max-width: 800px; margin: 0 auto; background: #fff; padding: 48px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); color: #111; }
    .print-header, .print-footer { max-width: 800px; margin: 0 auto; color: #444; font-size: 12px; }
    .print-header { margin-bottom: 10px; }
    .print-footer { margin-top: 10px; text-align: right; }
    .page-break-marker { border: 0; border-top: 2px dashed #999; margin: 28px 0; page-break-after: always; break-after: page; }
    table { border-collapse: collapse; width: 100%; margin: 10px 0; }
    td, th { border: 1px solid #bbb; padding: 8px; }
    mark { background: #fde047; color: #111; }
    .page-number::before { content: counter(page); }
    .total-pages::before { content: counter(pages); }
    @media print {
      body { background: #fff; padding: 0; }
      .page, .print-header, .print-footer { box-shadow: none; margin: 0 auto; max-width: none; width: calc(100% - 96px); }
    }
  </style>
</head>
<body>
  <header class="print-header">${headerHtml}</header>
  <article class="page">${html}</article>
  <footer class="print-footer">${footerHtml}</footer>
</body>
</html>`);
    win.document.close();
    win.focus();
    win.print();
  }, [editor, activePage?.title, printHeaderTemplate, printFooterTemplate]);

  const uploadImageFile = React.useCallback(async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/uploads/practice-media", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Image upload failed.");
    return String(data.imageUrl || "");
  }, []);

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const imageUrl = await uploadImageFile(file);
      if (editor && imageUrl) editor.chain().focus().setImage({ src: imageUrl }).run();
      setOk("Image uploaded.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  React.useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom as HTMLElement;

    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"));
      if (!file) return;
      event.preventDefault();
      setUploading(true);
      void uploadImageFile(file)
        .then((imageUrl) => {
          if (!imageUrl) return;
          editor.chain().focus().setImage({ src: imageUrl }).run();
          setOk("Image pasted.");
        })
        .catch((e: unknown) => {
          setError(e instanceof Error ? e.message : "Paste upload failed.");
        })
        .finally(() => setUploading(false));
    };

    const onDrop = (event: DragEvent) => {
      const file = Array.from(event.dataTransfer?.files ?? []).find((f) => f.type.startsWith("image/"));
      if (!file) return;
      event.preventDefault();
      const coords = { left: event.clientX, top: event.clientY };
      const pos = editor.view.posAtCoords(coords);
      setUploading(true);
      void uploadImageFile(file)
        .then((imageUrl) => {
          if (!imageUrl) return;
          editor.chain().focus();
          if (pos?.pos) editor.commands.setTextSelection(pos.pos);
          editor.commands.setImage({ src: imageUrl });
          setOk("Image dropped.");
        })
        .catch((e: unknown) => {
          setError(e instanceof Error ? e.message : "Drop upload failed.");
        })
        .finally(() => setUploading(false));
    };

    dom.addEventListener("paste", onPaste);
    dom.addEventListener("drop", onDrop);
    return () => {
      dom.removeEventListener("paste", onPaste);
      dom.removeEventListener("drop", onDrop);
    };
  }, [editor, uploadImageFile]);

  const saveCourse = React.useCallback(async (autosave = false) => {
    setSaving(true);
    if (!autosave) {
      setError("");
      setOk("");
    }
    try {
      const normalized = normalizeOrders(course);
      const res = await fetch("/api/admin/system-design/course", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", course: normalized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Save failed.");
      setOk(autosave ? "Autosaved." : "Saved successfully.");
      setCourse(data.course as CourseNode);
      setVersions(Array.isArray(data?.versions) ? (data.versions as VersionItem[]) : []);
      if (data?.permissions) setPermissions(data.permissions as Permissions);
      setDirty(false);
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }, [course]);

  React.useEffect(() => {
    if (!dirty || !permissions.canEdit) return;
    const t = window.setTimeout(() => {
      void saveCourse(true);
    }, 2000);
    return () => window.clearTimeout(t);
  }, [dirty, permissions.canEdit, saveCourse]);

  const restoreVersion = async (versionId: string) => {
    if (!permissions.canRestoreVersions) return;
    setSaving(true);
    setError("");
    setOk("");
    try {
      const res = await fetch("/api/admin/system-design/course", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore", versionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Restore failed.");
      setCourse(data.course as CourseNode);
      setVersions(Array.isArray(data?.versions) ? (data.versions as VersionItem[]) : []);
      setOk("Version restored.");
      setDirty(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Restore failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-slate-400">Loading course builder...</div>;
  if (!activePage) return <div className="text-sm text-red-300">No pages found. Add a chapter to begin.</div>;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="rounded-2xl border border-white/10 bg-[#050505]/70 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Course structure</h2>
          <Button size="sm" variant="outline" onClick={addChapter}>
            <Plus className="mr-1 h-4 w-4" /> Chapter
          </Button>
        </div>
        <div className="space-y-3">
          {course.chapters.map((chapter, chapterIdx) => (
            <div
              key={chapter.id}
              className="rounded-xl border border-white/10 bg-white/2 p-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDropChapter(e, chapterIdx)}
            >
              <div className="mb-1 flex items-center gap-1">
                <button
                  type="button"
                  draggable={permissions.canEdit}
                  onDragStart={(e) => onDragStartChapter(e, chapterIdx)}
                  className="rounded p-1 text-slate-500 hover:bg-white/5"
                  title="Drag chapter to reorder"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
              </div>
              <Input
                value={chapter.title}
                onChange={(e) =>
                  setCourse((prev) => {
                    const next = structuredClone(prev) as CourseNode;
                    next.chapters[chapterIdx].title = e.target.value;
                    setDirty(true);
                    return next;
                  })
                }
                className="h-8 border-white/15 bg-[#11131a] text-xs"
              />
              <div className="mt-2 space-y-1" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropChapterBody(e, chapterIdx)}>
                {chapter.pages.map((page, pageIdx) => {
                  const isActive = active.chapterIdx === chapterIdx && active.pageIdx === pageIdx;
                  return (
                    <div key={page.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        draggable={permissions.canEdit}
                        onDragStart={(e) => onDragStartPage(e, chapterIdx, pageIdx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDropPage(e, chapterIdx, pageIdx)}
                        className="rounded p-1 text-slate-500 hover:bg-white/5"
                        title="Drag to reorder"
                      >
                        <GripVertical className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActive({ chapterIdx, pageIdx })}
                        className={cn(
                          "flex-1 truncate rounded-md px-2 py-1.5 text-left text-xs",
                          isActive ? "bg-teal-500/20 text-teal-300" : "text-slate-300 hover:bg-white/5"
                        )}
                      >
                        {page.title}
                      </button>
                    </div>
                  );
                })}
                <Button size="sm" variant="ghost" className="w-full justify-start" onClick={() => addPage(chapterIdx)}>
                  <Plus className="mr-1 h-4 w-4" /> Add page
                </Button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="rounded-2xl border border-white/10 bg-[#050505]/70 p-5">
        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Page title</Label>
            <Input
              ref={pageTitleInputRef}
              value={activePage.title}
              onChange={(e) =>
                mutatePage((page) => {
                  page.title = e.target.value;
                  if (!page.slug || page.slug.startsWith("page-")) {
                    page.slug = toSlug(e.target.value) || page.slug;
                  }
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={activePage.slug} onChange={(e) => mutatePage((page) => (page.slug = toSlug(e.target.value)))} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Summary (optional subtitle/excerpt)</Label>
            <Textarea value={activePage.summary || ""} onChange={(e) => mutatePage((page) => (page.summary = e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Print header template</Label>
            <Input value={printHeaderTemplate} onChange={(e) => setPrintHeaderTemplate(e.target.value)} placeholder="{{title}}" />
          </div>
          <div className="space-y-2">
            <Label>Print footer template</Label>
            <Input
              value={printFooterTemplate}
              onChange={(e) => setPrintFooterTemplate(e.target.value)}
              placeholder="Page {{page}} of {{total}}"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={activePage.published}
              disabled={!permissions.canPublish}
              onCheckedChange={(v) => mutatePage((page) => (page.published = v))}
            />
            <Label>Published {permissions.canPublish ? "" : "(Publisher only)"}</Label>
          </div>
        </div>

        <div className={cn("mb-3 flex flex-wrap items-center gap-2", editorFullscreen && "sticky top-2 z-30 rounded-lg border border-white/10 bg-[#050505]/95 p-2 backdrop-blur")}>
          <select
            value={fontFamilyValue}
            onChange={(e) => {
              const value = e.target.value;
              setFontFamilyValue(value);
              if (!editor) return;
              if (value === "default") editor.chain().focus().unsetFontFamily().run();
              else editor.chain().focus().setFontFamily(value).run();
            }}
            className="h-9 rounded-md border border-white/15 bg-[#11131a] px-2 text-xs text-white"
          >
            <option value="Inter">Inter</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="default">Default</option>
          </select>
          <select
            value={fontSizeValue}
            onChange={(e) => {
              const value = e.target.value;
              setFontSizeValue(value);
              if (!editor) return;
              if (value === "default") (editor.chain().focus() as any).unsetFontSize().run();
              else (editor.chain().focus() as any).setFontSize(value).run();
            }}
            className="h-9 rounded-md border border-white/15 bg-[#11131a] px-2 text-xs text-white"
          >
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="20px">20</option>
            <option value="24px">24</option>
            <option value="28px">28</option>
            <option value="32px">32</option>
            <option value="default">Default</option>
          </select>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Sparkles className="mr-1 h-4 w-4" /> H2
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
            H1
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleBold().run()}>
            <Bold className="mr-1 h-4 w-4" /> Bold
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <Italic className="mr-1 h-4 w-4" /> Italic
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className="mr-1 h-4 w-4" /> Underline
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleStrike().run()}>
            <Strikethrough className="mr-1 h-4 w-4" /> Strike
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <List className="mr-1 h-4 w-4" /> List
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="mr-1 h-4 w-4" /> Ordered
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
            Callout
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().toggleHighlight().run()}>
            Highlight
          </Button>
          <Button size="sm" variant="outline" onClick={setLink}>
            <Link2 className="mr-1 h-4 w-4" /> Link
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().unsetLink().run()}>
            <Unlink2 className="mr-1 h-4 w-4" /> Unlink
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().setTextAlign("justify").run()}>
            <AlignJustify className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}>
            <Eraser className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <TableProperties className="mr-1 h-4 w-4" /> Table
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().addRowAfter().run()}>
            <Rows3 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().addColumnAfter().run()}>
            <Columns3 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().mergeCells().run()}>
            Merge
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().splitCell().run()}>
            Split
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().deleteTable().run()}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => (editor?.chain().focus() as any).insertPageBreak().run()}>
            <ScissorsLineDashed className="mr-1 h-4 w-4" /> Page break
          </Button>
          <Button size="sm" variant="outline" onClick={exportPrintDocument}>
            <FileDown className="mr-1 h-4 w-4" /> Print/PDF
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().undo().run()}>
            <Undo2 className="mr-1 h-4 w-4" /> Undo
          </Button>
          <Button size="sm" variant="outline" onClick={() => editor?.chain().focus().redo().run()}>
            <Redo2 className="mr-1 h-4 w-4" /> Redo
          </Button>
          <Button size="sm" variant="outline" onClick={insertImage}>
            <ImagePlus className="mr-1 h-4 w-4" /> Image
          </Button>
          <label className="inline-flex">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadImage(f);
                e.currentTarget.value = "";
              }}
            />
            <span className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-white/15 px-3 py-1.5 text-sm text-white hover:bg-white/5">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Upload image"}
            </span>
          </label>
          <Button size="sm" variant="outline" onClick={toggleEditorFullscreen}>
            {editorFullscreen ? "Exit editor full screen" : "Editor full screen"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowPreview((v) => !v)}>
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setWordLayout((v) => !v)}>
            {wordLayout ? "Dark canvas" : "Word canvas"}
          </Button>
        </div>

        <div ref={workbenchRef} className={cn("h-[560px] overflow-hidden rounded-xl border border-white/10", editorFullscreen && "h-[92vh]")}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={showPreview ? 50 : 100} minSize={30}>
              <div className="h-full overflow-auto p-2">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Editor</p>
                {wordLayout ? (
                  <div className="rounded-md border border-black/10 bg-[#d6dbe3] p-4">
                    <div className="mb-2 h-6 rounded border border-black/10 bg-white px-2 text-[10px] leading-6 text-slate-500">
                      0   1   2   3   4   5   6   7   8   9   10   11   12
                    </div>
                    <div className="mx-auto min-h-[420px] max-w-[780px] rounded border border-black/10 bg-white p-8 text-black shadow-[0_8px_30px_rgba(0,0,0,0.12)] [&_.tiptap]:text-black [&_.tiptap]:focus:outline-none [&_.tiptap_p]:text-black [&_.tiptap_h1]:text-black [&_.tiptap_h2]:text-black [&_.tiptap_h3]:text-black [&_.tiptap_li]:text-black [&_.tiptap_table]:w-full [&_.tiptap_table]:border-collapse [&_.tiptap_td]:border [&_.tiptap_th]:border [&_.tiptap_td]:border-black/40 [&_.tiptap_th]:border-black/40 [&_.tiptap_td]:p-2 [&_.tiptap_th]:p-2 [&_.page-break-marker]:my-6 [&_.page-break-marker]:border-0 [&_.page-break-marker]:border-t-2 [&_.page-break-marker]:border-dashed [&_.page-break-marker]:border-black/35">
                      <EditorContent editor={editor} />
                    </div>
                  </div>
                ) : (
                  <EditorContent editor={editor} />
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className={showPreview ? "" : "hidden"} />
            <ResizablePanel defaultSize={showPreview ? 50 : 0} minSize={showPreview ? 30 : 0} collapsible collapsedSize={0}>
              <div className={cn("h-full p-2", !showPreview && "hidden")}>
                <div className="rounded-xl border border-white/10 bg-[#0c0e16] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live preview (main page)</p>
                    <Button size="sm" variant="outline" onClick={toggleEditorFullscreen}>
                      {editorFullscreen ? "Exit full screen" : "Full screen workspace"}
                    </Button>
                  </div>
                  <div ref={previewFrameRef} className="relative h-[500px] overflow-hidden rounded-lg border border-white/10 bg-[#0b0c14]">
              <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(ellipse 62% 38% at 18% -8%, rgba(20,184,166,0.14), transparent 58%), radial-gradient(ellipse 55% 30% at 100% 100%, rgba(99,102,241,0.14), transparent 54%)",
                }}
              />
              <div className="relative flex h-full flex-col xl:hidden">
                <div className="flex items-center justify-between border-b border-white/8 bg-[#0b0c14]/95 px-3 py-2 backdrop-blur-xl">
                  <div className="flex items-center gap-1.5">
                    <button className="rounded-full border border-white/10 p-2 text-gray-400">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMobileNavOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                    >
                      <Menu className="h-3.5 w-3.5" />
                      Menu
                    </button>
                  </div>
                  <span className="truncate text-[10px] text-gray-400">{activePage.title}</span>
                </div>

                {previewMobileNavOpen ? (
                  <div className="absolute inset-0 z-20">
                    <button
                      type="button"
                      className="absolute inset-0 bg-black/70"
                      onClick={() => setPreviewMobileNavOpen(false)}
                    />
                    <div className="absolute left-0 top-0 h-full w-[78%] border-r border-white/8 bg-[#0b0c14] p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{course.title}</span>
                        <button type="button" onClick={() => setPreviewMobileNavOpen(false)} className="rounded p-1 text-slate-400">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {course.chapters.map((chapter, chapterIdx) => (
                          <div key={`mobile-${chapter.id}`}>
                            <p className="mb-1.5 text-[11px] font-semibold text-white">{chapter.title}</p>
                            <div className="space-y-1">
                              {chapter.pages.map((page, pageIdx) => {
                                const isActive = chapterIdx === active.chapterIdx && pageIdx === active.pageIdx;
                                return (
                                  <button
                                    key={`mobile-${page.id}`}
                                    type="button"
                                    onClick={() => {
                                      setActive({ chapterIdx, pageIdx });
                                      setPreviewMobileNavOpen(false);
                                    }}
                                    className={cn(
                                      "block w-full rounded-md px-2 py-1.5 text-left text-[12px] transition-colors",
                                      isActive ? "bg-teal-500/12 text-teal-300 border-l-2 border-teal-500" : "text-slate-300 hover:bg-white/5"
                                    )}
                                  >
                                    {page.title}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div ref={previewScrollMobileRef} className="h-full overflow-y-auto p-4">
                  <div className="mx-auto max-w-[760px] text-[14px] leading-[1.75] tracking-[0.01em] text-white">
                    <p className="text-sm text-gray-400">System design in a hurry</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight">{activePage.title || "Untitled page"}</h2>
                    {activePage.summary ? <p className="mt-2 text-[13px] text-slate-400">{activePage.summary}</p> : null}
                    <div className="mt-5 rounded-xl border border-white/8 bg-[#0f111a]/90 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                      <EditorContent editor={previewEditor} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative hidden h-full xl:grid xl:grid-cols-[220px_1fr_200px]">
                <aside className="h-full overflow-y-auto border-r border-white/8 bg-[#0b0c14]/85 p-3 backdrop-blur-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{course.title}</p>
                  <div className="mt-3 space-y-3">
                    {course.chapters.map((chapter, chapterIdx) => (
                      <div key={`desktop-${chapter.id}`}>
                        <p className="mb-1.5 text-[11px] font-semibold text-white">{chapter.title}</p>
                        <div className="space-y-1">
                          {chapter.pages.map((page, pageIdx) => {
                            const isActive = chapterIdx === active.chapterIdx && pageIdx === active.pageIdx;
                            return (
                              <button
                                key={`desktop-${page.id}`}
                                type="button"
                                onClick={() => setActive({ chapterIdx, pageIdx })}
                                className={cn(
                                  "block w-full rounded-md px-2 py-1.5 text-left text-[12px] transition-colors",
                                  isActive ? "bg-teal-500/12 text-teal-300 border-l-2 border-teal-500" : "text-slate-300 hover:bg-white/5"
                                )}
                              >
                                {page.title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>

                <main ref={previewScrollDesktopRef} className="h-full overflow-y-auto bg-transparent p-5">
                  <div className="mx-auto max-w-[760px] text-[15.5px] leading-[1.8] tracking-[0.01em] text-white">
                    <p className="text-sm text-gray-400">System design in a hurry</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight">{activePage.title || "Untitled page"}</h2>
                    {activePage.summary ? <p className="mt-2 text-[13px] text-slate-400">{activePage.summary}</p> : null}
                    <div className="mt-5 rounded-xl border border-white/8 bg-[#0f111a]/90 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                      <EditorContent editor={previewEditor} />
                    </div>
                  </div>
                </main>

                <aside className="h-full overflow-y-auto border-l border-white/8 bg-[#0b0c14]/78 p-3 backdrop-blur-xl">
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Reading progress</span>
                      <span className="text-teal-400">{previewReadProgress}%</span>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-[3px] rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.45)] transition-[width] duration-200"
                        style={{ width: `${previewReadProgress}%` }}
                      />
                    </div>
                  </div>
                  <p className="mb-2 text-xs text-gray-400">On this page</p>
                  <ul className="space-y-1.5 border-l border-white/10 pl-2 text-[12px] text-gray-500">
                    {(activePage.toc ?? []).length ? (
                      (activePage.toc ?? []).map((item, idx) => (
                        <li key={`${item.id}-${idx}`} style={{ paddingLeft: item.depth * 8 }}>
                          <button
                            type="button"
                            onClick={() => scrollPreviewToHeading(item.id, item.label)}
                            className={cn(
                              "block text-left transition-colors hover:text-teal-300",
                              previewActiveHeading
                                ? previewActiveHeading === item.id
                                  ? "text-teal-400"
                                  : "text-gray-500"
                                : idx === 0
                                  ? "text-teal-400"
                                  : "text-gray-500"
                            )}
                          >
                            {item.label}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-600">No headings yet</li>
                    )}
                  </ul>
                </aside>
              </div>
            </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={saveCourse} disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save all changes"}
          </Button>
          <p className="text-xs text-slate-400">
            {dirty ? "Unsaved changes..." : lastSavedAt ? `Last saved at ${lastSavedAt}` : "No unsaved changes"}
          </p>
          {ok ? <p className="text-xs text-emerald-300">{ok}</p> : null}
          {error ? <p className="text-xs text-red-300">{error}</p> : null}
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-[#0f1119] p-3">
          <div className="mb-2 flex items-center gap-2 text-sm text-white">
            <History className="h-4 w-4" /> Version history
          </div>
          <div className="max-h-56 space-y-2 overflow-auto">
            {versions.length ? (
              versions.map((version) => (
                <div key={version.id} className="flex items-center justify-between rounded-md border border-white/10 px-2 py-1.5">
                  <span className="text-xs text-slate-300">{new Date(version.savedAt).toLocaleString()}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!permissions.canRestoreVersions || saving}
                    onClick={() => restoreVersion(version.id)}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" /> Restore
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No versions yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
