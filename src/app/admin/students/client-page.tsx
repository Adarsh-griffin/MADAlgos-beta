"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ActionMenu } from "@/components/admin/ActionMenu";
import { Input } from "@/components/ui/input";
import { Search, Mail, ExternalLink, Copy } from "lucide-react";

type StudentRow = {
  id: string;
  email: string;
  username: string | null;
  mobile: string | null;
  enrolledCourse: string | null;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
  mockBookingCount: number;
  mentorshipBookingCount: number;
  authProvider: string | null;
};

function mailtoHref(email: string, subject: string, body?: string) {
  const p = new URLSearchParams();
  p.set("subject", subject);
  if (body) p.set("body", body);
  return `mailto:${encodeURIComponent(email)}?${p.toString()}`;
}

function gmailComposeHref(email: string, subject: string) {
  const qs = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: email,
    su: subject,
  });
  return `https://mail.google.com/mail/?${qs.toString()}`;
}

export default function StudentsPageClient({
  initialStudents,
}: {
  initialStudents: StudentRow[];
}) {
  const [students] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredStudents = students.filter((s) => {
    const term = search.toLowerCase();
    const matchesSearch =
      (s.username?.toLowerCase().includes(term) ?? false) ||
      s.email.toLowerCase().includes(term) ||
      (s.mobile?.toLowerCase().includes(term) ?? false) ||
      (s.enrolledCourse?.toLowerCase().includes(term) ?? false);
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.alert("Could not copy.");
    }
  };

  const getActions = (student: StudentRow) => {
    const subject = "MADAlgos — hello";
    const body = `Hi ${student.username || "there"},\n\n\nRegards,\nMADAlgos team`;
    const actions: { label: string; onClick: () => void; destructive?: boolean }[] = [
      {
        label: "Copy email",
        onClick: () => copy(student.email),
      },
      {
        label: "Open mailto",
        onClick: () => {
          window.location.href = mailtoHref(student.email, subject, body);
        },
      },
      {
        label: "Compose in Gmail",
        onClick: () => {
          window.open(gmailComposeHref(student.email, subject), "_blank", "noopener,noreferrer");
        },
      },
    ];

    if (student.status !== "SUSPENDED") {
      actions.push({
        label: "Suspend account",
        onClick: () => {
          window.alert(`Suspend not wired yet. Target: ${student.email}`);
        },
        destructive: true,
      });
    }

    return actions;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student directory"
        description="View students, contact channels, and purchase activity. Use mail links to draft outreach."
        badge={`${students.length} total students`}
        backHref="/admin"
        backLabel="Dashboard"
      />

      <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search name, email, phone, course…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-full bg-[#050505]/80 border-white/10 text-white focus-visible:ring-primary focus-visible:ring-offset-0"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-10 w-full sm:w-[180px] rounded-full border border-white/10 bg-[#050505]/80 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">New (pending)</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      <DataTable
        headers={[
          "Student",
          "Email & actions",
          "Phone",
          "Course / program",
          "Purchases",
          "Joined",
          "Last login",
          "Status",
          "Menu",
        ]}
        rows={filteredStudents.map((s) => [
          <span key="n" className="font-medium text-white">
            {s.username || "—"}
          </span>,
          <div key="e" className="flex flex-col gap-1.5 min-w-0 max-w-[min(100%,320px)]">
            <span className="truncate text-slate-300 text-sm" title={s.email}>
              {s.email}
            </span>
            <div className="flex flex-wrap gap-1">
              <a
                href={mailtoHref(s.email, "MADAlgos — hello")}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary hover:bg-white/10"
              >
                <Mail className="h-3 w-3" />
                Mailto
              </a>
              <a
                href={gmailComposeHref(s.email, "MADAlgos — hello")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300 hover:bg-white/10"
              >
                <ExternalLink className="h-3 w-3" />
                Gmail
              </a>
              <button
                type="button"
                onClick={() => copy(s.email)}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 hover:bg-white/10"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
          </div>,
          <span key="p" className="text-slate-400 text-sm whitespace-nowrap">
            {s.mobile || "—"}
          </span>,
          <span key="c" className="text-slate-300 text-sm">
            {s.enrolledCourse || "—"}
          </span>,
          <span key="pur" className="text-slate-400 text-sm">
            Mock {s.mockBookingCount} · Mentorship {s.mentorshipBookingCount}
          </span>,
          <span key="d" className="text-slate-400 text-sm whitespace-nowrap">
            {new Date(s.createdAt).toLocaleDateString()}
          </span>,
          <span key="ll" className="text-slate-400 text-sm whitespace-nowrap">
            {s.lastLoginAt ? new Date(s.lastLoginAt).toLocaleString() : "—"}
          </span>,
          <StatusBadge
            key="s"
            label={s.status}
            tone={s.status === "ACTIVE" ? "success" : s.status === "SUSPENDED" ? "danger" : "warning"}
          />,
          <ActionMenu key="x" actions={getActions(s)} />,
        ])}
        emptyMessage="No students match your filters."
      />
    </div>
  );
}
