import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NotebookPen } from "lucide-react";
import type { PublicDemoTestCard } from "@/lib/public-demo-tests";
import { cn } from "@/lib/utils";

type Props = {
  test: PublicDemoTestCard;
  className?: string;
};

/**
 * Square 1:1 card — brand logo center, premium typography (Geist via root layout).
 */
export function PublicDemoSquareCard({ test, className }: Props) {
  const href = `/available-tests/${encodeURIComponent(test.publicSlug)}`;
  const isPro = /capgemini/i.test(test.title);

  return (
    <Link
      href={href}
      className={cn(
        "group relative w-full max-w-[min(100%,23rem)] mx-auto flex flex-col overflow-hidden rounded-[1.15rem] sm:rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#010818]",
        "bg-[#010818]/98 backdrop-blur-xl border border-white/[0.08] ring-1 ring-white/[0.04]",
        "shadow-[0_24px_70px_rgba(0,0,0,0.62)] transition-all duration-500",
        "hover:border-primary/35 hover:shadow-[0_34px_110px_rgba(0,0,0,0.74)] hover:-translate-y-0.5",
        className
      )}
    >
      <span className="sr-only">{test.title} — open details</span>
      <div className="absolute top-0 right-0 z-10 h-[3px] w-20 rounded-bl-lg bg-gradient-to-l from-primary via-primary/75 to-transparent" />
      <div className="absolute top-0 left-0 right-[4.5rem] h-[2px] bg-gradient-to-r from-primary/45 via-primary/12 to-transparent z-10" />
      <div className="absolute right-3 top-2 z-20 sm:right-3.5 sm:top-3">
        {isPro ? (
          <span className="relative inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold text-white border border-violet-200/70 bg-gradient-to-r from-violet-500 to-purple-500 shadow-[0_10px_26px_rgba(139,92,246,0.42)]">
            Pro
          </span>
        ) : (
          <span className="free-tag-swing relative inline-flex items-center rounded-md border border-red-200/75 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 px-3 py-1.5 text-[11px] font-bold tracking-[0.08em] text-white shadow-[0_12px_30px_rgba(239,68,68,0.45)]">
            <span className="pointer-events-none absolute -top-4 left-2 h-4 w-[2px] rounded-full bg-white/65" />
            <span className="pointer-events-none absolute -top-[6px] left-[3px] h-3.5 w-3.5 rounded-full border-2 border-white/75 bg-[#010818]" />
            FREE
          </span>
        )}
      </div>

      <div className="relative flex flex-1 min-h-0 flex-col items-stretch">
        <div className="relative flex min-h-[7.8rem] sm:min-h-[8.4rem] w-full items-center justify-center bg-gradient-to-b from-[#0a1224] to-[#010818] px-5 sm:px-6 pt-5 sm:pt-6 pb-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5 sm:py-4">
            <div className="relative h-[min(6.25rem,36vw)] w-[min(6.25rem,36vw)] sm:h-[6.8rem] sm:w-[6.8rem] md:h-28 md:w-28">
            <Image
              src={test.logoUrl}
              alt={test.title}
              fill
              className="object-contain drop-shadow-[0_8px_32px_rgba(20,184,166,0.15)]"
              sizes="128px"
              priority={false}
            />
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 justify-between px-3.5 sm:px-4 md:px-5 pb-3.5 sm:pb-4 md:pb-5 pt-3 min-h-0">
          <div className="space-y-1.5 min-w-0">
            <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.28em] sm:tracking-[0.35em] text-primary/95">Company assessment</p>
            <h3 className="text-[20px] sm:text-[22px] font-bold tracking-[-0.01em] text-slate-100 leading-tight line-clamp-2">
              {test.title}
            </h3>
            <p
              className="text-[10px] sm:text-[11px] md:text-[12px] font-medium leading-snug text-muted-foreground/90 line-clamp-2 tracking-wide min-h-[2.75rem]"
              title={test.demoCardSubtitle}
            >
              {test.demoCardSubtitle}
            </p>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-center justify-between gap-2 pt-2 border-t border-white/[0.06]">
            <span className="text-[8px] sm:text-[9px] font-semibold tracking-[0.08em] text-slate-500 whitespace-nowrap">
              {test.duration} min
            </span>
            <span className="inline-flex items-center gap-2">
              <NotebookPen className="h-3.5 w-3.5 text-primary/70 shrink-0" aria-hidden />
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full py-1.5 px-3.5 text-sm font-semibold",
                  "border border-white/30 text-slate-100 group-hover:border-primary/55 group-hover:text-primary transition-colors"
                )}
              >
                Explore
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
