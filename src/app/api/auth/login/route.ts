import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { ensureSuperAdminExists } from "@/lib/bootstrap-superadmin";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  await ensureSuperAdminExists();
  await connectDB();

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = parsed.data.email.trim().toLowerCase();
  const user = await UserModel.findOne({ email }).exec();
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (user.accountStatus === "SUSPENDED") {
    return NextResponse.json({ error: "Account suspended" }, { status: 403 });
  }
  if (user.accountStatus === "REJECTED") {
    return NextResponse.json({ error: "Application rejected" }, { status: 403 });
  }
  if (user.accountStatus === "AWAITING_CREDENTIAL_SETUP") {
    return NextResponse.json({ error: "Please set your password from the approval email" }, { status: 403 });
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  // Super Admin signs in with env bootstrap credentials — no email verification gate.
  if (user.emailVerified === false && user.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Please verify your email first. Check your inbox for the verification link." },
      { status: 403 }
    );
  }

  user.lastLoginAt = new Date();
  if (user.authProvider === "google") user.authProvider = "password+google";
  if (!user.authProvider) user.authProvider = "password";
  await user.save();

  const token = createSessionToken({ uid: String(user._id), role: user.role });
  const res = NextResponse.json({
    ok: true,
    role: user.role,
  });
  setSessionCookie(res, token);
  return res;
}

