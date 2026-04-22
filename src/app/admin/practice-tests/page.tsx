import React from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { connectDB } from "@/lib/mongodb";
import PracticeTestModel from "@/models/PracticeTest";
import TestTokenModel from "@/models/TestToken";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList, Link as LinkIcon, Clock } from "lucide-react";

export const metadata = {
  title: "Practice tests | MADAlgos Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminPracticeTestsPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  await connectDB();

  const tests = await PracticeTestModel.find()
    .sort({ demoSortOrder: 1, createdAt: -1 })
    .lean<any[]>()
    .exec();

  const testStats = await Promise.all(
    tests.map(async (test) => {
      const tokens = await TestTokenModel.find({ practiceTestId: test._id }).lean<any[]>();
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
        title="Practice tests"
        description="Manage public practice packs shown on /available-tests. These use the practice_test collection and mint tokens with practiceTestId only."
        action={
          <Button asChild className="rounded-full px-6">
            <Link href="/admin/practice-tests/create">
              <Plus className="mr-2 h-4 w-4" /> New practice test
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#050505]/80 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2 text-primary">
            <ClipboardList className="h-5 w-5" />
            <h3 className="font-semibold text-white">Practice packs</h3>
          </div>
          <p className="text-3xl font-bold text-white">{tests.length}</p>
        </div>
        <div className="rounded-2xl bg-[#050505]/80 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2 text-green-500">
            <LinkIcon className="h-5 w-5" />
            <h3 className="font-semibold text-white">Tokens issued</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {testStats.reduce((acc, curr) => acc + curr.total, 0)}
          </p>
        </div>
        <div className="rounded-2xl bg-[#050505]/80 border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2 text-yellow-500">
            <Clock className="h-5 w-5" />
            <h3 className="font-semibold text-white">In progress</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {testStats.reduce((acc, curr) => acc + (curr.started - curr.submitted), 0)}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="border-b border-white/10 pb-2">
          <h2 className="text-xl font-semibold text-white">Catalog</h2>
        </div>
        <DataTable
          headers={["Title & slug", "Questions", "Stats (Issued/Started/Done)", "Updated", "Actions"]}
          rows={tests.map((t) => {
            const stats = statsMap.get(t._id.toString()) || { total: 0, started: 0, submitted: 0 };
            const slug = typeof t.publicSlug === "string" ? t.publicSlug : "";
            return [
              <div key="n" className="flex flex-col min-w-0">
                <span className="font-medium text-white truncate">{t.title}</span>
                <span className="text-[11px] text-slate-400 font-mono truncate">
                  {slug ? `/available-tests/${slug}` : "— no slug"}
                </span>
              </div>,
              <div key="q" className="flex gap-2 flex-wrap">
                <StatusBadge label={`${t.mcqs?.length ?? 0} MCQ`} tone="info" />
                <StatusBadge label={`${t.codingProblems?.length ?? 0} Code`} tone="primary" />
              </div>,
              <div key="s" className="text-sm text-slate-300">
                <span className="text-white font-semibold">{stats.total}</span> issued /{" "}
                <span className="text-yellow-400 font-semibold">{stats.started}</span> started /{" "}
                <span className="text-green-400 font-semibold">{stats.submitted}</span> done
              </div>,
              <span key="d" className="text-slate-400 text-sm whitespace-nowrap">
                {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : "—"}
              </span>,
              <div key="a" className="flex flex-wrap gap-2 justify-end w-full">
                {slug ? (
                  <Button variant="outline" size="sm" asChild className="rounded-full">
                    <Link href={`/available-tests/${encodeURIComponent(slug)}`} target="_blank" rel="noopener noreferrer">
                      View
                    </Link>
                  </Button>
                ) : null}
                <Button variant="outline" size="sm" asChild className="rounded-full">
                  <Link href={`/admin/practice-tests/${t._id}/edit`}>Edit</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="rounded-full text-slate-400 hover:text-white">
                  <Link href={`/admin/practice-tests/create?fromPractice=${encodeURIComponent(String(t._id))}`}>
                    Duplicate…
                  </Link>
                </Button>
              </div>,
            ];
          })}
          emptyMessage="No practice tests yet. Create one to appear on /available-tests."
        />
      </section>
    </div>
  );
}
