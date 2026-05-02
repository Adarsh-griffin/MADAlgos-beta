"use client";

import React from "react";
import { Lightbulb } from "lucide-react";

/** Lesson IDs wired from system-design-course.ts */
export const EXTENDED_SYSTEM_DESIGN_LESSON_IDS = new Set([
  "wt-url-shortener",
  "wt-news-feed",
  "wt-notification-system",
  "pat-gateway-bff",
  "pat-event-driven",
  "pat-strangler",
  "tech-kafka-streams",
  "tech-redis-production",
  "tech-object-storage",
  "adv-leader-election",
  "adv-observability",
  "adv-release-safety",
]);

/** External reference (books, docs, standards) */
function RefLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-teal-400 underline decoration-teal-500/35 underline-offset-2 hover:text-teal-300"
    >
      {children}
    </a>
  );
}

/**
 * Reference diagram (no page hero): place between theory blocks.
 * `src` should be a stable URL; prefer Wikimedia Commons or project docs.
 */
function RefFigure({
  src,
  alt,
  caption,
  sourceHref,
  sourceLabel,
}: {
  src: string;
  alt: string;
  caption: React.ReactNode;
  sourceHref: string;
  sourceLabel: string;
}) {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4 shadow-inner shadow-black/40">
      <div className="flex justify-center overflow-x-auto rounded-lg bg-black/35 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[260px] w-auto max-w-full object-contain"
          loading="lazy"
        />
      </div>
      <figcaption className="mt-3 text-center text-[11px] leading-relaxed text-gray-500">
        {caption}{" "}
        <RefLink href={sourceHref}>{sourceLabel}</RefLink>
      </figcaption>
    </figure>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-xl border-l-4 border-teal-500/60 bg-teal-500/10 px-4 py-3 text-sm leading-relaxed text-gray-300">
      <div className="flex gap-3">
        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
        <div>{children}</div>
      </div>
    </aside>
  );
}

/* ——— Inline reference diagrams (SVG) ——— */

function SvgFanoutDiagram() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 560 200" className="mx-auto h-auto w-full max-w-xl text-gray-200" aria-hidden>
        <text x="280" y="22" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
          Fan-out on write (conceptual)
        </text>
        <rect x="230" y="40" width="100" height="36" rx="8" fill="#134e4a" stroke="#2dd4bf" />
        <text x="280" y="63" textAnchor="middle" fill="#ccfbf1" fontSize="12" fontFamily="system-ui">
          Author post
        </text>
        <line x1="280" y1="76" x2="280" y2="100" stroke="#475569" strokeWidth="2" />
        <polygon points="275,100 285,100 280,110" fill="#475569" />
        <line x1="280" y1="110" x2="120" y2="140" stroke="#64748b" strokeWidth="2" />
        <line x1="280" y1="110" x2="280" y2="140" stroke="#64748b" strokeWidth="2" />
        <line x1="280" y1="110" x2="440" y2="140" stroke="#64748b" strokeWidth="2" />
        <rect x="60" y="145" width="120" height="40" rx="8" fill="#1e293b" stroke="#64748b" />
        <text x="120" y="170" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="system-ui">
          Timeline A
        </text>
        <rect x="220" y="145" width="120" height="40" rx="8" fill="#1e293b" stroke="#64748b" />
        <text x="280" y="170" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="system-ui">
          Timeline B
        </text>
        <rect x="380" y="145" width="120" height="40" rx="8" fill="#1e293b" stroke="#64748b" />
        <text x="440" y="170" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="system-ui">
          Timeline C
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        One write fans out to many home timelines — hybrid strategies apply for celebrity accounts. Compare with log-based
        messaging in{" "}
        <RefLink href="https://dataintensive.net/">Kleppmann — &ldquo;Designing Data-Intensive Applications&rdquo;</RefLink>
        .
      </figcaption>
    </figure>
  );
}

function SvgNotifyPipeline() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 520 100" className="mx-auto h-auto w-full max-w-2xl" aria-hidden>
        <rect x="10" y="30" width="90" height="40" rx="8" fill="#312e81" stroke="#818cf8" />
        <text x="55" y="55" textAnchor="middle" fill="#e0e7ff" fontSize="11" fontFamily="system-ui">
          API
        </text>
        <line x1="100" y1="50" x2="130" y2="50" stroke="#64748b" strokeWidth="2" markerEnd="url(#arr)" />
        <rect x="130" y="30" width="100" height="40" rx="8" fill="#14532d" stroke="#4ade80" />
        <text x="180" y="55" textAnchor="middle" fill="#dcfce7" fontSize="11" fontFamily="system-ui">
          Kafka topic
        </text>
        <line x1="230" y1="50" x2="260" y2="50" stroke="#64748b" strokeWidth="2" />
        <rect x="260" y="30" width="100" height="40" rx="8" fill="#78350f" stroke="#fbbf24" />
        <text x="310" y="55" textAnchor="middle" fill="#fef3c7" fontSize="11" fontFamily="system-ui">
          Workers
        </text>
        <line x1="360" y1="50" x2="390" y2="50" stroke="#64748b" strokeWidth="2" />
        <rect x="390" y="30" width="120" height="40" rx="8" fill="#0c4a6e" stroke="#38bdf8" />
        <text x="450" y="55" textAnchor="middle" fill="#e0f2fe" fontSize="11" fontFamily="system-ui">
          APNs / FCM / SES
        </text>
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#64748b" />
          </marker>
        </defs>
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        Durable queue decouples spikes from channel providers; align with{" "}
        <RefLink href="https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/">AWS Builder&apos;s Library — load shedding</RefLink>{" "}
        when downstream is saturated.
      </figcaption>
    </figure>
  );
}

function SvgEventBus() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 480 160" className="mx-auto h-auto w-full max-w-xl" aria-hidden>
        <rect x="200" y="60" width="80" height="50" rx="8" fill="#422006" stroke="#fb923c" />
        <text x="240" y="90" textAnchor="middle" fill="#ffedd5" fontSize="11" fontFamily="system-ui">
          Event log
        </text>
        <rect x="30" y="20" width="80" height="36" rx="8" fill="#1e293b" stroke="#94a3b8" />
        <text x="70" y="42" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="system-ui">
          Producer A
        </text>
        <rect x="30" y="110" width="80" height="36" rx="8" fill="#1e293b" stroke="#94a3b8" />
        <text x="70" y="132" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="system-ui">
          Producer B
        </text>
        <path d="M110 38 L200 75" stroke="#64748b" fill="none" strokeWidth="2" />
        <path d="M110 128 L200 95" stroke="#64748b" fill="none" strokeWidth="2" />
        <rect x="370" y="20" width="90" height="36" rx="8" fill="#1e293b" stroke="#94a3b8" />
        <text x="415" y="42" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="system-ui">
          Consumer X
        </text>
        <rect x="370" y="110" width="90" height="36" rx="8" fill="#1e293b" stroke="#94a3b8" />
        <text x="415" y="132" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="system-ui">
          Consumer Y
        </text>
        <path d="M280 75 L370 38" stroke="#64748b" fill="none" strokeWidth="2" />
        <path d="M280 95 L370 128" stroke="#64748b" fill="none" strokeWidth="2" />
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        Topic partitions preserve per-key ordering; see{" "}
        <RefLink href="https://kafka.apache.org/documentation/#intro_concepts_and_terms">Apache Kafka — core concepts</RefLink>.
      </figcaption>
    </figure>
  );
}

function SvgStrangler() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 500 140" className="mx-auto h-auto w-full max-w-xl" aria-hidden>
        <rect x="40" y="40" width="120" height="70" rx="10" fill="#3f3f46" stroke="#a1a1aa" />
        <text x="100" y="82" textAnchor="middle" fill="#fafafa" fontSize="11" fontFamily="system-ui">
          Legacy
        </text>
        <rect x="190" y="50" width="70" height="50" rx="8" fill="#0f766e" stroke="#5eead4" />
        <text x="225" y="80" textAnchor="middle" fill="#ccfbf1" fontSize="10" fontFamily="system-ui">
          Router
        </text>
        <rect x="300" y="30" width="90" height="40" rx="8" fill="#1d4ed8" stroke="#93c5fd" />
        <text x="345" y="55" textAnchor="middle" fill="#dbeafe" fontSize="10" fontFamily="system-ui">
          New svc
        </text>
        <rect x="300" y="85" width="90" height="40" rx="8" fill="#1e293b" stroke="#64748b" />
        <text x="345" y="110" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="system-ui">
          Legacy path
        </text>
        <path d="M160 75 L190 75" stroke="#94a3b8" strokeWidth="2" />
        <path d="M260 75 L300 50" stroke="#94a3b8" strokeWidth="2" />
        <path d="M260 75 L300 105" stroke="#94a3b8" strokeWidth="2" />
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        Incrementally route traffic to new services. Pattern from{" "}
        <RefLink href="https://martinfowler.com/bliki/StranglerFigApplication.html">Martin Fowler — Strangler Fig Application</RefLink>.
      </figcaption>
    </figure>
  );
}

function SvgKafkaPartitions() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 440 120" className="mx-auto h-auto w-full max-w-lg" aria-hidden>
        <text x="220" y="18" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
          Topic &quot;orders&quot; — partitions P0..P2
        </text>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${40 + i * 120}, 35)`}>
            <rect width="100" height="70" rx="6" fill="#14532d" stroke="#4ade80" />
            <text x="50" y="28" textAnchor="middle" fill="#bbf7d0" fontSize="11" fontFamily="system-ui">
              P{i}
            </text>
            <line x1="15" y1="40" x2="85" y2="40" stroke="#166534" strokeWidth="6" strokeLinecap="round" />
            <line x1="15" y1="55" x2="70" y2="55" stroke="#166534" strokeWidth="6" strokeLinecap="round" />
            <line x1="15" y1="70" x2="80" y2="70" stroke="#166534" strokeWidth="6" strokeLinecap="round" />
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        Ordering is per-partition; choose keys to colocate related events. Deep dive:{" "}
        <RefLink href="https://www.confluent.io/blog/apache-kafka-in-a-nutshell/">Confluent — Kafka in a nutshell</RefLink>.
      </figcaption>
    </figure>
  );
}

function SvgRedisRing() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 400 140" className="mx-auto h-auto w-full max-w-md" aria-hidden>
        <text x="200" y="20" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
          Redis Cluster — hash slots (conceptual)
        </text>
        {[0, 1, 2, 3].map((i) => {
          const cx = 80 + (i % 2) * 240;
          const cy = 50 + Math.floor(i / 2) * 55;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="28" fill="#7f1d1d" stroke="#f87171" />
              <text x={cx} y={cy + 4} textAnchor="middle" fill="#fecaca" fontSize="10" fontFamily="system-ui">
                Node {i + 1}
              </text>
            </g>
          );
        })}
        <line x1="108" y1="50" x2="272" y2="50" stroke="#475569" strokeDasharray="4 3" />
        <line x1="80" y1="78" x2="320" y2="105" stroke="#475569" strokeDasharray="4 3" />
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        Gossip + hash slots route keys; always cross-check{" "}
        <RefLink href="https://redis.io/docs/management/scaling/">Redis Ltd. — scaling docs</RefLink>.
      </figcaption>
    </figure>
  );
}

function SvgObjectCdn() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 480 130" className="mx-auto h-auto w-full max-w-xl" aria-hidden>
        <rect x="30" y="45" width="90" height="50" rx="8" fill="#0c4a6e" stroke="#38bdf8" />
        <text x="75" y="75" textAnchor="middle" fill="#e0f2fe" fontSize="11" fontFamily="system-ui">
          Client
        </text>
        <line x1="120" y1="70" x2="170" y2="70" stroke="#64748b" strokeWidth="2" />
        <rect x="170" y="40" width="100" height="60" rx="8" fill="#365314" stroke="#a3e635" />
        <text x="220" y="75" textAnchor="middle" fill="#ecfccb" fontSize="11" fontFamily="system-ui">
          CDN edge
        </text>
        <line x1="270" y1="70" x2="320" y2="70" stroke="#64748b" strokeWidth="2" />
        <rect x="320" y="40" width="130" height="60" rx="8" fill="#422006" stroke="#fdba74" />
        <text x="385" y="75" textAnchor="middle" fill="#ffedd5" fontSize="11" fontFamily="system-ui">
          Object store
        </text>
        <text x="240" y="120" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="system-ui">
          Cache miss → origin fetch → optional write-back to edge
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        Pattern aligns with{" "}
        <RefLink href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html">Amazon S3 static hosting</RefLink>{" "}
        + CDN guides; compare consistency with{" "}
        <RefLink href="https://docs.aws.amazon.com/whitepapers/latest/aws-overview/storage-services.html">AWS overview — storage</RefLink>.
      </figcaption>
    </figure>
  );
}

function SvgRaftRoles() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 420 100" className="mx-auto h-auto w-full max-w-lg" aria-hidden>
        <rect x="40" y="30" width="100" height="50" rx="8" fill="#713f12" stroke="#fbbf24" />
        <text x="90" y="60" textAnchor="middle" fill="#fef9c3" fontSize="11" fontFamily="system-ui">
          Leader
        </text>
        <rect x="160" y="30" width="100" height="50" rx="8" fill="#1e293b" stroke="#94a3b8" />
        <text x="210" y="60" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="system-ui">
          Follower
        </text>
        <rect x="280" y="30" width="100" height="50" rx="8" fill="#1e3a5f" stroke="#7dd3fc" />
        <text x="330" y="60" textAnchor="middle" fill="#e0f2fe" fontSize="11" fontFamily="system-ui">
          Candidate
        </text>
        <text x="210" y="95" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="system-ui">
          Replicated log commits on majority ack — see Raft paper
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        Diego Ongaro &amp; John Ousterhout —{" "}
        <RefLink href="https://raft.github.io/raft.pdf">In Search of an Understandable Consensus Algorithm (Raft)</RefLink>.
      </figcaption>
    </figure>
  );
}

function SvgOtelPillars() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 420 90" className="mx-auto h-auto w-full max-w-lg" aria-hidden>
        {[
          { x: 50, label: "Traces" },
          { x: 170, label: "Metrics" },
          { x: 290, label: "Logs" },
        ].map((p) => (
          <g key={p.label}>
            <circle cx={p.x + 40} cy={45} r="32" fill="#1e1b4b" stroke="#a5b4fc" />
            <text x={p.x + 40} y={50} textAnchor="middle" fill="#e0e7ff" fontSize="11" fontFamily="system-ui">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        Unified context propagation:{" "}
        <RefLink href="https://opentelemetry.io/docs/concepts/observability-primer/">OpenTelemetry — observability primer</RefLink>. SLO
        math ties to <RefLink href="https://sre.google/sre-book/service-level-objectives/">Google SRE — SLO chapter</RefLink>.
      </figcaption>
    </figure>
  );
}

function SvgCanarySplit() {
  return (
    <figure className="my-8 rounded-xl border border-white/10 bg-[#0f111a]/95 p-4">
      <svg viewBox="0 0 440 100" className="mx-auto h-auto w-full max-w-lg" aria-hidden>
        <rect x="40" y="35" width="160" height="45" rx="8" fill="#14532d" stroke="#4ade80" />
        <text x="120" y="62" textAnchor="middle" fill="#dcfce7" fontSize="12" fontFamily="system-ui">
          Stable vN (92%)
        </text>
        <rect x="240" y="35" width="160" height="45" rx="8" fill="#713f12" stroke="#fbbf24" />
        <text x="320" y="62" textAnchor="middle" fill="#fef9c3" fontSize="12" fontFamily="system-ui">
          Canary vN+1 (8%)
        </text>
        <text x="220" y="95" textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="system-ui">
          Shift weights as health signals stay green; automate rollback
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-[11px] text-gray-500">
        Practice from high-performing teams (see{" "}
        <RefLink href="https://itrevolution.com/product/accelerate/">Forsgren et al. — Accelerate / DORA</RefLink>).
      </figcaption>
    </figure>
  );
}

export function ExtendedSystemDesignLessonContent({ lessonId }: { lessonId: string }) {
  switch (lessonId) {
    case "wt-url-shortener":
      return <WtUrlShortener />;
    case "wt-news-feed":
      return <WtNewsFeed />;
    case "wt-notification-system":
      return <WtNotificationSystem />;
    case "pat-gateway-bff":
      return <PatGatewayBff />;
    case "pat-event-driven":
      return <PatEventDriven />;
    case "pat-strangler":
      return <PatStrangler />;
    case "tech-kafka-streams":
      return <TechKafkaStreams />;
    case "tech-redis-production":
      return <TechRedisProduction />;
    case "tech-object-storage":
      return <TechObjectStorage />;
    case "adv-leader-election":
      return <AdvLeaderElection />;
    case "adv-observability":
      return <AdvObservability />;
    case "adv-release-safety":
      return <AdvReleaseSafety />;
    default:
      return null;
  }
}

/* ——— Interview walkthroughs ——— */

function WtUrlShortener() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-500/90">Interview walkthrough</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">URL shortener</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Canonical OOP-style prompt: map keys → long URLs, redirect with minimal latency, scale reads. Ground trade-offs in{" "}
          <RefLink href="https://dataintensive.net/">Kleppmann (DDIA)</RefLink> on storage, replication, and derived data.
        </p>
      </header>

      <section id="wt-url-clarify" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Clarify requirements</h2>
        <p className="leading-[1.85] text-gray-400">
          Functional: create short links, resolve redirects (301 vs 302 semantics—SEO vs temporary campaigns), optional TTL,
          custom aliases, preview/metadata API for social cards. Non-functional: explicit{" "}
          <strong className="font-semibold text-gray-300">p99/p999</strong> redirect latency (often &lt;50 ms edge-to-edge),
          regional failover, RPO/RTO for the mapping authoritative store, and whether analytics must be{" "}
          <em className="text-gray-300">exactly-once</em> counts vs approximate (
          <RefLink href="https://dataintensive.net/">DDIA</RefLink> — derived data). Security: SSRF / open-redirect abuse,
          phishing blocklists, rate limits per IP/API key, optional CAPTCHA on create.
        </p>
        <RefFigure
          src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Client-server-model.svg"
          alt="Client–server reference model diagram"
          caption="Classic request path: browsers and apps talk to edge and origin tiers — analogous to redirect services behind load balancers."
          sourceHref="https://commons.wikimedia.org/wiki/File:Client-server-model.svg"
          sourceLabel="Wikimedia Commons (LGPL) — Client-server model"
        />
      </section>

      <section id="wt-url-capacity" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Back-of-envelope capacity</h2>
        <p className="leading-[1.85] text-gray-400">
          Example: 500M new URLs/month → ~193 writes/s average; 100:1 read:write → ~19.3k reads/s average. Peak often 3–10×:
          plan redirect tier for ~60k–200k RPS depending on story. Each mapping row is small (short key + long URL + metadata);
          billions of rows → tens to low hundreds of GB before replication—still shardable by key prefix or hash range.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Short-key entropy: base62 length <em className="text-gray-300">L</em> gives <em className="text-gray-300">62^L</em>{" "}
          space; interviewers expect you to mention collision checks or allocated IDs (Snowflake-style) vs pure random. Hot
          keys (viral links) dominate cache and shard load—mitigate with edge caching, consistent hashing, and optional
          regional read replicas for redirect path only.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Click/impression analytics: do not synchronously update hot DB rows per redirect—emit events to an append-only log (
          Kafka/Pulsar) and aggregate in stream or batch jobs (
          <RefLink href="https://dataintensive.net/">DDIA — stream processing</RefLink>). Separates OLTP latency from OLAP
          volume.
        </p>
        <Callout>
          Cite <RefLink href="https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html">AWS Reliability Pillar</RefLink>{" "}
          when discussing multi-AZ failover and health checks for redirect shards.
        </Callout>
      </section>

      <section id="wt-url-api" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">API sketch</h2>
        <ul className="list-disc space-y-2 pl-5 text-gray-400">
          <li>
            <code className="text-teal-300">POST /v1/urls</code> — idempotent with client token; returns{" "}
            <code className="text-gray-300">short_key</code>.
          </li>
          <li>
            <code className="text-teal-300">GET /{`{key}`}</code> — <code className="text-gray-300">302</code> with{" "}
            <code className="text-gray-300">Location</code>; <code className="text-teal-300">HEAD</code> for existence checks.
          </li>
        </ul>
      </section>

      <section id="wt-url-data" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Data model & encoding</h2>
        <p className="leading-[1.85] text-gray-400">
          Primary unique index on <code className="text-gray-300">short_key</code>; secondary indexes only if product needs
          lookup by user or campaign. Allocation strategies: (1) centralized ID generator + base62 encode—fewer collisions;
          (2) random base62 + DB uniqueness retry—simple but watch contention; (3) range pre-assign per app shard—good for
          extreme write throughput.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Optional existence checks: bloom filter in memory for &ldquo;maybe exists&rdquo; before DB (
          <RefLink href="https://dataintensive.net/">DDIA — probabilistic structures</RefLink>). Analytics in separate
          columnar store or lake; never block redirect path on counting. GDPR/CCPA: tombstone + async purge from object store
          backups and replica lag windows.
        </p>
      </section>

      <section id="wt-url-deep" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Deep dives</h2>
        <ul className="list-disc space-y-2 pl-5 text-gray-400">
          <li>
            <strong className="font-semibold text-gray-300">Caching:</strong> cache-aside for hot keys; stampede protection
            (single-flight / probabilistic early refresh). TTL aligned with business (campaign end).
          </li>
          <li>
            <strong className="font-semibold text-gray-300">Sharding:</strong> hash(short_key) → shard; resharding via
            consistent hashing or dual-read migration—avoid stop-the-world moves.
          </li>
          <li>
            <strong className="font-semibold text-gray-300">Edge:</strong> rate limiting &amp; bot mitigation (
            <RefLink href="https://cloud.google.com/architecture/rate-limiting-strategies-techniques">Google — rate limiting</RefLink>
            ); geo DNS + anycast for latency; WAF rules for abuse patterns.
          </li>
          <li>
            <strong className="font-semibold text-gray-300">Redirects:</strong> document max hops and whether intermediate
            302 chains are allowed; security scanners flag open redirects—validate destination domains against policy lists.
          </li>
        </ul>
      </section>
    </div>
  );
}

function WtNewsFeed() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-500/90">Interview walkthrough</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Fan-out news feed</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Fan-out on write vs read, hybrid celebrity paths, and ranking — align vocabulary with large-scale timeline posts (
          <RefLink href="https://engineering.fb.com/2015/03/24/core-data/how-we-built-broccoli-for-scale/">Meta engineering blog</RefLink>{" "}
          style narratives, without copying proprietary internals).
        </p>
      </header>

      <section id="wt-feed-clarify" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Scope</h2>
        <p className="leading-[1.85] text-gray-400">
          Nail down product shape (microblog vs media-heavy), ordering (reverse chronological vs ranked mix), who can post
          (verified-only?), and staleness SLAs (&ldquo;new posts visible within N seconds&rdquo;). Consistency: eventual for
          timelines is typical; call out{" "}
          <strong className="font-semibold text-gray-300">read-your-writes</strong> expectations after posting—may require
          routing recent reads to author shard or session stickiness. Multi-region: replication lag vs geo-local read path;
          moderation / geo restrictions if relevant.
        </p>
      </section>

      <section id="wt-feed-model" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Fan-out model</h2>
        <p className="leading-[1.85] text-gray-400">
          <strong className="font-semibold text-gray-300">Fan-out on write:</strong> when author posts, enqueue work to insert
          into each follower&apos;s home timeline — great for read-heavy feeds with bounded follower counts. Cost scales as{" "}
          <em className="text-gray-300">posts × avg followers</em>; celebrities explode writes (
          <RefLink href="https://engineering.fb.com/2015/03/24/core-data/how-we-built-broccoli-for-scale/">Meta engineering — fanout framing</RefLink>
          — narrative only).
        </p>
        <p className="leading-[1.85] text-gray-400">
          <strong className="font-semibold text-gray-300">Hybrid:</strong> push to ordinary accounts; for mega-followed users,
          store posts in a star/replica set and <em className="text-gray-300">merge at read time</em> into home timeline—caps
          write amplification at cost of read path joins and hotter read caches. Threshold often tuned operationally (e.g.
          followers &gt; N switches path).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Buffer spikes with durable logs (Kafka) before timeline materialization workers; replay on failure instead of losing
          posts (
          <RefLink href="https://dataintensive.net/">DDIA — logs vs queues</RefLink>).
        </p>
        <SvgFanoutDiagram />
      </section>

      <section id="wt-feed-storage" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Storage & retrieval</h2>
        <p className="leading-[1.85] text-gray-400">
          Posts: wide-column (Cassandra/Dynamo-style) or sharded SQL by author/post id. Home timelines: ordered lists of post
          ids (Redis sorted sets, Cassandra wide rows, or RocksDB)—trim to max length per user. Pagination: cursor on{" "}
          <code className="text-gray-300">(timestamp_ms, post_id)</code> for stable ordering under ties; avoid OFFSET for deep
          pages.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Media metadata and blobs: object storage + CDN; separate hot path for thumbnails vs originals (see object-storage
          lesson). Deletion/propagation: async tombstone broadcast or lazy filtering at read if acceptable for compliance SLAs.
        </p>
      </section>

      <section id="wt-feed-scale" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Ranking & scale hooks</h2>
        <p className="leading-[1.85] text-gray-400">
          Offline jobs (Flink/Spark) compute features (engagement priors, affinity); online tier applies lightweight models
          with guardrails—freshness floors so brand-new posts still surface. Observability: measure timeline materialization
          lag, consumer lag on fan-out queues, and cache hit ratio; tie incidents to{" "}
          <RefLink href="https://sre.google/sre-book/service-level-objectives/">SRE error budgets</RefLink> when relevance
          pushes latency.
        </p>
      </section>
    </div>
  );
}

function WtNotificationSystem() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-500/90">Interview walkthrough</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Notification system</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          At-least-once delivery, idempotency, and provider quotas — production systems mirror patterns in{" "}
          <RefLink href="https://www.enterpriseintegrationpatterns.com/">Hohpe &amp; Woolf — Enterprise Integration Patterns</RefLink>.
        </p>
      </header>

      <section id="wt-notify-clarify" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Requirements</h2>
        <p className="leading-[1.85] text-gray-400">
          Split <strong className="font-semibold text-gray-300">transactional</strong> (password reset, security alert) from{" "}
          <strong className="font-semibold text-gray-300">marketing</strong> (promos)—different channels, caps, and legal
          basis. Honor quiet hours, locale-aware templates, device token lifecycle (APNs/FCM invalidation), and per-user
          frequency caps across channels to avoid fatigue.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Define DLQ semantics, replay authorization (who can re-drive?), and compliance: email unsubscribe headers, SMS
          opt-in proof, push permission state. Priority lanes: security beats digest mail—consider separate topics/queues with
          weighted consumers (
          <RefLink href="https://www.enterpriseintegrationpatterns.com/">Hohpe &amp; Woolf — messaging patterns</RefLink>).
        </p>
      </section>

      <section id="wt-notify-pipeline" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Pipeline</h2>
        <p className="leading-[1.85] text-gray-400">
          Validate schema → enqueue to partitioned logs (Kafka) for durability → workers render templates and resolve user
          preferences → channel adapters (APNs HTTP/2, FCM, SES, SMS gateways). Backpressure: shed or delay low-priority work
          when providers throttle (
          <RefLink href="https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/">AWS — load shedding</RefLink>
          ). Batch where providers reward it (email chunks), but respect latency SLOs for transactional pushes.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Per-tenant quotas and noisy-neighbor isolation: fair scheduling so one customer&apos;s campaign cannot starve
          transactional traffic.
        </p>
        <SvgNotifyPipeline />
      </section>

      <section id="wt-notify-idem" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Idempotency & dedupe</h2>
        <p className="leading-[1.85] text-gray-400">
          At-least-once delivery is normal—design for duplicates. Idempotency keys (Redis/DB) with TTL; deterministic
          dedupe keys over <code className="text-gray-300">(user_id, template_id, logical_event_id)</code>. Consumer-side
          exactly-once to external side effects is hard—prefer idempotent providers + your dedupe store (
          <RefLink href="https://dataintensive.net/">DDIA — stream processing</RefLink>). Record provider message ids when
          returned for audit.
        </p>
      </section>

      <section id="wt-notify-observe" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Observability</h2>
        <p className="leading-[1.85] text-gray-400">
          End-to-end trace context from API → topic → worker → provider webhook/callback. Metrics: queue depth, age-of-oldest
          message, send latency percentiles, provider error codes (429/5xx), bounce/complaint rates for email. Alert on DLQ
          growth and on sustained provider throttling—often signals credential or policy misconfiguration.
        </p>
      </section>
    </div>
  );
}

/* ——— Architecture patterns ——— */

function PatGatewayBff() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400/90">Architecture pattern</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Gateways & BFF</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Edge policy enforcement and client-specific aggregation — see{" "}
          <RefLink href="https://microservices.io/patterns/apigateway.html">Chris Richardson — API Gateway pattern</RefLink>{" "}
          and <RefLink href="https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-integrating-microservices/bff-pattern.html">AWS BFF guidance</RefLink>.
        </p>
      </header>

      <section id="pat-gw-edge" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">API gateway responsibilities</h2>
        <p className="leading-[1.85] text-gray-400">
          Terminate TLS, enforce JWT/OAuth validation (often JWKS rotation), mutual TLS for service-to-service if mesh not
          present, WAF rules, geo blocking, request size limits, and routing to service clusters. Rate limits and quotas at
          tenant/API-key granularity — avoid embedding domain business rules; keep policy{" "}
          <em className="text-gray-300">declarative</em> (OpenAPI + policy bundles) and test with contract tests (
          <RefLink href="https://microservices.io/patterns/apigateway.html">Richardson — API Gateway</RefLink>).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Cross-cutting concerns: request IDs, trace context injection (W3C Trace Context), CORS, and canary headers for
          progressive delivery downstream.
        </p>
        <RefFigure
          src="https://upload.wikimedia.org/wikipedia/commons/6/67/Reverse_proxy_h2g2bob.svg"
          alt="Reverse proxy diagram: clients to proxy to servers"
          caption="Reverse proxy / gateway sits in front of service pools — standard teaching diagram for edge termination."
          sourceHref="https://commons.wikimedia.org/wiki/File:Reverse_proxy_h2g2bob.svg"
          sourceLabel="Wikimedia Commons (CC0) — Reverse proxy"
        />
      </section>

      <section id="pat-gw-bff" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Backend-for-frontend</h2>
        <p className="leading-[1.85] text-gray-400">
          One BFF per client family (iOS, Android, web) or per domain slice—aggregates multiple microservice calls into one
          payload, shapes fields to UI needs, and applies client-specific caching TTLs. Reduces mobile chattiness and avoids
          leaking internal service topology (
          <RefLink href="https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-integrating-microservices/bff-pattern.html">AWS — BFF</RefLink>
          ).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Pitfalls: GraphQL N+1 without DataLoader-style batching; BFF becoming a &ldquo;god service&rdquo;—enforce ownership
          boundaries and shared libraries for auth/client concerns only.
        </p>
        <Callout>Pair BFF caching with explicit invalidation (event-driven or TTL + version keys)—stale UI at edge is a common incident class.</Callout>
      </section>

      <section id="pat-gw-failure" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Failure modes</h2>
        <p className="leading-[1.85] text-gray-400">
          Active-active gateways with anycast or DNS health checks; retry only idempotent methods at edge (GET/HEAD) or with
          idempotency keys forwarded. Circuit breakers and bulkheads per upstream pool; graceful degradation (feature flags
          off non-critical enrichments). Timeouts budgeted end-to-end so one slow leaf cannot hold threads (
          <RefLink href="https://sre.google/sre-book/managing-load/">Google SRE — managing load</RefLink>).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Relationship to <strong className="font-semibold text-gray-300">service mesh</strong>: mesh handles east-west mTLS,
          retries, and subset load balancing; gateway stays north-south and coarse policy—avoid duplicating logic in both
          layers without clarity on precedence.
        </p>
      </section>
    </div>
  );
}

function PatEventDriven() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400/90">Architecture pattern</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Event-driven backbone</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Logs as source of truth between bounded contexts — formalized in{" "}
          <RefLink href="https://kafka.apache.org/documentation/">Apache Kafka documentation</RefLink> and{" "}
          <RefLink href="https://dataintensive.net/">Kleppmann</RefLink> (events, streams, consumer offsets).
        </p>
      </header>

      <section id="pat-ev-building" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Building blocks</h2>
        <p className="leading-[1.85] text-gray-400">
          Topics split into <strong className="font-semibold text-gray-300">partitions</strong> for parallelism and ordered
          streams per key; replicas + ISR for durability; controllers coordinate leader election. Schema registry (Avro,
          Protobuf, JSON Schema) enforces compatibility modes (
          <RefLink href="https://kafka.apache.org/documentation/">Kafka docs</RefLink>) — breaking changes require coordinated
          rollout (dual-write, expand/contract).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Delivery: consumers usually <em className="text-gray-300">at-least-once</em>; exactly-once end-to-end needs
          idempotent producers/consumers and transactional boundaries—or careful dedupe at sinks (
          <RefLink href="https://dataintensive.net/">DDIA — streams</RefLink>). Ordering guarantee is{" "}
          <strong className="font-semibold text-gray-300">per partition only</strong>; partition key design is a primary
          modeling decision.
        </p>
        <p className="leading-[1.85] text-gray-400">
          <strong className="font-semibold text-gray-300">Transactional outbox:</strong> write DB + outbox row in one
          transaction; relay publishes to Kafka—avoids dual-write ambiguity between DB and broker (
          <RefLink href="https://microservices.io/patterns/data/transactional-outbox.html">microservices.io — Transactional outbox</RefLink>
          ).
        </p>
        <SvgEventBus />
      </section>

      <section id="pat-ev-saga" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Sagas & compensation</h2>
        <p className="leading-[1.85] text-gray-400">
          Long-lived workflows across services: <strong className="font-semibold text-gray-300">choreography</strong> (events
          trigger peers) vs <strong className="font-semibold text-gray-300">orchestration</strong> (central coordinator).
          Document compensating transactions for each forward step; timeouts and human escalation paths for stuck sagas (
          <RefLink href="https://microservices.io/patterns/data/saga.html">microservices.io — Saga</RefLink>).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Testing: simulate partial failures and duplicate deliveries—your saga must be deterministic under redelivery.
        </p>
      </section>

      <section id="pat-ev-ops" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Operational cautions</h2>
        <p className="leading-[1.85] text-gray-400">
          SLO consumer lag per group/partition; replay tooling with retention-aware warnings; poison-message quarantine after
          N failures with alerting; ACLs per tenant/topic; observe broker disk and under-replicated partitions during rack or AZ
          incidents. Runbooks for broker replacement and partition reassignment during peak-traffic avoidance windows.
        </p>
      </section>
    </div>
  );
}

function PatStrangler() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400/90">Architecture pattern</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Strangler fig migration</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Incremental replacement with routing control — pattern article by{" "}
          <RefLink href="https://martinfowler.com/bliki/StranglerFigApplication.html">Martin Fowler</RefLink>; data plane often
          uses CDC (Debezium, DMS) per <RefLink href="https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/database-streaming.html">AWS data streaming guidance</RefLink>.
        </p>
      </header>

      <section id="pat-strangler-seams" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Find seams</h2>
        <p className="leading-[1.85] text-gray-400">
          Carve bounded contexts where contracts are stable: route by URL prefix, subdomain, or API version behind the same
          public façade. Feature flags flip cohorts to new implementations without redeploying callers (
          <RefLink href="https://martinfowler.com/bliki/StranglerFigApplication.html">Fowler — Strangler Fig</RefLink>). Start
          with read-mostly paths or modules with clear data ownership to reduce blast radius.
        </p>
        <SvgStrangler />
      </section>

      <section id="pat-strangler-data" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Data synchronization</h2>
        <p className="leading-[1.85] text-gray-400">
          Avoid naive dual-writes (monolith + new DB)—race conditions dominate. Prefer{" "}
          <strong className="font-semibold text-gray-300">CDC</strong> (Debezium, DMS, logical decoding) or transactional outbox
          into a log, then consumers hydrate the new store (
          <RefLink href="https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-data-persistence/database-streaming.html">AWS — database streaming</RefLink>
          ). Run reconciliation jobs comparing checksums or sampled rows until divergence &lt; threshold; define authoritative
          source during overlap window.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Schema drift: pair with evolutionary DB techniques (
          <RefLink href="https://martinfowler.com/articles/evodb.html">Fowler — evolutionary DB</RefLink>) — expand/contract
          migrations so old and new paths coexist.
        </p>
      </section>

      <section id="pat-strangler-risk" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Risk controls</h2>
        <p className="leading-[1.85] text-gray-400">
          Shadow traffic compares responses without serving users; canaries route small % to new stack with automated rollback
          on golden signals; routing table or gateway config enables instant revert (
          <RefLink href="https://sre.google/sre-book/managing-load/">SRE — managing risk</RefLink>). Define parity checklist:
          authz rules, idempotency, pagination, error codes—before raising traffic share.
        </p>
      </section>
    </div>
  );
}

/* ——— Platforms & building blocks ——— */

function TechKafkaStreams() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400/90">Platform deep dive</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Kafka & stream processing</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Official docs + <RefLink href="https://www.confluent.io/resources/kafka-the-definitive-guide/">Kafka: The Definitive Guide</RefLink>{" "}
          (Confluent/O&apos;Reilly) for operational depth.
        </p>
      </header>

      <section id="tech-kafka-core" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Core concepts</h2>
        <p className="leading-[1.85] text-gray-400">
          Cluster roles: brokers persist segments; controller manages metadata (
          <RefLink href="https://kafka.apache.org/documentation/">Kafka docs</RefLink>). Topics → partitions for parallelism;
          replication factor <em className="text-gray-300">RF</em> and{" "}
          <code className="text-gray-300">min.insync.replicas</code> trade durability vs availability. Producers:{" "}
          <code className="text-gray-300">acks=all</code> waits for ISR commit;{" "}
          <code className="text-gray-300">linger.ms</code> + <code className="text-gray-300">batch.size</code> tune throughput
          vs latency.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Consumers in <strong className="font-semibold text-gray-300">groups</strong> divide partitions—rebalance on member
          join/leave (sticky assignors reduce churn). ISR shrink below min in-sync replicas ⇒ producers with acks=all fail —
          state this explicitly in failure scenarios. Log compaction retains latest key per record for changelog topics (
          Kafka Streams state changelog).
        </p>
        <RefFigure
          src="https://upload.wikimedia.org/wikipedia/commons/0/01/Apache_Kafka_logo.svg"
          alt="Apache Kafka logo"
          caption="Apache Kafka — reference branding; pair reading with the official docs on producers, brokers, and consumers."
          sourceHref="https://kafka.apache.org/documentation/"
          sourceLabel="Apache Kafka documentation"
        />
        <SvgKafkaPartitions />
      </section>

      <section id="tech-kafka-streams-api" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Stream processors</h2>
        <p className="leading-[1.85] text-gray-400">
          <strong className="font-semibold text-gray-300">Kafka Streams:</strong> embedded library—state stores backed by
          changelog topics for fault tolerance; interactive queries optional. For complex event-time aggregations and large
          state, <strong className="font-semibold text-gray-300">Apache Flink</strong> brings watermarks, allowed lateness,
          rescaling — study trade-offs (
          <RefLink href="https://www.confluent.io/resources/kafka-the-definitive-guide/">Kafka: The Definitive Guide</RefLink>
          ).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Interview depth: how you handle <em className="text-gray-300">late records</em>, state size growth, and checkpoint
          intervals; schema evolution for joined streams.
        </p>
      </section>

      <section id="tech-kafka-ops" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Operations</h2>
        <p className="leading-[1.85] text-gray-400">
          Capacity: disk bandwidth is often the bottleneck—monitor segment flush, replication fetch rates, and consumer lag.
          Tiered storage offloads cold segments when supported. Rebalances and broker replacements cause ISR churn—schedule
          during low traffic; watch under-replicated partitions (
          <RefLink href="https://sre.google/sre-book/table-of-contents/">Google SRE book</RefLink> for incident culture).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Security: TLS between clients and brokers, SASL mechanisms, ACLs on topic operations; separate clusters for prod vs
          non-prod to prevent accidents.
        </p>
      </section>
    </div>
  );
}

function TechRedisProduction() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400/90">Platform deep dive</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Redis at scale</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Primary/replica, Sentinel, Cluster — follow{" "}
          <RefLink href="https://redis.io/docs/management/scaling/">Redis scaling documentation</RefLink> and antipatterns in{" "}
          <RefLink href="https://redis.io/docs/manual/patterns/">Redis usage patterns</RefLink>.
        </p>
      </header>

      <section id="tech-redis-topo" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Topologies</h2>
        <p className="leading-[1.85] text-gray-400">
          <strong className="font-semibold text-gray-300">Primary/replica:</strong> async replication by default—understand
          acknowledged-write loss on failover. <strong className="font-semibold text-gray-300">Sentinel</strong> automates
          failover for smaller deployments. <strong className="font-semibold text-gray-300">Cluster</strong> shards 16k hash
          slots across masters; replicas for HA; clients follow <code className="text-gray-300">MOVED</code>/
          <code className="text-gray-300">ASK</code> redirects (
          <RefLink href="https://redis.io/docs/management/scaling/">Redis scaling</RefLink>).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Thundering herds after failover: exponential backoff in clients; avoid pipeline spans across slots without hashtag
          discipline—use consistent key hashing for multi-key ops or Lua that touches one slot.
        </p>
        <SvgRedisRing />
      </section>

      <section id="tech-redis-memory" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Memory discipline</h2>
        <p className="leading-[1.85] text-gray-400">
          Choose eviction policy vs workload: <code className="text-gray-300">volatile-*</code> for TTL caches,{" "}
          <code className="text-gray-300">allkeys-lru</code> for general caching. Watch fragmentation (
          <code className="text-gray-300">INFO memory</code>) and swap disablement on Linux. Break hot keys via logical
          sharding (Redis hashtag keys like <code className="text-gray-300">foo{'{'}123{'}'}:bar</code>) or local L1 caches;
          prefer smaller values or compression for large blobs (
          <RefLink href="https://redis.io/docs/manual/patterns/">Redis patterns</RefLink>).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Lua scripts run atomically server-side—great for compare-and-swap patterns; avoid long scripts blocking the event
          loop.
        </p>
      </section>

      <section id="tech-redis-persist" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Durability notes</h2>
        <p className="leading-[1.85] text-gray-400">
          RDB snapshots: low overhead point-in-time; potential minutes of loss. AOF: fsync every write (
          <code className="text-gray-300">always</code>) is durable but slow; <code className="text-gray-300">everysec</code>{" "}
          is common compromise. Redis is not a system of record for financial ledgers without external guarantees—pair with
          durable OLTP when needed.
        </p>
      </section>
    </div>
  );
}

function TechObjectStorage() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-400/90">Platform deep dive</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Object storage & CDN edge</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Strong per-key consistency in major clouds; listings may lag — read{" "}
          <RefLink href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html">Amazon S3 user guide</RefLink> and{" "}
          <RefLink href="https://dataintensive.net/">DDIA</RefLink> on batch vs stream processing around data lakes.
        </p>
      </header>

      <section id="tech-obj-model" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Consistency & listing</h2>
        <p className="leading-[1.85] text-gray-400">
          Major clouds publish strong read-after-write consistency for GET after PUT of new objects; list operations may be
          eventually consistent—design idempotent writers and avoid assuming immediate listing visibility (
          <RefLink href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html">Amazon S3 user guide</RefLink>
          ). Multipart uploads for large blobs; client-side checksums (SHA-256) on upload; conditional writes (
          <code className="text-gray-300">If-None-Match</code> / object versioning) to prevent lost updates.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Prefix design affects parallelism when listing at scale—avoid hot prefixes if your workload floods one shard.
        </p>
      </section>

      <section id="tech-obj-lifecycle" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Lifecycle tiers</h2>
        <p className="leading-[1.85] text-gray-400">
          Standard → infrequent access → archive/glacier classes trade retrieval latency and minimum storage duration for cost.
          Cross-region replication pairs with compliance residency; define RPO/RTO when buckets replicate asynchronously.
          Lifecycle policies expire incomplete multipart uploads to reclaim leaked storage.
        </p>
      </section>

      <section id="tech-obj-cdn" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">CDN integration</h2>
        <p className="leading-[1.85] text-gray-400">
          Signed URLs or signed cookies for time-limited access; cache keys include format variant (WebP vs JPEG).{" "}
          <code className="text-gray-300">stale-while-revalidate</code> improves perceived latency on cache misses; edge
          workers validate JWTs short-circuiting origin (
          <RefLink href="https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html">AWS Performance pillar</RefLink>
          ). Invalidate selectively—full-directory purge is expensive at scale.
        </p>
        <SvgObjectCdn />
      </section>
    </div>
  );
}

/* ——— Beyond the basics ——— */

function AdvLeaderElection() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-400/90">Advanced topic</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Leader election & quorum</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Consensus for control planes — primary reference is the{" "}
          <RefLink href="https://raft.github.io/raft.pdf">Raft paper</RefLink>; compare with Paxos in DDIA.
        </p>
      </header>

      <section id="adv-le-why" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Why it matters</h2>
        <p className="leading-[1.85] text-gray-400">
          Distributed systems need a single writer for mutable control-plane metadata (partition assignments, routing tables,
          config). <strong className="font-semibold text-gray-300">Leader election</strong> picks one coordinator; followers
          replicate decisions so failures trigger controlled failover rather than corruption (
          <RefLink href="https://raft.github.io/raft.pdf">Raft paper</RefLink>). Interview tie-ins: Kafka controller/KRaft,
          etcd backing Kubernetes, Redis Sentinel campaigns—same vocabulary, different implementations.
        </p>
      </section>

      <section id="adv-le-raft" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Raft sketch</h2>
        <p className="leading-[1.85] text-gray-400">
          Terms monotonically increase; candidates collect votes from majorities; the leader appends log entries and commits
          once replicated on a quorum. Snapshot + compaction bounds disk for long logs. Randomized election timeouts reduce
          split votes; clients must tolerate brief unavailability during failover (
          <RefLink href="https://dataintensive.net/">DDIA — consensus overview</RefLink> compares Raft vs Paxos trade-offs).
        </p>
        <p className="leading-[1.85] text-gray-400">
          <strong className="font-semibold text-gray-300">Fencing tokens:</strong> when storage systems accept writes from a
          former leader after network partition, use monotonic guards (lease ids, fencing tokens) so stale leaders cannot
          commit—critical for systems like distributed locks over plain databases.
        </p>
        <SvgRaftRoles />
      </section>

      <section id="adv-le-zk" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">ZooKeeper / etcd patterns</h2>
        <p className="leading-[1.85] text-gray-400">
          Coordination services expose ephemeral keys + sequential nodes for leader campaigns and distributed locks; session
          heartbeats define liveness—slow GC can lose session and trigger surprise leadership churn. Avoid herd effects on
          watch storms; debounce reconnect logic (
          <RefLink href="https://etcd.io/docs/v3.5/learning/">etcd learning</RefLink>). Prefer consensus-backed primitives over
          home-grown DB locks unless you understand lease semantics end-to-end.
        </p>
      </section>
    </div>
  );
}

function AdvObservability() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-400/90">Advanced topic</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Tracing & SLOs</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          OpenTelemetry for instrumentation; SLO math from <RefLink href="https://sre.google/sre-book/service-level-objectives/">Google SRE — SLOs</RefLink>.
        </p>
      </header>

      <section id="adv-obs-three" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Three pillars</h2>
        <p className="leading-[1.85] text-gray-400">
          <strong className="font-semibold text-gray-300">Metrics</strong> (RED/USE: rate, errors, duration / utilization,
          saturation, errors),           <strong className="font-semibold text-gray-300">logs</strong> (structured JSON with trace_id), and{" "}
          <strong className="font-semibold text-gray-300">traces</strong> (distributed spans). Correlate via{" "}
          <strong className="font-semibold text-gray-300">exemplars</strong> linking high-latency histogram buckets to trace
          IDs (
          <RefLink href="https://opentelemetry.io/docs/concepts/">OpenTelemetry concepts</RefLink>). Propagate W3C Trace Context
          across HTTP/gRPC <em className="text-gray-300">and</em> async boundaries (Kafka headers, job enqueue metadata)—lost
          context is the #1 blind spot.
        </p>
        <SvgOtelPillars />
      </section>

      <section id="adv-obs-slos" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">SLO design</h2>
        <p className="leading-[1.85] text-gray-400">
          Pick user-journey SLIs (success ratio, p95 latency) over vanity uptime. Define monthly availability target →{" "}
          <strong className="font-semibold text-gray-300">error budget</strong>; multi-window burn alerts catch fast vs slow
          leaks (
          <RefLink href="https://sre.google/sre-book/service-level-objectives/">Google SRE — SLOs</RefLink>). Separate
          internal dependency SLIs from external UX—customers only feel the composite path.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Example framing: &ldquo;99.9% of checkout API calls succeed in &lt;800 ms per rolling 30 days&rdquo; — measurable,
          debate-ready with product when launches consume budget.
        </p>
      </section>

      <section id="adv-obs-cost" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Sampling & cost</h2>
        <p className="leading-[1.85] text-gray-400">
          Always-on 100% tracing does not scale—use head sampling for baseline plus tail sampling on errors/latency. Cap label
          cardinality (never raw user ids as metric labels); aggregate before export when possible. Retention tiers: hot traces
          days, logs weeks in searchable store then archive to object storage (
          <RefLink href="https://opentelemetry.io/docs/concepts/sampling/">OTel sampling</RefLink>).
        </p>
      </section>
    </div>
  );
}

function AdvReleaseSafety() {
  return (
    <div className="not-prose space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-fuchsia-400/90">Advanced topic</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">Progressive delivery</h1>
        <p className="text-[17px] leading-relaxed text-gray-400">
          Tie deployments to measurable outcomes — <RefLink href="https://itrevolution.com/product/accelerate/">Accelerate</RefLink>{" "}
          research and <RefLink href="https://cloud.google.com/architecture/devops/devops-tech-test-automation">DORA capabilities</RefLink>.
        </p>
      </header>

      <section id="adv-rel-canary" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Canary releases</h2>
        <p className="leading-[1.85] text-gray-400">
          Route a small percentage of production traffic to new binary/version; compare golden signals (error rate, latency,
          saturation, business KPIs) against baseline—promote automatically only when thresholds hold (
          <RefLink href="https://sre.google/sre-book/release-engineering/">Google SRE — release engineering</RefLink>). Keep
          blast radius tiny (single AZ or shard cohort first); instant rollback via traffic shift or LB weights.
        </p>
        <p className="leading-[1.85] text-gray-400">
          Schema/data migrations still follow expand/contract—canaries validate code paths, not incompatible DDL applied blindly.
        </p>
        <SvgCanarySplit />
      </section>

      <section id="adv-rel-bg" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Blue / green</h2>
        <p className="leading-[1.85] text-gray-400">
          Maintain two full stacks; deploy to idle (green), run synthetic + smoke + shadow reads if applicable, then flip
          router/LB to green. Fast rollback = flip back; cost is duplicate capacity during transition. Pair with database
          backward-compatible deploys (
          <RefLink href="https://martinfowler.com/articles/evodb.html">Evolutionary Database Design</RefLink>) so both stacks
          read/write safely during the switch window.
        </p>
      </section>

      <section id="adv-rel-flags" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-bold text-white">Feature flags</h2>
        <p className="leading-[1.85] text-gray-400">
          <strong className="font-semibold text-gray-300">Deploy ≠ release:</strong> ship dark code behind flags; enable for
          internal, then percentage rollout, then GA. Kill switches turn off bad paths without redeploy—critical for incident
          response. Audit who changed flags when regulated (
          <RefLink href="https://itrevolution.com/product/accelerate/">Accelerate</RefLink> links delivery capability to
          outcomes).
        </p>
        <p className="leading-[1.85] text-gray-400">
          Distinction from canaries: flags gate <em className="text-gray-300">code paths</em> inside one version; canaries
          validate <em className="text-gray-300">whole artifacts</em> in production—often combined (flag inside canary
          cohort).
        </p>
      </section>
    </div>
  );
}
