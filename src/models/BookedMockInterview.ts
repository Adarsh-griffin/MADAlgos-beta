import mongoose, { Schema, model, models, type Types } from "mongoose";

/** Years of professional experience (buyer), collected at checkout. */
export type BuyerExperienceBracket = "1-3" | "3-5" | "5-10" | "10+";

export interface BookedMockInterviewDocument {
  userId: Types.ObjectId;
  mockOfferingId: number;
  timeSlotId: number;
  mockDate: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  bookingCountry: string;
  mockInterviews: number;
  isTermsChecked: boolean;
  /** Buyer’s experience bracket (not the mock topic’s exp tier). */
  buyerExperienceBracket?: BuyerExperienceBracket;
  status: "NEW" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt?: Date;
  updatedAt?: Date;
}

const BookedMockInterviewSchema = new Schema<BookedMockInterviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mockOfferingId: { type: Number, required: true },
    timeSlotId: { type: Number, required: true },
    mockDate: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true, unique: true },
    razorpayOrderId: { type: String, required: true },
    bookingCountry: { type: String, required: true },
    mockInterviews: { type: Number, required: true, min: 1 },
    isTermsChecked: { type: Boolean, required: true },
    buyerExperienceBracket: {
      type: String,
      required: false,
      enum: ["1-3", "3-5", "5-10", "10+"],
    },
    status: {
      type: String,
      enum: ["NEW", "ACTIVE", "COMPLETED", "CANCELLED"],
      default: "NEW",
    },
  },
  { collection: "booked_mock_interviews", timestamps: true }
);

const BookedMockInterviewModel =
  (models.BookedMockInterview as mongoose.Model<BookedMockInterviewDocument>) ||
  model<BookedMockInterviewDocument>("BookedMockInterview", BookedMockInterviewSchema);

export default BookedMockInterviewModel;
