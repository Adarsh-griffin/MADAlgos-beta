/** Shared mentor shapes — used by `models/Mentor` and `@/lib/mentors` (avoids circular imports). */

export interface CareerCompany {
  role: string;
  startTime: string;
  endTime: string;
  companyName: string;
}

export interface CareerHistory {
  currentCompany?: CareerCompany | null;
  previousCompanies?: CareerCompany[] | null;
}

export interface MentorFeedback {
  id: number;
  mentorId: number;
  rating: number;
  review: string | null;
  userId: number;
  dateTime: string;
}

export interface InterviewerDetails {
  firstName: string;
  lastName: string | null;
  dispImageLink: string | null;
}

export interface Mentor {
  id: number;
  interviewerId: number;
  linkedin: string | null;
  location: string | null;
  description: string | null;
  quote: string | null;
  careerHistory?: CareerHistory | null;
  skills?: string[] | null;
  expYears: number;
  currentNumberOfMentees: number;
  maxNumberOfMentees: number;
  joiningDate: string;
  isActive: boolean;
  PSCharges: number | null;
  MockCharges: number | null;
  profileId: string;
  isVerified: boolean;
  posterLink: string | null;
  approvalStatus: string;
  maxFreeTrails: number | null;
  mentorFeedback?: MentorFeedback[] | null;
  interviewer?: InterviewerDetails | null;
}
