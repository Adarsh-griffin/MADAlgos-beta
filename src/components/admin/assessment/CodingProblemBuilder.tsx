"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, PlusCircle, FlaskConical } from "lucide-react";

export interface CodingProblem {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleTestCases: { input: string; output: string }[];
  hiddenTestCases: { input: string; output: string }[];
  marks: number;
  /** Per-language starter (Javascript, Python, Java, C++, C) */
  starterCode?: Record<string, string>;
}

interface CodingProblemBuilderProps {
  problems: CodingProblem[];
  onChange: (problems: CodingProblem[]) => void;
}

export function CodingProblemBuilder({ problems, onChange }: CodingProblemBuilderProps) {
  const addProblem = () => {
    onChange([
      ...problems,
      {
        title: "",
        description: "",
        inputFormat: "",
        outputFormat: "",
        sampleTestCases: [{ input: "", output: "" }],
        hiddenTestCases: [{ input: "", output: "" }],
        marks: 10,
      },
    ]);
  };

  const removeProblem = (index: number) => {
    onChange(problems.filter((_, i) => i !== index));
  };

  const updateProblem = (index: number, field: keyof CodingProblem, value: any) => {
    const updated = [...problems];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const addTestCase = (pIndex: number, type: "sample" | "hidden") => {
    const updated = [...problems];
    const field = type === "sample" ? "sampleTestCases" : "hiddenTestCases";
    updated[pIndex][field].push({ input: "", output: "" });
    onChange(updated);
  };

  const updateTestCase = (
    pIndex: number,
    tIndex: number,
    type: "sample" | "hidden",
    field: "input" | "output",
    value: string
  ) => {
    const updated = [...problems];
    const fName = type === "sample" ? "sampleTestCases" : "hiddenTestCases";
    updated[pIndex][fName][tIndex][field] = value;
    onChange(updated);
  };

  const removeTestCase = (pIndex: number, tIndex: number, type: "sample" | "hidden") => {
    const updated = [...problems];
    const fName = type === "sample" ? "sampleTestCases" : "hiddenTestCases";
    updated[pIndex][fName] = updated[pIndex][fName].filter((_, i) => i !== tIndex);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Coding Problems</h3>
        <Button
          type="button"
          onClick={addProblem}
          variant="outline"
          className="rounded-full gap-2 border-primary/50 text-primary hover:bg-primary/10"
        >
          <PlusCircle className="h-4 w-4" /> Add Problem
        </Button>
      </div>

      {problems.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl bg-white/5">
          <p className="text-slate-400">No coding problems added yet.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {problems.map((p, pIndex) => (
            <div
              key={pIndex}
              className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 space-y-6 relative"
            >
              <Button
                type="button"
                onClick={() => removeProblem(pIndex)}
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-slate-500 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {/* Title & Marks */}
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 md:col-span-9 space-y-2">
                  <Label className="text-slate-400">Problem Title</Label>
                  <Input
                    placeholder="e.g. Reverse a String"
                    value={p.title}
                    onChange={(e) => updateProblem(pIndex, "title", e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>
                <div className="col-span-12 md:col-span-3 space-y-2">
                  <Label className="text-slate-400">Marks</Label>
                  <Input
                    type="number"
                    value={p.marks}
                    onChange={(e) => updateProblem(pIndex, "marks", parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-slate-400">Problem Description (supports Markdown)</Label>
                <Textarea
                  placeholder="Describe the problem, input/output requirements, etc."
                  value={p.description}
                  onChange={(e) => updateProblem(pIndex, "description", e.target.value)}
                  className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-2xl"
                />
              </div>

              {/* Layout for IO Formats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-400">Input Format</Label>
                  <Textarea
                    placeholder="e.g. A single integer N followed by N space-separated..."
                    value={p.inputFormat}
                    onChange={(e) => updateProblem(pIndex, "inputFormat", e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-2xl h-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-400">Output Format</Label>
                  <Textarea
                    placeholder="e.g. Return the maximum sum of the subarray."
                    value={p.outputFormat}
                    onChange={(e) => updateProblem(pIndex, "outputFormat", e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-2xl h-24"
                  />
                </div>
              </div>

              {/* Test Cases */}
              <div className="space-y-6 pt-4">
                {/* Sample Test Cases */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Sample Test Cases (Visible to Students)</h4>
                    <Button
                      type="button"
                      onClick={() => addTestCase(pIndex, "sample")}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10"
                    >
                      <PlusCircle className="mr-2 h-3.5 w-3.5" /> Add Sample
                    </Button>
                  </div>
                  {p.sampleTestCases.map((tc, tcIndex) => (
                    <div key={tcIndex} className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                      <div className="md:col-span-5 space-y-1.5">
                        <Label className="text-[11px] text-slate-500">Input</Label>
                        <Textarea
                          value={tc.input}
                          onChange={(e) => updateTestCase(pIndex, tcIndex, "sample", "input", e.target.value)}
                          className="bg-black border-white/10 text-white h-20 text-xs font-mono"
                        />
                      </div>
                      <div className="md:col-span-5 space-y-1.5">
                        <Label className="text-[11px] text-slate-500">Expected Output</Label>
                        <Textarea
                          value={tc.output}
                          onChange={(e) => updateTestCase(pIndex, tcIndex, "sample", "output", e.target.value)}
                          className="bg-black border-white/10 text-white h-20 text-xs font-mono"
                        />
                      </div>
                      <div className="md:col-span-1 pb-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTestCase(pIndex, tcIndex, "sample")}
                          className="text-slate-600 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hidden Test Cases */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-red-400/80 flex items-center gap-2">
                       <FlaskConical className="h-4 w-4" /> Hidden Test Cases (For Grading)
                    </h4>
                    <Button
                      type="button"
                      onClick={() => addTestCase(pIndex, "hidden")}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-red-400/10"
                    >
                      <PlusCircle className="mr-2 h-3.5 w-3.5" /> Add Hidden
                    </Button>
                  </div>
                  {p.hiddenTestCases.map((tc, tcIndex) => (
                    <div key={tcIndex} className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end bg-red-400/[0.02] p-4 rounded-2xl border border-red-400/10">
                      <div className="md:col-span-5 space-y-1.5">
                        <Label className="text-[11px] text-slate-500">Input</Label>
                        <Textarea
                          value={tc.input}
                          onChange={(e) => updateTestCase(pIndex, tcIndex, "hidden", "input", e.target.value)}
                          className="bg-black border-white/10 text-white h-20 text-xs font-mono"
                        />
                      </div>
                      <div className="md:col-span-5 space-y-1.5">
                        <Label className="text-[11px] text-slate-500">Expected Output</Label>
                        <Textarea
                          value={tc.output}
                          onChange={(e) => updateTestCase(pIndex, tcIndex, "hidden", "output", e.target.value)}
                          className="bg-black border-white/10 text-white h-20 text-xs font-mono"
                        />
                      </div>
                      <div className="md:col-span-1 pb-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTestCase(pIndex, tcIndex, "hidden")}
                          className="text-slate-600 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
