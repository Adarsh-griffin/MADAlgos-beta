"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Loader2, MailPlus, Upload } from "lucide-react";
import { partitionEmailList, type InvalidEmailEntry } from "@/lib/email-list-partition";
import * as XLSX from "xlsx";
import { extractEmailsFromWorkbook } from "@/lib/assessment-excel-emails";

async function readJsonSafe(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function ReuseAssessmentBatchDialog({
  sourceTestId,
  open,
  onOpenChange,
}: {
  sourceTestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastInvalid, setLastInvalid] = useState<InvalidEmailEntry[]>([]);
  const [lastIgnoredDupes, setLastIgnoredDupes] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const partitioned = useMemo(() => partitionEmailList(raw), [raw]);
  const { valid: validList, invalid: invalidLocal, ignoredDuplicates } = partitioned;

  const mergeLines = (lines: string[]) => {
    const block = lines.join("\n");
    setRaw((prev) => (prev.trim() ? `${prev.trim()}\n${block}` : block));
  };

  const onExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".xlsx") && !lower.endsWith(".xls")) {
      toast.error("Please upload an Excel file (.xlsx or .xls).");
      return;
    }
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const cells = extractEmailsFromWorkbook(wb);
      if (cells.length === 0) {
        toast.error("No cells found in the spreadsheet.");
        return;
      }
      mergeLines(cells);
      toast.success(`Imported ${cells.length} cell value(s). Review the list before continuing.`);
    } catch {
      toast.error("Could not read that Excel file.");
    }
  };

  const cloneOnly = async () => {
    setLoading(true);
    setLastInvalid([]);
    setLastIgnoredDupes([]);
    try {
      const res = await fetch("/api/assessment/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceTestId }),
      });
      const data = await readJsonSafe(res);
      if (!res.ok) {
        toast.error(typeof data.message === "string" ? data.message : "Could not duplicate assessment.");
        return;
      }
      const newTestId = typeof data.testId === "string" ? data.testId : "";
      if (!newTestId) {
        toast.error("Server did not return a new test id.");
        return;
      }
      toast.success("New assessment created — invite students from the monitor page.");
      onOpenChange(false);
      setRaw("");
      router.push(`/admin/assessment/view/${newTestId}`);
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const cloneAndInvite = async () => {
    if (validList.length === 0) {
      toast.error(
        invalidLocal.length
          ? "Fix invalid addresses or add at least one valid email — or use “Create copy only”."
          : "Paste at least one valid email, or use “Create copy only”."
      );
      return;
    }

    setLoading(true);
    setLastInvalid([]);
    setLastIgnoredDupes([]);
    try {
      const cloneRes = await fetch("/api/assessment/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceTestId }),
      });
      const cloneData = await readJsonSafe(cloneRes);
      if (!cloneRes.ok) {
        toast.error(typeof cloneData.message === "string" ? cloneData.message : "Could not duplicate assessment.");
        return;
      }
      const newTestId = typeof cloneData.testId === "string" ? cloneData.testId : "";
      if (!newTestId) {
        toast.error("Server did not return a new test id.");
        return;
      }

      const dispatchRes = await fetch("/api/assessment/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId: newTestId, emails: raw }),
      });
      const dispatchData = await readJsonSafe(dispatchRes);

      const invalidFromServer: InvalidEmailEntry[] = Array.isArray(dispatchData.invalidEntries)
        ? (dispatchData.invalidEntries as InvalidEmailEntry[])
        : [];
      const ignoredFromServer: string[] = Array.isArray(dispatchData.ignoredDuplicates)
        ? (dispatchData.ignoredDuplicates as string[])
        : [];

      if (!dispatchRes.ok) {
        setLastInvalid(invalidFromServer);
        setLastIgnoredDupes(ignoredFromServer);
        toast.error(
          typeof dispatchData.message === "string"
            ? dispatchData.message
            : "Assessment copied but inviting students failed."
        );
        onOpenChange(false);
        setRaw("");
        router.push(`/admin/assessment/view/${newTestId}`);
        return;
      }

      setLastInvalid(invalidFromServer);
      setLastIgnoredDupes(ignoredFromServer);

      if (typeof dispatchData.emailError === "string") {
        toast.error(`Links created but email failed: ${dispatchData.emailError.slice(0, 200)}`);
      } else if (dispatchData.emailSkipped) {
        toast.warning("Links created. Configure SendGrid to send invitation emails.");
      } else if (typeof dispatchData.added === "number" && dispatchData.added > 0) {
        toast.success(`New assessment created — sent ${dispatchData.added} invitation(s).`);
      } else {
        toast.info(typeof dispatchData.message === "string" ? dispatchData.message : "Assessment created.");
      }

      if (invalidFromServer.length > 0) {
        toast.warning(`${invalidFromServer.length} invalid address(es) were not invited.`);
      }

      if (typeof dispatchData.added === "number" && dispatchData.added > 0) {
        if (invalidFromServer.length > 0 || ignoredFromServer.length > 0) {
          sessionStorage.setItem(
            `dispatch-feedback-${newTestId}`,
            JSON.stringify({ invalid: invalidFromServer, ignored: ignoredFromServer })
          );
        }
      }

      onOpenChange(false);
      setRaw("");
      router.push(`/admin/assessment/view/${newTestId}`);
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reuse for a new cohort</DialogTitle>
          <DialogDescription>
            Creates a duplicate of this assessment (same questions and timing). Then invite the next batch by email,
            or create an empty copy and invite later from the monitor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-wrap gap-2">
            <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onExcel} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full border-white/15"
              disabled={loading}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Excel
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400">Student emails</Label>
            <Textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={"student1@college.edu\nstudent2@college.edu\n..."}
              className="bg-white/5 border-white/10 text-white min-h-[180px] rounded-2xl font-mono text-sm p-4"
              disabled={loading}
            />
            <p className="text-xs text-slate-500">
              <span className="text-primary font-semibold">{validList.length}</span> valid ·{" "}
              {invalidLocal.length > 0 ? (
                <span className="text-amber-400 font-semibold">{invalidLocal.length} invalid (skipped)</span>
              ) : (
                <span>0 invalid</span>
              )}
              {ignoredDuplicates.length > 0 ? (
                <span className="text-slate-400"> · {ignoredDuplicates.length} repeated in list</span>
              ) : null}
            </p>
          </div>

          {(lastInvalid.length > 0 || lastIgnoredDupes.length > 0) && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-100/90">
              {lastInvalid.length > 0 && (
                <p className="font-medium text-amber-200 mb-1">Some addresses were invalid (not invited)</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="secondary" onClick={cloneOnly} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
            Create copy only
          </Button>
          <Button
            type="button"
            className="bg-primary text-black hover:bg-primary/90"
            onClick={cloneAndInvite}
            disabled={loading || validList.length === 0}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailPlus className="mr-2 h-4 w-4" />}
            Create copy &amp; invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ReuseAssessmentBatchButton({
  sourceTestId,
  className,
}: {
  sourceTestId: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className={className ?? "rounded-full"}
        onClick={() => setOpen(true)}
      >
        <Copy className="h-4 w-4 mr-1" />
        Reuse for new batch
      </Button>
      <ReuseAssessmentBatchDialog sourceTestId={sourceTestId} open={open} onOpenChange={setOpen} />
    </>
  );
}
