import mongoose, { Schema, model, models } from "mongoose";

/** Sellable mock interview row (matches legacy mockInterviewOfferings usage). */
const MOCK_TYPE_VALUES = ["DSA", "SYS_DES", "BEH_LED", "ML", "FRONTEND", "DEVOPS"] as const;

export interface MockInterviewOfferingDocument {
  id: number;
  mockType: (typeof MOCK_TYPE_VALUES)[number];
  expLevel: number;
  label: string;
  price: number;
  rushPrice: number;
  currency: string;
  /** Market code (e.g. IND, USA, GBR) for region-specific pricing rows */
  region?: string;
}

const MockInterviewOfferingSchema = new Schema<MockInterviewOfferingDocument>(
  {
    id: { type: Number, required: true, unique: true },
    mockType: { type: String, required: true, enum: [...MOCK_TYPE_VALUES] },
    expLevel: { type: Number, required: true },
    label: { type: String, required: true },
    price: { type: Number, required: true },
    rushPrice: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    region: { type: String, required: false },
  },
  { collection: "mock_interview_offerings" }
);

const MockInterviewOfferingModel =
  (models.MockInterviewOffering as mongoose.Model<MockInterviewOfferingDocument>) ||
  model<MockInterviewOfferingDocument>("MockInterviewOffering", MockInterviewOfferingSchema);

export default MockInterviewOfferingModel;
