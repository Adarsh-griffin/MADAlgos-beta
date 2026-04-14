import React from "react";
import { Button } from "@/components/ui/button";

interface TestAssessmentInstructionsProps {
  token: string;
  test: {
    title: string;
    duration: number;
    mcqs: unknown[];
    codingProblems: unknown[];
  };
}

export function TestAssessmentInstructions({ token, test }: TestAssessmentInstructionsProps) {
  const nMcq = test.mcqs?.length ?? 0;
  const nCode = test.codingProblems?.length ?? 0;
  const totalItems = nMcq + nCode;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-lg w-full p-10 md:p-12 rounded-[32px] bg-[#050505] border border-white/10 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{test.title}</h1>
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">MADALGOS ASSESSMENT PLATFORM</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Duration</p>
            <p className="text-lg font-semibold text-white">{test.duration} Minutes</p>
          </div>
          <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Questions</p>
            <p className="text-lg font-semibold text-white">{totalItems}</p>
          </div>
        </div>

        <ul className="space-y-3 text-sm text-slate-300 list-disc pl-5 marker:text-slate-500">
          <li>Do not refresh the page once the test starts.</li>
          <li>The timer will continue even if you close the browser.</li>
          <li>Ensure a stable internet connection.</li>
          {nMcq > 0 ? (
            <li>
              Multiple choice is one scrollable page
              {nCode > 0 ? "; then use Next to open coding problems." : "."}
            </li>
          ) : null}
          {nCode > 0 ? (
            <li>
              The left sidebar lists section titles only. Read each task in the center; the code editor is on the
              right. Run samples checks public cases; hidden cases run after you finish.
            </li>
          ) : null}
        </ul>

        <p className="text-xs text-slate-500">
          When you press <span className="text-slate-400 font-medium">Start My Assessment</span>, the timer begins and
          this screen will not show again until you submit or time runs out.
        </p>

        <form action="/api/assessment/start" method="POST" className="pt-1">
          <input type="hidden" name="token" value={token} />
          <Button
            type="submit"
            className="w-full h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-black transition-all hover:scale-[1.01]"
          >
            Start My Assessment
          </Button>
        </form>
      </div>
    </div>
  );
}
