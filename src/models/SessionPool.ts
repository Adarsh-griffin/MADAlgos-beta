import mongoose, { Schema, model, models, type Types } from "mongoose";

export interface SessionPoolDocument {
  bookingType: "MOCK" | "MENTORSHIP";
  bookingRef: Types.ObjectId;
  personalSessions: number;
  mockInterviews: number;
}

const SessionPoolSchema = new Schema<SessionPoolDocument>(
  {
    bookingType: { type: String, required: true, enum: ["MOCK", "MENTORSHIP"] },
    bookingRef: { type: Schema.Types.ObjectId, required: true, index: true },
    personalSessions: { type: Number, default: 0 },
    mockInterviews: { type: Number, default: 0 },
  },
  { collection: "session_pools", timestamps: true }
);

const SessionPoolModel =
  (models.SessionPool as mongoose.Model<SessionPoolDocument>) ||
  model<SessionPoolDocument>("SessionPool", SessionPoolSchema);

export default SessionPoolModel;
