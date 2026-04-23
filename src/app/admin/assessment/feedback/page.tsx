import React from "react";
import Link from "next/link";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import { ArrowLeft, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import TestResultModel from "@/models/TestResult";
import { FeedbackReviewClient } from "@/components/admin/assessment/FeedbackReviewClient";

export const metadata = {
  title: "Assessment Feedback Review | MADAlgos Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminAssessmentFeedbackPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  await connectDB();
  const docs = await TestResultModel.find({
    feedbackSubmittedAt: { $exists: true, $ne: null },
  })
    .sort({ feedbackSubmittedAt: -1 })
    .limit(300)
    .select("studentEmail feedbackRating feedbackComment feedbackSubmittedAt feedbackResolved")
    .lean<
      Array<{
        _id: mongoose.Types.ObjectId;
        studentEmail?: string;
        feedbackRating?: number;
        feedbackComment?: string;
        feedbackSubmittedAt?: Date;
        feedbackResolved?: boolean;
      }>
    >()
    .exec();

  const rows = docs.map((d) => ({
    id: String(d._id),
    email: String(d.studentEmail || "—"),
    rating: typeof d.feedbackRating === "number" ? d.feedbackRating : 0,
    feedback: String(d.feedbackComment || "—"),
    submitted: d.feedbackSubmittedAt ? new Date(d.feedbackSubmittedAt).toLocaleString() : "—",
    resolved: d.feedbackResolved === true,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assessment feedback review"
        description="Review student feedback after assessments and track issue resolution."
        action={
          <Button asChild variant="outline" className="rounded-full border-white/15">
            <Link href="/admin/assessment/results">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to results
            </Link>
          </Button>
        }
      />

      <div className="rounded-2xl bg-[#050505]/80 border border-white/10 p-5 flex items-start gap-3">
        <MessageSquareQuote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400 leading-relaxed">
          Each row includes student email, rating, feedback text, and a resolve action for issue tracking.
        </p>
      </div>

      <FeedbackReviewClient initialRows={rows} />
    </div>
  );
}
