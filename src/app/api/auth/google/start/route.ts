import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = url.searchParams.get("role") === "mentor" ? "mentor" : "student";
  const nextRaw = url.searchParams.get("next");
  const next = nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : null;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 500 });
  }

  const state = crypto.randomBytes(16).toString("hex");
  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?` +
      new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        prompt: "select_account",
        access_type: "offline",
        state: JSON.stringify({ state, role, next }),
      }).toString()
  );

  // store state in httpOnly cookie (basic CSRF protection)
  res.cookies.set({
    name: "madalgos_google_oauth_state",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });

  return res;
}

