import PracticeTestModel from "@/models/PracticeTest";
import type { CodingProblem } from "@/models/Test";
import { fingerprintForCodingContent } from "@/lib/question-bank";
import { COMPANY_HIRING_PRACTICE_PUBLIC_SLUGS } from "@/data/company-hiring-practice-slugs";

/** Content fingerprints for every coding problem in seeded company hiring practice tests (stdin packs). */
export async function getCompanyHiringPracticeCodingContentFingerprints(): Promise<string[]> {
  const slugs = [...COMPANY_HIRING_PRACTICE_PUBLIC_SLUGS];
  const docs = await PracticeTestModel.find({ publicSlug: { $in: slugs } })
    .select({ codingProblems: 1 })
    .lean();

  const set = new Set<string>();
  for (const doc of docs) {
    for (const p of doc.codingProblems || []) {
      set.add(fingerprintForCodingContent(p as CodingProblem));
    }
  }
  return [...set];
}
