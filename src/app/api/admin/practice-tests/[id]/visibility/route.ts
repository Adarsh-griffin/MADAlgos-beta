import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import PracticeTestModel from "@/models/PracticeTest";

function requireSuperAdmin() {
  return getSessionFromRequestCookies().then((s) => (s?.role === "SUPER_ADMIN" ? s : null));
}

type Ctx = { params: Promise<{ id: string }> };

/** PATCH — `showOnHomepage` only (homepage featured cards). */
export async function PATCH(req: Request, ctx: Ctx) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  if (typeof body?.showOnHomepage !== "boolean") {
    return NextResponse.json({ message: "showOnHomepage (boolean) is required." }, { status: 400 });
  }

  await connectDB();
  const r = await PracticeTestModel.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    { $set: { showOnHomepage: body.showOnHomepage } }
  ).exec();

  if (r.matchedCount === 0) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, id, showOnHomepage: body.showOnHomepage });
}
