"use client";

import React from "react";
import { ChevronRight, Info, AlertTriangle, Lightbulb } from "lucide-react";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { LoginProgressToggle } from "@/components/learn/LoginProgressToggle";

export function CachingLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Caching</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Reduce read latency by keeping frequently requested data in fast memory layers.
        </p>
      </header>

      <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
        <ZoomableImage
          src="/images/caching_handdrawn.png"
          alt="Caching Architecture"
          className="mx-auto max-w-2xl w-full h-auto drop-shadow-xl"
        />
      </div>

      {/* Intro */}
      <section id="caching-intro" className="scroll-mt-12 space-y-4">
        <p className="leading-[1.8] text-gray-400">
          Caching is one of the highest-impact concepts in system design interviews. It is the default technique for
          lowering read latency and offloading database pressure when traffic rises.
        </p>
        <p className="leading-[1.8] text-gray-400">
          A profile lookup from Postgres might cost around 50ms, while an in-memory Redis hit is often near{" "}
          <strong className="text-white">1ms</strong>. That order-of-magnitude gap exists because disk-backed reads are
          far slower than memory access.
        </p>
      </section>

      {/* Where to Cache */}
      <section id="where-to-cache" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Where to Cache</h2>
        <p className="leading-[1.8] text-gray-400">
          Most people first picture Redis or Memcached between app and database, and that is indeed the most common
          interview pattern. But production systems usually apply caching at multiple layers.
        </p>

        {/* External Caching */}
        <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-lg font-bold text-white">External Caching</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            This is the default interpretation of caching in interviews: a dedicated external store such as Redis or
            Memcached.
          </p>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              "Application checks the cache first. If the data is there (a \"cache hit\"), it returns it.",
              "If not (a \"cache miss\"), it fetches the data from the database, stores it in the cache with a TTL, and returns it.",
              "External caches are shared across multiple application servers and can scale independently of your database.",
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <span className="leading-[1.8]">{item}</span>
              </li>
            ))}
          </ul>
          <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-3 text-sm leading-[1.8] text-gray-400">
            <div className="flex gap-3">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
              <p>
                In system design interviews, <strong className="text-white">external caching with Redis</strong> is the
                default answer when discussing caching strategies. Interviewers expect you to mention it for any
                high-traffic system. Start here, then layer on CDN or client-side caching only if the problem calls for
                them.
              </p>
            </div>
          </aside>
        </div>

        {/* CDN */}
        <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-lg font-bold text-white">CDN (Content Delivery Network)</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            A CDN is a distributed network of servers that caches static assets (images, CSS, JS, videos) closer to
            users. CDNs reduce latency for users and offload significant traffic from your origin servers. They are
            essential for global applications and any system with large amounts of static media.
          </p>
        </div>

        {/* In-Process */}
        <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-lg font-bold text-white">In-Process Caching</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            Storing data in the memory of the application server itself. Light-weight and makes sense for small,
            frequently-requested data like secrets, feature flags, or configuration settings.
          </p>
          <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-3 py-3 text-sm text-gray-400">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
              <p>
                In-process caches are not shared across servers. If you have 10 servers, each with their own cache, and
                you update a value, you have to update all 10 caches or wait for them to expire.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Cache Architectures */}
      <section id="cache-architectures" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Cache Architectures</h2>
        <p className="leading-[1.8] text-gray-400">
          How your application interacts with the cache and the database determines your system&apos;s consistency,
          latency, and complexity. There are four main patterns you should know.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              name: "Cache-Aside (Lazy Loading)",
              desc: "The most common pattern. Application manages both cache and DB. On miss: fetch from DB, store in cache, return. Great for read-heavy workloads.",
              pros: "Resilient to cache failures.",
              cons: "Cache misses cause 3 round trips. Data can go stale.",
            },
            {
              name: "Write-Through Caching",
              desc: "Data is written to both cache and DB at the same time. Cache is never stale.",
              pros: "Cache always fresh, high read performance.",
              cons: "Slower writes (two destinations). Wasted space for write-heavy data.",
            },
            {
              name: "Write-Behind (Write-Back)",
              desc: "Application writes only to cache. Cache asynchronously writes to DB in batches.",
              pros: "Extremely fast write performance.",
              cons: "Risk of data loss if cache crashes before writing to DB.",
            },
            {
              name: "Read-Through Caching",
              desc: "Cache itself fetches data from DB on miss. Application only ever talks to the cache.",
              pros: "Simplifies application code.",
              cons: "Requires a cache provider that supports this pattern.",
            },
          ].map((item) => (
            <div key={item.name} className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">{item.name}</p>
              <p className="text-xs leading-relaxed text-gray-400">{item.desc}</p>
              <div className="space-y-1 text-xs">
                <p className="text-emerald-400">✓ {item.pros}</p>
                <p className="text-rose-400">✗ {item.cons}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Eviction Policies */}
      <section id="eviction-policies" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Cache Eviction Policies</h2>
        <p className="leading-[1.8] text-gray-400">
          Caches have limited memory. When they get full, they have to decide which data to delete to make room for new
          data. This is called <strong className="text-white">eviction</strong>.
        </p>

        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Policy</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">How It Works</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {[
                ["LRU", "Removes keys that have not been used recently", "Strong default for mixed workloads"],
                ["LFU", "Removes keys with the lowest access frequency", "Hot-content workloads (feeds, media, playlists)"],
                ["FIFO", "Removes entries in insertion order", "Simple pipelines where recency is less important"],
                ["TTL", "Expires keys after a configured duration", "Data that must refresh on a predictable cadence"],
              ].map(([policy, how, best]) => (
                <tr key={policy} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-semibold text-white">{policy}</td>
                  <td className="px-4 py-3 text-gray-400">{how}</td>
                  <td className="px-4 py-3 text-gray-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Problems */}
      <section id="caching-problems" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Common Caching Problems</h2>
        <p className="leading-[1.8] text-gray-400">
          Caching makes systems faster, but it also introduces new failure modes. If you bring up caching in an
          interview, you should also show you can handle these edge cases.
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.05] p-4 space-y-2">
            <p className="text-sm font-bold text-white">Cache Stampede (Thundering Herd)</p>
            <p className="text-sm leading-[1.8] text-gray-400">
              A heavily cached item expires, and many requests hit the database simultaneously, potentially overwhelming
              it.
            </p>
            <p className="text-xs text-gray-500 font-medium">Solutions:</p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-teal-500" />Request coalescing/locking: one request rebuilds cache, concurrent requests wait.</li>
              <li className="flex gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-teal-500" />Early refresh with jitter: repopulate entries before hard expiry.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 space-y-2">
            <p className="text-sm font-bold text-white">Hot Keys</p>
            <p className="text-sm leading-[1.8] text-gray-400">
              A single key gets overwhelming traffic (e.g., a celebrity&apos;s profile), overloading one Redis node.
            </p>
            <p className="text-xs text-gray-500 font-medium">Solutions:</p>
            <ul className="space-y-1 text-xs text-gray-400">
              <li className="flex gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-teal-500" />Distribute hot values via replication or key splitting.</li>
              <li className="flex gap-1.5"><span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-teal-500" />Add a near-cache (in-process) for ultra-hot reads.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/[0.05] p-4 space-y-2">
            <p className="text-sm font-bold text-white">Cache Consistency (Stale Data)</p>
            <p className="text-sm leading-[1.8] text-gray-400">
              Data updated in the database but not in the cache leads to &ldquo;stale&rdquo; data. The most common fix is
              to invalidate the cache entry whenever the database is updated.
            </p>
          </div>
        </div>
      </section>

      {/* Interview Tips */}
      <section id="caching-interview" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Caching in System Design Interviews</h2>
        <p className="leading-[1.8] text-gray-400">
          Don&apos;t just throw &quot;Redis&quot; at every problem the moment you start. Bring it up when you identify a
          read-heavy workload or a clear latency bottleneck — during the High-Level Design or Deep Dive phases.
        </p>
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/[0.05] p-4">
          <p className="text-sm text-gray-400 italic">
            &ldquo;To handle the high read volume and reduce latency for our most popular features, I&apos;d introduce a
            caching layer using Redis. We&apos;ll use a cache-aside pattern to keep it simple, with an LRU eviction
            policy to ensure we&apos;re only storing the most relevant data.&rdquo;
          </p>
        </div>
      </section>

      {/* Progress toggle */}
      <LoginProgressToggle />

      {/* Navigation */}
      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline"
            onClick={() => onNavigate("data-modeling")}
          >
            ← Previous: Data Modeling
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20"
            onClick={() => onNavigate("sharding")}
          >
            Next: Sharding
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
