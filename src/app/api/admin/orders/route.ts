import { NextResponse } from "next/server";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { getAdminOrderHistory } from "@/lib/admin-orders";

/** GET /api/admin/orders — payment + booking history (ADMIN / SUPER_ADMIN). */
export async function GET() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getAdminOrderHistory(300);
  return NextResponse.json({ orders });
}
