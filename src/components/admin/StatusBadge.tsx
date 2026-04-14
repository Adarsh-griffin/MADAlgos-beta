import React from "react";

export type StatusBadgeTone = "default" | "success" | "warning" | "danger" | "info" | "primary";

export function StatusBadge({
    label,
    tone = "default",
}: {
    label: string;
    tone?: StatusBadgeTone;
}) {
    const base =
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]";
    const tones: Record<StatusBadgeTone, string> = {
        default: "bg-white/5 text-slate-200 border border-white/10",
        success: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
        warning: "bg-amber-500/10 text-amber-300 border border-amber-500/40",
        danger: "bg-red-500/10 text-red-300 border border-red-500/40",
        info: "bg-sky-500/10 text-sky-300 border border-sky-500/40",
        primary: "bg-primary/15 text-primary border border-primary/40",
    };
    return <span className={`${base} ${tones[tone]}`}>{label.replace(/_/g, " ")}</span>;
}
