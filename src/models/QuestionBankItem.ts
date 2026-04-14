import mongoose, { Schema, model, models, Document, Types } from "mongoose";
import type { MCQQuestion, CodingProblem } from "@/models/Test";

export type QuestionBankKind = "MCQ" | "CODING";

export interface QuestionBankItemDocument extends Document {
  kind: QuestionBankKind;
  mcq?: MCQQuestion;
  coding?: CodingProblem;
  /** Stable hash for deduplication across tests */
  fingerprint: string;
  /** Lowercased concatenation for simple search */
  searchText: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionBankItemSchema = new Schema<QuestionBankItemDocument>(
  {
    kind: { type: String, enum: ["MCQ", "CODING"], required: true },
    mcq: {
      questionText: String,
      options: [String],
      correctOption: Number,
      correctOptions: [Number],
      selectionType: String,
      marks: Number,
    },
    coding: {
      title: String,
      description: String,
      inputFormat: String,
      outputFormat: String,
      sampleTestCases: [{ input: String, output: String }],
      hiddenTestCases: [{ input: String, output: String }],
      marks: Number,
    },
    fingerprint: { type: String, required: true, unique: true, index: true },
    searchText: { type: String, required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { collection: "assessment_question_bank", timestamps: true }
);

const QuestionBankItemModel =
  (models.QuestionBankItem as mongoose.Model<QuestionBankItemDocument>) ||
  model<QuestionBankItemDocument>("QuestionBankItem", QuestionBankItemSchema);

export default QuestionBankItemModel;
