import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * GET /api/auth/check-checkout-email?email=
 * Validates email format only. Does **not** query the database — avoids account enumeration.
 * Guest checkout can use any email; payment is linked to the existing user when the email matches.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("email")?.trim() ?? "";
  const emailParse = z.string().email().safeParse(raw);
  if (!emailParse.success) {
    return NextResponse.json({ canCheckout: false, message: "Enter a valid email address." }, { status: 400 });
  }
  return NextResponse.json({ canCheckout: true });
}
