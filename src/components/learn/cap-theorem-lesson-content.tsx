"use client";

import React from "react";
import { ChevronRight, Info, Lightbulb } from "lucide-react";
import { LoginProgressToggle } from "@/components/learn/LoginProgressToggle";

export function CAPTheoremLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">CAP Theorem</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Master the fundamental tradeoffs between consistency and availability in distributed systems.
        </p>
      </header>

      <section id="what-is-cap" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">What is CAP Theorem?</h2>
        <p className="leading-[1.8] text-gray-400">
          CAP theorem states that in a distributed system, you can only have{" "}
          <strong className="text-white">two out of three</strong> properties: Consistency, Availability, and Partition
          Tolerance. Since network partitions are unavoidable, you are really choosing between consistency and
          availability.
        </p>

        <figure className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/50 p-5 md:p-8">
          <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
            <div className="rounded-xl border-2 border-teal-500 bg-teal-500/10 px-6 py-3 text-center text-sm font-bold text-white">
              Consistency
            </div>
            <div className="flex w-full justify-between gap-4">
              <div className="flex-1">
                <div className="rounded-xl border-2 border-sky-500 bg-sky-500/10 px-3 py-3 text-center text-sm font-bold text-white">Availability</div>
              </div>
              <div className="flex-1">
                <div className="rounded-xl border-2 border-amber-500 bg-amber-500/10 px-3 py-3 text-center text-sm font-bold text-white">Partition Tolerance</div>
              </div>
            </div>
          </div>
          <figcaption className="mt-4 text-center text-xs text-gray-500">Pick two of three</figcaption>
        </figure>
      </section>

      <section id="choose-consistency" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">When to Choose Consistency</h2>
        <p className="leading-[1.8] text-gray-400">Choose consistency when stale data causes actual business problems:</p>
        <ul className="space-y-2 text-gray-400">
          {[
            ["Ticket Booking", "Prevent double-booking the same seat"],
            ["E-commerce Inventory", "Prevent overselling limited stock"],
            ["Financial Systems", "Accurate stock order books and account balances"],
          ].map(([item, desc]) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
              <span><strong className="text-white">{item}:</strong> {desc}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-400">
          <strong className="text-white">Technologies:</strong> PostgreSQL, MySQL, Google Spanner, DynamoDB (strong consistency mode).
        </p>
      </section>

      <section id="choose-availability" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">When to Choose Availability</h2>
        <p className="leading-[1.8] text-gray-400">Most systems can tolerate eventual consistency and should prioritize availability:</p>
        <ul className="space-y-2 text-gray-400">
          {[
            ["Social Media", "Seeing a slightly old profile picture for a few minutes is fine"],
            ["Content Platforms", "Outdated movie descriptions temporarily are acceptable"],
            ["Review Sites", "Slightly outdated hours are better than no information"],
          ].map(([item, desc]) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span><strong className="text-white">{item}:</strong> {desc}</span>
            </li>
          ))}
        </ul>
        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>In interviews, the safe answer is eventual consistency unless the problem involves money, inventory, or booking limited resources.</p>
          </div>
        </aside>
      </section>

      <section id="cap-mixed" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Mixed Requirements</h2>
        <p className="leading-[1.8] text-gray-400">
          Real systems often need different consistency models for different features:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { title: "Ticketmaster", consistent: "Booking a seat (no double-booking)", available: "Viewing available seats" },
            { title: "Tinder", consistent: "Creating a match (both see it)", available: "Viewing user profiles" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="text-xs text-gray-400"><span className="text-teal-400 font-medium">Consistent:</span> {item.consistent}</p>
              <p className="text-xs text-gray-400"><span className="text-sky-400 font-medium">Available:</span> {item.available}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="consistency-spectrum" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Consistency Spectrum</h2>
        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                {["Model", "Description", "Use Case"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {[
                ["Strong", "All reads reflect the most recent write", "Banking, inventory, booking"],
                ["Causal", "Related events appear in same order to all", "Comments always after post"],
                ["Read-your-own-writes", "Users see their own updates immediately", "Social media profiles"],
                ["Eventual", "Becomes consistent over time", "DNS, social feeds, reviews"],
              ].map(([model, desc, use]) => (
                <tr key={model} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-semibold text-white">{model}</td>
                  <td className="px-4 py-3 text-gray-400">{desc}</td>
                  <td className="px-4 py-3 text-gray-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <LoginProgressToggle />

      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("consistent-hashing")}>
            ← Previous: Consistent Hashing
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
