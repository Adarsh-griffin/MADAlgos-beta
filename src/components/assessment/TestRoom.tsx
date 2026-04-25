"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import { Clock, ChevronLeft, ChevronRight, PanelLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Checkbox } from "@/components/ui/checkbox";
import AssessmentCodeEditor from "./AssessmentCodeEditor";
import { AssessmentMarkdown } from "./AssessmentMarkdown";
import { AssessmentPostSubmitFeedback } from "./AssessmentPostSubmitFeedback";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { isMcqMultiple } from "@/lib/assessment-mcq";
import { ASSESSMENT_CODE_HINTS, getDefaultStarterCode } from "@/lib/assessment-code-starters";
import type { AssessmentLangKey } from "@/lib/assessment-code-starters";

interface TestRoomProps {
  test: any;
  tokenData: any;
}

type ActivePanel = "mcq" | number;
type ProblemState = { lang: string; codeByLang: Record<string, string> };

/**
 * Student-facing sanitizer: hide source references/URLs in test mode.
 */
function stripQuestionSourceText(raw: string): string {
  if (!raw) return "";
  const lines = raw
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .split(/\r?\n/);
  const filtered = lines.filter((line) => {
    const l = line.trim();
    if (/leetcode\.com/i.test(l)) return false;
    if (/blind\s*75/i.test(l)) return false;
    if (/official problem/i.test(l)) return false;
    if (/platform template/i.test(l)) return false;
    if (/not\s+the\s+real\s+leetcode/i.test(l)) return false;
    if (/open the link for the full spec/i.test(l)) return false;
    return true;
  });
  return filtered
    .join("\n")
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const GENERIC_RUN_ISSUE_MESSAGE =
  "We have encountered an issue. If the problem persists, contact us at contact@madalgos.in.";

/** Tab switches away trigger a warning; at this count the assessment auto-submits. */
const MAX_TAB_LEAVES_BEFORE_AUTO_SUBMIT = 3;

function shouldHideRuntimeDetails(status: string): boolean {
  return /(judge0|http\s*\d{3}|internal error|rate-?limit|unavailable|timeout|network|rapidapi)/i.test(status);
}

function getSecondsLeft(usedAt: string | Date | undefined, durationMinutes: number) {
  const startMs = new Date(usedAt ?? new Date()).getTime();
  const endMs = startMs + durationMinutes * 60 * 1000;
  return Math.max(0, Math.floor((endMs - Date.now()) / 1000));
}

export function TestRoom({ test, tokenData }: TestRoomProps) {
  const mcqs = (test.mcqs || []) as any[];
  const codingProblems = (test.codingProblems || []) as any[];
  const hasMcq = mcqs.length > 0;
  const hasCoding = codingProblems.length > 0;

  const defaultPanel = useMemo<ActivePanel>(() => {
    if (hasMcq) return "mcq";
    if (hasCoding) return 0;
    return "mcq";
  }, [hasMcq, hasCoding]);

  const [timeLeft, setTimeLeft] = useState(() => getSecondsLeft(tokenData.usedAt, test.duration));
  const [activePanel, setActivePanel] = useState<ActivePanel>(defaultPanel);

  const [mcqSelections, setMcqSelections] = useState<Record<number, number[]>>({});

  const [problemStates, setProblemStates] = useState<Record<number, ProblemState>>(() => {
    const init: Record<number, ProblemState> = {};
    const lang: AssessmentLangKey = "Javascript";
    codingProblems.forEach((p: any, idx: number) => {
      init[idx] = { lang, codeByLang: { [lang]: getDefaultStarterCode(lang, p) } };
    });
    return init;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [problemPaneCollapsed, setProblemPaneCollapsed] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [postSubmitOpen, setPostSubmitOpen] = useState(false);
  const [fullscreenRequiredOpen, setFullscreenRequiredOpen] = useState(false);

  const mcqSelectionsRef = useRef(mcqSelections);
  const problemStatesRef = useRef<Record<number, ProblemState>>(problemStates);
  const isSubmittingRef = useRef(false);
  const autoSubmitFiredRef = useRef(false);
  const tabAwayCountRef = useRef(0);
  const tabLeaveAutoSubmitFiredRef = useRef(false);
  const postSubmitOpenRef = useRef(false);
  const codingIdx = typeof activePanel === "number" ? activePanel : 0;

  useEffect(() => {
    mcqSelectionsRef.current = mcqSelections;
    problemStatesRef.current = problemStates;
  });

  useEffect(() => {
    postSubmitOpenRef.current = postSubmitOpen;
  }, [postSubmitOpen]);

  useEffect(() => {
    if (activePanel === "mcq") setProblemPaneCollapsed(false);
  }, [activePanel]);

  const getCodingSubmissionsPayload = useCallback((states: Record<number, ProblemState>) => {
    return Object.entries(states).map(([idx, state]) => {
      const sourceCode = state.codeByLang[state.lang] ?? "";
      return {
        problemIndex: parseInt(idx, 10),
        sourceCode,
        language: state.lang,
      };
    });
  }, []);

  const submitAssessment = useCallback(
    async (
      submitStatus: "COMPLETED" | "AUTO_SUBMITTED" = "COMPLETED",
      options?: { reason?: "timer" | "tab-leave" }
    ) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSubmitting(true);

      try {
        const ms = mcqSelectionsRef.current;
        const ps = problemStatesRef.current;
        const mcqAnswers = mcqs.map((_: unknown, i: number) => {
          const sel = ms[i] ?? [];
          const base = { questionIndex: i, selectedOptions: sel };
          return sel.length === 1 ? { ...base, selectedOption: sel[0] } : base;
        });
        const payload = {
          token: tokenData.token,
          mcqAnswers,
          codingSubmissions: getCodingSubmissionsPayload(ps),
          status: submitStatus,
        };

        const res = await fetch(`/api/assessment/submit?token=${encodeURIComponent(tokenData.token)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          if (submitStatus === "AUTO_SUBMITTED" && options?.reason === "tab-leave") {
            toast.success(
              `You left the assessment window ${MAX_TAB_LEAVES_BEFORE_AUTO_SUBMIT} times. Your test is being auto-submitted.`
            );
          } else if (submitStatus === "AUTO_SUBMITTED") {
            toast.success("Time is up — responses saved.");
          } else {
            toast.success("Assessment submitted successfully!");
          }
          setPostSubmitOpen(true);
          return;
        } else {
          const err = await res.json().catch(() => ({}));
          const msg = String(err.message || "");
          if (res.status === 403 && /submitted/i.test(msg)) {
            window.location.reload();
            return;
          }
          if (submitStatus === "AUTO_SUBMITTED") {
            window.location.reload();
            return;
          }
          toast.error(msg || "Submission failed.");
        }
      } catch {
        if (submitStatus === "AUTO_SUBMITTED") {
          window.location.reload();
          return;
        }
        toast.error("Network error. Please try again or contact support.");
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [tokenData.token, mcqs, getCodingSubmissionsPayload]
  );

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState !== "hidden") return;
      if (postSubmitOpenRef.current) return;
      if (isSubmittingRef.current) return;
      if (tabLeaveAutoSubmitFiredRef.current) return;

      tabAwayCountRef.current += 1;
      const n = tabAwayCountRef.current;

      if (n >= MAX_TAB_LEAVES_BEFORE_AUTO_SUBMIT) {
        tabLeaveAutoSubmitFiredRef.current = true;
        autoSubmitFiredRef.current = true;
        void submitAssessment("AUTO_SUBMITTED", { reason: "tab-leave" });
        return;
      }

      toast.warning(
        `You left this tab (${n}/${MAX_TAB_LEAVES_BEFORE_AUTO_SUBMIT}). Stay in the assessment window until you submit.`,
        { id: "assessment-tab-leave", duration: 7000 }
      );
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [submitAssessment]);

  useEffect(() => {
    autoSubmitFiredRef.current = false;
    const startTime = new Date(tokenData.usedAt || new Date()).getTime();
    const durationMs = test.duration * 60 * 1000;
    const endTime = startTime + durationMs;

    let intervalId: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        if (intervalId !== undefined) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
        if (!autoSubmitFiredRef.current) {
          autoSubmitFiredRef.current = true;
          void submitAssessment("AUTO_SUBMITTED", { reason: "timer" });
        }
      }
    };

    tick();
    intervalId = setInterval(tick, 1000);

    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    const onFocus = () => tick();
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
        return;
      }
      tick();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [test.duration, tokenData.usedAt, submitAssessment]);

  useEffect(() => {
    // Keep user in active attempt; browser back shows warning instead of leaving.
    const blockBackNavigation = () => {
      if (postSubmitOpenRef.current) return;
      history.pushState({ assessmentGuard: true }, "", window.location.href);
      toast.warning("Submit test first before leaving this page.", {
        id: "assessment-back-blocked",
        duration: 3500,
      });
    };

    history.pushState({ assessmentGuard: true }, "", window.location.href);
    window.addEventListener("popstate", blockBackNavigation);
    return () => {
      window.removeEventListener("popstate", blockBackNavigation);
    };
  }, []);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (postSubmitOpenRef.current) return;
      e.preventDefault();
      // Required for Chrome/Edge native confirmation prompt.
      e.returnValue = "Submit test first before leaving this page.";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  const requestExamFullscreen = useCallback(async () => {
    if (postSubmitOpenRef.current) return;
    if (document.fullscreenElement) return;
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen may require fresh user gesture in some browsers.
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      if (postSubmitOpenRef.current) return;
      const inFullscreen = Boolean(document.fullscreenElement);
      setFullscreenRequiredOpen(!inFullscreen);
      if (!inFullscreen) {
        toast.warning("Fullscreen is required during assessment. Return to fullscreen.", {
          id: "assessment-fullscreen-required",
          duration: 3500,
        });
      }
    };

    // Open lock modal if test loads outside fullscreen.
    if (!document.fullscreenElement) {
      setFullscreenRequiredOpen(true);
    }

    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [requestExamFullscreen]);

  useEffect(() => {
    if (postSubmitOpen) setFullscreenRequiredOpen(false);
  }, [postSubmitOpen]);

  const saveDraft = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = Boolean(opts?.silent);
    setIsSavingDraft(true);
    try {
      const ms = mcqSelectionsRef.current;
      const ps = problemStatesRef.current;
      const mcqAnswers = mcqs.map((_: unknown, i: number) => {
        const sel = ms[i] ?? [];
        const base = { questionIndex: i, selectedOptions: sel };
        return sel.length === 1 ? { ...base, selectedOption: sel[0] } : base;
      });
      const payload = {
        token: tokenData.token,
        mcqAnswers,
        codingSubmissions: getCodingSubmissionsPayload(ps),
      };
      const res = await fetch("/api/assessment/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (!silent) toast.error(data.message || "Could not save draft.");
        return;
      }
      if (!silent) toast.success("Progress saved to backend.");
    } catch {
      if (!silent) toast.error("Network error while saving.");
    } finally {
      setIsSavingDraft(false);
    }
  }, [mcqs, tokenData.token, getCodingSubmissionsPayload]);

  const saveProgress = useCallback(async () => {
    await saveDraft({ silent: false });
  }, [saveDraft]);

  useEffect(() => {
    if (postSubmitOpen || isSubmitting) return;
    const id = window.setInterval(() => {
      void saveDraft({ silent: true });
    }, 15000);
    return () => window.clearInterval(id);
  }, [postSubmitOpen, isSubmitting, saveDraft]);

  const handleRun = async (scope: "sample" | "all") => {
    if (!hasCoding) return;
    setIsRunning(true);
    setRunOutput(null);
    try {
      const idx = codingIdx;
      const state = problemStatesRef.current[idx];
      const codeToRun = state?.codeByLang?.[state.lang] ?? "";
      if (!codeToRun.trim()) {
        toast.error("Write some code before running.");
        return;
      }
      const res = await fetch("/api/assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenData.token,
          problemIndex: idx,
          sourceCode: codeToRun,
          language: state?.lang || "Javascript",
          runScope: scope,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRunOutput(GENERIC_RUN_ISSUE_MESSAGE);
        toast.error(GENERIC_RUN_ISSUE_MESSAGE);
        return;
      }

      const results = (data.results as Array<{
        passed: boolean;
        status: string;
        stdout?: string;
        stderr?: string;
        visibility?: "sample" | "hidden";
        input?: string;
        expected?: string;
      }>) ?? [];

      if (results.some((r) => shouldHideRuntimeDetails(String(r.status || "")))) {
        setRunOutput(GENERIC_RUN_ISSUE_MESSAGE);
        toast.error(GENERIC_RUN_ISSUE_MESSAGE);
        return;
      }

      const lines = results.map(
        (r, i) =>
          `${r.visibility === "hidden" ? "Hidden" : "Sample"} ${i + 1}: ${r.passed ? "PASS" : "FAIL"} (${r.status})` +
          (r.visibility === "sample" ? `\ninput:\n${r.input ?? ""}\nexpected:\n${r.expected ?? ""}` : "") +
          `\nstdout:\n${r.stdout ?? ""}\nstderr:\n${r.stderr ?? ""}`
      );
      setRunOutput(lines.join("\n\n---\n\n"));
    } catch {
      setRunOutput(GENERIC_RUN_ISSUE_MESSAGE);
      toast.error(GENERIC_RUN_ISSUE_MESSAGE);
    } finally {
      setIsRunning(false);
    }
  };
  const handleRunSamples = () => void handleRun("sample");
  const handleRunAllTests = () => void handleRun("all");

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleMcq = (qIdx: number, oIdx: number) => {
    const q = mcqs[qIdx];
    const multi = isMcqMultiple(q);
    setMcqSelections((prev) => {
      if (multi) {
        const cur = new Set(prev[qIdx] ?? []);
        if (cur.has(oIdx)) cur.delete(oIdx);
        else cur.add(oIdx);
        return { ...prev, [qIdx]: [...cur].sort((a, b) => a - b) };
      }
      return { ...prev, [qIdx]: [oIdx] };
    });
  };

  const handleUpdateCode = (code: string) => {
    setProblemStates((prev) => ({
      ...prev,
      [codingIdx]: {
        ...(prev[codingIdx] ?? { lang: "Javascript", codeByLang: {} }),
        codeByLang: {
          ...(prev[codingIdx]?.codeByLang ?? {}),
          [(prev[codingIdx]?.lang ?? "Javascript")]: code,
        },
      },
    }));
  };

  const handleUpdateLang = (lang: string) => {
    const prob = codingProblems[codingIdx];
    const starter = getDefaultStarterCode(lang, prob);
    setProblemStates((prev) => ({
      ...prev,
      [codingIdx]: {
        ...(prev[codingIdx] ?? { lang: "Javascript", codeByLang: {} }),
        lang,
        codeByLang: {
          ...(prev[codingIdx]?.codeByLang ?? {}),
          [lang]: prev[codingIdx]?.codeByLang?.[lang] ?? starter,
        },
      },
    }));
  };

  const currentProblem = hasCoding
    ? codingProblems[codingIdx]
    : null;
  const currentState = hasCoding
    ? problemStates[codingIdx] ?? { lang: "Javascript", codeByLang: {} }
    : { lang: "Javascript", codeByLang: {} };
  const defaultCodeForEditor = hasCoding
    ? getDefaultStarterCode(currentState.lang, currentProblem)
    : "";
  const currentCode = currentState.codeByLang[currentState.lang] ?? defaultCodeForEditor;
  const studentSafeDescription = stripQuestionSourceText(String(currentProblem?.description ?? ""));

  const goNextFromMcq = () => {
    if (hasCoding) setActivePanel(0);
  };

  const hintText =
    (ASSESSMENT_CODE_HINTS[currentState.lang as AssessmentLangKey] as string | undefined) ??
    ASSESSMENT_CODE_HINTS.Javascript;

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">
      <header className="h-16 px-6 border-b border-white/10 bg-[#050505] flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-6 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <Image
              src="/navbar_logo2_trans.png"
              alt="MADAlgos"
              width={120}
              height={32}
              className="h-8 w-auto max-w-[120px] object-contain object-left"
              priority
            />
            <span className="font-bold tracking-tight text-lg hidden sm:inline-block">
              MADAlgos <span className="text-primary font-normal">TestPortal</span>
            </span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block shrink-0" />
          <h1 className="text-slate-300 font-medium truncate max-w-[200px] md:max-w-md">{test.title}</h1>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${
              timeLeft < 300
                ? "text-red-500 border-red-500/30 bg-red-500/5"
                : "text-slate-300 border-white/10 bg-white/5"
            } font-mono text-lg font-bold transition-colors`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
          <Button
            type="button"
            onClick={() => setFinishDialogOpen(true)}
            disabled={isSubmitting}
            className="rounded-full bg-primary hover:bg-primary/90 text-black px-6 font-bold"
          >
            {isSubmitting ? "Submitting..." : "Finish Test"}
          </Button>
        </div>
      </header>

      <main className="flex-1 flex min-h-0 overflow-hidden">
        {(hasMcq || hasCoding) &&
          (!navCollapsed ? (
            <aside className="w-40 md:w-44 shrink-0 border-r border-white/10 bg-[#080808] flex flex-col py-2 gap-0.5 px-2 overflow-y-auto transition-[width] duration-200">
              <div className="flex items-center justify-between gap-1 px-1 pb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Navigate</p>
                <button
                  type="button"
                  onClick={() => setNavCollapsed(true)}
                  className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10"
                  title="Collapse navigation"
                  aria-label="Collapse navigation"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>
              {hasMcq ? (
                <button
                  type="button"
                  onClick={() => setActivePanel("mcq")}
                  title="Multiple choice"
                  className={`rounded-lg px-2 py-2 text-left text-xs font-medium leading-snug transition-colors ${
                    activePanel === "mcq"
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-slate-400 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="line-clamp-3">Multiple choice</span>
                </button>
              ) : null}
              {hasCoding
                ? codingProblems.map((p: any, i: number) => {
                    const label = (p.title as string)?.trim() || `Coding ${i + 1}`;
                    return (
                      <button
                        key={i}
                        type="button"
                        title={label}
                        onClick={() => setActivePanel(i)}
                        className={`rounded-lg px-2 py-2 text-left text-xs font-medium leading-snug transition-colors ${
                          activePanel === i
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "text-slate-400 hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <span className="line-clamp-3">{label}</span>
                      </button>
                    );
                  })
                : null}
            </aside>
          ) : (
            <button
              type="button"
              onClick={() => setNavCollapsed(false)}
              className="shrink-0 w-9 border-r border-white/10 bg-[#080808] flex flex-col items-center py-3 text-slate-400 hover:text-primary hover:bg-white/5"
              title="Show navigation"
              aria-label="Show navigation"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          ))}

        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          {activePanel === "mcq" && hasMcq ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="max-w-3xl mx-auto space-y-10 pb-8">
                  {mcqs.map((q: any, qIdx: number) => {
                    const multi = isMcqMultiple(q);
                    const sel = new Set(mcqSelections[qIdx] ?? []);
                    return (
                      <div key={qIdx} className="space-y-4">
                        <div className="flex gap-4">
                          <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-bold">
                            {qIdx + 1}
                          </span>
                          <div className="space-y-2">
                            <p className="text-lg font-medium text-white leading-relaxed">{q.questionText}</p>
                            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                              {q.marks} marks
                              {multi ? " · select all that apply" : ""}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pl-0 md:pl-12">
                          {q.options.map((opt: string, oIdx: number) => {
                            const selected = sel.has(oIdx);
                            if (multi) {
                              return (
                                <div
                                  key={oIdx}
                                  className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${
                                    selected
                                      ? "bg-primary/10 border-primary/50 text-white ring-1 ring-primary/20"
                                      : "bg-white/[0.02] border-white/10 text-slate-400"
                                  }`}
                                >
                                  <Checkbox
                                    id={`mcq-${qIdx}-cb-${oIdx}`}
                                    checked={selected}
                                    onCheckedChange={() => toggleMcq(qIdx, oIdx)}
                                    className="mt-0.5 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                  />
                                  <label htmlFor={`mcq-${qIdx}-cb-${oIdx}`} className="flex-1 cursor-pointer text-left">
                                    {opt}
                                  </label>
                                </div>
                              );
                            }
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => toggleMcq(qIdx, oIdx)}
                                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                  selected
                                    ? "bg-primary/10 border-primary/50 text-white ring-1 ring-primary/20"
                                    : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[0.04]"
                                }`}
                              >
                                <span className="flex-1 pr-4 text-left">{opt}</span>
                                <div
                                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    selected ? "border-primary bg-primary" : "border-slate-700"
                                  }`}
                                >
                                  {selected ? <div className="h-2 w-2 rounded-full bg-black" /> : null}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {hasCoding ? (
                <div className="shrink-0 border-t border-white/10 p-4 bg-[#050505] flex justify-end">
                  <Button
                    type="button"
                    onClick={goNextFromMcq}
                    className="rounded-full bg-primary text-black font-bold px-8"
                  >
                    Next: Coding 1 <ChevronRight className="ml-2 h-4 w-4 inline" />
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {typeof activePanel === "number" && hasCoding ? (
            problemPaneCollapsed ? (
              <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-black">
                <div className="shrink-0 flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-[#050505]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-primary/40 text-primary hover:bg-primary/10"
                    onClick={() => setProblemPaneCollapsed(false)}
                  >
                    <PanelLeft className="h-4 w-4 mr-1" /> Show problem
                  </Button>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                    Problem {codingIdx + 1} / {codingProblems.length}
                  </span>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2">
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <AssessmentCodeEditor
                      sourceCode={currentCode}
                      setSourceCode={handleUpdateCode}
                      language={currentState.lang}
                      setLanguage={handleUpdateLang}
                      defaultCode={defaultCodeForEditor}
                      onRunSamples={handleRunSamples}
                      onRunAllTests={handleRunAllTests}
                      onSaveProgress={saveProgress}
                      isRunning={isRunning}
                      isSaving={isSavingDraft}
                    />
                  </div>
                  {runOutput !== null && (
                    <div className="shrink-0 max-h-36 overflow-auto rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-xs font-mono text-slate-300 whitespace-pre-wrap">
                      {runOutput}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <ResizablePanelGroup
                direction="horizontal"
                autoSaveId="madalgos-testroom-split"
                className="flex-1 flex min-h-0 min-w-0 bg-black"
              >
                <ResizablePanel defaultSize={52} minSize={22} className="min-h-0 flex flex-col border-r border-white/10 bg-[#050505]">
                  <div className="flex-1 min-h-0 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                    <div className="max-w-3xl mx-auto w-full space-y-6">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={codingIdx === 0 && !hasMcq}
                            onClick={() => {
                              if (codingIdx > 0) setActivePanel(codingIdx - 1);
                              else if (hasMcq) setActivePanel("mcq");
                            }}
                            className="text-slate-400"
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />{" "}
                            {codingIdx === 0 && hasMcq ? "MCQs" : "Back"}
                          </Button>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                            Problem {codingIdx + 1} / {codingProblems.length}
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={codingIdx >= codingProblems.length - 1}
                            onClick={() => setActivePanel(codingIdx + 1)}
                            className="text-slate-400"
                          >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-primary shrink-0"
                          onClick={() => setProblemPaneCollapsed(true)}
                          title="Hide problem — wider code editor"
                        >
                          <PanelLeftClose className="h-4 w-4 mr-1" /> Hide problem
                        </Button>
                      </div>
                      <h2 className="text-xl font-bold text-white">{currentProblem?.title}</h2>
                      <AssessmentMarkdown>{studentSafeDescription}</AssessmentMarkdown>
                      <div className="space-y-3 text-sm">
                        <h4 className="font-semibold text-white">Input</h4>
                        <div className="text-slate-400 italic">
                          <AssessmentMarkdown>{String(currentProblem?.inputFormat || "—")}</AssessmentMarkdown>
                        </div>
                        <h4 className="font-semibold text-white">Output</h4>
                        <div className="text-slate-400 italic">
                          <AssessmentMarkdown>{String(currentProblem?.outputFormat || "—")}</AssessmentMarkdown>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Samples</h4>
                        {(currentProblem?.sampleTestCases || []).map((tc: any, i: number) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs space-y-2"
                          >
                            <div>
                              <span className="text-slate-500 font-bold">IN</span>
                              <pre className="text-slate-300 mt-1 whitespace-pre-wrap">{tc.input}</pre>
                            </div>
                            <div>
                              <span className="text-slate-500 font-bold">OUT</span>
                              <pre className="text-green-400/90 mt-1 whitespace-pre-wrap">{tc.output}</pre>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-slate-300">
                        <p className="font-semibold text-primary mb-1">Tips for {currentState.lang}</p>
                        <p>{hintText}</p>
                      </div>
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle className="w-2 bg-white/10 hover:bg-primary/25" />
                <ResizablePanel defaultSize={48} minSize={28} className="min-h-0 flex flex-col overflow-hidden bg-black p-2 gap-2">
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <AssessmentCodeEditor
                      sourceCode={currentCode}
                      setSourceCode={handleUpdateCode}
                      language={currentState.lang}
                      setLanguage={handleUpdateLang}
                      defaultCode={defaultCodeForEditor}
                      onRunSamples={handleRunSamples}
                      onRunAllTests={handleRunAllTests}
                      onSaveProgress={saveProgress}
                      isRunning={isRunning}
                      isSaving={isSavingDraft}
                    />
                  </div>
                  {runOutput !== null && (
                    <div className="shrink-0 max-h-36 overflow-auto rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-xs font-mono text-slate-300 whitespace-pre-wrap">
                      {runOutput}
                    </div>
                  )}
                </ResizablePanel>
              </ResizablePanelGroup>
            )
          ) : null}

        </div>
      </main>

      <AlertDialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
        <AlertDialogContent className="bg-[#050505] border-white/10 text-white sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Finish test?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Your answers will be graded and you won&apos;t be able to change them. Continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/15 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-black font-bold"
              onClick={() => {
                setFinishDialogOpen(false);
                void submitAssessment("COMPLETED");
              }}
            >
              Yes, submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={fullscreenRequiredOpen}>
        <AlertDialogContent className="bg-[#050505] border-white/10 text-white sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Fullscreen required</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Enter full screen then only test will start.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="bg-primary text-black font-bold"
              onClick={() => void requestExamFullscreen()}
            >
              Enter fullscreen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {postSubmitOpen ? (
        <AssessmentPostSubmitFeedback
          token={tokenData.token}
          testTitle={String(test.title ?? "Assessment")}
          onDone={() => window.location.reload()}
        />
      ) : null}

      <footer className="h-8 px-6 bg-[#050505] border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-medium shrink-0">
        <div className="flex gap-4 truncate">
          <span className="truncate">Student: {tokenData.studentEmail}</span>
          <span className="hidden sm:inline">IP: {tokenData.activatedIp || "—"}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-500/90">Secure connection active</span>
        </div>
      </footer>
    </div>
  );
}
