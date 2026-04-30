import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getOrCreateSystemDesignCourse } from "@/lib/system-design-cms";

export async function GET(req: Request) {
  await connectDB();
  const course = await getOrCreateSystemDesignCourse();

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug")?.trim().toLowerCase() || "";
  const includeDrafts = searchParams.get("includeDrafts") === "1";

  const chapters = course.chapters
    .map((chapter) => ({
      ...chapter,
      pages: chapter.pages
        .filter((page) => includeDrafts || page.published)
        .sort((a, b) => a.order - b.order),
    }))
    .filter((chapter) => chapter.pages.length > 0)
    .sort((a, b) => a.order - b.order);

  const flatPages = chapters.flatMap((chapter) => chapter.pages);
  const page = slug ? flatPages.find((p) => p.slug === slug) ?? null : flatPages[0] ?? null;

  return NextResponse.json({
    course: {
      slug: course.slug,
      title: course.title,
      chapters,
    },
    page,
  });
}
