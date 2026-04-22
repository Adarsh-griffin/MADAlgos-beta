"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
    ShieldCheck,
    Users,
    BookOpen,
    MessageSquareQuote,
    ListChecks,
    LogOut,
    GraduationCap,
    ShoppingBag,
    BarChart2,
    NotebookPen,
    Settings2,
} from "lucide-react";

export function AdminSidebar() {
    const pathname = usePathname();
    const [meRole, setMeRole] = React.useState<string | null>(null);

    React.useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((d) => setMeRole(d.user?.role ?? null))
            .catch(() => setMeRole(null));
    }, []);

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        window.location.href = "/auth";
    };

    const navItems: Array<{
        name: string;
        path: string;
        icon: typeof ListChecks;
        exact?: boolean;
        isActive?: (pathname: string) => boolean;
    }> = React.useMemo(() => {
        const base: Array<{
            name: string;
            path: string;
            icon: typeof ListChecks;
            exact?: boolean;
            isActive?: (pathname: string) => boolean;
        }> = [
            { name: "Requests Dashboard", path: "/admin", icon: ListChecks, exact: true },
            {
                name: "Assessments",
                path: "/admin/assessment",
                icon: ListChecks,
                isActive: (p) =>
                    p === "/admin/assessment" ||
                    p.startsWith("/admin/assessment/create") ||
                    p.startsWith("/admin/assessment/view"),
            },
            {
                name: "Assessment results",
                path: "/admin/assessment/results",
                icon: BarChart2,
                isActive: (p) => p.startsWith("/admin/assessment/results"),
            },
            {
                name: "Practice tests",
                path: "/admin/practice-tests",
                icon: NotebookPen,
                isActive: (p) =>
                    p === "/admin/practice-tests" ||
                    p.startsWith("/admin/practice-tests/create") ||
                    /^\/admin\/practice-tests\/[^/]+\/edit/.test(p),
            },
        ];
        if (meRole === "SUPER_ADMIN") {
            base.splice(4, 0, {
                name: "Site & practice",
                path: "/admin/super/site-settings",
                icon: Settings2,
                isActive: (p) => p.startsWith("/admin/super"),
            });
        }
        base.push(
            { name: "Order history", path: "/admin/orders", icon: ShoppingBag, exact: false },
            { name: "Mentors", path: "/admin/mentors", icon: Users, exact: false },
            { name: "Blogs", path: "/admin/blogs", icon: BookOpen, exact: false },
            { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquareQuote, exact: false },
            { name: "Students", path: "/admin/students", icon: GraduationCap, exact: false }
        );
        return base;
    }, [meRole]);

    return (
        <Sidebar variant="inset" collapsible="offcanvas" className="border-white/10">
            <SidebarHeader className="p-3">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">Admin Panel</p>
                        <p className="truncate text-[10px] uppercase tracking-[0.22em] text-slate-400">
                            MADAlgos Console
                        </p>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent className="px-2 py-2">
                <SidebarMenu>
                    {navItems.map((item) => {
                        const isActive = item.isActive
                            ? item.isActive(pathname)
                            : item.exact
                              ? pathname === item.path
                              : pathname.startsWith(item.path);

                        return (
                            <SidebarMenuItem key={`${item.path}-${item.name}`}>
                                <SidebarMenuButton asChild isActive={isActive}>
                                    <Link href={item.path}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter className="p-3">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2 rounded-2xl border-white/15 bg-transparent text-white hover:bg-white/5 transition-colors"
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
