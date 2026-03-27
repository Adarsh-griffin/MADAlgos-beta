"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Video, GraduationCap, Calendar, Hash, CreditCard } from "lucide-react";

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

  return (
    <main className="py-10">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12 xl:px-14">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-card/70 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.7)] md:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as <strong className="text-card-foreground">{displayName}</strong> ({email})
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Order history includes paid mock interviews and mentorship bookings linked to this account.
          </p>
        </div>

        {!hasOrders ? (
          <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
            <p className="text-sm text-muted-foreground">No orders yet.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild variant="secondary" className="rounded-full">
                <Link href="/book-mock">
                  <Video className="mr-2 h-4 w-4" />
                  Book a mock
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/15">
                <Link href="/book-mentorship">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Get mentorship
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {mockOrders.length > 0 ? (
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Video className="h-5 w-5 text-primary" />
                  Mock interviews
                </h2>
                <div className="space-y-4">
                  {mockOrders.map((row) => (
                    <article
                      key={row.id}
                      className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-4 md:p-5"
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
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Mentorship
                </h2>
                <div className="space-y-4">
                  {mentorshipOrders.map((row) => (
                    <article
                      key={row.id}
                      className="rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-4 md:p-5"
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
      </section>
    </main>
  );
}
