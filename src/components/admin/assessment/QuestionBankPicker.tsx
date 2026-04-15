"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MCQ } from "@/components/admin/assessment/MCQBuilder";
import type { CodingProblem } from "@/components/admin/assessment/CodingProblemBuilder";
import { Loader2, Library, Plus } from "lucide-react";
import { QUESTION_BANK_SECTIONS } from "@/data/question-bank-ui";
import { codingPickKey, mcqPickKey } from "@/lib/assessment-pick-keys";

type BankRow = {
  id: string;
  kind: "MCQ" | "CODING";
  fingerprint?: string;
  mcq?: MCQ;
  coding?: CodingProblem;
  section?: string;
  tags?: string[];
  leetcodeSlug?: string;
  sourcePack?: string;
};

function cloneMcq(m: MCQ): MCQ {
  return {
    questionText: m.questionText,
    options: [...(m.options || [])],
    correctOption: m.correctOption,
    correctOptions: m.correctOptions ? [...m.correctOptions] : undefined,
    selectionType: m.selectionType,
    marks: m.marks,
  };
}

function cloneCoding(p: CodingProblem, leetcodeSlug?: string): CodingProblem {
  const slug = p.leetcodeSlug?.trim() || leetcodeSlug?.trim();
  return {
    title: p.title,
    description: p.description,
    inputFormat: p.inputFormat || "",
    outputFormat: p.outputFormat || "",
    sampleTestCases: (p.sampleTestCases || []).map((t) => ({ input: t.input, output: t.output })),
    hiddenTestCases: (p.hiddenTestCases || []).map((t) => ({ input: t.input, output: t.output })),
    marks: p.marks,
    ...(p.starterCode && Object.keys(p.starterCode).length > 0 ? { starterCode: { ...p.starterCode } } : {}),
    ...(slug ? { leetcodeSlug: slug } : {}),
  };
}

function rowDedupeKey(row: BankRow): string {
  if (row.fingerprint) return row.fingerprint;
  if (row.kind === "MCQ" && row.mcq) return mcqPickKey(row.mcq);
  if (row.kind === "CODING" && row.coding) {
    return codingPickKey({
      title: row.coding.title,
      leetcodeSlug: row.leetcodeSlug ?? undefined,
    });
  }
  return row.id;
}

interface QuestionBankPickerProps {
  kind: "MCQ" | "CODING";
  onPickMcq?: (mcq: MCQ) => void;
  onPickCoding?: (p: CodingProblem) => void;
  /** Keys already present in the current assessment draft — those rows cannot be added again */
  pickedMcqKeys?: string[];
  pickedCodingKeys?: string[];
}

export function QuestionBankPicker({
  kind,
  onPickMcq,
  onPickCoding,
  pickedMcqKeys = [],
  pickedCodingKeys = [],
}: QuestionBankPickerProps) {
  const pickedMcq = useMemo(() => new Set(pickedMcqKeys), [pickedMcqKeys]);
  const pickedCoding = useMemo(() => new Set(pickedCodingKeys), [pickedCodingKeys]);
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [section, setSection] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BankRow[]>([]);

  const tagPresets = useMemo(() => {
    if (kind === "CODING") return ["dsa", "blind-75"];
    return ["dsa", "complexity", "graphs"];
  }, [kind]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 320);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("kind", kind);
        if (debounced) params.set("q", debounced);
        if (section) params.set("section", section);
        if (tag) params.set("tag", tag);
        const res = await fetch(`/api/assessment/question-bank?${params.toString()}`);
        if (!res.ok || cancelled) return;
        const data = await res.json();
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced, kind, section, tag]);

  const preview = (row: BankRow) => {
    if (row.kind === "MCQ" && row.mcq) {
      const t = row.mcq.questionText?.trim() || "Untitled MCQ";
      return t.length > 100 ? `${t.slice(0, 100)}…` : t;
    }
    if (row.kind === "CODING" && row.coding) {
      const t = row.coding.title?.trim() || "Untitled problem";
      return t.length > 80 ? `${t.slice(0, 80)}…` : t;
    }
    return "—";
  };

  return (
    <section className="rounded-2xl border border-primary/20 bg-primary/4 p-5 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Library className="h-4 w-4 shrink-0" />
        <h4 className="text-sm font-semibold text-white">Question repository</h4>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        Filter by <strong className="text-slate-400">section</strong> (e.g. DSA blind list, complexity theory) or search
        by name. Blind 75 coding items link to LeetCode; replace sample/hidden tests before high-stakes use.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Select value={section || "__all__"} onValueChange={(v) => setSection(v === "__all__" ? "" : v)}>
          <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl h-10">
            <SelectValue placeholder="All sections" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="__all__">All sections</SelectItem>
            {QUESTION_BANK_SECTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tag || "__tag_all__"} onValueChange={(v) => setTag(v === "__tag_all__" ? "" : v)}>
          <SelectTrigger className="bg-black/40 border-white/10 text-white rounded-xl h-10">
            <SelectValue placeholder="Tag (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__tag_all__">Any tag</SelectItem>
            {tagPresets.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 items-center">
        <Input
          placeholder={kind === "MCQ" ? "Search MCQs (e.g. complexity)…" : "Search (e.g. two-sum, heap)…"}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="bg-black/40 border-white/10 text-white rounded-xl h-10"
        />
        {loading ? <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" /> : null}
      </div>
      <div className="max-h-52 overflow-y-auto rounded-xl border border-white/10 divide-y divide-white/5 bg-black/20">
        {items.length === 0 && !loading ? (
          <p className="p-4 text-xs text-slate-500 text-center">No matches. Try another keyword.</p>
        ) : (
          items.map((row) => {
            const key = rowDedupeKey(row);
            const already =
              kind === "MCQ" ? pickedMcq.has(key) : pickedCoding.has(key);
            return (
              <div key={row.id} className="flex items-center gap-3 p-3 text-left">
                <div className="flex-1 min-w-0 text-xs text-slate-300">
                  <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">{row.kind}</span>
                    {row.section ? (
                      <span className="text-[9px] px-1.5 py-0 rounded bg-white/10 text-slate-400">{row.section}</span>
                    ) : null}
                    {row.sourcePack === "blind75" ? (
                      <span className="text-[9px] text-primary/90">Blind 75</span>
                    ) : null}
                  </div>
                  <span className="min-w-0 break-words">{preview(row)}</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={already}
                  className="shrink-0 rounded-full border-primary/40 text-primary hover:bg-primary/10 h-8 disabled:opacity-40 disabled:pointer-events-none"
                  onClick={() => {
                    if (already) return;
                    if (row.kind === "MCQ" && row.mcq) onPickMcq?.(cloneMcq(row.mcq));
                    if (row.kind === "CODING" && row.coding)
                      onPickCoding?.(cloneCoding(row.coding, row.leetcodeSlug));
                  }}
                >
                  {already ? "Added" : (
                    <>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add
                    </>
                  )}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
