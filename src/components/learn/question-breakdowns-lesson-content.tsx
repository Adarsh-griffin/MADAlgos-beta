"use client";

import React from "react";
import { ChevronRight, Lightbulb } from "lucide-react";
import { LoginProgressToggle } from "@/components/learn/LoginProgressToggle";

const QUESTIONS = [
  { name: "Bit.ly (URL Shortener)", difficulty: "Easy" as const, tags: ["Hashing", "NoSQL", "Caching"] },
  { name: "Dropbox", difficulty: "Easy" as const, tags: ["Object Storage", "Sync", "Chunking"] },
  { name: "Local Delivery Service", difficulty: "Easy" as const, tags: ["Geospatial", "Matching"] },
  { name: "News Aggregator", difficulty: "Easy" as const, tags: ["RSS", "Crawling", "Ranking"] },
  { name: "Ticketmaster", difficulty: "Medium" as const, tags: ["Concurrency", "Locking", "Consistency"] },
  { name: "Facebook News Feed", difficulty: "Medium" as const, tags: ["Fan-out", "Ranking", "Caching"] },
  { name: "Tinder", difficulty: "Medium" as const, tags: ["Geospatial", "Matching", "Swipe"] },
  { name: "LeetCode (Online Judge)", difficulty: "Medium" as const, tags: ["Job Queue", "Sandboxing"] },
  { name: "WhatsApp", difficulty: "Medium" as const, tags: ["WebSockets", "Messaging", "Encryption"] },
  { name: "Yelp", difficulty: "Medium" as const, tags: ["Geospatial", "Search", "Reviews"] },
  { name: "Rate Limiter", difficulty: "Medium" as const, tags: ["Token Bucket", "Redis", "API Gateway"] },
  { name: "Online Auction", difficulty: "Medium" as const, tags: ["Concurrency", "Bidding", "Events"] },
  { name: "Instagram", difficulty: "Hard" as const, tags: ["Feed", "Media", "CDN", "Scale"] },
  { name: "YouTube", difficulty: "Hard" as const, tags: ["Video", "CDN", "Transcoding", "Search"] },
  { name: "Uber", difficulty: "Hard" as const, tags: ["Geospatial", "Matching", "Real-time"] },
  { name: "Google Docs", difficulty: "Hard" as const, tags: ["CRDT", "OT", "Collaboration"] },
  { name: "Distributed Cache", difficulty: "Hard" as const, tags: ["Consistent Hashing", "Eviction", "Redis"] },
  { name: "Web Crawler", difficulty: "Hard" as const, tags: ["BFS", "Deduplication", "Bloom Filter"] },
  { name: "Ad Click Aggregator", difficulty: "Hard" as const, tags: ["Stream Processing", "Lambda Arch"] },
  { name: "Payment System", difficulty: "Hard" as const, tags: ["Idempotency", "ACID", "2PC"] },
];

const DIFF_STYLE: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400",
  Medium: "bg-amber-500/15 text-amber-400",
  Hard: "bg-rose-500/15 text-rose-400",
};

export function QuestionBreakdownsLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Question Breakdowns</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Worked solutions to the most common system design interview questions. Study these after learning the
          concepts.
        </p>
      </header>

      <section id="qb-how-to-use" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">How to Use Question Breakdowns</h2>
        <p className="leading-[1.8] text-gray-400">
          Question breakdowns are{" "}
          <strong className="text-white">not a substitute for designing systems yourself</strong>. They are learning
          tools. The right approach is:
        </p>
        <ol className="list-none space-y-3 pl-0">
          {[
            "Choose a question from the list below.",
            "Design the system yourself on paper or a whiteboard (set a timer for 45 minutes).",
            "Only then read the breakdown to compare your approach.",
            "Note what you missed and which concepts to revisit.",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-400">
                {i + 1}
              </span>
              <span className="leading-[1.8] text-gray-400">{step}</span>
            </li>
          ))}
        </ol>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              A common failure mode is to read breakdowns passively without designing first. The interview simulates
              actually designing a system — you need the reps of doing it yourself to build the right intuition.
            </p>
          </div>
        </aside>
      </section>

      <section id="qb-list" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">Question List</h2>
        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Question</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Key Concepts</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {QUESTIONS.map((q) => (
                <tr key={q.name} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-medium text-gray-300">{q.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {q.tags.map((tag) => (
                        <span key={tag} className="inline-block rounded bg-white/[0.06] px-2 py-0.5 text-[11px] text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${DIFF_STYLE[q.difficulty]}`}>
                      {q.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500">
          Individual breakdowns with full worked solutions are coming soon. Start by designing these systems yourself
          using the Delivery Framework.
        </p>
      </section>

      <LoginProgressToggle />

      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("common-patterns-intro")}>
            ← Previous: Common Patterns
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20" onClick={() => onNavigate("introduction")}>
            Back to Start
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
