/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
  const formRef = useRef<HTMLFormElement | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!agreed) {
      setCountdown(null);
      return;
    }
    setCountdown(10);
  }, [agreed]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      formRef.current?.requestSubmit();
      return;
    }
    const id = window.setTimeout(() => {
      setCountdown((prev) => (prev === null ? null : prev - 1));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [countdown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="relative max-w-xl w-full">
        <div
          className={[
            "p-10 md:p-12 rounded-[32px] bg-[#050505] border border-white/10 space-y-8 transition-all duration-300",
            agreed ? "blur-sm pointer-events-none select-none" : "",
          ].join(" ")}
        >
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
            <li>Do not refresh or close this page after the assessment starts.</li>
            <li>Keep this test tab open and active until submission.</li>
            <li>Leaving the test tab multiple times can auto-submit your attempt.</li>
            <li>The timer keeps running even if your browser loses focus.</li>
            <li>Use only your own work; unfair means can invalidate your result.</li>
            <li>Ensure stable internet and system power before starting.</li>
            {nMcq > 0 ? (
              <li>
                MCQ section appears first
                {nCode > 0 ? "; coding problems follow in the next section." : "."}
              </li>
            ) : null}
            {nCode > 0 ? (
              <li>Run checks validate sample tests; final score also uses hidden test cases.</li>
            ) : null}
          </ul>

          <p className="text-xs text-slate-500">
            After you agree, launch starts automatically with a short countdown. Do not switch tabs during the test.
          </p>

          <form ref={formRef} action="/api/assessment/start" method="POST" className="pt-1 space-y-4">
            <input type="hidden" name="token" value={token} />
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(Boolean(v))} />
              <span className="text-sm leading-relaxed text-slate-300">
                I have read and agree to all assessment rules. I understand that rule violations can lead to warning,
                auto-submit, or disqualification.
              </span>
            </label>
            <Button
              type="submit"
              disabled={!agreed}
              className="w-full h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {agreed ? "Auto start armed" : "Accept rules to continue"}
            </Button>
          </form>
        </div>

        {agreed ? (
          <div className="absolute inset-0 z-20 rounded-[32px] bg-black/55 backdrop-blur-[2px] border border-primary/20 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl bg-[#0b1020] border border-primary/30 px-6 py-7 text-center space-y-3 shadow-[0_0_80px_rgba(20,184,166,0.2)]">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Rules Accepted</p>
              <h2 className="text-white text-2xl font-bold">Test starting in</h2>
              <p className="text-5xl font-black text-primary leading-none">{countdown ?? 10}</p>
              <p className="text-sm text-slate-300">Keep this tab active. The test will launch automatically at 0.</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
