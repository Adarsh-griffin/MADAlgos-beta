import React from "react";
import mongoose from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import TestResultModel from "@/models/TestResult";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import UserModel from "@/models/User";

export const metadata = {
  title: "Assessment Results | MADAlgos Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminAssessmentResultsPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  await connectDB();

  const results = await TestResultModel.find()
    .sort({ submittedAt: -1 })
    .limit(250)
    .lean<Array<Record<string, unknown> & { _id: mongoose.Types.ObjectId }>>()
    .exec();

  const testIds = [...new Set(results.map((r) => String(r.testId)))];
  const tests =
    testIds.length > 0
      ? await TestModel.find({
          _id: { $in: testIds.map((id) => new mongoose.Types.ObjectId(id)) },
        })
          .select("title")
          .lean<Array<{ _id: mongoose.Types.ObjectId; title: string }>>()
          .exec()
      : [];

  const testTitleMap = new Map(tests.map((t) => [t._id.toString(), t.title]));

  const tokenIds = results.map((r) => r.tokenId as mongoose.Types.ObjectId);
  const tokens =
    tokenIds.length > 0
      ? await TestTokenModel.find({
          _id: { $in: tokenIds },
        })
          .select("studentEmail studentName linkedUserId")
          .lean<
            Array<{
              _id: mongoose.Types.ObjectId;
              studentEmail?: string;
              studentName?: string;
              linkedUserId?: mongoose.Types.ObjectId;
            }>
          >()
          .exec()
      : [];

  const tokenMap = new Map(tokens.map((t) => [t._id.toString(), t]));

  const linkedUserIds = tokens
    .map((t) => t.linkedUserId)
    .filter((id): id is mongoose.Types.ObjectId => Boolean(id));
  const uniqueUserOid = [...new Map(linkedUserIds.map((id) => [id.toString(), id])).values()];

  const users =
    uniqueUserOid.length > 0
      ? await UserModel.find({
          _id: { $in: uniqueUserOid },
        })
          .select("mobile")
          .lean<Array<{ _id: mongoose.Types.ObjectId; mobile?: string | null }>>()
          .exec()
      : [];

  const userMobileMap = new Map(users.map((u) => [u._id.toString(), u.mobile ?? null]));

  const rows = results.map((r) => {
    const tid = String(r.tokenId);
    const token = tokenMap.get(tid);
    const name =
      (typeof r.studentName === "string" && r.studentName.trim()) ||
      (token?.studentName && String(token.studentName).trim()) ||
      "—";
    const email = typeof r.studentEmail === "string" ? r.studentEmail : token?.studentEmail ?? "—";
    const mobile =
      token?.linkedUserId != null
        ? userMobileMap.get(token.linkedUserId.toString()) ?? "—"
        : "—";
    const testTitle = testTitleMap.get(String(r.testId)) ?? "—";
    const total = typeof r.totalScore === "number" ? r.totalScore : 0;
    const max = typeof r.maxScore === "number" ? r.maxScore : 0;
    const submitted =
      r.submittedAt instanceof Date
        ? r.submittedAt.toLocaleString()
        : r.submittedAt
          ? new Date(String(r.submittedAt)).toLocaleString()
          : "—";
    const status = r.status === "AUTO_SUBMITTED" ? "AUTO_SUBMITTED" : "COMPLETED";

    return [
      <span key="n" className="text-white font-medium">
        {name}
      </span>,
      <span key="e" className="text-slate-300 text-sm break-all">
        {email}
      </span>,
      <span key="m" className="text-slate-300 text-sm">
        {mobile === null || mobile === undefined || mobile === "" ? "—" : String(mobile)}
      </span>,
      <span key="s" className="text-white font-semibold tabular-nums">
        {total} / {max}
      </span>,
      <div key="t" className="min-w-0">
        <span className="text-slate-100 text-sm line-clamp-2">{testTitle}</span>
      </div>,
      <span key="d" className="text-slate-400 text-xs whitespace-nowrap">
        {submitted}
      </span>,
      <div key="st" className="flex justify-end">
        {status === "AUTO_SUBMITTED" ? (
          <StatusBadge label="Auto" tone="warning" />
        ) : (
          <StatusBadge label="Done" tone="success" />
        )}
      </div>,
    ];
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assessment results"
        description="Recent submissions across all tests — student name, contact, score, and which assessment they took."
        action={
          <Button asChild variant="outline" className="rounded-full border-white/15">
            <Link href="/admin/assessment">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to assessments
            </Link>
          </Button>
        }
      />

      <div className="rounded-2xl bg-[#050505]/80 border border-white/10 p-5 flex items-start gap-3">
        <BarChart2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400 leading-relaxed">
          Mobile numbers appear when the invite is linked to a MADAlgos account that has a phone on file; otherwise the
          column shows an em dash.
        </p>
      </div>

      <section className="space-y-4">
        <div className="border-b border-white/10 pb-2 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-semibold text-white">Recent submissions</h2>
          <span className="text-xs text-slate-500 uppercase tracking-wider">
            Showing up to {results.length} most recent
          </span>
        </div>
        <DataTable
          headers={["Student name", "Email", "Mobile", "Marks", "Test", "Submitted", "Status"]}
          rows={rows}
          emptyMessage="No assessment results yet."
        />
      </section>
    </div>
  );
}
