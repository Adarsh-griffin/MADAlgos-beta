"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Verified,
  Star,
  MapPin,
  Linkedin,
  ChevronDown,
} from "lucide-react";

export interface MentorCardProps {
  name: string;
  headline: string;
  companies: string;
  location: string | null;
  joined: string;
  ratingAvg: number;
  ratingCount: number;
  description: string;
  skills: string[];
  isVerified: boolean;
  image: string | null;
  linkedin: string | null;
}

function splitCompanies(input: string): string[] {
  return input
    .split(/[,|]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

const expectationPoints = [
  "Fast, structured feedback on your resume and interview prep.",
  "Clear roadmap for DSA and System Design (HLD / LLD).",
  "Mock interviews with detailed, actionable improvement notes.",
  "Weekly check‑ins and accountability on your preparation plan.",
];

export default function MentorCard(props: MentorCardProps) {
  const {
    name,
    headline,
    companies,
    location,
    joined,
    ratingAvg,
    ratingCount,
    description,
    skills,
    isVerified,
    image,
    linkedin,
  } = props;

  const [open, setOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const companyTags = companies ? splitCompanies(companies).slice(0, 4) : [];

  return (
    <div className="group relative bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 md:p-10 flex flex-col h-full shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-all duration-500 hover:border-primary/40 hover:bg-slate-900/60">
      <div className="flex items-start gap-6 mb-6">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-white/5">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
              N/A
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">
              {name}
            </h3>
            {isVerified && (
              <span
                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/45 bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"
                title="Verified by MADAlgos"
              >
                <Verified className="w-3.5 h-3.5" aria-hidden />
                Verified
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-[11px] md:text-xs font-bold uppercase tracking-[0.15em]">
            <span className="inline-flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="line-clamp-1">{headline}</span>
            </span>
          </div>
          {companyTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {companyTags.map((c, index) => (
                <span
                  key={`${c}-${index}`}
                  className="px-3 py-1.5 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-bold text-white/70 tracking-[0.18em] uppercase"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
            {location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                {location}
              </span>
            )}
            {ratingCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star className="w-4 h-4 text-primary" />
                {ratingAvg.toFixed(1)} ({ratingCount})
              </span>
            )}
            {joined && <span>Joined {joined}</span>}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p
          className={`text-muted-foreground text-sm leading-relaxed ${
            showFullDescription ? "" : "line-clamp-3"
          }`}
        >
          {description}
        </p>
        {description && description.length > 140 && (
          <button
            type="button"
            onClick={() => setShowFullDescription((v) => !v)}
            className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary hover:text-primary/80"
          >
            {showFullDescription ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 mb-4">
        {skills.slice(0, 6).map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-bold text-white/70 tracking-[0.18em] uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Social links */}
      <div className="flex items-center gap-3 mb-4">
        {linkedin && (
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-primary hover:text-slate-950 hover:border-primary transition-colors"
          >
            <Linkedin className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Expectations collapsible */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full inline-flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 hover:bg-white/10 transition-colors"
        >
          <span>What can I expect?</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {open && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground space-y-2">
            {expectationPoints.map((p) => (
              <p key={p} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

