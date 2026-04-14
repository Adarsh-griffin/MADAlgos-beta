import type { MCQQuestion, CodingProblem } from "@/models/Test";

export type AssessmentExportRow = {
  studentEmail: string;
  studentName: string;
  started: boolean;
  startedAt: string;
  submitted: boolean;
  submittedAt: string;
  mcqScore: string;
  codingScore: string;
  totalScore: string;
  maxScore: string;
  status: string;
  mcqDetails?: { selectedLetter: string; selectedText: string; correct: string }[];
  codingDetails?: { score: string; status: string; sourceCode: string }[];
};

export function csvEscapeCell(value: string): string {
  const s = value ?? "";
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function exportHeaders(
  mcqs: MCQQuestion[],
  codingProblems: CodingProblem[],
  includeAnswers: boolean
): string[] {
  const baseHeaders = [
    "Student email",
    "Student name",
    "Started",
    "Started at",
    "Submitted",
    "Submitted at",
    "MCQ score",
    "Coding score",
    "Total score",
    "Max score",
    "Result status",
  ];
  const mcqHeaders: string[] = [];
  if (includeAnswers) {
    for (let i = 0; i < mcqs.length; i++) {
      mcqHeaders.push(`MCQ ${i + 1} selected (letter)`, `MCQ ${i + 1} selected (text)`, `MCQ ${i + 1} correct`);
    }
  }
  const codeHeaders: string[] = [];
  if (includeAnswers) {
    for (let j = 0; j < codingProblems.length; j++) {
      codeHeaders.push(`Code ${j + 1} score`, `Code ${j + 1} status`, `Code ${j + 1} source`);
    }
  }
  return [...baseHeaders, ...mcqHeaders, ...codeHeaders];
}

function exportRowToCells(
  r: AssessmentExportRow,
  mcqs: MCQQuestion[],
  codingProblems: CodingProblem[],
  includeAnswers: boolean
): string[] {
  const cells = [
    r.studentEmail,
    r.studentName,
    r.started ? "Yes" : "No",
    r.startedAt,
    r.submitted ? "Yes" : "No",
    r.submittedAt,
    r.mcqScore,
    r.codingScore,
    r.totalScore,
    r.maxScore,
    r.status,
  ];

  if (includeAnswers && r.mcqDetails) {
    for (const d of r.mcqDetails) {
      cells.push(d.selectedLetter, d.selectedText, d.correct);
    }
  } else if (includeAnswers) {
    for (let i = 0; i < mcqs.length; i++) {
      cells.push("", "", "");
    }
  }

  if (includeAnswers && r.codingDetails) {
    for (const d of r.codingDetails) {
      cells.push(d.score, d.status, d.sourceCode);
    }
  } else if (includeAnswers) {
    for (let j = 0; j < codingProblems.length; j++) {
      cells.push("", "", "");
    }
  }

  return cells;
}

/** Header row + one row per student (for CSV and Excel). */
export function buildAssessmentExportMatrix(
  mcqs: MCQQuestion[],
  codingProblems: CodingProblem[],
  rows: AssessmentExportRow[],
  includeAnswers: boolean
): string[][] {
  const header = exportHeaders(mcqs, codingProblems, includeAnswers);
  const data = rows.map((r) => exportRowToCells(r, mcqs, codingProblems, includeAnswers));
  return [header, ...data];
}

export function buildAssessmentCsv(
  mcqs: MCQQuestion[],
  codingProblems: CodingProblem[],
  rows: AssessmentExportRow[],
  includeAnswers: boolean
): string {
  const matrix = buildAssessmentExportMatrix(mcqs, codingProblems, rows, includeAnswers);
  return matrix.map((row) => row.map(csvEscapeCell).join(",")).join("\r\n");
}
