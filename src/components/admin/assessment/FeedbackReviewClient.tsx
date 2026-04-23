"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";

type FeedbackRow = {
  id: string;
  email: string;
  rating: number;
  feedback: string;
  submitted: string;
  resolved: boolean;
};

export function FeedbackReviewClient({ initialRows }: { initialRows: FeedbackRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyBulk, setBusyBulk] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "resolved">("all");
  const [ratingFilter, setRatingFilter] = useState<"all" | "1" | "2" | "3" | "4" | "5">("all");
  const [emailQuery, setEmailQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  async function toggleResolved(id: string, next: boolean) {
    setBusyId(id);
    const prev = rows;
    setRows((list) => list.map((r) => (r.id === id ? { ...r, resolved: next } : r)));
    try {
      const res = await fetch(`/api/admin/assessment-feedback/${encodeURIComponent(id)}/resolve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRows(prev);
        toast.error(typeof data.message === "string" ? data.message : "Could not update feedback status.");
        return;
      }
      toast.success(next ? "Marked as resolved." : "Marked as unresolved.");
    } catch {
      setRows(prev);
      toast.error("Network error while updating feedback status.");
    } finally {
      setBusyId(null);
    }
  }

  const filteredRows = useMemo(() => {
    const q = emailQuery.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter === "open" && row.resolved) return false;
      if (statusFilter === "resolved" && !row.resolved) return false;
      if (ratingFilter !== "all" && row.rating !== Number(ratingFilter)) return false;
      if (q && !row.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, statusFilter, ratingFilter, emailQuery]);

  const visibleIds = useMemo(() => filteredRows.map((r) => r.id), [filteredRows]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));

  function toggleSelectOne(id: string, checked: boolean) {
    setSelectedIds((prev) => (checked ? [...new Set([...prev, id])] : prev.filter((v) => v !== id)));
  }

  function toggleSelectVisible(checked: boolean) {
    setSelectedIds((prev) => {
      if (checked) return [...new Set([...prev, ...visibleIds])];
      return prev.filter((id) => !visibleIds.includes(id));
    });
  }

  async function bulkMarkResolved() {
    if (selectedIds.length === 0) {
      toast.error("Select at least one feedback row.");
      return;
    }
    setBusyBulk(true);
    const prev = rows;
    setRows((list) => list.map((r) => (selectedIds.includes(r.id) ? { ...r, resolved: true } : r)));
    try {
      const res = await fetch("/api/admin/assessment-feedback/bulk-resolve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, resolved: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRows(prev);
        toast.error(typeof data.message === "string" ? data.message : "Bulk update failed.");
        return;
      }
      toast.success(`Marked ${selectedIds.length} feedback entr${selectedIds.length === 1 ? "y" : "ies"} resolved.`);
      setSelectedIds([]);
    } catch {
      setRows(prev);
      toast.error("Network error while applying bulk action.");
    } finally {
      setBusyBulk(false);
    }
  }

  const tableRows = filteredRows.map((row) => [
    <div key={`${row.id}-c`} className="flex items-center">
      <input
        type="checkbox"
        checked={selectedIds.includes(row.id)}
        onChange={(e) => toggleSelectOne(row.id, e.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-transparent"
      />
    </div>,
    <span key={`${row.id}-e`} className="text-slate-200 text-sm break-all">
      {row.email}
    </span>,
    <span key={`${row.id}-r`} className="text-white font-semibold">
      {row.rating}/5
    </span>,
    <span key={`${row.id}-f`} className="text-slate-300 text-sm leading-relaxed">
      {row.feedback}
    </span>,
    <span key={`${row.id}-s`} className="text-slate-400 text-xs whitespace-nowrap">
      {row.submitted}
    </span>,
    <div key={`${row.id}-st`} className="flex justify-end items-center gap-2">
      <StatusBadge label={row.resolved ? "Resolved" : "Open"} tone={row.resolved ? "success" : "warning"} />
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={busyId === row.id}
        onClick={() => toggleResolved(row.id, !row.resolved)}
        className="rounded-full border-white/15"
      >
        {row.resolved ? "Mark open" : "Issue resolved"}
      </Button>
    </div>,
  ]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[#050505]/70 p-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Search by email</label>
          <Input
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
            placeholder="student@email.com"
            className="bg-white/5 border-white/10 text-white rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "open" | "resolved")}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
          >
            <option value="all">All</option>
            <option value="open">Open only</option>
            <option value="resolved">Resolved only</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-[0.18em] text-slate-500">Star rating</label>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as "all" | "1" | "2" | "3" | "4" | "5")}
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white"
          >
            <option value="all">All ratings</option>
            <option value="5">5★</option>
            <option value="4">4★</option>
            <option value="3">3★</option>
            <option value="2">2★</option>
            <option value="1">1★</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-white/15"
            disabled={selectedIds.length === 0 || busyBulk}
            onClick={bulkMarkResolved}
          >
            {busyBulk ? "Updating…" : `Bulk mark resolved (${selectedIds.length})`}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={(e) => toggleSelectVisible(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-transparent"
          />
          Select all visible ({visibleIds.length})
        </label>
        <span>Showing {filteredRows.length} of {rows.length}</span>
      </div>

      <DataTable
        headers={["Select", "Student email", "Rating", "Feedback", "Submitted", "Action"]}
        rows={tableRows}
        emptyMessage="No feedback submitted yet."
      />
    </div>
  );
}
