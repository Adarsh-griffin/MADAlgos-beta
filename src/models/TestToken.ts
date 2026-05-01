import mongoose, { Schema, model, models, Document } from "mongoose";

export interface TestTokenDocument extends Document {
  token: string;
  /** Platform assessment (`tests` collection). */
  testId?: mongoose.Types.ObjectId | null;
  /** Public practice pack (`practice_test` collection). */
  practiceTestId?: mongoose.Types.ObjectId | null;
  studentEmail: string;
  studentName?: string;
  /** After student submits name/details before instructions */
  profileSubmittedAt?: Date;
  /** Linked MADAlgos user (created or matched on profile submit) */
  linkedUserId?: mongoose.Types.ObjectId;
  expiresAt: Date;
  usedAt?: Date; // When they first clicked/started
  submittedAt?: Date; // When they finished
  activatedIp?: string;
  isStarted: boolean;
  difficultyPreference?: {
    mcq?: "easy" | "medium" | "hard";
    coding?: "easy" | "medium" | "hard";
  };
  draftSubmission?: {
    mcqAnswers: Array<{ questionIndex: number; selectedOption?: number; selectedOptions?: number[] }>;
    codingSubmissions: Array<{ problemIndex: number; sourceCode: string; language: string }>;
    savedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TestTokenSchema = new Schema<TestTokenDocument>(
  {
    token: { type: String, required: true, unique: true, index: true },
    testId: { type: Schema.Types.ObjectId, ref: "Test" },
    practiceTestId: { type: Schema.Types.ObjectId, ref: "PracticeTest", index: true },
    studentEmail: { type: String, required: true },
    studentName: { type: String },
    profileSubmittedAt: { type: Date },
    linkedUserId: { type: Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
    submittedAt: { type: Date },
    activatedIp: { type: String },
    isStarted: { type: Boolean, default: false },
    difficultyPreference: {
      mcq: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
      coding: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    },
    draftSubmission: {
      mcqAnswers: [
        {
          questionIndex: { type: Number, required: true },
          selectedOption: { type: Number },
          selectedOptions: [{ type: Number }],
        },
      ],
      codingSubmissions: [
        {
          problemIndex: { type: Number, required: true },
          sourceCode: { type: String, required: true },
          language: { type: String, required: true },
        },
      ],
      savedAt: { type: Date },
    },
  },
  { collection: "test_tokens", timestamps: true }
);

TestTokenSchema.pre("validate", function (next) {
  if (!this.testId && !this.practiceTestId) {
    next(new Error("Either testId or practiceTestId is required"));
  } else {
    next();
  }
});

const TestTokenModel =
  (models.TestToken as mongoose.Model<TestTokenDocument>) ||
  model<TestTokenDocument>("TestToken", TestTokenSchema);

export default TestTokenModel;
