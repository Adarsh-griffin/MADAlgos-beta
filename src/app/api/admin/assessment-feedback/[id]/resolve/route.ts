import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import TestResultModel from "@/models/TestResult";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid feedback id." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const resolved = Boolean(body?.resolved);

  await connectDB();
  const updated = await TestResultModel.findByIdAndUpdate(
    id,
    {
      $set: {
        feedbackResolved: resolved,
        feedbackResolvedAt: resolved ? new Date() : null,
      },
    },
    { new: true }
  )
    .select("_id feedbackResolved feedbackResolvedAt")
    .lean<{ _id: mongoose.Types.ObjectId; feedbackResolved?: boolean; feedbackResolvedAt?: Date | null } | null>()
    .exec();

  if (!updated) {
    return NextResponse.json({ message: "Feedback not found." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    id: String(updated._id),
    resolved: updated.feedbackResolved === true,
    resolvedAt: updated.feedbackResolvedAt ?? null,
  });
}
