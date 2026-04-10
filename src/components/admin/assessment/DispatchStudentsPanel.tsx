"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, MailPlus } from "lucide-react";

function countValidEmails(raw: string): number {
  const seen = new Set<string>();
  let n = 0;
  for (const p of raw.split(/[\n,;]+/)) {
    const e = p.trim().toLowerCase();
    if (!e.includes("@") || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) continue;
    if (seen.has(e)) continue;
    seen.add(e);
    n++;
  }
  return n;
}

export function DispatchStudentsPanel({ testId }: { testId: string }) {
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);

  const count = useMemo(() => countValidEmails(raw), [raw]);

  const submit = async () => {
    if (count === 0) {
      toast.error("Paste at least one valid email (one per line, or comma-separated).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/assessment/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId, emails: raw }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Dispatch failed.");
        return;
      }

      if (data.emailError) {
        toast.error(
          `Tokens saved, but email failed: ${String(data.emailError).slice(0, 220)}`
        );
      } else if (data.added > 0 && data.emailSkipped) {
        toast.warning(
          `Created ${data.added} link(s). Set SENDGRID_API_KEY / SendGridDevKey and MAIL_FROM to send emails.`
        );
      } else if (data.added === 0) {
        toast.message(
          data.message ||
            (data.skippedExisting
              ? `All ${data.skippedExisting} address(es) already have an invite for this test.`
              : "Nothing to add.")
        );
      } else {
        const extra =
          data.skippedExisting > 0
            ? ` (${data.skippedExisting} duplicate(s) skipped)`
            : "";
        toast.success(`Sent ${data.added} invitation(s)${extra}.`);
      }

      setRaw("");
      if (data.added > 0 || data.skippedExisting > 0) {
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
        Reuse this test for new batches. Paste up to <strong className="text-slate-300">500</strong> emails per
        request (newlines, commas, or semicolons). Addresses already on this test are skipped automatically.
      </p>
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
          <span className="text-primary font-semibold">{count}</span> unique valid address(es) detected
        </p>
      </div>
      <Button
        type="button"
        onClick={submit}
        disabled={loading || count === 0}
        className="rounded-2xl font-bold bg-primary hover:bg-primary/90 text-black"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailPlus className="mr-2 h-4 w-4" />}
        Send invitations
      </Button>
    </section>
  );
}
