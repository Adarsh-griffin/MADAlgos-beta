import { redirect } from "next/navigation";

/** Alias URL — same as /student */
export default function StudentPortalAliasPage() {
  redirect("/student");
}
