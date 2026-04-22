"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

function formatLocalHm12() {
  const n = new Date();
  const h = n.getHours() % 12 || 12;
  const m = n.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Split-screen product preview: code + MCQ, timer, progress, submit — matches assessment UX.
 */
export function JudgeYourSkillsHeroArt() {
  const reduce = useReducedMotion();
  const [clock, setClock] = useState("--:--");

  useEffect(() => {
    setClock(formatLocalHm12());
    const id = window.setInterval(() => setClock(formatLocalHm12()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      id="judge-skills-product-preview"
      className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto scroll-mt-28"
    >
      <Link
        href="/available-tests"
        className={cn(
          "group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        )}
        aria-label="Browse practice tests — MCQ and coding in one flow"
      >
        <motion.div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-primary/25",
            "bg-[#060d18] shadow-[0_28px_64px_-20px_rgba(0,0,0,0.75)]",
            "ring-1 ring-white/[0.06] transition-shadow group-hover:shadow-[0_32px_72px_-18px_rgba(20,184,166,0.12)]"
          )}
          whileHover={reduce ? undefined : { y: -3 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          {/* Top bar: timer + progress */}
          <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#030712] px-3 py-2.5 sm:px-4">
            <div
              className="flex items-center gap-1.5 rounded-md border border-primary/35 bg-primary/[0.08] px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums text-primary shadow-[0_0_16px_-4px_rgba(20,184,166,0.4)]"
              style={{
                fontFamily:
                  "var(--font-geist-mono), ui-monospace, monospace",
              }}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary/70">
                Time
              </span>
              {clock}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                <span>Progress</span>
                <span className="text-primary/90">Section 2 of 5</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/90">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary"
                  initial={{ width: "38%" }}
                  animate={
                    reduce
                      ? { width: "44%" }
                      : { width: ["38%", "48%", "42%", "44%"] }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { duration: 8, repeat: Infinity, ease: "easeInOut" }
                  }
                />
              </div>
            </div>
          </div>

          {/* Split: code | MCQ */}
          <div className="grid min-h-[200px] grid-cols-1 border-b border-white/[0.06] sm:grid-cols-2 sm:min-h-[220px]">
            {/* Code editor */}
            <div className="border-b border-white/[0.06] bg-[#0a0f1a] px-2.5 py-2.5 text-left sm:border-b-0 sm:border-r sm:border-white/[0.06]">
              <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/90" />
                Coding
              </div>
              <pre
                className="overflow-hidden font-mono text-[9px] leading-[1.55] sm:text-[10px]"
                style={{
                  fontFamily:
                    "var(--font-geist-mono), ui-monospace, monospace",
                }}
              >
                <code className="text-slate-500">
                  <span className="text-slate-600">1</span>
                  {"  "}
                  <span className="text-purple-400">def</span>{" "}
                  <span className="text-sky-300">two_sum</span>
                  (nums, target):
                  {"\n"}
                  <span className="text-slate-600">2</span>
                  {"     "}
                  <span className="text-slate-500">seen</span> = {}
                  {"\n"}
                  <span className="text-slate-600">3</span>
                  {"     "}
                  <span className="text-purple-400">for</span> i, n{" "}
                  <span className="text-purple-400">in</span>{" "}
                  <span className="text-amber-200/90">enumerate</span>(nums):
                  {"\n"}
                  <span className="text-slate-600">4</span>
                  {"         "}
                  <span className="text-purple-400">if</span> target - n{" "}
                  <span className="text-purple-400">in</span> seen:
                  {"\n"}
                  <span className="text-slate-600">5</span>
                  {"             "}
                  <span className="text-purple-400">return</span> [seen[target - n], i]
                  {"\n"}
                  <span className="text-slate-600">6</span>
                  {"         "}
                  seen[n] = i
                </code>
              </pre>
              {!reduce && (
                <motion.div
                  className="mt-2 h-0.5 w-8 rounded-full bg-primary/50"
                  animate={{ opacity: [0.4, 1, 0.4], x: [0, 48, 0] }}
                  transition={{
                    duration: 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>

            {/* MCQ */}
            <div className="bg-slate-950/80 px-3 py-2.5 text-left">
              <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                Multiple choice
              </div>
              <p className="mb-2.5 text-[11px] font-medium leading-snug text-slate-200">
                What is the optimal time complexity for two-sum with a hash map?
              </p>
              <ul className="space-y-1.5">
                {[
                  { l: "A", t: "O(n²)", on: false },
                  { l: "B", t: "O(n log n)", on: false },
                  { l: "C", t: "O(n)", on: true },
                  { l: "D", t: "O(1)", on: false },
                ].map((opt) => (
                  <li
                    key={opt.l}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-2 py-1 text-[10px] font-medium",
                      opt.on
                        ? "border-primary/55 bg-primary/15 text-primary"
                        : "border-white/[0.06] bg-slate-900/50 text-slate-400"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px]",
                        opt.on
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-slate-600"
                      )}
                    >
                      {opt.on ? "✓" : ""}
                    </span>
                    {opt.t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer: submit */}
          <div className="flex items-center justify-between gap-3 bg-[#05080f] px-3 py-2.5 sm:px-4">
            <span className="text-[9px] font-medium text-slate-500">
              Autosave on
            </span>
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-lg border border-primary/40",
                "bg-primary px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground",
                "shadow-[0_0_22px_-4px_rgba(20,184,166,0.45)]"
              )}
            >
              Submit Test
            </span>
          </div>
        </motion.div>
      </Link>

      <p className="relative mt-4 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
        Same split layout as live company-style assessments
      </p>
    </div>
  );
}
