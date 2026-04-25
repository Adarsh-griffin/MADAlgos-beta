"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Video,
  GraduationCap,
  Calendar,
  Hash,
  CreditCard,
  Sparkles,
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  UserCircle2,
} from "lucide-react";

export type MockOrderRow = {
  id: string;
  mockLabel: string;
  buyerExperienceBracket: string | null;
  mockType: string;
  slotLabel: string;
  mockDate: string;
  status: string;
  quantity: number;
  country: string;
  paymentId: string;
  orderId: string;
  bookedAt: string;
};

export type MentorshipOrderRow = {
  id: string;
  packageLabel: string;
  status: string;
  country: string;
  paymentId: string;
  orderId: string;
  bookedAt: string;
  expiryDate: string;
};

export default function StudentPortalClient({
  displayName,
  email,
  mockOrders,
  mentorshipOrders,
}: {
  displayName: string;
  email: string;
  mockOrders: MockOrderRow[];
  mentorshipOrders: MentorshipOrderRow[];
}) {
  const hasOrders = mockOrders.length > 0 || mentorshipOrders.length > 0;
  const totalOrders = mockOrders.length + mentorshipOrders.length;

  const services = [
    {
      title: "Attempt free practice tests",
      description: "MCQ + coding assessments with real interview-style pressure.",
      href: "/available-tests",
      cta: "Start free test",
      icon: <BookOpenCheck className="h-5 w-5" />,
      glow: "from-cyan-400/35 to-sky-500/20",
    },
    {
      title: "Book mock interview",
      description: "Get one-on-one mock rounds and actionable performance feedback.",
      href: "/book-mock",
      cta: "Book mock",
      icon: <Video className="h-5 w-5" />,
      glow: "from-violet-400/35 to-purple-500/20",
    },
    {
      title: "Book mentorship",
      description: "Structured mentorship packages tailored to your target role.",
      href: "/book-mentorship",
      cta: "Get mentorship",
      icon: <GraduationCap className="h-5 w-5" />,
      glow: "from-emerald-400/35 to-teal-500/20",
    },
    {
      title: "Explore mentor network",
      description: "Browse verified mentors from top product and engineering teams.",
      href: "/mentors",
      cta: "Browse mentors",
      icon: <BriefcaseBusiness className="h-5 w-5" />,
      glow: "from-amber-400/35 to-orange-500/20",
    },
  ];

  return (
    <main className="py-10 md:py-12">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/70 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.7)] md:p-8">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Student profile
              </p>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">Welcome back, {displayName}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage your orders, track your learning services, and continue building your interview readiness.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-300">
                <UserCircle2 className="h-4 w-4 text-primary" />
                {email}
              </p>
            </div>

            <div className="grid min-w-[220px] grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Total orders</p>
                <p className="mt-1 text-2xl font-black text-white">{totalOrders}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Mock orders</p>
                <p className="mt-1 text-2xl font-black text-white">{mockOrders.length}</p>
              </div>
              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Mentorship orders</p>
                <p className="mt-1 text-2xl font-black text-white">{mentorshipOrders.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-white md:text-xl">Available services</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service, idx) => (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_20px_45px_rgba(14,165,233,0.15)]"
              >
                <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${service.glow} blur-2xl transition-opacity duration-300 group-hover:opacity-100`} />
                {idx === 0 ? (
                  <>
                    <div className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-300/25 opacity-70 shadow-[inset_0_0_35px_rgba(6,182,212,0.2)]" />
                    <div className="pointer-events-none absolute -left-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
                  </>
                ) : null}
                <div className="relative">
                  {idx === 0 ? (
                    <span className="mb-3 inline-flex items-center rounded-full border border-cyan-200/40 bg-cyan-400/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                      Trending for students
                    </span>
                  ) : null}
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{service.description}</p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-5 rounded-full border-white/15 bg-white/5 text-white hover:border-primary/50 hover:bg-primary/10"
                  >
                    <Link href={service.href}>
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-white md:text-xl">Order history</h2>
          {!hasOrders ? (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
              <p className="text-sm text-muted-foreground">No purchases yet in this account.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {mockOrders.length > 0 ? (
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <Video className="h-5 w-5 text-primary" />
                    Mock interviews
                  </h3>
                  <div className="space-y-4">
                    {mockOrders.map((row) => (
                      <article
                        key={row.id}
                        className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-4 transition-all duration-300 hover:border-primary/30 md:p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-white">{row.mockLabel}</p>
                            <p className="text-xs text-slate-500">
                              Type {row.mockType}
                              {row.buyerExperienceBracket ? (
                                <> · Your experience: {row.buyerExperienceBracket} years</>
                              ) : null}
                            </p>
                          </div>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                            {row.status}
                          </span>
                        </div>
                        <dl className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 shrink-0 text-slate-500" />
                            <span>{row.mockDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500">Slot</span>
                            <span className="text-slate-300">{row.slotLabel}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 shrink-0 text-slate-500" />
                            Qty {row.quantity} · {row.country}
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 shrink-0 text-slate-500" />
                            <span className="inline-block max-w-[200px] truncate font-mono text-xs" title={row.paymentId}>
                              {row.paymentId}
                            </span>
                          </div>
                        </dl>
                        <p className="mt-2 text-[11px] text-slate-500">Booked {row.bookedAt}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {mentorshipOrders.length > 0 ? (
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Mentorship
                  </h3>
                  <div className="space-y-4">
                    {mentorshipOrders.map((row) => (
                      <article
                        key={row.id}
                        className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-4 transition-all duration-300 hover:border-primary/30 md:p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="font-medium text-white">{row.packageLabel}</p>
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                            {row.status}
                          </span>
                        </div>
                        <dl className="mt-3 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                          <div>
                            <span className="text-slate-500">Region </span>
                            {row.country}
                          </div>
                          <div>
                            <span className="text-slate-500">Access until </span>
                            {row.expiryDate}
                          </div>
                          <div className="sm:col-span-2 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 shrink-0 text-slate-500" />
                            <span className="inline-block max-w-full truncate font-mono text-xs" title={row.paymentId}>
                              {row.paymentId}
                            </span>
                          </div>
                        </dl>
                        <p className="mt-2 text-[11px] text-slate-500">Booked {row.bookedAt}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
