"use client";

import React from "react";
import { ChevronRight, Lightbulb, Info, AlertTriangle } from "lucide-react";
import { LoginProgressToggle } from "@/components/learn/LoginProgressToggle";

export function CoreConceptsLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-500">
          <span className="h-px w-8 bg-orange-500/30" />
          System Design in a Hurry
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Core Concepts</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Master the fundamental principles that form the foundation of every distributed system design.
        </p>
      </header>

      {/* Intro */}
      <section id="cc-intro" className="scroll-mt-12 space-y-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground/90">
            Core concepts are the fundamental principles and techniques that form the foundation of every system
            design interview. Unlike specific technologies, these are technology-agnostic building blocks.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Think of core concepts as the vocabulary and grammar of system design. Before you can discuss how to
            scale Instagram, you need to understand caching, sharding, and networking.
          </p>
        </div>
      </section>

      {/* Overall Structure */}
      <section id="cc-structure" className="scroll-mt-12 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Overall Structure</h2>
        <p className="leading-relaxed text-muted-foreground">
          This page provides a quick overview of each core concept. The map below shows how these concepts 
          stack to form a complete system foundation.
        </p>
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
          <img 
            src="/images/core_concepts_handdrawn.png" 
            alt="Core Concepts Hierarchy" 
            className="mx-auto max-w-2xl w-full h-auto drop-shadow-2xl"
          />
        </div>
      </section>

      {/* ─── Networking Essentials ─── */}
      <section id="networking" className="scroll-mt-12 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Networking Essentials</h2>

        <p className="leading-relaxed text-muted-foreground">
          Networking is the plumbing of distributed systems. You need to know the practical tradeoffs 
          of how services talk to each other.
        </p>

        {/* Networking Layers hand-drawn diagram */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
          <img 
            src="/images/networking_stack_handdrawn.png" 
            alt="Hand-drawn Networking Stack" 
            className="mx-auto max-w-md w-full h-auto drop-shadow-xl"
          />
          <p className="mt-4 text-center text-xs text-muted-foreground font-medium italic">Practical Networking Stack</p>
        </div>

        <p className="leading-[1.8] text-gray-400">
          <strong className="text-white">WebSockets and Server-Sent Events (SSE)</strong> come up when you need
          real-time updates. The key difference: SSE is unidirectional &mdash; the client makes an initial HTTP
          request to open the connection, and then the server pushes data down that connection (like live scores
          or notifications). The client can&apos;t send additional data over the same SSE connection. WebSockets
          handle true bidirectional communication where both sides send messages freely (like chat or live
          collaboration). SSE is simpler to implement and works better with standard HTTP infrastructure, but
          WebSockets are necessary when clients need to push data back to the server frequently.
        </p>
        <p className="leading-[1.8] text-gray-400">
          Both are stateful connections, which means you can&apos;t just throw them behind a standard load
          balancer. You&apos;ll need to think about connection persistence and what happens when a server goes
          down with thousands of active connections.
        </p>
        <p className="leading-[1.8] text-gray-400">
          <strong className="text-white">gRPC</strong> is worth mentioning for internal service-to-service
          communication when performance is critical. It uses binary serialization and HTTP/2, making it
          significantly faster than JSON over HTTP. But you won&apos;t use it for public-facing APIs because
          browsers don&apos;t natively support gRPC. A common pattern is REST for external APIs and gRPC
          internally.
        </p>
        <p className="leading-[1.8] text-gray-400">
          <strong className="text-white">Load balancing</strong> is another area interviewers love to probe.
          Layer 7 load balancers operate at the application level and can route based on the actual HTTP request
          content. Layer 4 load balancers work at the TCP level and are faster but dumber. For WebSockets, you
          typically need Layer 4 balancing because you&apos;re maintaining a persistent TCP connection.
        </p>

        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              A common mistake is proposing WebSockets when HTTP with long polling or Server-Sent Events would
              work fine. WebSockets add significant complexity for maintaining stateful connections at scale.
              Only reach for them when you genuinely need bidirectional real-time communication, not just because
              &ldquo;real-time&rdquo; is mentioned in the problem.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-gray-400">
          <strong className="text-white">Geography and latency</strong> matter more than most candidates
          realize. A request from New York to London has a minimum latency of around 80ms just from the speed of
          light through fiber optic cables. If your system needs low latency globally, you&apos;ll need regional
          deployments with data replicated or partitioned by geography. This is why CDNs exist &mdash; to serve
          static content from edge servers close to users.
        </p>

        <p className="text-sm text-teal-400">
          Learn the full details in our{" "}
          <button type="button" onClick={() => onNavigate("networking-essentials")} className="underline decoration-teal-400/30 hover:text-teal-300">
            Networking Essentials guide
          </button>.
        </p>
      </section>

      {/* ─── API Design ─── */}
      <section id="api-design" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">API Design</h2>

        <p className="leading-[1.8] text-gray-400">
          In almost every system design interview, you&apos;ll need to sketch out the APIs that clients use to
          interact with your system. The good news is that most interviewers don&apos;t care about perfect API
          design. They want to see that you can create reasonable endpoints and move on to the harder
          architectural problems. That said, sloppy API design can signal inexperience, so it&apos;s worth
          knowing the basics.
        </p>
        <p className="leading-[1.8] text-gray-400">
          For 90% of interviews, you&apos;ll default to{" "}
          <strong className="text-white">REST</strong>. It maps resources to URLs and uses HTTP methods to
          manipulate them. Think{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">/users/&#123;id&#125;</code>{" "}
          for getting a user,{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">POST /events/&#123;id&#125;/bookings</code>{" "}
          for creating a booking. REST is well-understood, works everywhere, and your interviewer will assume
          this unless you propose something else.
        </p>

        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              A common mistake is spending too much time designing APIs in interviews. You should be able to
              sketch out 4&ndash;5 key endpoints in a couple minutes and move on. If you find yourself still
              designing API details 10 minutes into the interview, you&apos;re going too deep.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-gray-400">
          There are a few concepts worth mentioning when they come up. If you&apos;re returning large result
          sets, you&apos;ll need <strong className="text-white">pagination</strong>. Cursor-based works better
          for real-time data where new items get added frequently, but offset-based is fine for most cases. For
          authentication, use <strong className="text-white">JWT tokens</strong> for user sessions and{" "}
          <strong className="text-white">API keys</strong> for service-to-service calls. And if your system
          could get hammered by bots or abuse, mention{" "}
          <strong className="text-white">rate limiting</strong>. But don&apos;t go deep on any of these unless
          the interviewer specifically asks.
        </p>

        <p className="text-sm text-teal-400">
          Read our full{" "}
          <button type="button" onClick={() => onNavigate("api-design")} className="underline decoration-teal-400/30 hover:text-teal-300">
            API Design breakdown
          </button>{" "}
          for interview-focused guidance.
        </p>
      </section>

      {/* ─── Data Modeling ─── */}
      <section id="data-modeling" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Data Modeling</h2>

        <p className="leading-[1.8] text-gray-400">
          Data modeling is one of those things that sounds simple but has massive downstream effects on your
          system. The decisions you make about what data to store and how to structure it directly affect
          performance, scalability, and how painful it is to build and maintain your system.
        </p>

        <p className="leading-[1.8] text-gray-400">
          The first big choice is{" "}
          <strong className="text-white">relational versus NoSQL</strong>. Relational databases like Postgres
          work great when you have structured data with clear relationships and need strong consistency. NoSQL
          databases like DynamoDB or MongoDB shine when you need flexible schemas or you need to scale
          horizontally across many servers without complex joins.
        </p>

        <p className="leading-[1.8] text-gray-400">
          Within relational databases, you&apos;ll hear about{" "}
          <strong className="text-white">normalization and denormalization</strong>. Normalization means
          splitting data across tables to avoid duplication. This keeps your data consistent but means you need
          joins to get complete data. Joins get expensive when your tables are huge.
        </p>
        <p className="leading-[1.8] text-gray-400">
          <strong className="text-white">Denormalization</strong> goes the other way. You duplicate data to
          avoid joins and make reads faster. The downside is updates &mdash; if a user changes their name, you
          have to update it everywhere it was copied. For read-heavy systems where data rarely changes, this
          tradeoff is often worth it.
        </p>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              In interviews, a safe default is to start with a normalized relational model and then denormalize
              specific hot paths if you identify read performance issues. Don&apos;t propose denormalization
              upfront unless you have a clear reason. Interviewers want to see that you understand the
              tradeoffs, not that you blindly apply techniques.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-gray-400">
          <strong className="text-white">NoSQL databases</strong> force you to think differently. DynamoDB
          requires you to design your partition key and sort key based on your access patterns. If your most
          common query is &ldquo;get all posts for user X,&rdquo; you&apos;d use{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">user_id</code> as the
          partition key. But now queries like &ldquo;get all posts mentioning hashtag Y&rdquo; require scanning
          the entire table because you didn&apos;t design for that access pattern. You have to know your queries
          upfront and design around them.
        </p>

        <p className="text-sm text-teal-400">
          Learn more in our{" "}
          <button type="button" onClick={() => onNavigate("data-modeling")} className="underline decoration-teal-400/30 hover:text-teal-300">
            Data Modeling article
          </button>.
        </p>
      </section>

      {/* ─── Database Indexing ─── */}
      <section id="db-indexing" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Database Indexing</h2>

        <p className="leading-[1.8] text-gray-400">
          Indexes are used to make database queries fast. Without an index, finding a user by email means
          scanning every single row in your users table. With an index on the email column, the database can
          jump straight to the right row in milliseconds.
        </p>
        <p className="leading-[1.8] text-gray-400">
          The most common index is a <strong className="text-white">B-tree</strong>. It keeps data sorted in a
          tree structure that supports both exact lookups and range queries. Hash indexes are faster for exact
          matches but can&apos;t do range queries. You&apos;ll also see specialized indexes like{" "}
          <strong className="text-white">full-text indexes</strong> for search and{" "}
          <strong className="text-white">geospatial indexes</strong> for location queries.
        </p>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              In interviews, think about your query patterns and propose indexes on the fields you&apos;re
              querying frequently. If you&apos;re looking up users by email for authentication, index the email
              column. For composite queries like &ldquo;find events in San Francisco on December 25th,&rdquo;
              you might need a compound index on both city and date.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-gray-400">
          For specialized needs beyond what your primary database supports, you&apos;ll need external systems.{" "}
          <strong className="text-white">Elasticsearch</strong> is the go-to for full-text search.{" "}
          <strong className="text-white">PostGIS</strong> is a popular extension for geospatial queries in
          Postgres. These external indexes typically sync from your primary database via change data capture
          (CDC), meaning the search index will lag slightly behind. The tradeoff is worth it because it lets you
          search in ways your main database can&apos;t handle.
        </p>

        <p className="text-sm text-teal-400">
          Get the full breakdown in our{" "}
          <button type="button" onClick={() => onNavigate("database-indexing")} className="underline decoration-teal-400/30 hover:text-teal-300">
            Database Indexing guide
          </button>.
        </p>
      </section>

      {/* ─── Caching ─── */}
      <section id="caching-section" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Caching</h2>

        <p className="leading-[1.8] text-gray-400">
          Caching comes up in almost every system design interview, usually when you identify that your database
          is getting hammered with reads. The idea is simple: store frequently accessed data in fast memory (like
          Redis) so you can skip the database entirely for most reads.
        </p>
        <p className="leading-[1.8] text-gray-400">
          The performance difference is massive. A cache hit on Redis takes around{" "}
          <strong className="text-white">1ms</strong> compared to{" "}
          <strong className="text-white">20&ndash;50ms</strong> for a typical database query. When you&apos;re
          serving millions of requests, that 20&ndash;50x speedup matters.
        </p>

        <p className="leading-[1.8] text-gray-400">
          The pattern you&apos;ll use 90% of the time is{" "}
          <strong className="text-white">cache-aside with Redis</strong>. On a read, check the cache first. If
          the data is there, return it. If not, query the database, store the result in the cache with a TTL,
          and return it.
        </p>

        <p className="leading-[1.8] text-gray-400">
          But caching introduces real complexity. The hardest part is{" "}
          <strong className="text-white">invalidation</strong>. When a user updates their profile in the
          database, you need to delete or update the cached copy. Otherwise the next read returns stale data.
          You can invalidate immediately after writes, use short TTLs and accept some staleness, or combine
          both.
        </p>

        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              You also need to think about cache failures. If Redis goes down, every request suddenly hits your
              database. Can it handle that traffic spike? This is called a{" "}
              <strong className="text-white">cache stampede</strong> and it can take down your whole system. Some
              approaches include keeping a small in-process cache as a fallback, using circuit breakers, or
              accepting degraded performance until Redis comes back up.
            </p>
          </div>
        </aside>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              A common mistake is caching everything. Cache only data that&apos;s read frequently and
              doesn&apos;t change often. If you&apos;re caching data that changes on every request, you&apos;re
              just adding latency and complexity for no benefit. Profile your system first, then cache the hot
              paths.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-gray-400">
          <strong className="text-white">CDN caching</strong> is different &mdash; it&apos;s for static assets
          like images, videos, and JavaScript files served from edge locations close to users.{" "}
          <strong className="text-white">In-process caching</strong> works for small values that change rarely,
          like feature flags or config data. But for your core application data, external caching with Redis is
          the default.
        </p>

        <p className="text-sm text-teal-400">
          Dive deeper in our{" "}
          <button type="button" onClick={() => onNavigate("caching")} className="underline decoration-teal-400/30 hover:text-teal-300">
            Caching article
          </button>.
        </p>
      </section>

      {/* ─── Sharding ─── */}
      <section id="sharding-section" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Sharding</h2>

        <p className="leading-[1.8] text-gray-400">
          Sharding comes up when you&apos;ve outgrown a single database and need to split your data across
          multiple independent servers. This happens when you hit storage limits, write throughput limits, or
          read throughput that even replicas can&apos;t handle.
        </p>

        <p className="leading-[1.8] text-gray-400">
          The most important decision is your{" "}
          <strong className="text-white">shard key</strong>. For a user-centric app like Instagram, sharding by{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">user_id</code> means all of a
          user&apos;s posts, likes, and comments live on one shard. User-scoped queries are fast because they
          only hit one shard. But global queries like &ldquo;trending posts across all users&rdquo; become
          expensive because you have to hit every shard and aggregate results.
        </p>

        <p className="leading-[1.8] text-gray-400">
          Most systems use <strong className="text-white">hash-based sharding</strong> where you hash the shard
          key and use modulo to pick a shard. <strong className="text-white">Range-based sharding</strong> can
          work if your access patterns naturally partition, but it&apos;s easy to create hot spots.{" "}
          <strong className="text-white">Directory-based sharding</strong> uses a lookup table but adds latency
          to every request, so it&apos;s rarely worth it in interviews.
        </p>

        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              The biggest mistake with sharding is doing it too early. A well-tuned single database with read
              replicas can handle way more than most candidates think. Before you propose sharding, do the
              capacity math. If you&apos;re at 10K writes per second and 100GB of data, you don&apos;t need
              sharding yet.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-gray-400">
          Sharding creates new problems. Cross-shard transactions become nearly impossible. Hot spots happen when
          one shard gets disproportionate traffic. And resharding is painful &mdash; you can&apos;t just add a
          new shard without moving massive amounts of data around.
        </p>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              In interviews, bring up sharding after you&apos;ve justified why a single database won&apos;t
              work. Then clearly state your shard key choice and explain the tradeoff (fast for X queries, slow
              for Y queries). That&apos;s all most interviewers need to see.
            </p>
          </div>
        </aside>

        <p className="text-sm text-teal-400">
          Get the full breakdown in our{" "}
          <button type="button" onClick={() => onNavigate("sharding")} className="underline decoration-teal-400/30 hover:text-teal-300">
            Sharding guide
          </button>.
        </p>
      </section>

      {/* ─── Consistent Hashing ─── */}
      <section id="consistent-hashing-section" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Consistent Hashing</h2>

        <p className="leading-[1.8] text-gray-400">
          Consistent hashing solves a specific problem with distributed caches and sharded databases. When you
          use simple hash-based distribution (
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">hash(key) % N</code> to pick
          which server stores the data), adding or removing a server changes N. That means almost every key maps
          to a different server, so you&apos;d have to move most of your data around.
        </p>

        <p className="leading-[1.8] text-gray-400">
          Consistent hashing fixes this by arranging both servers and keys on a{" "}
          <strong className="text-white">virtual ring</strong>. You hash each key and place it on the ring, then
          the key belongs to the next server going clockwise. When you add a new server, only the keys between
          that new server and the previous server need to move. Everything else stays put.
        </p>

        <p className="leading-[1.8] text-gray-400">
          The improvement is massive. With simple modulo hashing, adding one server to a 10-server cluster means
          moving roughly <strong className="text-white">90%</strong> of your data. With consistent hashing, you
          only move about <strong className="text-white">10%</strong>.
        </p>

        <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
            <p>
              In interviews, you rarely need to explain how consistent hashing works unless specifically asked.
              It&apos;s enough to say &ldquo;we&apos;ll use consistent hashing to distribute data across cache
              nodes&rdquo; when you&apos;re talking about a distributed cache. The main time to bring it up is
              when you&apos;re discussing elastic scaling.
            </p>
          </div>
        </aside>

        <p className="text-sm text-teal-400">
          Learn the details in our{" "}
          <button type="button" onClick={() => onNavigate("consistent-hashing")} className="underline decoration-teal-400/30 hover:text-teal-300">
            Consistent Hashing article
          </button>.
        </p>
      </section>

      {/* ─── CAP Theorem ─── */}
      <section id="cap-section" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">CAP Theorem</h2>

        <p className="leading-[1.8] text-gray-400">
          The CAP theorem comes up when you&apos;re designing distributed systems and need to make tradeoffs
          about how your data behaves during failures. It states you can only have two of three properties at
          once:{" "}
          <strong className="text-white">Consistency</strong> (all nodes see the same data),{" "}
          <strong className="text-white">Availability</strong> (every request gets a response), and{" "}
          <strong className="text-white">Partition tolerance</strong> (system works even when network connections
          fail). Since network partitions are unavoidable in distributed systems, you&apos;re really choosing
          between consistency and availability.
        </p>

        {/* CAP triangle */}
        <figure className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/50 p-5 md:p-8">
          <div className="mx-auto flex max-w-xs flex-col items-center gap-4">
            <div className="rounded-xl border-2 border-teal-500 bg-teal-500/10 px-6 py-3 text-center text-sm font-bold text-white">
              Consistency
            </div>
            <div className="flex w-full justify-between gap-4">
              <div className="rounded-xl border-2 border-sky-500 bg-sky-500/10 px-5 py-3 text-center text-sm font-bold text-white">
                Availability
              </div>
              <div className="rounded-xl border-2 border-amber-500 bg-amber-500/10 px-3 py-3 text-center text-sm font-bold text-white">
                Partition Tolerance
              </div>
            </div>
          </div>
          <figcaption className="mt-4 text-center text-xs text-gray-500">CAP Theorem</figcaption>
        </figure>

        <p className="leading-[1.8] text-gray-400">
          For most systems,{" "}
          <strong className="text-white">availability is the right default</strong>. Users can tolerate seeing
          slightly stale data (your Instagram feed being 2 seconds old), but they can&apos;t tolerate the app
          being down. Social media feeds, recommendation systems, and analytics dashboards all work fine with{" "}
          <strong className="text-white">eventual consistency</strong>.
        </p>
        <p className="leading-[1.8] text-gray-400">
          <strong className="text-white">Strong consistency</strong> matters when stale data causes actual
          business problems. Inventory systems need accurate stock counts. Banking systems need correct account
          balances. Booking systems like Ticketmaster need to prevent double-booking the same seat.
        </p>
        <p className="leading-[1.8] text-gray-400">
          You don&apos;t have to pick one model for your entire system. It&apos;s common to have different
          consistency requirements for different parts. In an e-commerce system, product descriptions can be
          eventually consistent, but inventory counts need strong consistency.
        </p>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              In interviews, when you mention replication or distributed data, your interviewer might ask about
              consistency. The safe answer is eventual consistency unless the problem specifically involves
              money, inventory, or booking limited resources.
            </p>
          </div>
        </aside>

        <p className="text-sm text-teal-400">
          Read more in our{" "}
          <button type="button" onClick={() => onNavigate("cap-theorem")} className="underline decoration-teal-400/30 hover:text-teal-300">
            CAP Theorem breakdown
          </button>.
        </p>
      </section>

      {/* ─── Numbers to Know ─── */}
      <section id="numbers-section" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Numbers to Know</h2>

        <p className="leading-[1.8] text-gray-400">
          As discussed in the Delivery Framework, you don&apos;t need to do back-of-the-envelope calculations
          at the start of an interview. What matters is doing them when you need to make a decision. Should you
          shard the database? Can a single Redis instance handle the cache load? You can&apos;t answer these
          questions without rough numbers.
        </p>
        <p className="leading-[1.8] text-gray-400">
          Start with the <strong className="text-white">latency numbers</strong> because they affect almost
          every design decision. Memory access takes nanoseconds. SSD reads take microseconds. Network calls
          within a data center take 1&ndash;10 milliseconds. Cross-continent calls take tens to hundreds of
          milliseconds.
        </p>
        <p className="leading-[1.8] text-gray-400">
          Do your capacity calculations in context when you need them. Walk through it: &ldquo;We&apos;re
          expecting 50K requests per second, each server can handle maybe 5K requests, so we need around 10
          servers plus some headroom.&rdquo; The interviewer wants to see you think through the math, not recite
          memorized facts.
        </p>

        {/* Numbers table */}
        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Component</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Key Metrics</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Scale Triggers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              <tr className="transition-colors hover:bg-white/[0.03]">
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-white">Caching</td>
                <td className="px-4 py-3 text-gray-400">
                  ~1ms latency<br />100k+ ops/sec<br />Memory-bound (up to 1TB)
                </td>
                <td className="px-4 py-3 text-gray-400">
                  Hit rate &lt;&nbsp;80%<br />Latency &gt;&nbsp;1ms<br />Memory &gt;&nbsp;80%
                </td>
              </tr>
              <tr className="transition-colors hover:bg-white/[0.03]">
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-white">Databases</td>
                <td className="px-4 py-3 text-gray-400">
                  Up to 50k TPS<br />Sub-5ms read latency<br />64&nbsp;TiB+ storage
                </td>
                <td className="px-4 py-3 text-gray-400">
                  Write throughput &gt;&nbsp;10k TPS<br />Read latency &gt;&nbsp;5ms<br />Geo distribution needs
                </td>
              </tr>
              <tr className="transition-colors hover:bg-white/[0.03]">
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-white">App Servers</td>
                <td className="px-4 py-3 text-gray-400">
                  100k+ concurrent connections<br />8&ndash;64 cores<br />64&ndash;512GB RAM
                </td>
                <td className="px-4 py-3 text-gray-400">
                  CPU &gt;&nbsp;70%<br />Latency &gt;&nbsp;SLA<br />Connections near 100k
                </td>
              </tr>
              <tr className="transition-colors hover:bg-white/[0.03]">
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-white">Message Queues</td>
                <td className="px-4 py-3 text-gray-400">
                  Up to 1M msgs/sec<br />Sub-5ms end-to-end<br />Up to 50TB storage
                </td>
                <td className="px-4 py-3 text-gray-400">
                  Throughput near 800k/sec<br />~200k partitions<br />Growing consumer lag
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-teal-400">
          Get the full reference in our{" "}
          <button type="button" onClick={() => onNavigate("numbers-to-know")} className="underline decoration-teal-400/30 hover:text-teal-300">
            Numbers to Know guide
          </button>.
        </p>
      </section>

      {/* Login progress toggle */}
      <LoginProgressToggle />

      {/* Navigation */}
      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline"
            onClick={() => onNavigate("delivery-framework")}
          >
            &larr; Previous: Delivery Framework
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20"
            onClick={() => onNavigate("key-technologies-intro")}
          >
            Next: Key Technologies
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
