"use client";

import React from "react";
import { ChevronRight, Lightbulb, AlertTriangle } from "lucide-react";

export function ShardingLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Sharding</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Learn how to split your database across multiple servers to handle massive scale.
        </p>
      </header>

      <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
        <img 
          src="/images/sharding_handdrawn.png" 
          alt="Database Sharding" 
          className="mx-auto max-w-2xl w-full h-auto drop-shadow-xl"
        />
      </div>

      <section id="sharding-intro" className="scroll-mt-12 space-y-4">
        <p className="leading-[1.8] text-gray-400">
          Sharding comes up when you&apos;ve outgrown a single database and need to split your data across multiple
          independent servers. This happens when you hit storage limits, write throughput limits, or read throughput
          that even replicas can&apos;t handle.
        </p>
        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              The biggest mistake with sharding is doing it too early. A well-tuned single database with read replicas
              can handle way more than most candidates think. Before proposing sharding, do the capacity math.
            </p>
          </div>
        </aside>
      </section>

      <section id="shard-key" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Choosing a Shard Key</h2>
        <p className="leading-[1.8] text-gray-400">
          The most important decision is your <strong className="text-white">shard key</strong>. For a user-centric
          app like Instagram, sharding by{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">user_id</code> means all of a
          user&apos;s posts, likes, and comments live on one shard. User-scoped queries are fast because they only hit
          one shard. But global queries like &ldquo;trending posts across all users&rdquo; become expensive because you
          have to hit every shard.
        </p>
        <p className="text-sm text-gray-400">A couple useful questions to pick a shard key:</p>
        <ul className="space-y-2 text-gray-400">
          {[
            "What are the most common queries in your system?",
            "Which entity is central to most queries?",
            "Will this create hot spots (disproportionate traffic on one shard)?",
          ].map((q) => (
            <li key={q} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span className="leading-[1.8]">{q}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="sharding-strategies" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Sharding Strategies</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { name: "Hash-Based", desc: "Hash the shard key and use modulo to pick a shard. Even distribution but hard to reshard.", color: "teal" },
            { name: "Range-Based", desc: "Partition by ranges of the key (e.g., user IDs 0–1M on shard 1). Can create hot spots.", color: "sky" },
            { name: "Directory-Based", desc: "A lookup table maps keys to shards. Most flexible but adds latency to every request.", color: "amber" },
          ].map((item) => (
            <div key={item.name} className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">{item.name}</p>
              <p className="text-xs leading-relaxed text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="sharding-problems" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Problems Sharding Creates</h2>
        <ul className="space-y-2 text-gray-400">
          {[
            ["Cross-shard transactions", "Nearly impossible — avoid them by designing your shard key to keep related data together."],
            ["Hot spots", "One shard gets disproportionate traffic — choose a shard key with high cardinality."],
            ["Resharding", "Adding a new shard without moving data is impossible — plan your shard key carefully upfront."],
          ].map(([problem, desc]) => (
            <li key={problem} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
              <span className="leading-[1.8]">
                <strong className="text-white">{problem}:</strong> {desc}
              </span>
            </li>
          ))}
        </ul>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              In interviews, bring up sharding after you&apos;ve justified why a single database won&apos;t work. Then
              clearly state your shard key choice and explain the tradeoff: fast for X queries, slow for Y queries.
            </p>
          </div>
        </aside>
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
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("caching")}>
            ← Previous: Caching
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20" onClick={() => onNavigate("consistent-hashing")}>
            Next: Consistent Hashing
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
