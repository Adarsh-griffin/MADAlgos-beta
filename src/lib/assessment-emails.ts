import sgMail from "@sendgrid/mail";
import { getSendgridKey } from "@/lib/email";
import { getAppBaseUrl } from "@/lib/app-base-url";
import { formatDisplayDateTime, getDisplayTimeZone } from "@/lib/datetime-display";

/** Keys passed to SendGrid dynamic_template_data (Handlebars: {{title}}, {{baseUrl}}, etc.). */
export function buildAssessmentTemplateData(
  title: string,
  duration: number,
  linkValidity: number,
  baseUrl: string,
  token: string
) {
  const testLink = `${baseUrl}/test/${token}`;
  return {
    title,
    duration,
    linkValidity,
    baseUrl,
    token,
    testLink,
    testTitle: title,
    validity: linkValidity,
  };
}

export type AssessmentTokenForEmail = { studentEmail: string; token: string };

/** Dynamic template data for test completion confirmation (no scores — confirmation only). */
export function buildAssessmentCompletionTemplateData(input: {
  testTitle: string;
  submittedAtIso: string;
  submittedAtDisplay: string;
  baseUrl: string;
  studentName?: string;
}) {
  const cleanBase = (input.baseUrl || "").replace(/\/$/, "");
  return {
    testTitle: input.testTitle,
    submittedAtIso: input.submittedAtIso,
    submittedAtDisplay: input.submittedAtDisplay,
    baseUrl: cleanBase,
    homeUrl: `${cleanBase}/`,
    testsUrl: `${cleanBase}/tests`,
    studentName: input.studentName ?? "",
  };
}

/** Dynamic template data for free test completion with score details. */
export function buildAssessmentScoreTemplateData(input: {
  testTitle: string;
  submittedAtIso: string;
  submittedAtDisplay: string;
  baseUrl: string;
  studentName?: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: "COMPLETED" | "AUTO_SUBMITTED";
}) {
  const cleanBase = (input.baseUrl || "").replace(/\/$/, "");
  return {
    testTitle: input.testTitle,
    submittedAtIso: input.submittedAtIso,
    submittedAtDisplay: input.submittedAtDisplay,
    baseUrl: cleanBase,
    homeUrl: `${cleanBase}/`,
    testsUrl: `${cleanBase}/tests`,
    studentName: input.studentName ?? "",
    totalScore: input.totalScore,
    maxScore: input.maxScore,
    percentage: input.percentage,
    status: input.status,
    statusLabel: input.status === "AUTO_SUBMITTED" ? "Auto submitted" : "Completed",
  };
}

/**
 * Sends a simple test-completion confirmation (no scores in this email).
 * Set `SENDGRID_ASSESSMENT_COMPLETION_TEMPLATE_ID` to your Dynamic Template ID in SendGrid.
 */
export async function sendAssessmentCompletionEmail(input: {
  to: string;
  studentName?: string;
  testTitle: string;
  submittedAt: Date;
}): Promise<{ sent: boolean; skipped: boolean }> {
  const sendgridKey = getSendgridKey();
  const templateId = process.env.SENDGRID_ASSESSMENT_COMPLETION_TEMPLATE_ID?.trim();
  const baseUrl = getAppBaseUrl();
  const from = process.env.MAIL_FROM || "noreply@madalgos.in";

  if (!sendgridKey) {
    console.warn("[assessment-email] Completion email skipped: no SendGrid API key.");
    return { sent: false, skipped: true };
  }

  sgMail.setApiKey(sendgridKey);

  const submittedAtIso = input.submittedAt.toISOString();
  const displayTz = getDisplayTimeZone();
  const submittedAtDisplay = `${formatDisplayDateTime(input.submittedAt)} (${displayTz})`;

  const data = buildAssessmentCompletionTemplateData({
    testTitle: input.testTitle,
    submittedAtIso,
    submittedAtDisplay,
    baseUrl,
    studentName: input.studentName,
  });

  try {
    if (templateId) {
      await sgMail.send({
        to: input.to,
        from,
        templateId,
        dynamicTemplateData: data,
      });
      return { sent: true, skipped: false };
    }

    const safeTitle = escapeHtml(input.testTitle);
    await sgMail.send({
      to: input.to,
      from,
      subject: `Test completed: ${input.testTitle} | MADAlgos`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #e2e8f0; border-radius: 16px; border: 1px solid #27272a;">
          <p style="margin: 0 0 12px; font-size: 14px; color: #94a3b8;">MADAlgos TestPortal</p>
          <p style="margin: 0 0 10px; font-size: 36px; line-height: 1;" aria-hidden="true">✅</p>
          <h1 style="margin: 0 0 8px; font-size: 20px; color: #fff;">Your test is complete</h1>
          <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.5;">Thank you. We’ve recorded your submission for <strong>${safeTitle}</strong>.</p>
          <p style="margin: 0; font-size: 13px; color: #94a3b8;">${escapeHtml(submittedAtDisplay)}</p>
          <p style="margin: 16px 0 0; font-size: 12px; color: #64748b;">If you did not take this test, contact support.</p>
        </div>
      `,
    });
    return { sent: true, skipped: false };
  } catch (e: unknown) {
    console.error("[assessment-email] Completion send failed:", e);
    return { sent: false, skipped: false };
  }
}

/**
 * Sends completion + score email (recommended for free test flows).
 * Set `SENDGRID_ASSESSMENT_SCORE_TEMPLATE_ID` to your Dynamic Template ID in SendGrid.
 */
export async function sendAssessmentScoreEmail(input: {
  to: string;
  studentName?: string;
  testTitle: string;
  submittedAt: Date;
  totalScore: number;
  maxScore: number;
  status: "COMPLETED" | "AUTO_SUBMITTED";
}): Promise<{ sent: boolean; skipped: boolean }> {
  const sendgridKey = getSendgridKey();
  const templateId = process.env.SENDGRID_ASSESSMENT_SCORE_TEMPLATE_ID?.trim();
  const baseUrl = getAppBaseUrl();
  const from = process.env.MAIL_FROM || "noreply@madalgos.in";

  if (!sendgridKey) {
    console.warn("[assessment-email] Score email skipped: no SendGrid API key.");
    return { sent: false, skipped: true };
  }

  sgMail.setApiKey(sendgridKey);

  const submittedAtIso = input.submittedAt.toISOString();
  const displayTz = getDisplayTimeZone();
  const submittedAtDisplay = `${formatDisplayDateTime(input.submittedAt)} (${displayTz})`;
  const safeMax = Math.max(0, Number(input.maxScore) || 0);
  const safeTotal = Math.min(safeMax, Math.max(0, Number(input.totalScore) || 0));
  const percentage = safeMax > 0 ? Math.round((safeTotal / safeMax) * 100) : 0;

  const data = buildAssessmentScoreTemplateData({
    testTitle: input.testTitle,
    submittedAtIso,
    submittedAtDisplay,
    baseUrl,
    studentName: input.studentName,
    totalScore: safeTotal,
    maxScore: safeMax,
    percentage,
    status: input.status,
  });

  try {
    if (templateId) {
      await sgMail.send({
        to: input.to,
        from,
        templateId,
        dynamicTemplateData: data,
      });
      return { sent: true, skipped: false };
    }

    const safeTitle = escapeHtml(input.testTitle);
    const statusLabel = input.status === "AUTO_SUBMITTED" ? "Auto submitted" : "Completed";
    await sgMail.send({
      to: input.to,
      from,
      subject: `Score report: ${input.testTitle} | MADAlgos`,
      html: `
        <div style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #070b18; color: #dbe7ff; border-radius: 18px; border: 1px solid #1c2845;">
          <p style="margin: 0 0 12px; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #22d3ee;">MADAlgos Free Test</p>
          <h1 style="margin: 0 0 8px; font-size: 24px; color: #fff;">Your score is ready</h1>
          <p style="margin: 0 0 14px; font-size: 15px; line-height: 1.5;">${input.studentName ? `Hi ${escapeHtml(input.studentName)},` : "Hi,"} we recorded your result for <strong>${safeTitle}</strong>.</p>
          <div style="background: #0d1530; border: 1px solid #22325d; border-radius: 14px; padding: 16px; margin: 12px 0 14px;">
            <p style="margin: 0; font-size: 13px; color: #9fb5df;">Score</p>
            <p style="margin: 6px 0 0; font-size: 28px; line-height: 1.1; font-weight: 800; color: #22d3ee;">${safeTotal}/${safeMax}</p>
            <p style="margin: 6px 0 0; font-size: 13px; color: #c4d3f3;">${percentage}% • ${statusLabel}</p>
          </div>
          <p style="margin: 0; font-size: 12px; color: #9fb5df;">Submitted at: ${escapeHtml(submittedAtDisplay)}</p>
          <p style="margin: 14px 0 0; font-size: 12px; color: #7f95c0;">This is an automated result email.</p>
        </div>
      `,
    });
    return { sent: true, skipped: false };
  } catch (e: unknown) {
    console.error("[assessment-email] Score send failed:", e);
    return { sent: false, skipped: false };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const SENDGRID_BATCH = 100;

export type SendAssessmentInvitationOptions = {
  /** Overrides hours shown in the template (e.g. when expiry is set from a calendar picker). */
  validityHoursForEmail?: number;
};

/**
 * Sends invitation emails for the given tokens. Chunks requests to avoid oversized payloads / timeouts.
 */
export async function sendAssessmentInvitationEmails(
  tokens: AssessmentTokenForEmail[],
  test: { title: string; duration: number; linkValidity: number },
  options?: SendAssessmentInvitationOptions
): Promise<{ emailsDispatched: number; emailSkipped: boolean; emailError?: string }> {
  if (tokens.length === 0) {
    return { emailsDispatched: 0, emailSkipped: false };
  }

  const sendgridKey = getSendgridKey();
  const templateId = process.env.SENDGRID_ASSESSMENT_DISPATCH_TEMPLATE_ID?.trim();
  const baseUrl = getAppBaseUrl();
  const from = process.env.MAIL_FROM || "noreply@madalgos.in";

  if (!sendgridKey) {
    console.warn(
      "[assessment-email] No SendGrid API key (set SENDGRID_API_KEY or SendGridDevKey); emails skipped."
    );
    return { emailsDispatched: 0, emailSkipped: true };
  }

  sgMail.setApiKey(sendgridKey);

  const { title, duration, linkValidity } = test;
  const effectiveValidity =
    typeof options?.validityHoursForEmail === "number" && !Number.isNaN(options.validityHoursForEmail)
      ? Math.max(1, Math.round(options.validityHoursForEmail))
      : linkValidity;

  const messages = tokens.map((t) => {
    const data = buildAssessmentTemplateData(title, duration, effectiveValidity, baseUrl, t.token);

    if (templateId) {
      return {
        to: t.studentEmail,
        from,
        templateId,
        dynamicTemplateData: data,
      };
    }

    return {
      to: t.studentEmail,
      from,
      subject: `Start your ${title} | MADAlgos`,
      html: `
            <div style="font-family: sans-serif; padding: 20px; text-align: center; border: 1px solid #ddd; border-radius: 20px;">
              <img src="https://madalgos.in/logo.png" alt="MADAlgos" style="height: 48px; margin-bottom: 20px;" />
              <h1 style="color: #000;">Test Link Dispatch</h1>
              <p style="font-size: 16px; color: #555;">Hi there! You've been invited to take the <b>${title}</b> on MADAlgos.</p>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 5px 0;"><b>Duration:</b> ${duration} minutes</p>
                <p style="margin: 5px 0;"><b>Validity:</b> Expires in ${effectiveValidity} hours</p>
              </div>
              <a href="${data.testLink}" style="background: #eab308; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Start Assessment</a>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">This link is unique to you. Do not share it.</p>
            </div>
          `,
    };
  });

  let emailsDispatched = 0;
  try {
    for (let i = 0; i < messages.length; i += SENDGRID_BATCH) {
      const chunk = messages.slice(i, i + SENDGRID_BATCH);
      await sgMail.send(chunk);
      emailsDispatched += chunk.length;
    }
    return { emailsDispatched, emailSkipped: false };
  } catch (e: unknown) {
    const detail =
      e && typeof e === "object" && "response" in e
        ? JSON.stringify((e as { response?: { body?: unknown } }).response?.body)
        : e instanceof Error
          ? e.message
          : String(e);
    console.error("[assessment-email] SendGrid send failed:", detail, e);
    return { emailsDispatched, emailSkipped: false, emailError: detail };
  }
}

export { parseEmailList, partitionEmailList, type InvalidEmailEntry, type PartitionedEmailList } from "@/lib/email-list-partition";
