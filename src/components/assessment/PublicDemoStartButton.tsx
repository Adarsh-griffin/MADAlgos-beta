"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  className?: string;
};

export function PublicDemoStartButton({ slug, className }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assessment/public-demo/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
        url?: string;
      };
      if (!res.ok) {
        setError(data.message || "Could not start the test.");
        return;
      }
      if (data.url) {
        router.push(data.url);
        return;
      }
      setError("Unexpected response.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={start}
        disabled={loading}
        className={cn(
          "inline-flex justify-center items-center w-full sm:w-auto rounded-xl py-3.5 px-10 min-w-[200px]",
          "bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-[0.22em]",
          "shadow-[0_14px_48px_rgba(20,184,166,0.28)] hover:brightness-110 transition-all",
          "disabled:opacity-70 disabled:pointer-events-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          className
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
            Starting…
          </>
        ) : (
          "Start test"
        )}
      </button>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
