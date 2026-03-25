import { connectDB } from "@/lib/mongodb";
import PaymentModel from "@/models/Payment";
import UserModel from "@/models/User";
import BookedMockInterviewModel from "@/models/BookedMockInterview";
import BookedMentorshipModel from "@/models/BookedMentorship";
import MockInterviewOfferingModel from "@/models/MockInterviewOffering";
import MentorshipOfferingModel from "@/models/MentorshipOffering";
import MentorModel from "@/models/Mentor";
import TimeSlotModel from "@/models/TimeSlot";

export type AdminOrderRow = {
  id: string;
  type: "mock" | "mentorship";
  userEmail: string;
  userName: string | null;
  paymentId: string;
  orderId: string;
  paymentRecordedAt: string;
  bookingConfirmed: boolean;
  bookingId: string | null;
  bookingStatus: string | null;
  summary: string;
  assignedMentorLabel: string | null;
};

export async function getAdminOrderHistory(limit = 250): Promise<AdminOrderRow[]> {
  await connectDB();

  const payments = await PaymentModel.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .exec();

  if (payments.length === 0) return [];

  const userIds = [...new Set(payments.map((p) => String(p.userId)))];
  const users = await UserModel.find({ _id: { $in: userIds } })
    .select("email username")
    .lean()
    .exec();
  const userById = new Map(users.map((u) => [String(u._id), u]));

  const pids = payments.map((p) => p.paymentId);
  const [mocks, mentorships] = await Promise.all([
    BookedMockInterviewModel.find({ razorpayPaymentId: { $in: pids } }).lean().exec(),
    BookedMentorshipModel.find({ razorpayPaymentId: { $in: pids } }).lean().exec(),
  ]);
  const mockByPay = new Map(mocks.map((m) => [m.razorpayPaymentId, m]));
  const mentByPay = new Map(mentorships.map((m) => [m.razorpayPaymentId, m]));

  const mockOfferingIds = [...new Set(mocks.map((m) => m.mockOfferingId))];
  const slotIds = [...new Set(mocks.map((m) => m.timeSlotId))];
  const mentOfferingIds = [...new Set(mentorships.map((m) => m.mentorshipOfferingId))];
  const mentorNumIds = [
    ...new Set(mentorships.map((m) => m.assignedMentorId).filter((x): x is number => x != null)),
  ];

  const [mockOffs, slots, mentOffs, mentorDocs] = await Promise.all([
    mockOfferingIds.length
      ? MockInterviewOfferingModel.find({ id: { $in: mockOfferingIds } }).lean().exec()
      : [],
    slotIds.length ? TimeSlotModel.find({ id: { $in: slotIds } }).lean().exec() : [],
    mentOfferingIds.length
      ? MentorshipOfferingModel.find({ id: { $in: mentOfferingIds } }).lean().exec()
      : [],
    mentorNumIds.length ? MentorModel.find({ id: { $in: mentorNumIds } }).lean().exec() : [],
  ]);
  const mockOffById = new Map(mockOffs.map((o) => [o.id, o]));
  const slotById = new Map(slots.map((s) => [s.id, s]));
  const mentOffById = new Map(mentOffs.map((o) => [o.id, o]));
  const mentorByNum = new Map(mentorDocs.map((m) => [m.id, m]));

  const rows: AdminOrderRow[] = [];

  for (const p of payments) {
    const u = userById.get(String(p.userId));
    const email = u?.email ?? "—";
    const userName = u?.username ?? null;
    const mock = mockByPay.get(p.paymentId);
    const ment = mentByPay.get(p.paymentId);
    const created = (p as { createdAt?: Date }).createdAt;
    const paymentRecordedAt = created ? new Date(created).toISOString() : "";

    if (mock) {
      const off = mockOffById.get(mock.mockOfferingId);
      const sl = slotById.get(mock.timeSlotId);
      rows.push({
        id: `mock-${String(mock._id)}`,
        type: "mock",
        userEmail: email,
        userName,
        paymentId: p.paymentId,
        orderId: p.orderId,
        paymentRecordedAt,
        bookingConfirmed: true,
        bookingId: String(mock._id),
        bookingStatus: mock.status,
        summary: `${off?.label ?? `Mock #${mock.mockOfferingId}`} · ${sl?.displayLabel ?? "Slot"} · ${mock.mockInterviews}× · ${mock.bookingCountry}`,
        assignedMentorLabel: null,
      });
      continue;
    }

    if (ment) {
      const off = mentOffById.get(ment.mentorshipOfferingId);
      let assignedMentorLabel: string | null = null;
      if (ment.assignedMentorId != null) {
        const md = mentorByNum.get(ment.assignedMentorId);
        const parts = md?.interviewer
          ? [md.interviewer.firstName, md.interviewer.lastName].filter(Boolean)
          : [];
        assignedMentorLabel = parts.length ? parts.join(" ") : `Mentor #${ment.assignedMentorId}`;
      }
      rows.push({
        id: `ment-${String(ment._id)}`,
        type: "mentorship",
        userEmail: email,
        userName,
        paymentId: p.paymentId,
        orderId: p.orderId,
        paymentRecordedAt,
        bookingConfirmed: true,
        bookingId: String(ment._id),
        bookingStatus: ment.status,
        summary: `${off ? `${off.durationMonths} mo · ${off.personalSessions} sessions` : `Package #${ment.mentorshipOfferingId}`} · ${ment.bookingCountry}`,
        assignedMentorLabel,
      });
      continue;
    }

    rows.push({
      id: `pay-${p.paymentId}`,
      type: p.paymentFor,
      userEmail: email,
      userName,
      paymentId: p.paymentId,
      orderId: p.orderId,
      paymentRecordedAt,
      bookingConfirmed: false,
      bookingId: null,
      bookingStatus: null,
      summary:
        p.paymentFor === "mock"
          ? "Mock — payment without booking record (retry booking or support)"
          : "Mentorship — payment without booking record (retry booking or support)",
      assignedMentorLabel: null,
    });
  }

  return rows;
}
