import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { connectDB } from "@/lib/mongodb";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import TestResultModel from "@/models/TestResult";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DispatchStudentsPanel } from "@/components/admin/assessment/DispatchStudentsPanel";
import { MonitorReuseBar } from "@/components/admin/assessment/MonitorReuseBar";
import { AssessmentExportPanel } from "@/components/admin/assessment/AssessmentExportPanel";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  getAssessmentInviteMonitorStatus,
  type AssessmentInviteMonitorStatus,
} from "@/lib/assessment-token-status";

const STATUS_LABEL: Record<AssessmentInviteMonitorStatus, string> = {
  Active: "Active",
  InProgress: "In Progress",
  Completed: "Completed",
  Expired: "Expired",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssessmentMonitorPage({ params }: PageProps) {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  const { id } = await params;
  await connectDB();

  const test = await TestModel.findById(id).lean<any>().exec();
  if (!test) notFound();

  const [tokens, results] = await Promise.all([
    TestTokenModel.find({ testId: test._id }).sort({ createdAt: -1 }).lean<any[]>().exec(),
    TestResultModel.find({ testId: test._id }).sort({ submittedAt: -1 }).lean<any[]>().exec(),
  ]);

  const resultByTokenId = new Map(results.map((r) => [String(r.tokenId), r]));
  const now = new Date();

  return (
    <div className="space-y-8">
      <PageHeader
        title={test.title}
        description={`${test.mcqs.length} MCQ · ${test.codingProblems.length} coding · ${test.duration} min · link valid ${test.linkValidity}h per invite`}
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/admin/assessment">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
        }
      />

      <MonitorReuseBar testId={String(test._id)} />

      <AssessmentExportPanel testId={String(test._id)} />

      <DispatchStudentsPanel testId={String(test._id)} />

      <section className="rounded-2xl border border-white/10 bg-[#050505]/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Started</th>
                <th className="p-4 font-medium">Submitted</th>
                <th className="p-4 font-medium">Score</th>
                <th className="p-4 font-medium text-right">Submission</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((t) => {
                const res = resultByTokenId.get(String(t._id));
                const status = getAssessmentInviteMonitorStatus(t, Boolean(res), now);
                const statusTone =
                  status === "Completed"
                    ? "success"
                    : status === "InProgress"
                      ? "warning"
                      : status === "Expired"
                        ? "danger"
                        : "default";
                return (
                  <tr key={String(t._id)} className="border-b border-white/5 text-slate-300">
                    <td className="p-4 text-white">{t.studentEmail}</td>
                    <td className="p-4">
                      <StatusBadge label={STATUS_LABEL[status]} tone={statusTone} />
                    </td>
                    <td className="p-4">{t.isStarted ? (t.usedAt ? new Date(t.usedAt).toLocaleString() : "Yes") : "—"}</td>
                    <td className="p-4">
                      {t.submittedAt ? new Date(t.submittedAt).toLocaleString() : "—"}
                    </td>
                    <td className="p-4">
                      {res ? (
                        <span className="text-primary font-semibold">
                          {res.totalScore} / {res.maxScore}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
                        <Link href={`/admin/assessment/view/${test._id}/student/${t._id}`}>
                          {res ? "View answers" : "View invite"}
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {tokens.length === 0 && (
          <p className="p-8 text-center text-slate-500">No dispatch tokens for this test.</p>
        )}
      </section>
    </div>
  );
}
