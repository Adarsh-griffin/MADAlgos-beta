"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, PlusCircle } from "lucide-react";

export interface MCQ {
  questionText: string;
  options: string[];
  correctOption: number;
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
      { questionText: "", options: ["", "", "", ""], correctOption: 0, marks: 1 },
    ]);
  };

  const removeQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof MCQ, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
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
          {questions.map((q, qIndex) => (
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
                    onChange={(e) => updateQuestion(qIndex, "marks", parseInt(e.target.value))}
                    className="bg-white/5 border-white/10 text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-3 mt-2">
                <div>
                  <Label className="text-slate-300">Correct answer</Label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select which option is graded as correct (A–D).
                  </p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
