import React from "react";
import { PracticeTestEditor } from "@/components/admin/practice-tests/PracticeTestEditor";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit practice test | MADAlgos Admin",
};

export default async function EditPracticeTestPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  const { id } = await params;
  return <PracticeTestEditor editId={id} />;
}
