"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type MentorPickerOption = {
  id: number;
  name: string;
  headline: string;
  companies: string;
};

type MentorPickerProps = {
  value: number | null;
  onChange: (mentorId: number | null) => void;
};

export function MentorPicker({ value, onChange }: MentorPickerProps) {
  const [options, setOptions] = React.useState<MentorPickerOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let c = true;
    (async () => {
      try {
        const res = await fetch("/api/booking/mentors-list");
        const data = (await res.json()) as { mentors?: MentorPickerOption[] };
        if (!c) return;
        setOptions(data.mentors ?? []);
      } catch {
        if (!c) return;
        setOptions([]);
      } finally {
        if (c) setLoading(false);
      }
    })();
    return () => {
      c = false;
    };
  }, []);

  const selected = value != null ? options.find((m) => m.id === value) : undefined;

  const q = query.trim().toLowerCase();
  const filtered =
    q.length === 0
      ? options.slice(0, 12)
      : options.filter((m) => {
          const blob = `${m.name} ${m.headline} ${m.companies}`.toLowerCase();
          return blob.includes(q);
        }).slice(0, 20);

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Mentor (optional)</label>
      <p className="text-[11px] text-slate-500">
        Search by name, role, or company — or leave empty to assign later.
      </p>

      {!loading && options.length === 0 ? (
        <p className="text-xs text-amber-400/90">
          No mentors listed yet. Publish mentors so they appear on{" "}
          <Link href="/mentors" className="underline text-primary">
            Mentors
          </Link>
          .
        </p>
      ) : null}

      {loading ? (
        <p className="text-xs text-slate-500">Loading mentor directory…</p>
      ) : !options.length ? null : selected ? (
        <div className="flex items-start justify-between gap-2 rounded-xl border border-primary/35 bg-primary/10 px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{selected.name}</p>
            <p className="text-xs text-slate-400 line-clamp-2">{selected.headline}</p>
            {selected.companies ? (
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">{selected.companies}</p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-slate-400 hover:text-white"
            onClick={() => {
              onChange(null);
              setQuery("");
            }}
            aria-label="Clear mentor"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative z-30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder={loading ? "Loading mentors…" : "Type to search mentors…"}
              disabled={loading}
              className="h-11 rounded-full border border-white/10 bg-[#1c1c1c] pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-[#2ab5a0] focus:outline-none focus:ring-2 focus:ring-[#2ab5a0]/60"
              autoComplete="off"
            />
          </div>
          {open && !loading && filtered.length > 0 ? (
            <ul
              className={cn(
                "absolute z-40 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-white/10 bg-[#0d0d0d] py-1 shadow-xl",
                "ring-1 ring-black/40"
              )}
              role="listbox"
            >
              {filtered.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-white/10 transition-colors"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onChange(m.id);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <span className="font-medium text-white block truncate">{m.name}</span>
                    <span className="text-xs text-slate-400 line-clamp-1">{m.headline}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {open && !loading && q.length > 0 && filtered.length === 0 ? (
            <p className="absolute z-40 mt-1 w-full rounded-xl border border-white/10 bg-[#0d0d0d] px-3 py-2 text-xs text-slate-500">
              No mentors match &ldquo;{query}&rdquo;.
            </p>
          ) : null}
        </div>
      )}

      {open && !selected ? (
        <button
          type="button"
          className="fixed inset-0 z-20 cursor-default bg-black/20"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
