"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { MCQ } from "@/components/admin/assessment/MCQBuilder";
import type { CodingProblem } from "@/components/admin/assessment/CodingProblemBuilder";
import { Loader2, Library, Plus } from "lucide-react";

type BankRow = {
  id: string;
  kind: "MCQ" | "CODING";
  mcq?: MCQ;
  coding?: CodingProblem;
};

function cloneMcq(m: MCQ): MCQ {
  return {
    questionText: m.questionText,
    options: [...(m.options || [])],
    correctOption: m.correctOption,
    marks: m.marks,
  };
}

function cloneCoding(p: CodingProblem): CodingProblem {
  return {
    title: p.title,
    description: p.description,
    inputFormat: p.inputFormat || "",
    outputFormat: p.outputFormat || "",
    sampleTestCases: (p.sampleTestCases || []).map((t) => ({ input: t.input, output: t.output })),
    hiddenTestCases: (p.hiddenTestCases || []).map((t) => ({ input: t.input, output: t.output })),
    marks: p.marks,
  };
}

interface QuestionBankPickerProps {
  kind: "MCQ" | "CODING";
  onPickMcq?: (mcq: MCQ) => void;
  onPickCoding?: (p: CodingProblem) => void;
}

export function QuestionBankPicker({ kind, onPickMcq, onPickCoding }: QuestionBankPickerProps) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BankRow[]>([]);

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
  }, [debounced, kind]);

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
        Search admin-curated samples and questions from past assessments. Add to this test; anything you create from scratch is also saved to the repository when you dispatch this assessment.
      </p>
      <div className="flex gap-2 items-center">
        <Input
          placeholder={kind === "MCQ" ? "Search MCQs…" : "Search coding problems…"}
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
          items.map((row) => (
            <div key={row.id} className="flex items-center gap-3 p-3 text-left">
              <div className="flex-1 min-w-0 text-xs text-slate-300">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 mr-2">{row.kind}</span>
                <span className="min-w-0 break-words">{preview(row)}</span>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="shrink-0 rounded-full border-primary/40 text-primary hover:bg-primary/10 h-8"
                onClick={() => {
                  if (row.kind === "MCQ" && row.mcq) onPickMcq?.(cloneMcq(row.mcq));
                  if (row.kind === "CODING" && row.coding) onPickCoding?.(cloneCoding(row.coding));
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
