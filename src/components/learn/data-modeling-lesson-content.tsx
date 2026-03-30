"use client";

import React from "react";
import { ChevronRight, Info, Lightbulb, AlertTriangle } from "lucide-react";

export function DataModelingLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Data Modeling</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Learn about data modeling for system design interviews.
        </p>
      </header>

      {/* Database model options */}
      <section id="db-model-options" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Database Model Options</h2>
        <p className="leading-[1.8] text-gray-400">
          Choosing the right database type is one of the most consequential decisions in your system design. Here are
          the five main database types you need to know:
        </p>

        <div className="space-y-4">
          {/* Relational */}
          <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="text-lg font-bold text-white">Relational Databases (SQL)</h3>
            <p className="text-sm leading-[1.8] text-gray-400">
              Store data in tables with rows and columns, connected via foreign keys. They provide{" "}
              <strong className="text-white">ACID guarantees</strong> (Atomicity, Consistency, Isolation, Durability)
              making them the default choice for transactional data like user records, orders, and financial data.
            </p>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Examples</p>
            <div className="flex flex-wrap gap-2">
              {["PostgreSQL", "MySQL", "SQLite"].map((db) => (
                <span key={db} className="rounded-full bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-400">{db}</span>
              ))}
            </div>
            <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-3 py-3 text-xs text-gray-400">
              <div className="flex gap-2">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden />
                <p><strong className="text-white">Default for interviews.</strong> Use PostgreSQL as your go-to unless the problem explicitly requires a different model.</p>
              </div>
            </aside>
          </div>

          {/* Document */}
          <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="text-lg font-bold text-white">Document Databases</h3>
            <p className="text-sm leading-[1.8] text-gray-400">
              Store data as JSON-like documents. Flexible schema lets you embed related data in a single document,
              avoiding joins. Good for content systems, catalogs, and user profiles.
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-gray-300">
{`{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "posts": [
    {"content": "Hello, world!", "created_at": "2024-01-01T10:00:00Z"},
    {"content": "My first post", "created_at": "2024-01-01T10:05:00Z"}
  ],
  "created_at": "2024-01-01T10:00:00Z"
}`}
            </pre>
            <div className="flex flex-wrap gap-2">
              {["MongoDB", "CouchDB", "Firestore"].map((db) => (
                <span key={db} className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">{db}</span>
              ))}
            </div>
          </div>

          {/* Key-Value */}
          <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="text-lg font-bold text-white">Key-Value Stores</h3>
            <p className="text-sm leading-[1.8] text-gray-400">
              The simplest database model. Every value is stored and retrieved by a unique key. Operations are
              O(1) lookups. Used for caching, session storage, feature flags, and rate limiting counters.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Redis", "DynamoDB", "Memcached"].map((db) => (
                <span key={db} className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-400">{db}</span>
              ))}
            </div>
          </div>

          {/* Wide-Column */}
          <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="text-lg font-bold text-white">Wide-Column Databases</h3>
            <p className="text-sm leading-[1.8] text-gray-400">
              Organize data by columns rather than rows, optimized for queries over large datasets. Excellent for
              time-series data, analytics, and write-heavy workloads at massive scale. Tunable consistency.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Cassandra", "HBase", "Bigtable"].map((db) => (
                <span key={db} className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-400">{db}</span>
              ))}
            </div>
          </div>

          {/* Graph */}
          <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="text-lg font-bold text-white">Graph Databases</h3>
            <p className="text-sm leading-[1.8] text-gray-400">
              Model data as nodes and edges. Optimized for traversing complex relationships. Use for social graphs,
              recommendation engines, fraud detection, and knowledge graphs.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Neo4j", "Amazon Neptune"].map((db) => (
                <span key={db} className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-400">{db}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Schema Design Fundamentals */}
      <section id="schema-design" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Schema Design Fundamentals</h2>

        {/* Start with Requirements */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">Start with Requirements</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            Data modeling should start with your functional requirements and access patterns — not the other way around.
            What data do you need to store? How will it be queried? The answers drive your schema.
          </p>
        </div>

        {/* Entities, Keys & Relationships */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">Entities, Keys & Relationships</h3>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-gray-300">
{`users:    id (PK), username, email
posts:    id (PK), user_id (FK→users.id), content, created_at
comments: id (PK), post_id (FK→posts.id), user_id (FK→users.id), content
likes:    user_id (FK→users.id), post_id (FK→posts.id)`}
          </pre>
          <ul className="space-y-1 text-sm text-gray-400">
            {[
              ["One-to-many (1:N)", "A user has many posts. A post has many comments."],
              ["Many-to-many (N:M)", "Users like many posts. Posts are liked by many users. Requires a join table."],
              ["One-to-one (1:1)", "Rare in practice — often a sign two tables should just be merged."],
            ].map(([rel, desc]) => (
              <li key={rel} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <span><strong className="text-white">{rel}:</strong> {desc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Indexing for Access Patterns */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">Indexing for Access Patterns</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            Define your indexes based on your most common read queries:
          </p>
          <ul className="space-y-1 text-sm text-gray-400">
            {[
              "Index on posts.user_id to quickly find all posts by a user",
              "Index on posts.created_at to load recent posts chronologically",
              "Composite index on (user_id, created_at) to efficiently load a user's recent posts",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Normalization vs Denormalization */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">Normalization vs Denormalization</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">Normalization</p>
              <p className="text-xs leading-relaxed text-gray-400">
                Store each piece of data in one place. Reduces redundancy and keeps writes simple. Risk of slow reads
                requiring many joins. Best for write-heavy systems.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">Denormalization</p>
              <p className="text-xs leading-relaxed text-gray-400">
                Duplicate data to avoid joins. Faster reads at the cost of write complexity and consistency. Good for:
                analytics, event logs, audit trails, read-heavy systems like search engines.
              </p>
            </div>
          </div>
        </div>

        {/* Scaling and Sharding */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">Scaling and Sharding</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            Once you&apos;ve designed your schema, think about how it scales. When a single relational database is no
            longer sufficient, you&apos;ll need to{" "}
            <button type="button" className="text-teal-400 underline" onClick={() => onNavigate("sharding")}>shard</button>{" "}
            your data. Your schema should be designed to avoid cross-shard queries by keeping related data together.
          </p>
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
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("api-design")}>
            ← Previous: API Design
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20" onClick={() => onNavigate("caching")}>
            Next: Caching
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
