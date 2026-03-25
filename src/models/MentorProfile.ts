import mongoose, { Schema, model, models } from "mongoose";

export interface MentorProfileDocument {
  userId: mongoose.Types.ObjectId;
  headline: string;
  companies: string;
  location: string | null;
  description: string;
  skills: string[];
  imageUrl: string | null;
  linkedin: string | null;
  reviewStatus: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const MentorProfileSchema = new Schema<MentorProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    headline: { type: String, default: "" },
    companies: { type: String, default: "" },
    location: { type: String, default: null },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
    imageUrl: { type: String, default: null },
    linkedin: { type: String, default: null },
    reviewStatus: {
      type: String,
      enum: ["PENDING_REVIEW", "APPROVED", "REJECTED"],
      default: "PENDING_REVIEW",
      index: true,
    },
    rejectionReason: { type: String, default: null },
  },
  { collection: "mentor_profiles", timestamps: true }
);

const MentorProfileModel =
  (models.MentorProfile as mongoose.Model<MentorProfileDocument>) ||
  model<MentorProfileDocument>("MentorProfile", MentorProfileSchema);

export default MentorProfileModel;

