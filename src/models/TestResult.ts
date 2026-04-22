import mongoose, { Schema, model, models, Document } from "mongoose";

export interface TestResultDocument extends Document {
  tokenId: mongoose.Types.ObjectId;
  /** Set for platform assessments (`tests`). */
  testId?: mongoose.Types.ObjectId | null;
  /** Set for practice packs (`practice_test`). */
  practiceTestId?: mongoose.Types.ObjectId | null;
  studentEmail: string;
  studentName?: string;
  mcqAnswers: {
    questionIndex: number;
    selectedOption?: number;
    selectedOptions?: number[];
    isCorrect?: boolean;
  }[];
  codingSubmissions: { problemIndex: number; sourceCode: string; status: string; score: number }[];
  mcqScore: number;
  codingScore: number;
  totalScore: number;
  maxScore: number;
  submittedAt: Date;
  status: "COMPLETED" | "AUTO_SUBMITTED";
  /** Optional student feedback after submit (1–5). */
  feedbackRating?: number;
  feedbackComment?: string;
  feedbackSubmittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TestResultSchema = new Schema<TestResultDocument>(
  {
    tokenId: { type: Schema.Types.ObjectId, ref: "TestToken", required: true, unique: true },
    testId: { type: Schema.Types.ObjectId, ref: "Test" },
    practiceTestId: { type: Schema.Types.ObjectId, ref: "PracticeTest" },
    studentEmail: { type: String, required: true },
    studentName: { type: String },
    mcqAnswers: [
      {
        questionIndex: { type: Number, required: true },
        selectedOption: { type: Number },
        selectedOptions: [{ type: Number }],
        isCorrect: { type: Boolean },
      },
    ],
    codingSubmissions: [
      {
        problemIndex: { type: Number, required: true },
        sourceCode: { type: String, required: true },
        status: { type: String },
        score: { type: Number, default: 0 },
      },
    ],
    mcqScore: { type: Number, default: 0 },
    codingScore: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    maxScore: { type: Number, required: true },
    submittedAt: { type: Date, required: true },
    status: { type: String, enum: ["COMPLETED", "AUTO_SUBMITTED"], default: "COMPLETED" },
    feedbackRating: { type: Number, min: 1, max: 5 },
    feedbackComment: { type: String, maxlength: 2000 },
    feedbackSubmittedAt: { type: Date },
  },
  { collection: "test_results", timestamps: true }
);

TestResultSchema.pre("validate", function (next) {
  if (!this.testId && !this.practiceTestId) {
    next(new Error("Either testId or practiceTestId is required"));
  } else {
    next();
  }
});

const TestResultModel =
  (models.TestResult as mongoose.Model<TestResultDocument>) ||
  model<TestResultDocument>("TestResult", TestResultSchema);

export default TestResultModel;
