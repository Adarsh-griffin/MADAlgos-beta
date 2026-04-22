import React from "react";
import { PracticeTestEditor } from "@/components/admin/practice-tests/PracticeTestEditor";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create practice test | MADAlgos Admin",
};

export default async function CreatePracticeTestPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  return <PracticeTestEditor />;
}
