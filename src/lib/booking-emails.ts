import { sendTemplateEmail, sendEmail, isSendgridConfigured } from "@/lib/email";
import { getAppBaseUrl } from "@/lib/app-base-url";

/** Internal inbox for order notifications (defaults to contact@madalgos.in). */
export function getTeamInboxEmail(): string {
  return process.env.CONTACT_TEAM_EMAIL?.trim() || "contact@madalgos.in";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Always notify the team inbox when a paid order is placed (plain HTML).
 * Uses CONTACT_TEAM_EMAIL or contact@madalgos.in. Reply-To is the customer.
 */
export async function notifyTeamOrderPlaced(opts: {
  kind: "mock" | "mentorship";
  customerEmail: string;
  customerName: string;
  customerPhone?: string | null;
  paymentId: string;
  orderId: string;
  bookingCountry: string;
  bookingId?: string;
  lines: { label: string; value: string }[];
}): Promise<void> {
  if (!isSendgridConfigured()) {
    console.warn("[booking-email] Team notify skipped: SendGrid API key not set.");
    return;
  }
  const to = getTeamInboxEmail();
  const subject = `[MADAlgos] New ${opts.kind === "mock" ? "mock interview" : "mentorship"} order — ${opts.paymentId}`;
  const rows = opts.lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 12px;border:1px solid #e5e7eb;font-weight:600;color:#374151">${escapeHtml(l.label)}</td><td style="padding:6px 12px;border:1px solid #e5e7eb">${escapeHtml(l.value)}</td></tr>`
    )
    .join("");
  const html = `
  <div style="font-family:system-ui,Segoe UI,sans-serif;font-size:14px;color:#111827;max-width:560px">
    <p style="margin:0 0 12px"><strong>New paid booking</strong> (${opts.kind})</p>
    <table style="border-collapse:collapse;width:100%;margin-bottom:12px">${rows}</table>
    <p style="margin:0;font-size:12px;color:#6b7280">You can reply to this email to reach the customer (Reply-To is set).</p>
  </div>`;
  try {
    await sendEmail({
      to,
      subject,
      html,
      replyTo: opts.customerEmail,
      text: `${opts.kind} order\n${opts.lines.map((l) => `${l.label}: ${l.value}`).join("\n")}`,
    });
  } catch (e) {
    console.error("[booking-email] notifyTeamOrderPlaced failed:", e);
  }
}

/** Legacy template IDs from MENTOR_BOOKMOCK_PAYMENT_EMAIL_COMPLETE_CODE.txt */
const TEMPLATE_MOCK_BOOKING = process.env.SENDGRID_MOCK_BOOKING_TEMPLATE_ID?.trim();
const TEMPLATE_MENTORSHIP_PURCHASE = process.env.SENDGRID_MENTORSHIP_PURCHASE_TEMPLATE_ID?.trim();
const TEMPLATE_MENTORSHIP_USER = process.env.SENDGRID_MENTORSHIP_BOOKING_USER_TEMPLATE_ID?.trim();
const TEMPLATE_MENTORSHIP_MENTOR = process.env.SENDGRID_MENTORSHIP_BOOKING_MENTOR_TEMPLATE_ID?.trim();

export async function sendMockBookingConfirmation(opts: {
  to: string;
  userName: string;
  mockType: string;
  mockDate: string;
  mockTimeSlot: string;
}) {
  if (!TEMPLATE_MOCK_BOOKING) {
    console.warn("[booking-email] SENDGRID_MOCK_BOOKING_TEMPLATE_ID not set; skip mock confirmation.");
    return { ok: false as const, reason: "no_template" };
  }
  return sendTemplateEmail({
    to: opts.to,
    templateId: TEMPLATE_MOCK_BOOKING,
    dynamicTemplateData: {
      userName: opts.userName,
      mockType: opts.mockType,
      mockDate: opts.mockDate,
      mockTimeSlot: opts.mockTimeSlot,
      company_name: "MAD Algos",
      app_base_url: getAppBaseUrl(),
    },
  });
}

export async function sendMentorshipPurchaseEmails(opts: {
  userEmail: string;
  userName: string;
  orderId: string;
  durationMonths: number;
  typeLabel: string;
  groupSize: number;
  expLabel: string;
  mentor?: { name: string; email: string } | null;
  menteeName: string;
}) {
  const results: { step: string; ok: boolean }[] = [];

  if (TEMPLATE_MENTORSHIP_PURCHASE) {
    const dynamicTemplateData = {
      userName: opts.userName,
      userExpString: opts.expLabel,
      orderId: opts.orderId,
      duration: String(opts.durationMonths),
      type: opts.typeLabel,
      groupSize: opts.groupSize,
      company_name: "MAD Algos",
      app_base_url: getAppBaseUrl(),
    };
    const r1 = await sendTemplateEmail({
      to: opts.userEmail,
      templateId: TEMPLATE_MENTORSHIP_PURCHASE,
      dynamicTemplateData,
    });
    results.push({ step: "purchase", ok: r1.ok });
  }

  if (opts.mentor && TEMPLATE_MENTORSHIP_USER && TEMPLATE_MENTORSHIP_MENTOR) {
    const u = await sendTemplateEmail({
      to: opts.userEmail,
      templateId: TEMPLATE_MENTORSHIP_USER,
      dynamicTemplateData: {
        userName: opts.menteeName,
        mentorName: opts.mentor.name,
        mentorEmail: opts.mentor.email,
        company_name: "MAD Algos",
      },
    });
    const m = await sendTemplateEmail({
      to: opts.mentor.email,
      templateId: TEMPLATE_MENTORSHIP_MENTOR,
      dynamicTemplateData: {
        mentorName: opts.mentor.name,
        menteeName: opts.menteeName,
        menteeEmail: opts.userEmail,
        company_name: "MAD Algos",
      },
    });
    results.push({ step: "user_mentor", ok: u.ok && m.ok });
  }

  return results;
}
