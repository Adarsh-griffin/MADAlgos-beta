import { createHash } from "crypto";
import type { MCQQuestion, CodingProblem } from "@/models/Test";
import { getMcqCorrectIndices } from "@/lib/assessment-mcq";
import type { QuestionBankKind } from "@/models/QuestionBankItem";
import QuestionBankItemModel from "@/models/QuestionBankItem";

export function searchTextForBankEntry(
  kind: QuestionBankKind,
  mcq?: MCQQuestion,
  coding?: CodingProblem
): string {
  if (kind === "MCQ" && mcq) {
    return [mcq.questionText, ...(mcq.options || [])].join(" ").toLowerCase();
  }
  if (kind === "CODING" && coding) {
    return [coding.title, coding.description, coding.inputFormat, coding.outputFormat].join(" ").toLowerCase();
  }
  return "";
}

export function fingerprintForMcq(mcq: MCQQuestion): string {
  const normalized = {
    t: mcq.questionText.trim().toLowerCase(),
    o: (mcq.options || []).map((o) => o.trim().toLowerCase()),
    st: mcq.selectionType || "single",
    correct: getMcqCorrectIndices(mcq),
    m: mcq.marks,
  };
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}

export function fingerprintForCoding(p: CodingProblem): string {
  const normTc = (tcs: { input: string; output: string }[]) =>
    (tcs || []).map((t) => ({ i: t.input.trim(), o: t.output.trim() }));
  const normalized = {
    title: p.title.trim().toLowerCase(),
    desc: p.description.trim(),
    inF: (p.inputFormat || "").trim(),
    outF: (p.outputFormat || "").trim(),
    s: normTc(p.sampleTestCases || []),
    h: normTc(p.hiddenTestCases || []),
    m: p.marks,
  };
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}

export function getDefaultQuestionBankSamples(): Array<{
  kind: QuestionBankKind;
  mcq?: MCQQuestion;
  coding?: CodingProblem;
  fingerprint: string;
}> {
  const mcq1: MCQQuestion = {
    questionText: "What is the value of the expression 2 + 2 in most programming languages?",
    options: ["3", "4", "22", "5"],
    selectionType: "single",
    correctOption: 1,
    marks: 1,
  };
  const mcq2: MCQQuestion = {
    questionText: "Which data structure follows Last-In-First-Out (LIFO) ordering?",
    options: ["Stack", "Queue", "Hash map", "Binary tree"],
    selectionType: "single",
    correctOption: 0,
    marks: 1,
  };
  const coding1: CodingProblem = {
    title: "Sum of two integers",
    description:
      "Read two integers **a** and **b** from standard input and print their sum to standard output.\n\nEach integer fits in a signed 32-bit range.",
    inputFormat: "A single line containing two integers a and b separated by a space.",
    outputFormat: "Print a single integer: the sum of a and b.",
    sampleTestCases: [
      { input: "2 3", output: "5" },
      { input: "10 -4", output: "6" },
    ],
    hiddenTestCases: [
      { input: "0 0", output: "0" },
      { input: "1000000 2000000", output: "3000000" },
    ],
    marks: 10,
  };
  return [
    { kind: "MCQ", mcq: mcq1, fingerprint: fingerprintForMcq(mcq1) },
    { kind: "MCQ", mcq: mcq2, fingerprint: fingerprintForMcq(mcq2) },
    { kind: "CODING", coding: coding1, fingerprint: fingerprintForCoding(coding1) },
  ];
}

export async function ensureDefaultQuestionBankSeeded(): Promise<void> {
  const count = await QuestionBankItemModel.countDocuments();
  if (count > 0) return;
  const samples = getDefaultQuestionBankSamples();
  await QuestionBankItemModel.insertMany(
    samples.map((s) => ({
      kind: s.kind,
      mcq: s.kind === "MCQ" ? s.mcq : undefined,
      coding: s.kind === "CODING" ? s.coding : undefined,
      fingerprint: s.fingerprint,
      searchText:
        s.kind === "MCQ" && s.mcq
          ? searchTextForBankEntry("MCQ", s.mcq)
          : s.kind === "CODING" && s.coding
            ? searchTextForBankEntry("CODING", undefined, s.coding)
            : "",
    }))
  );
}

export async function upsertBankItem(
  kind: QuestionBankKind,
  payload: { mcq?: MCQQuestion; coding?: CodingProblem },
  createdBy?: string
): Promise<void> {
  const fingerprint =
    kind === "MCQ" && payload.mcq
      ? fingerprintForMcq(payload.mcq)
      : kind === "CODING" && payload.coding
        ? fingerprintForCoding(payload.coding)
        : null;
  if (!fingerprint) return;

  const exists = await QuestionBankItemModel.findOne({ fingerprint }).lean();
  if (exists) return;

  await QuestionBankItemModel.create({
    kind,
    mcq: kind === "MCQ" ? payload.mcq : undefined,
    coding: kind === "CODING" ? payload.coding : undefined,
    fingerprint,
    searchText: searchTextForBankEntry(kind, payload.mcq, payload.coding),
    createdBy,
  });
}

export async function syncTestContentToQuestionBank(
  mcqs: MCQQuestion[],
  codingProblems: CodingProblem[],
  createdBy?: string
): Promise<void> {
  for (const m of mcqs) {
    if (!m.questionText?.trim()) continue;
    await upsertBankItem("MCQ", { mcq: m }, createdBy);
  }
  for (const p of codingProblems) {
    if (!p.title?.trim() || !p.description?.trim()) continue;
    const hasHidden = (p.hiddenTestCases || []).some((t) => t.input.trim() && t.output.trim());
    const hasSample = (p.sampleTestCases || []).some((t) => t.input.trim() && t.output.trim());
    if (!hasHidden || !hasSample) continue;
    await upsertBankItem("CODING", { coding: p }, createdBy);
  }
}
