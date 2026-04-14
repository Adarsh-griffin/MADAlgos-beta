import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import TestResultModel from "@/models/TestResult";
import type { MCQQuestion, CodingProblem } from "@/models/Test";
import {
  buildAssessmentCsv,
  buildAssessmentExportMatrix,
  type AssessmentExportRow,
} from "@/lib/assessment-csv-export";
import mongoose from "mongoose";
import * as XLSX from "xlsx";
import { normalizeMcqStudentSelection } from "@/lib/assessment-mcq";

function filenameSlug(title: string): string {
  const s = title
    .replace(/[\r\n]+/g, " ")
    .replace(/[^a-zA-Z0-9\-_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return (s || "assessment_report").slice(0, 80);
}

function buildExportRows(
  tokens: any[],
  resultByTokenId: Map<string, any>,
  mcqs: MCQQuestion[],
  codingProblems: CodingProblem[],
  includeAnswers: boolean
): AssessmentExportRow[] {
  return tokens.map((t) => {
    const res = resultByTokenId.get(String(t._id));
    const started = Boolean(t.isStarted);
    const startedAt = t.usedAt ? new Date(t.usedAt).toISOString() : "";
    const submitted = Boolean(res || t.submittedAt);
    const submittedAt = res?.submittedAt
      ? new Date(res.submittedAt).toISOString()
      : t.submittedAt
        ? new Date(t.submittedAt).toISOString()
        : "";

    let mcqDetails: { selectedLetter: string; selectedText: string; correct: string }[] | undefined;
    let codingDetails: { score: string; status: string; sourceCode: string }[] | undefined;

    if (includeAnswers) {
      mcqDetails = mcqs.map((q, i) => {
        const ans = res?.mcqAnswers?.find((a: { questionIndex: number }) => a.questionIndex === i);
        const indices = ans ? normalizeMcqStudentSelection(ans) : [];
        const letter = indices
          .filter((idx) => idx >= 0 && idx < 26)
          .map((idx) => String.fromCharCode(65 + idx))
          .join("; ");
        const text = indices
          .filter((idx) => q.options && idx >= 0 && idx < q.options.length)
          .map((idx) => String(q.options[idx]))
          .join(" | ");
        const correct =
          ans == null ? "" : ans.isCorrect === true ? "Yes" : ans.isCorrect === false ? "No" : "";
        return { selectedLetter: letter, selectedText: text, correct };
      });

      codingDetails = codingProblems.map((_, j) => {
        const sub = res?.codingSubmissions?.find((s: { problemIndex: number }) => s.problemIndex === j);
        return {
          score: sub != null && typeof sub.score === "number" ? String(sub.score) : "",
          status: sub?.status != null ? String(sub.status) : "",
          sourceCode: sub?.sourceCode != null ? String(sub.sourceCode) : "",
        };
      });
    }

    return {
      studentEmail: String(t.studentEmail),
      studentName: String(res?.studentName || t.studentName || ""),
      started,
      startedAt,
      submitted,
      submittedAt,
      mcqScore: res && typeof res.mcqScore === "number" ? String(res.mcqScore) : "",
      codingScore: res && typeof res.codingScore === "number" ? String(res.codingScore) : "",
      totalScore: res && typeof res.totalScore === "number" ? String(res.totalScore) : "",
      maxScore: res && typeof res.maxScore === "number" ? String(res.maxScore) : "",
      status: res?.status != null ? String(res.status) : submitted ? "—" : "",
      mcqDetails,
      codingDetails,
    };
  });
}

export async function GET(req: Request) {
  try {
    const session = await getSessionFromRequestCookies();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const testId = (searchParams.get("testId") || "").trim();
    const mode = (searchParams.get("mode") || "scores").trim().toLowerCase();
    const format = (searchParams.get("format") || "csv").trim().toLowerCase();

    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return NextResponse.json({ message: "Invalid test id." }, { status: 400 });
    }

    const includeAnswers = mode === "answers" || mode === "full" || mode === "detailed";
    const asXlsx = format === "xlsx" || format === "excel";

    await connectDB();

    const test = await TestModel.findById(testId).lean<{
      _id: mongoose.Types.ObjectId;
      title: string;
      mcqs: MCQQuestion[];
      codingProblems: CodingProblem[];
    } | null>();

    if (!test) {
      return NextResponse.json({ message: "Test not found." }, { status: 404 });
    }

    const mcqs = test.mcqs || [];
    const codingProblems = test.codingProblems || [];

    const [tokens, results] = await Promise.all([
      TestTokenModel.find({ testId: test._id }).sort({ studentEmail: 1 }).lean<any[]>().exec(),
      TestResultModel.find({ testId: test._id }).lean<any[]>().exec(),
    ]);

    const resultByTokenId = new Map(results.map((r) => [String(r.tokenId), r]));
    const rows = buildExportRows(tokens, resultByTokenId, mcqs, codingProblems, includeAnswers);

    const base = `${filenameSlug(test.title)}_${includeAnswers ? "scores_and_answers" : "scores_only"}`;

    if (asXlsx) {
      const matrix = buildAssessmentExportMatrix(mcqs, codingProblems, rows, includeAnswers);
      const ws = XLSX.utils.aoa_to_sheet(matrix);
      const colCount = matrix[0]?.length ?? 12;
      ws["!cols"] = Array.from({ length: colCount }, (_, i) => ({
        wch: i < 6 ? 24 : i < 11 ? 14 : 32,
      }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Results");
      const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      const fname = `${base}.xlsx`;
      return new NextResponse(buf, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${fname}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const csv = buildAssessmentCsv(mcqs, codingProblems, rows, includeAnswers);
    const bom = "\uFEFF";
    const body = bom + csv;
    const fname = `${base}.csv`;

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fname}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: unknown) {
    console.error("[assessment-export]", e);
    const msg = e instanceof Error ? e.message : "Internal server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
