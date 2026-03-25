import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import PaymentModel from "@/models/Payment";

const BodySchema = z.object({
  orderCreationId: z.string().optional(),
  paymentFor: z.enum(["mock", "mentorship"]),
  razorpayPaymentId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  userEmail: z.string().email(),
  /** When set, must match the User for userEmail (logged-in checkout). */
  sessionUserId: z.string().optional(),
});

function verifySignature(orderId: string, paymentId: string, signature: string, secret: string): boolean {
  const digest = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(digest, "utf8"), Buffer.from(signature, "utf8"));
  } catch {
    return digest === signature;
  }
}

/**
 * POST /api/payments/new-payment
 * Verifies Razorpay signature and stores payment.
 * Creates a guest User (no password) when the email has no account yet.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { paymentFor, razorpayPaymentId, razorpayOrderId, razorpaySignature, userEmail, sessionUserId } =
    parsed.data;

  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "RAZORPAY_KEY_SECRET not configured" }, { status: 503 });
  }
  if (!verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature, secret)) {
    return NextResponse.json({ msg: "Transaction not legit!" }, { status: 400 });
  }

  const email = userEmail.trim().toLowerCase();
  await connectDB();

  let user = await UserModel.findOne({ email }).exec();

  if (sessionUserId?.trim()) {
    const sid = sessionUserId.trim();
    if (user && String(user._id) !== sid) {
      return NextResponse.json(
        { error: "Checkout email must match your logged-in account." },
        { status: 400 }
      );
    }
    if (!user) {
      const sess = await UserModel.findById(sid).exec();
      if (sess && sess.email !== email) {
        return NextResponse.json(
          { error: "Checkout email must match your logged-in account." },
          { status: 400 }
        );
      }
    }
  }

  if (user && (user.passwordHash || user.googleId) && String(user._id) !== sessionUserId?.trim()) {
    return NextResponse.json(
      { error: "This email already has an account. Sign in to continue." },
      { status: 409 }
    );
  }

  if (!user) {
    user = await UserModel.create({
      email,
      username: email.split("@")[0],
      role: "STUDENT",
      status: "ACTIVE",
      accountStatus: "ACTIVE",
      verificationStatus: "VERIFIED",
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
      mentorApplyEmailsSent: false,
      linkedinProfileUrl: null,
      authProvider: null,
      passwordHash: null,
      googleId: null,
      mentorCredentialToken: null,
      mentorCredentialTokenExpiresAt: null,
      profileCompleted: false,
      lastLoginAt: null,
      mobile: null,
    });
  }

  try {
    await PaymentModel.create({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      paymentFor,
      userId: user._id,
    });
  } catch (e: unknown) {
    const code = e && typeof e === "object" && "code" in e ? (e as { code?: number }).code : undefined;
    if (code === 11000) {
      return NextResponse.json({ status: "ok", duplicate: true });
    }
    throw e;
  }

  return NextResponse.json({ status: "ok" });
}
