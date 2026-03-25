import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MockInterviewOfferingModel from "@/models/MockInterviewOffering";
import TimeSlotModel from "@/models/TimeSlot";
import MentorshipOfferingModel from "@/models/MentorshipOffering";

/** Public catalog for book-mock / book-mentorship UIs. */
export async function GET() {
  await connectDB();
  const [mocks, slots, mentorships] = await Promise.all([
    MockInterviewOfferingModel.find().sort({ id: 1 }).lean().exec(),
    TimeSlotModel.find().sort({ id: 1 }).lean().exec(),
    MentorshipOfferingModel.find().sort({ id: 1 }).lean().exec(),
  ]);

  return NextResponse.json({
    mockOfferings: mocks,
    timeSlots: slots,
    mentorshipOfferings: mentorships,
  });
}
