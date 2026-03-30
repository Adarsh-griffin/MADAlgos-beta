"use client";

import React from "react";
import { ChevronRight, Info, Lightbulb } from "lucide-react";
import { LoginProgressToggle } from "@/components/learn/LoginProgressToggle";

export function ConsistentHashingLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Consistent Hashing</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Minimal data movement during elastic scaling of distributed systems.
        </p>
      </header>

      <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
        <img 
          src="/images/consistent_hashing_handdrawn.png" 
          alt="Consistent Hashing Ring" 
          className="mx-auto max-w-md w-full h-auto drop-shadow-xl"
        />
      </div>

      <section id="ch-problem" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">The Problem It Solves</h2>
        <p className="leading-[1.8] text-gray-400">
          Consistent hashing solves a specific problem with distributed caches and sharded databases. When you use simple
          hash-based distribution ({" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">hash(key) % N</code> to pick which
          server stores the data), adding or removing a server changes N. That means{" "}
          <strong className="text-white">almost every key maps to a different server</strong>, so you&apos;d have to
          move most of your data around.
        </p>
        <p className="leading-[1.8] text-gray-400">
          With simple modulo hashing, adding one server to a 10-server cluster means moving roughly{" "}
          <strong className="text-white">90%</strong> of your data. With consistent hashing, you only move about{" "}
          <strong className="text-white">10%</strong>.
        </p>
      </section>

      <section id="ch-how" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">How It Works</h2>
        <p className="leading-[1.8] text-gray-400">
          Consistent hashing fixes this by arranging both servers and keys on a{" "}
          <strong className="text-white">virtual ring</strong>. You hash each key and place it on the ring, then the
          key belongs to the next server going clockwise. When you add a new server, only the keys between that new
          server and the previous server need to move. Everything else stays put.
        </p>

      </section>

      <section id="ch-virtual-nodes" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Virtual Nodes</h2>
        <p className="leading-[1.8] text-gray-400">
          A problem with basic consistent hashing is uneven distribution — some servers end up with more keys than
          others. The solution is <strong className="text-white">virtual nodes</strong>: each physical server gets
          multiple positions on the ring. This creates much more even distribution and makes it easy to weight servers
          by capacity (a bigger server gets more virtual nodes).
        </p>

        <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
            <p>
              In interviews, you rarely need to explain how consistent hashing works unless specifically asked. It&apos;s
              enough to say &ldquo;we&apos;ll use consistent hashing to distribute data across cache nodes&rdquo; when
              talking about a distributed cache. The main time to bring it up is when discussing elastic scaling.
            </p>
          </div>
        </aside>
      </section>

      <section id="ch-use-cases" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">When to Use It</h2>
        <ul className="space-y-2 text-gray-400">
          {[
            ["Distributed Caches", "Redis clusters or Memcached pools that need to scale elastically."],
            ["Sharded Databases", "Distributing data across database shards when you need to add/remove nodes."],
            ["CDN Edge Routing", "Routing requests to consistent edge nodes for better cache utilization."],
            ["Load Balancers", "Sticky sessions — routing the same client to the same server."],
          ].map(([use, desc]) => (
            <li key={use} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span className="leading-[1.8]">
                <strong className="text-white">{use}:</strong> {desc}
              </span>
            </li>
          ))}
        </ul>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              Real systems that use consistent hashing include Amazon DynamoDB, Apache Cassandra, and Redis Cluster.
              Knowing this makes your answer more credible in interviews.
            </p>
          </div>
        </aside>
      </section>

      <LoginProgressToggle />

      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("sharding")}>
            ← Previous: Sharding
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20" onClick={() => onNavigate("cap-theorem")}>
            Next: CAP Theorem
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
