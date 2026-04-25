"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MCQBuilder, type MCQ } from "@/components/admin/assessment/MCQBuilder";
import { CodingProblemBuilder, type CodingProblem } from "@/components/admin/assessment/CodingProblemBuilder";
import { QuestionBankPicker } from "@/components/admin/assessment/QuestionBankPicker";
import { toast } from "sonner";
import { Send, Loader2, ListChecks, Code2, Users, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { partitionEmailList } from "@/lib/email-list-partition";
import { codingPickKey, mcqPickKey } from "@/lib/assessment-pick-keys";

const DEFAULT_TITLE = "Coding Challenge";
const DEFAULT_DURATION = 90;
const DEFAULT_VALIDITY = 48;

function CreateAssessmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromTest = searchParams.get("fromTest");

  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [validity, setValidity] = useState(DEFAULT_VALIDITY);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [emails, setEmails] = useState("");

  const [isPublicDemo, setIsPublicDemo] = useState(false);
  const [publicSlug, setPublicSlug] = useState("");
  const [demoCardSubtitle, setDemoCardSubtitle] = useState("");
  const [demoCardImageUrl, setDemoCardImageUrl] = useState("");
  const [demoBrandLogoUrl, setDemoBrandLogoUrl] = useState("");
  const [demoLogoDomain, setDemoLogoDomain] = useState("");
  const [demoSortOrder, setDemoSortOrder] = useState(0);
  const [uploadingCardImage, setUploadingCardImage] = useState(false);
  const [uploadingBrandLogo, setUploadingBrandLogo] = useState(false);

  const emailPreview = useMemo(() => partitionEmailList(emails), [emails]);

  const pickedMcqKeys = useMemo(() => mcqs.map(mcqPickKey), [mcqs]);
  const pickedCodingKeys = useMemo(() => problems.map(codingPickKey), [problems]);

  useEffect(() => {
    if (!fromTest) return;
    let cancelled = false;
    (async () => {
      setTemplateLoading(true);
      try {
        const res = await fetch(`/api/assessment/test/${encodeURIComponent(fromTest)}`);
        const text = await res.text();
        if (!res.ok) {
          if (!cancelled) toast.error("Could not load assessment template.");
          return;
        }
        if (!text.trim()) {
          if (!cancelled) toast.error("Empty response from server — try again.");
          return;
        }
        let d: Record<string, unknown>;
        try {
          d = JSON.parse(text) as Record<string, unknown>;
        } catch {
          if (!cancelled) toast.error("Could not read assessment template (invalid JSON).");
          return;
        }
        if (cancelled) return;
        setIsPublicDemo(false);
        setPublicSlug("");
        setDemoCardSubtitle("");
        setDemoCardImageUrl("");
        setDemoBrandLogoUrl("");
        setDemoLogoDomain("");
        setDemoSortOrder(0);
        if (typeof d.title === "string" && d.title.trim()) setTitle(d.title.trim());
        if (typeof d.duration === "number" && !Number.isNaN(d.duration)) setDuration(d.duration);
        if (typeof d.linkValidity === "number" && !Number.isNaN(d.linkValidity)) setValidity(d.linkValidity);
        if (Array.isArray(d.mcqs)) setMcqs(d.mcqs as MCQ[]);
        if (Array.isArray(d.codingProblems)) setProblems(d.codingProblems as CodingProblem[]);
        if (typeof d.isPublicDemo === "boolean") setIsPublicDemo(d.isPublicDemo);
        if (typeof d.publicSlug === "string") setPublicSlug(d.publicSlug);
        if (typeof d.demoCardSubtitle === "string") setDemoCardSubtitle(d.demoCardSubtitle);
        if (typeof d.demoCardImageUrl === "string") setDemoCardImageUrl(d.demoCardImageUrl);
        if (typeof d.demoBrandLogoUrl === "string") setDemoBrandLogoUrl(d.demoBrandLogoUrl);
        if (typeof d.demoLogoDomain === "string") setDemoLogoDomain(d.demoLogoDomain);
        if (typeof d.demoSortOrder === "number" && !Number.isNaN(d.demoSortOrder)) setDemoSortOrder(d.demoSortOrder);
        toast.info("Template loaded — adjust title or timing if needed, then dispatch.");
      } catch {
        if (!cancelled) toast.error("Could not load assessment template.");
      } finally {
        if (!cancelled) setTemplateLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fromTest]);

  const handleSubmit = async () => {
    if (!title || (!mcqs.length && !problems.length)) {
      toast.error("Please fill in all required fields and add at least one question.");
      return;
    }
    if (isPublicDemo && !publicSlug.trim()) {
      toast.error("Public demo tests need a URL slug (e.g. tcs-hiring-practice).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/assessment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          duration,
          linkValidity: validity,
          mcqs,
          codingProblems: problems,
          emails,
          isPublicDemo,
          publicSlug: publicSlug.trim(),
          demoCardSubtitle: demoCardSubtitle.trim(),
          demoCardImageUrl: demoCardImageUrl.trim(),
          demoBrandLogoUrl: demoBrandLogoUrl.trim(),
          demoLogoDomain: demoLogoDomain.trim(),
          demoSortOrder,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.invalidEmailEntries) && data.invalidEmailEntries.length > 0) {
          const n = data.invalidEmailEntries.length;
          const sample = data.invalidEmailEntries
            .slice(0, 4)
            .map((x: { value: string; reason: string }) => `${x.value} (${x.reason})`)
            .join("; ");
          toast.warning(
            `Test created. ${n} invalid address(es) were not invited${sample ? `: ${sample}` : ""}${n > 4 ? " …" : ""}`
          );
        }
        if (Array.isArray(data.ignoredDuplicatesFromPaste) && data.ignoredDuplicatesFromPaste.length > 0) {
          toast.info(`${data.ignoredDuplicatesFromPaste.length} duplicate line(s) in your list were skipped.`);
        }
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
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadPracticeImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch("/api/uploads/practice-media", {
      method: "POST",
      body: fd,
    });
    const data = (await res.json().catch(() => ({}))) as { imageUrl?: string; error?: string };
    if (!res.ok || !data.imageUrl) {
      throw new Error(data.error || "Upload failed.");
    }
    return data.imageUrl;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <PageHeader
        title="Create Assessment"
        description="Defaults are filled for speed — edit anything you need. In the repository, filter by section (DSA theory MCQs, Blind 75–style coding with per-language starters) or search by topic; add your own questions (saved to the bank when you create this test)."
      />

      {templateLoading ? (
        <p className="text-sm text-slate-400 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading template…
        </p>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 rounded-3xl bg-[#050505]/80 border border-white/10 space-y-6">
            <h3 className="text-xl font-semibold text-white">Test Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <Label className="text-slate-400">Test Title</Label>
                <Input
                  placeholder="e.g. Coding Challenge"
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
                  onChange={(e) => setDuration(Number.parseInt(e.target.value, 10) || DEFAULT_DURATION)}
                  className="bg-white/5 border-white/10 text-white rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Link Validity (Hours)</Label>
                <Input
                  type="number"
                  value={validity}
                  onChange={(e) => setValidity(Number.parseInt(e.target.value, 10) || DEFAULT_VALIDITY)}
                  className="bg-white/5 border-white/10 text-white rounded-xl"
                />
              </div>
            </div>
          </section>

          <section className="p-8 rounded-3xl bg-[#050505]/80 border border-white/10 space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-xl font-semibold text-white">Homepage &amp; /available-tests</h3>
            </div>
            <p className="text-sm text-slate-500">
              Show this assessment as a public practice card (Google / TCS style). Requires a unique URL slug. Students browse
              at <span className="text-slate-300">/available-tests</span>.
            </p>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <Label className="text-white">List as public demo</Label>
                <p className="text-xs text-slate-500 mt-1">Adds the test to the &quot;Judge your skills&quot; section when slug is set.</p>
              </div>
              <Switch checked={isPublicDemo} onCheckedChange={setIsPublicDemo} />
            </div>
            {isPublicDemo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-400">Public URL slug</Label>
                  <Input
                    placeholder="e.g. tcs-hiring-practice"
                    value={publicSlug}
                    onChange={(e) => setPublicSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="bg-white/5 border-white/10 text-white rounded-xl font-mono"
                  />
                  <p className="text-[11px] text-slate-500">Lowercase, numbers, hyphens only. Must be unique.</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-400">Card subtitle</Label>
                  <Input
                    placeholder="Short line under the title on cards"
                    value={demoCardSubtitle}
                    onChange={(e) => setDemoCardSubtitle(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-400">Card image URL (optional)</Label>
                  <Input
                    placeholder="Hero / banner image — https://…"
                    value={demoCardImageUrl}
                    onChange={(e) => setDemoCardImageUrl(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl text-sm"
                  />
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={uploadingCardImage}
                      className="bg-white/5 border-white/10 text-white rounded-xl text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-black file:font-semibold"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingCardImage(true);
                        try {
                          const url = await uploadPracticeImage(file);
                          setDemoCardImageUrl(url);
                          toast.success("Card image uploaded.");
                        } catch (err: unknown) {
                          toast.error(err instanceof Error ? err.message : "Upload failed.");
                        } finally {
                          setUploadingCardImage(false);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    {uploadingCardImage ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : null}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-400">Brand logo URL (optional)</Label>
                  <Input
                    placeholder="Override: direct logo image URL"
                    value={demoBrandLogoUrl}
                    onChange={(e) => setDemoBrandLogoUrl(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl text-sm"
                  />
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={uploadingBrandLogo}
                      className="bg-white/5 border-white/10 text-white rounded-xl text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-black file:font-semibold"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingBrandLogo(true);
                        try {
                          const url = await uploadPracticeImage(file);
                          setDemoBrandLogoUrl(url);
                          toast.success("Brand logo uploaded.");
                        } catch (err: unknown) {
                          toast.error(err instanceof Error ? err.message : "Upload failed.");
                        } finally {
                          setUploadingBrandLogo(false);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    {uploadingBrandLogo ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : null}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    If empty, we use img.logo.dev from the domain below or known slugs (same as Alumni marquee).
                  </p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-400">Logo domain (optional)</Label>
                  <Input
                    placeholder="e.g. google.com — for img.logo.dev"
                    value={demoLogoDomain}
                    onChange={(e) => setDemoLogoDomain(e.target.value.replace(/[^\w.-]/g, ""))}
                    className="bg-white/5 border-white/10 text-white rounded-xl font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Sort order</Label>
                  <Input
                    type="number"
                    value={demoSortOrder}
                    onChange={(e) => setDemoSortOrder(Number.parseInt(e.target.value, 10) || 0)}
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>
              </div>
            ) : null}
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
            <TabsContent value="mcqs" className="space-y-6">
              <QuestionBankPicker
                kind="MCQ"
                pickedMcqKeys={pickedMcqKeys}
                pickedCodingKeys={pickedCodingKeys}
                onPickMcq={(m) => setMcqs((prev) => [...prev, m])}
              />
              <MCQBuilder questions={mcqs} onChange={setMcqs} />
            </TabsContent>
            <TabsContent value="coding" className="space-y-6">
              <QuestionBankPicker
                kind="CODING"
                pickedMcqKeys={pickedMcqKeys}
                pickedCodingKeys={pickedCodingKeys}
                onPickCoding={(p) => setProblems((prev) => [...prev, p])}
              />
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
                Leave empty and invite later from the test monitor — or paste / upload from Excel on the monitor page.
                Invalid lines are skipped with a warning after create.
              </p>
              <Textarea
                placeholder="student1@example.com&#10;student2@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="bg-white/5 border-white/10 text-white min-h-[300px] rounded-2xl font-mono text-sm p-4"
              />
              {emails.trim() ? (
                <p className="text-xs text-slate-500">
                  <span className="text-primary font-semibold">{emailPreview.valid.length}</span> valid invite(s)
                  {emailPreview.invalid.length > 0 ? (
                    <>
                      {" "}
                      · <span className="text-amber-400 font-semibold">{emailPreview.invalid.length}</span> will be
                      skipped
                    </>
                  ) : null}
                  {emailPreview.ignoredDuplicates.length > 0 ? (
                    <>
                      {" "}
                      · <span className="text-slate-400">{emailPreview.ignoredDuplicates.length}</span> duplicate in list
                    </>
                  ) : null}
                </p>
              ) : null}
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

export default function CreateTestPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto py-24 flex justify-center text-slate-400 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <CreateAssessmentForm />
    </Suspense>
  );
}
