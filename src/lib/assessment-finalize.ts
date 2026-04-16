import { connectDB } from "@/lib/mongodb";
import TestResultModel from "@/models/TestResult";
import TestTokenModel from "@/models/TestToken";
import TestModel from "@/models/Test";
import { runJudge0Submission } from "@/lib/judge0";
import { sendAssessmentCompletionEmail } from "@/lib/assessment-emails";
import { getMcqCorrectIndices, normalizeMcqStudentSelection, selectionsEqual } from "@/lib/assessment-mcq";

const LANGUAGE_MAP: Record<string, number> = {
  C: 50,
  "C++": 54,
  Java: 62,
  Javascript: 93,
  Python: 71,
};

export type AssessmentSubmitStatus = "COMPLETED" | "AUTO_SUBMITTED";

type McqAnswerInput = {
  questionIndex: number;
  selectedOption?: number;
  selectedOptions?: number[];
};

type CodingSubmissionInput = {
  problemIndex: number;
  sourceCode?: string;
  language?: string;
};

/**
 * Grade MCQ + coding, persist TestResult, set testToken.submittedAt.
 * Idempotent: if token already has submittedAt, returns { skipped: true } without writing.
 */
export async function persistGradedAssessment(
  testToken: { _id: unknown },
  test: {
    _id?: unknown;
    title?: string;
    mcqs: unknown[];
    codingProblems: Array<{
      marks: number;
      hiddenTestCases?: Array<{ input: string; output: string }>;
    }>;
  },
  mcqAnswers: McqAnswerInput[],
  codingSubmissions: CodingSubmissionInput[],
  status: AssessmentSubmitStatus
): Promise<{ skipped: boolean; resultId?: string }> {
  const fresh = await TestTokenModel.findById(testToken._id);
  if (!fresh || fresh.submittedAt) {
    return { skipped: true };
  }

  let mcqScore = 0;
  const gradedMcqs = mcqAnswers.map((answer) => {
    const question = test.mcqs[answer.questionIndex] as
      | { marks: number; selectionType?: string; correctOptions?: number[]; correctOption?: number }
      | undefined;
    if (!question) {
      return { ...answer, selectedOptions: normalizeMcqStudentSelection(answer), isCorrect: false };
    }
    const expected = getMcqCorrectIndices(question);
    const got = normalizeMcqStudentSelection(answer);
    const isCorrect = expected.length > 0 && got.length > 0 && selectionsEqual(expected, got);
    if (isCorrect) mcqScore += question.marks;
    const first = got[0];
    return {
      questionIndex: answer.questionIndex,
      selectedOptions: got,
      ...(typeof first === "number" ? { selectedOption: first } : {}),
      isCorrect,
    };
  });

  let codingScore = 0;
  const gradedCoding: {
    problemIndex: number;
    sourceCode: string;
    status: string;
    score: number;
  }[] = [];

  for (const sub of codingSubmissions) {
    const problem = test.codingProblems[sub.problemIndex];
    if (!problem) {
      gradedCoding.push({
        problemIndex: sub.problemIndex,
        sourceCode: sub.sourceCode ?? "",
        status: "Invalid problem",
        score: 0,
      });
      continue;
    }

    const langId = LANGUAGE_MAP[sub.language ?? "Javascript"] ?? 93;
    let problemStatus = "Accepted";
    let totalPassed = 0;

    const hidden = problem.hiddenTestCases || [];
    for (const tc of hidden) {
      const result = await runJudge0Submission(sub.sourceCode ?? "", langId, tc.input, tc.output);
      if (result.passed) {
        totalPassed++;
      } else {
        problemStatus = result.status;
      }
    }

    const totalTestCases = hidden.length;
    const problemScore =
      totalTestCases > 0
        ? Math.floor((totalPassed / totalTestCases) * problem.marks)
        : totalPassed > 0
          ? problem.marks
          : 0;

    codingScore += problemScore;
    gradedCoding.push({
      problemIndex: sub.problemIndex,
      sourceCode: sub.sourceCode ?? "",
      status: problemStatus,
      score: problemScore,
    });
  }

  const mcqsForMax = test.mcqs as { marks: number }[];
  const codingForMax = test.codingProblems as { marks: number }[];
  const maxScore =
    mcqsForMax.reduce((a, b) => a + b.marks, 0) + codingForMax.reduce((a, b) => a + b.marks, 0);

  const result = await TestResultModel.create({
    tokenId: fresh._id,
    testId: test._id ?? fresh.testId,
    studentEmail: fresh.studentEmail,
    studentName: fresh.studentName,
    mcqAnswers: gradedMcqs,
    codingSubmissions: gradedCoding,
    mcqScore,
    codingScore,
    totalScore: mcqScore + codingScore,
    maxScore,
    submittedAt: new Date(),
    status: status || "COMPLETED",
  });

  fresh.submittedAt = new Date();
  await fresh.save();

  const testTitle = String((test as { title?: string }).title || "Assessment");
  void sendAssessmentCompletionEmail({
    to: fresh.studentEmail,
    studentName: fresh.studentName,
    testTitle,
    submittedAt: result.submittedAt,
  }).catch((err) => console.error("[assessment-email] completion:", err));

  return { skipped: false, resultId: String(result._id) };
}

/**
 * If the attempt clock has passed and nothing is submitted yet, persist an empty AUTO_SUBMITTED result.
 * Safe to call on every page load for an in-progress test.
 */
export async function finalizeAssessmentIfTimeExpired(token: string): Promise<{
  finalized: boolean;
  reason?: "not_found" | "not_started" | "already_submitted" | "not_expired" | "no_used_at";
}> {
  await connectDB();
  const testToken = await TestTokenModel.findOne({ token });
  if (!testToken) return { finalized: false, reason: "not_found" };
  if (!testToken.isStarted) return { finalized: false, reason: "not_started" };
  if (testToken.submittedAt) return { finalized: false, reason: "already_submitted" };

  const usedAt = testToken.usedAt ? new Date(testToken.usedAt).getTime() : NaN;
  if (!Number.isFinite(usedAt)) return { finalized: false, reason: "no_used_at" };

  const test = await TestModel.findById(testToken.testId).lean<any>();
  if (!test) return { finalized: false, reason: "not_found" };

  const durationMin = Number(test.duration);
  const endMs = usedAt + durationMin * 60 * 1000;
  if (Date.now() <= endMs) return { finalized: false, reason: "not_expired" };

  const mcqs = (test.mcqs || []) as unknown[];
  const codingProblems = (test.codingProblems || []) as unknown[];

  const mcqAnswers = mcqs.map((_: unknown, i: number) => ({
    questionIndex: i,
    selectedOptions: [] as number[],
  }));
  const codingSubmissions = codingProblems.map((_: unknown, i: number) => ({
    problemIndex: i,
    sourceCode: "",
    language: "Javascript",
  }));

  const persist = await persistGradedAssessment(testToken, test, mcqAnswers, codingSubmissions, "AUTO_SUBMITTED");
  if (persist.skipped) {
    const again = await TestTokenModel.findOne({ token });
    return again?.submittedAt ? { finalized: true } : { finalized: false };
  }
  return { finalized: true };
}
