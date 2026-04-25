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
    title: "Introduction",
    headings: [
      { id: "intro-overview", label: "Overview", depth: 0 },
      { id: "overview-structure", label: "Course map", depth: 0 },
      { id: "what-is-sd", label: "What are system design interviews?", depth: 0 },
      { id: "types", label: "Types of System Design Interviews", depth: 0 },
      { id: "assessment", label: "Assessment", depth: 0 },
      { id: "assessment-problem", label: "Problem Navigation", depth: 1 },
      { id: "assessment-solution", label: "Solution Design", depth: 1 },
      { id: "assessment-technical", label: "Technical Excellence", depth: 1 },
      { id: "assessment-communication", label: "Communication & Collaboration", depth: 1 },
      { id: "how-to-use", label: "How to Use This Guide", depth: 0 },
      { id: "time-needed", label: "How much time do I need?", depth: 1 },
      { id: "conclusion", label: "Conclusion", depth: 0 },
    ],
  },
  "how-to-prepare": {
    title: "How to Prepare",
    headings: [
      { id: "build-foundation", label: "Build a Foundation", depth: 0 },
      { id: "practice", label: "Practice Practice Practice", depth: 0 },
      { id: "questions", label: "Interview Questions", depth: 0 },
      { id: "next-steps", label: "Next steps", depth: 0 },
    ],
  },
  "delivery-framework": {
    title: "Delivery Framework",
    headings: [
      { id: "overall-structure", label: "Overall Structure", depth: 0 },
      { id: "df-course-map", label: "Course map (you are here)", depth: 1 },
      { id: "interview-structure", label: "Six-step framework", depth: 1 },
      { id: "requirements", label: "Requirements (~5 min)", depth: 0 },
      { id: "functional-reqs", label: "Functional Requirements", depth: 1 },
      { id: "non-functional-reqs", label: "Non-functional Requirements", depth: 1 },
      { id: "capacity-estimation", label: "Capacity Estimation", depth: 1 },
      { id: "core-entities", label: "Core Entities (~2 min)", depth: 0 },
      { id: "api-interface", label: "API or Interface (~5 min)", depth: 0 },
      { id: "data-flow", label: "Data Flow (optional)", depth: 0 },
      { id: "high-level-design", label: "High Level Design (~10-15 min)", depth: 0 },
      { id: "deep-dives", label: "Deep Dives (~10 min)", depth: 0 },
    ],
  },
  "core-concepts-intro": {
    title: "Core Concepts",
    headings: [
      { id: "cc-structure", label: "Overall Structure", depth: 0 },
      { id: "networking", label: "Networking Essentials", depth: 0 },
      { id: "api-design", label: "API Design", depth: 0 },
      { id: "data-modeling", label: "Data Modeling", depth: 0 },
      { id: "db-indexing", label: "Database Indexing", depth: 0 },
      { id: "caching-section", label: "Caching", depth: 0 },
      { id: "sharding-section", label: "Sharding", depth: 0 },
      { id: "consistent-hashing-section", label: "Consistent Hashing", depth: 0 },
      { id: "cap-section", label: "CAP Theorem", depth: 0 },
      { id: "numbers-section", label: "Numbers to Know", depth: 0 },
    ],
  },
  "networking-essentials": {
    title: "Networking Essentials",
    headings: [
      { id: "osi-model", label: "The OSI Model", depth: 0 },
      { id: "tcp-udp", label: "TCP vs UDP", depth: 0 },
      { id: "http", label: "HTTP (1.1, 2, 3)", depth: 0 },
      { id: "dns", label: "DNS", depth: 0 },
    ],
  },
  "api-design": {
    title: "API Design",
    headings: [
      { id: "api-types", label: "API Types", depth: 0 },
      { id: "rest", label: "REST", depth: 0 },
      { id: "graphql", label: "GraphQL", depth: 0 },
      { id: "grpc", label: "gRPC", depth: 0 },
      { id: "idempotency", label: "Idempotency", depth: 0 },
    ],
  },
  "data-modeling": {
    title: "Data Modeling",
    headings: [
      { id: "db-model-options", label: "Database Options", depth: 0 },
      { id: "schema-design", label: "Schema Design", depth: 0 },
    ],
  },
  "database-indexing": {
    title: "Database Indexing",
    headings: [
      { id: "indexing-overview", label: "Overview", depth: 0 },
      { id: "index-types", label: "Index Types", depth: 0 },
      { id: "composite-indexes", label: "Composite Indexes", depth: 0 },
    ],
  },
  "caching": {
    title: "Caching",
    headings: [
      { id: "caching-strategies", label: "Caching Strategies", depth: 0 },
      { id: "eviction-policies", label: "Eviction Policies", depth: 0 },
      { id: "distributed-caching", label: "Distributed Caching", depth: 0 },
    ],
  },
  "sharding": {
    title: "Sharding",
    headings: [
      { id: "sharding-why", label: "Why Shard?", depth: 0 },
      { id: "sharding-strategies", label: "Strategies", depth: 0 },
      { id: "sharding-tradeoffs", label: "Tradeoffs", depth: 0 },
    ],
  },
  "consistent-hashing": {
    title: "Consistent Hashing",
    headings: [
      { id: "hashing-problem", label: "The Problem", depth: 0 },
      { id: "consistent-hashing-sol", label: "The Solution", depth: 0 },
      { id: "virtual-nodes", label: "Virtual Nodes", depth: 0 },
    ],
  },
  "cap-theorem": {
    title: "CAP Theorem",
    headings: [
      { id: "what-is-cap", label: "What is CAP?", depth: 0 },
      { id: "choose-consistency", label: "Choosing Consistency", depth: 0 },
      { id: "choose-availability", label: "Choosing Availability", depth: 0 },
      { id: "consistency-spectrum", label: "Consistency Spectrum", depth: 0 },
    ],
  },
  "numbers-to-know": {
    title: "Numbers to Know",
    headings: [
      { id: "latency-numbers", label: "Latency Numbers", depth: 0 },
      { id: "scale-estimates", label: "Scale Estimates", depth: 0 },
      { id: "quick-math", label: "Interview Math", depth: 0 },
    ],
  },
  "key-technologies-intro": {
    title: "Key Technologies",
    headings: [
      { id: "kt-intro", label: "Introduction", depth: 0 },
      { id: "databases", label: "Databases", depth: 0 },
      { id: "queues", label: "Message Queues", depth: 0 },
      { id: "search", label: "Search", depth: 0 },
      { id: "storage", label: "Storage & CDN", depth: 0 },
    ],
  },
  "common-patterns-intro": {
    title: "Common Patterns",
    headings: [
      { id: "patterns-intro", label: "Introduction", depth: 0 },
      { id: "fanout", label: "Fan-out", depth: 0 },
      { id: "saga", label: "Saga Pattern", depth: 0 },
      { id: "rate-limiting", label: "Rate Limiting", depth: 0 },
      { id: "circuit-breaker", label: "Circuit Breaker", depth: 0 },
    ],
  },
  "question-breakdowns-intro": {
    title: "Question Breakdowns",
    headings: [
      { id: "qb-how-to-use", label: "How to Use", depth: 0 },
      { id: "qb-list", label: "Question List", depth: 0 },
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
                Up to 20% off
              </span>
              <p className="text-base font-bold text-white">MADAlgos Premium</p>
              <p className="mt-1 text-xs text-gray-500">Unlock the full learning experience</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-500" />
                  Live mentorship tracks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-500" />
                  Interview-style mocks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal-500" />
                  Mentor-reviewed feedback
                </li>
              </ul>
              <Link
                href="/book-mentorship"
                className="mt-4 flex w-full items-center justify-center rounded-full bg-white py-2 text-sm font-semibold text-black transition hover:bg-gray-200 hover:shadow-[0_0_28px_rgba(255,255,255,0.2)]"
              >
                Learn more
              </Link>
            </div>

            {/* Reading progress */}
            <div className="shrink-0">
              <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  Reading progress
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
                <p className="mb-3 text-xs text-gray-400">On this page</p>
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
