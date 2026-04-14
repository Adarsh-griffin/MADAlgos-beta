import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import TestTokenModel from "@/models/TestToken";
import UserModel from "@/models/User";

const BodySchema = z.object({
  token: z.string().min(8),
  email: z.string().email().max(254),
  fullName: z.string().min(2).max(120),
  mobile: z.string().max(24).optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please enter a valid email, your full name (at least 2 characters), and optional mobile." },
        { status: 400 }
      );
    }

    await connectDB();

    const testToken = await TestTokenModel.findOne({ token: parsed.data.token });
    if (!testToken) {
      return NextResponse.json({ message: "Invalid link." }, { status: 404 });
    }
    if (testToken.isStarted) {
      return NextResponse.json({ message: "Assessment already started." }, { status: 409 });
    }
    if (testToken.submittedAt) {
      return NextResponse.json({ message: "Already submitted." }, { status: 409 });
    }
    if (new Date() > new Date(testToken.expiresAt)) {
      return NextResponse.json({ message: "This invite has expired." }, { status: 410 });
    }

    const tokenEmail = String(testToken.studentEmail).trim().toLowerCase();
    const submittedEmail = parsed.data.email.trim().toLowerCase();
    if (submittedEmail !== tokenEmail) {
      return NextResponse.json(
        { message: "The email you entered must match the address this invite was sent to." },
        { status: 400 }
      );
    }
    const email = tokenEmail;
    const fullName = parsed.data.fullName.trim();
    const mobile = parsed.data.mobile?.trim() || "";

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        email,
        username: fullName.slice(0, 50),
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
        mobile: mobile || null,
      });
    } else {
      if (!user.username?.trim()) user.username = fullName.slice(0, 50);
      if (mobile) user.mobile = mobile;
      await user.save();
    }

    testToken.studentName = fullName;
    testToken.profileSubmittedAt = new Date();
    testToken.linkedUserId = user._id;
    await testToken.save();

    return NextResponse.json({
      message: "Profile saved. Continue to instructions.",
      userCreated: true,
    });
  } catch (e: unknown) {
    console.error("[assessment-profile]", e);
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
