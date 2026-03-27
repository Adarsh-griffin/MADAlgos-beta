import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "madalgos_session";

function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as { role?: string };
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAdmin = pathname.startsWith("/admin");
  const needsMentor = pathname.startsWith("/mentor");
  const needsStudent = pathname.startsWith("/student");
  if (!needsAdmin && !needsMentor && !needsStudent) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  // Middleware runs on Edge: keep it simple and only read the role from JWT payload.
  // The API routes still verify the token server-side.
  const payload = decodeJwtPayload(token);
  const role = payload?.role;

  if (needsAdmin && role !== "ADMIN" && role !== "SUPER_ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (needsMentor && role !== "MENTOR") {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  if (needsStudent && role !== "STUDENT") {
    const url = req.nextUrl.clone();
    if (role === "MENTOR") {
      url.pathname = "/mentor";
    } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
      url.pathname = "/admin";
    } else {
      url.pathname = "/auth";
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mentor/:path*", "/student/:path*"],
};

