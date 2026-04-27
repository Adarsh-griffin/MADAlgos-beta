"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { CodeXml, RotateCcw, Maximize2, Minimize2, Play, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
import { ChevronDown } from "lucide-react";

interface AssessmentCodeEditorProps {
  sourceCode: string;
  setSourceCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  /** Starter template for this problem + language (Reset restores this, not empty). */
  defaultCode: string;
  onRunSamples?: () => void;
  onRunAllTests?: () => void;
  onSaveProgress?: () => void;
  isRunning?: boolean;
  isSaving?: boolean;
}

export const JUDGE0_LANGUAGES = {
  C: { id: 50, monaco: "c" },
  "C++": { id: 54, monaco: "cpp" },
  Java: { id: 62, monaco: "java" },
  Javascript: { id: 93, monaco: "javascript" },
  Python: { id: 71, monaco: "python" },
};

export type LanguageKey = keyof typeof JUDGE0_LANGUAGES;

export default function AssessmentCodeEditor({
  sourceCode,
  setSourceCode,
  language,
  setLanguage,
  defaultCode,
  onRunSamples,
  onRunAllTests,
  onSaveProgress,
  isRunning = false,
  isSaving = false,
}: AssessmentCodeEditorProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [editorTheme, setEditorTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("assessment-editor-theme");
    if (stored === "light" || stored === "dark") setEditorTheme(stored);
  }, []);

  useEffect(() => {
    if (!isFullScreen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setIsFullScreen(false);
    };
    // Capture phase ensures editor fullscreen exits first.
    window.addEventListener("keydown", onEscape, true);
    return () => window.removeEventListener("keydown", onEscape, true);
  }, [isFullScreen]);

  const toggleEditorTheme = () => {
    const next = editorTheme === "dark" ? "light" : "dark";
    setEditorTheme(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("assessment-editor-theme", next);
    }
  };

  const applyResetCode = () => {
    setSourceCode(defaultCode);
    setResetDialogOpen(false);
  };

  const monacoLanguage = JUDGE0_LANGUAGES[language as LanguageKey]?.monaco || "javascript";

  const isDark = editorTheme === "dark";
  const monacoTheme = isDark ? "vs-dark" : "vs";

  return (
    <div
      className={`flex flex-col flex-1 min-h-0 h-full max-h-full border rounded-2xl overflow-hidden ${
        isDark ? "bg-[#0a0a0a] border-white/10" : "bg-white border-slate-300"
      } ${isFullScreen ? "fixed inset-0 z-40 rounded-none" : ""}`}
    >
      {isFullScreen ? (
        <div
          className={`shrink-0 px-3 py-1.5 text-[11px] border-b ${
            isDark ? "bg-primary/15 text-primary border-primary/20" : "bg-emerald-100 text-emerald-800 border-emerald-300"
          }`}
        >
          Press <span className="font-semibold">Esc</span> or click the minimize icon to return to the test view.
        </div>
      ) : null}

      {/* Editor Header */}
      <div
        className={`shrink-0 flex items-center justify-between px-4 py-2 border-b ${
          isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-green-500/10 rounded-lg">
            <CodeXml className="h-4 w-4 text-green-500" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-2 text-sm font-medium transition-colors outline-none ${
                isDark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"
              }`}
            >
              {language} <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-[#0f0f0f] border-white/10">
              {Object.keys(JUDGE0_LANGUAGES).map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="text-slate-300 focus:bg-white/5 focus:text-white"
                >
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          {onRunSamples && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onRunSamples}
                  disabled={isRunning}
                  className={`h-8 px-3 gap-1.5 rounded-lg ${
                    isDark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {isRunning ? "Running…" : "Run sample tests"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Execute against sample cases (Judge0)</TooltipContent>
            </Tooltip>
          )}
          {onRunAllTests && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onRunAllTests}
                  disabled={isRunning}
                  className={`h-8 px-3 gap-1.5 rounded-lg ${
                    isDark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {isRunning ? "Running…" : "Run all tests"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Execute against sample + hidden test cases</TooltipContent>
            </Tooltip>
          )}
          {onSaveProgress && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onSaveProgress}
                  disabled={isSaving}
                  className={`h-8 px-3 gap-1.5 rounded-lg ${
                    isDark ? "text-slate-300 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  {isSaving ? "Saving…" : "Submit test (save)"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save current answers/code to backend without finishing</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setResetDialogOpen(true)}
                className={`h-8 w-8 ${isDark ? "text-slate-400 hover:text-red-400" : "text-slate-500 hover:text-red-600"}`}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset Code</TooltipContent>
          </Tooltip>

          <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogContent className="bg-[#050505] border-white/10 text-white sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset code?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Replace your editor with the default starter for {language}. Your current edits will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-white/15 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 text-white hover:bg-red-600/90 font-semibold" onClick={applyResetCode}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleEditorTheme}
                className={`h-8 w-8 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isDark ? "Switch to light editor" : "Switch to dark editor"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={`h-8 w-8 ${isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Monaco: bounded flex child so only the editor scrolls, not the page */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className={`shrink-0 px-3 py-2 text-[11px] font-semibold tracking-wide ${
            isDark ? "bg-primary/10 text-primary border-b border-primary/20" : "bg-emerald-100 text-emerald-800 border-b border-emerald-300"
          }`}
        >
          Edit inside <code className="font-mono text-[10px]">solve</code> where you see{" "}
          <code className="font-mono text-[10px]">START CODING HERE</code> (banner at top + markers in{" "}
          <code className="font-mono text-[10px]">solve</code>).
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={monacoLanguage}
            value={sourceCode}
            onChange={(value) => setSourceCode(value ?? "")}
            theme={monacoTheme}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              roundedSelection: true,
              padding: { top: 16 },
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              scrollbar: {
                vertical: "visible",
                horizontal: "auto",
                verticalScrollbarSize: 12,
                horizontalScrollbarSize: 12,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Internal Button component specifically for the editor header to avoid importing the larger UI button if already in a complex layout
function Button({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
