"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MCQBuilder, type MCQ } from "@/components/admin/assessment/MCQBuilder";
import { CodingProblemBuilder, type CodingProblem } from "@/components/admin/assessment/CodingProblemBuilder";
import { QuestionBankPicker } from "@/components/admin/assessment/QuestionBankPicker";
import { toast } from "sonner";
import { Loader2, ListChecks, Code2, Sparkles, Save, Trash2, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { codingPickKey, mcqPickKey } from "@/lib/assessment-pick-keys";

const DEFAULT_TITLE = "Practice pack";
const DEFAULT_DURATION = 45;
const DEFAULT_VALIDITY = 168;

function PracticeTestEditorInner({ editId }: { editId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPractice = searchParams.get("fromPractice");

  const [loading, setLoading] = useState(false);
  const [loadInitial, setLoadInitial] = useState(!!editId || !!fromPractice);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [validity, setValidity] = useState(DEFAULT_VALIDITY);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [publicSlug, setPublicSlug] = useState("");
  const [demoCardSubtitle, setDemoCardSubtitle] = useState("");
  const [demoCardImageUrl, setDemoCardImageUrl] = useState("");
  const [demoBannerImageUrl, setDemoBannerImageUrl] = useState("");
  const [demoBrandLogoUrl, setDemoBrandLogoUrl] = useState("");
  const [demoLogoDomain, setDemoLogoDomain] = useState("");
  const [demoSortOrder, setDemoSortOrder] = useState(0);
  const [uploadingCardImage, setUploadingCardImage] = useState(false);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);

  const pickedMcqKeys = useMemo(() => mcqs.map(mcqPickKey), [mcqs]);
  const pickedCodingKeys = useMemo(() => problems.map(codingPickKey), [problems]);

  useEffect(() => {
    if (!editId && !fromPractice) {
      setLoadInitial(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const url = editId
          ? `/api/admin/practice-tests/${encodeURIComponent(editId)}`
          : `/api/admin/practice-tests/${encodeURIComponent(fromPractice!)}`;
        const res = await fetch(url);
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) {
          if (!cancelled) toast.error(data?.message || "Could not load practice test.");
          return;
        }
        if (cancelled) return;
        if (typeof data.title === "string") setTitle(data.title);
        if (typeof data.duration === "number") setDuration(data.duration);
        if (typeof data.linkValidity === "number") setValidity(data.linkValidity);
        if (Array.isArray(data.mcqs)) setMcqs(data.mcqs as MCQ[]);
        if (Array.isArray(data.codingProblems)) setProblems(data.codingProblems as CodingProblem[]);
        if (typeof data.publicSlug === "string") setPublicSlug(data.publicSlug);
        if (typeof data.demoCardSubtitle === "string") setDemoCardSubtitle(data.demoCardSubtitle);
        if (typeof data.demoCardImageUrl === "string") setDemoCardImageUrl(data.demoCardImageUrl);
        if (typeof data.demoBannerImageUrl === "string") setDemoBannerImageUrl(data.demoBannerImageUrl);
        if (typeof data.demoBrandLogoUrl === "string") setDemoBrandLogoUrl(data.demoBrandLogoUrl);
        if (typeof data.demoLogoDomain === "string") setDemoLogoDomain(data.demoLogoDomain);
        if (typeof data.demoSortOrder === "number") setDemoSortOrder(data.demoSortOrder);
      } catch {
        if (!cancelled) toast.error("Load failed.");
      } finally {
        if (!cancelled) setLoadInitial(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editId, fromPractice]);

  const payload = () => ({
    title,
    duration,
    linkValidity: validity,
    mcqs,
    codingProblems: problems,
    publicSlug: publicSlug.trim(),
    demoCardSubtitle: demoCardSubtitle.trim(),
    demoCardImageUrl: demoCardImageUrl.trim(),
    demoBannerImageUrl: demoBannerImageUrl.trim(),
    demoBrandLogoUrl: demoBrandLogoUrl.trim(),
    demoLogoDomain: demoLogoDomain.trim(),
    demoSortOrder,
  });

  const handleSave = async () => {
    if (!title.trim() || (!mcqs.length && !problems.length)) {
      toast.error("Add a title and at least one MCQ or coding problem.");
      return;
    }
    if (!publicSlug.trim()) {
      toast.error("Public URL slug is required.");
      return;
    }

    setLoading(true);
    try {
      const isEdit = Boolean(editId);
      const res = await fetch(isEdit ? `/api/admin/practice-tests/${editId}` : "/api/admin/practice-tests", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data.message === "string" ? data.message : "Save failed.");
        return;
      }
      toast.success(isEdit ? "Practice test updated." : "Practice test created.");
      router.push("/admin/practice-tests");
      router.refresh();
    } catch {
      toast.error("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editId) return;
    if (!window.confirm("Delete this practice test? This cannot be undone if no sessions exist.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/practice-tests/${editId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(typeof data.message === "string" ? data.message : "Delete failed.");
        return;
      }
      toast.success("Deleted.");
      router.push("/admin/practice-tests");
      router.refresh();
    } catch {
      toast.error("Network error.");
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

  if (loadInitial) {
    return (
      <div className="flex justify-center py-24 text-slate-400 text-sm gap-2">
        <Loader2 className="h-5 w-5 animate-spin text-primary" /> Loading…
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <PageHeader
        title={editId ? "Edit practice test" : "New practice test"}
        description="Content is stored in the practice_test collection and appears on /available-tests. Students sign in and start from the public page."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 rounded-3xl bg-[#050505]/80 border border-white/10 space-y-6">
            <h3 className="text-xl font-semibold text-white">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <Label className="text-slate-400">Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Duration (minutes)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number.parseInt(e.target.value, 10) || DEFAULT_DURATION)}
                  className="bg-white/5 border-white/10 text-white rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-400">Link validity (hours)</Label>
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
              <h3 className="text-xl font-semibold text-white">Catalog &amp; cards</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-400">Public URL slug</Label>
                <Input
                  placeholder="e.g. acme-hiring-practice"
                  value={publicSlug}
                  onChange={(e) => setPublicSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  className="bg-white/5 border-white/10 text-white rounded-xl font-mono"
                />
                <p className="text-[11px] text-slate-500">/available-tests/[slug] — unique across practice + platform slugs.</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-400">Card subtitle</Label>
                <Input
                  value={demoCardSubtitle}
                  onChange={(e) => setDemoCardSubtitle(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-400">Card image URL (optional)</Label>
                <Input
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
                <p className="text-[11px] text-slate-500">Uses the same Azure upload pipeline style as blog images.</p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-400">Banner image URL (optional)</Label>
                <Input
                  value={demoBannerImageUrl}
                  onChange={(e) => setDemoBannerImageUrl(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl text-sm"
                />
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={uploadingBannerImage}
                    className="bg-white/5 border-white/10 text-white rounded-xl text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-black file:font-semibold"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingBannerImage(true);
                      try {
                        const url = await uploadPracticeImage(file);
                        setDemoBannerImageUrl(url);
                        toast.success("Banner image uploaded.");
                      } catch (err: unknown) {
                        toast.error(err instanceof Error ? err.message : "Upload failed.");
                      } finally {
                        setUploadingBannerImage(false);
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                  {uploadingBannerImage ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : null}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-400">Brand logo URL (optional)</Label>
                <Input
                  value={demoBrandLogoUrl}
                  onChange={(e) => setDemoBrandLogoUrl(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl text-sm"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-400">Logo domain (optional)</Label>
                <Input
                  placeholder="e.g. google.com"
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

        <div className="space-y-6">
          <section className="p-8 rounded-3xl bg-[#050505]/80 border border-white/10 space-y-4 sticky top-24">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full rounded-2xl h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-black"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              {editId ? "Save changes" : "Create practice test"}
            </Button>
            {publicSlug.trim() ? (
              <Button variant="outline" asChild className="w-full rounded-full border-white/20">
                <Link href={`/available-tests/${encodeURIComponent(publicSlug.trim())}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Preview public page
                </Link>
              </Button>
            ) : null}
            {editId ? (
              <Button
                type="button"
                variant="destructive"
                className="w-full rounded-full"
                disabled={loading}
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            ) : null}
            <p className="text-[12px] text-slate-500 border-t border-white/10 pt-4">
              Questions: {mcqs.length + problems.length} · Marks:{" "}
              {mcqs.reduce((a, b) => a + b.marks, 0) + problems.reduce((a, b) => a + b.marks, 0)}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export function PracticeTestEditor({ editId }: { editId?: string }) {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto py-24 flex justify-center text-slate-400 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <PracticeTestEditorInner editId={editId} />
    </Suspense>
  );
}
