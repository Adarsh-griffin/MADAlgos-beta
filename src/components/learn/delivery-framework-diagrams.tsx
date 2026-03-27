"use client";

import React from "react";
import { Layers, Route, Sparkles, BookOpen, Puzzle, Search } from "lucide-react";

const ACCENT = "#00b8a9";

/** Stacked course map with curved “You are here” → Delivery Framework + zoom affordance on Core Concepts. */
export function DeliveryFrameworkRoadmapDiagram() {
  return (
    <figure className="relative mx-auto max-w-lg overflow-visible rounded-2xl border border-white/10 bg-gradient-to-b from-[#12141f] to-[#080910] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-8">
      <div className="pointer-events-none absolute -left-1 top-[32%] z-10 hidden w-36 sm:block md:top-[30%]">
        <svg viewBox="0 0 120 100" className="h-24 w-full text-white/90" aria-hidden>
          <path
            d="M 8 8 Q 40 88 108 92"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-85"
          />
          <polygon points="104,88 112,94 108,98" fill="currentColor" className="opacity-85" />
        </svg>
        <p
          className="-mt-6 font-[family-name:ui-serif,Georgia,serif] text-[11px] italic leading-tight text-amber-100/90"
          style={{ transform: "rotate(-8deg)" }}
        >
          You are here
        </p>
      </div>

      <div className="relative flex flex-col gap-3 pl-0 sm:pl-8">
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

        <div className="mx-auto h-4 w-px bg-gradient-to-b from-white/20 to-orange-500/50" aria-hidden />

        <div className="relative rounded-2xl border-2 border-orange-500 bg-gradient-to-br from-orange-500/25 to-orange-600/5 px-4 py-4 text-center shadow-[0_8px_32px_rgba(249,115,22,0.2)] ring-1 ring-orange-400/30">
          <div className="mb-1 flex items-center justify-center gap-2 text-orange-100">
            <Route className="h-4 w-4" aria-hidden />
            <span className="text-sm font-bold tracking-tight">Delivery Framework</span>
          </div>
          <p className="text-[11px] text-orange-200/75">Where this lesson sits in the stack</p>
        </div>

        <div className="mx-auto h-4 w-px bg-gradient-to-b from-orange-500/40 to-sky-500/40" aria-hidden />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border-2 border-sky-500/85 bg-gradient-to-br from-sky-500/15 to-transparent px-3 py-4 text-center shadow-[0_8px_24px_rgba(14,165,233,0.12)]">
            <BookOpen className="mx-auto mb-2 h-4 w-4 text-sky-300" aria-hidden />
            <span className="text-xs font-bold text-sky-100">Key Technologies</span>
          </div>
          <div className="rounded-2xl border-2 border-emerald-500/85 bg-gradient-to-br from-emerald-500/15 to-transparent px-3 py-4 text-center shadow-[0_8px_24px_rgba(16,185,129,0.12)]">
            <Puzzle className="mx-auto mb-2 h-4 w-4 text-emerald-300" aria-hidden />
            <span className="text-xs font-bold text-emerald-100">Patterns</span>
          </div>
        </div>

        <div className="mx-auto h-4 w-px bg-gradient-to-b from-emerald-500/30 to-rose-500/50" aria-hidden />

        <div className="relative rounded-2xl border-2 border-rose-500 bg-gradient-to-br from-rose-500/20 via-rose-600/10 to-transparent px-4 py-5 text-center shadow-[0_12px_40px_rgba(244,63,94,0.15)]">
          <Search className="absolute bottom-3 right-3 h-4 w-4 text-rose-300/60" aria-hidden />
          <Sparkles className="mx-auto mb-2 h-4 w-4 text-rose-200" aria-hidden />
          <span className="text-sm font-bold tracking-tight text-rose-50">Core Concepts</span>
          <p className="mt-1 text-[11px] text-rose-200/70">Foundation for everything above</p>
        </div>
      </div>

      <figcaption className="mt-6 text-center text-xs font-medium text-gray-500">
        Overall structure — how the course builds from concepts to practice
      </figcaption>
    </figure>
  );
}

const STEPS = [
  { n: 1, lines: ["Requirements"] as const, dashed: false },
  { n: 2, lines: ["Core Entities"] as const, dashed: false },
  { n: 3, lines: ["API or", "Interface"] as const, dashed: false },
  { n: 4, lines: ["Data Flow"] as const, dashed: true },
  { n: 5, lines: ["High-level", "Design"] as const, dashed: false },
  { n: 6, lines: ["Deep Dives"] as const, dashed: false },
] as const;

/** Six-step interview flow with feedback arcs; step 4 dashed (optional Data Flow). */
export function InterviewStructureFlowDiagram() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0b12] shadow-inner">
      <p className="border-b border-white/[0.06] px-4 py-3 text-center text-sm font-semibold text-white md:px-6">
        Here&apos;s the framework!
      </p>

      <div className="overflow-x-auto p-4 md:p-6">
        <div className="mx-auto min-w-[720px] max-w-[900px]">
          <svg viewBox="0 0 880 200" className="h-auto w-full" role="img" aria-labelledby="df-flow-title">
            <title id="df-flow-title">Recommended system design interview structure with feedback goals</title>
            <defs>
              <marker id="df-arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <polygon points="0 0, 7 3.5, 0 7" fill="#14b8a6" opacity="0.65" />
              </marker>
            </defs>
            {/* Arc labels */}
            <text x="440" y="14" textAnchor="middle" style={{ fontSize: "11px", fill: "#9ca3af" }}>
              Primary Goal: Satisfy Non-functional Requirements
            </text>
            <text x="440" y="30" textAnchor="middle" style={{ fontSize: "11px", fill: "#6b7280" }}>
              Primary Goal: Satisfy Functional Requirements
            </text>
            {/* Arcs */}
            <path
              d="M 760 175 Q 440 25 100 175"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="1.5"
              opacity="0.45"
              markerEnd="url(#df-arr)"
            />
            <path
              d="M 618 168 Q 400 55 250 168"
              fill="none"
              stroke="#5eead4"
              strokeWidth="1.5"
              opacity="0.35"
              markerEnd="url(#df-arr)"
            />
            {/* Step boxes */}
            {STEPS.map((s, i) => {
              const x = 20 + i * 140;
              const y = 95;
              const w = 118;
              const h = 52;
              const numR = 11;
              return (
                <g key={s.n}>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="10"
                    fill="rgba(45,212,191,0.07)"
                    stroke={s.dashed ? "rgba(45,212,191,0.55)" : "rgba(45,212,191,0.35)"}
                    strokeWidth="2"
                    strokeDasharray={s.dashed ? "5 4" : "0"}
                  />
                  <circle cx={x + 18} cy={y + 18} r={numR} fill={ACCENT} />
                  <text
                    x={x + 18}
                    y={y + 22}
                    textAnchor="middle"
                    style={{ fontSize: "12px", fill: "#fff", fontWeight: 700 }}
                  >
                    {s.n}
                  </text>
                  {s.lines.map((line, li) => (
                    <text
                      key={li}
                      x={x + w / 2}
                      y={y + 34 + li * 12}
                      textAnchor="middle"
                      style={{
                        fontSize: s.lines.length > 1 ? "9px" : "10px",
                        fill: "#e5e7eb",
                        fontWeight: 600,
                      }}
                    >
                      {line}
                    </text>
                  ))}
                  {i < 5 ? (
                    <text x={x + w + 11} y={y + 32} textAnchor="middle" style={{ fontSize: "14px", fill: "rgba(45,212,191,0.35)" }}>
                      →
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <figcaption className="border-t border-white/[0.06] px-4 py-3 text-center text-xs text-gray-500">
        Recommended system design interview structure
      </figcaption>
    </figure>
  );
}

const TWITTER_API_SNIPPET = `POST /v1/tweets
body: {
  "text": string
}

GET /v1/tweets/{tweetId} -> Tweet

POST /v1/follows
body: {
  "followee_id": string
}

GET /v1/feed -> Tweet[]`;

/** Twitter-style REST snippet with teal verbs and copy control. */
export function TwitterApiCodeBlock() {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(TWITTER_API_SNIPPET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0c0e18] shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
        <span className="font-mono text-xs font-medium text-gray-400">REST API · Twitter example</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.85] text-gray-300 md:text-sm">
        <TwitterApiLines />
      </pre>
    </div>
  );
}

function TwitterApiLines() {
  const lines: { key?: string; rest: string }[] = [
    { key: "POST", rest: " /v1/tweets" },
    { rest: "body: {" },
    { rest: `  "text": string` },
    { rest: "}" },
    { rest: "" },
    { key: "GET", rest: " /v1/tweets/{tweetId} -> Tweet" },
    { rest: "" },
    { key: "POST", rest: " /v1/follows" },
    { rest: "body: {" },
    { rest: `  "followee_id": string` },
    { rest: "}" },
    { rest: "" },
    { key: "GET", rest: " /v1/feed -> Tweet[]" },
  ];

  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line.key ? (
            <>
              <span style={{ color: ACCENT }} className="font-semibold">
                {line.key}
              </span>
              {line.rest}
            </>
          ) : (
            line.rest
          )}
        </span>
      ))}
    </>
  );
}
