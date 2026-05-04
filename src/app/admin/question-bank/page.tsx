import { redirect } from "next/navigation";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { QuestionBankAdminClient } from "@/components/admin/question-bank/QuestionBankAdminClient";

export const metadata = {
  title: "Question bank | MADAlgos Admin",
};

export default async function AdminQuestionBankPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  return <QuestionBankAdminClient />;
}
