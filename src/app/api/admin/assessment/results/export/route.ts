import { NextResponse } from "next/server";
import mongoose from "mongoose";
import * as XLSX from "xlsx";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import TestResultModel from "@/models/TestResult";
import TestModel from "@/models/Test";
import PracticeTestModel from "@/models/PracticeTest";
import TestTokenModel from "@/models/TestToken";
import UserModel from "@/models/User";

function toObjectIdSafe(value: unknown): mongoose.Types.ObjectId | null {
  if (!value) return null;
  if (value instanceof mongoose.Types.ObjectId) return value;
  const raw = String(value).trim();
  if (!mongoose.Types.ObjectId.isValid(raw)) return null;
  return new mongoose.Types.ObjectId(raw);
}

function csvEscape(value: unknown): string {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function GET(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim().toLowerCase();
    const statusFilter = (searchParams.get("status") || "").trim();
    const testTypeFilter = (searchParams.get("testType") || "").trim();
    const from = (searchParams.get("from") || "").trim();
    const to = (searchParams.get("to") || "").trim();
    const minScore = (searchParams.get("minScore") || "").trim();
    const maxScore = (searchParams.get("maxScore") || "").trim();
    const topScore = (searchParams.get("topScore") || "").trim() === "1";
    const topNRaw = (searchParams.get("topN") || "").trim();
    const topN = ["10", "25", "50", "100"].includes(topNRaw) ? Number(topNRaw) : 0;
    const testTitleFilter = (searchParams.get("testTitle") || "").trim();
    const format = (searchParams.get("format") || "csv").trim().toLowerCase();
    const asXlsx = format === "xlsx" || format === "excel";

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
      .limit(5000)
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
          mcqCount: Array.isArray(t.mcqs) ? t.mcqs.length : 0,
          codingCount: Array.isArray(t.codingProblems) ? t.codingProblems.length : 0,
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
        ? await TestTokenModel.find({ _id: { $in: tokenIds } })
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
        ? await UserModel.find({ _id: { $in: uniqueUserOid } })
            .select("mobile")
            .lean<Array<{ _id: mongoose.Types.ObjectId; mobile?: string | null }>>()
            .exec()
        : [];
    const userMobileMap = new Map(users.map((u) => [u._id.toString(), u.mobile ?? null]));

    const exportRows = results
      .map((r) => {
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
          ? ((r as { codingSubmissions?: Array<{ problemIndex?: number; status?: string }> }).codingSubmissions ?? [])
          : [];
        const codingByIndex = new Map<number, { status?: string }>();
        for (const c of codingSubs) {
          if (typeof c.problemIndex === "number") codingByIndex.set(c.problemIndex, { status: c.status });
        }
        const codingRight: number[] = [];
        const codingWrong: Array<{ idx: number; status: string }> = [];
        for (let i = 0; i < totalCoding; i++) {
          const sub = codingByIndex.get(i);
          const accepted = /accepted/i.test(String(sub?.status ?? ""));
          if (accepted) codingRight.push(i + 1);
          else codingWrong.push({ idx: i + 1, status: String(sub?.status ?? "No submission") });
        }

        const total = typeof r.totalScore === "number" ? r.totalScore : 0;
        const max = typeof r.maxScore === "number" ? r.maxScore : 0;
        const submittedAt = r.submittedAt ? new Date(String(r.submittedAt)) : null;
        const status = r.status === "AUTO_SUBMITTED" ? "AUTO_SUBMITTED" : "COMPLETED";
        const haystack = `${name} ${email} ${String(mobile ?? "")} ${testTitle}`.toLowerCase();
        if (q && !haystack.includes(q)) return null;
        if (testTitleFilter && testTitle !== testTitleFilter) return null;

        return {
          studentName: name,
          email,
          mobile: mobile ?? "—",
          marks: `${total}/${max}`,
          test: testTitle,
          submittedAt: submittedAt && !Number.isNaN(submittedAt.getTime()) ? submittedAt.toISOString() : "",
          status,
          mcqRightCount: mcqRight.length,
          mcqWrongCount: mcqWrong.length,
          mcqRightQuestions: mcqRight.map((n) => `Q${n}`).join(", "),
          mcqWrongQuestions: mcqWrong.map((n) => `Q${n}`).join(", "),
          codingRightCount: codingRight.length,
          codingWrongCount: codingWrong.length,
          codingRightProblems: codingRight.map((n) => `P${n}`).join(", "),
          codingWrongProblems: codingWrong.map((c) => `P${c.idx}(${c.status})`).join(", "),
        };
      })
      .filter((row): row is NonNullable<typeof row> => Boolean(row));
    const limitedRows = topN > 0 ? exportRows.slice(0, topN) : exportRows;

    const headers = [
      "Student Name",
      "Email",
      "Mobile",
      "Marks",
      "Test",
      "Submitted At",
      "Status",
      "MCQ Right Count",
      "MCQ Wrong Count",
      "MCQ Right Questions",
      "MCQ Wrong Questions",
      "Coding Right Count",
      "Coding Wrong Count",
      "Coding Right Problems",
      "Coding Wrong Problems",
    ];

    if (asXlsx) {
      const rows = [
        headers,
        ...limitedRows.map((r) => [
          r.studentName,
          r.email,
          r.mobile,
          r.marks,
          r.test,
          r.submittedAt,
          r.status,
          r.mcqRightCount,
          r.mcqWrongCount,
          r.mcqRightQuestions,
          r.mcqWrongQuestions,
          r.codingRightCount,
          r.codingWrongCount,
          r.codingRightProblems,
          r.codingWrongProblems,
        ]),
      ];
      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws["!cols"] = headers.map(() => ({ wch: 24 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "AssessmentResults");
      const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      return new NextResponse(buf, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="assessment_results_filtered.xlsx"',
          "Cache-Control": "no-store",
        },
      });
    }

    const csvRows = [
      headers.map(csvEscape).join(","),
      ...limitedRows.map((r) =>
        [
          r.studentName,
          r.email,
          r.mobile,
          r.marks,
          r.test,
          r.submittedAt,
          r.status,
          r.mcqRightCount,
          r.mcqWrongCount,
          r.mcqRightQuestions,
          r.mcqWrongQuestions,
          r.codingRightCount,
          r.codingWrongCount,
          r.codingRightProblems,
          r.codingWrongProblems,
        ]
          .map(csvEscape)
          .join(",")
      ),
    ].join("\n");
    return new NextResponse(`\uFEFF${csvRows}`, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="assessment_results_filtered.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error("[admin-assessment-results-export]", error);
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
