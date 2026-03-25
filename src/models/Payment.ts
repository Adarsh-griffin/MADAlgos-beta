import mongoose, { Schema, model, models, type Types } from "mongoose";

export interface PaymentDocument {
  orderId: string;
  paymentId: string;
  paymentFor: "mock" | "mentorship";
  userId: Types.ObjectId;
  amountPaise?: number;
  currency?: string;
  paymentDetails?: Record<string, unknown>;
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    orderId: { type: String, required: true, index: true },
    paymentId: { type: String, required: true, unique: true },
    paymentFor: { type: String, required: true, enum: ["mock", "mentorship"] },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amountPaise: { type: Number },
    currency: { type: String },
    paymentDetails: { type: Schema.Types.Mixed },
  },
  { collection: "payments", timestamps: true }
);

const PaymentModel =
  (models.Payment as mongoose.Model<PaymentDocument>) ||
  model<PaymentDocument>("Payment", PaymentSchema);

export default PaymentModel;
