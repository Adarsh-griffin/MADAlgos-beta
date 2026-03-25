import mongoose, { Schema, model, models, type Types } from "mongoose";

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
  status: "NEW" | "ACTIVE" | "COMPLETED" | "CANCELLED";
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
