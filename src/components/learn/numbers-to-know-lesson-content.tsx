"use client";

import React from "react";
import { ChevronRight, Lightbulb } from "lucide-react";

const LATENCY_DATA = [
  { op: "L1 cache reference", ns: "0.5 ns", category: "cpu" },
  { op: "Branch mispredict", ns: "5 ns", category: "cpu" },
  { op: "L2 cache reference", ns: "7 ns", category: "cpu" },
  { op: "Mutex lock/unlock", ns: "25 ns", category: "cpu" },
  { op: "Main memory (RAM) reference", ns: "100 ns", category: "ram" },
  { op: "Compress 1K bytes with Snappy", ns: "3 µs", category: "ram" },
  { op: "Read 1 MB sequentially from RAM", ns: "9 µs", category: "ram" },
  { op: "Read 4K from SSD", ns: "150 µs", category: "ssd" },
  { op: "Read 1 MB sequentially from SSD", ns: "1 ms", category: "ssd" },
  { op: "Round trip within same datacenter", ns: "0.5 ms", category: "network" },
  { op: "Read 1 MB sequentially from HDD", ns: "20 ms", category: "hdd" },
  { op: "Disk seek (HDD)", ns: "10 ms", category: "hdd" },
  { op: "Send packet CA → Netherlands → CA", ns: "150 ms", category: "network" },
  { op: "Redis GET operation", ns: "~0.5 ms", category: "kv" },
  { op: "DB query (cold, no index)", ns: "~100 ms", category: "db" },
  { op: "DB query (warm, with index)", ns: "~1-5 ms", category: "db" },
];

const SCALE_DATA = [
  { qty: "1 KB", desc: "An email body", example: "~1,000 chars" },
  { qty: "1 MB", desc: "A high-res phone photo (compressed)", example: "~1 million bytes" },
  { qty: "1 GB", desc: "A 2-hour HD movie (compressed)", example: "~1 billion bytes" },
  { qty: "1 TB", desc: "A large disk drive", example: "~1 trillion bytes" },
  { qty: "1 PB", desc: "YouTube uploads per day (est.)", example: "~1 quadrillion bytes" },
  { qty: "10,000 RPS", desc: "Medium-size API server", example: "Can handle ~1B req/day" },
  { qty: "100,000 RPS", desc: "Large web app (with load balancing)", example: "~8.6B req/day" },
  { qty: "1M RPS", desc: "Global top-100 website", example: "~86B req/day" },
];

const CATEGORY_COLOR: Record<string, string> = {
  cpu: "bg-emerald-500/15 text-emerald-400",
  ram: "bg-blue-500/15 text-blue-400",
  ssd: "bg-amber-500/15 text-amber-400",
  hdd: "bg-orange-500/15 text-orange-400",
  network: "bg-purple-500/15 text-purple-400",
  kv: "bg-teal-500/15 text-teal-400",
  db: "bg-rose-500/15 text-rose-400",
};

const CATEGORY_LABEL: Record<string, string> = {
  cpu: "CPU",
  ram: "RAM",
  ssd: "SSD",
  hdd: "HDD",
  network: "Network",
  kv: "Cache",
  db: "Database",
};

export function NumbersToKnowLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Numbers to Know</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          A quick reference for the latency numbers and scale estimates every engineer should have in their head during
          a system design interview.
        </p>
      </header>

      <section id="why-numbers-matter" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">Why These Numbers Matter</h2>
        <p className="leading-[1.8] text-gray-400">
          System design is about making tradeoffs. To make intelligent tradeoffs, you need a rough intuition for
          orders-of-magnitude differences in speed and scale. A cache hit is 200× faster than a disk read. A local
          network round-trip is 300× faster than a transatlantic one. These numbers let you justify your design choices
          with concrete reasoning rather than hand-waving.
        </p>
        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              You don&apos;t need to memorize exact nanoseconds. You need to know{" "}
              <strong className="text-white">relative orders of magnitude</strong>:{" "}
              Cache &lt;&lt; RAM &lt;&lt; SSD &lt;&lt; HDD ≈ Network. That&apos;s what interviewers want to see.
            </p>
          </div>
        </aside>
      </section>

      {/* Latency Table */}
      <section id="latency-numbers" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">Latency Numbers (Jeff Dean's Numbers, Updated)</h2>
        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Operation</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Latency</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {LATENCY_DATA.map((row) => (
                <tr key={row.op} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 text-gray-300 text-[13px]">{row.op}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-[13px] font-medium text-white">{row.ns}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CATEGORY_COLOR[row.category]}`}>
                      {CATEGORY_LABEL[row.category]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scale estimates */}
      <section id="scale-estimates" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">Scale Estimates</h2>
        <p className="leading-[1.8] text-gray-400">
          Use these reference points during capacity estimation to sanity-check your numbers:
        </p>
        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Quantity</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">What it represents</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Perspective</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {SCALE_DATA.map((row) => (
                <tr key={row.qty} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 font-mono text-[13px] font-bold text-teal-400">{row.qty}</td>
                  <td className="px-4 py-2.5 text-[13px] text-gray-300">{row.desc}</td>
                  <td className="px-4 py-2.5 text-right text-[12px] text-gray-500">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick math */}
      <section id="quick-math" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">Quick Interview Math</h2>
        <p className="leading-[1.8] text-gray-400">
          Being able to do back-of-napkin calculations quickly impresses interviewers. Useful shortcuts:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "Seconds in a day", val: "~86,400 ≈ 100K" },
            { label: "Seconds in a year", val: "~31.5M ≈ 30M" },
            { label: "1M users × 100 req/day", val: "~1,000 RPS" },
            { label: "1B users × 10 req/day", val: "~100,000 RPS" },
            { label: "1 char = 1 byte (ASCII)", val: "1 tweet ≈ 280 bytes" },
            { label: "1M records × 100 bytes", val: "≈ 100 MB" },
            { label: "1B records × 1 KB", val: "≈ 1 TB" },
            { label: "Video: 1 hour HD", val: "≈ 1-4 GB" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3">
              <span className="text-sm text-gray-400">{item.label}</span>
              <span className="font-mono text-sm font-bold text-teal-400">{item.val}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-400">
        <span className="text-[13px]">Login to track your progress</span>
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" className="peer sr-only" disabled />
          <div className="h-5 w-9 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white/40 after:transition-all peer-checked:bg-teal-500 peer-checked:after:translate-x-full" />
        </label>
      </div>

      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("database-indexing")}>
            ← Previous: Database Indexing
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20" onClick={() => onNavigate("key-technologies-intro")}>
            Next: Key Technologies
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
