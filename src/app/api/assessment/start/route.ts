import { connectDB } from "@/lib/mongodb";
import TestTokenModel from "@/models/TestToken";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const formData = await req.formData();
  const token = formData.get("token") as string;

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  await connectDB();

  const testToken = await TestTokenModel.findOne({ token });
  if (!testToken) {
    return new Response("Invalid token", { status: 404 });
  }

  if (testToken.isStarted) {
    // Already started, just redirect back
    redirect(`/test/${token}`);
  }

  // Lock session
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || "unknown";

  testToken.isStarted = true;
  testToken.usedAt = new Date();
  testToken.activatedIp = ip;
  await testToken.save();

  // Redirect back to the token page, which now renders the TestRoom
  redirect(`/test/${token}`);
}
