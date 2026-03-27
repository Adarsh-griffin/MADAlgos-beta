import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import PaymentModel from "@/models/Payment";
import MockInterviewOfferingModel from "@/models/MockInterviewOffering";
import TimeSlotModel from "@/models/TimeSlot";
import BookedMockInterviewModel from "@/models/BookedMockInterview";
import SessionPoolModel from "@/models/SessionPool";
import { notifyTeamOrderPlaced, sendMockBookingConfirmation } from "@/lib/booking-emails";
import { signGuestSetupToken } from "@/lib/auth";
import { isMockBookingDateAllowedServer } from "@/lib/booking-date";
import { formatMockOfferingLabel } from "@/lib/mock-offering-label";

const BodySchema = z.object({
  userEmail: z.string().email(),
  userPhone: z.string().optional().nullable(),
  mockId: z.number().int().positive(),
  selectedTimeSlot: z.number().int().positive(),
  selectedDate: z.string().min(1),
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  bookingCountry: z.string().min(2).max(8),
  quantity: z.number().int().min(1),
  isTermsChecked: z.literal(true),
  couponCode: z.string().nullable().optional(),
  OfferPrice: z.number().optional().nullable(),
  buyerExperienceBracket: z.enum(["1-3", "3-5", "5-10", "10+"]),
});

/**
 * POST /api/book-mock
 * After Razorpay success + /api/payments/new-payment — creates booking + session pool + email.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const d = parsed.data;
  if (!isMockBookingDateAllowedServer(d.selectedDate)) {
    return NextResponse.json(
      { error: "Booking date must be at least two days from today." },
      { status: 400 }
    );
  }

  await connectDB();

  const email = d.userEmail.trim().toLowerCase();
  const user = await UserModel.findOne({ email }).exec();
  if (!user) {
    return NextResponse.json({ error: "user not available" }, { status: 422 });
  }

  if (d.userPhone?.trim() && !user.mobile) {
    user.mobile = d.userPhone.trim();
    await user.save();
  }

  const payment = await PaymentModel.findOne({
    paymentId: d.paymentId,
    paymentFor: "mock",
    userId: user._id,
  }).exec();
  if (!payment) {
    return NextResponse.json(
      { error: "Payment not found. Complete /api/payments/new-payment first." },
      { status: 400 }
    );
  }
  if (payment.orderId !== d.orderId) {
    return NextResponse.json({ error: "Order id does not match payment record." }, { status: 400 });
  }

  const existing = await BookedMockInterviewModel.findOne({ razorpayPaymentId: d.paymentId }).exec();
  if (existing) {
    const uDup = await UserModel.findById(user._id).lean().exec();
    const setupTokenDup =
      uDup && !uDup.passwordHash && !(uDup as { googleId?: string | null }).googleId
        ? signGuestSetupToken(String(user._id))
        : undefined;
    return NextResponse.json(
      {
        message: "Mock booking already confirmed",
        bookingId: String(existing._id),
        paymentId: d.paymentId,
        orderId: d.orderId,
        duplicate: true,
        setupToken: setupTokenDup,
      },
      { status: 200 }
    );
  }

  const [mockOffer, slot] = await Promise.all([
    MockInterviewOfferingModel.findOne({ id: d.mockId }).lean().exec(),
    TimeSlotModel.findOne({ id: d.selectedTimeSlot }).lean().exec(),
  ]);
  if (!mockOffer || !slot) {
    return NextResponse.json({ error: "Invalid mock or time slot" }, { status: 400 });
  }

  const booking = await BookedMockInterviewModel.create({
    userId: user._id,
    mockOfferingId: d.mockId,
    timeSlotId: d.selectedTimeSlot,
    mockDate: d.selectedDate,
    razorpayPaymentId: d.paymentId,
    razorpayOrderId: d.orderId,
    bookingCountry: d.bookingCountry,
    mockInterviews: d.quantity,
    isTermsChecked: true,
    buyerExperienceBracket: d.buyerExperienceBracket,
    status: "NEW",
  });

  await SessionPoolModel.create({
    bookingType: "MOCK",
    bookingRef: booking._id,
    personalSessions: 0,
    mockInterviews: d.quantity,
  });

  const userName = user.username?.trim() || user.email.split("@")[0];
  const mockTimeSlot = `${slot.displayLabel} (${slot.startTime}–${slot.endTime})`;

  await sendMockBookingConfirmation({
    to: user.email,
    userName,
    mockType: mockOffer.mockType,
    mockDate: new Date(d.selectedDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    mockTimeSlot,
  });

  await notifyTeamOrderPlaced({
    kind: "mock",
    customerEmail: user.email,
    customerName: userName,
    customerPhone: d.userPhone?.trim() || user.mobile?.trim() || null,
    paymentId: d.paymentId,
    orderId: d.orderId,
    bookingCountry: d.bookingCountry,
    bookingId: String(booking._id),
    lines: [
      { label: "Booking ID", value: String(booking._id) },
      { label: "Customer email", value: user.email },
      { label: "Phone", value: d.userPhone?.trim() || user.mobile?.trim() || "—" },
      { label: "Mock", value: formatMockOfferingLabel(mockOffer) },
      { label: "Buyer experience (yrs)", value: d.buyerExperienceBracket },
      { label: "Type", value: mockOffer.mockType },
      { label: "Quantity", value: String(d.quantity) },
      { label: "Slot", value: mockTimeSlot },
      { label: "Date", value: new Date(d.selectedDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) },
      { label: "Region", value: d.bookingCountry },
      { label: "Razorpay payment ID", value: d.paymentId },
      { label: "Razorpay order ID", value: d.orderId },
    ],
  });

  const fresh = await UserModel.findById(user._id).lean().exec();
  const setupToken =
    fresh && !fresh.passwordHash && !(fresh as { googleId?: string | null }).googleId
      ? signGuestSetupToken(String(user._id))
      : undefined;

  return NextResponse.json(
    {
      message: "Mock booking confirmed",
      bookingId: String(booking._id),
      paymentId: d.paymentId,
      orderId: d.orderId,
      setupToken,
    },
    { status: 201 }
  );
}
