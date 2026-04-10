import React from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { connectDB } from "@/lib/mongodb";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, GraduationCap, Clock, Link as LinkIcon, ClipboardList } from "lucide-react";

export const metadata = {
  title: "Assessment Management | MADAlgos Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminAssessmentPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  await connectDB();

  // Fetch tests and their associated token counts (usage stats)
  const tests = await TestModel.find()
    .sort({ createdAt: -1 })
    .lean<any[]>()
    .exec();

  const testStats = await Promise.all(
    tests.map(async (test) => {
      const tokens = await TestTokenModel.find({ testId: test._id }).lean<any[]>();
      return {
        testId: test._id.toString(),
        total: tokens.length,
        started: tokens.filter((t) => t.isStarted).length,
        submitted: tokens.filter((t) => t.submittedAt).length,
      };
    })
  );

  const statsMap = new Map(testStats.map((s) => [s.testId, s]));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assessment Platform"
        description="Create and manage tests, generate student tokens, and monitor results in real-time."
        action={
          <Button asChild className="rounded-full px-6">
            <Link href="/admin/assessment/create">
              <Plus className="mr-2 h-4 w-4" /> Create New Test
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#050505]/80 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2 text-primary">
            <ClipboardList className="h-5 w-5" />
            <h3 className="font-semibold text-white">Total Tests</h3>
          </div>
          <p className="text-3xl font-bold text-white">{tests.length}</p>
        </div>
        <div className="rounded-2xl bg-[#050505]/80 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2 text-green-500">
            <LinkIcon className="h-5 w-5" />
            <h3 className="font-semibold text-white">Active Links</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {testStats.reduce((acc, curr) => acc + curr.total, 0)}
          </p>
        </div>
        <div className="rounded-2xl bg-[#050505]/80 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2 text-yellow-500">
            <Clock className="h-5 w-5" />
            <h3 className="font-semibold text-white">In Progress</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {testStats.reduce((acc, curr) => acc + (curr.started - curr.submitted), 0)}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="border-b border-white/10 pb-2">
          <h2 className="text-xl font-semibold text-white">Test Sessions</h2>
        </div>
        <DataTable
          headers={["Test Name", "Questions", "Stats (Sent/Started/Done)", "Created At", "Actions"]}
          rows={tests.map((t) => {
            const stats = statsMap.get(t._id.toString()) || { total: 0, started: 0, submitted: 0 };
            return [
              <div key="n" className="flex flex-col">
                <span className="font-medium text-white">{t.title}</span>
                <span className="text-[11px] text-slate-400">{t.duration} mins</span>
              </div>,
              <div key="q" className="flex gap-2">
                <StatusBadge label={`${t.mcqs.length} MCQ`} tone="info" />
                <StatusBadge label={`${t.codingProblems.length} Code`} tone="primary" />
              </div>,
              <div key="s" className="text-sm text-slate-300">
                <span className="text-white font-semibold">{stats.total}</span> sent /{" "}
                <span className="text-yellow-400 font-semibold">{stats.started}</span> active /{" "}
                <span className="text-green-400 font-semibold">{stats.submitted}</span> done
              </div>,
              <span key="d" className="text-slate-400 text-sm">
                {new Date(t.createdAt).toLocaleDateString()}
              </span>,
              <Button key="a" variant="outline" size="sm" asChild className="rounded-full">
                <Link href={`/admin/assessment/view/${t._id}`}>Monitor</Link>
              </Button>,
            ];
          })}
          emptyMessage="No tests created yet. Click 'Create New Test' to start."
        />
      </section>
    </div>
  );
}
