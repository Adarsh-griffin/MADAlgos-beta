"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ActionMenu } from "@/components/admin/ActionMenu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type BlogRow = {
    id: number;
    title: string;
    authorName: string;
    status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";
    publishDate: string;
};

export default function BlogsPageClient({ initialBlogs }: { initialBlogs: BlogRow[] }) {
    const router = useRouter();
    const [blogs, setBlogs] = useState(initialBlogs);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<{
        id: number;
        action: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "UNPUBLISH" | "REMOVE";
    } | null>(null);
    const [isBusy, setIsBusy] = useState(false);

    const filteredBlogs = blogs.filter((b) => {
        const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.authorName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAction = async () => {
        if (!confirmAction) return;
        setIsBusy(true);

        try {
            if (confirmAction.action === "UNPUBLISH") {
                const res = await fetch("/api/admin/blogs/status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: confirmAction.id, status: "DRAFT" }),
                });
                if (!res.ok) throw new Error("Failed to unpublish blog");

                setBlogs(blogs.map(b => b.id === confirmAction.id ? { ...b, status: "DRAFT" } : b));
                toast.success("Blog unpublished (kept as draft)");
            } else if (confirmAction.action === "REMOVE") {
                const res = await fetch("/api/admin/blogs/remove", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: confirmAction.id }),
                });
                if (!res.ok) throw new Error("Failed to remove blog");
                setBlogs(blogs.filter(b => b.id !== confirmAction.id));
                toast.success("Blog removed from database");
            } else {
                const res = await fetch("/api/admin/blogs/status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: confirmAction.id, status: confirmAction.action }),
                });
                if (!res.ok) throw new Error("Failed to update status");

                setBlogs(
                    blogs.map((b) =>
                        b.id === confirmAction.id
                            ? { ...b, status: confirmAction.action as BlogRow["status"] }
                            : b
                    )
                );
                toast.success(`Blog ${confirmAction.action.toLowerCase()} successfully`);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsBusy(false);
            setConfirmOpen(false);
        }
    };

    const getActions = (blog: BlogRow) => {
        const actions = [];

        actions.push({ label: "Preview / Review", onClick: () => router.push(`/admin/blogs/${blog.id}`) });

        // Edit action
        actions.push({ label: "Edit", onClick: () => router.push(`/admin/blogs/${blog.id}/edit`) });

        if (blog.status !== "PUBLISHED") {
            actions.push({ label: "Publish", onClick: () => { setConfirmAction({ id: blog.id, action: "PUBLISHED" }); setConfirmOpen(true); } });
        } else {
            actions.push({ label: "Unpublish", onClick: () => { setConfirmAction({ id: blog.id, action: "UNPUBLISH" }); setConfirmOpen(true); } });
        }

        if (blog.status === "PENDING_REVIEW") {
            actions.push({ label: "Reject", onClick: () => { setConfirmAction({ id: blog.id, action: "REJECTED" }); setConfirmOpen(true); }, destructive: true });
        }

        actions.push({ label: "Remove (Delete from DB)", onClick: () => { setConfirmAction({ id: blog.id, action: "REMOVE" }); setConfirmOpen(true); }, destructive: true });

        return actions;
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Blog Management"
                description="Review, edit, and publish blogs written by Mentors or Admins."
                badge={`${blogs.length} Total Blogs`}
                backHref="/admin"
                backLabel="Dashboard"
                action={
                    <Button onClick={() => router.push('/admin/blogs/new')} className="rounded-full bg-primary text-black hover:bg-primary/90 flex gap-2">
                        <Plus className="h-4 w-4" /> Create Blog
                    </Button>
                }
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 rounded-full bg-[#050505]/80 border-white/10 text-white focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] rounded-full bg-[#050505]/80 border-white/10 text-white focus:ring-0">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10 text-white">
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                        <SelectItem value="DRAFT">Drafts</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DataTable
                headers={["Title", "Author", "Created", "Status", "Actions"]}
                rows={filteredBlogs.map(b => [
                    <span key="t" className="font-medium text-white max-w-[200px] md:max-w-[300px] truncate" title={b.title}>{b.title}</span>,
                    <span key="a" className="text-slate-300 truncate">{b.authorName}</span>,
                    <span key="d" className="text-slate-400">{new Date(b.publishDate).toLocaleDateString()}</span>,
                    <StatusBadge
                        key="s"
                        label={b.status}
                        tone={b.status === "PUBLISHED" ? "success" : b.status === "REJECTED" ? "danger" : b.status === "PENDING_REVIEW" ? "warning" : "default"}
                    />,
                    <ActionMenu key="x" actions={getActions(b)} />
                ])}
                emptyMessage={<div className="flex flex-col items-center justify-center space-y-3 py-10 text-slate-400">
                    <Search className="h-8 w-8 opacity-20" />
                    <p>No blogs found matching your criteria.</p>
                </div> as any}
            />

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title={
                    confirmAction?.action === "REMOVE"
                        ? "Remove Blog"
                        : confirmAction?.action === "UNPUBLISH"
                            ? "Unpublish Blog"
                            : confirmAction?.action === "PUBLISHED"
                                ? "Publish Blog"
                                : confirmAction?.action === "REJECTED"
                                    ? "Reject Blog"
                                    : "Update Blog"
                }
                description={
                    confirmAction?.action === "REMOVE"
                        ? "This will permanently remove the blog from the database. This cannot be undone."
                        : confirmAction?.action === "UNPUBLISH"
                            ? "This will remove the blog from the main website but keep it in the admin panel as draft."
                            : confirmAction?.action === "PUBLISHED"
                                ? "This will publish the blog on the main website."
                                : confirmAction?.action === "REJECTED"
                                    ? "This will reject the blog and keep it off the website."
                                    : "This will update the blog status."
                }
                onConfirm={handleAction}
                isBusy={isBusy}
                isDestructive={confirmAction?.action === "REMOVE" || confirmAction?.action === "REJECTED"}
                confirmText={
                    confirmAction?.action === "REMOVE"
                        ? "Remove"
                        : confirmAction?.action === "UNPUBLISH"
                            ? "Unpublish"
                            : confirmAction?.action === "PUBLISHED"
                                ? "Publish"
                                : confirmAction?.action === "REJECTED"
                                    ? "Reject"
                                    : "Confirm"
                }
            />
        </div>
    );
}
