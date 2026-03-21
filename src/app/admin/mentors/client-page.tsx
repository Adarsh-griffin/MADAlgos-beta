"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ActionMenu } from "@/components/admin/ActionMenu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { UserRole } from "@/lib/auth";

type MentorRow = {
    id: string;
    email: string;
    username: string | null;
    role: string;
    accountStatus: string;
    verificationStatus: string;
};

import { MentorProfileForm } from "@/components/admin/forms/MentorProfileForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function MentorsPageClient({
    initialMentors,
    initialLegacyMentors,
    currentUserRole,
}: {
    initialMentors: MentorRow[];
    initialLegacyMentors: LegacyMentorRow[];
    currentUserRole: string;
}) {
    const [mentors, setMentors] = useState(initialMentors);
    const [legacyMentors, setLegacyMentors] = useState(initialLegacyMentors);
    const [search, setSearch] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{ id: string; action: "APPROVE_APP" | "VERIFY" | "UNVERIFY" | "PROMOTE" | "REMOVE" } | null>(null);
    const [isBusy, setIsBusy] = useState(false);

    const [legacyConfirmOpen, setLegacyConfirmOpen] = useState(false);
    const [legacyConfirmAction, setLegacyConfirmAction] = useState<{ id: string; action: "PUBLISH" | "UNPUBLISH" | "REMOVE" } | null>(null);

    // Mentor Profile Modal State
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [loadedProfile, setLoadedProfile] = useState<{
        userId: string;
        email: string;
        username: string | null;
        headline: string;
        companies: string;
        location: string | null;
        skills: string[];
        linkedin: string | null;
        imageUrl: string | null;
        description: string;
    } | null>(null);

    const [rejectProfileOpen, setRejectProfileOpen] = useState(false);
    const [rejectProfileReason, setRejectProfileReason] = useState("");
    const [rejectProfileUserId, setRejectProfileUserId] = useState<string | null>(null);

    const filteredMentors = mentors.filter((m) => {
        const term = search.toLowerCase();
        return (m.username?.toLowerCase().includes(term) ?? false) ||
            (m.email.toLowerCase().includes(term));
    });

    const filteredLegacy = legacyMentors.filter((m) => {
        const term = search.toLowerCase();
        return m.name.toLowerCase().includes(term) || (m.linkedin?.toLowerCase().includes(term) ?? false);
    });

    const pendingApps = filteredMentors.filter((m) => m.accountStatus === "PENDING_APPLICATION");
    const verifiedMentors = filteredMentors.filter((m) => m.verificationStatus === "VERIFIED");
    const unverifiedMentors = filteredMentors.filter((m) => m.verificationStatus === "UNVERIFIED" && m.accountStatus !== "PENDING_APPLICATION");

    const handleAction = async () => {
        if (!confirmAction) return;
        setIsBusy(true);

        try {
            if (confirmAction.action === "APPROVE_APP") {
                const res = await fetch("/api/admin/mentors/approve", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: confirmAction.id }),
                });
                if (!res.ok) throw new Error("Failed to approve");
                const data = (await res.json()) as {
                    email?: { sent: boolean; reason?: string; detail?: string };
                };
                setMentors(mentors.map(m => m.id === confirmAction.id ? { ...m, role: "MENTOR", accountStatus: "ACTIVE" } : m));
                toast.success("Application approved");
                if (data.email && !data.email.sent) {
                    const hint =
                        data.email.reason === "missing_template_id"
                            ? "Set SENDGRID_MENTOR_ACCEPTED_TEMPLATE_ID on the server."
                            : data.email.reason === "no_api_key"
                              ? "Set SENDGRID_API_KEY or SendGridDevKey on the server."
                              : data.email.detail || "Check SendGrid logs / MAIL_FROM verification.";
                    toast.warning(`Acceptance email was not sent: ${hint}`, { duration: 8000 });
                }

            } else if (confirmAction.action === "VERIFY" || confirmAction.action === "UNVERIFY") {
                const isVerified = confirmAction.action === "VERIFY";
                const res = await fetch(`/api/admin/mentors?id=${encodeURIComponent(confirmAction.id)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ verified: isVerified }),
                });
                if (!res.ok) throw new Error("Failed to update verification");
                setMentors(mentors.map(m => m.id === confirmAction.id ? { ...m, verificationStatus: isVerified ? "VERIFIED" : "UNVERIFIED" } : m));
                toast.success(`Mentor ${isVerified ? "verified" : "unverified"} successfully`);

            } else if (confirmAction.action === "PROMOTE") {
                const res = await fetch("/api/admin/mentors/promote", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: confirmAction.id, role: "ADMIN" }),
                });
                if (!res.ok) throw new Error("Promotion failed");
                setMentors(mentors.map(m => m.id === confirmAction.id ? { ...m, role: "ADMIN" } : m));
                toast.success("Mentor promoted to Admin");

            } else if (confirmAction.action === "REMOVE") {
                const res = await fetch("/api/admin/mentors/remove", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: confirmAction.id }),
                });
                if (!res.ok) throw new Error("Failed to remove mentor");
                setMentors(mentors.filter((m) => m.id !== confirmAction.id));
                toast.success("Mentor removed from mentors listing and application queue");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsBusy(false);
            setConfirmOpen(false);
        }
    };

    const approveMentorProfile = async (userId: string) => {
        setIsBusy(true);
        try {
            const res = await fetch("/api/admin/mentors/profile/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Failed to approve profile");
            toast.success("Profile approved and synced. You can now publish this mentor.");
        } catch (e: any) {
            toast.error(e?.message || "Failed to approve profile");
        } finally {
            setIsBusy(false);
        }
    };

    const publishMentor = async (userId: string) => {
        setIsBusy(true);
        try {
            const res = await fetch("/api/admin/mentors/publish", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = (await res.json().catch(() => null)) as {
                error?: string;
                published?: boolean;
                email?: { sent: boolean; reason?: string; detail?: string };
            } | null;
            if (!res.ok) throw new Error(data?.error || "Failed to publish mentor");
            toast.success("Mentor published on the main website.");
            if (
                data?.published &&
                data?.email &&
                !data.email.sent &&
                data.email.reason !== "not_applicable"
            ) {
                const hint =
                    data.email.reason === "missing_template_id"
                        ? "Set SENDGRID_MENTOR_PROFILE_LIVE_TEMPLATE_ID on the server."
                        : data.email.reason === "no_api_key"
                          ? "Set SENDGRID_API_KEY or SendGridDevKey on the server."
                          : data.email.detail || "Check SendGrid / MAIL_FROM.";
                toast.warning(`Live notification email was not sent (${hint})`, { duration: 8000 });
            }
        } catch (e: any) {
            toast.error(e?.message || "Failed to publish mentor");
        } finally {
            setIsBusy(false);
        }
    };

    const rejectMentorProfile = async () => {
        if (!rejectProfileUserId) return;
        setIsBusy(true);
        try {
            const res = await fetch("/api/admin/mentors/profile/reject", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: rejectProfileUserId, reason: rejectProfileReason }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) throw new Error(data?.error || "Failed to reject profile");
            toast.success("Profile rejected. Mentor will see the message.");
            setRejectProfileOpen(false);
            setRejectProfileReason("");
            setRejectProfileUserId(null);
        } catch (e: any) {
            toast.error(e?.message || "Failed to reject profile");
        } finally {
            setIsBusy(false);
        }
    };

    const handleProfileUpdate = async (data: any) => {
        setIsBusy(true);
        try {
            const res = await fetch("/api/admin/mentors/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: data.userId,
                    headline: data.headline,
                    companies: data.companies,
                    location: data.location ?? null,
                    description: data.description,
                    skills: Array.isArray(data.skills) ? data.skills : [],
                    imageUrl: data.imageUrl ?? null,
                    linkedin: data.linkedin ?? null,
                }),
            });
            if (!res.ok) throw new Error("Update failed");

            toast.success("Profile updated and re-submitted for review");
            setProfileModalOpen(false);
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setIsBusy(false);
        }
    };

    const handleLegacyAction = async () => {
        if (!legacyConfirmAction) return;
        setIsBusy(true);

        try {
            if (legacyConfirmAction.action === "REMOVE") {
                const res = await fetch("/api/admin/legacy-mentors/remove", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: Number(legacyConfirmAction.id) }),
                });
                if (!res.ok) throw new Error("Failed to remove legacy mentor");
                setLegacyMentors(legacyMentors.filter((m) => m.id !== legacyConfirmAction.id));
                toast.success("Legacy mentor removed from database");
            } else {
                const res = await fetch("/api/admin/legacy-mentors/status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: Number(legacyConfirmAction.id), action: legacyConfirmAction.action }),
                });
                if (!res.ok) throw new Error("Failed to update legacy mentor");
                setLegacyMentors(
                    legacyMentors.map((m) =>
                        m.id === legacyConfirmAction.id
                            ? {
                                  ...m,
                                  isActive: legacyConfirmAction.action === "PUBLISH",
                                  approvalStatus: legacyConfirmAction.action === "PUBLISH" ? "APPROVED" : "UNPUBLISHED",
                                  isVerified: legacyConfirmAction.action === "PUBLISH",
                              }
                            : m
                    )
                );
                toast.success(
                    legacyConfirmAction.action === "PUBLISH"
                        ? "Legacy mentor published on main website"
                        : "Legacy mentor unpublished (kept in database)"
                );
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsBusy(false);
            setLegacyConfirmOpen(false);
        }
    };

    const getActions = (mentor: MentorRow) => {
        const actions = [];

        actions.push({
            label: "View / Edit Profile",
            onClick: async () => {
                setIsBusy(true);
                try {
                    const res = await fetch(`/api/admin/mentors/profile/get?userId=${encodeURIComponent(mentor.id)}`);
                    const data = await res.json().catch(() => null);
                    if (!res.ok) throw new Error(data?.error || "Failed to load profile");
                    setLoadedProfile({
                        userId: mentor.id,
                        email: data.user.email,
                        username: data.user.username,
                        headline: data.profile.headline,
                        companies: data.profile.companies,
                        location: data.profile.location,
                        skills: data.profile.skills,
                        linkedin: data.profile.linkedin,
                        imageUrl: data.profile.imageUrl,
                        description: data.profile.description,
                    });
                    setProfileModalOpen(true);
                } catch (e: any) {
                    toast.error(e?.message || "Failed to load profile");
                } finally {
                    setIsBusy(false);
                }
            }
        });

        if (mentor.accountStatus === "PENDING_APPLICATION") {
            actions.push({
                label: "Approve Application",
                onClick: () => { setConfirmAction({ id: mentor.id, action: "APPROVE_APP" }); setConfirmOpen(true); }
            });
        }

        if (mentor.accountStatus !== "PENDING_APPLICATION") {
            if (mentor.verificationStatus === "UNVERIFIED") {
                actions.push({
                    label: "Verify Mentor",
                    onClick: () => { setConfirmAction({ id: mentor.id, action: "VERIFY" }); setConfirmOpen(true); }
                });
            } else {
                actions.push({
                    label: "Unverify Mentor",
                    onClick: () => { setConfirmAction({ id: mentor.id, action: "UNVERIFY" }); setConfirmOpen(true); }
                });
            }
        }

        if (mentor.role === "MENTOR" && mentor.verificationStatus === "VERIFIED") {
            actions.push({
                label: "Approve & Publish / Unpublish Mentor",
                onClick: async () => {
                    await approveMentorProfile(mentor.id);
                    await publishMentor(mentor.id);
                },
            });
            actions.push({
                label: "Reject Profile (send message)",
                onClick: () => {
                    setRejectProfileUserId(mentor.id);
                    setRejectProfileReason("");
                    setRejectProfileOpen(true);
                },
                destructive: true,
            });
        }

        if (currentUserRole === "SUPER_ADMIN" && mentor.role !== "ADMIN" && mentor.role !== "SUPER_ADMIN" && mentor.accountStatus !== "PENDING_APPLICATION") {
            actions.push({
                label: "Promote to Admin",
                onClick: () => { setConfirmAction({ id: mentor.id, action: "PROMOTE" }); setConfirmOpen(true); }
            });
        }

        actions.push({
            label: "Remove Mentor",
            onClick: () => { setConfirmAction({ id: mentor.id, action: "REMOVE" }); setConfirmOpen(true); },
            destructive: true,
        });

        return actions;
    };

    return (
        <div className="space-y-12">
            <PageHeader
                title="Mentor Management"
                description="Verify mentors to display them publicly, approve new applications, and manage permissions. Legacy mentors from the old database are shown below for reference."
                badge={`${mentors.length} Accounts · ${legacyMentors.length} Legacy Mentors`}
                backHref="/admin"
                backLabel="Dashboard"
            />

            <div className="relative w-full max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-full bg-[#050505]/80 border-white/10 text-white focus-visible:ring-primary focus-visible:ring-offset-0"
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Pending Applications <span className="text-amber-400 text-sm ml-2">({pendingApps.length})</span></h2>
                <DataTable
                    headers={["Contact", "Status", "Role", "Actions"]}
                    rows={pendingApps.map(m => [
                        <div key="c" className="flex flex-col">
                            <span className="font-medium text-white">{m.username || "No Name"}</span>
                            <span className="text-[11px] text-slate-400">{m.email}</span>
                        </div>,
                        <StatusBadge key="s" label={m.accountStatus} tone="warning" />,
                        <StatusBadge key="r" label={m.role} tone="default" />,
                        <ActionMenu key="x" actions={getActions(m)} />
                    ])}
                    emptyMessage="No pending mentor applications."
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Unverified Mentors <span className="text-slate-400 text-sm ml-2">({unverifiedMentors.length})</span></h2>
                <DataTable
                    headers={["Contact", "Status", "Role", "Actions"]}
                    rows={unverifiedMentors.map(m => [
                        <div key="c" className="flex flex-col">
                            <span className="font-medium text-white">{m.username || "No Name"}</span>
                            <span className="text-[11px] text-slate-400">{m.email}</span>
                        </div>,
                        <StatusBadge key="s" label={m.verificationStatus} tone="default" />,
                        <StatusBadge key="r" label={m.role} tone={m.role === "ADMIN" ? "success" : "default"} />,
                        <ActionMenu key="x" actions={getActions(m)} />
                    ])}
                    emptyMessage="All active mentors are verified."
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Verified Mentors <span className="text-emerald-400 text-sm ml-2">({verifiedMentors.length})</span></h2>
                <DataTable
                    headers={["Contact", "Status", "Role", "Actions"]}
                    rows={verifiedMentors.map(m => [
                        <div key="c" className="flex flex-col">
                            <span className="font-medium text-white">{m.username || "No Name"}</span>
                            <span className="text-[11px] text-slate-400">{m.email}</span>
                        </div>,
                        <StatusBadge key="s" label={m.verificationStatus} tone="success" />,
                        <StatusBadge key="r" label={m.role} tone={m.role === "ADMIN" || m.role === "SUPER_ADMIN" ? "success" : "default"} />,
                        <ActionMenu key="x" actions={getActions(m)} />
                    ])}
                    emptyMessage="No mentors have been verified yet."
                />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                    Legacy Mentors (Existing Database){" "}
                    <span className="text-slate-400 text-sm ml-2">({filteredLegacy.length})</span>
                </h2>
                <DataTable
                    headers={["Mentor", "LinkedIn", "Status", "Active", "Actions"]}
                    rows={filteredLegacy.map(m => [
                        <span key="n" className="font-medium text-white">{m.name}</span>,
                        m.linkedin ? (
                            <a
                                key="l"
                                href={m.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-400 hover:underline truncate"
                            >
                                {m.linkedin}
                            </a>
                        ) : (
                            <span key="l" className="text-slate-500">—</span>
                        ),
                        <StatusBadge
                            key="s"
                            label={m.isVerified ? "VERIFIED" : (m.approvalStatus || "UNVERIFIED")}
                            tone={m.isVerified ? "success" : "warning"}
                        />,
                        <StatusBadge
                            key="a"
                            label={m.isActive ? "ACTIVE" : "INACTIVE"}
                            tone={m.isActive ? "success" : "danger"}
                        />,
                        <ActionMenu
                            key="x"
                            actions={[
                                {
                                    label: m.isActive ? "Unpublish (keep in DB)" : "Publish (make visible)",
                                    onClick: () => {
                                        setLegacyConfirmAction({
                                            id: m.id,
                                            action: m.isActive ? "UNPUBLISH" : "PUBLISH",
                                        });
                                        setLegacyConfirmOpen(true);
                                    },
                                },
                                {
                                    label: "Remove legacy mentor",
                                    onClick: () => {
                                        setLegacyConfirmAction({ id: m.id, action: "REMOVE" });
                                        setLegacyConfirmOpen(true);
                                    },
                                    destructive: true,
                                },
                            ]}
                        />,
                    ])}
                    emptyMessage="No legacy mentors match your search."
                />
                <p className="text-xs text-slate-500">
                    These are mentors from the old `mentors` collection. They may not have login accounts in the new system yet.
                </p>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={
                    confirmAction?.action === "PROMOTE" ? "Promote to Admin" :
                        confirmAction?.action === "REMOVE" ? "Remove Mentor" :
                            confirmAction?.action === "APPROVE_APP" ? "Approve Application" :
                                confirmAction?.action === "VERIFY" ? "Verify Mentor" : "Unverify Mentor"
                }
                description={
                    confirmAction?.action === "PROMOTE" ? "This will grant the user admin privileges, allowing them to moderate content." :
                        confirmAction?.action === "REMOVE" ? "Are you sure you want to permanently remove this mentor?" :
                            confirmAction?.action === "APPROVE_APP" ? "This will activate their account and allow them to log in as a mentor." :
                                confirmAction?.action === "VERIFY" ? "This mentor will become visible to students on the public site." :
                                    "This mentor will be hidden from the public site."
                }
                onConfirm={handleAction}
                isBusy={isBusy}
                isDestructive={confirmAction?.action === "REMOVE"}
                confirmText={
                    confirmAction?.action === "PROMOTE" ? "Yes, Promote" :
                        confirmAction?.action === "REMOVE" ? "Yes, Remove" :
                            confirmAction?.action === "APPROVE_APP" ? "Approve" :
                                confirmAction?.action === "VERIFY" ? "Verify" : "Unverify"
                }
            />

            <ConfirmDialog
                open={legacyConfirmOpen}
                onOpenChange={setLegacyConfirmOpen}
                title={
                    legacyConfirmAction?.action === "REMOVE"
                        ? "Remove legacy mentor"
                        : legacyConfirmAction?.action === "PUBLISH"
                        ? "Publish legacy mentor"
                        : "Unpublish legacy mentor"
                }
                description={
                    legacyConfirmAction?.action === "REMOVE"
                        ? "This will permanently remove the legacy mentor from the database. This cannot be undone."
                        : legacyConfirmAction?.action === "PUBLISH"
                        ? "This will make the legacy mentor visible on the public website."
                        : "This will hide the legacy mentor from the public website but keep them in the database."
                }
                onConfirm={handleLegacyAction}
                isBusy={isBusy}
                isDestructive={legacyConfirmAction?.action === "REMOVE"}
                confirmText={
                    legacyConfirmAction?.action === "REMOVE"
                        ? "Remove"
                        : legacyConfirmAction?.action === "PUBLISH"
                        ? "Publish"
                        : "Unpublish"
                }
            />

            <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
                <DialogContent className="bg-[#050505] border-white/10 text-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Mentor Profile</DialogTitle>
                    </DialogHeader>
                    {loadedProfile && (
                        <MentorProfileForm
                            initialData={{
                                userId: loadedProfile.userId,
                                username: loadedProfile.username,
                                email: loadedProfile.email,
                                headline: loadedProfile.headline,
                                companies: loadedProfile.companies,
                                location: loadedProfile.location,
                                skills: loadedProfile.skills,
                                linkedin: loadedProfile.linkedin,
                                imageUrl: loadedProfile.imageUrl,
                                description: loadedProfile.description,
                            }}
                            onSave={handleProfileUpdate}
                            onCancel={() => setProfileModalOpen(false)}
                            isBusy={isBusy}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={rejectProfileOpen} onOpenChange={setRejectProfileOpen}>
                <DialogContent className="bg-[#050505] border-white/10 text-white max-w-lg w-full">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Reject mentor profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <p className="text-sm text-slate-400">
                            Write a short reason. The mentor will see this in their dashboard.
                        </p>
                        <Textarea
                            value={rejectProfileReason}
                            onChange={(e) => setRejectProfileReason(e.target.value)}
                            rows={5}
                            placeholder="e.g. Please add location and update skills list with specific topics."
                            className="rounded-2xl border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500"
                        />
                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/5"
                                onClick={() => setRejectProfileOpen(false)}
                                disabled={isBusy}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="rounded-full bg-red-500 text-white hover:bg-red-500/90"
                                onClick={rejectMentorProfile}
                                disabled={isBusy || rejectProfileReason.trim().length < 3}
                            >
                                Reject &amp; notify
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

type LegacyMentorRow = {
    id: string;
    name: string;
    linkedin: string | null;
    isVerified: boolean;
    approvalStatus: string;
    isActive: boolean;
};
