"use client";

import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AdminSidebar />
            <SidebarInset>
                {/* Top bar sticky area */}
                <div className="sticky top-0 z-20 w-full flex items-center justify-between gap-3 border-b border-white/5 bg-background/80 px-4 sm:px-6 lg:px-12 xl:px-14 py-3 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="text-white" />
                        <div className="min-w-0 hidden sm:block">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Administration
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-red-500/40 bg-red-500/10 text-red-200 hover:bg-red-500/20 hover:text-white transition-colors"
                            onClick={async () => {
                                try {
                                    await fetch("/api/auth/logout", { method: "POST" });
                                } catch {
                                    // ignore
                                } finally {
                                    window.location.href = "/auth";
                                }
                            }}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/5 transition-colors"
                            onClick={() => (window.location.href = "/")}
                        >
                            View site
                        </Button>
                    </div>
                </div>

                {/* Main content — wide on large screens (blog editor, tables, etc.) */}
                <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 md:py-10">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
