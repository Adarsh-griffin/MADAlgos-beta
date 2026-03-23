import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { ensureSuperAdminExists } from "@/lib/bootstrap-superadmin";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const stateRaw = url.searchParams.get("state");
  const stateCookie = req.cookies.get("madalgos_google_oauth_state")?.value ?? null;

  if (!code || !stateRaw || !stateCookie) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  let parsedState: { state: string; role: "student" | "mentor" } | null = null;
  try {
    parsedState = JSON.parse(stateRaw) as { state: string; role: "student" | "mentor" };
  } catch {
    parsedState = null;
  }
  if (!parsedState || parsedState.state !== stateCookie) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
  const { tokens } = await oauth2Client.getToken(code);
  if (!tokens.id_token) return NextResponse.redirect(new URL("/auth", req.url));

  const ticket = await oauth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: clientId,
  });
  const payload = ticket.getPayload();
  const email = payload?.email?.toLowerCase();
  const sub = payload?.sub;
  const name = payload?.name ?? null;
  if (!email || !sub) return NextResponse.redirect(new URL("/auth", req.url));

  await ensureSuperAdminExists();
  await connectDB();

  let user = await UserModel.findOne({ email }).exec();

  // Never allow Google to create admin/superadmin.
  if (!user) {
    if (parsedState.role === "mentor") {
      user = await UserModel.create({
        email,
        username: name,
        role: "MENTOR_PENDING",
        accountStatus: "PENDING_APPLICATION",
        verificationStatus: "UNVERIFIED",
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
        mentorApplyEmailsSent: false,
        linkedinProfileUrl: null,
        authProvider: "google",
        passwordHash: null,
        googleId: sub,
        mentorCredentialToken: null,
        mentorCredentialTokenExpiresAt: null,
        profileCompleted: false,
        lastLoginAt: new Date(),
      });
      const sessionToken = createSessionToken({ uid: String(user._id), role: user.role });
      const res = NextResponse.redirect(new URL("/auth", req.url));
      setSessionCookie(res, sessionToken);
      res.cookies.set("madalgos_google_oauth_state", "", { maxAge: 0, path: "/" });
      return res;
    }

    user = await UserModel.create({
      email,
      username: name,
      role: "STUDENT",
      accountStatus: "ACTIVE",
      verificationStatus: "VERIFIED",
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
      mentorApplyEmailsSent: false,
      linkedinProfileUrl: null,
      authProvider: "google",
      passwordHash: null,
      googleId: sub,
      mentorCredentialToken: null,
      mentorCredentialTokenExpiresAt: null,
      profileCompleted: true,
      lastLoginAt: new Date(),
    });
  } else {
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
      // Admins must use their assigned email/password by policy.
      return NextResponse.redirect(new URL("/auth", req.url));
    }
    user.googleId = user.googleId ?? sub;
    user.authProvider = user.authProvider === "password" ? "password+google" : "google";
    user.lastLoginAt = new Date();
    await user.save();
  }

  // Pending mentors: session + /auth shows "under verification" UI.
  if (user.role === "MENTOR_PENDING") {
    const sessionToken = createSessionToken({ uid: String(user._id), role: user.role });
    const res = NextResponse.redirect(new URL("/auth", req.url));
    setSessionCookie(res, sessionToken);
    res.cookies.set("madalgos_google_oauth_state", "", { maxAge: 0, path: "/" });
    return res;
  }

  const sessionToken = createSessionToken({ uid: String(user._id), role: user.role });
  const res = NextResponse.redirect(new URL(user.role === "MENTOR" ? "/mentor" : "/", req.url));
  setSessionCookie(res, sessionToken);
  res.cookies.set("madalgos_google_oauth_state", "", { maxAge: 0, path: "/" });
  return res;
}

