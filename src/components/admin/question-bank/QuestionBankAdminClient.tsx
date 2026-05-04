"use client";

import React, { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Play, Plus, Trash2 } from "lucide-react";
import { COMMON_TAGS, QUESTION_BANK_SECTIONS } from "@/data/question-bank-ui";

type MCQ = {
  questionText: string;
  options: string[];
  selectionType?: "single" | "multiple";
  correctOption?: number;
  correctOptions?: number[];
  marks: number;
};

type Coding = {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleTestCases: { input: string; output: string }[];
  hiddenTestCases: { input: string; output: string }[];
  marks: number;
  starterCode?: Record<string, string>;
  leetcodeSlug?: string;
};

type Item = {
  id: string;
  kind: "MCQ" | "CODING";
  mcq?: MCQ;
  coding?: Coding;
  section?: string;
  tags?: string[];
  leetcodeSlug?: string;
  sourcePack?: string;
  updatedAt?: string;
};

const EMPTY_MCQ: MCQ = {
  questionText: "",
  options: ["", "", "", ""],
  selectionType: "single",
  correctOption: 0,
  correctOptions: [0, 1],
  marks: 1,
};

const EMPTY_CODING: Coding = {
  title: "",
  description: "",
  inputFormat: "",
  outputFormat: "",
  sampleTestCases: [{ input: "", output: "" }],
  hiddenTestCases: [{ input: "", output: "" }],
  marks: 10,
  starterCode: {},
};

const RUN_LANGUAGES = ["Javascript", "Python", "Java", "C++", "C"] as const;
type RunLanguage = (typeof RUN_LANGUAGES)[number];

function normalizeStarterLanguage(lang: string): RunLanguage | null {
  const key = lang.trim().toLowerCase();
  if (key === "javascript" || key === "js") return "Javascript";
  if (key === "python" || key === "py") return "Python";
  if (key === "java") return "Java";
  if (key === "c++" || key === "cpp") return "C++";
  if (key === "c") return "C";
  return null;
}

function defaultCodeTemplate(language: RunLanguage, title: string): string {
  const safeTitle = title?.trim() || "Problem";
  if (language === "Javascript") {
    return `// ${safeTitle}
// Node reads stdin here and prints whatever solve() returns.
const fs = require("fs");
const input = fs.readFileSync(0, "utf8").trim();

function solve(rawInput) {
  // Your logic here — return a string (or number coerced below).
  return "";
}

const output = solve(input);
if (output !== undefined && output !== null) {
  process.stdout.write(String(output));
}
`;
  }
  if (language === "Python") {
    // `from __future__ import annotations` keeps PEP 585 hints (list[str], etc.) from
    // crashing on Python 3.8 and earlier runtimes (common on Judge0).
    return `# ${safeTitle}
# stdin → solve() → stdout (Judge0 uses Python 3.8-style runtime often).
from __future__ import annotations

import sys

def solve(raw_input: str) -> str:
    # Your logic here
    return ""

if __name__ == "__main__":
    data = sys.stdin.read().strip()
    out = solve(data)
    if out is not None:
        sys.stdout.write(str(out))
`;
  }
  if (language === "Java") {
    return `// ${safeTitle}
// Scanner reads all of stdin (works on typical Judge Java builds).
import java.util.Scanner;

public class Main {
    static String solve(String input) {
        // Your logic here
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        sc.useDelimiter("\\\\A");
        String input = sc.hasNext() ? sc.next().trim() : "";
        String out = solve(input);
        if (out != null) System.out.print(out);
        sc.close();
    }
}
`;
  }
  if (language === "C++") {
    return `// ${safeTitle}
// g++/Judge0: bits/stdc++.h is available on the judge.
#include <bits/stdc++.h>
using namespace std;

string solve(const string& input) {
    // Your logic here
    return "";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string input((istreambuf_iterator<char>(cin)), istreambuf_iterator<char>());
    string out = solve(input);
    cout << out;
    return 0;
}
`;
  }
  return `/* ${safeTitle} */
/* stdin read into buffer — extend if you need more than ~100k chars */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void solve(const char* input) {
    /* Your logic here */
}

int main(void) {
    char buffer[100000];
    size_t n = fread(buffer, 1, sizeof(buffer) - 1, stdin);
    buffer[n] = '\\0';
    solve(buffer);
    return 0;
}
`;
}

function pythonHasFutureAnnotations(source: string): boolean {
  return /from\s+__future__\s+import\s+[^#\n]*\bannotations\b/m.test(source);
}

/** Makes modern type hints (list[int], tuple[...]) safe on Python 3.8 / Judge0. */
function ensurePythonFutureAnnotations(source: string): string {
  if (!source.trim() || pythonHasFutureAnnotations(source)) return source;

  const lines = source.split("\n");
  let skipShebang = 0;
  if (lines[0]?.startsWith("#!")) skipShebang = 1;
  const head = lines.slice(0, skipShebang).join("\n");
  const rest = lines.slice(skipShebang).join("\n");
  const inj = "from __future__ import annotations";
  if (!head) return `${inj}\n\n${rest}`;
  return `${head}\n\n${inj}\n\n${rest}`;
}

function buildInitialCodeByLanguage(coding: Coding): Record<string, string> {
  const next: Record<string, string> = {};
  for (const lang of RUN_LANGUAGES) {
    next[lang] = defaultCodeTemplate(lang, coding.title);
  }
  const starters = coding.starterCode || {};
  Object.entries(starters).forEach(([k, v]) => {
    const normalized = normalizeStarterLanguage(k);
    if (!normalized) return;
    const code = String(v || "").trim();
    if (code) {
      next[normalized] = normalized === "Python" ? ensurePythonFutureAnnotations(code) : code;
    }
  });
  return next;
}

export function QuestionBankAdminClient() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  const [saving, setSaving] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [running, setRunning] = React.useState(false);
  const [queryInput, setQueryInput] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [filterKind, setFilterKind] = React.useState<"ALL" | "MCQ" | "CODING">("ALL");
  const [filterSection, setFilterSection] = React.useState("ALL");
  const [filterTag, setFilterTag] = React.useState("ALL");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [kind, setKind] = React.useState<"MCQ" | "CODING">("MCQ");
  const [section, setSection] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [leetcodeSlug, setLeetcodeSlug] = React.useState("");
  const [mcq, setMcq] = React.useState<MCQ>(EMPTY_MCQ);
  const [coding, setCoding] = React.useState<Coding>(EMPTY_CODING);
  const [runLanguage, setRunLanguage] = useState<RunLanguage>("Javascript");
  const [runScope, setRunScope] = useState<"sample" | "all">("all");
  const [codeByLanguage, setCodeByLanguage] = useState<Record<string, string>>(
    buildInitialCodeByLanguage(EMPTY_CODING)
  );
  const [runResults, setRunResults] = useState<
    Array<{ passed: boolean; status: string; visibility: string; stdout?: string; stderr?: string; compile_output?: string }>
  >([]);

  const fetchItems = React.useCallback(async (queryOverride?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const activeQuery = typeof queryOverride === "string" ? queryOverride.trim() : debouncedQuery.trim();
      if (activeQuery) params.set("q", activeQuery);
      if (filterKind !== "ALL") params.set("kind", filterKind);
      if (filterSection !== "ALL") params.set("section", filterSection);
      if (filterTag !== "ALL") params.set("tag", filterTag);
      params.set("page", String(page));
      params.set("limit", String(pageSize));
      const res = await fetch(`/api/admin/question-bank?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Failed to load questions.");
        return;
      }
      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filterKind, filterSection, filterTag, page, pageSize]);

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedQuery(queryInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(t);
  }, [queryInput]);

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const editingItem = useMemo(() => items.find((i) => i.id === selectedId) || null, [items, selectedId]);
  const actionBusy = saving || deletingId !== null;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const around = [page - 1, page, page + 1].filter((n) => n > 1 && n < totalPages);
    return [1, ...around, totalPages].filter((n, idx, arr) => arr.indexOf(n) === idx);
  }, [page, totalPages]);

  const resetDraft = React.useCallback(
    (nextKind: "MCQ" | "CODING", item?: Item | null) => {
      setKind(nextKind);
      setSection(item?.section || "");
      setTags((item?.tags || []).join(", "));
      setLeetcodeSlug(item?.leetcodeSlug || "");
      setMcq(item?.mcq ? { ...item.mcq, options: [...item.mcq.options] } : EMPTY_MCQ);
      setCoding(
        item?.coding
          ? {
              ...item.coding,
              sampleTestCases: [...(item.coding.sampleTestCases || [])],
              hiddenTestCases: [...(item.coding.hiddenTestCases || [])],
            }
          : EMPTY_CODING
      );
      const draftCoding =
        item?.coding
          ? {
              ...item.coding,
              sampleTestCases: [...(item.coding.sampleTestCases || [])],
              hiddenTestCases: [...(item.coding.hiddenTestCases || [])],
            }
          : EMPTY_CODING;
      setCodeByLanguage(buildInitialCodeByLanguage(draftCoding));
      setRunLanguage("Javascript");
      setRunResults([]);
    },
    []
  );

  const onNew = (nextKind: "MCQ" | "CODING") => {
    setSelectedId(null);
    resetDraft(nextKind, null);
  };

  const onEdit = (item: Item) => {
    setSelectedId(item.id);
    resetDraft(item.kind, item);
  };

  const saveQuestion = async () => {
    setSaving(true);
    try {
      const starterRecord =
        kind === "CODING"
          ? RUN_LANGUAGES.reduce<Record<string, string>>((acc, lang) => {
              acc[lang] = codeByLanguage[lang] ?? "";
              return acc;
            }, {})
          : undefined;
      const codingPayload =
        kind === "CODING"
          ? {
              ...coding,
              starterCode: starterRecord ?? {},
            }
          : undefined;
      const payload = {
        kind,
        section: section.trim(),
        tags: tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        leetcodeSlug: leetcodeSlug.trim().toLowerCase(),
        mcq: kind === "MCQ" ? mcq : undefined,
        coding: codingPayload,
      };
      const isEdit = Boolean(selectedId);
      const res = await fetch(isEdit ? `/api/admin/question-bank/${selectedId}` : "/api/admin/question-bank", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        id?: string;
        coding?: Coding;
        mcq?: MCQ;
      };
      if (!res.ok) {
        toast.error(data.message || "Save failed.");
        return;
      }
      toast.success(isEdit ? "Question updated." : "Question created.");
      if (kind === "CODING" && data.coding) {
        const c = data.coding;
        setCoding({
          ...c,
          sampleTestCases: [...(c.sampleTestCases || [])],
          hiddenTestCases: [...(c.hiddenTestCases || [])],
          starterCode: { ...(c.starterCode || {}) },
        });
        setCodeByLanguage(buildInitialCodeByLanguage(c));
      }
      if (kind === "MCQ" && data.mcq) {
        const m = data.mcq;
        setMcq({ ...m, options: [...(m.options || [])] });
      }
      await fetchItems();
      if (!isEdit && data.id) {
        setSelectedId(String(data.id));
      }
    } finally {
      setSaving(false);
    }
  };

  const removeQuestion = async (id: string) => {
    if (!window.confirm("Delete this question?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/question-bank/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Delete failed.");
        return;
      }
      if (selectedId === id) onNew("MCQ");
      toast.success("Question removed.");
      await fetchItems();
    } finally {
      setDeletingId(null);
    }
  };

  const runTests = async () => {
    if (kind !== "CODING") return;
    setRunning(true);
    setRunResults([]);
    try {
      let sourceCode = codeByLanguage[runLanguage] || "";
      if (runLanguage === "Python") {
        const fixed = ensurePythonFutureAnnotations(sourceCode);
        if (fixed !== sourceCode) {
          setCodeByLanguage((prev) => ({ ...prev, Python: fixed }));
          sourceCode = fixed;
        }
      }
      const res = await fetch("/api/admin/question-bank/run-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coding,
          sourceCode,
          language: runLanguage,
          runScope,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Run failed.");
        return;
      }
      setRunResults(Array.isArray(data.results) ? data.results : []);
      toast.success("Test cases executed.");
    } finally {
      setRunning(false);
    }
  };

  const clearFilters = () => {
    setFilterKind("ALL");
    setFilterSection("ALL");
    setFilterTag("ALL");
    setQueryInput("");
    setDebouncedQuery("");
    setPage(1);
  };

  React.useEffect(() => {
    setCodeByLanguage((prev) => {
      const next = { ...prev };
      for (const lang of RUN_LANGUAGES) {
        if (!next[lang]?.trim()) {
          next[lang] = defaultCodeTemplate(lang, coding.title);
        }
      }
      return next;
    });
  }, [coding.title]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question bank"
        description="Manage all interview questions in one place. You can add, edit, delete, and run coding test cases."
        action={
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onNew("MCQ")} className="rounded-full" disabled={actionBusy}>
              <Plus className="h-4 w-4 mr-1" /> New MCQ
            </Button>
            <Button type="button" onClick={() => onNew("CODING")} className="rounded-full" disabled={actionBusy}>
              <Plus className="h-4 w-4 mr-1" /> New Coding
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <section className="rounded-2xl border border-white/10 bg-[#050505]/70 p-4 space-y-4 xl:sticky xl:top-24">
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={filterKind}
              onValueChange={(v: "ALL" | "MCQ" | "CODING") => {
                setFilterKind(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Kind" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All kinds</SelectItem>
                <SelectItem value="MCQ">MCQ</SelectItem>
                <SelectItem value="CODING">Coding</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterSection}
              onValueChange={(v) => {
                setFilterSection(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="ALL">All sections</SelectItem>
                {QUESTION_BANK_SECTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select
            value={filterTag}
            onValueChange={(v) => {
              setFilterTag(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All tags</SelectItem>
              {COMMON_TAGS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                const immediate = queryInput.trim();
                setDebouncedQuery(immediate);
                setPage(1);
                fetchItems(immediate);
              }}
              placeholder="Search questions..."
              className="bg-white/5 border-white/10 text-white"
            />
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => {
                const immediate = queryInput.trim();
                setDebouncedQuery(immediate);
                setPage(1);
                fetchItems(immediate);
              }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Search
            </Button>
            <Button type="button" variant="ghost" onClick={clearFilters} disabled={loading}>
              Clear
            </Button>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {items.length} of {total}
            </span>
            <div className="flex items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number.parseInt(v, 10) || 25);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-24 bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="25">25 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="max-h-[70vh] overflow-auto space-y-2">
            {loading ? (
              <div className="py-16 text-slate-400 flex justify-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading questions...
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-slate-500 text-sm text-center">No questions found.</div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 ${selectedId === item.id ? "border-primary bg-primary/10" : "border-white/10 bg-black/20"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      className="text-left flex-1 min-w-0"
                      onClick={() => onEdit(item)}
                      disabled={actionBusy}
                    >
                      <p className="text-[10px] uppercase text-slate-500 tracking-wider">{item.kind}</p>
                      <p className="text-sm text-white truncate">
                        {item.kind === "MCQ" ? item.mcq?.questionText || "Untitled MCQ" : item.coding?.title || "Untitled Coding"}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {(item.tags || []).slice(0, 3).join(", ") || "No tags"} {item.section ? `• ${item.section}` : ""}
                      </p>
                    </button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={actionBusy}
                      onClick={() => removeQuestion(item.id)}
                      aria-label="Delete question"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-400" />
                      )}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1 || loading || actionBusy}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((n) => (
                <Button
                  key={n}
                  type="button"
                  size="sm"
                  variant={n === page ? "default" : "outline"}
                  className="h-8 min-w-8 px-2"
                  disabled={loading || actionBusy}
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={page >= totalPages || loading || actionBusy}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#050505]/70 p-5 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Question type</Label>
              <div className="flex gap-2">
                <Button type="button" variant={kind === "MCQ" ? "default" : "outline"} onClick={() => setKind("MCQ")}>
                  MCQ
                </Button>
                <Button type="button" variant={kind === "CODING" ? "default" : "outline"} onClick={() => setKind("CODING")}>
                  Coding
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Section</Label>
              <Input value={section} onChange={(e) => setSection(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Tags (comma-separated)</Label>
              <Input value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Leetcode slug (optional)</Label>
              <Input value={leetcodeSlug} onChange={(e) => setLeetcodeSlug(e.target.value)} />
            </div>
          </div>

          {kind === "MCQ" ? (
            <div className="space-y-3">
              <Label>Question</Label>
              <Textarea value={mcq.questionText} onChange={(e) => setMcq((p) => ({ ...p, questionText: e.target.value }))} />
              <div className="grid grid-cols-2 gap-2">
                {mcq.options.map((opt, i) => (
                  <Input
                    key={i}
                    value={opt}
                    placeholder={`Option ${i + 1}`}
                    onChange={(e) =>
                      setMcq((prev) => {
                        const next = [...prev.options];
                        next[i] = e.target.value;
                        return { ...prev, options: next };
                      })
                    }
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Selection type</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant={mcq.selectionType === "single" ? "default" : "outline"} onClick={() => setMcq((p) => ({ ...p, selectionType: "single" }))}>
                      Single
                    </Button>
                    <Button type="button" variant={mcq.selectionType === "multiple" ? "default" : "outline"} onClick={() => setMcq((p) => ({ ...p, selectionType: "multiple" }))}>
                      Multiple
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Marks</Label>
                  <Input type="number" value={mcq.marks} onChange={(e) => setMcq((p) => ({ ...p, marks: Number(e.target.value) || 1 }))} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Correct option index (0-based)</Label>
                <Input
                  type="number"
                  value={mcq.correctOption ?? 0}
                  onChange={(e) => setMcq((p) => ({ ...p, correctOption: Number(e.target.value) || 0 }))}
                />
                {mcq.selectionType === "multiple" ? (
                  <Input
                    placeholder="Correct option indices for multi-select (example: 0,2)"
                    value={(mcq.correctOptions || []).join(",")}
                    onChange={(e) =>
                      setMcq((p) => ({
                        ...p,
                        correctOptions: e.target.value
                          .split(",")
                          .map((v) => Number(v.trim()))
                          .filter((v) => Number.isInteger(v) && v >= 0),
                      }))
                    }
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Input placeholder="Coding title" value={coding.title} onChange={(e) => setCoding((p) => ({ ...p, title: e.target.value }))} />
              <Textarea
                placeholder="Problem description"
                value={coding.description}
                onChange={(e) => setCoding((p) => ({ ...p, description: e.target.value }))}
              />
              <Textarea placeholder="Input format" value={coding.inputFormat} onChange={(e) => setCoding((p) => ({ ...p, inputFormat: e.target.value }))} />
              <Textarea placeholder="Output format" value={coding.outputFormat} onChange={(e) => setCoding((p) => ({ ...p, outputFormat: e.target.value }))} />
              <Input type="number" value={coding.marks} onChange={(e) => setCoding((p) => ({ ...p, marks: Number(e.target.value) || 10 }))} />

              <div className="space-y-2">
                <Label>Sample test cases</Label>
                {coding.sampleTestCases.map((tc, i) => (
                  <div key={`s-${i}`} className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Input"
                      value={tc.input}
                      onChange={(e) =>
                        setCoding((p) => {
                          const next = [...p.sampleTestCases];
                          next[i] = { ...next[i], input: e.target.value };
                          return { ...p, sampleTestCases: next };
                        })
                      }
                    />
                    <Input
                      placeholder="Expected output"
                      value={tc.output}
                      onChange={(e) =>
                        setCoding((p) => {
                          const next = [...p.sampleTestCases];
                          next[i] = { ...next[i], output: e.target.value };
                          return { ...p, sampleTestCases: next };
                        })
                      }
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setCoding((p) => ({ ...p, sampleTestCases: [...p.sampleTestCases, { input: "", output: "" }] }))}>
                  Add sample case
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Hidden test cases</Label>
                {coding.hiddenTestCases.map((tc, i) => (
                  <div key={`h-${i}`} className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Input"
                      value={tc.input}
                      onChange={(e) =>
                        setCoding((p) => {
                          const next = [...p.hiddenTestCases];
                          next[i] = { ...next[i], input: e.target.value };
                          return { ...p, hiddenTestCases: next };
                        })
                      }
                    />
                    <Input
                      placeholder="Expected output"
                      value={tc.output}
                      onChange={(e) =>
                        setCoding((p) => {
                          const next = [...p.hiddenTestCases];
                          next[i] = { ...next[i], output: e.target.value };
                          return { ...p, hiddenTestCases: next };
                        })
                      }
                    />
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setCoding((p) => ({ ...p, hiddenTestCases: [...p.hiddenTestCases, { input: "", output: "" }] }))}>
                  Add hidden case
                </Button>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 overflow-hidden">
                <div className="px-4 py-2 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                  <Label className="text-slate-300">Run coding test cases (Judge0)</Label>
                  <div className="flex gap-2">
                    <Select value={runLanguage} onValueChange={(v) => setRunLanguage(v as RunLanguage)}>
                      <SelectTrigger className="h-8 w-36 bg-black/50 border-white/15 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RUN_LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={runScope} onValueChange={(v) => setRunScope(v === "sample" ? "sample" : "all")}>
                      <SelectTrigger className="h-8 w-32 bg-black/50 border-white/15 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All cases</SelectItem>
                        <SelectItem value="sample">Sample only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea
                  value={codeByLanguage[runLanguage] || ""}
                  onChange={(e) =>
                    setCodeByLanguage((prev) => ({
                      ...prev,
                      [runLanguage]: e.target.value,
                    }))
                  }
                  placeholder="Write or paste solution code here..."
                  className="min-h-[200px] rounded-none border-0 border-b border-white/10 bg-[#0b0f14] text-slate-100 font-mono text-xs"
                />
                <div className="px-4 pb-4">
                  <Button type="button" disabled={running || saving || deletingId !== null} onClick={runTests}>
                    {running ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                    Run test cases
                  </Button>
                </div>
                {runResults.length ? (
                  <div className="space-y-2 text-xs px-4 pb-4">
                    {runResults.map((r, idx) => (
                      <div key={idx} className={`rounded-lg p-2 border ${r.passed ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}>
                        <p className="text-white">
                          #{idx + 1} [{r.visibility}] {r.passed ? "Passed" : "Failed"} - {r.status}
                        </p>
                        {r.stderr ? <p className="text-red-300 whitespace-pre-wrap font-mono">{r.stderr}</p> : null}
                        {r.compile_output ? <p className="text-red-300 whitespace-pre-wrap font-mono">{r.compile_output}</p> : null}
                        {r.stdout ? <p className="text-slate-300 whitespace-pre-wrap font-mono">{r.stdout}</p> : null}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-white/10 flex gap-2">
            <Button type="button" onClick={saveQuestion} disabled={saving || deletingId !== null}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {selectedId ? "Update question" : "Create question"}
            </Button>
            {selectedId ? (
              <Button
                type="button"
                variant="destructive"
                disabled={saving || deletingId !== null}
                onClick={() => removeQuestion(selectedId)}
              >
                {deletingId === selectedId ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Delete
              </Button>
            ) : null}
          </div>
          <p className="text-xs text-slate-500">
            {editingItem?.sourcePack ? `Source pack: ${editingItem.sourcePack}` : "Custom question draft"}
          </p>
        </section>
      </div>
    </div>
  );
}
