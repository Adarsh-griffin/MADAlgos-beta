"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, UserRound } from "lucide-react";

interface TestProfileFormProps {
  token: string;
  defaultEmail: string;
  testTitle: string;
}

function normalizeEmail(s: string) {
  return s.trim().toLowerCase();
}

export function TestProfileForm({ token, defaultEmail, testTitle }: TestProfileFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (normalizeEmail(email) !== normalizeEmail(defaultEmail)) {
      toast.error("Email must match the address on your invite.");
      return;
    }
    if (fullName.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/assessment/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email: email.trim(),
          fullName: fullName.trim(),
          mobile: mobile.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data.message === "string" ? data.message : "Could not save your details.");
        return;
      }
      toast.success("Saved. Review the instructions, then start when you are ready.");
      router.refresh();
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-lg w-full p-10 rounded-[40px] bg-[#050505] border border-white/10 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <UserRound className="h-6 w-6" />
            <p className="text-xs font-bold uppercase tracking-widest">Before you begin</p>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{testTitle}</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enter the same email your invite was sent to, your name, and optional mobile. We create a MADAlgos learner
            account for that email (you can set a password later). Next you will see instructions and can start the
            timer.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-slate-400">Email (must match your invite)</Label>
            <Input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={defaultEmail}
              className="bg-white/5 border-white/10 text-white rounded-xl h-12"
            />
            <p className="text-[11px] text-slate-500">Invited as: {defaultEmail}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-400">Full name</Label>
            <Input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="As it should appear on results"
              className="bg-white/5 border-white/10 text-white rounded-xl h-12"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-400">Mobile (optional)</Label>
            <Input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 …"
              className="bg-white/5 border-white/10 text-white rounded-xl h-12"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-black"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit & continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
