"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MCQBuilder, type MCQ } from "@/components/admin/assessment/MCQBuilder";
import { CodingProblemBuilder, type CodingProblem } from "@/components/admin/assessment/CodingProblemBuilder";
import { toast } from "sonner";
import { Send, Loader2, ListChecks, Code2, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(90);
  const [validity, setValidity] = useState(24);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [emails, setEmails] = useState("");

  const handleSubmit = async () => {
    if (!title || (!mcqs.length && !problems.length)) {
      toast.error("Please fill in all required fields and add at least one question.");
      return;
    }

    setLoading(true);
    try {
      const studentEmails = emails
        .split(/[\n,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.includes("@") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
      const seen = new Set<string>();
      const unique = studentEmails.filter((e) => (seen.has(e) ? false : (seen.add(e), true)));

      const res = await fetch("/api/assessment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          duration,
          linkValidity: validity,
          mcqs,
          codingProblems: problems,
          emails: unique,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.emailError) {
          toast.error(
            `Test saved, but email failed: ${typeof data.emailError === "string" ? data.emailError.slice(0, 200) : "SendGrid error"}. Check MAIL_FROM and template ID.`
          );
        } else if (data.emailSkipped) {
          toast.warning(
            "Test created. Set SENDGRID_API_KEY or SendGridDevKey (and MAIL_FROM) to send invitation emails."
          );
        } else {
          toast.success(
            data.emailsDispatched > 0
              ? "Test created and links dispatched!"
              : "Test created. Add students from the test monitor page when you're ready."
          );
        }
        router.push("/admin/assessment");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to create test.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <PageHeader
        title="Create Assessment"
        description="Design your test, set parameters, and dispatch unique links to students instantly."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 rounded-3xl bg-[#050505]/80 border border-white/10 space-y-6">
            <h3 className="text-xl font-semibold text-white">Test Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <Label className="text-slate-400">Test Title</Label>
                <Input
                  placeholder="e.g. TCS Digital Round 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl h-12 text-lg px-4"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Duration (Minutes)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="bg-white/5 border-white/10 text-white rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Link Validity (Hours)</Label>
                <Input
                  type="number"
                  value={validity}
                  onChange={(e) => setValidity(parseInt(e.target.value))}
                  className="bg-white/5 border-white/10 text-white rounded-xl"
                />
              </div>
            </div>
          </section>

          <Tabs defaultValue="mcqs" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 h-14 rounded-full mb-6">
              <TabsTrigger
                value="mcqs"
                className="rounded-full px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                <ListChecks className="mr-2 h-4 w-4" /> MCQs ({mcqs.length})
              </TabsTrigger>
              <TabsTrigger
                value="coding"
                className="rounded-full px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                <Code2 className="mr-2 h-4 w-4" /> Coding ({problems.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mcqs">
              <MCQBuilder questions={mcqs} onChange={setMcqs} />
            </TabsContent>
            <TabsContent value="coding">
              <CodingProblemBuilder problems={problems} onChange={setProblems} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Dispatch Info */}
        <div className="space-y-8">
          <section className="p-8 rounded-3xl bg-[#050505]/80 border border-white/10 space-y-6 sticky top-8">
            <div className="flex items-center gap-2 text-primary">
              <Users className="h-5 w-5" />
              <h3 className="text-xl font-semibold text-white">Student Dispatch</h3>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">Student emails (optional)</Label>
              <p className="text-[11px] text-slate-500 mb-2">
                Leave empty and invite later from the test monitor — or paste many at once (newlines, commas).
              </p>
              <Textarea
                placeholder="student1@example.com&#10;student2@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="bg-white/5 border-white/10 text-white min-h-[300px] rounded-2xl font-mono text-sm p-4"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-2xl h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" /> Dispatch Assessment
                </>
              )}
            </Button>

            <div className="pt-4 border-t border-white/10 space-y-2 text-[12px] text-slate-500">
              <p>• Total Questions: {mcqs.length + problems.length}</p>
              <p>• Total Marks: {mcqs.reduce((a, b) => a + b.marks, 0) + problems.reduce((a, b) => a + b.marks, 0)}</p>
              <p>• Invites use SendGrid when configured; you can add more students anytime from Monitor.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
