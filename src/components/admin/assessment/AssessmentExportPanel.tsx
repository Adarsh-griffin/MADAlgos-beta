"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";

type ExportMode = "scores" | "answers";
type FileFormat = "xlsx" | "csv";

interface AssessmentExportPanelProps {
  testId: string;
}

export function AssessmentExportPanel({ testId }: AssessmentExportPanelProps) {
  const [mode, setMode] = useState<ExportMode>("scores");
  const [fileFormat, setFileFormat] = useState<FileFormat>("xlsx");
  const [loading, setLoading] = useState(false);

  const download = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        testId,
        mode: mode === "scores" ? "scores" : "answers",
        format: fileFormat,
      });
      const res = await fetch(`/api/assessment/report/export?${q.toString()}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(typeof err.message === "string" ? err.message : "Export failed.");
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition");
      const m = cd?.match(/filename="([^"]+)"/i) || cd?.match(/filename=([^;\s]+)/i);
      const filename = m?.[1]?.replace(/['"]/g, "") || `assessment_export_${testId}.${fileFormat}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      const kind = fileFormat === "xlsx" ? "Excel workbook" : "CSV file";
      toast.success(`${kind} downloaded.`);
    } catch {
      toast.error("Network error while exporting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#050505]/80 p-6 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <FileSpreadsheet className="h-5 w-5" />
        <h3 className="text-lg font-semibold text-white">Export for college</h3>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">
        Share performance with the institution. Pick score summary only or full responses, then download as native
        Excel (.xlsx) or CSV.
      </p>
      <div className="space-y-3">
        <Label className="text-slate-400">Export contents</Label>
        <RadioGroup
          value={mode}
          onValueChange={(v) => setMode(v as ExportMode)}
          className="grid gap-3 sm:grid-cols-2"
        >
          <label
            htmlFor="exp-scores"
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
              mode === "scores" ? "border-primary/50 bg-primary/5" : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <RadioGroupItem value="scores" id="exp-scores" className="mt-1" />
            <div>
              <span className="text-sm font-medium text-white">Scores only</span>
              <p className="text-xs text-slate-500 mt-1">
                Email, participation, totals — no answers or source code.
              </p>
            </div>
          </label>
          <label
            htmlFor="exp-answers"
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors ${
              mode === "answers" ? "border-primary/50 bg-primary/5" : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <RadioGroupItem value="answers" id="exp-answers" className="mt-1" />
            <div>
              <span className="text-sm font-medium text-white">Scores + submitted answers</span>
              <p className="text-xs text-slate-500 mt-1">
                Adds MCQ selections (letter, text, correct) and each coding submission with source.
              </p>
            </div>
          </label>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="text-slate-400">File type</Label>
        <RadioGroup
          value={fileFormat}
          onValueChange={(v) => setFileFormat(v as FileFormat)}
          className="flex flex-wrap gap-4"
        >
          <label htmlFor="fmt-xlsx" className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
            <RadioGroupItem value="xlsx" id="fmt-xlsx" />
            Excel (.xlsx)
          </label>
          <label htmlFor="fmt-csv" className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
            <RadioGroupItem value="csv" id="fmt-csv" />
            CSV
          </label>
        </RadioGroup>
      </div>

      <Button
        type="button"
        onClick={download}
        disabled={loading}
        variant="outline"
        className="rounded-2xl border-primary/40 text-primary hover:bg-primary/10"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
        Download report
      </Button>
    </section>
  );
}
