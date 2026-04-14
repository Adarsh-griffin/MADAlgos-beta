import mongoose, { Schema, model, models, Document } from "mongoose";

export interface TestTokenDocument extends Document {
  token: string;
  testId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const TestTokenSchema = new Schema<TestTokenDocument>(
  {
    token: { type: String, required: true, unique: true, index: true },
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    studentEmail: { type: String, required: true },
    studentName: { type: String },
    profileSubmittedAt: { type: Date },
    linkedUserId: { type: Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
    submittedAt: { type: Date },
    activatedIp: { type: String },
    isStarted: { type: Boolean, default: false },
  },
  { collection: "test_tokens", timestamps: true }
);

const TestTokenModel =
  (models.TestToken as mongoose.Model<TestTokenDocument>) ||
  model<TestTokenDocument>("TestToken", TestTokenSchema);

export default TestTokenModel;
