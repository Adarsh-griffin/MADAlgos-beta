import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock,
  Gift,
  Layers,
  Play,
  Sparkles,
} from "lucide-react";
import { JudgeYourSkillsHeroArt } from "@/components/sections/JudgeYourSkillsHeroArt";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Building2,
    title: "Used by 50+ Colleges",
  },
  {
    icon: Layers,
    title: "Real Test Format (MCQ + Coding)",
  },
  {
    icon: Clock,
    title: "Timed sessions (35–50 min per pack)",
  },
  {
    icon: Gift,
    title: "100% Free Practice",
  },
] as const;

/**
 * Homepage: two-column hero — copy + CTAs + feature list; split-screen product mock.
 */
export function JudgeYourSkillsSection() {
  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden bg-[#010818] border-y border-white/[0.06]"
      style={{
        fontFamily:
          "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 15% 20%, rgba(20, 184, 166, 0.09), transparent 50%), radial-gradient(ellipse 55% 45% at 90% 70%, rgba(20, 184, 166, 0.06), transparent 45%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div
          className={cn(
            "relative rounded-[1.75rem] md:rounded-[2rem] border border-white/[0.08]",
            "bg-[#02091a]/80 backdrop-blur-sm shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]",
            "p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16"
          )}
        >
          <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
            <span className="pointer-events-none absolute -inset-1 rounded-full bg-red-500/30 blur-md animate-pulse" />
            <span className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-red-300/60 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-white shadow-[0_12px_34px_rgba(244,63,94,0.48)]">
              <span className="pointer-events-none absolute inset-y-0 left-0 w-7 -skew-x-12 bg-white/25 blur-[2px] opacity-80" />
              <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
              Free
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] gap-12 lg:gap-14 xl:gap-16 items-start lg:items-center">
            {/* Left: copy + CTAs + features */}
            <div className="min-w-0 space-y-7 md:space-y-8">
              <p
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/[0.07] px-3.5 py-1.5",
                  "text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.35em] text-primary"
                )}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(20,184,166,0.9)]"
                  aria-hidden
                />
                Practice tests
              </p>

              <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[3rem] font-black tracking-[-0.035em] leading-[1.12] text-slate-50 [font-feature-settings:'salt'_on]">
                Ace your next{" "}
                <span className="text-primary drop-shadow-[0_0_28px_rgba(20,184,166,0.25)]">
                  interview test
                </span>
              </h2>

              <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-slate-400/95 max-w-xl tracking-[0.02em]">
                Simulate real company tests with timed coding + MCQs — used by top hiring pipelines.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/available-tests"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
                    "text-sm font-semibold tracking-wide text-primary-foreground",
                    "bg-primary shadow-[0_0_32px_-4px_rgba(20,184,166,0.45)]",
                    "hover:bg-primary/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  )}
                >
                  Get started
                  <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
                </Link>
                <a
                  href="#judge-skills-product-preview"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5",
                    "text-sm font-semibold tracking-wide text-primary",
                    "border border-primary/40 bg-primary/[0.06] hover:bg-primary/12 hover:border-primary/55",
                    "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  )}
                >
                  <Play className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                  See How It Works
                </a>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 max-w-xl">
                {FEATURES.map(({ icon: Icon, title }) => (
                  <li
                    key={title}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border border-white/[0.08] bg-slate-950/40",
                      "px-3.5 py-3 sm:px-4 sm:py-3.5"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        "border border-primary/30 bg-primary/10 text-primary shadow-[0_0_20px_-6px_rgba(20,184,166,0.4)]"
                      )}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="text-[13px] font-semibold leading-snug text-slate-200">
                      {title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: split-screen mock */}
            <div className="relative flex justify-center lg:justify-end lg:pr-1">
              <JudgeYourSkillsHeroArt />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
