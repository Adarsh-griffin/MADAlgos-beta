"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Clock, ChevronLeft, ChevronRight, ListChecks, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssessmentCodeEditor from "./AssessmentCodeEditor";
import { toast } from "sonner";

interface TestRoomProps {
  test: any;
  tokenData: any;
}

export function TestRoom({ test, tokenData }: TestRoomProps) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeSection, setActiveSection] = useState<"mcq" | "coding">("mcq");
  
  // MCQ State
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  
  // Coding State
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [problemStates, setProblemStates] = useState<Record<number, { code: string; lang: string }>>(
    test.codingProblems.reduce((acc: any, _: any, idx: number) => {
      acc[idx] = { code: "", lang: "Javascript" };
      return acc;
    }, {})
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const mcqAnswersRef = useRef(mcqAnswers);
  const problemStatesRef = useRef(problemStates);
  const isSubmittingRef = useRef(false);
  const currentProblemIdxRef = useRef(currentProblemIdx);

  useEffect(() => {
    mcqAnswersRef.current = mcqAnswers;
    problemStatesRef.current = problemStates;
    currentProblemIdxRef.current = currentProblemIdx;
  });

  const submitAssessment = useCallback(async (submitStatus: "COMPLETED" | "AUTO_SUBMITTED" = "COMPLETED") => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const ma = mcqAnswersRef.current;
      const ps = problemStatesRef.current;
      const payload = {
        token: tokenData.token,
        mcqAnswers: Object.entries(ma).map(([idx, opt]) => ({
          questionIndex: parseInt(idx, 10),
          selectedOption: opt,
        })),
        codingSubmissions: Object.entries(ps).map(([idx, state]) => ({
          problemIndex: parseInt(idx, 10),
          sourceCode: state.code,
          language: state.lang,
        })),
        status: submitStatus,
      };

      const res = await fetch("/api/assessment/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          submitStatus === "AUTO_SUBMITTED" ? "Time is up — responses saved." : "Assessment submitted successfully!"
        );
        window.location.reload();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Submission failed.");
      }
    } catch {
      toast.error("Network error. Please try again or contact support.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [tokenData.token]);

  // Initialize Timer
  useEffect(() => {
    const startTime = new Date(tokenData.usedAt || new Date()).getTime();
    const durationMs = test.duration * 60 * 1000;
    const endTime = startTime + durationMs;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        void submitAssessment("AUTO_SUBMITTED");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [test.duration, tokenData.usedAt, submitAssessment]);

  const handleRunSamples = async () => {
    setIsRunning(true);
    setRunOutput(null);
    try {
      const idx = currentProblemIdxRef.current;
      const state = problemStatesRef.current[idx];
      if (!state?.code?.trim()) {
        toast.error("Write some code before running.");
        return;
      }
      const res = await fetch("/api/assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenData.token,
          problemIndex: idx,
          sourceCode: state.code,
          language: state.lang,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Run failed.");
        return;
      }
      const lines = (data.results as Array<{ passed: boolean; status: string; stdout?: string; stderr?: string }>).map(
        (r, i) =>
          `Sample ${i + 1}: ${r.passed ? "PASS" : "FAIL"} (${r.status})\nstdout:\n${r.stdout ?? ""}\nstderr:\n${r.stderr ?? ""}`
      );
      setRunOutput(lines.join("\n\n---\n\n"));
    } catch {
      toast.error("Network error while running code.");
    } finally {
      setIsRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleMcqSelect = (qIdx: number, oIdx: number) => {
    setMcqAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleUpdateCode = (code: string) => {
    setProblemStates((prev) => ({
      ...prev,
      [currentProblemIdx]: { ...(prev[currentProblemIdx] ?? { code: "", lang: "Javascript" }), code },
    }));
  };

  const handleUpdateLang = (lang: string) => {
    setProblemStates((prev) => ({
      ...prev,
      [currentProblemIdx]: { ...(prev[currentProblemIdx] ?? { code: "", lang: "Javascript" }), lang },
    }));
  };

  const hasCoding = test.codingProblems.length > 0;
  const currentProblem = hasCoding
    ? (problemStates[currentProblemIdx] ?? { code: "", lang: "Javascript" })
    : { code: "", lang: "Javascript" };

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Test Room Header */}
      <header className="h-16 px-6 border-b border-white/10 bg-[#050505] flex items-center justify-between z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-black font-bold">M</div>
            <span className="font-bold tracking-tight text-lg hidden sm:inline-block">MADAlgos <span className="text-primary font-normal">TestPortal</span></span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <h1 className="text-slate-300 font-medium truncate max-w-[200px] md:max-w-md">{test.title}</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${timeLeft < 300 ? 'text-red-500 border-red-500/30 bg-red-500/5' : 'text-slate-300 border-white/10 bg-white/5'} font-mono text-lg font-bold transition-colors`}>
            <Clock className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
          <Button 
            onClick={() => { if(confirm("Are you sure you want to finish the test?")) void submitAssessment("COMPLETED"); }} 
            disabled={isSubmitting}
            className="rounded-full bg-primary hover:bg-primary/90 text-black px-6 font-bold"
          >
            {isSubmitting ? "Submitting..." : "Finish Test"}
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden relative min-h-0">
        {!hasCoding ? (
          <div className="h-full bg-[#050505] flex flex-col border-r border-white/10">
            <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/10">
              <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium bg-white/10 text-white">
                <ListChecks className="h-4 w-4" /> Multiple Choice
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="space-y-8">
                {test.mcqs.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="space-y-4">
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-bold">
                        {qIdx + 1}
                      </span>
                      <div className="space-y-2">
                        <p className="text-lg font-medium text-white leading-relaxed">{q.questionText}</p>
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{q.marks} Marks</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 pl-12">
                      {q.options.map((opt: string, oIdx: number) => (
                        <button
                          key={oIdx}
                          onClick={() => handleMcqSelect(qIdx, oIdx)}
                          className={`group flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                            mcqAnswers[qIdx] === oIdx
                              ? "bg-primary/10 border-primary/50 text-white ring-1 ring-primary/20"
                              : "bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="flex-1 pr-4">{opt}</span>
                          <div
                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              mcqAnswers[qIdx] === oIdx ? "border-primary bg-primary" : "border-slate-700"
                            }`}
                          >
                            {mcqAnswers[qIdx] === oIdx && <div className="h-2 w-2 rounded-full bg-black" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="h-20" />
              </div>
            </div>
          </div>
        ) : (
        <PanelGroup direction="horizontal" className="h-full">
          {/* Left Panel: MCQs or Problem Description */}
          <Panel defaultSize={40} minSize={30} className="bg-[#050505] flex flex-col border-r border-white/10">
            <div className="flex items-center gap-1 p-2 bg-white/5 border-b border-white/10">
              <button 
                onClick={() => setActiveSection("mcq")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === "mcq" ? 'bg-white/10 text-white shadow-lg shadow-black/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <ListChecks className="h-4 w-4" /> Multiple Choice
              </button>
              <button 
                onClick={() => setActiveSection("coding")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === "coding" ? 'bg-white/10 text-white shadow-lg shadow-black/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Code2 className="h-4 w-4" /> Coding Problems
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeSection === "mcq" ? (
                <div className="space-y-8">
                  {test.mcqs.map((q: any, qIdx: number) => (
                    <div key={qIdx} className="space-y-4">
                      <div className="flex gap-4">
                        <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-bold">
                          {qIdx + 1}
                        </span>
                        <div className="space-y-2">
                          <p className="text-lg font-medium text-white leading-relaxed">{q.questionText}</p>
                          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{q.marks} Marks</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 pl-12">
                        {q.options.map((opt: string, oIdx: number) => (
                          <button
                            key={oIdx}
                            onClick={() => handleMcqSelect(qIdx, oIdx)}
                            className={`group flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                              mcqAnswers[qIdx] === oIdx 
                                ? 'bg-primary/10 border-primary/50 text-white ring-1 ring-primary/20' 
                                : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[0.04]'
                            }`}
                          >
                            <span className="flex-1 pr-4">{opt}</span>
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              mcqAnswers[qIdx] === oIdx ? 'border-primary bg-primary' : 'border-slate-700'
                            }`}>
                              {mcqAnswers[qIdx] === oIdx && <div className="h-2 w-2 rounded-full bg-black" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="h-20" />
                </div>
              ) : (
                <div className="space-y-8">
                   <div className="flex items-center justify-between bg-white/[0.03] p-4 rounded-3xl border border-white/10">
                      <button 
                        disabled={currentProblemIdx === 0}
                        onClick={() => setCurrentProblemIdx(i => i - 1)}
                        className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                      >
                         <ChevronLeft className="h-6 w-6" />
                      </button>
                      <div className="text-center">
                         <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-0.5">Problem {currentProblemIdx + 1} of {test.codingProblems.length}</p>
                         <h3 className="font-bold text-lg">{test.codingProblems[currentProblemIdx].title}</h3>
                      </div>
                      <button 
                         disabled={currentProblemIdx === test.codingProblems.length - 1}
                         onClick={() => setCurrentProblemIdx(i => i + 1)}
                         className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                      >
                         <ChevronRight className="h-6 w-6" />
                      </button>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="prose prose-invert max-w-none">
                         <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{test.codingProblems[currentProblemIdx].description}</p>
                      </div>

                      <div className="space-y-4 pt-4">
                         <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Input Format</h4>
                            <p className="text-slate-400 text-sm italic">{test.codingProblems[currentProblemIdx].inputFormat || "Standard input format applies."}</p>
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Output Format</h4>
                            <p className="text-slate-400 text-sm italic">{test.codingProblems[currentProblemIdx].outputFormat || "Standard output format applies."}</p>
                         </div>
                      </div>

                      <div className="space-y-4 pt-6">
                         <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500">Sample Test Cases</h4>
                         {test.codingProblems[currentProblemIdx].sampleTestCases.map((tc: any, i: number) => (
                           <div key={i} className="p-4 rounded-2xl bg-black border border-white/10 space-y-3">
                              <div className="space-y-1">
                                 <p className="text-[10px] text-slate-500 font-bold uppercase">Input</p>
                                 <code className="text-xs text-slate-300 block bg-white/5 p-2 rounded-lg">{tc.input}</code>
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] text-slate-500 font-bold uppercase">Expected Output</p>
                                 <code className="text-xs text-green-400 block bg-green-400/5 p-2 rounded-lg">{tc.output}</code>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              )}
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-black hover:bg-primary/20 transition-colors flex items-center justify-center group">
             <div className="h-8 w-1 rounded-full bg-white/10 group-hover:bg-primary/40" />
          </PanelResizeHandle>

          {/* Right Panel: Code Editor */}
          <Panel defaultSize={60} minSize={40} className="bg-black flex flex-col p-2 gap-2 min-h-0">
            <div className="flex-1 min-h-0 flex flex-col">
            <AssessmentCodeEditor 
              sourceCode={currentProblem.code}
              setSourceCode={handleUpdateCode}
              language={currentProblem.lang}
              setLanguage={handleUpdateLang}
              onRun={handleRunSamples}
              isRunning={isRunning}
            />
            </div>
            {runOutput !== null && (
              <div className="shrink-0 max-h-40 overflow-auto rounded-xl border border-white/10 bg-[#0a0a0a] p-3 text-xs font-mono text-slate-300 whitespace-pre-wrap">
                {runOutput}
              </div>
            )}
          </Panel>
        </PanelGroup>
        )}
      </main>

      {/* Footer / Meta */}
      <footer className="h-8 px-6 bg-[#050505] border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-medium">
         <div className="flex gap-4">
            <span>Student: {tokenData.studentEmail}</span>
            <span>IP Locked: {tokenData.activatedIp || "Syncing..."}</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Secure Connection Active</span>
         </div>
      </footer>
    </div>
  );
}
