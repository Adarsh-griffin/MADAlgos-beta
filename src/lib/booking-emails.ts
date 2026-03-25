import { sendTemplateEmail } from "@/lib/email";
import { getAppBaseUrl } from "@/lib/app-base-url";

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
  const team = process.env.CONTACT_TEAM_EMAIL?.trim() || "contact@madalgos.in";
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
    const r2 = await sendTemplateEmail({
      to: team,
      templateId: TEMPLATE_MENTORSHIP_PURCHASE,
      dynamicTemplateData,
    });
    results.push({ step: "purchase", ok: r1.ok && r2.ok });
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
