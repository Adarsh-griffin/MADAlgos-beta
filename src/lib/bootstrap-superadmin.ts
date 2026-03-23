import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { signPassword } from "@/lib/auth";

export async function ensureSuperAdminExists(): Promise<void> {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;
  if (!email || !password) return;

  await connectDB();

  const existing = await UserModel.findOne({ role: "SUPER_ADMIN" }).lean().exec();
  if (existing) return;

  const passwordHash = await signPassword(password);
  await UserModel.create({
    email: email.trim().toLowerCase(),
    username: "superadmin",
    role: "SUPER_ADMIN",
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
    lastLoginAt: null,
  });
}

