"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, MailPlus, Upload } from "lucide-react";
import { partitionEmailList, type InvalidEmailEntry } from "@/lib/email-list-partition";
import * as XLSX from "xlsx";

function extractEmailsFromWorkbook(wb: XLSX.WorkBook): string[] {
  const found: string[] = [];
  const headerRe = /^(e-?mail|email address|student e-?mail|student email)$/i;

  for (const sheetName of wb.SheetNames) {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json<(string | number | boolean | null | undefined)[]>(sheet, {
      header: 1,
      defval: "",
    });
    for (const row of rows) {
      if (!Array.isArray(row)) continue;
      for (const cell of row) {
        const s = String(cell ?? "").trim();
        if (!s) continue;
        if (headerRe.test(s)) continue;
        found.push(s);
      }
    }
  }
  return found;
}

export function DispatchStudentsPanel({ testId }: { testId: string }) {
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastInvalid, setLastInvalid] = useState<InvalidEmailEntry[]>([]);
  const [lastIgnoredDupes, setLastIgnoredDupes] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const k = `dispatch-feedback-${testId}`;
    const stored = sessionStorage.getItem(k);
    if (!stored) return;
    sessionStorage.removeItem(k);
    try {
      const o = JSON.parse(stored) as { invalid?: InvalidEmailEntry[]; ignored?: string[] };
      if (Array.isArray(o.invalid)) setLastInvalid(o.invalid);
      if (Array.isArray(o.ignored)) setLastIgnoredDupes(o.ignored);
    } catch {
      /* ignore */
    }
  }, [testId]);

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
      toast.success(`Imported ${cells.length} cell value(s). Review the list before sending.`);
    } catch {
      toast.error("Could not read that Excel file.");
    }
  };

  const submit = async () => {
    if (validList.length === 0) {
      toast.error(
        invalidLocal.length
          ? "Fix or remove invalid addresses (see list below), or add at least one valid email."
          : "Paste at least one valid email, or upload an Excel list."
      );
      return;
    }

    setLoading(true);
    setLastInvalid([]);
    setLastIgnoredDupes([]);
    try {
      const res = await fetch("/api/assessment/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId, emails: raw }),
      });
      const data = await res.json();

      const invalidFromServer: InvalidEmailEntry[] = Array.isArray(data.invalidEntries)
        ? data.invalidEntries
        : [];
      const ignoredFromServer: string[] = Array.isArray(data.ignoredDuplicates)
        ? data.ignoredDuplicates
        : [];

      if (!res.ok) {
        setLastInvalid(invalidFromServer);
        setLastIgnoredDupes(ignoredFromServer);
        toast.error(data.message || "Dispatch failed.");
        return;
      }

      setLastInvalid(invalidFromServer);
      setLastIgnoredDupes(ignoredFromServer);

      if (data.emailError) {
        toast.error(`Tokens saved, but email failed: ${String(data.emailError).slice(0, 220)}`);
      } else if (data.added > 0 && data.emailSkipped) {
        toast.warning(
          `Created ${data.added} link(s). Set SENDGRID_API_KEY / SendGridDevKey and MAIL_FROM to send emails.`
        );
      } else if (data.added === 0) {
        toast.info(
          data.message ||
            (data.skippedExisting
              ? `All ${data.skippedExisting} address(es) already have an invite for this test.`
              : "Nothing to add.")
        );
      } else {
        const extra =
          data.skippedExisting > 0 ? ` (${data.skippedExisting} duplicate(s) already on this test)` : "";
        toast.success(`Sent ${data.added} invitation(s)${extra}.`);
      }

      if (invalidFromServer.length > 0) {
        toast.warning(`${invalidFromServer.length} invalid address(es) were not invited — see below.`);
      }
      if (ignoredFromServer.length > 0 && data.added === 0) {
        toast.info(`${ignoredFromServer.length} duplicate line(s) in your list were skipped.`);
      }

      if (data.added > 0) {
        if (invalidFromServer.length > 0 || ignoredFromServer.length > 0) {
          sessionStorage.setItem(
            `dispatch-feedback-${testId}`,
            JSON.stringify({ invalid: invalidFromServer, ignored: ignoredFromServer })
          );
        }
        setRaw("");
        window.location.reload();
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-[#050505]/80 p-6 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <MailPlus className="h-5 w-5" />
        <h3 className="text-lg font-semibold text-white">Invite more students</h3>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed">
        Reuse this test for new batches. Paste up to <strong className="text-slate-300">500</strong> valid emails per
        request, or upload an <strong className="text-slate-300">Excel</strong> file (.xlsx / .xls). All readable cells
        are scanned (any column). Addresses already on this test are skipped. Invalid addresses are listed after you
        send — valid ones are still invited.
      </p>

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
          className="bg-white/5 border-white/10 text-white min-h-[200px] rounded-2xl font-mono text-sm p-4"
          disabled={loading}
        />
        <p className="text-xs text-slate-500">
          <span className="text-primary font-semibold">{validList.length}</span> unique valid address(es) will be
          invited
          {invalidLocal.length > 0 ? (
            <>
              {" "}
              · <span className="text-amber-400 font-semibold">{invalidLocal.length}</span> invalid (will be skipped)
            </>
          ) : null}
          {ignoredDuplicates.length > 0 ? (
            <>
              {" "}
              · <span className="text-slate-400">{ignoredDuplicates.length}</span> repeated in this list
            </>
          ) : null}
        </p>
      </div>

      {(lastInvalid.length > 0 || lastIgnoredDupes.length > 0) && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2 text-sm">
          {lastInvalid.length > 0 && (
            <>
              <p className="text-amber-200 font-medium">Invalid (not invited)</p>
              <ul className="max-h-40 overflow-y-auto text-xs text-amber-100/90 space-y-1 font-mono">
                {lastInvalid.map((x, i) => (
                  <li key={`${x.value}-${i}`}>
                    <span className="text-white">{x.value}</span>
                    <span className="text-slate-500"> — {x.reason}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {lastIgnoredDupes.length > 0 && (
            <p className="text-xs text-slate-400">
              Skipped as duplicate in your paste: {lastIgnoredDupes.slice(0, 12).join(", ")}
              {lastIgnoredDupes.length > 12 ? "…" : ""}
            </p>
          )}
        </div>
      )}

      <Button
        type="button"
        onClick={submit}
        disabled={loading || validList.length === 0}
        className="rounded-2xl font-bold bg-primary hover:bg-primary/90 text-black"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailPlus className="mr-2 h-4 w-4" />}
        Send invitations
      </Button>
    </section>
  );
}
