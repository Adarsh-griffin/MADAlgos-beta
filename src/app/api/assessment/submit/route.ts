import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import TestModel from "@/models/Test";
import TestTokenModel from "@/models/TestToken";
import TestResultModel from "@/models/TestResult";
import { runJudge0Submission } from "@/lib/judge0";

const LANGUAGE_MAP: Record<string, number> = {
  C: 50,
  "C++": 54,
  Java: 62,
  Javascript: 93,
  Python: 71,
};

export async function POST(req: Request) {
  try {
    const { token, mcqAnswers: rawMcq, codingSubmissions: rawCoding, status } = await req.json();

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    const mcqAnswers = Array.isArray(rawMcq) ? rawMcq : [];
    const codingSubmissions = Array.isArray(rawCoding) ? rawCoding : [];

    await connectDB();

    const testToken = await TestTokenModel.findOne({ token });
    if (!testToken || testToken.submittedAt) {
      return NextResponse.json({ message: "Invalid token or already submitted" }, { status: 403 });
    }

    const test = await TestModel.findById(testToken.testId);
    if (!test) return NextResponse.json({ message: "Test not found" }, { status: 404 });

    let mcqScore = 0;
    const gradedMcqs = mcqAnswers.map((answer: { questionIndex: number; selectedOption: number }) => {
      const question = test.mcqs[answer.questionIndex];
      if (!question) {
        return { ...answer, isCorrect: false };
      }
      const isCorrect = question.correctOption === answer.selectedOption;
      if (isCorrect) mcqScore += question.marks;
      return { ...answer, isCorrect };
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

      const langId = LANGUAGE_MAP[sub.language] ?? 93;
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

    const maxScore =
      test.mcqs.reduce((a: number, b: { marks: number }) => a + b.marks, 0) +
      test.codingProblems.reduce((a: number, b: { marks: number }) => a + b.marks, 0);

    const result = await TestResultModel.create({
      tokenId: testToken._id,
      testId: test._id,
      studentEmail: testToken.studentEmail,
      studentName: testToken.studentName,
      mcqAnswers: gradedMcqs,
      codingSubmissions: gradedCoding,
      mcqScore,
      codingScore,
      totalScore: mcqScore + codingScore,
      maxScore,
      submittedAt: new Date(),
      status: status || "COMPLETED",
    });

    testToken.submittedAt = new Date();
    await testToken.save();

    return NextResponse.json({ message: "Assessment graded and saved", resultId: result._id });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("Submission Error:", error);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
