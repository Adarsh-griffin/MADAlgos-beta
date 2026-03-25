import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MENTOR_PENDING" | "MENTOR" | "STUDENT";
export type AccountStatus =
  | "PENDING_APPLICATION"
  | "AWAITING_CREDENTIAL_SETUP"
  | "ACTIVE"
  | "REJECTED"
  | "SUSPENDED";
export type VerificationStatus = "UNVERIFIED" | "VERIFIED";

export interface SessionClaims {
  uid: string;
  role: UserRole;
}

const SESSION_COOKIE = "madalgos_session";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export function signPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function createSessionToken(claims: SessionClaims): string {
  const secret = requireEnv("JWT_SECRET");
  return jwt.sign(claims, secret, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): SessionClaims | null {
  try {
    const secret = requireEnv("JWT_SECRET");
    const decoded = jwt.verify(token, secret) as SessionClaims;
    if (!decoded?.uid || !decoded?.role) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function setSessionCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionFromRequestCookies(): Promise<SessionClaims | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function newOneTimeToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/** Short-lived token so a guest can set password after successful payment (book-mock / book-mentorship). */
export function signGuestSetupToken(userId: string): string {
  const secret = requireEnv("JWT_SECRET");
  return jwt.sign({ uid: userId, typ: "guest_setup" }, secret, { expiresIn: "24h" });
}

export function verifyGuestSetupToken(token: string): { uid: string } | null {
  try {
    const secret = requireEnv("JWT_SECRET");
    const decoded = jwt.verify(token, secret) as { uid?: string; typ?: string };
    if (decoded.typ !== "guest_setup" || !decoded.uid) return null;
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}

