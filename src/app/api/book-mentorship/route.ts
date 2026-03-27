import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import PaymentModel from "@/models/Payment";
import MentorModel from "@/models/Mentor";
import { getSimpleMentorshipById } from "@/lib/mentorship-simple-packages";
import BookedMentorshipModel from "@/models/BookedMentorship";
import SessionPoolModel from "@/models/SessionPool";
import { notifyTeamOrderPlaced, sendMentorshipPurchaseEmails } from "@/lib/booking-emails";
import { signGuestSetupToken } from "@/lib/auth";

const BodySchema = z.object({
  userEmail: z.string().email(),
  userPhone: z.string().optional().nullable(),
  mentorshipId: z.number().int().positive(),
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  bookingCountry: z.string().min(2).max(8),
  isTermsChecked: z.literal(true),
  couponCode: z.string().nullable().optional(),
  OfferPrice: z.number().optional().nullable(),
  mentorId: z.number().int().positive().optional().nullable(),
});

function addExpiryMonths(base: Date, months: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + months * 30);
  return d;
}

/**
 * POST /api/book-mentorship
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const d = parsed.data;
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
    paymentFor: "mentorship",
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

  const existingBook = await BookedMentorshipModel.findOne({ razorpayPaymentId: d.paymentId }).exec();
  if (existingBook) {
    const uDup = await UserModel.findById(user._id).lean().exec();
    const setupTokenDup =
      uDup && !uDup.passwordHash && !(uDup as { googleId?: string | null }).googleId
        ? signGuestSetupToken(String(user._id))
        : undefined;
    return NextResponse.json(
      {
        message: "Mentorship booking already confirmed",
        bookingId: String(existingBook._id),
        paymentId: d.paymentId,
        orderId: d.orderId,
        duplicate: true,
        setupToken: setupTokenDup,
      },
      { status: 200 }
    );
  }

  const canonical = getSimpleMentorshipById(d.mentorshipId);
  if (!canonical) {
    return NextResponse.json({ error: "Mentorship offering not found" }, { status: 404 });
  }

  const now = new Date();
  const expiryDate = addExpiryMonths(now, canonical.durationMonths);

  const assignedMentorId: number | null = d.mentorId ?? null;
  let mentorForEmail: { name: string; email: string } | null = null;

  if (assignedMentorId != null) {
    const mentor = await MentorModel.findOne({ id: assignedMentorId }).lean().exec();
    if (!mentor) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }
    const parts = [mentor.interviewer?.firstName, mentor.interviewer?.lastName].filter(Boolean);
    const name = parts.length ? parts.join(" ") : "Mentor";
    const uid = mentor.profileId?.startsWith("user:") ? mentor.profileId.slice(5) : null;
    let mentorEmail = "";
    if (uid) {
      const mu = await UserModel.findById(uid).lean().exec();
      mentorEmail = mu?.email ?? "";
    }
    if (mentorEmail) mentorForEmail = { name, email: mentorEmail };
  }

  const booking = await BookedMentorshipModel.create({
    userId: user._id,
    mentorshipOfferingId: d.mentorshipId,
    razorpayPaymentId: d.paymentId,
    razorpayOrderId: d.orderId,
    bookingCountry: d.bookingCountry,
    isTermsChecked: true,
    assignedMentorId,
    status: assignedMentorId != null ? "ACTIVE" : "NEW",
    expiryDate,
  });

  await SessionPoolModel.create({
    bookingType: "MENTORSHIP",
    bookingRef: booking._id,
    personalSessions: canonical.personalSessions,
    mockInterviews: canonical.mockInterviews,
  });

  const userName = user.username?.trim() || user.email.split("@")[0];
  const menteeName = userName;
  const typeLabel = canonical.ifSolo ? "Solo" : "Group";

  await sendMentorshipPurchaseEmails({
    userEmail: user.email,
    userName,
    orderId: d.orderId,
    durationMonths: canonical.durationMonths,
    typeLabel,
    groupSize: canonical.groupSizes,
    expLabel: canonical.expLabel,
    menteeName,
    mentor: mentorForEmail,
  });

  const packageSummary = `${canonical.durationMonths} mo · ${canonical.mockInterviews} mocks · ${canonical.personalSessions}× 1:1 · ${typeLabel} · INR ${canonical.price}`;

  await notifyTeamOrderPlaced({
    kind: "mentorship",
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
      { label: "Package", value: packageSummary },
      { label: "Mentorship offering ID", value: String(d.mentorshipId) },
      { label: "Assigned mentor", value: mentorForEmail ? `${mentorForEmail.name} (${mentorForEmail.email})` : "Unassigned (ops will assign)" },
      { label: "Region", value: d.bookingCountry },
      { label: "Access until", value: expiryDate.toLocaleDateString("en-IN") },
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
      message: "mentorship Program Purchase Confirmed",
      paymentId: d.paymentId,
      orderId: d.orderId,
      bookingId: String(booking._id),
      setupToken,
    },
    { status: 201 }
  );
}
