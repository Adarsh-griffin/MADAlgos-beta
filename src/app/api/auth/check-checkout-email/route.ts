import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { getSessionFromRequestCookies } from "@/lib/auth";

/**
 * GET /api/auth/check-checkout-email?email=
 * Use before opening Razorpay: if this email already has a password/Google-linked account
 * and the browser is not logged in as that user, guest checkout must be blocked (matches /api/payments/new-payment).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("email")?.trim() ?? "";
  const emailParse = z.string().email().safeParse(raw);
  if (!emailParse.success) {
    return NextResponse.json({ canCheckout: false, message: "Enter a valid email address." }, { status: 400 });
  }
  const email = raw.toLowerCase();

  await connectDB();
  const user = await UserModel.findOne({ email }).lean().exec();
  const session = await getSessionFromRequestCookies();

  if (!user) {
    return NextResponse.json({ canCheckout: true });
  }

  const hasPassword = Boolean(user.passwordHash);
  const hasGoogle = Boolean((user as { googleId?: string | null }).googleId);
  if (!hasPassword && !hasGoogle) {
    return NextResponse.json({ canCheckout: true });
  }

  const loggedInAsThisUser = session?.uid === String(user._id);
  if (loggedInAsThisUser) {
    return NextResponse.json({ canCheckout: true });
  }

  return NextResponse.json({
    canCheckout: false,
    message:
      "This email already has an account. Sign in to pay with this email, or use a different email for guest checkout.",
  });
}
