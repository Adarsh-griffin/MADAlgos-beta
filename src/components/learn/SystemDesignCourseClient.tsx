"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  LayoutGrid,
  Zap,
  Atom,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SYSTEM_DESIGN_SECTIONS,
  type CourseSectionDef,
  type LessonItem,
} from "@/lib/system-design-course";
import { IntroductionLessonContent } from "@/components/learn/introduction-lesson-content";
import { HowToPrepareLessonContent } from "@/components/learn/how-to-prepare-lesson-content";
import { DeliveryFrameworkLessonContent } from "@/components/learn/delivery-framework-lesson-content";
import { CoreConceptsLessonContent } from "@/components/learn/core-concepts-lesson-content";
import { NetworkingEssentialsLessonContent } from "@/components/learn/networking-essentials-lesson-content";
import { CachingLessonContent } from "@/components/learn/caching-lesson-content";
import { CAPTheoremLessonContent } from "@/components/learn/cap-theorem-lesson-content";
import { ShardingLessonContent } from "@/components/learn/sharding-lesson-content";
import { ConsistentHashingLessonContent } from "@/components/learn/consistent-hashing-lesson-content";
import { KeyTechnologiesLessonContent } from "@/components/learn/key-technologies-lesson-content";
import { CommonPatternsLessonContent } from "@/components/learn/common-patterns-lesson-content";
import { QuestionBreakdownsLessonContent } from "@/components/learn/question-breakdowns-lesson-content";
import { APIDesignLessonContent } from "@/components/learn/api-design-lesson-content";
import { DataModelingLessonContent } from "@/components/learn/data-modeling-lesson-content";
import { DatabaseIndexingLessonContent } from "@/components/learn/database-indexing-lesson-content";
import { NumbersToKnowLessonContent } from "@/components/learn/numbers-to-know-lesson-content";
import {
  ExtendedSystemDesignLessonContent,
  EXTENDED_SYSTEM_DESIGN_LESSON_IDS,
} from "@/components/learn/extended-system-design-lessons";

const ICON_MAP = {
  clock: Clock,
  "book-open": BookOpen,
  "map-pin": MapPin,
  "layout-grid": LayoutGrid,
  zap: Zap,
  atom: Atom,
} as const;

function SectionIcon({ name }: { name: CourseSectionDef["icon"] }) {
  const I = ICON_MAP[name];
  return <I className="h-4 w-4 shrink-0 text-teal-500/70" aria-hidden />;
}

const LESSON_TOC: Record<
  string,
  { title: string; headings: { id: string; label: string; depth: number }[] }
> = {
  introduction: {
    title: "Course overview",
    headings: [
      { id: "intro-overview", label: "At a glance", depth: 0 },
      { id: "overview-structure", label: "Curriculum outline", depth: 0 },
      { id: "what-is-sd", label: "What happens in system design rounds?", depth: 0 },
      { id: "types", label: "Interview formats you'll see", depth: 0 },
      { id: "assessment", label: "How you're evaluated", depth: 0 },
      { id: "assessment-problem", label: "Framing the problem", depth: 1 },
      { id: "assessment-solution", label: "Crafting the solution", depth: 1 },
      { id: "assessment-technical", label: "Depth & technical rigor", depth: 1 },
      { id: "assessment-communication", label: "Clarity & teamwork", depth: 1 },
      { id: "how-to-use", label: "How to work through this guide", depth: 0 },
      { id: "time-needed", label: "Time investment", depth: 1 },
      { id: "conclusion", label: "Wrapping up", depth: 0 },
    ],
  },
  "how-to-prepare": {
    title: "Prep guide",
    headings: [
      { id: "build-foundation", label: "Lay the groundwork", depth: 0 },
      { id: "practice", label: "Drill, repeat, refine", depth: 0 },
      { id: "questions", label: "Sample prompts", depth: 0 },
      { id: "next-steps", label: "Where to go next", depth: 0 },
    ],
  },
  "delivery-framework": {
    title: "Interview playbook",
    headings: [
      { id: "overall-structure", label: "Big-picture layout", depth: 0 },
      { id: "df-course-map", label: "You are here (curriculum)", depth: 1 },
      { id: "interview-structure", label: "Six-step flow", depth: 1 },
      { id: "requirements", label: "Gathering requirements (~5 min)", depth: 0 },
      { id: "functional-reqs", label: "Functional needs", depth: 1 },
      { id: "non-functional-reqs", label: "Non-functional needs (NFRs)", depth: 1 },
      { id: "capacity-estimation", label: "Load & capacity math", depth: 1 },
      { id: "core-entities", label: "Core objects (~2 min)", depth: 0 },
      { id: "api-interface", label: "APIs & boundaries (~5 min)", depth: 0 },
      { id: "data-flow", label: "Data movement (optional)", depth: 0 },
      { id: "high-level-design", label: "High-level architecture (~10–15 min)", depth: 0 },
      { id: "deep-dives", label: "Component deep dives (~10 min)", depth: 0 },
    ],
  },
  "core-concepts-intro": {
    title: "Foundations snapshot",
    headings: [
      { id: "cc-structure", label: "How this section is organized", depth: 0 },
      { id: "networking", label: "Network fundamentals", depth: 0 },
      { id: "api-design", label: "Designing APIs", depth: 0 },
      { id: "data-modeling", label: "Data & schema design", depth: 0 },
      { id: "db-indexing", label: "Indexes & performance", depth: 0 },
      { id: "caching-section", label: "Cache strategies", depth: 0 },
      { id: "sharding-section", label: "Horizontal partitioning", depth: 0 },
      { id: "consistent-hashing-section", label: "Hash rings & distribution", depth: 0 },
      { id: "cap-section", label: "CAP trade-offs", depth: 0 },
      { id: "numbers-section", label: "Back-of-the-envelope numbers", depth: 0 },
    ],
  },
  "networking-essentials": {
    title: "Network fundamentals",
    headings: [
      { id: "osi-model", label: "OSI layers (refresher)", depth: 0 },
      { id: "tcp-udp", label: "TCP versus UDP", depth: 0 },
      { id: "http", label: "HTTP/1.1, HTTP/2, HTTP/3", depth: 0 },
      { id: "dns", label: "DNS essentials", depth: 0 },
    ],
  },
  "api-design": {
    title: "Designing APIs",
    headings: [
      { id: "api-types", label: "Styles of APIs", depth: 0 },
      { id: "rest", label: "REST", depth: 0 },
      { id: "graphql", label: "GraphQL", depth: 0 },
      { id: "grpc", label: "gRPC", depth: 0 },
      { id: "idempotency", label: "Safe retries (idempotency)", depth: 0 },
    ],
  },
  "data-modeling": {
    title: "Data & schema design",
    headings: [
      { id: "db-model-options", label: "Picking a datastore", depth: 0 },
      { id: "schema-design", label: "Modeling schemas", depth: 0 },
    ],
  },
  "database-indexing": {
    title: "Indexes & performance",
    headings: [
      { id: "indexing-overview", label: "Snapshot", depth: 0 },
      { id: "index-types", label: "Kinds of indexes", depth: 0 },
      { id: "composite-indexes", label: "Multi-column indexes", depth: 0 },
    ],
  },
  "caching": {
    title: "Cache strategies",
    headings: [
      { id: "caching-strategies", label: "Where and how to cache", depth: 0 },
      { id: "eviction-policies", label: "What to evict", depth: 0 },
      { id: "distributed-caching", label: "Caches across nodes", depth: 0 },
    ],
  },
  "sharding": {
    title: "Horizontal partitioning",
    headings: [
      { id: "sharding-why", label: "When splitting data helps", depth: 0 },
      { id: "sharding-strategies", label: "Sharding approaches", depth: 0 },
      { id: "sharding-tradeoffs", label: "Costs & trade-offs", depth: 0 },
    ],
  },
  "consistent-hashing": {
    title: "Hash rings & distribution",
    headings: [
      { id: "hashing-problem", label: "Hotspots & remapping", depth: 0 },
      { id: "consistent-hashing-sol", label: "Ring-based routing", depth: 0 },
      { id: "virtual-nodes", label: "Virtual nodes (vnodes)", depth: 0 },
    ],
  },
  "cap-theorem": {
    title: "CAP trade-offs",
    headings: [
      { id: "what-is-cap", label: "The CAP idea", depth: 0 },
      { id: "choose-consistency", label: "Favoring consistency", depth: 0 },
      { id: "choose-availability", label: "Favoring availability", depth: 0 },
      { id: "consistency-spectrum", label: "Strong vs eventual", depth: 0 },
    ],
  },
  "numbers-to-know": {
    title: "Back-of-the-envelope numbers",
    headings: [
      { id: "latency-numbers", label: "Latency cheat sheet", depth: 0 },
      { id: "scale-estimates", label: "Order-of-magnitude sizing", depth: 0 },
      { id: "quick-math", label: "Mental math for interviews", depth: 0 },
    ],
  },
  "key-technologies-intro": {
    title: "Tech landscape (intro)",
    headings: [
      { id: "kt-intro", label: "Overview", depth: 0 },
      { id: "databases", label: "Data stores", depth: 0 },
      { id: "queues", label: "Queues & streams", depth: 0 },
      { id: "search", label: "Search infra", depth: 0 },
      { id: "storage", label: "Blob storage & CDNs", depth: 0 },
    ],
  },
  "common-patterns-intro": {
    title: "Pattern primer",
    headings: [
      { id: "patterns-intro", label: "Overview", depth: 0 },
      { id: "fanout", label: "Fan-out workloads", depth: 0 },
      { id: "saga", label: "Saga workflows", depth: 0 },
      { id: "rate-limiting", label: "Throttling & quotas", depth: 0 },
      { id: "circuit-breaker", label: "Circuit breakers", depth: 0 },
    ],
  },
  "question-breakdowns-intro": {
    title: "Deconstructing prompts",
    headings: [
      { id: "qb-how-to-use", label: "Using this section", depth: 0 },
      { id: "qb-list", label: "Prompt bank", depth: 0 },
    ],
  },
  "wt-url-shortener": {
    title: "URL shortener",
    headings: [
      { id: "wt-url-clarify", label: "Clarify requirements", depth: 0 },
      { id: "wt-url-capacity", label: "Back-of-envelope capacity", depth: 0 },
      { id: "wt-url-api", label: "API sketch", depth: 0 },
      { id: "wt-url-data", label: "Data model & encoding", depth: 0 },
      { id: "wt-url-deep", label: "Deep dives", depth: 0 },
    ],
  },
  "wt-news-feed": {
    title: "Fan-out news feed",
    headings: [
      { id: "wt-feed-clarify", label: "Scope", depth: 0 },
      { id: "wt-feed-model", label: "Fan-out model", depth: 0 },
      { id: "wt-feed-storage", label: "Storage & retrieval", depth: 0 },
      { id: "wt-feed-scale", label: "Ranking & scale hooks", depth: 0 },
    ],
  },
  "wt-notification-system": {
    title: "Notification system",
    headings: [
      { id: "wt-notify-clarify", label: "Requirements", depth: 0 },
      { id: "wt-notify-pipeline", label: "Pipeline", depth: 0 },
      { id: "wt-notify-idem", label: "Idempotency & dedupe", depth: 0 },
      { id: "wt-notify-observe", label: "Observability", depth: 0 },
    ],
  },
  "pat-gateway-bff": {
    title: "Gateways & BFF",
    headings: [
      { id: "pat-gw-edge", label: "API gateway responsibilities", depth: 0 },
      { id: "pat-gw-bff", label: "Backend-for-frontend", depth: 0 },
      { id: "pat-gw-failure", label: "Failure modes", depth: 0 },
    ],
  },
  "pat-event-driven": {
    title: "Event-driven backbone",
    headings: [
      { id: "pat-ev-building", label: "Building blocks", depth: 0 },
      { id: "pat-ev-saga", label: "Sagas & compensation", depth: 0 },
      { id: "pat-ev-ops", label: "Operational cautions", depth: 0 },
    ],
  },
  "pat-strangler": {
    title: "Strangler fig migration",
    headings: [
      { id: "pat-strangler-seams", label: "Find seams", depth: 0 },
      { id: "pat-strangler-data", label: "Data synchronization", depth: 0 },
      { id: "pat-strangler-risk", label: "Risk controls", depth: 0 },
    ],
  },
  "tech-kafka-streams": {
    title: "Kafka & streams",
    headings: [
      { id: "tech-kafka-core", label: "Core concepts", depth: 0 },
      { id: "tech-kafka-streams-api", label: "Stream processors", depth: 0 },
      { id: "tech-kafka-ops", label: "Operations", depth: 0 },
    ],
  },
  "tech-redis-production": {
    title: "Redis at scale",
    headings: [
      { id: "tech-redis-topo", label: "Topologies", depth: 0 },
      { id: "tech-redis-memory", label: "Memory discipline", depth: 0 },
      { id: "tech-redis-persist", label: "Durability notes", depth: 0 },
    ],
  },
  "tech-object-storage": {
    title: "Object storage & CDN",
    headings: [
      { id: "tech-obj-model", label: "Consistency & listing", depth: 0 },
      { id: "tech-obj-lifecycle", label: "Lifecycle tiers", depth: 0 },
      { id: "tech-obj-cdn", label: "CDN integration", depth: 0 },
    ],
  },
  "adv-leader-election": {
    title: "Leader election",
    headings: [
      { id: "adv-le-why", label: "Why it matters", depth: 0 },
      { id: "adv-le-raft", label: "Raft sketch", depth: 0 },
      { id: "adv-le-zk", label: "ZooKeeper / etcd patterns", depth: 0 },
    ],
  },
  "adv-observability": {
    title: "Tracing & SLOs",
    headings: [
      { id: "adv-obs-three", label: "Three pillars", depth: 0 },
      { id: "adv-obs-slos", label: "SLO design", depth: 0 },
      { id: "adv-obs-cost", label: "Sampling & cost", depth: 0 },
    ],
  },
  "adv-release-safety": {
    title: "Progressive delivery",
    headings: [
      { id: "adv-rel-canary", label: "Canary releases", depth: 0 },
      { id: "adv-rel-bg", label: "Blue / green", depth: 0 },
      { id: "adv-rel-flags", label: "Feature flags", depth: 0 },
    ],
  },
};

function placeholderBody(lessonId: string) {
  return (
    <p className="text-gray-400 leading-relaxed">
      Content for <strong className="text-white">{lessonId}</strong> will appear here once you add it.
    </p>
  );
}

export default function SystemDesignCourseClient() {
  const [activeLesson, setActiveLesson] = React.useState("introduction");
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    for (const s of SYSTEM_DESIGN_SECTIONS) {
      o[s.id] = s.defaultOpen ?? false;
    }
    return o;
  });
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [readProgress, setReadProgress] = React.useState(0);
  const [activeHeading, setActiveHeading] = React.useState<string>("");

  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setReadProgress(max <= 0 ? 100 : Math.min(100, Math.round((scrollTop / max) * 100)));
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeLesson]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectLesson = (lesson: LessonItem) => {
    if (lesson.locked) return;
    setActiveLesson(lesson.id);
    setMobileNavOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  };

  const toc = LESSON_TOC[activeLesson];
  const lessonTitle = toc?.title ?? activeLesson.replace(/-/g, " ");

  React.useEffect(() => {
    if (!toc?.headings?.length) {
      setActiveHeading("");
      return;
    }
    setActiveHeading(toc.headings[0]?.id ?? "");
  }, [activeLesson, toc]);

  React.useEffect(() => {
    if (!toc?.headings?.length) return;
    const root = mainRef.current;
    if (!root) return;

    const targets = toc.headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const visibleMap = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) {
            visibleMap.set(id, entry.intersectionRatio);
          } else {
            visibleMap.delete(id);
          }
        }

        let bestId = "";
        let bestScore = -1;
        for (const h of toc.headings) {
          const score = visibleMap.get(h.id) ?? -1;
          if (score > bestScore) {
            bestScore = score;
            bestId = h.id;
          }
        }
        if (bestId) setActiveHeading(bestId);
      },
      {
        root,
        threshold: [0.25, 0.4, 0.6, 0.8],
        rootMargin: "-10% 0px -55% 0px",
      }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeLesson, toc]);

  const scrollToHeading = React.useCallback((id: string) => {
    const root = mainRef.current;
    const target = document.getElementById(id);
    if (!root || !target) return;
    const rootRect = root.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const top = root.scrollTop + (targetRect.top - rootRect.top) - 18;
    root.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    setActiveHeading(id);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0b0c14] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 62% 38% at 18% -8%, rgba(20,184,166,0.14), transparent 58%), radial-gradient(ellipse 55% 30% at 100% 100%, rgba(99,102,241,0.14), transparent 54%)",
        }}
      />
      {/* Mobile nav bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-white/[0.08] bg-[#0b0c14]/95 px-3 py-2 backdrop-blur-xl xl:hidden">
        <div className="flex min-w-0 items-center gap-1.5">
          <Link
            href="/"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Back to MADAlgos home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-white"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </div>
        <span className="truncate text-[11px] text-gray-400">{lessonTitle}</span>
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,360px)] flex-col border-r border-white/[0.08] bg-[#0b0c14] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Learn system design
              </span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-white/5"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
              <CourseSidebarNav
                openSections={openSections}
                toggleSection={toggleSection}
                activeLesson={activeLesson}
                onSelectLesson={selectLesson}
              />
            </div>
            <SidebarFooter />
          </div>
        </div>
      ) : null}

      {/* 3-column grid */}
      <div className="relative grid min-h-screen grid-cols-1 xl:grid-cols-[280px_1fr_280px]">

        {/* LEFT SIDEBAR */}
        <aside className="hidden xl:flex flex-col border-r border-white/[0.08] bg-[#0b0c14]/85 backdrop-blur-xl">
          <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
            <div className="border-b border-white/[0.08] px-4 py-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs text-gray-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to main
              </Link>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                Learn system design
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-2">
              <CourseSidebarNav
                openSections={openSections}
                toggleSection={toggleSection}
                activeLesson={activeLesson}
                onSelectLesson={selectLesson}
              />
            </div>
            <SidebarFooter />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main ref={mainRef} className="h-screen overflow-y-auto">
          <div className="mx-auto max-w-[760px] px-6 py-8 text-[15.5px] leading-[1.8] tracking-[0.01em] text-white">
            {activeLesson === "introduction" ? (
              <article className="max-w-none">
                <IntroductionLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "how-to-prepare" ? (
              <article className="max-w-none">
                <HowToPrepareLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "delivery-framework" ? (
              <article className="max-w-none">
                <DeliveryFrameworkLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "core-concepts-intro" ? (
              <article className="max-w-none">
                <CoreConceptsLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "networking-essentials" ? (
              <article className="max-w-none">
                <NetworkingEssentialsLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "caching" ? (
              <article className="max-w-none">
                <CachingLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "cap-theorem" ? (
              <article className="max-w-none">
                <CAPTheoremLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "sharding" ? (
              <article className="max-w-none">
                <ShardingLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "consistent-hashing" ? (
              <article className="max-w-none">
                <ConsistentHashingLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "key-technologies-intro" ? (
              <article className="max-w-none">
                <KeyTechnologiesLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "common-patterns-intro" ? (
              <article className="max-w-none">
                <CommonPatternsLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "question-breakdowns-intro" ? (
              <article className="max-w-none">
                <QuestionBreakdownsLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "api-design" ? (
              <article className="max-w-none">
                <APIDesignLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "data-modeling" ? (
              <article className="max-w-none">
                <DataModelingLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "database-indexing" ? (
              <article className="max-w-none">
                <DatabaseIndexingLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : activeLesson === "numbers-to-know" ? (
              <article className="max-w-none">
                <NumbersToKnowLessonContent
                  onNavigate={(id) => {
                    setActiveLesson(id);
                    mainRef.current?.scrollTo({ top: 0 });
                  }}
                />
              </article>
            ) : EXTENDED_SYSTEM_DESIGN_LESSON_IDS.has(activeLesson) ? (
              <article className="max-w-none">
                <ExtendedSystemDesignLessonContent lessonId={activeLesson} />
              </article>
            ) : (
              <>
                <p className="text-sm text-gray-400">System design in a hurry</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight">{lessonTitle}</h1>
                <p className="mt-3 text-gray-400">
                  Full lesson content coming soon. Check back after we finish the course rollout.
                </p>
                <div className="mt-8 space-y-6 text-gray-300">
                  {placeholderBody(activeLesson)}
                </div>
              </>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden xl:block border-l border-white/[0.08] bg-[#0b0c14]/78 backdrop-blur-xl">
          <div className="sticky top-0 flex h-screen flex-col gap-6 px-3 py-6">

            {/* Promo card */}
            <div className="group relative shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f111a]/95 p-4 shadow-[0_22px_48px_rgba(0,0,0,0.45)]">
              <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-teal-400/20 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <span className="absolute right-3 top-3 rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-bold text-teal-400">
                Save up to 20%
              </span>
              <p className="text-base font-bold text-white">Premium membership</p>
              <p className="mt-1 text-xs text-gray-500">Full access to mentorship & mock interviews</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-500" />
                  1:1 mentorship programs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-500" />
                  Realistic mock interviews
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-500" />
                  Expert feedback on your sessions
                </li>
              </ul>
              <Link
                href="/book-mentorship"
                className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-2 text-sm font-semibold text-black transition hover:bg-gray-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)]"
              >
                Explore plans
              </Link>
            </div>

            {/* Reading progress */}
            <div className="shrink-0">
              <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  Lesson progress
                </span>
                <span className="text-teal-400">{readProgress}%</span>
              </div>
              <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-[3px] rounded-full bg-teal-500 shadow-[0_0_14px_rgba(20,184,166,0.45)] transition-[width] duration-300"
                  style={{ width: `${readProgress}%` }}
                />
              </div>
            </div>

            {/* TOC */}
            {toc ? (
              <div className="flex-1 overflow-hidden">
                <p className="mb-3 text-xs text-gray-400">In this lesson</p>
                <ul className="max-h-[48vh] space-y-2 overflow-auto border-l border-white/10 pl-3 text-[13px] text-gray-500 pr-1">
                  {toc.headings.map((h, i) => (
                    <li key={h.id} style={{ paddingLeft: h.depth * 10 }}>
                      <button
                        type="button"
                        onClick={() => scrollToHeading(h.id)}
                        className={cn(
                          "block w-full text-left transition-colors hover:text-teal-400",
                          activeHeading === h.id || (!activeHeading && i === 0) ? "text-teal-400" : ""
                        )}
                      >
                        {h.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}

function CourseSidebarNav({
  openSections,
  toggleSection,
  activeLesson,
  onSelectLesson,
}: {
  openSections: Record<string, boolean>;
  toggleSection: (id: string) => void;
  activeLesson: string;
  onSelectLesson: (l: LessonItem) => void;
}) {
  return (
    <nav className="space-y-0.5" aria-label="Course lessons">
      {SYSTEM_DESIGN_SECTIONS.map((section) => {
        const open = openSections[section.id] ?? false;
        const hasLessons = section.lessons.length > 0;
        return (
          <div key={section.id}>
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <SectionIcon name={section.icon} />
              <span className="min-w-0 flex-1 truncate">{section.title}</span>
              {open ? (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-600" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-600" />
              )}
            </button>
            {open && !hasLessons ? (
              <p className="px-2 pb-2 pl-9 text-[12px] text-gray-600">Lessons coming soon.</p>
            ) : null}
            {hasLessons && open ? (
              <ul className="ml-[18px] border-l border-white/[0.06] py-0.5 pl-3">
                {section.lessons.map((lesson) => {
                  const isActive = activeLesson === lesson.id;
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        disabled={lesson.locked}
                        onClick={() => onSelectLesson(lesson)}
                        className={cn(
                          "flex w-full items-center gap-2.5 py-[7px] pl-2 pr-1 text-left text-[13px] transition-colors",
                          isActive
                            ? "-ml-[13px] border-l-2 border-teal-500 bg-teal-500/10 pl-[calc(0.5rem+11px)] font-medium text-teal-300"
                            : "text-gray-500 hover:bg-white/5 hover:text-gray-300",
                          lesson.locked && "cursor-not-allowed opacity-50"
                        )}
                      >
                        {lesson.locked ? (
                          <Lock className="h-3 w-3 shrink-0 text-gray-600" />
                        ) : isActive ? (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-400" />
                        ) : (
                          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-white/15" aria-hidden />
                        )}
                        <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  return null;
}
