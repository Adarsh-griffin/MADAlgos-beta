import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import UserModel from "@/models/User";
import MentorProfileModel from "@/models/MentorProfile";
import MentorModel from "@/models/Mentor";
import { sendTemplateEmail } from "@/lib/email";

type LiveEmailStatus =
  | { sent: true }
  | { sent: false; reason: "not_applicable" | "missing_template_id" | "no_api_key" | "send_failed"; detail?: string };

const BodySchema = z.object({
  userId: z.string().min(1),
});

async function requireAdmin() {
  const session = await getSessionFromRequestCookies();
  if (!session) return null;
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") return null;
  return session;
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  await connectDB();
  const user = await UserModel.findById(parsed.data.userId).lean().exec();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "MENTOR") return NextResponse.json({ error: "User is not a mentor" }, { status: 400 });
  if (user.verificationStatus !== "VERIFIED") {
    return NextResponse.json({ error: "Mentor must be verified first" }, { status: 400 });
  }

  const profile = await MentorProfileModel.findOne({ userId: user._id }).lean().exec();
  if (!profile || profile.reviewStatus !== "APPROVED") {
    return NextResponse.json({ error: "Mentor profile must be approved first" }, { status: 400 });
  }

  const mentor = await MentorModel.findOne({ profileId: `user:${String(user._id)}` }).exec();
  if (!mentor) {
    return NextResponse.json({ error: "Mentor record not synced yet. Approve profile first." }, { status: 400 });
  }

  // Toggle publish state: if currently approved & active, unpublish; otherwise publish.
  const isPublished = mentor.isActive && mentor.approvalStatus === "APPROVED";

  if (isPublished) {
    mentor.isActive = false;
    mentor.isVerified = false;
    mentor.approvalStatus = "UNPUBLISHED";
  } else {
    mentor.isActive = true;
    mentor.isVerified = true;
    mentor.approvalStatus = "APPROVED";
  }
  await mentor.save();

  let email: LiveEmailStatus = { sent: false, reason: "not_applicable" };

  // Email mentor only when they are **published** (going live), not when unpublishing.
  if (!isPublished) {
    const templateId = process.env.SENDGRID_MENTOR_PROFILE_LIVE_TEMPLATE_ID?.trim();
    const base =
      process.env.APP_BASE_URL?.replace(/\/$/, "") ||
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      "https://madalgos.in";
    const now = new Date();
    const publishedDate = now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
    const publishedTime = `${now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })} IST`;

    const profileDoc = await MentorProfileModel.findOne({ userId: user._id }).lean().exec();
    const username = (user.username as string | null)?.trim() || String(user.email).split("@")[0];
    const headline = profileDoc?.headline?.trim() || "—";

    const dynamicTemplateData = {
      user_name: username,
      name: username,
      first_name: username,
      user_email: user.email,
      headline,
      mentor_id: mentor.id,
      published_date: publishedDate,
      published_time: publishedTime,
      headline_text: "Your mentor profile is verified and live",
      body_intro:
        "Great news — your verification is complete and your profile is now published on the MadAlgos website. Visitors can find you on our Mentors page and you can continue managing your profile from your mentor dashboard.",
      mentors_page_url: `${base}/mentors`,
      mentor_dashboard_url: `${base}/mentor`,
      app_base_url: base,
      company_name: "MAD Algos",
      team_signature: "MAD Algos Team",
    };

    if (!templateId) {
      console.warn(
        "[mentor-publish] SENDGRID_MENTOR_PROFILE_LIVE_TEMPLATE_ID not set; skipping live notification email."
      );
      email = { sent: false, reason: "missing_template_id" };
    } else {
      const result = await sendTemplateEmail({
        to: user.email,
        templateId,
        dynamicTemplateData,
      });
      if (result.ok) {
        email = { sent: true };
        console.log(`[mentor-publish] Profile live email sent to ${user.email}`);
      } else if (result.reason === "no_api_key") {
        email = { sent: false, reason: "no_api_key" };
      } else {
        email = { sent: false, reason: "send_failed", detail: result.detail };
      }
    }
  }

  return NextResponse.json({ ok: true, published: !isPublished, email });
}

