import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { sendEmailVerificationMail } from "@/lib/mentor-application-emails";

const BodySchema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(50),
  linkedinProfileUrl: z.string().url(),
});

const VERIFY_MS = 48 * 60 * 60 * 1000;

export async function POST(req: Request) {
  await connectDB();
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();

  const existing = await UserModel.findOne({ email }).lean().exec();
  if (existing) {
    return NextResponse.json(
      { error: "Email already exists. Please sign in or contact support." },
      { status: 409 }
    );
  }

  const username = parsed.data.username.trim();
  const linkedinProfileUrl = parsed.data.linkedinProfileUrl.trim();
  const verificationToken = randomUUID();
  const emailVerificationExpiresAt = new Date(Date.now() + VERIFY_MS);

  await UserModel.create({
    email,
    username,
    role: "MENTOR_PENDING",
    accountStatus: "PENDING_APPLICATION",
    verificationStatus: "UNVERIFIED",
    emailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpiresAt,
    mentorApplyEmailsSent: false,
    linkedinProfileUrl,
    authProvider: null,
    passwordHash: null,
    googleId: null,
    mentorCredentialToken: null,
    mentorCredentialTokenExpiresAt: null,
    profileCompleted: false,
    lastLoginAt: null,
  });

  const verifyRes = await sendEmailVerificationMail({
    email,
    username,
    verificationToken,
  });
  if (!verifyRes.ok) {
    console.error("[mentor-apply] Verification email failed to send");
  }

  return NextResponse.json({
    ok: true,
    verifyEmailSent: verifyRes.ok,
  });
}
