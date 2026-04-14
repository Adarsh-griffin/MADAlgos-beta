import sgMail from "@sendgrid/mail";
import { getSendgridKey } from "@/lib/email";
import { getAppBaseUrl } from "@/lib/app-base-url";

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

const SENDGRID_BATCH = 100;

/**
 * Sends invitation emails for the given tokens. Chunks requests to avoid oversized payloads / timeouts.
 */
export async function sendAssessmentInvitationEmails(
  tokens: AssessmentTokenForEmail[],
  test: { title: string; duration: number; linkValidity: number }
): Promise<{ emailsDispatched: number; emailSkipped: boolean; emailError?: string }> {
  if (tokens.length === 0) {
    return { emailsDispatched: 0, emailSkipped: false };
  }

  const sendgridKey = getSendgridKey();
  const templateId = process.env.SENDGRID_ASSESSMENT_DISPATCH_TEMPLATE_ID?.trim();
  const baseUrl = getAppBaseUrl();
  const from = process.env.MAIL_FROM || "support@madalgos.in";

  if (!sendgridKey) {
    console.warn(
      "[assessment-email] No SendGrid API key (set SENDGRID_API_KEY or SendGridDevKey); emails skipped."
    );
    return { emailsDispatched: 0, emailSkipped: true };
  }

  sgMail.setApiKey(sendgridKey);

  const { title, duration, linkValidity } = test;

  const messages = tokens.map((t) => {
    const data = buildAssessmentTemplateData(title, duration, linkValidity, baseUrl, t.token);

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
                <p style="margin: 5px 0;"><b>Validity:</b> Expires in ${linkValidity} hours</p>
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
