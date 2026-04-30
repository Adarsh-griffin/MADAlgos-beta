import { randomUUID } from "crypto";
import SystemDesignCourseModel, {
  type SystemDesignChapter,
  type SystemDesignCourseDocument,
  type SystemDesignPage,
  type TocItem,
} from "@/models/SystemDesignCourse";

const COURSE_SLUG = "system-design";

export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function lessonSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() + p.slice(1))
    .join(" ");
}

function initialCourse(): Pick<SystemDesignCourseDocument, "slug" | "title" | "chapters"> {
  const defaultPage: SystemDesignPage = {
    id: "page-introduction",
    title: "Introduction",
    slug: "introduction",
    summary: "Start here for the complete roadmap and interview framing.",
    order: 0,
    published: true,
    content: {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Introduction" }] },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Welcome to the System Design course. Use the admin builder to add chapters, pages, and rich blocks.",
            },
          ],
        },
      ],
    },
    toc: [{ id: "introduction", label: "Introduction", depth: 0 }],
    updatedAt: new Date(),
  };

  const chapter: SystemDesignChapter = {
    id: "chapter-in-a-hurry",
    title: "In a Hurry",
    order: 0,
    pages: [defaultPage],
  };

  return {
    slug: COURSE_SLUG,
    title: "System Design",
    chapters: [chapter],
    versions: [],
  };
}

export async function getOrCreateSystemDesignCourse() {
  let course = await SystemDesignCourseModel.findOne({ slug: COURSE_SLUG });
  if (course) return course;
  course = await SystemDesignCourseModel.create(initialCourse());
  return course;
}

export function extractTocFromDocument(doc: unknown): TocItem[] {
  if (!doc || typeof doc !== "object") return [];
  const content = (doc as { content?: unknown }).content;
  if (!Array.isArray(content)) return [];
  const toc: TocItem[] = [];
  for (const node of content) {
    if (!node || typeof node !== "object") continue;
    const n = node as { type?: unknown; attrs?: unknown; content?: unknown };
    if (n.type !== "heading") continue;
    const attrs = (n.attrs ?? {}) as { level?: number; id?: string };
    const level = Number(attrs.level ?? 1);
    const depth = Math.max(0, Math.min(2, level - 1));
    let label = "Untitled heading";
    if (Array.isArray(n.content)) {
      const text = n.content
        .map((child) => {
          if (!child || typeof child !== "object") return "";
          const typed = child as { text?: unknown };
          return typeof typed.text === "string" ? typed.text : "";
        })
        .join("")
        .trim();
      if (text) label = text;
    }
    const id = typeof attrs.id === "string" && attrs.id.trim() ? attrs.id : toSlug(label);
    toc.push({ id, label, depth });
  }
  return toc;
}

export function sanitizeCoursePayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid payload.");
  }
  const typed = payload as { title?: unknown; chapters?: unknown };
  const title = typeof typed.title === "string" && typed.title.trim() ? typed.title.trim() : "System Design";
  const rawChapters = Array.isArray(typed.chapters) ? typed.chapters : [];

  const chapters = rawChapters.map((chapter, chapterIdx) => {
    const c = (chapter ?? {}) as {
      id?: unknown;
      title?: unknown;
      pages?: unknown;
    };
    const chapterTitle =
      typeof c.title === "string" && c.title.trim() ? c.title.trim() : `Chapter ${chapterIdx + 1}`;
    const rawPages = Array.isArray(c.pages) ? c.pages : [];

    const pages = rawPages.map((page, pageIdx) => {
      const p = (page ?? {}) as {
        id?: unknown;
        title?: unknown;
        slug?: unknown;
        summary?: unknown;
        published?: unknown;
        content?: unknown;
      };
      const pageTitle =
        typeof p.title === "string" && p.title.trim()
          ? p.title.trim()
          : lessonSlugToTitle(typeof p.slug === "string" ? p.slug : `page-${pageIdx + 1}`);
      const slugInput = typeof p.slug === "string" && p.slug.trim() ? p.slug : pageTitle;
      const slug = toSlug(slugInput) || `page-${chapterIdx + 1}-${pageIdx + 1}`;
      const content =
        p.content && typeof p.content === "object" ? p.content : { type: "doc", content: [] };
      return {
        id:
          typeof p.id === "string" && p.id.trim()
            ? p.id.trim()
            : `page-${chapterIdx + 1}-${pageIdx + 1}`,
        title: pageTitle,
        slug,
        summary: typeof p.summary === "string" ? p.summary.slice(0, 240) : "",
        order: pageIdx,
        published: Boolean(p.published),
        content,
        toc: extractTocFromDocument(content),
        updatedAt: new Date(),
      };
    });

    return {
      id:
        typeof c.id === "string" && c.id.trim() ? c.id.trim() : `chapter-${chapterIdx + 1}`,
      title: chapterTitle,
      order: chapterIdx,
      pages,
    };
  });

  return { title, chapters };
}

export function buildVersionSnapshot(input: { title: string; chapters: SystemDesignChapter[]; savedBy: string }) {
  return {
    id: randomUUID(),
    savedAt: new Date(),
    savedBy: input.savedBy,
    title: input.title,
    chapters: input.chapters,
  };
}

export function limitVersions<T>(versions: T[], max = 20): T[] {
  if (versions.length <= max) return versions;
  return versions.slice(versions.length - max);
}

export { COURSE_SLUG };
