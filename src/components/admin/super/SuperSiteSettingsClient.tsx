"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, ExternalLink } from "lucide-react";

export type PracticeRow = {
  id: string;
  title: string;
  publicSlug: string;
  showOnHomepage: boolean;
  demoSortOrder: number;
};

type Props = {
  initialFreeLimit: number;
  initialTests: PracticeRow[];
};

export function SuperSiteSettingsClient({ initialFreeLimit, initialTests }: Props) {
  const [freeLimit, setFreeLimit] = useState<number>(initialFreeLimit);
  const [savingLimit, setSavingLimit] = useState(false);
  const [tests, setTests] = useState<PracticeRow[]>(initialTests);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function saveLimit() {
    setSavingLimit(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ freePracticeStartsPerWeek: freeLimit }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data.message === "string" ? data.message : "Save failed.");
        return;
      }
      toast.success("Weekly limit updated.");
    } catch {
      toast.error("Network error.");
    } finally {
      setSavingLimit(false);
    }
  }

  async function toggleHomepage(id: string, next: boolean) {
    setBusyId(id);
    const prev = tests;
    setTests((t) => t.map((row) => (row.id === id ? { ...row, showOnHomepage: next } : row)));
    try {
      const res = await fetch(`/api/admin/practice-tests/${encodeURIComponent(id)}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnHomepage: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setTests(prev);
        toast.error(typeof data.message === "string" ? data.message : "Update failed.");
        return;
      }
      toast.success(next ? "Now publicly visible." : "Hidden from public listings.");
    } catch {
      setTests(prev);
      toast.error("Network error.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-10 max-w-4xl">
      <PageHeader
        title="Site & practice"
        description="Set how many free practice sessions students can start per UTC week (0 = unlimited). Choose which practice packs are publicly visible on home and /available-tests."
        action={
          <Button asChild className="rounded-full">
            <Link href="/admin/practice-tests/create">
              <Plus className="mr-2 h-4 w-4" /> Add practice test
            </Link>
          </Button>
        }
      />

      <section className="rounded-3xl border border-white/10 bg-[#050505]/80 p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Free practice starts per week</h2>
          <p className="text-sm text-slate-500 mt-1">
            Counts each new practice session token (UTC week, Monday–Sunday). Resuming an in-progress session does not
            count. Use <span className="text-slate-400">0</span> for unlimited.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="space-y-2 flex-1 max-w-xs">
            <Label className="text-slate-400">Max new starts per student per week</Label>
            <Input
              type="number"
              min={0}
              step={1}
              value={freeLimit}
              onChange={(e) => setFreeLimit(Math.max(0, Number.parseInt(e.target.value, 10) || 0))}
              className="bg-white/5 border-white/10 text-white rounded-xl"
            />
          </div>
          <Button
            type="button"
            onClick={saveLimit}
            disabled={savingLimit}
            className="rounded-full px-8"
          >
            {savingLimit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save limit"}
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#050505]/80 p-8 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Homepage catalog</h2>
          <p className="text-sm text-slate-500 mt-1">
            Toggle which packs are publicly visible on the website (home + /available-tests). Sort order uses each
            test&apos;s <span className="text-slate-400">demo sort order</span> (edit in admin → Practice tests).
          </p>
        </div>

        <div className="space-y-0 divide-y divide-white/10">
          {tests.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">No practice tests yet. Create one to feature it here.</p>
          ) : (
            tests.map((t) => (
              <div
                key={t.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium text-white truncate">{t.title}</p>
                  <p className="text-xs font-mono text-slate-500 truncate">
                    /available-tests/{t.publicSlug}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Button variant="ghost" size="sm" asChild className="rounded-full text-slate-400">
                    <Link href={`/admin/practice-tests/${t.id}/edit`}>Edit content</Link>
                  </Button>
                  {t.publicSlug ? (
                    <Button variant="outline" size="sm" asChild className="rounded-full border-white/15">
                      <Link href={`/available-tests/${encodeURIComponent(t.publicSlug)}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> Preview
                      </Link>
                    </Button>
                  ) : null}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 whitespace-nowrap">Publicly visible</span>
                    <Switch
                      checked={t.showOnHomepage}
                      disabled={busyId === t.id}
                      onCheckedChange={(v) => toggleHomepage(t.id, v)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-xs text-slate-600">
          Manage all packs in{" "}
          <Link href="/admin/practice-tests" className="text-primary hover:underline">
            Admin → Practice tests
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
