"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

export function LoginProgressToggle({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();

  return (
    <div
      className={
        className ??
        "flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-gray-400"
      }
    >
      <span className="text-[13px]">Login to track your progress</span>
      <button
        type="button"
        role="switch"
        aria-checked={false}
        onClick={() => router.push("/auth")}
        className="relative inline-flex cursor-pointer items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c14]"
        aria-label="Login to track progress"
      >
        <span className="sr-only">Login to track progress</span>
        <span className="h-5 w-9 rounded-full bg-white/10" aria-hidden />
        <span
          className="absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-white/40 transition-transform"
          aria-hidden
        />
      </button>
    </div>
  );
}

