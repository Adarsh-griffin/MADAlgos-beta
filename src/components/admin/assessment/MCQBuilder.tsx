"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, PlusCircle } from "lucide-react";

export interface MCQ {
  questionText: string;
  options: string[];
  correctOption: number;
  correctOptions?: number[];
  selectionType?: "single" | "multiple";
  marks: number;
}

interface MCQBuilderProps {
  questions: MCQ[];
  onChange: (questions: MCQ[]) => void;
}

export function MCQBuilder({ questions, onChange }: MCQBuilderProps) {
  const addQuestion = () => {
    onChange([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctOption: 0,
        correctOptions: [0, 1],
        selectionType: "single",
        marks: 1,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof MCQ, value: unknown) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value } as MCQ;
    onChange(updated);
  };

  const setSelectionType = (qIndex: number, st: "single" | "multiple") => {
    const q = questions[qIndex];
    const n = q.options.length;
    if (st === "single") {
      const first = typeof q.correctOption === "number" ? q.correctOption : (q.correctOptions?.[0] ?? 0);
      const c = Math.min(Math.max(0, first), Math.max(0, n - 1));
      updateQuestion(qIndex, "selectionType", "single");
      updateQuestion(qIndex, "correctOption", c);
      updateQuestion(qIndex, "correctOptions", []);
    } else {
      const a = typeof q.correctOption === "number" ? q.correctOption : 0;
      const b = n > 1 ? (a === 0 ? 1 : 0) : a;
      updateQuestion(qIndex, "selectionType", "multiple");
      updateQuestion(qIndex, "correctOptions", [...new Set([a, b].filter((i) => i >= 0 && i < n))].sort((x, y) => x - y));
      updateQuestion(qIndex, "correctOption", a);
    }
  };

  const toggleCorrectMulti = (qIndex: number, oIdx: number) => {
    const q = questions[qIndex];
    const n = q.options.length;
    const cur = new Set(q.correctOptions ?? [0, 1]);
    if (cur.has(oIdx)) cur.delete(oIdx);
    else cur.add(oIdx);
    let next = [...cur].filter((i) => i >= 0 && i < n).sort((a, b) => a - b);
    if (next.length < 2) {
      next = [0, Math.min(1, n - 1)].filter((v, i, arr) => arr.indexOf(v) === i).sort((a, b) => a - b);
      if (next.length < 2 && n >= 2) next = [0, 1];
    }
    updateQuestion(qIndex, "correctOptions", next);
    updateQuestion(qIndex, "correctOption", next[0] ?? 0);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Multiple Choice Questions</h3>
        <Button
          type="button"
          onClick={addQuestion}
          variant="outline"
          className="rounded-full gap-2 border-primary/50 text-primary hover:bg-primary/10"
        >
          <PlusCircle className="h-4 w-4" /> Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl bg-white/5">
          <p className="text-slate-400">No MCQs added yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {questions.map((q, qIndex) => {
            const isMulti = q.selectionType === "multiple";
            const correctMulti = new Set(q.correctOptions ?? []);
            return (
              <div
                key={qIndex}
                className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 space-y-4 relative group"
              >
                <Button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-10 space-y-2">
                    <Label className="text-slate-400">Question {qIndex + 1}</Label>
                    <Input
                      placeholder="Enter question text..."
                      value={q.questionText}
                      onChange={(e) => updateQuestion(qIndex, "questionText", e.target.value)}
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label className="text-slate-400">Marks</Label>
                    <Input
                      type="number"
                      value={q.marks}
                      onChange={(e) => updateQuestion(qIndex, "marks", parseInt(e.target.value, 10))}
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Answer type</Label>
                  <RadioGroup
                    value={isMulti ? "multiple" : "single"}
                    onValueChange={(v) => setSelectionType(qIndex, v === "multiple" ? "multiple" : "single")}
                    className="flex flex-wrap gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="single" id={`st-s-${qIndex}`} />
                      <Label htmlFor={`st-s-${qIndex}`} className="text-slate-400 cursor-pointer">
                        Single answer (radio)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="multiple" id={`st-m-${qIndex}`} />
                      <Label htmlFor={`st-m-${qIndex}`} className="text-slate-400 cursor-pointer">
                        Multiple correct (checkboxes)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {!isMulti ? (
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label className="text-slate-300">Correct answer</Label>
                      <p className="text-[11px] text-slate-500 mt-0.5">Select one option as correct.</p>
                    </div>
                    <RadioGroup
                      value={String(q.correctOption)}
                      onValueChange={(v) => updateQuestion(qIndex, "correctOption", parseInt(v, 10))}
                      className="space-y-3"
                    >
                      {q.options.map((opt, oIndex) => {
                        const letter = String.fromCharCode(65 + oIndex);
                        const id = `mcq-${qIndex}-opt-${oIndex}`;
                        return (
                          <div
                            key={oIndex}
                            className={`flex items-start gap-3 rounded-2xl border p-3 transition-colors ${
                              q.correctOption === oIndex
                                ? "border-primary/50 bg-primary/5"
                                : "border-white/10 bg-white/[0.02]"
                            }`}
                          >
                            <RadioGroupItem value={String(oIndex)} id={id} className="mt-1.5" />
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <Label htmlFor={id} className="text-slate-400 text-xs font-semibold">
                                Option {letter}
                              </Label>
                              <Input
                                placeholder={`Text for option ${letter}`}
                                value={opt}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                className="bg-white/5 border-white/10 text-white rounded-xl"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                ) : (
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label className="text-slate-300">Correct answers</Label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Check every option that must be selected for full credit (at least two).
                      </p>
                    </div>
                    <div className="space-y-3">
                      {q.options.map((opt, oIndex) => {
                        const letter = String.fromCharCode(65 + oIndex);
                        const id = `mcq-m-${qIndex}-${oIndex}`;
                        return (
                          <div
                            key={oIndex}
                            className={`flex items-start gap-3 rounded-2xl border p-3 transition-colors ${
                              correctMulti.has(oIndex)
                                ? "border-primary/50 bg-primary/5"
                                : "border-white/10 bg-white/[0.02]"
                            }`}
                          >
                            <Checkbox
                              id={id}
                              checked={correctMulti.has(oIndex)}
                              onCheckedChange={() => toggleCorrectMulti(qIndex, oIndex)}
                              className="mt-1.5 border-white/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <Label htmlFor={id} className="text-slate-400 text-xs font-semibold">
                                Option {letter}
                              </Label>
                              <Input
                                placeholder={`Text for option ${letter}`}
                                value={opt}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                className="bg-white/5 border-white/10 text-white rounded-xl"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
