import mongoose, { Schema, model, models, Document } from "mongoose";
import type { MCQQuestion, CodingProblem } from "@/models/Test";

/** Public practice packs—canonical data lives in `practice_test` collection. */
export interface PracticeTestDocument extends Document {
  title: string;
  duration: number;
  linkValidity: number;
  mcqs: MCQQuestion[];
  codingProblems: CodingProblem[];
  createdBy?: mongoose.Types.ObjectId;
  publicSlug: string;
  demoCardSubtitle?: string;
  demoCardImageUrl?: string;
  demoBannerImageUrl?: string;
  demoBrandLogoUrl?: string;
  demoLogoDomain?: string;
  demoSortOrder?: number;
  /** Featured cards on the homepage (`Judge your skills`); `/available-tests` lists all public slugs. */
  showOnHomepage?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeTestSchema = new Schema<PracticeTestDocument>(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    linkValidity: { type: Number, required: true },
    mcqs: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: Number },
        correctOptions: [{ type: Number }],
        selectionType: { type: String, enum: ["single", "multiple"], default: "single" },
        marks: { type: Number, required: true, default: 1 },
      },
    ],
    codingProblems: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        inputFormat: { type: String },
        outputFormat: { type: String },
        sampleTestCases: [
          {
            input: { type: String, required: true },
            output: { type: String, required: true },
          },
        ],
        hiddenTestCases: [
          {
            input: { type: String, required: true },
            output: { type: String, required: true },
          },
        ],
        marks: { type: Number, required: true, default: 10 },
        starterCode: { type: Schema.Types.Mixed, default: {} },
        leetcodeSlug: { type: String },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    publicSlug: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    demoCardSubtitle: { type: String, default: "" },
    demoCardImageUrl: { type: String, default: "" },
    demoBannerImageUrl: { type: String, default: "" },
    demoBrandLogoUrl: { type: String, default: "" },
    demoLogoDomain: { type: String, default: "" },
    demoSortOrder: { type: Number, default: 0 },
    showOnHomepage: { type: Boolean, default: true, index: true },
  },
  { collection: "practice_test", timestamps: true }
);

const PracticeTestModel =
  (models.PracticeTest as mongoose.Model<PracticeTestDocument>) ||
  model<PracticeTestDocument>("PracticeTest", PracticeTestSchema);

export default PracticeTestModel;
