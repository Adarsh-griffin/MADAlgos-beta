import { NextResponse } from "next/server";

/**
 * Returns the Razorpay **key id** for the checkout script. Safe to expose (same as in browser).
 * Secret stays server-only via RAZORPAY_KEY_SECRET.
 */
export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  if (!keyId) {
    return NextResponse.json(
      { error: "RAZORPAY_KEY_ID not configured" },
      { status: 503 }
    );
  }
  return NextResponse.json({ keyId });
}
