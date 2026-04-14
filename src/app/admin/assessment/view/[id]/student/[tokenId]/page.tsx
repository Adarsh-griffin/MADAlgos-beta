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
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import mongoose from "mongoose";
import { getMcqCorrectIndices, normalizeMcqStudentSelection, isMcqMultiple } from "@/lib/assessment-mcq";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; tokenId: string }>;
}

export default async function AdminStudentSubmissionPage({ params }: PageProps) {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  const { id: testId, tokenId } = await params;
  if (!mongoose.Types.ObjectId.isValid(testId) || !mongoose.Types.ObjectId.isValid(tokenId)) {
    notFound();
  }

  await connectDB();

  const [test, token] = await Promise.all([
    TestModel.findById(testId).lean<any>().exec(),
    TestTokenModel.findById(tokenId).lean<any>().exec(),
  ]);

  if (!test || !token) notFound();
  if (String(token.testId) !== String(test._id)) notFound();

  const result = await TestResultModel.findOne({ tokenId: token._id }).lean<any>().exec();

  const mcqs = (test.mcqs || []) as {
    questionText: string;
    options: string[];
    correctOption?: number;
    correctOptions?: number[];
    selectionType?: string;
    marks: number;
  }[];
  const codingProblems = (test.codingProblems || []) as {
    title: string;
    description: string;
    marks: number;
  }[];

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Student submission"
        description={String(token.studentEmail)}
        action={
          <Button asChild variant="outline" className="rounded-full">
            <Link href={`/admin/assessment/view/${testId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to monitor
            </Link>
          </Button>
        }
      />

      <section className="rounded-2xl border border-white/10 bg-[#050505]/80 p-6 space-y-3 text-sm text-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Email</p>
            <p className="text-white font-medium">{token.studentEmail}</p>
          </div>
          {(token.studentName || result?.studentName) && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500">Name</p>
              <p className="text-white">{result?.studentName || token.studentName}</p>
            </div>
          )}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Started</p>
            <p>{token.isStarted ? (token.usedAt ? new Date(token.usedAt).toLocaleString() : "Yes") : "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Submitted</p>
            <p>
              {result?.submittedAt
                ? new Date(result.submittedAt).toLocaleString()
                : token.submittedAt
                  ? new Date(token.submittedAt).toLocaleString()
                  : "—"}
            </p>
          </div>
        </div>
        {result ? (
          <div className="pt-3 border-t border-white/10 flex flex-wrap gap-4 text-white">
            <span>
              Total: <strong className="text-primary">{result.totalScore}</strong> / {result.maxScore}
            </span>
            <span className="text-slate-500">
              MCQ: {result.mcqScore} · Code: {result.codingScore}
            </span>
            <span className="text-slate-500">Status: {result.status}</span>
          </div>
        ) : (
          <p className="pt-3 border-t border-white/10 text-amber-200/90">
            No graded submission is stored for this invite yet (student may not have finished).
          </p>
        )}
      </section>

      {result && mcqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">MCQ responses</h2>
          <div className="space-y-6">
            {mcqs.map((q, i) => {
              const ans = (result.mcqAnswers || []).find((a: { questionIndex: number }) => a.questionIndex === i);
              const selectedSet = new Set(ans ? normalizeMcqStudentSelection(ans) : []);
              const correctSet = new Set(getMcqCorrectIndices(q));
              const multi = isMcqMultiple(q);
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-white font-medium">
                      Q{i + 1}{" "}
                      <span className="text-slate-500 font-normal">
                        ({q.marks} marks{multi ? ", multi-select" : ""})
                      </span>
                    </p>
                    {ans ? (
                      ans.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" aria-label="Correct" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 shrink-0" aria-label="Incorrect" />
                      )
                    ) : (
                      <span className="text-xs text-slate-500">No answer</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{q.questionText}</p>
                  <ul className="space-y-2 text-sm">
                    {q.options.map((opt, oi) => {
                      const isSelected = selectedSet.has(oi);
                      const isCorrect = correctSet.has(oi);
                      return (
                        <li
                          key={oi}
                          className={`rounded-xl px-3 py-2 border ${
                            isCorrect
                              ? "border-green-500/40 bg-green-500/10"
                              : isSelected
                                ? "border-red-400/40 bg-red-400/10"
                                : "border-white/10 bg-white/[0.02]"
                          }`}
                        >
                          <span className="text-slate-500 mr-2">{String.fromCharCode(65 + oi)}.</span>
                          <span className="text-slate-200">{opt}</span>
                          {isSelected ? (
                            <span className="ml-2 text-xs text-primary font-semibold">Selected</span>
                          ) : null}
                          {isCorrect ? (
                            <span className="ml-2 text-xs text-green-400 font-semibold">Correct answer</span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {result && codingProblems.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Coding submissions</h2>
          <div className="space-y-8">
            {codingProblems.map((p, j) => {
              const sub = (result.codingSubmissions || []).find(
                (s: { problemIndex: number }) => s.problemIndex === j
              );
              return (
                <div key={j} className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-base font-semibold text-white">
                      Problem {j + 1}: {p.title}{" "}
                      <span className="text-slate-500 font-normal text-sm">({p.marks} marks)</span>
                    </h3>
                    {sub ? (
                      <span className="text-sm text-primary font-semibold">
                        Score: {sub.score ?? "—"} · {sub.status || "—"}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">No submission</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400 whitespace-pre-wrap max-h-48 overflow-y-auto border border-white/5 rounded-xl p-3 bg-black/30">
                    {p.description}
                  </div>
                  {sub?.sourceCode ? (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Submitted code</p>
                      <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap min-w-0 break-all rounded-xl border border-white/10 bg-black p-4 max-h-[480px] overflow-y-auto overflow-x-auto">
                        {sub.sourceCode}
                      </pre>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
