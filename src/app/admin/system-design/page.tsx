import React from "react";
import { redirect } from "next/navigation";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { SystemDesignBuilder } from "@/components/admin/system-design/SystemDesignBuilder";

export const metadata = {
  title: "System Design Builder | MADAlgos Admin",
};

export default async function SystemDesignBuilderPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">System Design Course Builder</h1>
        <p className="mt-1 text-sm text-slate-400">
          Notion-style editing with chapter/page hierarchy and publish control.
        </p>
      </div>
      <SystemDesignBuilder />
    </div>
  );
}
