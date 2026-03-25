import { connectDB } from "./mongodb";
import MentorModel from "@/models/Mentor";
import type {
  CareerCompany,
  CareerHistory,
  MentorFeedback,
  InterviewerDetails,
  Mentor,
} from "@/types/mentor";

export type {
  CareerCompany,
  CareerHistory,
  MentorFeedback,
  InterviewerDetails,
  Mentor,
} from "@/types/mentor";

export async function getAllMentors(): Promise<Mentor[]> {
  await connectDB();
  const docs = await MentorModel.find({
    isActive: true,
    approvalStatus: "APPROVED",
  })
    .sort({ joiningDate: -1 })
    .lean<Mentor[]>()
    .exec();
  return docs;
}

export async function getMentorById(id: number): Promise<Mentor | null> {
  await connectDB();
  const doc = await MentorModel.findOne({ id }).lean<Mentor | null>().exec();
  return doc;
}

export function getMentorDisplayName(mentor: Mentor): string {
  const i = mentor.interviewer;
  if (!i) return mentor.profileId?.replace(/_/g, " ") || "Mentor";
  const parts = [i.firstName, i.lastName].filter(Boolean);
  return parts.length ? parts.join(" ") : "Mentor";
}

export function getMentorHeadline(mentor: Mentor): string {
  const current = mentor.careerHistory?.currentCompany;
  if (!current?.role && !current?.companyName) return "Mentor";
  if (current.role && current.companyName) return `${current.role} at ${current.companyName}`;
  return current.role || current.companyName || "Mentor";
}

export function getMentorCompaniesLine(mentor: Mentor): string {
  const current = mentor.careerHistory?.currentCompany?.companyName;
  const prev = mentor.careerHistory?.previousCompanies
    ?.map((c) => c.companyName)
    .filter(Boolean);
  const uniq = [current, ...(prev ?? [])].filter(Boolean) as string[];
  return uniq.slice(0, 3).join(" | ");
}

export function getMentorRating(mentor: Mentor): {
  avg: number;
  count: number;
} {
  const feedback = mentor.mentorFeedback ?? [];
  if (!feedback.length) return { avg: 0, count: 0 };
  const sum = feedback.reduce((acc, f) => acc + (Number(f.rating) || 0), 0);
  const avg = sum / feedback.length;
  return { avg, count: feedback.length };
}

export function formatMentorJoinedDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);
}
