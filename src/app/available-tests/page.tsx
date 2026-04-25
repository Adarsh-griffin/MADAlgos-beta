import React from "react";
import Link from "next/link";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { getPublicDemoTests } from "@/lib/public-demo-tests";
import { PublicDemoSquareCard } from "@/components/sections/PublicDemoSquareCard";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "All practice tests | MADAlgos",
  description: "Company-style hiring practice — MCQs and coding in one flow.",
};

export const dynamic = "force-dynamic";

export default async function AvailableTestsPage() {
  const tests = await getPublicDemoTests();
  const filters = ["All", "Free", "DSA", "Systems", "SQL"];
  const totalDuration = tests.reduce((sum, t) => sum + (Number(t.duration) || 0), 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#010818] text-foreground antialiased">
      <Header />
      <main className="flex-1 pt-24 md:pt-32 pb-20 md:pb-24 px-4 sm:px-5 md:px-8">
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20, 184, 166, 0.12), transparent 50%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(20, 184, 166, 0.06), transparent 45%)",
          }}
        />

        <div className="max-w-[90rem] mx-auto space-y-10 sm:space-y-12">
          <header className="relative max-w-[72rem] mx-auto px-1">
            <div className="pointer-events-none absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="mt-4 sm:mt-6 md:mt-8 mb-8 sm:mb-10 flex items-center justify-start text-[11px] font-semibold tracking-[0.08em] text-slate-500">
              <Link href="/" className="hover:text-slate-300 transition-colors">
                Home
              </Link>
            </div>
            <div className="relative text-center rounded-[2rem] border border-white/10 bg-white/[0.02] px-5 py-8 sm:px-8 sm:py-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-primary/90 mb-4">Judge your skills</p>
              <h1
                className={cn(
                  "text-[2.2rem] sm:text-[2.8rem] md:text-[3.3rem] lg:text-[44px] font-black text-primary",
                  "tracking-[-0.028em] leading-[1.03] mb-5 sm:mb-6",
                  "[text-shadow:0_0_70px_rgba(20,184,166,0.12)]"
                )}
              >
                All practice tests
              </h1>
              <p className="text-[13px] sm:text-sm md:text-[15px] font-medium text-slate-400/95 max-w-[56rem] mx-auto tracking-[0.015em] leading-relaxed px-2 sm:px-3">
                Full catalog of company-style packs — same assessment engine as campus & hiring flows. Pick a brand, review
                details, then sign in to begin.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-200">
                  {tests.length} live assessments
                </span>
                <span className="rounded-full border border-violet-300/30 bg-violet-400/10 px-4 py-1.5 text-xs font-semibold text-violet-200">
                  {totalDuration} total mins
                </span>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-200">
                  Free to start
                </span>
              </div>
              <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                {filters.map((f, idx) => (
                  <button
                    type="button"
                    key={f}
                    className={cn(
                      "rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300",
                      idx === 0
                        ? "border-primary bg-primary/90 text-black shadow-[0_10px_25px_rgba(20,184,166,0.35)]"
                        : "border-white/20 text-slate-300 hover:border-primary/45 hover:text-primary hover:-translate-y-0.5"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </header>

          <section className="space-y-5 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold tracking-[0.01em] text-slate-200">Company assessments</h2>
            {tests.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm max-w-md mx-auto">
              No public tests yet. Admins can publish assessments with{" "}
              <span className="text-foreground font-medium">Public demo</span> under Admin → Create.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 sm:gap-x-6 lg:gap-x-7 xl:gap-x-8 gap-y-7 sm:gap-y-10 lg:gap-y-12 justify-items-stretch">
              {tests.map((t) => (
                <div
                  key={t.id}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <PublicDemoSquareCard test={t} className="max-w-[23rem] w-full" />
                </div>
              ))}
            </div>
          )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
