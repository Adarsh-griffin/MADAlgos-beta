/**
 * Key id for Razorpay Checkout (browser). Prefer NEXT_PUBLIC_RAZORPAY_KEY_ID if set;
 * otherwise loads from GET /api/payments/razorpay-key (reads RAZORPAY_KEY_ID on server).
 */
export async function getRazorpayKeyIdForClient(): Promise<string | null> {
  const fromEnv = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
  if (fromEnv) return fromEnv;
  const res = await fetch("/api/payments/razorpay-key");
  if (!res.ok) return null;
  const data = (await res.json().catch(() => ({}))) as { keyId?: string };
  return data.keyId?.trim() ?? null;
}
