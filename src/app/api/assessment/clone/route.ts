import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import TestModel from "@/models/Test";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { sourceTestId, title: titleOverride } = await req.json();
    if (!sourceTestId || !mongoose.isValidObjectId(String(sourceTestId))) {
      return NextResponse.json({ message: "Invalid sourceTestId" }, { status: 400 });
    }

    await connectDB();
    const source = await TestModel.findById(sourceTestId).lean();
    if (!source) {
      return NextResponse.json({ message: "Source test not found" }, { status: 404 });
    }

    const title =
      typeof titleOverride === "string" && titleOverride.trim()
        ? titleOverride.trim()
        : `${source.title} (new batch)`;

    const copy = await TestModel.create({
      title,
      duration: source.duration,
      linkValidity: source.linkValidity,
      mcqs: source.mcqs,
      codingProblems: source.codingProblems,
      createdBy: session.uid,
    });

    return NextResponse.json({
      message: "Assessment duplicated. Invite students from the monitor page.",
      testId: String(copy._id),
    });
  } catch (e: unknown) {
    console.error("Assessment clone:", e);
    const msg = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
