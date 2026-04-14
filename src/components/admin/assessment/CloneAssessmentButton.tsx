"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CloneAssessmentButtonProps {
  testId: string;
  className?: string;
}

/** Duplicates the assessment (same questions, fresh invites) and opens the monitor page for the new test. */
export function CloneAssessmentButton({ testId, className }: CloneAssessmentButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/assessment/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceTestId: testId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data.message === "string" ? data.message : "Could not duplicate assessment.");
        return;
      }
      toast.success("New assessment created — paste the next college’s emails below.");
      if (data.testId) {
        router.push(`/admin/assessment/view/${data.testId}`);
      } else {
        router.refresh();
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className={className ?? "rounded-full"}
      disabled={busy}
      onClick={onClick}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4 mr-1" />}
      Reuse for new batch
    </Button>
  );
}
