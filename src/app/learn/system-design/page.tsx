import React from "react";
import SystemDesignCourseClient from "@/components/learn/SystemDesignCourseClient";

export const metadata = {
  title: "System design course | MADAlgos",
  description:
    "Learn system design with a structured course: core concepts, patterns, and interview preparation.",
};

/** Full-bleed learning shell — no site navbar/footer for a focused, premium reader layout. */
export default function SystemDesignCoursePage() {
  return (
    <div className="min-h-[100dvh] bg-[#0a0b14] text-foreground antialiased">
      <SystemDesignCourseClient />
    </div>
  );
}
