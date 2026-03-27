import mongoose, { Schema, model, models } from "mongoose";

export interface MentorshipOfferingDocument {
  id: number;
  durationMonths: number;
  ifSolo: boolean;
  groupSizes: number;
  price: number;
  currency: string;
  personalSessions: number;
  mockInterviews: number;
  expLabel: string;
  /** Market code (e.g. IND, USA, GBR) for region-specific pricing rows */
  region?: string;
}

const MentorshipOfferingSchema = new Schema<MentorshipOfferingDocument>(
  {
    id: { type: Number, required: true, unique: true },
    durationMonths: { type: Number, required: true },
    ifSolo: { type: Boolean, default: true },
    groupSizes: { type: Number, default: 0 },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    personalSessions: { type: Number, default: 0 },
    mockInterviews: { type: Number, default: 0 },
    expLabel: { type: String, default: "" },
    region: { type: String, required: false },
  },
  { collection: "mentorship_offerings" }
);

const MentorshipOfferingModel =
  (models.MentorshipOffering as mongoose.Model<MentorshipOfferingDocument>) ||
  model<MentorshipOfferingDocument>("MentorshipOffering", MentorshipOfferingSchema);

export default MentorshipOfferingModel;
