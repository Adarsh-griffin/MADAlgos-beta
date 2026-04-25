"use client";

import React from "react";
import { Info, Lock, AlertTriangle, Lightbulb } from "lucide-react";
import {
  CourseOverallStructureDiagram,
  InterviewerRubricDiagram,
  SixInterviewTypesDiagram,
} from "@/components/learn/introduction-lesson-diagrams";

export function IntroductionLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  const [timeOpen, setTimeOpen] = React.useState(false);

  return (
    <div className="not-prose space-y-8">
    <div className="not-prose space-y-12">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-orange-700 shadow-2xl">
        {/* Hand-drawn Background Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ 
            backgroundImage: 'url("/images/intro_hero_background_handdrawn.png")',
            backgroundSize: '800px',
            backgroundRepeat: 'repeat'
          }}
        />
        
        {/* Animated Accent Glows */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative flex flex-col items-center justify-center px-4 py-16 md:py-24">
          {/* Main White Pill Logo */}
          <div className="transform rounded-full bg-white px-10 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-transform hover:scale-105">
            <h2 className="text-xl font-black tracking-tight text-slate-900 md:text-3xl">
              System Design <span className="text-orange-600">in a hurry</span>
            </h2>
          </div>
          
          {/* Subtitle */}
          <p className="mt-6 text-center text-sm font-medium text-white/90 md:text-base">
            The fast-track to mastering distributed systems
          </p>
        </div>

      </div>

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-500">
          <span className="h-px w-8 bg-orange-500/30" />
          System Design in a Hurry
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Introduction</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Learn system design quickly with an interview-first curriculum covering the essentials hiring panels
          evaluate at top product companies.
        </p>
      </header>

      {/* Opening */}
      <section id="intro-overview" className="scroll-mt-12 space-y-6">
        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-muted-foreground/90">
            From years of interview loops at companies such as <span className="font-semibold text-foreground">Meta</span> and <span className="font-semibold text-foreground">Amazon</span>, we&apos;ve distilled the signals candidates most
            often miss in system design rounds.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            We call this course &ldquo;System Design in a Hurry&rdquo; because we teach from outcome to theory: we{" "}
            <strong className="text-foreground border-b border-orange-500/50">work backwards</strong> from the exact interview signals you need to show.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
              1
            </div>
            <h3 className="mb-2 font-bold text-foreground">Efficiency First</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              If your prep window is short, focus on{" "}
              <span className="text-foreground">the highest-impact interview skills</span> first.
            </p>
          </div>
          <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all">
              2
            </div>
            <h3 className="mb-2 font-bold text-foreground">Real-world Context</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Anchor concepts to <span className="text-foreground">real production tradeoffs</span>, not just theory.
            </p>
          </div>
        </div>

        <p className="border-l-2 border-white/10 pl-6 italic text-muted-foreground">
          Many resources are either too shallow to be useful or too academic for a 45-minute interview. This guide
          is intentionally <strong className="text-foreground">focused, practical, and execution-oriented</strong>.
        </p>
      </section>

      {/* Premium callout */}
      <aside className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-r from-sky-500/10 to-transparent p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
            <Info className="h-5 w-5" />
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-sky-400">Go Deeper with Premium</h4>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              We&apos;ve augmented this course with <strong className="text-foreground">premium deep-dives</strong> on 
              <span className="text-sky-300 mx-1 cursor-pointer hover:underline decoration-sky-300/30">Realtime Updates</span>, 
              <span className="text-sky-300 mx-1 cursor-pointer hover:underline decoration-sky-300/30">Vector Databases</span>, and 
              <span className="text-sky-300 mx-1 cursor-pointer hover:underline decoration-sky-300/30">Infrastructure Case Studies</span>. 
              These are denoted with a <Lock className="mb-1 inline h-3.5 w-3.5" /> lock icon.
            </p>
          </div>
        </div>
      </aside>

      {/* Course map */}
      <section id="overview-structure" className="scroll-mt-12 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">Course Roadmap</h2>
          <p className="max-w-3xl text-muted-foreground">
            Follow this bottom-up sequence: fundamentals first, then patterns, then the delivery framework you will use in the interview.
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
          <CourseOverallStructureDiagram />
        </div>
      </section>

      {/* What are system design interviews? */}
      <section id="what-is-sd" className="scroll-mt-12 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">What are system design interviews?</h2>
        <div className="prose prose-invert max-w-none space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            System design interviews assess your ability to take an <span className="text-foreground">ambiguously defined, high-level problem</span> 
            and break it down into the pieces of infrastructure needed to solve it. Unlike LeetCode, these are 
            highly practical and simulate real-world architectural work.
          </p>
          <div className="rounded-xl bg-orange-500/5 border border-orange-500/20 p-5">
            <p className="text-foreground font-semibold flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-orange-400" />
              There is no single &quot;Right&quot; answer.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Interviewers look for your ability to navigate complexity, reason about trade-offs, and communicate 
              technical decisions clearly.
            </p>
          </div>
        </div>
      </section>

      {/* Types */}
      <section id="types" className="scroll-mt-12 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">The Interview Landscape</h2>
          <p className="text-muted-foreground">
            Most interviews fall into &quot;Product Design&quot; or &quot;Infrastructure Design&quot;.
          </p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
          <SixInterviewTypesDiagram />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs">
            <h4 className="mb-2 font-bold text-teal-400">Low-Level Design</h4>
            <p className="text-muted-foreground">Focused on class structure and OOD. See our LLD guide.</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs">
            <h4 className="mb-2 font-bold text-purple-400">ML System Design</h4>
            <p className="text-muted-foreground">Modeling, feature engineering, and inference scaling.</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs">
            <h4 className="mb-2 font-bold text-sky-400">Frontend Design</h4>
            <p className="text-muted-foreground">Interface architecture, state management, and asset loading.</p>
          </div>
        </div>
      </section>

      {/* Assessment Quadrants */}
      <section id="assessment" className="scroll-mt-12 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">The Assessment Rubric</h2>
          <p className="text-muted-foreground">
            How FAANG panel members actually grade your performance.
          </p>
        </div>

        <InterviewerRubricDiagram />

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Quadrant 1 */}
          <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-6 transition-all hover:bg-emerald-500/[0.04]">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <h4 className="font-bold text-emerald-400">Problem Navigation</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Ability to prioritize requirements and drive toward a working system slice.
            </p>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Failure Modes</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-rose-500">✕</span>
                  Exploring the wrong requirements first.
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">✕</span>
                  Getting stuck on trivial UI details.
                </li>
              </ul>
            </div>
          </div>

          {/* Quadrant 2 */}
          <div className="space-y-4 rounded-2xl border border-sky-500/20 bg-sky-500/[0.02] p-6 transition-all hover:bg-sky-500/[0.04]">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-sky-500" />
              <h4 className="font-bold text-sky-400">Solution Design</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Architecture that satisfies functional and non-functional goals effectively.
            </p>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Failure Modes</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-rose-500">✕</span>
                  Ignoring scaling constraints (e.g., millions of RPS).
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">✕</span>
                  &quot;Spaghetti&quot; service relationships.
                </li>
              </ul>
            </div>
          </div>

          {/* Quadrant 3 */}
          <div className="space-y-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] p-6 transition-all hover:bg-amber-500/[0.04]">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <h4 className="font-bold text-amber-400">Technical Excellence</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Depth of knowledge in databases, networking, and consistent hashing.
            </p>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Failure Modes</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-rose-500">✕</span>
                  Using outdated hardware assumptions.
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">✕</span>
                  Not knowing how a technology (like Redis) works under the hood.
                </li>
              </ul>
            </div>
          </div>

          {/* Quadrant 4 */}
          <div className="space-y-4 rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] p-6 transition-all hover:bg-rose-500/[0.04]">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <h4 className="font-bold text-rose-400">Communication</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Collaborative reasoning and responsiveness to interviewer feedback.
            </p>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Failure Modes</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-rose-500">✕</span>
                  Being defensive when architecture is challenged.
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500">✕</span>
                  Failing to explain the &quot;Why&quot; behind a choice.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 text-amber-400" />
            <p className="text-sm text-muted-foreground">
              If you&apos;re a <strong className="text-foreground">Staff+ engineer</strong>, rubrics shift toward leadership, 
              strategic trade-offs, and multi-year vision. Check our blog for specific Staff guidance.
            </p>
          </div>
        </aside>
      </section>

      {/* How to Use This Guide */}
      <section id="how-to-use" className="scroll-mt-12 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">How to Use This Guide</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted-foreground">
            We recommend reading in order, but feel free to skip sections where you already have strong FAANG experience. 
            The goal is to move from <strong className="text-foreground">Foundations → Playbook → Practice</strong>.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h4 className="font-bold text-white">The Foundation</h4>
            <p className="mt-2 text-sm text-muted-foreground">Core Concepts and Key Technologies are your vocabulary.</p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <h4 className="font-bold text-white">The Playbook</h4>
            <p className="mt-2 text-sm text-muted-foreground">The Delivery Framework is the step-by-step process used in the room.</p>
          </div>
        </div>

        {/* Time needed accordion */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
           <button
             type="button"
             onClick={() => setTimeOpen((v) => !v)}
             className="flex w-full items-center justify-between p-5 transition-colors hover:bg-white/[0.04]"
           >
             <div className="flex items-center gap-3">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400 text-sm font-bold">?</div>
               <span className="font-bold text-foreground">How much time do I need?</span>
             </div>
             <div className="text-xs text-muted-foreground">{timeOpen ? "Close" : "Expand"}</div>
           </button>
           {timeOpen && (
             <div className="border-t border-white/10 p-5 text-sm text-muted-foreground animate-in slide-in-from-top-1">
               <p className="leading-relaxed">
                 Plan for <strong className="text-foreground">3&ndash;4 weeks</strong> if distributed systems are new to you. 
                 Experienced engineers can typically prepare in <strong className="text-foreground">under a week</strong> by focusing on the 
                 Framework and Pattern deep-dives.
               </p>
               <div className="mt-4 rounded-lg bg-teal-500/5 border border-teal-500/20 p-3 italic">
                 Pro tip: Ask your recruiter to push the date back if you need more time. Most will prioritize a pass over a fast date!
               </div>
             </div>
           )}
        </div>
      </section>

      {/* Conclusion */}
      <section id="conclusion" className="scroll-mt-12 space-y-6 pt-12">
        <div className="rounded-3xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Ready to start?</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            We&apos;re excited to help you land your next senior role. Dive into the Foundation next.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={() => onNavigate("core-concepts-intro")}
              className="rounded-full bg-orange-600 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Start Foundation &rarr;
            </button>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground">
          Next:{" "}
          <button
            type="button"
            onClick={() => onNavigate("how-to-prepare")}
            className="text-orange-500 font-medium hover:underline"
          >
            How to Prepare
          </button>
        </p>
      </section>
    </div>  </div>
  );
}
