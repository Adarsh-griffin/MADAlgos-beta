import { sendEmail, sendTemplateEmail, type SendTemplateEmailResult } from "@/lib/email";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type MentorApplicationEmailsResult = {
  applicantOk: boolean;
  teamOk: boolean;
};

/**
 * Sends mentor application confirmation (dynamic template to applicant) + team inbox mail.
 * Called after email ownership is verified.
 */
export async function sendMentorApplicationConfirmationEmails(params: {
  email: string;
  username: string;
  linkedinProfileUrl: string;
}): Promise<MentorApplicationEmailsResult> {
  const { email, username, linkedinProfileUrl } = params;

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

  const applicantResult: SendTemplateEmailResult = await sendTemplateEmail({
    to: email,
    templateId,
    dynamicTemplateData: templatePayload,
  });
  if (!applicantResult.ok) {
    console.error("Mentor apply email (applicant) failed:", applicantResult);
  }

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

  let teamOk = false;
  try {
    await sendEmail({
      to: teamInbox,
      subject: teamSubject,
      html: teamHtml,
      text: teamText,
      replyTo: email,
    });
    teamOk = true;
  } catch (e) {
    console.error("Mentor apply email (team) failed:", e);
  }

  return {
    applicantOk: applicantResult.ok,
    teamOk,
  };
}

/**
 * Sends a single email with a verification link (before application confirmation mails).
 */
export async function sendEmailVerificationMail(params: {
  email: string;
  username: string;
  verificationToken: string;
}): Promise<{ ok: boolean }> {
  const base =
    process.env.APP_BASE_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const verifyUrl = `${base}/api/auth/verify-email?token=${encodeURIComponent(params.verificationToken)}`;

  const templateId = process.env.SENDGRID_EMAIL_VERIFICATION_TEMPLATE_ID?.trim();
  if (templateId) {
    const r = await sendTemplateEmail({
      to: params.email,
      templateId,
      dynamicTemplateData: {
        user_name: params.username,
        name: params.username,
        first_name: params.username,
        user_email: params.email,
        verify_url: verifyUrl,
        verification_link: verifyUrl,
        company_name: "MAD Algos",
      },
    });
    return { ok: r.ok };
  }

  const subject = "Verify your email — MAD Algos";
  const html = `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;padding:24px;background:#0f172a;color:#e2e8f0;">
<div style="max-width:520px;margin:0 auto;background:#1e293b;border-radius:16px;padding:28px;border:1px solid rgba(255,255,255,0.1);">
  <h1 style="color:#14b8a6;font-size:20px;margin:0 0 12px;">Verify your email</h1>
  <p style="color:#94a3b8;font-size:14px;line-height:1.6;">Hi ${escapeHtml(params.username)}, please confirm you own this email so we can process your mentor application.</p>
  <p style="margin:24px 0;"><a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(90deg,#14b8a6,#6366f1);color:#020617;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;">Verify email</a></p>
  <p style="font-size:12px;color:#64748b;">If you did not request this, ignore this message.</p>
</div>
</body></html>`;
  const text = `Hi ${params.username},\n\nVerify your email to continue your mentor application:\n${verifyUrl}\n`;

  try {
    await sendEmail({ to: params.email, subject, html, text });
    return { ok: true };
  } catch (e) {
    console.error("Email verification send failed:", e);
    return { ok: false };
  }
}
