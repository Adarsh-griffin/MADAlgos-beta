import mongoose, { Schema, model, models } from "mongoose";

/** Sellable mock interview row (matches legacy mockInterviewOfferings usage). */
export interface MockInterviewOfferingDocument {
  id: number;
  mockType: "DSA" | "SYS_DES" | "BEH_LED";
  expLevel: number;
  label: string;
  price: number;
  rushPrice: number;
  currency: string;
}

const MockInterviewOfferingSchema = new Schema<MockInterviewOfferingDocument>(
  {
    id: { type: Number, required: true, unique: true },
    mockType: { type: String, required: true, enum: ["DSA", "SYS_DES", "BEH_LED"] },
    expLevel: { type: Number, required: true },
    label: { type: String, required: true },
    price: { type: Number, required: true },
    rushPrice: { type: Number, required: true },
    currency: { type: String, default: "INR" },
  },
  { collection: "mock_interview_offerings" }
);

const MockInterviewOfferingModel =
  (models.MockInterviewOffering as mongoose.Model<MockInterviewOfferingDocument>) ||
  model<MockInterviewOfferingDocument>("MockInterviewOffering", MockInterviewOfferingSchema);

export default MockInterviewOfferingModel;
