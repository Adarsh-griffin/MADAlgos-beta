"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReuseAssessmentBatchButton } from "@/components/admin/assessment/ReuseAssessmentBatchDialog";
import { Pencil } from "lucide-react";

interface MonitorReuseBarProps {
  testId: string;
}

export function MonitorReuseBar({ testId }: MonitorReuseBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#050505]/60 px-4 py-3">
      <span className="text-xs text-slate-400 mr-1">Another college or cohort?</span>
      <ReuseAssessmentBatchButton sourceTestId={testId} />
      <Button asChild variant="outline" size="sm" className="rounded-full">
        <Link href={`/admin/assessment/create?fromTest=${encodeURIComponent(testId)}`}>
          <Pencil className="h-3.5 w-3.5 mr-1" /> Edit as new draft
        </Link>
      </Button>
    </div>
  );
}
