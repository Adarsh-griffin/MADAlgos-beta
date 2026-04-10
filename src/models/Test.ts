import mongoose, { Schema, model, models, Document } from "mongoose";

export interface MCQQuestion {
  questionText: string;
  options: string[];
  correctOption: number; // 0-3
  marks: number;
}

export interface CodingProblem {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  sampleTestCases: { input: string; output: string }[];
  hiddenTestCases: { input: string; output: string }[];
  marks: number;
}

export interface TestDocument extends Document {
  title: string;
  duration: number; // in minutes
  linkValidity: number; // in hours
  mcqs: MCQQuestion[];
  codingProblems: CodingProblem[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema = new Schema<TestDocument>(
  {
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    linkValidity: { type: Number, required: true },
    mcqs: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: Number, required: true },
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
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { collection: "tests", timestamps: true }
);

const TestModel =
  (models.Test as mongoose.Model<TestDocument>) || model<TestDocument>("Test", TestSchema);

export default TestModel;
