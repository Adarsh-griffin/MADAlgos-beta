import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import SystemDesignCourseModel from "@/models/SystemDesignCourse";
import {
  buildVersionSnapshot,
  COURSE_SLUG,
  getOrCreateSystemDesignCourse,
  limitVersions,
  sanitizeCoursePayload,
} from "@/lib/system-design-cms";

async function requireAdmin() {
  const session = await getSessionFromRequestCookies();
  return session && (session.role === "ADMIN" || session.role === "SUPER_ADMIN") ? session : null;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await connectDB();
  const course = await getOrCreateSystemDesignCourse();
  const permissions = {
    canEdit: true,
    canPublish: session.role === "SUPER_ADMIN",
    canRestoreVersions: session.role === "SUPER_ADMIN",
  };
  const versions = (course.versions ?? [])
    .slice()
    .sort((a, b) => +new Date(b.savedAt) - +new Date(a.savedAt))
    .map((v) => ({ id: v.id, savedAt: v.savedAt, savedBy: v.savedBy }));
  return NextResponse.json({ course, permissions, versions });
}

export async function PUT(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const payload = (await req.json()) as {
      action?: "save" | "restore";
      course?: unknown;
      versionId?: string;
    };
    const action = payload.action ?? "save";
    await connectDB();
    const existing = await getOrCreateSystemDesignCourse();
    let updated = existing;

    if (action === "restore") {
      if (session.role !== "SUPER_ADMIN") {
        return NextResponse.json({ message: "Only publishers can restore versions." }, { status: 403 });
      }
      const versionId = String(payload.versionId ?? "").trim();
      if (!versionId) return NextResponse.json({ message: "versionId is required." }, { status: 400 });
      const target = (existing.versions ?? []).find((v) => v.id === versionId);
      if (!target) return NextResponse.json({ message: "Version not found." }, { status: 404 });
      const nextVersions = limitVersions([
        ...(existing.versions ?? []),
        buildVersionSnapshot({ title: existing.title, chapters: existing.chapters, savedBy: session.uid }),
      ]);
      updated = await SystemDesignCourseModel.findOneAndUpdate(
        { slug: COURSE_SLUG },
        {
          $set: {
            title: target.title,
            chapters: target.chapters,
            versions: nextVersions,
            updatedBy: session.uid,
          },
        },
        { new: true }
      ).orFail();
    } else {
      const sanitized = sanitizeCoursePayload(payload.course ?? payload);
      const canPublish = session.role === "SUPER_ADMIN";
      const existingPublishedByPageId = new Map(
        (existing.chapters ?? []).flatMap((chapter) =>
          chapter.pages.map((page) => [page.id, Boolean(page.published)] as const)
        )
      );
      const chapters = sanitized.chapters.map((chapter) => ({
        ...chapter,
        pages: chapter.pages.map((page) => ({
          ...page,
          published: canPublish ? page.published : existingPublishedByPageId.get(page.id) ?? false,
        })),
      }));
      const nextVersions = limitVersions([
        ...(existing.versions ?? []),
        buildVersionSnapshot({ title: existing.title, chapters: existing.chapters, savedBy: session.uid }),
      ]);
      updated = await SystemDesignCourseModel.findOneAndUpdate(
        { slug: COURSE_SLUG },
        {
          $set: {
            slug: COURSE_SLUG,
            title: sanitized.title,
            chapters,
            versions: nextVersions,
            updatedBy: session.uid,
          },
        },
        { upsert: true, new: true }
      ).orFail();
    }

    const permissions = {
      canEdit: true,
      canPublish: session.role === "SUPER_ADMIN",
      canRestoreVersions: session.role === "SUPER_ADMIN",
    };
    const versions = (updated.versions ?? [])
      .slice()
      .sort((a, b) => +new Date(b.savedAt) - +new Date(a.savedAt))
      .map((v) => ({ id: v.id, savedAt: v.savedAt, savedBy: v.savedBy }));
    return NextResponse.json({ message: "Saved", course: updated, permissions, versions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save course.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
