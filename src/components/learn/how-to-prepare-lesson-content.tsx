"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Lightbulb, Calendar } from "lucide-react";
import { LoginProgressToggle } from "@/components/learn/LoginProgressToggle";

const QUESTIONS: { name: string; difficulty: "Easy" | "Medium" | "Hard" }[] = [
  { name: "Bit.ly", difficulty: "Easy" },
  { name: "Dropbox", difficulty: "Easy" },
  { name: "Local Delivery Service", difficulty: "Easy" },
  { name: "News Aggregator", difficulty: "Easy" },
  { name: "Ticketmaster", difficulty: "Medium" },
  { name: "FB News Feed", difficulty: "Medium" },
  { name: "Tinder", difficulty: "Medium" },
  { name: "LeetCode", difficulty: "Medium" },
  { name: "WhatsApp", difficulty: "Medium" },
  { name: "Yelp", difficulty: "Medium" },
  { name: "Strava", difficulty: "Medium" },
  { name: "Rate Limiter", difficulty: "Medium" },
  { name: "Online Auction", difficulty: "Medium" },
  { name: "FB Live Comments", difficulty: "Medium" },
  { name: "FB Post Search", difficulty: "Medium" },
  { name: "Price Tracking Service", difficulty: "Medium" },
  { name: "Instagram", difficulty: "Hard" },
  { name: "YouTube Top K", difficulty: "Hard" },
  { name: "Uber", difficulty: "Hard" },
  { name: "Robinhood", difficulty: "Hard" },
  { name: "Google Docs", difficulty: "Hard" },
  { name: "Distributed Cache", difficulty: "Hard" },
  { name: "YouTube", difficulty: "Hard" },
  { name: "Job Scheduler", difficulty: "Hard" },
  { name: "Web Crawler", difficulty: "Hard" },
  { name: "Ad Click Aggregator", difficulty: "Hard" },
  { name: "Payment System", difficulty: "Hard" },
  { name: "Metrics Monitoring", difficulty: "Hard" },
];

const DIFF_STYLE: Record<string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400",
  Medium: "bg-amber-500/15 text-amber-400",
  Hard: "bg-rose-500/15 text-rose-400",
};

export function HowToPrepareLessonContent({ onNavigate }: { onNavigate: (lessonId: string) => void }) {
  const router = useRouter();

  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 id="page-title" className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          How to Prepare
        </h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          This prep path is based on repeatable patterns that consistently help candidates perform better in top-tier interviews.
        </p>
      </header>

      {/* ─── Build a Foundation ─── */}
      <section id="build-foundation" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Build a Foundation</h2>

        <ol className="list-none space-y-6 pl-0">
          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              1
            </span>
            <div className="leading-[1.8] text-gray-400">
              <strong className="text-white">Understand what a system design interview is:</strong>{" "}
              If this is your first system design interview, that&apos;s completely normal. Start by
              reading our{" "}
              <button
                type="button"
                onClick={() => onNavigate("introduction")}
                className="font-medium text-teal-400 underline decoration-teal-400/30 hover:text-teal-300"
              >
                intro to system design
              </button>{" "}
              or watching a video of a mock system design interview.
            </div>
          </li>

          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              2
            </span>
            <div className="leading-[1.8] text-gray-400">
              <strong className="text-white">Choose a delivery framework:</strong>{" "}
              System design interviews move quickly, so you need a clear roadmap to avoid scope creep. We recommend our{" "}
              <button
                type="button"
                onClick={() => onNavigate("delivery-framework")}
                className="font-medium text-teal-400 underline decoration-teal-400/30 hover:text-teal-300"
              >
                Delivery Framework
              </button>
              . This becomes your default structure on interview day so your discussion stays focused and complete.
            </div>
          </li>

          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              3
            </span>
            <div className="leading-[1.8] text-gray-400">
              <strong className="text-white">Start with the basics:</strong>{" "}
              If system design is new, begin with foundational concepts and map the scope of knowledge required. Start with{" "}
              <span className="font-medium text-teal-400">Core Concepts</span>,{" "}
              <span className="font-medium text-teal-400">Key Technologies</span>, and{" "}
              <span className="font-medium text-teal-400">Common Patterns</span>{" "}
              used in system design interviews. These overviews are intentionally high-level and help you form the
              mental model you&apos;ll later apply during live design discussions.
            </div>
          </li>
        </ol>
      </section>

      {/* ─── Practice Practice Practice ─── */}
      <section id="practice" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Practice Practice Practice</h2>

        <p className="leading-[1.8] text-gray-400">
          Once the foundation is set, move into active practice. Reading helps, but you&apos;ll retain{" "}
          <strong className="text-white">10x more information</strong> by actually doing.
        </p>

        <ol className="list-none space-y-6 pl-0">
          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              1
            </span>
            <div className="leading-[1.8] text-gray-400">
              <strong className="text-white">Choose a question:</strong>{" "}
              Select a question from the list of common questions below.
            </div>
          </li>

          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              2
            </span>
            <div className="leading-[1.8] text-gray-400">
              <strong className="text-white">Read the requirements:</strong>{" "}
              Understand the requirements of the system you&apos;ll need to design.
            </div>
          </li>

          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              3
            </span>
            <div className="leading-[1.8] text-gray-400">
              <strong className="text-white">Try to answer on your own:</strong>{" "}
              Either practice with our Guided Practices (below) or on a virtual whiteboard like{" "}
              <a
                href="https://excalidraw.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-400 underline decoration-teal-400/30 hover:text-teal-300"
              >
                Excalidraw
              </a>
              .
            </div>
          </li>

          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              4
            </span>
            <div className="leading-[1.8] text-gray-400">
              <strong className="text-white">Read the answer key:</strong>{" "}
              Attempt the problem first, then read the answer key to compare how your answer
              compares.
            </div>
          </li>

          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              5
            </span>
            <div className="leading-[1.8] text-gray-400">
              <strong className="text-white">Put your knowledge to the test:</strong>{" "}
              Once you&apos;ve done a few questions and are feeling comfortable, put your knowledge to the test
              by scheduling a{" "}
              <Link
                href="/book-mock"
                className="font-medium text-teal-400 underline decoration-teal-400/30 hover:text-teal-300"
              >
                mock interview
              </Link>{" "}
              with an interviewer from your target company.
            </div>
          </li>
        </ol>
      </section>

      {/* ─── Interview Questions Table ─── */}
      <section id="questions" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">Interview Questions</h2>

        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Question
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {QUESTIONS.map((q) => (
                <tr key={q.name} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-medium text-gray-300">{q.name}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${DIFF_STYLE[q.difficulty]}`}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Login progress toggle */}
      <LoginProgressToggle />

      {/* Navigation + CTA */}
      <section id="next-steps" className="scroll-mt-12 space-y-6 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline"
            onClick={() => onNavigate("introduction")}
          >
            &larr; Previous: Introduction
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20"
            onClick={() => onNavigate("delivery-framework")}
          >
            Next: Delivery Framework
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mock interview CTA card */}
        <div className="overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-b from-teal-500/10 to-transparent">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-base font-bold text-white">Schedule a mock interview</p>
              <p className="text-sm leading-relaxed text-gray-400">
                Meet with a FAANG senior+ engineer or manager and learn exactly what it takes to get the job.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/book-mock")}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-teal-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-teal-400"
            >
              <Calendar className="h-4 w-4" />
              Book now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
