import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { getSessionFromRequestCookies } from "@/lib/auth";
import MentorProfileModel from "@/models/MentorProfile";
import UserModel from "@/models/User";
import { isSendgridConfigured, sendEmail, sendTemplateEmail } from "@/lib/email";

type ProfileEmailStatus =
  | { sent: true }
  | { sent: false; reason: "missing_template_id" | "no_api_key" | "send_failed"; detail?: string };

type TeamEmailStatus =
  | { sent: true }
  | { sent: false; reason: "no_api_key" | "send_failed"; detail?: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function requireMentor() {
  const session = await getSessionFromRequestCookies();
  if (!session || session.role !== "MENTOR") return null;
  return session;
}

export async function GET() {
  const session = await requireMentor();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const user = await UserModel.findById(session.uid).lean().exec();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile =
    (await MentorProfileModel.findOne({ userId: user._id }).lean().exec()) ??
    ({
      userId: user._id,
      headline: "",
      companies: "",
      location: null,
      description: "",
      skills: [],
      imageUrl: null,
      linkedin: user.linkedinProfileUrl ?? null,
      reviewStatus: "PENDING_REVIEW",
      rejectionReason: null,
    } as any);

  return NextResponse.json({
    user: {
      email: user.email,
      username: user.username,
      verificationStatus: user.verificationStatus,
    },
    profile,
  });
}

const PutSchema = z.object({
  headline: z.string().max(200),
  companies: z.string().max(200),
  location: z.string().max(120).nullable(),
  description: z.string().max(2000),
  skills: z.array(z.string().max(50)).max(20),
  imageUrl: z.string().url().nullable().optional(),
  linkedin: z.string().url().nullable().optional(),
});

export async function PUT(req: Request) {
  const session = await requireMentor();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = PutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  await connectDB();
  const user = await UserModel.findById(session.uid).exec();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = parsed.data;

  const profile = await MentorProfileModel.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        headline: data.headline,
        companies: data.companies,
        location: data.location,
        description: data.description,
        skills: data.skills,
        imageUrl: data.imageUrl ?? null,
        linkedin: data.linkedin ?? user.linkedinProfileUrl ?? null,
        reviewStatus: "PENDING_REVIEW",
        rejectionReason: null,
      },
    },
    { upsert: true, new: true }
  ).lean();

  const profileCompleted =
    !!data.headline.trim() &&
    !!data.companies.trim() &&
    !!(data.location ?? "").trim() &&
    !!data.description.trim() &&
    Array.isArray(data.skills) &&
    data.skills.length > 0 &&
    !!(data.linkedin ?? user.linkedinProfileUrl ?? "").trim();
  // Image is optional; keep it out of "completion".

  user.profileCompleted = profileCompleted;

  if (data.linkedin) {
    user.linkedinProfileUrl = data.linkedin;
  }
  await user.save();

  const templateId = process.env.SENDGRID_MENTOR_PROFILE_SUBMITTED_TEMPLATE_ID?.trim();
  const base =
    process.env.APP_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://madalgos.in";
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

  const username = user.username?.trim() || user.email.split("@")[0];
  const mentorPanelUrl = `${base}/mentor`;

  const dynamicTemplateData = {
    user_name: username,
    name: username,
    first_name: username,
    user_email: user.email,
    headline: data.headline.trim() || "—",
    submitted_date: submittedDate,
    submitted_time: submittedTime,
    status_line: "Status: Pending review",
    body_intro:
      "Thank you for submitting your mentor profile. We have received your information and it is now in our review queue. Our team will review your details shortly. If we need anything else or spot an issue, we will reach out by email.",
    mentor_panel_url: mentorPanelUrl,
    app_base_url: base,
    company_name: "MAD Algos",
    team_signature: "MAD Algos Team",
  };

  let email: ProfileEmailStatus = { sent: false, reason: "missing_template_id" };

  if (!templateId) {
    console.warn(
      "[mentor-profile] SENDGRID_MENTOR_PROFILE_SUBMITTED_TEMPLATE_ID not set; skipping confirmation email."
    );
  } else {
    const result = await sendTemplateEmail({
      to: user.email,
      templateId,
      dynamicTemplateData,
    });
    if (result.ok) {
      email = { sent: true };
      console.log(`[mentor-profile] Profile submitted email sent to ${user.email}`);
    } else if (result.reason === "no_api_key") {
      email = { sent: false, reason: "no_api_key" };
    } else {
      email = { sent: false, reason: "send_failed", detail: result.detail };
    }
  }

  // Internal: short team ping — same inbox as mentor apply (no extra env required).
  const teamInbox =
    process.env.MENTOR_APPLY_NOTIFY_EMAIL?.trim() ||
    process.env.CONTACT_TEAM_EMAIL?.trim() ||
    "contact@madalgos.in";

  const adminMentorsUrl = `${base}/admin/mentors`;

  let teamEmail: TeamEmailStatus = { sent: false, reason: "no_api_key" };

  if (!isSendgridConfigured()) {
    console.warn("[mentor-profile] Team notify skipped: no SendGrid API key.");
  } else {
    const teamSubject = `Review mentor profile: ${username}`;
    const teamText = [
      "Please review this mentor's profile details in the admin panel.",
      "",
      `Name: ${username}`,
      `Email: ${user.email}`,
      `Submitted: ${submittedDate} ${submittedTime}`,
      "",
      `Admin: ${adminMentorsUrl}`,
      "",
      "Reply to this email to contact the mentor.",
    ].join("\n");

    const teamHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;padding:24px;margin:0}.card{background:rgba(30,41,59,0.8);border-radius:16px;padding:24px;max-width:560px;border:1px solid rgba(255,255,255,0.1)}h1{font-size:20px;margin:0 0 16px;color:#14b8a6}.row{margin:8px 0;font-size:14px}.label{color:#94a3b8;font-weight:600}.value{color:#f8fafc}</style></head>
<body>
<div class="card">
  <h1>Mentor profile — review needed</h1>
  <p style="color:#94a3b8;font-size:14px;margin:0 0 16px">Please review this mentor's profile details in Admin.</p>
  <div class="row"><span class="label">Name:</span> <span class="value">${escapeHtml(username)}</span></div>
  <div class="row"><span class="label">Email:</span> <span class="value">${escapeHtml(user.email)}</span></div>
  <div class="row"><span class="label">Submitted:</span> <span class="value">${escapeHtml(submittedDate)} ${escapeHtml(submittedTime)}</span></div>
  <p style="margin-top:16px;font-size:13px;color:#94a3b8"><a href="${escapeHtml(adminMentorsUrl)}" style="color:#5eead4">Open Admin → Mentors</a></p>
  <p style="margin-top:12px;font-size:12px;color:#64748b">Reply to this email to contact the mentor.</p>
</div>
</body>
</html>`;

    try {
      await sendEmail({
        to: teamInbox,
        subject: teamSubject,
        html: teamHtml,
        text: teamText,
        replyTo: user.email,
      });
      teamEmail = { sent: true };
      console.log(`[mentor-profile] Team notify sent to ${teamInbox}`);
    } catch (e: unknown) {
      const detail = e instanceof Error ? e.message : String(e);
      console.error("[mentor-profile] Team notify failed:", e);
      teamEmail = { sent: false, reason: "send_failed", detail };
    }
  }

  return NextResponse.json({ ok: true, profile, email, teamEmail });
}

