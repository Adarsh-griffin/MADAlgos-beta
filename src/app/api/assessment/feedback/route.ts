import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import TestTokenModel from "@/models/TestToken";
import TestResultModel from "@/models/TestResult";
import { requirePracticeTokenAccess } from "@/lib/assessment-access";

const bodySchema = z.object({
  token: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid feedback payload" }, { status: 400 });
    }
    const { token, rating, comment } = parsed.data;

    await connectDB();
    const testToken = await TestTokenModel.findOne({ token });
    if (!testToken || !testToken.submittedAt) {
      return NextResponse.json({ message: "Submit your test before sending feedback" }, { status: 403 });
    }
    const denied = await requirePracticeTokenAccess(testToken as any);
    if (denied) return denied;

    const result = await TestResultModel.findOne({ tokenId: testToken._id });
    if (!result) {
      return NextResponse.json({ message: "Result not found" }, { status: 404 });
    }

    if (result.feedbackSubmittedAt) {
      return NextResponse.json({ message: "Feedback already recorded" }, { status: 409 });
    }

    result.feedbackRating = rating;
    result.feedbackComment = comment?.trim() || undefined;
    result.feedbackSubmittedAt = new Date();
    await result.save();

    return NextResponse.json({ message: "Feedback saved" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
