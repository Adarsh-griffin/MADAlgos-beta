"use client";

import React from "react";
import { ChevronRight, Lightbulb, AlertTriangle, Info } from "lucide-react";
import { LoginProgressToggle } from "@/components/learn/LoginProgressToggle";

export function KeyTechnologiesLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  const TECH_CATEGORIES = [
    {
      id: "databases",
      label: "Core Database",
      color: "teal",
      items: [
        { name: "PostgreSQL / MySQL", type: "Relational", when: "Structured relational data, strong consistency, transactional workloads. Safe default for product systems." },
        { name: "DynamoDB / Cassandra", type: "NoSQL (Wide-column)", when: "Horizontal scale and high write throughput where access patterns are defined up front." },
        { name: "MongoDB", type: "NoSQL (Document)", when: "Document-oriented data with flexible schemas and nested structures (for example, content/catalog domains)." },
        { name: "Redis", type: "In-Memory / Cache", when: "Low-latency caching, sessions, leaderboards, pub/sub, and rate-limit counters." },
      ],
    },
    {
      id: "queues",
      label: "Message Queues",
      color: "amber",
      items: [
        { name: "Kafka", type: "Distributed Log", when: "High-throughput event pipelines, audit history, and replayable streams." },
        { name: "RabbitMQ / SQS", type: "Message Broker", when: "Background job queues and async service decoupling with single-consumer semantics." },
        { name: "Redis Pub/Sub", type: "Pub/Sub", when: "Lightweight real-time fan-out when replay durability is not required." },
      ],
    },
    {
      id: "search",
      label: "Search",
      color: "sky",
      items: [
        { name: "Elasticsearch", type: "Full-Text Search Engine", when: "Full-text search, log analysis, complex queries. Syncs from primary DB via CDC." },
        { name: "Algolia", type: "Managed Search", when: "Instant search with typo tolerance, managed service. Great for product search in interviews." },
      ],
    },
    {
      id: "storage",
      label: "Object Storage",
      color: "purple",
      items: [
        { name: "AWS S3 / GCS", type: "Blob Storage", when: "Images, videos, files, large blobs. Cheap, durable, infinitely scalable. Not for tiny frequent updates." },
        { name: "CDN (CloudFront / Cloudflare)", type: "Content Delivery", when: "Serve static assets from edge nodes close to users. Always pair with S3 for media." },
      ],
    },
  ];

  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Key Technologies</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          System design is about composing the right building blocks for a given constraint set. You should be able to
          name at least one reliable option in every major technology category.
        </p>
      </header>

      <section id="kt-intro" className="scroll-mt-12 space-y-4">
        <p className="leading-[1.8] text-gray-400">
          Most interviewers care less about the exact brand and more about your reasoning. If you can pick{" "}
          <em>one</em> technology per category and explain why it fits, you are in good shape. This section covers the
          categories that appear in the majority of system design rounds.
        </p>
        <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
            <p>
              You don&apos;t need to memorize the API of every technology. You need to know what problem each category
              solves, when to reach for it, and one or two concrete examples you can name confidently.
            </p>
          </div>
        </aside>
      </section>

      {TECH_CATEGORIES.map((cat) => (
        <section key={cat.id} id={cat.id} className="scroll-mt-12 space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-white">{cat.label}</h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.08]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                  {["Technology", "Type", "When to Choose"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {cat.items.map((item) => (
                  <tr key={item.name} className="transition-colors hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-semibold text-white">{item.name}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{item.type}</td>
                    <td className="px-4 py-3 leading-[1.7] text-gray-400">{item.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section id="kt-additional" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Additional Components</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { name: "Load Balancers", desc: "Distribute traffic across servers. L7 for HTTP (routing by URL/headers), L4 for TCP (WebSockets)." },
            { name: "API Gateways", desc: "Single entry point for clients. Handles auth, rate limiting, routing to microservices." },
            { name: "Service Discovery", desc: "Services register themselves and find each other dynamically. e.g., Consul, Eureka." },
            { name: "Distributed Lock (Redis/Zookeeper)", desc: "Coordinate access to shared resources across distributed services to prevent race conditions." },
          ].map((item) => (
            <div key={item.name} className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">{item.name}</p>
              <p className="text-xs leading-relaxed text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <LoginProgressToggle />

      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("core-concepts-intro")}>
            ← Previous: Core Concepts
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20" onClick={() => onNavigate("common-patterns-intro")}>
            Next: Common Patterns
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
