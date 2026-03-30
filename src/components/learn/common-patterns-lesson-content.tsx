"use client";

import React from "react";
import { ChevronRight, Info, Lightbulb } from "lucide-react";

const PATTERNS = [
  {
    id: "fanout",
    name: "Fan-out",
    when: "Push-based feed delivery (Twitter, Instagram), notifications to many users",
    desc: "When a user posts, their content is \"fanned out\" — written to all followers' feeds. Fast reads at the cost of slow/expensive writes. Use for celebrities with small follower counts; switch to pull (fan-in) for mega-influencers.",
    tradeoff: "Write amplification — a user with 10M followers means 10M writes per post.",
  },
  {
    id: "event-sourcing",
    name: "Event Sourcing / CQRS",
    when: "Audit logs, financial ledgers, systems requiring full history replay",
    desc: "Instead of storing the current state, store a sequence of events that led to the state. The current state is derived by replaying events. CQRS separates the read model (queries) from the write model (commands).",
    tradeoff: "Increased complexity. Not suitable if you just need simple CRUD.",
  },
  {
    id: "saga",
    name: "Saga Pattern",
    when: "Distributed transactions across microservices (e-commerce checkout, booking)",
    desc: "A sequence of local transactions, each publishing events to trigger the next. If a step fails, compensating transactions undo the previous steps. Two flavors: choreography (event-driven) and orchestration (central coordinator).",
    tradeoff: "Complexity of compensating transactions. Hard to debug.",
  },
  {
    id: "rate-limiting",
    name: "Rate Limiting",
    when: "API protection, preventing abuse, fair usage enforcement",
    desc: "Limit how many requests a client can make per time window. Common algorithms: Token Bucket (allows bursts), Leaky Bucket (smooth output), Fixed Window Counter (simple), Sliding Window Log (precise). Usually implemented at the API gateway or with Redis counters.",
    tradeoff: "Rejecting legitimate requests if limits are too tight.",
  },
  {
    id: "circuit-breaker",
    name: "Circuit Breaker",
    when: "Microservices calling potentially failing downstream services",
    desc: "Wraps a service call. In CLOSED state, it passes calls through. If failures exceed a threshold, it OPENS — immediately returning errors to callers without calling the service. After a timeout, it goes HALF-OPEN to test recovery.",
    tradeoff: "Adds complexity. Service must handle graceful degradation when the circuit is open.",
  },
  {
    id: "write-ahead-log",
    name: "Write-Ahead Log (WAL)",
    when: "Database durability, Kafka's durable storage, distributed consensus",
    desc: "Before making changes to data, write the operation to a log. If the system crashes, the log is replayed to restore state. Enables crash recovery and replication. Used internally by PostgreSQL, MySQL, Kafka.",
    tradeoff: "Extra disk I/O. Log becomes a bottleneck at extreme throughput.",
  },
  {
    id: "two-phase-commit",
    name: "Two-Phase Commit (2PC)",
    when: "Atomic transactions across multiple databases or services",
    desc: "Phase 1 (Prepare): Coordinator asks all participants if they can commit. Phase 2 (Commit): If all say yes, coordinator sends commit; otherwise sends rollback. Guarantees atomicity across distributed nodes.",
    tradeoff: "Latency overhead. Coordinator is a single point of failure. Blocking if coordinator crashes.",
  },
  {
    id: "bloom-filter",
    name: "Bloom Filter",
    when: "Quickly checking if an item definitely doesn't exist (URL deduplication, cache miss reduction)",
    desc: "A probabilistic data structure that can tell you if an item is definitely not in a set, or might be in a set. Never has false negatives, but can have false positives. Extremely memory-efficient compared to a hash set.",
    tradeoff: "False positives require additional DB lookup. Cannot remove elements in basic form.",
  },
];

export function CommonPatternsLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Common Patterns</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Recurring architectural patterns that solve specific problems in system design interviews.
        </p>
      </header>

      <section id="patterns-intro" className="scroll-mt-12 space-y-4">
        <p className="leading-[1.8] text-gray-400">
          Patterns are higher-level solutions that combine core concepts and technologies to solve recurring problems.
          Unlike technologies (which are specific tools), patterns are strategies — they can be implemented in many
          ways.
        </p>
        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              In interviews, naming a pattern shows you have prior experience solving this class of problem. But always
              explain <strong className="text-white">why</strong> you&apos;re choosing it — the tradeoffs matter as
              much as the pattern name.
            </p>
          </div>
        </aside>
      </section>

      {PATTERNS.map((pattern) => (
        <section key={pattern.id} id={pattern.id} className="scroll-mt-12 space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div>
            <h2 className="text-xl font-bold text-white">{pattern.name}</h2>
            <p className="mt-1 text-xs text-teal-400">Use when: {pattern.when}</p>
          </div>
          <p className="text-sm leading-[1.8] text-gray-400">{pattern.desc}</p>
          <div className="rounded-lg border-l-3 border-amber-500/50 bg-amber-500/[0.06] px-3 py-2 text-xs text-gray-400">
            <strong className="text-amber-400">Tradeoff:</strong> {pattern.tradeoff}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-400">
        <span className="text-[13px]">Login to track your progress</span>
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" className="peer sr-only" disabled />
          <div className="h-5 w-9 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white/40 after:transition-all peer-checked:bg-teal-500 peer-checked:after:translate-x-full" />
        </label>
      </div>

      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("key-technologies-intro")}>
            ← Previous: Key Technologies
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20" onClick={() => onNavigate("question-breakdowns-intro")}>
            Next: Question Breakdowns
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
