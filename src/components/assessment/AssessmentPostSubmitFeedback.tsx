"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

type AssessmentPostSubmitFeedbackProps = {
  token: string;
  testTitle: string;
  /** Called after skip or successful feedback submit (reload thank-you). */
  onDone: () => void;
};

const RATINGS = [1, 2, 3, 4, 5] as const;

export function AssessmentPostSubmitFeedback({ token, testTitle, onDone }: AssessmentPostSubmitFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sendFeedback = async (skip: boolean) => {
    if (!skip && rating === null) {
      toast.error("Pick a rating, or tap Skip feedback.");
      return;
    }
    setSubmitting(true);
    try {
      if (!skip) {
        const res = await fetch("/api/assessment/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            rating: rating ?? undefined,
            comment: comment.trim() || undefined,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(String(data.message || "Could not save feedback."));
          return;
        }
        toast.success("Thanks for your feedback.");
      }
      onDone();
    } catch {
      toast.error("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#050505] p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-white">You&apos;re done</h1>
          <p className="text-slate-400 text-sm">
            <span className="text-slate-300 font-medium">{testTitle}</span> has been submitted. Optional: rate the experience.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">How was this assessment?</Label>
          <div className="flex justify-center gap-2">
            {RATINGS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`h-11 w-11 rounded-xl border text-sm font-bold transition-colors ${
                  rating === n
                    ? "border-primary bg-primary/20 text-primary"
                    : "border-white/15 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 text-center">1 = poor · 5 = excellent</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback-comment" className="text-slate-300">
            Comments (optional)
          </Label>
          <Textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What went well? What could improve?"
            rows={3}
            maxLength={2000}
            className="resize-none bg-black/50 border-white/15 text-slate-200 placeholder:text-slate-600"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-white/20 text-slate-300 hover:bg-white/10"
            disabled={submitting}
            onClick={() => void sendFeedback(true)}
          >
            Skip
          </Button>
          <Button
            type="button"
            className="rounded-full bg-primary text-black font-bold"
            disabled={submitting || rating === null}
            onClick={() => void sendFeedback(false)}
          >
            {submitting ? "Sending..." : "Send feedback"}
          </Button>
        </div>
      </div>
    </div>
  );
}
