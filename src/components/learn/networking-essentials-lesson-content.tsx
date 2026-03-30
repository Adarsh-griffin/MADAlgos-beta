"use client";

import React from "react";
import { ChevronRight, Info, AlertTriangle, Lightbulb } from "lucide-react";

export function NetworkingEssentialsLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Networking Essentials</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Understand how systems communicate, from protocols to load balancing.
        </p>
      </header>

      <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
        <img 
          src="/images/networking_stack_handdrawn.png" 
          alt="Networking Stack" 
          className="mx-auto max-w-md w-full h-auto drop-shadow-xl"
        />
      </div>

      {/* Intro */}
      <section id="net-intro" className="scroll-mt-12 space-y-4">
        <p className="leading-[1.8] text-gray-400">
          Networking is a fundamental part of system design: you&apos;re nearly always going to be designing systems
          comprised of independent devices that communicate over a network. But the field of networking is vast and
          complex, and it&apos;s easy to get lost.
        </p>
        <p className="leading-[1.8] text-gray-400">
          In this guide we&apos;re going to cover the most important parts of networking that you&apos;ll need to know
          for your system design interviews. For each concept, we&apos;ll cover its purpose, how it works, and when to
          apply it in your system designs.
        </p>
        <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
            <p>
              Networking tends to be a stronger focus in infrastructure and distributed systems interviews. For
              full-stack and product-focused roles, you&apos;ll likely only need a surface understanding of networking
              concepts. Understanding these fundamentals will help you make better decisions in any interview.
            </p>
          </div>
        </aside>
      </section>

      {/* Networking 101 */}
      <section id="networking-101" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Networking 101</h2>
        <h3 className="text-xl font-bold text-white">Networking Layers</h3>
        <p className="leading-[1.8] text-gray-400">
          Networking models like the OSI and TCP/IP models provide a structured way to think about how data moves across
          a network. We focus on a simplified model covering the three layers you&apos;ll most commonly encounter in
          system design:
        </p>
        <ul className="space-y-3 text-gray-400">
          {[
            { label: "Network Layer (Layer 3)", desc: "Responsible for routing data between devices on different networks. Uses IP addresses. The most common protocol is IP (Internet Protocol)." },
            { label: "Transport Layer (Layer 4)", desc: "Ensures data is delivered reliably (or not!) and efficiently. Handles session management, error detection, and flow control. The two most common protocols are TCP and UDP." },
            { label: "Application Layer (Layer 7)", desc: "The final layer containing protocols like DNS, HTTP, WebSockets, WebRTC. These build on top of TCP (or UDP) to provide abstractions for web application data." },
          ].map((item) => (
            <li key={item.label} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span className="leading-[1.8]">
                <strong className="text-white">{item.label}:</strong> {item.desc}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-bold text-white">Example: A Simple Web Request</h3>
        <p className="leading-[1.8] text-gray-400">
          When you type a URL into your browser, several layers of networking protocols spring into action:
        </p>
        <ol className="list-none space-y-3 pl-0">
          {[
            { step: "DNS Resolution", desc: "The client resolves the domain name (e.g., example.com) to an IP address using DNS." },
            { step: "TCP Handshake", desc: "The client initiates a TCP connection with the server via a three-way handshake (SYN → SYN-ACK → ACK)." },
            { step: "HTTP Request", desc: "Once TCP is established, the client sends an HTTP GET request." },
            { step: "Server Processing", desc: "The server retrieves the page and prepares a response." },
            { step: "HTTP Response", desc: "The server sends the response back with the content." },
          ].map((item, i) => (
            <li key={item.step} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-xs font-bold text-teal-400">
                {i + 1}
              </span>
              <span className="leading-[1.8] text-gray-400">
                <strong className="text-white">{item.step}:</strong> {item.desc}
              </span>
            </li>
          ))}
        </ol>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              Thinking about the full round-trip of a request is important for latency calculations. A request involves
              several network round-trips before the server even starts processing the request!
            </p>
          </div>
        </aside>
      </section>

      {/* Transport Layer */}
      <section id="transport-layer" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Transport Layer Protocols</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">UDP — Fast but Unreliable</p>
            <p className="text-xs leading-relaxed text-gray-400">
              A connectionless protocol for speed over reliability. No handshake, no guarantee of delivery, very low
              latency, small header (8 bytes).
            </p>
            <p className="text-xs text-gray-500 font-medium">Use cases:</p>
            <ul className="space-y-1 text-xs text-gray-400">
              {["Video streaming", "VoIP", "Online gaming", "DNS queries", "Logging/Telemetry"].map((u) => (
                <li key={u} className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-teal-500" />
                  {u}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">TCP — Reliable but with Overhead</p>
            <p className="text-xs leading-relaxed text-gray-400">
              A connection-oriented protocol for reliability and ordering. Three-way handshake, retransmits lost packets,
              error detection, flow/congestion control.
            </p>
            <p className="text-xs text-gray-500 font-medium">Use cases:</p>
            <ul className="space-y-1 text-xs text-gray-400">
              {["Web browsing (HTTP)", "File transfers (FTP)", "Email (SMTP)", "Databases"].map((u) => (
                <li key={u} className="flex gap-1.5">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-teal-500" />
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-xl border border-white/[0.08]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                {["Feature", "UDP", "TCP"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {[
                ["Connection", "Connectionless", "Connection-oriented"],
                ["Reliability", "Unreliable", "Reliable"],
                ["Order", "No guaranteed order", "Guaranteed order"],
                ["Speed", "Fast", "Slower (overhead)"],
                ["Header Size", "8 bytes", "20–60 bytes"],
              ].map(([feat, udp, tcp]) => (
                <tr key={feat} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-semibold text-white">{feat}</td>
                  <td className="px-4 py-3 text-gray-400">{udp}</td>
                  <td className="px-4 py-3 text-gray-400">{tcp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Application Layer */}
      <section id="application-layer" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Application Layer Protocols</h2>

        <h3 className="text-xl font-bold text-white">HTTP/HTTPS: The Web&apos;s Foundation</h3>
        <p className="leading-[1.8] text-gray-400">The standard for web communication.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">REST</p>
            <p className="text-xs leading-relaxed text-gray-400">
              Architectural style built on HTTP. Stateless, resource-based (URIs), uniform interface.{" "}
              <strong className="text-teal-400">Default for most interviews.</strong>
            </p>
          </div>
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">GraphQL</p>
            <p className="text-xs leading-relaxed text-gray-400">
              Query language for APIs. No over/under-fetching, single request for complex data. Use with diverse
              clients with different data needs.
            </p>
          </div>
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">gRPC</p>
            <p className="text-xs leading-relaxed text-gray-400">
              High-performance RPC using Protocol Buffers and HTTP/2. Binary payloads, bidirectional streaming. Use
              for internal microservices.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white">Real-Time Push Communication</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { title: "SSE (Server-Sent Events)", desc: "One-way push (Server → Client). Best for dashboards, notifications, live feeds.", color: "emerald" },
            { title: "WebSockets", desc: "Full-duplex bidirectional communication. Best for chat, gaming, live trading.", color: "sky" },
            { title: "WebRTC", desc: "Peer-to-peer (P2P) communication. Best for video/audio conferencing. Niche and complex.", color: "amber" },
          ].map((item) => (
            <div key={item.title} className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">{item.title}</p>
              <p className="text-xs leading-relaxed text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <aside className="rounded-lg border-l-4 border-amber-500 bg-amber-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
            <p>
              A common mistake is proposing WebSockets when HTTP with long polling or Server-Sent Events would work
              fine. WebSockets add significant complexity for maintaining stateful connections at scale. Only reach for
              them when you genuinely need bidirectional real-time communication.
            </p>
          </div>
        </aside>
      </section>

      {/* Load Balancing */}
      <section id="load-balancing" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Load Balancing</h2>
        <p className="leading-[1.8] text-gray-400">
          Load balancing distributes traffic across servers to ensure availability and performance. It&apos;s the key
          mechanism for <strong className="text-white">horizontal scaling</strong> — adding more servers rather than
          making one server more powerful.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">Layer 4 (L4) Load Balancer</p>
            <p className="text-xs leading-relaxed text-gray-400">
              Operates at the TCP/UDP level. Routes based on IP and port only. Extremely fast but lacks content
              awareness. Use for WebSocket connections (persistent TCP).
            </p>
          </div>
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-sm font-bold text-white">Layer 7 (L7) Load Balancer</p>
            <p className="text-xs leading-relaxed text-gray-400">
              Operates at the application level. Routes based on URL, headers, cookies. More sophisticated routing but
              slightly more overhead. Default choice for HTTP APIs.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white">Common Algorithms</h3>
        <ul className="space-y-2 text-gray-400">
          {[
            { alg: "Round-Robin", desc: "Distributes requests evenly across all servers in rotation." },
            { alg: "Least Connections", desc: "Routes to the server with the fewest active connections — good for variable request times." },
            { alg: "IP Hash (Sticky Sessions)", desc: "Routes the same client always to the same server — needed for stateful connections." },
          ].map((item) => (
            <li key={item.alg} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span className="leading-[1.8]">
                <strong className="text-white">{item.alg}:</strong> {item.desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Fault Tolerance */}
      <section id="fault-tolerance" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Handling Failures</h2>

        <ul className="space-y-3 text-gray-400">
          {[
            { item: "Health Checks", desc: "Load balancers periodically ping servers and stop routing to unhealthy ones." },
            { item: "Timeouts & Retries with Exponential Backoff", desc: "Prevent cascading failures by waiting progressively longer between retries." },
            { item: "Idempotency", desc: "Design operations so safe retries don't cause duplicate side effects." },
            { item: "Circuit Breakers", desc: "Stop routing to a service that is failing repeatedly to prevent cascading failures through the system." },
          ].map((item) => (
            <li key={item.item} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span className="leading-[1.8]">
                <strong className="text-white">{item.item}:</strong> {item.desc}
              </span>
            </li>
          ))}
        </ul>

        <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
            <p>
              A request from New York to London has a minimum latency of around 80ms just from the speed of light
              through fiber optic cables. If your system needs low latency globally, you&apos;ll need regional
              deployments with data replicated or partitioned by geography. This is why CDNs exist.
            </p>
          </div>
        </aside>
      </section>

      {/* Progress toggle */}
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
            onClick={() => onNavigate("core-concepts-intro")}
          >
            ← Previous: Core Concepts
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20"
            onClick={() => onNavigate("api-design")}
          >
            Next: API Design
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
