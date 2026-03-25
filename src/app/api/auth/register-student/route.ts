import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { createSessionToken, setSessionCookie, signPassword } from "@/lib/auth";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128),
  username: z.string().min(2).max(50).optional(),
});

/**
 * Create a student account (email + password) for checkout flows when Google is not used.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const username = (parsed.data.username ?? email.split("@")[0]).trim();

  await connectDB();

  const exists = await UserModel.findOne({ email }).lean().exec();
  if (exists) {
    return NextResponse.json({ error: "Email already registered. Sign in instead." }, { status: 409 });
  }

  const passwordHash = await signPassword(parsed.data.password);

  const user = await UserModel.create({
    email,
    username,
    role: "STUDENT",
    status: "ACTIVE" as const,
    accountStatus: "ACTIVE",
    verificationStatus: "VERIFIED",
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpiresAt: null,
    mentorApplyEmailsSent: false,
    linkedinProfileUrl: null,
    authProvider: "password",
    passwordHash,
    googleId: null,
    mentorCredentialToken: null,
    mentorCredentialTokenExpiresAt: null,
    profileCompleted: true,
    lastLoginAt: new Date(),
    mobile: null,
  });

  const token = createSessionToken({ uid: String(user._id), role: user.role });
  const res = NextResponse.json({ ok: true, role: user.role });
  setSessionCookie(res, token);
  return res;
}
