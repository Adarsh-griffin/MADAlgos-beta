"use client";

import React from "react";
import { ChevronRight, Info, Lightbulb, AlertTriangle } from "lucide-react";
import { LoginProgressToggle } from "@/components/learn/LoginProgressToggle";

export function APIDesignLessonContent({
  onNavigate,
}: {
  onNavigate: (lessonId: string) => void;
}) {
  return (
    <div className="not-prose space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">API Design</h1>
        <p className="max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Design clean, scalable interfaces for your distributed systems.
        </p>
      </header>

      <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-8">
        <img 
          src="/images/api_types_handdrawn.png" 
          alt="API Protocols & Types" 
          className="mx-auto max-w-2xl w-full h-auto drop-shadow-xl"
        />
      </div>

      {/* API Types */}
      <section id="api-types" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">API Types</h2>
        <p className="leading-[1.8] text-gray-400">
          There are three primary API types you should know for your system design interview:
        </p>

        {/* REST */}
        <div className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-xl font-bold text-white">1. REST (Representational State Transfer)</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            REST uses standard HTTP methods (GET, POST, PUT, DELETE) to manipulate resources identified by URLs. For
            standard CRUD operations in web and mobile applications, REST maps naturally to database operations and HTTP
            semantics. This should be your <strong className="text-white">default choice</strong>.
          </p>
          <h4 className="text-base font-semibold text-white">Resource Modeling</h4>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-gray-300">
{`GET  /events              # Get all events
GET  /events/{id}         # Get a specific event
GET  /venues/{id}         # Get a specific venue
GET  /events/{id}/tickets # Get available tickets
POST /events/{id}/bookings # Create a new booking
GET  /bookings/{id}       # Get a specific booking`}
          </pre>
          <h4 className="text-base font-semibold text-white">Passing Data to APIs</h4>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-gray-300">
{`POST /events/123/bookings?notify=true
{
  "tickets": [
    {"section": "VIP", "quantity": 2},
    {"section": "General", "quantity": 1}
  ],
  "payment_method": "credit_card"
}`}
          </pre>
          <h4 className="text-base font-semibold text-white">Returning Data</h4>
          <ul className="space-y-1 text-sm text-gray-400">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span>The <strong className="text-white">status code</strong> — indicates success or failure (200, 201, 400, 404, 500, etc.)</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span>The <strong className="text-white">response body</strong> — typically JSON containing the returned data.</span>
            </li>
          </ul>
        </div>

        {/* GraphQL */}
        <div className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-xl font-bold text-white">2. GraphQL</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            Unlike REST&apos;s fixed endpoints, GraphQL uses a single endpoint with a query language that lets clients
            specify exactly what data they need. Think about a mobile app that needs only basic user information versus
            a web dashboard that displays comprehensive analytics — with REST you&apos;d need multiple endpoints or force
            clients to fetch more than they need. GraphQL lets each client request exactly what it needs in a single
            query.
          </p>
          <aside className="rounded-lg border-l-4 border-sky-500 bg-sky-500/10 px-3 py-3 text-sm text-gray-400">
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" aria-hidden />
              <p>If your interviewer mentions &ldquo;flexible data fetching&rdquo; or &ldquo;avoiding over-fetching and under-fetching&rdquo;, they&apos;re signaling you to consider GraphQL.</p>
            </div>
          </aside>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-gray-300">
{`query {
  event(id: "123") {
    name
    date
    venue { name address }
    tickets { section price available }
  }
}`}
          </pre>
          <h4 className="text-base font-semibold text-white">GraphQL Schema Design</h4>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-gray-300">
{`type Event {
  id: ID!
  name: String!
  date: DateTime!
  venue: Venue!
  tickets: [Ticket!]!
}

type Query {
  event(id: ID!): Event
  events(limit: Int, after: String): [Event!]!
}`}
          </pre>
        </div>

        {/* RPC */}
        <div className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h3 className="text-xl font-bold text-white">3. RPC (Remote Procedure Call)</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            RPC protocols like gRPC use binary serialization and HTTP/2 for efficient communication between services.
            While REST treats everything as resources, RPC lets you think in terms of actions and procedures. When your
            user service needs to validate permissions with your auth service, an RPC call like{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-white">checkPermission(userId, resource)</code> is more natural
            than modeling this as a REST resource.
          </p>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-gray-300">
{`// Instead of GET /events/123
getEvent(eventId: "123")

// Instead of POST /events/123/bookings
createBooking(eventId: "123", userId: "456", tickets: [...])

// Instead of GET /events/123/tickets
getAvailableTickets(eventId: "123", section: "VIP")`}
          </pre>
          <h4 className="text-base font-semibold text-white">Protocol Buffers & Type Safety</h4>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-gray-300">
{`service TicketService {
  rpc GetEvent(GetEventRequest) returns (Event);
  rpc CreateBooking(CreateBookingRequest) returns (Booking);
  rpc GetAvailableTickets(GetTicketsRequest) returns (TicketList);
}

message GetEventRequest { string event_id = 1; }
message Event {
  string id = 1;
  string name = 2;
  int64 date = 3;
  Venue venue = 4;
}`}
          </pre>
          <h4 className="text-base font-semibold text-white">When to Use RPC in Interviews</h4>
          <ul className="space-y-1 text-sm text-gray-400">
            {[
              ["Performance is critical", "Binary serialization and HTTP/2 make RPC significantly faster than JSON REST"],
              ["Type safety matters", "Generated client code prevents many runtime errors"],
              ["Service-to-service calls", "Internal APIs between your own services don't need REST's resource semantics"],
              ["Streaming is needed", "gRPC supports bidirectional streaming for real-time features"],
            ].map(([when, why]) => (
              <li key={when} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <span><strong className="text-white">{when}:</strong> {why}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-lg border-l-4 border-teal-500 bg-teal-500/10 px-4 py-4 text-sm leading-[1.8] text-gray-400">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" aria-hidden />
            <p>
              <strong className="text-white">Interview rule of thumb:</strong> Default to REST. Use GraphQL if there are
              diverse clients with different data needs. Use gRPC for internal microservice-to-microservice communication
              where performance matters.
            </p>
          </div>
        </aside>
      </section>

      {/* Common API Patterns */}
      <section id="api-patterns" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Common API Patterns</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Pagination</h3>
          <p className="text-sm leading-[1.8] text-gray-400">
            When returning large collections, always paginate. There are two main approaches:
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">Offset-Based Pagination</p>
              <p className="text-xs leading-relaxed text-gray-400">
                Uses <code className="rounded bg-white/10 px-1">?limit=20&offset=40</code> parameters.
                Simple but has performance issues at high offsets — the DB must scan all previous rows.
              </p>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">Cursor-Based Pagination</p>
              <p className="text-xs leading-relaxed text-gray-400">
                Returns a <code className="rounded bg-white/10 px-1">next_cursor</code> token in the response. The client
                sends this cursor on the next request. More efficient and handles real-time data well.
              </p>
              <pre className="overflow-x-auto rounded bg-slate-900 p-2 text-[11px] text-gray-300">
{`{
  "events": [...],
  "next_cursor": "cmd9atj3p0..."
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="api-security" className="scroll-mt-12 space-y-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Security Considerations</h2>

        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">Authentication & Authorization</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">API Keys</p>
              <p className="text-xs leading-relaxed text-gray-400">Simple long-lived tokens. Good for server-to-server and developer access. Cannot carry user identity.</p>
              <pre className="overflow-x-auto rounded bg-slate-900 p-2 text-[11px] text-gray-300">{`GET /events\nAuthorization: Bearer sk_live_abc123...`}</pre>
            </div>
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-bold text-white">JWT (JSON Web Tokens)</p>
              <p className="text-xs leading-relaxed text-gray-400">Short-lived, signed tokens that carry user claims. Stateless — server validates signature without a DB lookup.</p>
              <pre className="overflow-x-auto rounded bg-slate-900 p-2 text-[11px] text-gray-300">{`// JWT payload\n{\n  "user_id": "123",\n  "role": "customer",\n  "exp": 1640995200\n}`}</pre>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white">Role-Based Access Control (RBAC)</h3>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-gray-300">
{`Roles:
- customer:      can book tickets, view own bookings
- venue_manager: can create events, view sales for their venues
- admin:         can access everything

GET /bookings/{id}
  1. Is the user authenticated? (valid JWT token)
  2. Is the user authorized? (owns this booking OR is admin)`}
          </pre>

          <h3 className="text-lg font-bold text-white">Rate Limiting & Throttling</h3>
          <ul className="space-y-1 text-sm text-gray-400">
            {[
              "Per-user limits: 1,000 requests per hour per authenticated user",
              "Per-IP limits: 100 requests per hour for unauthenticated requests",
              "Endpoint-specific limits: 10 booking attempts per minute to prevent ticket scalping",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LoginProgressToggle />

      <section className="space-y-4 border-t border-white/[0.06] pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="inline-flex items-center gap-2 text-left text-sm font-medium text-teal-400 hover:underline" onClick={() => onNavigate("networking-essentials")}>
            ← Previous: Networking Essentials
          </button>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-5 py-2.5 text-sm font-semibold text-teal-400 transition hover:bg-teal-500/20" onClick={() => onNavigate("data-modeling")}>
            Next: Data Modeling
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
