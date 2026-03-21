import sgMail from "@sendgrid/mail";

/** Tries common env names (Azure / local) so mail is not silently skipped due to naming. */
const SENDGRID_KEY_ENV_NAMES = [
  "SENDGRID_API_KEY",
  "SendGridDevKey",
  "SENDGRID_KEY",
] as const;

export function getSendgridKey(): string | null {
  for (const name of SENDGRID_KEY_ENV_NAMES) {
    const v = process.env[name]?.trim();
    if (v) return v;
  }
  return null;
}

export function isSendgridConfigured(): boolean {
  return getSendgridKey() !== null;
}

export type SendTemplateEmailResult =
  | { ok: true }
  | { ok: false; reason: "no_api_key" | "send_failed"; detail?: string };

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  /** So recipients can reply directly to the applicant / user */
  replyTo?: string;
  text?: string;
}) {
  const key = getSendgridKey();
  if (!key) {
    console.warn("[email] sendEmail skipped: no API key (set SENDGRID_API_KEY or SendGridDevKey).");
    return;
  }
  sgMail.setApiKey(key);
  const from = process.env.MAIL_FROM || "team@madalgos.in";
  await sgMail.send({
    to: opts.to,
    from,
    subject: opts.subject,
    html: opts.html,
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    ...(opts.text ? { text: opts.text } : {}),
  });
}

export async function sendTemplateEmail(opts: {
  to: string;
  templateId: string;
  dynamicTemplateData: Record<string, unknown>;
}): Promise<SendTemplateEmailResult> {
  const key = getSendgridKey();
  if (!key) {
    console.warn(
      "[email] sendTemplateEmail skipped: no API key. Set SENDGRID_API_KEY or SendGridDevKey."
    );
    return { ok: false, reason: "no_api_key" };
  }
  sgMail.setApiKey(key);
  const from = process.env.MAIL_FROM || "team@madalgos.in";
  try {
    await sgMail.send({
      to: opts.to,
      from,
      templateId: opts.templateId,
      dynamicTemplateData: opts.dynamicTemplateData,
    });
    return { ok: true };
  } catch (e: unknown) {
    const detail =
      e && typeof e === "object" && "response" in e
        ? JSON.stringify((e as { response?: { body?: unknown } }).response?.body)
        : e instanceof Error
          ? e.message
          : String(e);
    console.error("[email] sendTemplateEmail failed:", detail, e);
    return { ok: false, reason: "send_failed", detail };
  }
}

