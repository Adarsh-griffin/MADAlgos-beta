"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, ListChecks, Code2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  resolveUnifiedDifficultyDurationMinutes,
  type AssessmentDeliveryMinutes,
} from "@/lib/practice-duration-for-difficulty";

type Props = {
  slug: string;
  mcqCount: number;
  codeCount: number;
  assessmentDelivery: AssessmentDeliveryMinutes | null | undefined;
  fallbackDurationMinutes: number;
};

export function PublicDemoTestPrepPanel({
  slug,
  mcqCount,
  codeCount,
  assessmentDelivery,
  fallbackDurationMinutes,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const authRedirectUrl = `/auth?next=${encodeURIComponent(`/available-tests/${slug}`)}`;

  const durationMinutes = resolveUnifiedDifficultyDurationMinutes(
    difficulty,
    assessmentDelivery,
    fallbackDurationMinutes
  );

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assessment/public-demo/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          difficulty,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        url?: string;
        code?: string;
      };
      if (!res.ok) {
        if (
          res.status === 401 ||
          data.code === "AUTH_EMAIL_MISSING" ||
          data.message?.toLowerCase().includes("user email missing")
        ) {
          router.push(authRedirectUrl);
          return;
        }
        setError(data.message || "Could not start the test.");
        return;
      }
      if (data.url) {
        router.push(data.url);
        return;
      }
      setError("Unexpected response.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Clock, label: "Duration", value: `${durationMinutes} minutes` },
          { icon: ListChecks, label: "MCQs", value: String(mcqCount) },
          { icon: Code2, label: "Coding", value: String(codeCount) },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="group rounded-2xl border border-white/10 bg-[#050505]/80 backdrop-blur-sm p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/45 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(20,184,166,0.16)]"
          >
            <Icon className="h-8 w-8 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
              <p className="font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="group max-w-3xl mx-auto rounded-[1.4rem] border border-primary/25 bg-linear-to-b from-primary/[0.08] to-transparent p-6 md:p-8 mb-8 shadow-[0_20px_45px_rgba(20,184,166,0.08)] transition-all duration-300 hover:border-primary/40">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-3">Before you start</h2>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
          <li>Use a stable connection and stay on the assessment tab during the attempt.</li>
          <li>After signup, confirm your email — check spam folders if needed.</li>
          <li>Admin-invited candidates follow a separate flow; this page is for public practice listings.</li>
        </ul>
      </div>

      <div className="relative max-w-3xl mx-auto rounded-[1.3rem] border border-white/10 bg-[#050b18]/80 p-5 md:p-6 shadow-[0_22px_45px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="pointer-events-none absolute -right-14 -top-14 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-8 bottom-0 h-16 w-16 rounded-full bg-fuchsia-400/10 blur-2xl" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">Launch assessment</p>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:max-w-sm gap-3">
            <label className="space-y-1">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Assessment difficulty
              </span>
              <select
                className="w-full rounded-lg border border-white/15 bg-[#0b1326] px-3 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-primary/40"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                disabled={loading}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={start}
            disabled={loading}
            className={cn(
              "inline-flex justify-center items-center w-full sm:w-auto rounded-xl py-3.5 px-10 min-w-[200px]",
              "bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-[0.22em]",
              "shadow-[0_14px_48px_rgba(20,184,166,0.28)] hover:brightness-110 transition-all",
              "disabled:opacity-70 disabled:pointer-events-none",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
                Starting…
              </>
            ) : (
              "Start test"
            )}
          </button>
          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}
