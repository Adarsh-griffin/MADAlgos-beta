"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, GraduationCap, LogOut } from "lucide-react";
import Link from "next/link";

export default function StudentTopBar() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-20 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-12 xl:px-14">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-2 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">Back</span>
          </Button>
          <div className="hidden items-center gap-2 text-primary sm:flex">
            <GraduationCap className="h-5 w-5 shrink-0" aria-hidden />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/5"
            asChild
          >
            <Link href="/">
              <ExternalLink className="mr-2 h-4 w-4" />
              Main site
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full border-red-500/40 bg-red-500/10 text-red-200 hover:bg-red-500/20 hover:text-white"
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", { method: "POST" });
              } catch {
                // ignore
              } finally {
                router.push("/auth");
              }
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
