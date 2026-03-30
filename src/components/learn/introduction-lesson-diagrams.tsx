"use client";

import { Layers, Route, Sparkles, BookOpen, Puzzle } from "lucide-react";

/** Stacked curriculum map: Practice → Delivery → Key Tech + Patterns → Core Concepts (foundation). */
export function CourseOverallStructureDiagram() {
  return (
    <figure className="relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#12141f] to-[#0a0b12] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.08),transparent)]" />
      <div className="relative flex flex-col gap-3">
        {/* Top: Practice */}
        <div className="relative rounded-2xl border-2 border-white/25 bg-[#0d0f18] p-4 shadow-inner ring-1 ring-white/5">
          <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
            <Layers className="h-3.5 w-3.5 text-white/50" aria-hidden />
            Practice Common Problems
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["Uber", "Yelp", "Google Docs", "…"].map((label) => (
              <span
                key={label}
                className="rounded-lg border border-dashed border-white/25 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/85"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Connector */}
        <div className="mx-auto h-5 w-px bg-gradient-to-b from-white/20 to-orange-500/40" aria-hidden />

        {/* Delivery Framework */}
        <div className="relative rounded-2xl border-2 border-orange-500/90 bg-gradient-to-br from-orange-500/20 to-orange-600/5 px-4 py-4 text-center shadow-[0_8px_32px_rgba(249,115,22,0.15)]">
          <span className="absolute -right-1 -top-2 rounded-full bg-orange-500/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black shadow-md">
            You are here
          </span>
          <div className="mb-1 flex items-center justify-center gap-2 text-orange-200">
            <Route className="h-4 w-4" aria-hidden />
            <span className="text-sm font-bold tracking-tight">Delivery Framework</span>
          </div>
          <p className="text-[11px] text-orange-200/70">Linear path through the interview</p>
        </div>

        <div className="mx-auto h-4 w-px bg-gradient-to-b from-orange-500/30 to-sky-500/30" aria-hidden />

        {/* Key Tech + Patterns */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border-2 border-sky-500/80 bg-gradient-to-br from-sky-500/15 to-transparent px-3 py-4 text-center shadow-[0_8px_24px_rgba(14,165,233,0.12)]">
            <BookOpen className="mx-auto mb-2 h-4 w-4 text-sky-300" aria-hidden />
            <span className="text-xs font-bold text-sky-200">Key Technologies</span>
          </div>
          <div className="rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-br from-emerald-500/15 to-transparent px-3 py-4 text-center shadow-[0_8px_24px_rgba(16,185,129,0.12)]">
            <Puzzle className="mx-auto mb-2 h-4 w-4 text-emerald-300" aria-hidden />
            <span className="text-xs font-bold text-emerald-200">Patterns</span>
          </div>
        </div>

        <div className="mx-auto h-4 w-px bg-gradient-to-b from-emerald-500/20 to-rose-500/40" aria-hidden />

        {/* Foundation: Core Concepts */}
        <div className="relative rounded-2xl border-2 border-rose-500/90 bg-gradient-to-br from-rose-500/20 via-rose-600/10 to-transparent px-4 py-5 text-center shadow-[0_12px_40px_rgba(244,63,94,0.18)]">
          <Sparkles className="mx-auto mb-2 h-4 w-4 text-rose-300" aria-hidden />
          <span className="text-sm font-bold tracking-tight text-rose-100">Core Concepts</span>
          <p className="mt-1 text-[11px] text-rose-200/70">Foundation everything else builds on</p>
        </div>
      </div>
      <figcaption className="mt-6 text-center text-xs font-medium text-muted-foreground">
        Overall structure — bottom-up learning path
      </figcaption>
    </figure>
  );
}

/** Six overlapping circles: solid core (product + infra), dashed specialized types. */
export function SixInterviewTypesDiagram() {
  return (
    <figure className="relative mx-auto max-w-[min(100%,440px)] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e16] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-6">
      <svg viewBox="0 0 400 340" className="h-auto w-full" role="img" aria-labelledby="six-types-title">
        <title id="six-types-title">Six types of software design interviews</title>
        <defs>
          <filter id="sd-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Peripheral dashed */}
        <circle cx="200" cy="72" r="52" fill="none" stroke="rgba(167,139,250,0.5)" strokeWidth="2" strokeDasharray="6 5" />
        <circle cx="292" cy="108" r="48" fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth="2" strokeDasharray="6 5" />
        <circle cx="88" cy="148" r="50" fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="2" strokeDasharray="6 5" />
        <circle cx="118" cy="268" r="48" fill="none" stroke="rgba(251,113,133,0.5)" strokeWidth="2" strokeDasharray="6 5" />
        {/* Core solid */}
        <circle
          cx="158"
          cy="168"
          r="62"
          fill="rgba(45,212,191,0.08)"
          stroke="rgba(45,212,191,0.9)"
          strokeWidth="2.5"
          filter="url(#sd-glow)"
        />
        <circle
          cx="258"
          cy="168"
          r="62"
          fill="rgba(45,212,191,0.08)"
          stroke="rgba(45,212,191,0.9)"
          strokeWidth="2.5"
          filter="url(#sd-glow)"
        />
        <text x="200" y="74" textAnchor="middle" style={{ fontSize: "10px", fill: "rgb(196, 181, 253)" }}>
          Applied ML
        </text>
        <text x="200" y="86" textAnchor="middle" style={{ fontSize: "9px", fill: "rgba(196,181,253,0.8)" }}>
          system design
        </text>
        <text x="292" y="102" textAnchor="middle" style={{ fontSize: "10px", fill: "rgb(253, 224, 71)" }}>
          ML infra design
        </text>
        <text x="88" y="144" textAnchor="middle" style={{ fontSize: "10px", fill: "rgb(103, 232, 249)" }}>
          OOP (low-level)
        </text>
        <text x="88" y="156" textAnchor="middle" style={{ fontSize: "9px", fill: "rgba(103,232,249,0.85)" }}>
          design
        </text>
        <text x="118" y="262" textAnchor="middle" style={{ fontSize: "10px", fill: "rgb(251, 113, 133)" }}>
          Frontend design
        </text>
        <text x="158" y="170" textAnchor="middle" style={{ fontSize: "11px", fill: "rgb(204, 251, 241)", fontWeight: 600 }}>
          Product design
        </text>
        <text x="258" y="170" textAnchor="middle" style={{ fontSize: "11px", fill: "rgb(204, 251, 241)", fontWeight: 600 }}>
          Infrastructure design
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        6 types of software design interviews — core types in solid teal; specialized variants dashed
      </figcaption>
    </figure>
  );
}

const RUBRIC_NOTE = "font-[family-name:ui-serif,Georgia,Cambria,serif] italic text-[11px] leading-snug text-amber-200/85";

/** 2×2 interviewer rubric with handwritten-style feedback annotations. */
export function InterviewerRubricDiagram() {
  return (
    <figure className="relative mx-auto max-w-2xl">
      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-10">
        {/* Problem Navigation */}
        <div className="relative">
          <div className="rounded-2xl border-2 border-emerald-500/75 bg-gradient-to-br from-emerald-500/12 to-transparent p-5 shadow-[0_12px_40px_rgba(16,185,129,0.12)]">
            <h3 className="text-base font-bold text-emerald-200">Problem Navigation</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Explore the problem, prioritize what matters, and ship a coherent path through ambiguity.
            </p>
          </div>
          <p className={`${RUBRIC_NOTE} mt-2 max-w-[200px]`}>
            <span className="text-amber-400/90">&ldquo;</span>
            They spent all their time on the User table, never touching the most important part!
            <span className="text-amber-400/90">&rdquo;</span>
          </p>
        </div>

        {/* Solution Design */}
        <div className="relative">
          <div className="rounded-2xl border-2 border-sky-500/75 bg-gradient-to-br from-sky-500/12 to-transparent p-5 shadow-[0_12px_40px_rgba(14,165,233,0.12)]">
            <h3 className="text-base font-bold text-sky-200">Solution Design</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Turn requirements into a coherent architecture that fits together end-to-end.
            </p>
          </div>
          <p className={`${RUBRIC_NOTE} mt-2 ml-auto max-w-[210px] text-right`}>
            <span className="text-amber-400/90">&ldquo;</span>
            The multi-layer cache was an elegant solution to the massive read volume
            <span className="text-amber-400/90">&rdquo;</span>
          </p>
        </div>

        {/* Technical Excellence */}
        <div className="relative sm:mt-2">
          <div className="rounded-2xl border-2 border-amber-500/75 bg-gradient-to-br from-amber-500/12 to-transparent p-5 shadow-[0_12px_40px_rgba(245,158,11,0.12)]">
            <h3 className="text-base font-bold text-amber-200">Technical Excellence</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Demonstrate solid command of tools, trade-offs, and when to apply each building block.
            </p>
          </div>
          <p className={`${RUBRIC_NOTE} mt-2 max-w-[220px] sm:absolute sm:-bottom-10 sm:left-2`}>
            <span className="text-amber-400/90">&ldquo;</span>
            They had strong command of Redis, Elasticsearch, and inverted indexes
            <span className="text-amber-400/90">&rdquo;</span>
          </p>
        </div>

        {/* Communication */}
        <div className="relative sm:mt-2">
          <div className="rounded-2xl border-2 border-rose-500/75 bg-gradient-to-br from-rose-500/12 to-transparent p-5 shadow-[0_12px_40px_rgba(244,63,94,0.12)]">
            <h3 className="text-base font-bold text-rose-200">Communication &amp; Collaboration</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Explain clearly, invite feedback, and collaborate like you would with a real teammate.
            </p>
          </div>
          <p className={`${RUBRIC_NOTE} mt-2 ml-auto max-w-[220px] text-right sm:absolute sm:-bottom-10 sm:right-2`}>
            <span className="text-amber-400/90">&ldquo;</span>
            They got quite defensive when I asked about alternative approaches
            <span className="text-amber-400/90">&rdquo;</span>
          </p>
        </div>
      </div>
      <figcaption className="mt-10 text-center text-xs font-medium text-muted-foreground sm:mt-14">
        Interviewer rubric — how feedback often maps to these four themes
      </figcaption>
    </figure>
  );
}
