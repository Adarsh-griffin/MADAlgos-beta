"use client";

import React from "react";
import { ChevronRight, Info, Lightbulb } from "lucide-react";
import { LoginProgressToggle } from "@/components/learn/LoginProgressToggle";

export function DatabaseIndexingLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Database Indexing</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Learn how database indexing works and how to optimize your queries for system design interviews.
        </p>
      </header>

      <section id="indexing-overview" className="scroll-mt-12 space-y-4">
        <p className="leading-[1.8] text-gray-400">
          An index is a separate data structure that keeps a sorted copy of selected columns so the database can find
          rows without scanning the entire table. Without indexes, every query is a full table scan — O(n). With the
          right index, the same query becomes O(log n) or even O(1).
        </p>
        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              In interviews, always mention <strong className="text-white">what you are indexing and why</strong>. The
              interviewer is evaluating whether you understand access patterns, not just whether you know the word
              &ldquo;index&rdquo;.
            </p>
          </div>
        </aside>
      </section>

      {/* Types of indexes */}
      <section id="index-types" className="scroll-mt-12 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">Types of Indexes</h2>

        {/* B-Tree */}
        <div className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-xl font-bold text-white">B-Tree Indexes</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            The default index type in most databases (PostgreSQL, MySQL). B-trees are balanced tree structures where
            all leaf nodes are at the same depth, keys within nodes are kept in sorted order, and the tree
            self-balances on inserts and deletes.
          </p>
          <h4 className="text-base font-semibold text-white">The Structure of B-Trees</h4>
          <ul className="space-y-1 text-sm text-gray-400">
            {[
              "All leaf nodes must be at the same depth",
              "Each node can contain between m/2 and m keys (where m is the order of the tree)",
              "A node with k keys must have exactly k+1 children",
              "Keys within a node are kept in sorted order",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-gray-300">
{`-- PostgreSQL: automatic B-tree on primary key
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE
);

-- MongoDB: B-tree-style index
db.users.createIndex({ "email": 1 });`}
          </pre>

          <h4 className="text-base font-semibold text-white">Why B-trees are the default choice</h4>
          <ol className="list-none space-y-1 text-sm text-gray-400">
            {[
              "They maintain sorted order, making range queries and ORDER BY efficient",
              "They're self-balancing, ensuring predictable performance as data grows",
              "They minimize disk I/O by matching their structure to how databases store data on disk",
              "They handle both equality (email = 'x') and range (age > 25) searches equally well",
              "They remain balanced even with random inserts and deletes",
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-400">{i + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* LSM Trees */}
        <div className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-xl font-bold text-white">LSM Trees (Log-Structured Merge Trees)</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            LSM trees optimize for write-heavy workloads by buffering writes in memory (a memtable), then flushing to
            disk in sorted runs (SSTables). Background compaction merges and sorts these runs over time.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-sm">
              <p className="font-semibold text-emerald-400 mb-1">Strengths</p>
              <p className="text-xs text-gray-400">Extremely fast sequential writes. No in-place updates. Great for time-series, activity logs, high-ingestion pipelines.</p>
            </div>
            <div className="rounded-lg bg-rose-500/10 p-3 text-sm">
              <p className="font-semibold text-rose-400 mb-1">Weakness</p>
              <p className="text-xs text-gray-400">Read amplification — a point lookup may need to check multiple SSTables. Compaction uses CPU and I/O in background.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Used by: <strong className="text-white">Cassandra</strong>, <strong className="text-white">RocksDB</strong>, <strong className="text-white">LevelDB</strong>, <strong className="text-white">HBase</strong></p>
        </div>

        {/* Hash Indexes */}
        <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-xl font-bold text-white">Hash Indexes</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            A hash map from key → disk location. Supports O(1) exact-match lookups. Cannot support range queries or
            sorting. Usually stored in memory. Best for session caches, unique ID lookups, and in-memory databases.
          </p>
          <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-3 py-3 text-xs text-gray-400">
            <strong className="text-amber-400">Limitation:</strong> No range queries. If you write <code className="text-white">WHERE age &gt; 25</code>, a hash index is useless — the database must fall back to a full scan.
          </aside>
        </div>

        {/* Geospatial */}
        <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-xl font-bold text-white">Geospatial Indexes</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            Standard B-trees cannot efficiently query 2D spatial data like latitude/longitude. Geospatial indexes use
            specialized structures to answer questions like &quot;find all restaurants within 5km of me&quot;.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { name: "Geohash", desc: "Encodes coordinates into a base-32 string prefix-queryable for proximity" },
              { name: "Quadtree", desc: "Recursively divides 2D space into 4 quadrants for efficient spatial lookups" },
              { name: "R-Tree", desc: "Used by PostGIS. Stores bounding rectangles for efficient spatial joins" },
            ].map((t) => (
              <div key={t.name} className="rounded-lg border border-white/10 p-3 text-sm">
                <p className="font-semibold text-white mb-1">{t.name}</p>
                <p className="text-xs text-gray-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Composite Indexes */}
      <section id="composite-indexes" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-white">Composite Indexes & Optimization</h2>
        <p className="leading-[1.8] text-gray-400">
          A composite index covers multiple columns. The order of columns in the index matters enormously.
        </p>
        <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
            <div>
              <p className="mb-2">For an index on <code className="rounded bg-white/10 px-1">(user_id, created_at)</code>:</p>
              <ul className="space-y-1">
                <li>✅ <code className="rounded bg-white/10 px-1">WHERE user_id = 5</code> — uses index</li>
                <li>✅ <code className="rounded bg-white/10 px-1">WHERE user_id = 5 AND created_at &gt; '2024-01-01'</code> — uses index</li>
                <li>❌ <code className="rounded bg-white/10 px-1">WHERE created_at &gt; '2024-01-01'</code> — cannot use index (skipped leading column)</li>
              </ul>
            </div>
          </div>
        </aside>
      </section>

      <LoginProgressToggle />

      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("cap-theorem")}>
            ← Previous: CAP Theorem
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20" onClick={() => onNavigate("numbers-to-know")}>
            Next: Numbers to Know
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
