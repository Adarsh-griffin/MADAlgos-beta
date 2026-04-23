import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import TestResultModel from "@/models/TestResult";

export async function PATCH(req: Request) {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ids = Array.isArray(body?.ids) ? body.ids : [];
  const resolved = Boolean(body?.resolved);

  const validIds = ids
    .filter((id: unknown): id is string => typeof id === "string" && mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  if (validIds.length === 0) {
    return NextResponse.json({ message: "No valid feedback ids provided." }, { status: 400 });
  }

  await connectDB();
  const res = await TestResultModel.updateMany(
    { _id: { $in: validIds } },
    {
      $set: {
        feedbackResolved: resolved,
        feedbackResolvedAt: resolved ? new Date() : null,
      },
    }
  ).exec();

  return NextResponse.json({
    ok: true,
    matched: res.matchedCount ?? 0,
    modified: res.modifiedCount ?? 0,
    resolved,
  });
}
