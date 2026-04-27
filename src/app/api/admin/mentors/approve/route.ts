import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { sendTemplateEmail } from "@/lib/email";
import { getAppBaseUrl, getAppUrl } from "@/lib/app-base-url";

type EmailNotifyStatus =
  | { sent: true }
  | { sent: false; reason: "missing_template_id" | "no_api_key" | "send_failed"; detail?: string };

const BodySchema = z.object({
  id: z.string().min(1),
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
  const user = await UserModel.findById(parsed.data.id).exec();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "MENTOR_PENDING") {
    return NextResponse.json({ error: "User is not a pending mentor" }, { status: 400 });
  }

  user.role = "MENTOR";
  user.accountStatus = "ACTIVE";
  user.mentorCredentialToken = null;
  user.mentorCredentialTokenExpiresAt = null;
  await user.save();

  const templateId = process.env.SENDGRID_MENTOR_ACCEPTED_TEMPLATE_ID?.trim();
  const base = getAppBaseUrl();
  const supportEmail = process.env.MAIL_FROM || "noreply@madalgos.in";
  const now = new Date();
  const acceptedDate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const acceptedTime = `${now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })} IST`;

  const username = user.username?.trim() || user.email.split("@")[0];
  const signInUrl = getAppUrl("/auth");
  const mentorHubUrl = getAppUrl("/mentor");
  const websiteUrl = getAppUrl("/");
  const dynamicTemplateData = {
    // Names (use any of these in your SendGrid template)
    user_name: username,
    username,
    name: username,
    first_name: username,
    // Contact
    user_email: user.email,
    support_email: supportEmail,
    // Branding
    company_name: "MAD Algos",
    team_signature: "MAD Algos Team",
    // Links — all built from APP_BASE_URL / NEXT_PUBLIC_APP_URL (see getAppBaseUrl)
    app_base_url: base,
    sign_in_url: signInUrl,
    auth_url: signInUrl,
    mentor_hub_url: mentorHubUrl,
    mentor_panel_url: mentorHubUrl,
    profile_url: mentorHubUrl,
    /** Public marketing site / home (use for “Go to website” CTA). */
    website_url: websiteUrl,
    home_url: websiteUrl,
    public_site_url: websiteUrl,
    // Aliases for HTML templates (same URLs; flow is email → /auth → password → /mentor)
    set_password_url: signInUrl,
    create_profile_url: mentorHubUrl,
    /** Legacy: same as mentor hub (mentor dashboard). Prefer mentor_hub_url in new templates. */
    dashboard_url: mentorHubUrl,
    // When it was approved
    accepted_date: acceptedDate,
    accepted_time: acceptedTime,
    // One-line guidance for the template body
    next_steps_summary:
      "Sign in with your email on the website. If you have not set a password yet, you will be prompted to create one. Then complete your mentor profile in Mentor Hub.",
    headline: "Your mentor application has been accepted",
    // Button labels for SendGrid (optional — or hardcode in template)
    sign_in_button_label: "Sign in",
    mentor_hub_button_label: "Open mentor hub",
    website_button_label: "MADAlgos.in",
  };

  let email: EmailNotifyStatus = { sent: false, reason: "missing_template_id" };

  if (!templateId) {
    console.warn(
      "[mentor-approve] SENDGRID_MENTOR_ACCEPTED_TEMPLATE_ID is not set; acceptance email skipped."
    );
  } else {
    const result = await sendTemplateEmail({
      to: user.email,
      templateId,
      dynamicTemplateData,
    });
    if (result.ok) {
      email = { sent: true };
      console.log(`[mentor-approve] Acceptance email queued/sent to ${user.email}`);
    } else if (result.reason === "no_api_key") {
      email = { sent: false, reason: "no_api_key" };
    } else {
      email = { sent: false, reason: "send_failed", detail: result.detail };
    }
  }

  return NextResponse.json({ ok: true, email });
}

