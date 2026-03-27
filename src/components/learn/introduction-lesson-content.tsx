"use client";

import React from "react";
import { Info, Lock, AlertTriangle, Lightbulb } from "lucide-react";
import {
  CourseOverallStructureDiagram,
  InterviewerRubricDiagram,
  SixInterviewTypesDiagram,
} from "@/components/learn/introduction-lesson-diagrams";

export function IntroductionLessonContent() {
  const [timeOpen, setTimeOpen] = React.useState(false);

  return (
    <div className="not-prose space-y-8">
      {/* Hero — replace src with your actual banner asset */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-700 shadow-lg">
        <img
          src="/images/course-banner-sd.png"
          alt="System Design in a hurry — course banner"
          className="h-auto w-full object-cover"
          onError={(e) => {
            const t = e.currentTarget;
            t.style.display = "none";
            if (t.nextElementSibling) (t.nextElementSibling as HTMLElement).style.display = "flex";
          }}
        />
        {/* Fallback if image not found */}
        <div className="hidden items-center justify-center px-4 py-12 md:py-16">
          <div className="rounded-lg border-2 border-white/90 bg-white px-8 py-4 text-center shadow-md">
            <p className="text-lg font-bold tracking-tight text-slate-900 md:text-xl">System Design in a hurry</p>
          </div>
        </div>
        {/* Carousel-style dot indicators */}
        <div className="flex justify-center gap-1.5 bg-black/20 py-2.5">
          <span className="h-[6px] w-[6px] rounded-full bg-white/40" />
          <span className="h-[6px] w-5 rounded-full bg-white/80" />
          <span className="h-[6px] w-[6px] rounded-full bg-white/40" />
        </div>
      </div>

      <header className="space-y-3">
        <p className="text-sm text-muted-foreground">System Design in a Hurry</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Introduction</h1>
        <p className="text-[15px] leading-[1.8] text-muted-foreground">
          Learn system design fast. All the essentials needed to pass a system design interview, built by FAANG hiring
          managers and staff engineers.
        </p>
      </header>

      {/* Opening */}
      <section id="intro-overview" className="scroll-mt-12 space-y-4">
        <p className="leading-[1.8] text-muted-foreground">
          After conducting literally thousands of interviews at companies like Meta and Amazon, we&apos;ve collected the
          most important things that candidates need to know to succeed in system design interviews. We call our course
          &ldquo;System Design in a Hurry&rdquo; and it&apos;s used by tens of thousands of software engineers
          interviewing at top companies because we take a fundamentally different approach to teaching system design than
          you might find elsewhere, by <strong className="text-foreground">working backwards</strong> from those things
          you need to know in order to succeed in an interview.
        </p>

        <p className="leading-[1.8] text-muted-foreground">This is helpful for two reasons:</p>

        <ol className="list-none space-y-5 pl-0">
          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              1
            </span>
            <p className="leading-[1.8] text-muted-foreground">
              If you don&apos;t have a lot of time between now and your interview, you&apos;re going to{" "}
              <strong className="text-foreground">learn the most impactful things as quickly as possible</strong>, and
            </p>
          </li>
          <li className="flex gap-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-white shadow-sm">
              2
            </span>
            <p className="leading-[1.8] text-muted-foreground">
              As you learn new things you&apos;ll be able to{" "}
              <strong className="text-foreground">connect them to real systems and real problems</strong> rather than
              just accumulating academic knowledge.
            </p>
          </li>
        </ol>

        <p className="leading-[1.8] text-muted-foreground">
          Other system design materials are either ChatGPT spew or go to a level of depth that you&apos;ll never
          possibly cover in an interview (and might be a yellow flag if you do). We aimed to make &ldquo;System Design
          in a Hurry&rdquo; <strong className="text-foreground">dense, practical, and efficient</strong>.
        </p>
      </section>

      {/* Premium callout */}
      <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-4 py-4 text-sm leading-[1.8] text-muted-foreground shadow-sm">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
          <div className="space-y-2">
            <p>
              We&apos;ve augmented System Design in a Hurry with{" "}
              <strong className="text-foreground">premium content</strong> to help you go deeper into important topics
              and patterns, like how to handle{" "}
              <span className="font-medium text-teal-400 underline decoration-teal-400/30">Realtime Updates</span> in
              your applications, a deep-dive on{" "}
              <span className="font-medium text-teal-400 underline decoration-teal-400/30">Vector Databases</span>, a
              breakdown of{" "}
              <span className="font-medium text-teal-400 underline decoration-teal-400/30">How to Design Instagram</span>,
              and more. We think it&apos;s a fantastic investment for your interviews but is in no way required for this
              course. You&apos;ll see these references denoted with a{" "}
              <Lock className="mb-0.5 inline h-3.5 w-3.5 text-muted-foreground" /> lock icon.
            </p>
          </div>
        </div>
      </aside>

      <p className="text-lg font-semibold text-foreground">Ready? Let&apos;s go.</p>

      {/* Course map — stacked curriculum (matches reference overall structure) */}
      <section id="overview-structure" className="scroll-mt-12 space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">How this course fits together</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Start from core concepts, layer on technologies and patterns, use the delivery framework in
            interviews, then practice on real problems. The path below is bottom-up: your foundation is
            always core concepts.
          </p>
        </div>
        <CourseOverallStructureDiagram />
      </section>

      {/* What are system design interviews? */}
      <section id="what-is-sd" className="scroll-mt-12 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">What are system design interviews?</h2>
        <p className="leading-[1.8] text-muted-foreground">
          System design interviews are a way to assess your ability to take an ambiguously defined, high-level problem
          and break it down into the pieces of infrastructure that you&apos;ll need to solve it. These are{" "}
          <em>practical</em> interviews, not strictly academic ones, and most engineers find they are closer to
          real-world work than other types of interviews like the leetcode style interview.
        </p>
        <p className="leading-[1.8] text-muted-foreground">
          Importantly, <strong className="text-foreground">design interviews are not about getting to a single right answer</strong>.
          For many questions, there are many right answers. Instead your interviewer is looking to assess your ability to
          navigate a complex problem, reason about trade-offs, and communicate your thinking clearly.
        </p>
        <p className="leading-[1.8] text-muted-foreground">
          Most entry-level software engineering roles will not have a system design interview (though there are plenty of
          exceptions). Once you&apos;ve reached mid-level, system design interviews become more common. At the{" "}
          <strong className="text-foreground">senior level</strong>, system design interviews are the norm and carry a{" "}
          <strong className="text-foreground">disproportionate weight</strong> in the overall evaluation process for the
          candidate.
        </p>
      </section>

      {/* Types */}
      <section id="types" className="scroll-mt-12 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Types of System Design Interviews</h2>
        <p className="leading-[1.8] text-muted-foreground">
          Each company (and sometimes, each interviewer) will conduct a system design interview a little differently.
          You can get a sense for what to expect by browsing some of the{" "}
          <strong className="text-foreground">community-reported questions</strong> we&apos;ve collected. The
          overwhelming majority of system design interviews will be what we&apos;ll call &ldquo;Product Design&rdquo; or
          &ldquo;Infrastructure Design&rdquo; interviews.
        </p>
        <p className="leading-[1.8] text-muted-foreground">
          In these interviews you&apos;ll be asked to design a system behind a product or a system that supports a
          particular infrastructure use case like &ldquo;
          <span className="font-medium text-teal-400 underline decoration-teal-400/30">
            Design a ride-sharing service like Uber
          </span>
          &rdquo; or &ldquo;
          <span className="font-medium text-teal-400 underline decoration-teal-400/30">Design a rate limiter</span>
          &rdquo;. These problems typically require infra: services, load balancers, databases, etc. If this is you,
          this guide is for you.
        </p>

        <SixInterviewTypesDiagram />

        {/* "Not the right spot?" */}
        <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-sm font-semibold text-foreground">Not the right spot?</p>
          <ul className="space-y-2 text-sm leading-[1.8] text-muted-foreground">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              If you are planning for an interview where you&apos;ll instead be asked to design the class structure of a
              system, that&apos;s an interview we call <strong className="text-foreground">&ldquo;Low-Level Design&rdquo;</strong>{" "}
              (sometimes referred to as &ldquo;Object-Oriented Design&rdquo;). We have a different guide for that:{" "}
              <span className="font-medium text-teal-400 underline decoration-teal-400/30">Low-Level Design in a Hurry</span>.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              If your interview includes ML modelling, feature engineering, and other facets of an applied ML
              engineer&apos;s role, we call that{" "}
              <strong className="text-foreground">&ldquo;ML System Design&rdquo;</strong> and have created the{" "}
              <span className="font-medium text-teal-400 underline decoration-teal-400/30">ML System Design in a Hurry</span>{" "}
              guide.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              If you&apos;re interviewing for a frontend engineering role, we highly recommend{" "}
              <span className="font-medium text-teal-400 underline decoration-teal-400/30">Great Frontend</span> for both
              material and practice problems for frontend design interviews.
            </li>
          </ul>
        </div>
      </section>

      {/* Assessment */}
      <section id="assessment" className="scroll-mt-12 space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Assessment</h2>
        <p className="leading-[1.8] text-muted-foreground">
          The interviewers conducting system design interviews are looking to assess certain skills and knowledge through
          the course of the interview, and we&apos;ll walk you through their thought process as we go.
        </p>
        <p className="leading-[1.8] text-muted-foreground">
          At a high level, while all candidates are expected to complete a full design satisfying the requirements, a
          mid-level engineer might cover the basics well but not into great depth, while a{" "}
          <strong className="text-foreground">senior engineer</strong> will quickly work through the basics leaving time
          for them to show off the depth of their knowledge in deep dives.
        </p>
        <p className="leading-[1.8] text-muted-foreground">
          Sounds abstract? In our problem breakdowns, we list out the expectations of a candidate for each level for
          that specific problem so you can get a good idea for how the interview will be assessed.
        </p>

        {/* Staff+ callout */}
        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-3 text-sm leading-[1.8] text-muted-foreground">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              If you&apos;re a <strong className="text-foreground">staff+ engineer</strong>, we have some guidance
              specifically for you in our{" "}
              <span className="font-medium text-teal-400 underline decoration-teal-400/30">Staff-Level System Design</span>{" "}
              blog post. Staff-level interviews are <em>different</em> from lower levels and you&apos;ll need to adjust
              your approach accordingly.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-muted-foreground">
          Each company will have a different rubric for system design, but regardless of level these rubrics have strong
          themes that are common across all interviews:{" "}
          <strong className="text-foreground">Problem Navigation</strong>,{" "}
          <strong className="text-foreground">Solution Design</strong>,{" "}
          <strong className="text-foreground">Technical Excellence</strong>, and{" "}
          <strong className="text-foreground">Communication and Collaboration</strong>. They might use different words,
          but they&apos;re going to touch on the same things.
        </p>

        <InterviewerRubricDiagram />

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 md:p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Signals &amp; failure modes</h3>
          <p className="mt-1 text-xs text-muted-foreground/80">
            The rubric above is how interviewers often talk to each other. Below is what to optimize for in each
            quadrant.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div id="assessment-problem" className="scroll-mt-12 space-y-3 border-t border-white/[0.06] pt-4 sm:border-t-0 sm:pt-0">
              <h4 className="text-base font-semibold text-emerald-200">Problem Navigation</h4>
              <p className="text-sm leading-[1.8] text-muted-foreground">
                Navigate ambiguity: break the problem down, prioritize, and drive to a working slice.
              </p>
              <p className="text-xs font-medium text-muted-foreground/80">Common failure modes</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Insufficiently exploring the problem and gathering requirements
                </li>
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Focusing on trivial aspects vs the most important ones
                </li>
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Getting stuck and not being able to move forward
                </li>
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Failing to deliver a working system
                </li>
              </ul>
            </div>

            <div id="assessment-solution" className="scroll-mt-12 space-y-3 border-t border-white/[0.06] pt-4 sm:border-t-0 sm:pt-0">
              <h4 className="text-base font-semibold text-sky-200">Solution Design</h4>
              <p className="text-sm leading-[1.8] text-muted-foreground">
                Show how pieces fit: APIs, data, and components that satisfy the requirements you agreed on.
              </p>
              <p className="text-xs font-medium text-muted-foreground/80">Common failure modes</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Weak understanding of core concepts
                </li>
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Ignoring scaling and performance considerations
                </li>
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  &ldquo;Spaghetti design&rdquo; &mdash; not well-structured, difficult to understand
                </li>
              </ul>
            </div>

            <div id="assessment-technical" className="scroll-mt-12 space-y-3 border-t border-white/[0.06] pt-4">
              <h4 className="text-base font-semibold text-amber-200">Technical Excellence</h4>
              <p className="text-sm leading-[1.8] text-muted-foreground">
                Apply the right tools and patterns with crisp trade-off reasoning.
              </p>
              <p className="text-xs font-medium text-muted-foreground/80">Common failure modes</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Not knowing about available technologies
                </li>
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Using antiquated approaches or outdated hardware assumptions
                </li>
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Not recognizing common patterns and best practices
                </li>
              </ul>
            </div>

            <div id="assessment-communication" className="scroll-mt-12 space-y-3 border-t border-white/[0.06] pt-4">
              <h4 className="text-base font-semibold text-rose-200">Communication &amp; Collaboration</h4>
              <p className="text-sm leading-[1.8] text-muted-foreground">
                Make your reasoning legible and stay open to pushback &mdash; interviews are collaborative.
              </p>
              <p className="text-xs font-medium text-muted-foreground/80">Common failure modes</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Not being able to communicate complex concepts clearly
                </li>
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Being defensive or argumentative when receiving feedback
                </li>
                <li className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                  Getting lost in the weeds and unable to collaborate with the interviewer
                </li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-3 text-sm leading-[1.8] text-muted-foreground">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              Interviewers are on alert for candidates who have simply memorized answers or material. They&apos;ll test
              you by probing your reasoning, doubting your answers, or asking you to explore tradeoffs. Having{" "}
              <strong className="text-foreground">solid fundamentals</strong> coupled with appropriate depth is critical
              to your success.
            </p>
          </div>
        </aside>
      </section>

      {/* How to Use This Guide */}
      <section id="how-to-use" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">How to Use This Guide</h2>
        <p className="leading-[1.8] text-muted-foreground">
          We recommend that you read this guide in order, skipping any sections you already know. We&apos;ll start with
          our <strong className="text-foreground">How to Prepare</strong> section, which should give you a structure of
          how to organize your preparation.
        </p>
        <p className="leading-[1.8] text-muted-foreground">
          While we link off to additional material where relevant, we&apos;ve tried to make this guide as self-contained
          as possible. Don&apos;t worry if you don&apos;t have time to read the additional material.
        </p>

        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent px-5 py-4 text-sm leading-relaxed text-muted-foreground md:px-6 md:py-5">
          <p>
            The <strong className="text-foreground">course map</strong> near the top of this lesson shows the
            full stack: core concepts at the foundation, key technologies and patterns in the middle, the
            delivery framework as your interview playbook, and practice problems at the top.{" "}
            <a href="#overview-structure" className="font-medium text-teal-400 underline decoration-teal-400/30 hover:text-teal-300">
              Jump back to the diagram
            </a>{" "}
            anytime you need a mental model of how sections relate.
          </p>
        </div>

        <p className="leading-[1.8] text-muted-foreground">
          We firmly believe you need to <strong className="text-foreground">practice</strong> to ensure you&apos;re
          comfortable the day of your actual interview. A common failure mode for candidates is to have consumed a lot of
          material but stumble when it comes time to actually apply it. For this our guide includes worked solutions to
          common problems as well as guided practice which walks you through the steps of an interview with personalized
          feedback.
        </p>
        <p className="leading-[1.8] text-muted-foreground">
          Along the way, we&apos;ve layered in quizzes (to make sure you&apos;re retaining) and real practice problems
          so you can see how to actually translate your knowledge into a working solution.
        </p>

        {/* How much time — expandable */}
        <div id="time-needed" className="scroll-mt-12 overflow-hidden rounded-xl border border-amber-500/40 bg-amber-500/10">
          <button
            type="button"
            onClick={() => setTimeOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-amber-500/10"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="text-base" aria-hidden>?</span>
              How much time do I need to prepare?
            </span>
            <span className="text-xs font-medium text-teal-400">{timeOpen ? "Show less" : "Show more"}</span>
          </button>
          <div className="border-t border-amber-500/30 px-4 py-3 text-sm leading-[1.8] text-muted-foreground">
            <p>
              If system design interviews are entirely new to you, plan to either dedicate yourself wholeheartedly to the
              task or spread it out more reasonably over{" "}
              <strong className="text-foreground">3&ndash;4 weeks</strong>. If you&apos;re already familiar with some core
              concepts, or have more experience at work, we&apos;ve seen candidates successfully prepare in{" "}
              <strong className="text-foreground">under a week</strong>. In either case, you should be able to skim our
              &ldquo;In a Hurry&rdquo; guide quickly to get a sense for what&apos;s ahead.
            </p>
            {timeOpen ? (
              <div className="mt-3 space-y-3 border-t border-amber-500/25 pt-3">
                <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-3 py-3 text-sm text-muted-foreground">
                  <div className="flex gap-3">
                    <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
                    <p>
                      Got an interview sooner? In many companies, the recruiter would rather have a higher chance of you
                      passing the interview than an earlier interview date.{" "}
                      <strong className="text-foreground">Ask them if it would be possible to push out your date.</strong>{" "}
                      Most will happily do this for you!
                    </p>
                  </div>
                </aside>
                <p>
                  If you&apos;re really short on time, we recommend covering the{" "}
                  <strong className="text-foreground">Delivery Framework</strong> section, skimming the{" "}
                  <strong className="text-foreground">Key Technologies</strong>, and spending any remaining time studying
                  the <strong className="text-foreground">Core Concepts</strong> section.
                </p>
              </div>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground/80">Tap &ldquo;Show more&rdquo; for tips if you&apos;re short on time.</p>
            )}
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section id="conclusion" className="scroll-mt-12 space-y-4 border-t border-white/[0.06] pt-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Conclusion</h2>
        <p className="leading-[1.8] text-muted-foreground">
          Ready to dive in? We&apos;re excited to have you here and can&apos;t wait to see you succeed in your
          interview.
        </p>
        <p className="leading-[1.8] text-muted-foreground">
          If you&apos;ve got questions as you make your way, the comments are a great place to ask them. You can also
          highlight text and click &ldquo;Ask Tutor&rdquo; to get a quick answer from our AI tutor, grounded in the
          context of this guide and with relevant references so you can learn more.
        </p>
        <p className="leading-[1.8] text-muted-foreground">
          Lastly, we&apos;re constantly updating our content based on your feedback. If you have suggestions or feedback,
          please leave them in the comments below. And thanks in advance!
        </p>
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-muted-foreground">
          <span className="text-[13px]">Login to track your progress</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" disabled />
            <div className="h-5 w-9 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white/40 after:transition-all peer-checked:bg-teal-500 peer-checked:after:translate-x-full" />
          </label>
        </div>
        <p className="mt-6 text-center text-sm text-teal-400">
          Next: How to Prepare &rarr;
        </p>
      </section>
    </div>
  );
}
