import { NextResponse } from "next/server";
import {
  getAllMentors,
  getMentorCompaniesLine,
  getMentorDisplayName,
  getMentorHeadline,
} from "@/lib/mentors";

export const dynamic = "force-dynamic";

/** Public list for mentorship booking — same visibility as /mentors (active + approved). */
export async function GET() {
  const mentors = await getAllMentors();
  const list = mentors.map((m) => ({
    id: m.id,
    name: getMentorDisplayName(m),
    headline: getMentorHeadline(m),
    companies: getMentorCompaniesLine(m),
  }));
  return NextResponse.json({ mentors: list });
}
