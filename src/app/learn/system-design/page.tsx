import React from "react";
import SystemDesignCourseClient from "@/components/learn/SystemDesignCourseClient";

export const metadata = {
  title: "System design course | MADAlgos",
  description:
    "Learn system design with a structured course: core concepts, patterns, and interview preparation.",
};

/** Full-bleed course shell with hardcoded lesson content (`SystemDesignCourseClient` + lesson modules). */
export default function SystemDesignCoursePage() {
  return <SystemDesignCourseClient />;
}
