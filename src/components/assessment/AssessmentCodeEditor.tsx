"use client";

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { CodeXml, Copy, RotateCcw, Maximize2, Minimize2, Play } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown } from "lucide-react";

interface AssessmentCodeEditorProps {
  sourceCode: string;
  setSourceCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onRun?: () => void;
  isRunning?: boolean;
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
  onRun,
  isRunning = false,
}: AssessmentCodeEditorProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleResetCode = () => {
    if (confirm("Are you sure you want to reset your code? All progress for this problem will be lost.")) {
      setSourceCode("");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sourceCode);
    toast.success("Code copied to clipboard");
  };

  const monacoLanguage = JUDGE0_LANGUAGES[language as LanguageKey]?.monaco || "javascript";

  return (
    <div className={`flex flex-col flex-1 min-h-0 h-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-green-500/10 rounded-lg">
            <CodeXml className="h-4 w-4 text-green-500" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors outline-none">
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
          {onRun && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={onRun}
                  disabled={isRunning}
                  className="h-8 px-3 gap-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {isRunning ? "Running…" : "Run samples"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Execute against sample cases (Judge0)</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleCopyToClipboard} className="h-8 w-8 text-slate-400 hover:text-white">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Code</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleResetCode} className="h-8 w-8 text-slate-400 hover:text-red-400">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset Code</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setIsFullScreen(!isFullScreen)} className="h-8 w-8 text-slate-400 hover:text-white">
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Monaco Editor Instance */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language={monacoLanguage}
          value={sourceCode}
          onChange={(value) => setSourceCode(value ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            roundedSelection: true,
            padding: { top: 16 },
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
          }}
        />
      </div>
    </div>
  );
}

// Internal Button component specifically for the editor header to avoid importing the larger UI button if already in a complex layout
function Button({ className, variant, size, ...props }: any) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
