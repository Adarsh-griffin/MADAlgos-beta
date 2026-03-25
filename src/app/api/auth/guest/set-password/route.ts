import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { verifyGuestSetupToken, signPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

const BodySchema = z.object({
  setupToken: z.string().min(10),
  password: z.string().min(6).max(128),
});

/**
 * After guest checkout: set password using token from book-mock / book-mentorship response.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const claims = verifyGuestSetupToken(parsed.data.setupToken);
  if (!claims) {
    return NextResponse.json({ error: "Invalid or expired link. Request a new checkout or contact support." }, { status: 400 });
  }

  await connectDB();
  const user = await UserModel.findById(claims.uid).exec();
  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  if (user.passwordHash) {
    return NextResponse.json({ error: "Password already set. Sign in instead." }, { status: 409 });
  }

  user.passwordHash = await signPassword(parsed.data.password);
  user.authProvider = user.googleId ? "password+google" : "password";
  user.lastLoginAt = new Date();
  await user.save();

  const token = createSessionToken({ uid: String(user._id), role: user.role });
  const res = NextResponse.json({
    ok: true,
    email: user.email,
  });
  setSessionCookie(res, token);
  return res;
}
