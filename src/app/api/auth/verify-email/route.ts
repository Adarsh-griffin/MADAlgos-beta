import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { sendMentorApplicationConfirmationEmails } from "@/lib/mentor-application-emails";

const VERIFY_HOURS = 48;

function appBaseUrl(req: NextRequest): string {
  return (
    process.env.APP_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(req.url).origin
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const base = appBaseUrl(req);

  if (!token?.trim()) {
    return NextResponse.redirect(new URL("/auth?verify=missing", base));
  }

  await connectDB();
  const user = await UserModel.findOne({ emailVerificationToken: token.trim() }).exec();

  if (!user) {
    return NextResponse.redirect(new URL("/auth?verify=invalid", base));
  }

  if (user.emailVerificationExpiresAt && user.emailVerificationExpiresAt.getTime() < Date.now()) {
    return NextResponse.redirect(new URL("/auth?verify=expired", base));
  }

  const shouldSendMentorApply =
    user.role === "MENTOR_PENDING" &&
    user.accountStatus === "PENDING_APPLICATION" &&
    !user.mentorApplyEmailsSent;

  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpiresAt = null;
  await user.save();

  if (shouldSendMentorApply && user.username && user.linkedinProfileUrl) {
    const { applicantOk } = await sendMentorApplicationConfirmationEmails({
      email: user.email,
      username: user.username,
      linkedinProfileUrl: user.linkedinProfileUrl,
    });
    if (applicantOk) {
      await UserModel.updateOne({ _id: user._id }, { $set: { mentorApplyEmailsSent: true } }).exec();
    }
  }

  return NextResponse.redirect(new URL("/auth?verified=1", base));
}
