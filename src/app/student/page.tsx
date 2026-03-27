import React from "react";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import BookedMockInterviewModel from "@/models/BookedMockInterview";
import BookedMentorshipModel from "@/models/BookedMentorship";
import MockInterviewOfferingModel from "@/models/MockInterviewOffering";
import TimeSlotModel from "@/models/TimeSlot";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { formatMentorshipOptionLabel, getSimpleMentorshipById } from "@/lib/mentorship-simple-packages";
import { formatMockOfferingLabel } from "@/lib/mock-offering-label";
import StudentTopBar from "./StudentTopBar";
import StudentPortalClient, { type MockOrderRow, type MentorshipOrderRow } from "./StudentPortalClient";

export const metadata = {
  title: "Student portal | MADAlgos",
  description: "View your mock and mentorship order history.",
};

export default async function StudentPortalPage() {
  const session = await getSessionFromRequestCookies();
  await connectDB();
  const user = session ? await UserModel.findById(session.uid).lean().exec() : null;

  if (!user || user.role !== "STUDENT") {
    redirect("/auth");
  }

  const uid = user._id;

  const [mockDocs, mentDocs] = await Promise.all([
    BookedMockInterviewModel.find({ userId: uid }).sort({ createdAt: -1 }).lean().exec(),
    BookedMentorshipModel.find({ userId: uid }).sort({ createdAt: -1 }).lean().exec(),
  ]);

  const mockOfferingIds = [...new Set(mockDocs.map((m) => m.mockOfferingId))];
  const slotIds = [...new Set(mockDocs.map((m) => m.timeSlotId))];

  const [mockOffers, slots] = await Promise.all([
    mockOfferingIds.length
      ? MockInterviewOfferingModel.find({ id: { $in: mockOfferingIds } })
          .lean()
          .exec()
      : [],
    slotIds.length ? TimeSlotModel.find({ id: { $in: slotIds } }).lean().exec() : [],
  ]);

  const mockOfferMap = new Map(mockOffers.map((o) => [o.id, o]));
  const slotMap = new Map(slots.map((s) => [s.id, s]));

  const mockOrders: MockOrderRow[] = mockDocs.map((b) => {
    const offer = mockOfferMap.get(b.mockOfferingId);
    const slot = slotMap.get(b.timeSlotId);
    const mockLabel =
      offer && typeof offer.expLevel === "number"
        ? formatMockOfferingLabel(offer)
        : offer?.label ?? `Mock #${b.mockOfferingId}`;
    const slotLabel = slot?.displayLabel
      ? `${slot.displayLabel} (${slot.startTime}–${slot.endTime})`
      : `Slot #${b.timeSlotId}`;
    return {
      id: String(b._id),
      mockLabel,
      buyerExperienceBracket: b.buyerExperienceBracket ?? null,
      mockType: offer?.mockType ?? "—",
      slotLabel,
      mockDate: new Date(b.mockDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      status: b.status,
      quantity: b.mockInterviews,
      country: b.bookingCountry,
      paymentId: b.razorpayPaymentId,
      orderId: b.razorpayOrderId,
      bookedAt: b.createdAt
        ? new Date(b.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        : "—",
    };
  });

  const mentorshipOrders: MentorshipOrderRow[] = mentDocs.map((b) => {
    const simple = getSimpleMentorshipById(b.mentorshipOfferingId);
    const packageLabel = simple
      ? formatMentorshipOptionLabel(simple)
      : `Mentorship #${b.mentorshipOfferingId}`;
    return {
      id: String(b._id),
      packageLabel,
      status: b.status,
      country: b.bookingCountry,
      paymentId: b.razorpayPaymentId,
      orderId: b.razorpayOrderId,
      bookedAt: b.createdAt
        ? new Date(b.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        : "—",
      expiryDate: b.expiryDate ? new Date(b.expiryDate).toLocaleDateString("en-IN") : "—",
    };
  });

  const displayName = user.username?.trim() || user.email.split("@")[0];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <StudentTopBar />
      <StudentPortalClient
        displayName={displayName}
        email={user.email}
        mockOrders={mockOrders}
        mentorshipOrders={mentorshipOrders}
      />
    </div>
  );
}
