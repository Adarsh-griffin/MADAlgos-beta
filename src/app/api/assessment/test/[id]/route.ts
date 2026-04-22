import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import TestModel from "@/models/Test";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid test id" }, { status: 400 });
    }

    await connectDB();
    const test = await TestModel.findById(id).lean();
    if (!test) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      title: test.title,
      duration: test.duration,
      linkValidity: test.linkValidity,
      mcqs: test.mcqs,
      codingProblems: test.codingProblems,
      isPublicDemo: Boolean((test as { isPublicDemo?: boolean }).isPublicDemo),
      publicSlug: (test as { publicSlug?: string }).publicSlug ?? "",
      demoCardSubtitle: (test as { demoCardSubtitle?: string }).demoCardSubtitle ?? "",
      demoCardImageUrl: (test as { demoCardImageUrl?: string }).demoCardImageUrl ?? "",
      demoBrandLogoUrl: (test as { demoBrandLogoUrl?: string }).demoBrandLogoUrl ?? "",
      demoLogoDomain: (test as { demoLogoDomain?: string }).demoLogoDomain ?? "",
      demoSortOrder: (test as { demoSortOrder?: number }).demoSortOrder ?? 0,
    });
  } catch (e: unknown) {
    console.error("Assessment test GET:", e);
    const msg = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
