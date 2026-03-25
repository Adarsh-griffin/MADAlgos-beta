import mongoose, { Schema, model, models, type Types } from "mongoose";

export interface BookedMentorshipDocument {
  userId: Types.ObjectId;
  mentorshipOfferingId: number;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  bookingCountry: string;
  isTermsChecked: boolean;
  assignedMentorId?: number | null;
  status: "NEW" | "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED";
  expiryDate: Date;
}

const BookedMentorshipSchema = new Schema<BookedMentorshipDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mentorshipOfferingId: { type: Number, required: true },
    razorpayPaymentId: { type: String, required: true, unique: true },
    razorpayOrderId: { type: String, required: true },
    bookingCountry: { type: String, required: true },
    isTermsChecked: { type: Boolean, required: true },
    assignedMentorId: { type: Number, default: null },
    status: {
      type: String,
      enum: ["NEW", "ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED"],
      default: "NEW",
    },
    expiryDate: { type: Date, required: true },
  },
  { collection: "booked_mentorships", timestamps: true }
);

const BookedMentorshipModel =
  (models.BookedMentorship as mongoose.Model<BookedMentorshipDocument>) ||
  model<BookedMentorshipDocument>("BookedMentorship", BookedMentorshipSchema);

export default BookedMentorshipModel;
