import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { sendEmail, sendTemplateEmail } from "@/lib/email";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const BodySchema = z.object({
  email: z.string().email(),
  username: z.string().min(2).max(50),
  linkedinProfileUrl: z.string().url(),
});

export async function POST(req: Request) {
  await connectDB();
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();

  const existing = await UserModel.findOne({ email }).lean().exec();
  if (existing) {
    return NextResponse.json(
      { error: "Email already exists. Please sign in or contact support." },
      { status: 409 }
    );
  }

  const username = parsed.data.username.trim();
  const linkedinProfileUrl = parsed.data.linkedinProfileUrl.trim();

  await UserModel.create({
    email,
    username,
    role: "MENTOR_PENDING",
    accountStatus: "PENDING_APPLICATION",
    verificationStatus: "UNVERIFIED",
    linkedinProfileUrl,
    authProvider: null,
    passwordHash: null,
    googleId: null,
    mentorCredentialToken: null,
    mentorCredentialTokenExpiresAt: null,
    profileCompleted: false,
    lastLoginAt: null,
  });

  // Send mentor-application confirmation email (best effort).
  const templateId =
    process.env.SENDGRID_MENTOR_APPLY_TEMPLATE_ID ||
    "d-5fd20c05a31c4445a3292385513ee1c8";

  const now = new Date();
  const submittedDate = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
  const submittedTime = `${now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })} IST`;

  const supportEmail = process.env.MAIL_FROM || "team@madalgos.in";
  // Match SendGrid template placeholders; also send name/first_name so templates
  // that use {{first_name}} or {{name}} do not fall back to editor sample text (e.g. "Jane").
  const templatePayload = {
    user_name: username,
    name: username,
    first_name: username,
    user_email: email,
    linkedin_url: linkedinProfileUrl,
    linkedin_display: linkedinProfileUrl.replace(/^https?:\/\/(www\.)?/i, ""),
    submitted_date: submittedDate,
    submitted_time: submittedTime,
    status_text: "UNDER VERIFICATION / APPROVAL",
    support_email: supportEmail,
  };

  const applicantMail = await sendTemplateEmail({
    to: email,
    templateId,
    dynamicTemplateData: templatePayload,
  });
  if (!applicantMail.ok) {
    console.error("Mentor apply email (applicant) failed:", applicantMail);
  }

  // Internal notification — same pattern as /api/contact (team + user).
  const teamInbox =
    process.env.MENTOR_APPLY_NOTIFY_EMAIL?.trim() ||
    process.env.CONTACT_TEAM_EMAIL?.trim() ||
    "contact@madalgos.in";

  const teamSubject = `New mentor application: ${username}`;
  const teamText = [
    "New mentor application received.",
    "",
    `Username: ${username}`,
    `Email: ${email}`,
    `LinkedIn: ${linkedinProfileUrl}`,
    `Submitted: ${submittedDate} ${submittedTime}`,
    "",
    "Reply to this email to reach the applicant.",
  ].join("\n");

  const teamHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;padding:24px;margin:0}.card{background:rgba(30,41,59,0.8);border-radius:16px;padding:24px;max-width:560px;border:1px solid rgba(255,255,255,0.1)}h1{font-size:20px;margin:0 0 16px;color:#14b8a6}.row{margin:8px 0;font-size:14px}.label{color:#94a3b8;font-weight:600}.value{color:#f8fafc}</style></head>
<body>
<div class="card">
  <h1>New mentor application</h1>
  <div class="row"><span class="label">Username:</span> <span class="value">${escapeHtml(username)}</span></div>
  <div class="row"><span class="label">Email:</span> <span class="value">${escapeHtml(email)}</span></div>
  <div class="row"><span class="label">LinkedIn:</span> <span class="value"><a href="${escapeHtml(linkedinProfileUrl)}" style="color:#5eead4">${escapeHtml(linkedinProfileUrl)}</a></span></div>
  <div class="row"><span class="label">Submitted:</span> <span class="value">${escapeHtml(submittedDate)} ${escapeHtml(submittedTime)}</span></div>
  <p style="margin-top:16px;font-size:13px;color:#94a3b8">Review in Admin → Mentors. Reply to this email to contact the applicant.</p>
</div>
</body>
</html>`;

  try {
    await sendEmail({
      to: teamInbox,
      subject: teamSubject,
      html: teamHtml,
      text: teamText,
      replyTo: email,
    });
  } catch (e) {
    console.error("Mentor apply email (team) failed:", e);
  }

  return NextResponse.json({ ok: true });
}

