import mongoose, { Schema, model, models, Document } from "mongoose";
import type {
  CareerCompany,
  CareerHistory,
  InterviewerDetails,
  Mentor,
  MentorFeedback,
} from "@/types/mentor";

export type MentorDocument = Mentor & Document;

const CareerCompanySchema = new Schema<CareerCompany>(
  {
    role: String,
    startTime: String,
    endTime: String,
    companyName: String,
  },
  { _id: false }
);

const CareerHistorySchema = new Schema<CareerHistory>(
  {
    currentCompany: { type: CareerCompanySchema, default: null },
    previousCompanies: { type: [CareerCompanySchema], default: [] },
  },
  { _id: false }
);

const MentorFeedbackSchema = new Schema<MentorFeedback>(
  {
    id: Number,
    mentorId: Number,
    rating: Number,
    review: { type: String, default: null },
    userId: Number,
    dateTime: String,
  },
  { _id: false }
);

const InterviewerSchema = new Schema<InterviewerDetails>(
  {
    firstName: String,
    lastName: { type: String, default: null },
    dispImageLink: { type: String, default: null },
  },
  { _id: false }
);

const MentorSchema = new Schema<MentorDocument>(
  {
    id: { type: Number, required: true, unique: true },
    interviewerId: { type: Number, required: true },
    linkedin: { type: String, default: null },
    location: { type: String, default: null },
    description: { type: String, default: null },
    quote: { type: String, default: null },
    careerHistory: { type: CareerHistorySchema, default: null },
    skills: { type: [String], default: [] },
    expYears: { type: Number, default: 0 },
    currentNumberOfMentees: { type: Number, default: 0 },
    maxNumberOfMentees: { type: Number, default: 0 },
    joiningDate: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    PSCharges: { type: Number, default: null },
    MockCharges: { type: Number, default: null },
    profileId: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    posterLink: { type: String, default: null },
    approvalStatus: { type: String, default: "APPROVED" },
    maxFreeTrails: { type: Number, default: null },
    mentorFeedback: { type: [MentorFeedbackSchema], default: [] },
    interviewer: { type: InterviewerSchema, default: null },
  },
  {
    collection: "mentors",
  }
);

const MentorModel =
  (models.Mentor as mongoose.Model<MentorDocument>) ||
  model<MentorDocument>("Mentor", MentorSchema);

export default MentorModel;

