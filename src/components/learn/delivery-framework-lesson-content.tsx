"use client";

import React from "react";
import { ChevronRight, Lightbulb, AlertTriangle, Info } from "lucide-react";
import {
  DeliveryFrameworkRoadmapDiagram,
  InterviewStructureFlowDiagram,
  TwitterApiCodeBlock,
} from "@/components/learn/delivery-framework-diagrams";

export function DeliveryFrameworkLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-10">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-500">
          <span className="h-px w-8 bg-orange-500/30" />
          System Design in a Hurry
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Delivery Framework</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          The best way to structure your system design interviews to focus on what actually matters, built by FAANG managers and staff engineers.
        </p>
      </header>

      {/* Intro */}
      <section id="intro" className="scroll-mt-12 space-y-6">
        <p className="text-lg leading-relaxed text-muted-foreground/90">
          The easiest way to sabotage your chances of getting an offer in your system design interview is to
          fail to deliver a working system. This is the most common reason that mid-level candidates fail these
          interviews and it often manifests as the opaque &ldquo;time management&rdquo;.
        </p>
      </section>

      {/* ─── Overall Structure ─── */}
      <section id="overall-structure" className="scroll-mt-12 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Overall Structure</h2>

        <p className="leading-relaxed text-muted-foreground">
          Our delivery framework is a sequence of steps and timings we recommend for your interview. By
          structuring your interview in this way, you&apos;ll stay focused on the bits that are most important
          to your interviewer.
        </p>

        <aside className="rounded-2xl border border-teal-500/20 bg-teal-500/[0.02] p-6">
          <div className="flex gap-4">
            <Lightbulb className="h-6 w-6 shrink-0 text-teal-400" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              While a firm structure to your approach is important, its main value is keeping you from getting stuck 
              and ensuring you deliver a working system &mdash; something many candidates fail to do under pressure.
            </p>
          </div>
        </aside>

        <div id="df-course-map" className="scroll-mt-12 rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
          <img 
            src="/images/delivery_framework_handdrawn.png" 
            alt="Delivery Framework Roadmap" 
            className="mx-auto max-w-2xl w-full h-auto drop-shadow-2xl"
          />
        </div>

        <div id="interview-structure" className="scroll-mt-12">
          <InterviewStructureFlowDiagram />
        </div>
      </section>

      {/* ─── Requirements ─── */}
      <section id="requirements" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Requirements (~5 minutes)</h2>

        <p className="leading-[1.8] text-gray-400">
          The goal of the requirements section is to get a clear understanding of the system that you are being
          asked to design. To do this, we suggest you break your requirements into two sections.
        </p>

        {/* Functional Requirements */}
        <h3 id="functional-reqs" className="scroll-mt-12 text-xl font-bold text-white">
          1) Functional Requirements
        </h3>

        <p className="leading-[1.8] text-gray-400">
          Functional requirements are your &ldquo;Users/Clients should be able to...&rdquo; statements. These
          are the core features of your system and should be the first thing you discuss with your interviewer.
          Oftentimes this is a back and forth with your interviewer. Ask targeted questions as if you were
          talking to a client, customer, or product manager (&ldquo;does the system need to do X?&rdquo;,
          &ldquo;what would happen if Y?&rdquo;) to arrive at a prioritized list of core features.
        </p>

        <p className="leading-[1.8] text-gray-400">
          For example, if you were designing a system like Twitter, you might have the following functional
          requirements:
        </p>

        <ul className="space-y-2 text-gray-400">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Users should be able to post tweets</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Users should be able to follow other users</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Users should be able to see tweets from users they follow</span>
          </li>
        </ul>

        <p className="leading-[1.8] text-gray-400">A cache meanwhile might have requirements like:</p>

        <ul className="space-y-2 text-gray-400">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Clients should be able to insert items</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Clients should be able to set expirations</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Clients should be able to read items</span>
          </li>
        </ul>

        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              <strong className="text-white">Keep your requirements targeted!</strong> The main objective in
              the remaining part of the interview is to develop a system that meets the requirements
              you&apos;ve identified &mdash; so it&apos;s crucial to be strategic in your prioritization. Many
              of these systems have hundreds of features, but it&apos;s your job to identify and prioritize the
              top 3. Having a long list of requirements will hurt you more than it will help you and many top
              FAANGs directly evaluate you on your ability to focus on what matters.
            </p>
          </div>
        </aside>

        {/* Non-functional Requirements */}
        <h3 id="non-functional-reqs" className="scroll-mt-12 text-xl font-bold text-white">
          2) Non-functional Requirements
        </h3>

        <p className="leading-[1.8] text-gray-400">
          Non-functional requirements are statements about the system qualities that are important to your
          users. These can be phrased as &ldquo;The system should be able to...&rdquo; or &ldquo;The system
          should be...&rdquo; statements.
        </p>

        <p className="leading-[1.8] text-gray-400">
          For example, if you were designing a system like Twitter, you might have the following non-functional
          requirements:
        </p>

        <ul className="space-y-2 text-gray-400">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">
              The system should be highly available, prioritizing availability over consistency
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">
              The system should be able to scale to support 100M+ DAU (Daily Active Users)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">
              The system should be low latency, rendering feeds in under 200ms
            </span>
          </li>
        </ul>

        <p className="leading-[1.8] text-gray-400">
          It&apos;s important that non-functional requirements are put in the context of the system and, where
          possible, are quantified. For example, &ldquo;the system should be low latency&rdquo; is obvious and
          not very meaningful &mdash; nearly all systems should be low latency. &ldquo;The system should have
          low latency search, &lt;&nbsp;500ms,&rdquo; is much more useful as it identifies the part of the
          system that most needs to be low latency and provides a target.
        </p>

        <p className="leading-[1.8] text-gray-400">
          Coming up with non-functional requirements can be challenging, especially if you&apos;re not familiar
          with the domain. Here is a checklist of things to consider that might help you identify the most
          important non-functional requirements for your system. You&apos;ll want to identify the top 3&ndash;5
          that are most relevant to your system.
        </p>

        {/* NFR Checklist */}
        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-white/[0.06]">
              {([
                ["CAP Theorem", "Should your system prioritize consistency or availability? Note, partition tolerance is a given in distributed systems."],
                ["Environment Constraints", "Are there any constraints on the environment in which your system will run? For example, are you running on a mobile device with limited battery life? Running on devices with limited memory or limited bandwidth (e.g. streaming video on 3G)?"],
                ["Scalability", "All systems need to scale, but does this system have unique scaling requirements? For example, does it have bursty traffic at a specific time of day? Are there events, like holidays, that will cause a significant increase in traffic? Also consider the read vs write ratio here."],
                ["Latency", "How quickly does the system need to respond to user requests? Specifically consider any requests that require meaningful computation. For example, low latency search when designing Yelp."],
                ["Durability", "How important is it that the data in your system is not lost? For example, a social network might be able to tolerate some data loss, but a banking system cannot."],
                ["Security", "How secure does the system need to be? Consider data protection, access control, and compliance with regulations."],
                ["Fault Tolerance", "How well does the system need to handle failures? Consider redundancy, failover, and recovery mechanisms."],
                ["Compliance", "Are there legal or regulatory requirements the system needs to meet? Consider industry standards, data protection laws, and other regulations."],
              ] as const).map(([title, desc]) => (
                <tr key={title} className="transition-colors hover:bg-white/[0.03]">
                  <td className="whitespace-nowrap px-4 py-3 align-top font-semibold text-white">{title}</td>
                  <td className="px-4 py-3 leading-[1.7] text-gray-400">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Capacity Estimation */}
        <h3 id="capacity-estimation" className="scroll-mt-12 text-xl font-bold text-white">
          3) Capacity Estimation
        </h3>

        <p className="leading-[1.8] text-gray-400">
          Many guides you&apos;ve read will suggest doing back-of-the-envelope calculations at this stage. We
          believe this is often unnecessary. Instead, perform calculations only if they will directly influence
          your design. In most scenarios, you&apos;re dealing with a large, distributed system &mdash; and
          it&apos;s reasonable to assume as much. Many candidates will calculate storage, DAU, and QPS, only to
          conclude, &ldquo;ok, so it&apos;s a lot. Got it.&rdquo; As interviewers, we gain nothing from this
          except that you can perform basic arithmetic.
        </p>

        <p className="leading-[1.8] text-gray-400">
          Our suggestion is to explain to the interviewer that you would like to skip on estimations upfront and
          that you will do math while designing when/if necessary. When would it be necessary? Imagine you are
          designing a TopK system for trending topics in FB posts. You would want to estimate the number of
          topics you would expect to see, as this will influence whether you can use a single instance of a data
          structure like a min-heap or if you need to shard it across multiple instances, which will have a big
          impact on your design.
        </p>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              Regardless of how you end up using it in the interview, learning to estimate relevant quantities
              quickly will help you quickly reason through design trade-offs in your design. Don&apos;t worry if
              you&apos;re not good at mental arithmetic under pressure, most people aren&apos;t.
            </p>
          </div>
        </aside>
      </section>

      {/* ─── Core Entities ─── */}
      <section id="core-entities" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Core Entities (~2 minutes)</h2>

        <p className="leading-[1.8] text-gray-400">
          Next you should take a moment to identify and list the core entities of your system. This helps you to
          define terms, understand the data central to your design, and gives you a foundation to build on.
          These are the core entities that your API will exchange and that your system will persist in a Data
          Model. In the actual interview, this is as simple as jotting down a bulleted list and explaining this
          is your first draft to the interviewer.
        </p>

        <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
            <p>
              Why not list the entire data model at this point? Because you don&apos;t know what you don&apos;t
              know. As you design your system, you&apos;ll discover new entities and relationships that you
              didn&apos;t anticipate. By starting with a small list, you can quickly iterate and add to it as
              you go. Once you get into the high level design and have a clearer sense of exactly what state
              needs to update upon each request you can start to build out the list of relevant columns/fields
              for each entity.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-gray-400">
          For our Twitter example, our core entities are rather simple:
        </p>

        <ul className="space-y-2 text-gray-400">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8] font-medium text-white">User</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8] font-medium text-white">Tweet</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8] font-medium text-white">Follow</span>
          </li>
        </ul>

        <p className="leading-[1.8] text-gray-400">
          A couple useful questions to ask yourself to help identify core entities:
        </p>

        <ul className="space-y-2 text-gray-400">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Who are the actors in the system? Are they overlapping?</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">
              What are the nouns or resources necessary to satisfy the functional requirements?
            </span>
          </li>
        </ul>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              Aim to choose good names for your entities. While most problems are small enough that you could
              probably sub in <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">foo</code> and{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">bar</code> for any entity in
              your system, some interviewers use this as an opportunity to see whether you&apos;re any good at one
              of the hardest problems in computer science.
            </p>
          </div>
        </aside>
      </section>

      {/* ─── API or System Interface ─── */}
      <section id="api-interface" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">API or System Interface (~5 minutes)</h2>

        <p className="leading-[1.8] text-gray-400">
          Before you get into the high-level design, you&apos;ll want to define the contract between your
          system and its users. Oftentimes, especially for full product style interviews, this maps directly to
          the functional requirements you&apos;ve already identified (but not always!). You will use this
          contract to guide your high-level design and to ensure that you&apos;re meeting the requirements
          you&apos;ve identified.
        </p>

        <p className="leading-[1.8] text-gray-400">
          You have a quick decision to make here &mdash; which API protocol should you use?
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">REST</p>
            <p className="text-xs leading-relaxed text-gray-400">
              Uses HTTP verbs (GET, POST, PUT, DELETE) to perform CRUD operations on resources.{" "}
              <strong className="text-teal-400">This should be your default choice for most interviews.</strong>
            </p>
          </div>
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">GraphQL</p>
            <p className="text-xs leading-relaxed text-gray-400">
              Allows clients to specify exactly what data they want, avoiding over-fetching and under-fetching.
              Choose when you have diverse clients with different data needs.
            </p>
          </div>
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">RPC</p>
            <p className="text-xs leading-relaxed text-gray-400">
              Action-oriented protocol (like gRPC) that&apos;s faster than REST for service-to-service
              communication. Use for internal APIs when performance is critical.
            </p>
          </div>
        </div>

        <p className="leading-[1.8] text-gray-400">
          Don&apos;t overthink this. Default to REST unless you have a specific reason not to. For real-time
          features, you&apos;ll also need WebSockets or Server-Sent Events, but design your core API first.
        </p>

        <p className="leading-[1.8] text-gray-400">
          For Twitter, we would choose REST and design our endpoints using our core entities as resources.
          Resources should be plural nouns that represent things in your system:
        </p>

        <TwitterApiCodeBlock />

        <p className="leading-[1.8] text-gray-400">
          Notice how we use plural resource names (<code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">tweets</code>,
          not <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">tweet</code>). The current
          user is derived from the authentication token in the request header, not from request bodies or path
          parameters.
        </p>

        <aside className="rounded-lg border-l-4 border-rose-500 bg-rose-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden />
            <p>
              Never rely on sensitive information like user IDs from request bodies when they should come from
              authentication. Always authenticate requests and derive the current user from the auth token, not
              from user input.
            </p>
          </div>
        </aside>
      </section>

      {/* ─── [Optional] Data Flow ─── */}
      <section id="data-flow" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-sm font-medium text-gray-400">Optional</span>
          Data Flow (~5 minutes)
        </h2>

        <p className="leading-[1.8] text-gray-400">
          For some backend systems, especially data-processing systems, it can be helpful to describe the high
          level sequence of actions or processes that the system performs on the inputs to produce the desired
          outputs. If your system doesn&apos;t involve a long sequence of actions, skip this!
        </p>

        <p className="leading-[1.8] text-gray-400">
          We usually define the data flow via a simple list. You&apos;ll use this flow to inform your
          high-level design in the next section.
        </p>

        <p className="leading-[1.8] text-gray-400">For a web crawler, this might look like:</p>

        <ol className="list-none space-y-3 pl-0">
          {["Fetch seed URLs", "Parse HTML", "Extract URLs", "Store data", "Repeat"].map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-400">
                {i + 1}
              </span>
              <span className="text-gray-400">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── High Level Design ─── */}
      <section id="high-level-design" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">High Level Design (~10&ndash;15 minutes)</h2>

        <p className="leading-[1.8] text-gray-400">
          Now that you have a clear understanding of the requirements, entities, and API of your system, you can
          start to design the high-level architecture. This consists of drawing boxes and arrows to represent the
          different components of your system and how they interact. Components are basic building blocks like
          servers, databases, caches, etc. This can be done either in person on a whiteboard or virtually using
          whiteboarding software like{" "}
          <a
            href="https://excalidraw.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-400 underline decoration-teal-400/30 hover:text-teal-300"
          >
            Excalidraw
          </a>
          . The Key Technologies section will give you a good sense of the most common components you&apos;ll
          need to know.
        </p>

        <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
            <p>
              Ask your recruiter what software you&apos;ll be using for your interview and practice with it
              ahead of time. You don&apos;t want to be fumbling with the software during your interview.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-gray-400">
          <strong className="text-white">Don&apos;t over think this!</strong> Your primary goal is to design an
          architecture that satisfies the API you&apos;ve designed and, thus, the requirements you&apos;ve
          identified. In most cases, you can even go one-by-one through your API endpoints and build up your
          design sequentially to satisfy each one.
        </p>

        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              <strong className="text-white">Stay focused!</strong> It&apos;s incredibly common for candidates
              to start layering on complexity too early, resulting in them never arriving at a complete solution.
              Focus on a relatively simple design that meets the core functional requirements, and then layer on
              complexity to satisfy the non-functional requirements in your deep dives section. It&apos;s natural
              to identify areas where you can add complexity, like caches or message queues, while in the
              high-level design. We encourage you to note these areas with a simple verbal callout and written
              note, and then move on.
            </p>
          </div>
        </aside>

        <p className="leading-[1.8] text-gray-400">
          As you&apos;re drawing your design, you should be talking through your thought process with your
          interviewer. Be explicit about how data flows through the system and what state (either in databases,
          caches, message queues, etc.) changes with each request, starting from API requests and ending with the
          response. When your request reaches your database or persistence layer, it&apos;s a great time to
          start documenting the relevant columns/fields for each entity. You can do this directly next to your
          database visually. This helps keep it close to the relevant components and makes it easy to evolve as
          you iterate on your design. No need to worry too much about types here, your interviewer can infer and
          they&apos;ll only slow you down.
        </p>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              Don&apos;t waste your time documenting every column/field in your schema. For example, your
              interviewer knows that a User table has a name, email, and password hash so you don&apos;t need to
              write these down. Instead, focus on the columns/fields that are particularly relevant to your
              design.
            </p>
          </div>
        </aside>
      </section>

      {/* ─── Deep Dives ─── */}
      <section id="deep-dives" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Deep Dives (~10 minutes)</h2>

        <p className="leading-[1.8] text-gray-400">
          Astute readers probably noticed that our simple, high-level design of Twitter is going to be woefully
          inefficient when it comes to fetching users&apos; feeds. No problem! That&apos;s exactly the sort of
          thing you&apos;ll iterate on in the deep dives section. Now that you have a high-level design in place
          you&apos;re going to use the remaining 10 or so minutes of the interview to harden your design by:
        </p>

        <ul className="space-y-2 text-gray-400">
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Ensuring it meets all of your non-functional requirements</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Addressing edge cases</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Identifying and addressing issues and bottlenecks</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
            <span className="leading-[1.8]">Improving the design based on probes from your interviewer</span>
          </li>
        </ul>

        <p className="leading-[1.8] text-gray-400">
          The degree to which you&apos;re proactive in leading deep dives is a function of your seniority. More
          junior candidates can expect the interviewer to jump in here and point out places where the design
          could be improved. More senior candidates should be able to identify these places themselves and lead
          the discussion.
        </p>

        <p className="leading-[1.8] text-gray-400">
          So for example, one of our non-functional requirements for Twitter was that our system needs to scale
          to &gt;100M DAU. We could then lead a discussion oriented around horizontal scaling, the introduction
          of caches, and database sharding &mdash; updating our design as we go. Another was that feeds need to
          be fetched with low latency. In the case of Twitter, this is actually the most interesting problem.
          We&apos;d lead a discussion about fanout-on-read vs fanout-on-write and the use of caches.
        </p>

        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              A common mistake candidates make is that they try to talk over their interviewer here. There is a
              lot to talk about, sure, and for senior candidates being proactive is important, however, it&apos;s
              a balance. Make sure you give your interviewer room to ask questions and probe your design. Chances
              are they have specific signals they want to get from you and you&apos;re going to miss it if
              you&apos;re too busy talking. Plus, you&apos;ll hurt your evaluation on communication and
              collaboration.
            </p>
          </div>
        </aside>
      </section>

      {/* Login progress toggle */}
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-400">
        <span className="text-[13px]">Login to track your progress</span>
        <label className="relative inline-flex cursor-pointer items-center">
          <input type="checkbox" className="peer sr-only" disabled />
          <div className="h-5 w-9 rounded-full bg-white/10 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white/40 after:transition-all peer-checked:bg-teal-500 peer-checked:after:translate-x-full" />
        </label>
      </div>

      {/* Navigation */}
      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline"
            onClick={() => onNavigate("how-to-prepare")}
          >
            &larr; Previous: How to Prepare
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20"
            onClick={() => onNavigate("core-concepts-intro")}
          >
            Next: Core Concepts
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
