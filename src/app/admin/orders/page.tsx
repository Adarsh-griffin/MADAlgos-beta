import React from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminOrderHistory } from "@/lib/admin-orders";

export const metadata = {
  title: "Order history | Admin | MADAlgos",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  const orders = await getAdminOrderHistory(300);

  const rows = orders.map((o) => [
    <span key="d" className="text-slate-300 whitespace-nowrap">
      {o.paymentRecordedAt ? new Date(o.paymentRecordedAt).toLocaleString() : "—"}
    </span>,
    <span key="t" className="font-medium text-white uppercase">
      {o.type === "mock" ? "Mock" : "Mentorship"}
    </span>,
    <div key="u" className="min-w-0">
      <div className="text-white truncate max-w-[200px]" title={o.userEmail}>
        {o.userEmail}
      </div>
      {o.userName ? (
        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">{o.userName}</div>
      ) : null}
    </div>,
    o.bookingConfirmed ? (
      <StatusBadge key="b" label={o.bookingStatus ?? "CONFIRMED"} tone="success" />
    ) : (
      <StatusBadge key="b" label="Payment only" tone="warning" />
    ),
    <div key="p" className="font-mono text-[10px] text-slate-400 break-all max-w-[140px]">
      {o.paymentId}
    </div>,
    o.type === "mentorship" ? (
      <span key="m" className="text-slate-300 text-xs">
        {o.assignedMentorLabel ?? "— Unassigned (admin)"}
      </span>
    ) : (
      <span key="m" className="text-slate-600">
        —
      </span>
    ),
    <span key="s" className="text-slate-400 text-xs leading-snug line-clamp-3">
      {o.summary}
    </span>,
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Order history"
        description="Razorpay payments and confirmed bookings (mock interviews & mentorship). Mentorship mentors are assigned by the admin team when not shown."
      />
      <DataTable
        headers={["When", "Type", "Customer", "Booking", "Payment ID", "Mentor", "Details"]}
        rows={rows}
        emptyMessage="No payments recorded yet."
      />
    </div>
  );
}
