import React from "react";
import mongoose from "mongoose";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, BarChart2, Download } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import TestResultModel from "@/models/TestResult";
import TestModel from "@/models/Test";
import PracticeTestModel from "@/models/PracticeTest";
import TestTokenModel from "@/models/TestToken";
import UserModel from "@/models/User";

export const metadata = {
  title: "Assessment Results | MADAlgos Admin",
};

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;

function toObjectIdSafe(value: unknown): mongoose.Types.ObjectId | null {
  if (!value) return null;
  if (value instanceof mongoose.Types.ObjectId) return value;
  const raw = String(value).trim();
  if (!mongoose.Types.ObjectId.isValid(raw)) return null;
  return new mongoose.Types.ObjectId(raw);
}

function getParam(searchParams: SearchParams, key: string): string {
  const value = searchParams[key];
  if (Array.isArray(value)) return String(value[0] ?? "").trim();
  return String(value ?? "").trim();
}

function formatDateTime(v: unknown): string {
  if (!v) return "—";
  const d = v instanceof Date ? v : new Date(String(v));
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function toPositiveInt(value: string, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export default async function AdminAssessmentResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  const sp = await searchParams;
  const q = getParam(sp, "q");
  const statusFilter = getParam(sp, "status");
  const testTypeFilter = getParam(sp, "testType");
  const from = getParam(sp, "from");
  const to = getParam(sp, "to");
  const minScore = getParam(sp, "minScore");
  const maxScore = getParam(sp, "maxScore");
  const topScore = getParam(sp, "topScore") === "1";
  const topN = getParam(sp, "topN");
  const testTitleFilter = getParam(sp, "testTitle");
  const page = toPositiveInt(getParam(sp, "page"), 1);
  const pageSize = toPositiveInt(getParam(sp, "pageSize"), 25);

  await connectDB();

  const dbFilter: Record<string, unknown> = {};
  if (statusFilter === "COMPLETED" || statusFilter === "AUTO_SUBMITTED") {
    dbFilter.status = statusFilter;
  }
  if (testTypeFilter === "platform") {
    dbFilter.testId = { $exists: true, $ne: null };
  } else if (testTypeFilter === "practice") {
    dbFilter.practiceTestId = { $exists: true, $ne: null };
  }
  const submittedAt: Record<string, Date> = {};
  if (from) {
    const fromDate = new Date(`${from}T00:00:00.000`);
    if (!Number.isNaN(fromDate.getTime())) submittedAt.$gte = fromDate;
  }
  if (to) {
    const toDate = new Date(`${to}T23:59:59.999`);
    if (!Number.isNaN(toDate.getTime())) submittedAt.$lte = toDate;
  }
  if (Object.keys(submittedAt).length > 0) dbFilter.submittedAt = submittedAt;

  const totalScore: Record<string, number> = {};
  if (minScore) {
    const n = Number(minScore);
    if (Number.isFinite(n)) totalScore.$gte = n;
  }
  if (maxScore) {
    const n = Number(maxScore);
    if (Number.isFinite(n)) totalScore.$lte = n;
  }
  if (Object.keys(totalScore).length > 0) dbFilter.totalScore = totalScore;

  const results = await TestResultModel.find(dbFilter)
    .sort(topScore ? { totalScore: -1, submittedAt: -1 } : { submittedAt: -1 })
    .limit(1000)
    .lean<Array<Record<string, unknown> & { _id: mongoose.Types.ObjectId }>>()
    .exec();

  const platformTestIds = [
    ...new Map(
      results
        .map((r) => toObjectIdSafe(r.testId))
        .filter((id): id is mongoose.Types.ObjectId => Boolean(id))
        .map((id) => [id.toString(), id])
    ).values(),
  ];
  const practiceTestIds = [
    ...new Map(
      results
        .map((r) => toObjectIdSafe(r.practiceTestId))
        .filter((id): id is mongoose.Types.ObjectId => Boolean(id))
        .map((id) => [id.toString(), id])
    ).values(),
  ];

  const [tests, practiceTests] = await Promise.all([
    platformTestIds.length > 0
      ? TestModel.find({ _id: { $in: platformTestIds } })
          .select("title mcqs codingProblems")
          .lean<Array<{ _id: mongoose.Types.ObjectId; title: string; mcqs?: unknown[]; codingProblems?: unknown[] }>>()
          .exec()
      : Promise.resolve([]),
    practiceTestIds.length > 0
      ? PracticeTestModel.find({ _id: { $in: practiceTestIds } })
          .select("title mcqs codingProblems")
          .lean<Array<{ _id: mongoose.Types.ObjectId; title: string; mcqs?: unknown[]; codingProblems?: unknown[] }>>()
          .exec()
      : Promise.resolve([]),
  ]);

  const testMetaMap = new Map<string, { title: string; mcqCount: number; codingCount: number }>([
    ...tests.map((t) => [
      t._id.toString(),
      {
        title: t.title,
        mcqCount: Array.isArray((t as { mcqs?: unknown[] }).mcqs) ? ((t as { mcqs?: unknown[] }).mcqs as unknown[]).length : 0,
        codingCount: Array.isArray((t as { codingProblems?: unknown[] }).codingProblems)
          ? ((t as { codingProblems?: unknown[] }).codingProblems as unknown[]).length
          : 0,
      },
    ]),
    ...practiceTests.map((t) => [
      t._id.toString(),
      {
        title: t.title,
        mcqCount: Array.isArray(t.mcqs) ? t.mcqs.length : 0,
        codingCount: Array.isArray(t.codingProblems) ? t.codingProblems.length : 0,
      },
    ]),
  ]);

  const tokenIds = [
    ...new Map(
      results
        .map((r) => toObjectIdSafe(r.tokenId))
        .filter((id): id is mongoose.Types.ObjectId => Boolean(id))
        .map((id) => [id.toString(), id])
    ).values(),
  ];
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

  const enriched = results.map((r) => {
    const tid = toObjectIdSafe(r.tokenId)?.toString() ?? "";
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
    const resultTestId = toObjectIdSafe(r.testId)?.toString();
    const resultPracticeId = toObjectIdSafe(r.practiceTestId)?.toString();
    const meta =
      (resultTestId ? testMetaMap.get(resultTestId) : undefined) ??
      (resultPracticeId ? testMetaMap.get(resultPracticeId) : undefined);
    const testTitle = meta?.title ?? "—";
    const totalMcqs = meta?.mcqCount ?? 0;
    const totalCoding = meta?.codingCount ?? 0;
    const total = typeof r.totalScore === "number" ? r.totalScore : 0;
    const max = typeof r.maxScore === "number" ? r.maxScore : 0;
    const submitted = formatDateTime(r.submittedAt);
    const status = r.status === "AUTO_SUBMITTED" ? "AUTO_SUBMITTED" : "COMPLETED";
    const mcqAnswers = Array.isArray((r as { mcqAnswers?: unknown[] }).mcqAnswers)
      ? ((r as { mcqAnswers?: Array<{ questionIndex?: number; isCorrect?: boolean }> }).mcqAnswers ?? [])
      : [];
    const mcqByIndex = new Map<number, boolean | undefined>();
    for (const a of mcqAnswers) {
      if (typeof a.questionIndex === "number") mcqByIndex.set(a.questionIndex, a.isCorrect);
    }
    const mcqRight: number[] = [];
    const mcqWrong: number[] = [];
    for (let i = 0; i < totalMcqs; i++) {
      if (mcqByIndex.get(i) === true) mcqRight.push(i + 1);
      else mcqWrong.push(i + 1);
    }

    const codingSubs = Array.isArray((r as { codingSubmissions?: unknown[] }).codingSubmissions)
      ? ((r as { codingSubmissions?: Array<{ problemIndex?: number; status?: string; score?: number }> }).codingSubmissions ?? [])
      : [];
    const codingByIndex = new Map<number, { status?: string; score?: number }>();
    for (const c of codingSubs) {
      if (typeof c.problemIndex === "number") codingByIndex.set(c.problemIndex, { status: c.status, score: c.score });
    }
    const codingRight: number[] = [];
    const codingWrong: Array<{ idx: number; status: string }> = [];
    for (let i = 0; i < totalCoding; i++) {
      const sub = codingByIndex.get(i);
      const accepted = /accepted/i.test(String(sub?.status ?? ""));
      if (accepted) codingRight.push(i + 1);
      else codingWrong.push({ idx: i + 1, status: String(sub?.status ?? "No submission") });
    }
    const details = {
      mcqRight,
      mcqWrong,
      codingRight,
      codingWrong,
    };
    const keywordHaystack = `${name} ${email} ${String(mobile ?? "")} ${testTitle}`.toLowerCase();
    const matchesQuery = q ? keywordHaystack.includes(q.toLowerCase()) : true;
    const matchesTestTitle = testTitleFilter ? testTitle === testTitleFilter : true;

    return {
      row: [
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
      <div key="bw" className="text-xs text-slate-300 leading-relaxed min-w-0">
        <p className="truncate">
          MCQ: <span className="text-green-400">R{details.mcqRight.length}</span> /{" "}
          <span className="text-red-400">W{details.mcqWrong.length}</span>
        </p>
        <p className="truncate">
          Code: <span className="text-green-400">R{details.codingRight.length}</span> /{" "}
          <span className="text-red-400">W{details.codingWrong.length}</span>
        </p>
      </div>,
      <div key="detail" className="text-xs text-slate-400 leading-relaxed min-w-0">
        <p className="truncate">MCQ right: {details.mcqRight.length ? details.mcqRight.map((n) => `Q${n}`).join(", ") : "—"}</p>
        <p className="truncate">MCQ wrong: {details.mcqWrong.length ? details.mcqWrong.map((n) => `Q${n}`).join(", ") : "—"}</p>
        <p className="truncate">Code right: {details.codingRight.length ? details.codingRight.map((n) => `P${n}`).join(", ") : "—"}</p>
        <p className="truncate">
          Code wrong:{" "}
          {details.codingWrong.length ? details.codingWrong.map((c) => `P${c.idx}(${c.status})`).join(", ") : "—"}
        </p>
      </div>,
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
      ],
      matchesQuery,
      matchesTestTitle,
    };
  });

  const testTitleOptions = [...new Set([...testMetaMap.values()].map((m) => m.title).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
  const filtered = enriched.filter((e) => e.matchesQuery && e.matchesTestTitle);
  const topNValue = ["10", "25", "50", "100"].includes(topN) ? Number(topN) : 0;
  const trimmed = topNValue > 0 ? filtered.slice(0, topNValue) : filtered;
  const totalRows = trimmed.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = trimmed.slice(startIndex, startIndex + pageSize);
  const rows = pageRows.map((e) => e.row);
  const exportQuery = new URLSearchParams();
  if (q) exportQuery.set("q", q);
  if (statusFilter) exportQuery.set("status", statusFilter);
  if (testTypeFilter) exportQuery.set("testType", testTypeFilter);
  if (testTitleFilter) exportQuery.set("testTitle", testTitleFilter);
  if (from) exportQuery.set("from", from);
  if (to) exportQuery.set("to", to);
  if (minScore) exportQuery.set("minScore", minScore);
  if (maxScore) exportQuery.set("maxScore", maxScore);
  if (topScore) exportQuery.set("topScore", "1");
  if (topNValue > 0) exportQuery.set("topN", String(topNValue));

  const pageLinkQuery = new URLSearchParams(exportQuery);
  pageLinkQuery.set("pageSize", String(pageSize));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assessment results"
        description="Detailed submissions with right/wrong MCQ + coding breakdown, plus export-ready filtered reports."
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-full border-white/15">
              <Link href={`/api/admin/assessment/results/export?${exportQuery.toString()}&format=csv`}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/15">
              <Link href={`/api/admin/assessment/results/export?${exportQuery.toString()}&format=xlsx`}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/15">
              <Link href="/admin/assessment">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to assessments
              </Link>
            </Button>
          </div>
        }
      />

      <div className="rounded-2xl bg-[#050505]/80 border border-white/10 p-5 flex items-start gap-3">
        <BarChart2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400 leading-relaxed">
          Mobile numbers appear when the invite is linked to a MADAlgos account that has a phone on file; otherwise the
          column shows an em dash.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#050505]/80 p-5">
        <form className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search student/email/mobile/test"
            className="md:col-span-2 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          />
          <select
            name="status"
            defaultValue={statusFilter || ""}
            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All status</option>
            <option value="COMPLETED">Completed</option>
            <option value="AUTO_SUBMITTED">Auto submitted</option>
          </select>
          <select
            name="testType"
            defaultValue={testTypeFilter || ""}
            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All test types</option>
            <option value="platform">Platform test</option>
            <option value="practice">Practice test</option>
          </select>
          <select
            name="testTitle"
            defaultValue={testTitleFilter || ""}
            className="md:col-span-2 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All test titles</option>
            {testTitleOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            name="topN"
            defaultValue={topNValue > 0 ? String(topNValue) : ""}
            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All ranks</option>
            <option value="10">Top 10</option>
            <option value="25">Top 25</option>
            <option value="50">Top 50</option>
            <option value="100">Top 100</option>
          </select>
          <select
            name="pageSize"
            defaultValue={String(pageSize)}
            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
          <input name="from" type="date" defaultValue={from} className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none" />
          <input name="to" type="date" defaultValue={to} className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none" />
          <input
            name="minScore"
            type="number"
            min={0}
            defaultValue={minScore}
            placeholder="Min score"
            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          />
          <input
            name="maxScore"
            type="number"
            min={0}
            defaultValue={maxScore}
            placeholder="Max score"
            className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-white outline-none"
          />
          <label className="md:col-span-4 inline-flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" name="topScore" value="1" defaultChecked={topScore} />
            Sort by top score
          </label>
          <div className="md:col-span-4 flex items-center gap-2">
            <Button type="submit" className="rounded-full bg-primary text-black font-bold px-6">
              Apply filters
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/15">
              <Link href="/admin/assessment/results">Reset</Link>
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div className="border-b border-white/10 pb-2 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-semibold text-white">Recent submissions</h2>
          <span className="text-xs text-slate-500 uppercase tracking-wider">
            Showing {rows.length} of {totalRows} entries
          </span>
        </div>
        <DataTable
          headers={["Student name", "Email", "Mobile", "Marks", "Right/Wrong", "Detailed breakdown", "Test", "Submitted", "Status"]}
          rows={rows}
          emptyMessage="No assessment results yet."
        />
      </section>

      <section className="flex items-center justify-between gap-3 flex-wrap rounded-2xl border border-white/10 bg-[#050505]/80 p-4">
        <p className="text-xs text-slate-400">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/15"
            disabled={currentPage <= 1}
          >
            <Link href={`/admin/assessment/results?${(() => {
              const qp = new URLSearchParams(pageLinkQuery);
              qp.set("page", String(Math.max(1, currentPage - 1)));
              return qp.toString();
            })()}`}>Previous</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-white/15"
            disabled={currentPage >= totalPages}
          >
            <Link href={`/admin/assessment/results?${(() => {
              const qp = new URLSearchParams(pageLinkQuery);
              qp.set("page", String(Math.min(totalPages, currentPage + 1)));
              return qp.toString();
            })()}`}>Next</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
