import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Razorpay from "razorpay";
import { nanoid } from "nanoid";
import { connectDB } from "@/lib/mongodb";
import MockInterviewOfferingModel from "@/models/MockInterviewOffering";
import { getSimpleMentorshipById } from "@/lib/mentorship-simple-packages";

const BodySchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().min(1).default(1),
  price: z.number().positive(),
  orderType: z.enum(["Normal Ordering", "Rush Ordering"]).optional().default("Normal Ordering"),
  currency: z.string().optional(),
});

function getRazorpay(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

/**
 * POST /api/payments/orders?product=mock|mentorship
 * Mirrors legacy: create Razorpay order from offering + negotiated price.
 */
export async function POST(req: NextRequest) {
  const product = req.nextUrl.searchParams.get("product");
  if (product !== "mock" && product !== "mentorship") {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { id, quantity, price, orderType, currency: bodyCurrency } = parsed.data;

  await connectDB();

  let currency = bodyCurrency ?? "INR";
  let amountPaise: number;

  if (product === "mock") {
    const offering = await MockInterviewOfferingModel.findOne({ id }).lean().exec();
    if (!offering) {
      return NextResponse.json({ error: "Mock offering not found" }, { status: 404 });
    }
    currency = bodyCurrency ?? offering.currency ?? "INR";
    const unit =
      orderType === "Rush Ordering" ? offering.rushPrice ?? offering.price : price;
    amountPaise = Math.round(unit * quantity * 100);
  } else {
    const canonical = getSimpleMentorshipById(id);
    if (!canonical) {
      return NextResponse.json({ error: "Mentorship offering not found" }, { status: 404 });
    }
    if (Math.abs(price - canonical.price) > 0.01) {
      return NextResponse.json({ error: "Price does not match selected package" }, { status: 400 });
    }
    currency = bodyCurrency ?? canonical.currency ?? "INR";
    amountPaise = Math.round(canonical.price * quantity * 100);
  }

  const instance = getRazorpay();
  if (!instance) {
    return NextResponse.json(
      {
        error: "Razorpay not configured",
        hint: "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (use rzp_test_* keys for test mode).",
      },
      { status: 503 }
    );
  }

  try {
    const order = await instance.orders.create({
      amount: amountPaise,
      currency,
      receipt: nanoid(12),
      payment_capture: true,
    });

    return NextResponse.json({
      amount: order.amount,
      id: order.id,
      currency: order.currency,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[payments/orders]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
