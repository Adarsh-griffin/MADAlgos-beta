"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ActionMenu } from "@/components/admin/ActionMenu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";

export type TestimonialRow = {
    id: string;
    name: string;
    role: string;
    status: "PENDING" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "LEGACY";
    createdAt: string;
};

import { Plus, Search } from "lucide-react";
import { TestimonialForm } from "@/components/admin/forms/TestimonialForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TestimonialsPageClient({
    initialTestimonials,
    legacyTestimonials,
}: {
    initialTestimonials: TestimonialRow[];
    legacyTestimonials: TestimonialRow[];
}) {
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [legacy] = useState(legacyTestimonials);
    const [search, setSearch] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ id: string; action: "APPROVED" | "REJECTED" | "DELETE" } | null>(null);
    const [isBusy, setIsBusy] = useState(false);

    // Testimonial Form Modal State
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<Partial<TestimonialRow> | null>(null);

    const filteredTestimonials = testimonials.filter((t) => {
        const term = search.toLowerCase();
        return t.name.toLowerCase().includes(term) || t.role.toLowerCase().includes(term);
    });

    const filteredLegacy = legacy.filter((t) => {
        const term = search.toLowerCase();
        return t.name.toLowerCase().includes(term) || t.role.toLowerCase().includes(term);
    });

    const pendingTestimonials = filteredTestimonials.filter(t => t.status !== "APPROVED" && t.status !== "REJECTED");
    const approvedTestimonials = filteredTestimonials.filter(t => t.status === "APPROVED");
    const rejectedTestimonials = filteredTestimonials.filter(t => t.status === "REJECTED");

    const handleAction = async () => {
        if (!confirmAction) return;
        setIsBusy(true);

        try {
            if (confirmAction.action === "DELETE") {
                // Implement DELETE logic API call here later
                setTestimonials(testimonials.filter(t => t.id !== confirmAction.id));
                toast.success("Testimonial deleted successfully");
            } else {
                const res = await fetch("/api/admin/testimonials/status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: confirmAction.id, status: confirmAction.action }),
                });
                if (!res.ok) throw new Error("Failed to update status");

                setTestimonials(testimonials.map(t => t.id === confirmAction.id ? { ...t, status: confirmAction.action as any } : t));
                toast.success(`Testimonial ${confirmAction.action.toLowerCase()} successfully`);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsBusy(false);
            setConfirmOpen(false);
        }
    };

    const handleFormSave = async (data: any) => {
        setIsBusy(true);
        try {
            const res = await fetch("/api/admin/testimonials/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Save failed");

            const result = await res.json();

            if (data.id) {
                setTestimonials(testimonials.map(t => t.id === data.id ? { ...t, ...data } : t));
                toast.success("Testimonial updated");
            } else {
                setTestimonials([{ id: result.id, status: "PENDING", createdAt: new Date().toISOString(), ...data }, ...testimonials]);
                toast.success("Testimonial created");
            }

            setFormModalOpen(false);
        } catch (error) {
            toast.error("Failed to save testimonial");
        } finally {
            setIsBusy(false);
        }
    };

    const openCreateModal = () => {
        setSelectedTestimonial(null);
        setFormModalOpen(true);
    };

    const getActions = (testimonial: TestimonialRow) => {
        if (testimonial.status === "LEGACY") return [];
        const actions = [];

        actions.push({
            label: "Edit",
            onClick: () => { setSelectedTestimonial(testimonial); setFormModalOpen(true); }
        });

        if (testimonial.status !== "APPROVED") {
            actions.push({
                label: "Approve",
                onClick: () => { setConfirmAction({ id: testimonial.id, action: "APPROVED" }); setConfirmOpen(true); }
            });
        }

        if (testimonial.status !== "REJECTED") {
            actions.push({
                label: "Reject",
                onClick: () => { setConfirmAction({ id: testimonial.id, action: "REJECTED" }); setConfirmOpen(true); },
                destructive: true
            });
        }

        actions.push({
            label: "Delete",
            onClick: () => { setConfirmAction({ id: testimonial.id, action: "DELETE" }); setConfirmOpen(true); },
            destructive: true
        });

        return actions;
    };

    return (
        <div className="space-y-12">
            <PageHeader
                title="Testimonial Management"
                description="Review and approve user testimonials before they appear on the homepage."
                badge={`${testimonials.length} Total Records`}
                backHref="/admin"
                backLabel="Dashboard"
                action={
                    <Button onClick={openCreateModal} className="rounded-full bg-primary text-black hover:bg-primary/90 flex gap-2">
                        <Plus className="h-4 w-4" /> Create Testimonial
                    </Button>
                }
            />

            <div className="relative w-full max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    type="text"
                    placeholder="Search by author or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-full bg-[#050505]/80 border-white/10 text-white focus-visible:ring-primary focus-visible:ring-offset-0"
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Pending Review <span className="text-amber-400 text-sm ml-2">({pendingTestimonials.length})</span></h2>
                <DataTable
                    headers={["Author", "Role", "Submitted", "Status", "Actions"]}
                    rows={pendingTestimonials.map(t => [
                        <span key="n" className="font-medium text-white">{t.name}</span>,
                        <span key="r" className="text-slate-300 truncate max-w-[200px]">{t.role}</span>,
                        <span key="d" className="text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</span>,
                        <StatusBadge key="s" label={t.status} tone="warning" />,
                        <ActionMenu key="x" actions={getActions(t)} />
                    ])}
                    emptyMessage="No pending testimonials."
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Approved Testimonials <span className="text-emerald-400 text-sm ml-2">({approvedTestimonials.length})</span></h2>
                <DataTable
                    headers={["Author", "Role", "Submitted", "Status", "Actions"]}
                    rows={approvedTestimonials.map(t => [
                        <span key="n" className="font-medium text-white">{t.name}</span>,
                        <span key="r" className="text-slate-300 truncate max-w-[200px]">{t.role}</span>,
                        <span key="d" className="text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</span>,
                        <StatusBadge key="s" label={t.status} tone="success" />,
                        <ActionMenu key="x" actions={getActions(t)} />
                    ])}
                    emptyMessage="No approved testimonials."
                />
            </div>

            {rejectedTestimonials.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Rejected <span className="text-red-400 text-sm ml-2">({rejectedTestimonials.length})</span></h2>
                    <DataTable
                        headers={["Author", "Role", "Submitted", "Status", "Actions"]}
                        rows={rejectedTestimonials.map(t => [
                            <span key="n" className="font-medium text-white">{t.name}</span>,
                            <span key="r" className="text-slate-300 truncate max-w-[200px]">{t.role}</span>,
                            <span key="d" className="text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</span>,
                            <StatusBadge key="s" label={t.status} tone="danger" />,
                            <ActionMenu key="x" actions={getActions(t)} />
                        ])}
                        emptyMessage="No rejected testimonials."
                    />
                </div>
            )}

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                    Legacy Testimonials (Existing Website){" "}
                    <span className="text-slate-400 text-sm ml-2">({filteredLegacy.length})</span>
                </h2>
                <DataTable
                    headers={["Author", "Role", "Source"]}
                    rows={filteredLegacy.map(t => [
                        <span key="n" className="font-medium text-white">{t.name}</span>,
                        <span key="r" className="text-slate-300 truncate max-w-[320px]">{t.role}</span>,
                        <StatusBadge key="s" label="LEGACY" tone="default" />,
                    ])}
                    emptyMessage="No legacy testimonials match your search."
                />
                <p className="text-xs text-slate-500">
                    These are the existing hardcoded testimonials used on the public site as fallback.
                </p>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={
                    confirmAction?.action === "DELETE" ? "Delete Testimonial" :
                        confirmAction?.action === "APPROVED" ? "Approve Testimonial" : "Reject Testimonial"
                }
                description={
                    confirmAction?.action === "DELETE" ? "Are you sure you want to permanently delete this testimonial? This action cannot be undone." :
                        confirmAction?.action === "APPROVED" ? "This will make the testimonial visible on the public homepage." :
                            "This will hide the testimonial from the public site."
                }
                onConfirm={handleAction}
                isBusy={isBusy}
                isDestructive={confirmAction?.action === "DELETE" || confirmAction?.action === "REJECTED"}
                confirmText={
                    confirmAction?.action === "DELETE" ? "Delete" :
                        confirmAction?.action === "APPROVED" ? "Approve" : "Reject"
                }
            />

            <Dialog open={formModalOpen} onOpenChange={setFormModalOpen}>
                <DialogContent className="bg-[#050505] border-white/10 text-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{selectedTestimonial ? "Edit Testimonial" : "Create Testimonial"}</DialogTitle>
                    </DialogHeader>
                    <TestimonialForm
                        initialData={selectedTestimonial as any || {}}
                        onSave={handleFormSave}
                        onCancel={() => setFormModalOpen(false)}
                        isBusy={isBusy}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
