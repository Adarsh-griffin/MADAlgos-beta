import React from "react";
import StudentsPageClient from "./client-page";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import BookedMockInterviewModel from "@/models/BookedMockInterview";
import BookedMentorshipModel from "@/models/BookedMentorship";
import type { UserDocument } from "@/models/User";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Types } from "mongoose";

export const metadata = {
  title: "Admin | Students",
};

export default async function AdminStudentsPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  await connectDB();

  const studentsRaw = await UserModel.find({ role: "STUDENT" }).sort({ createdAt: -1 }).lean().exec();

  const ids = studentsRaw.map((s) => s._id as Types.ObjectId);

  const [mockAgg, mentAgg] = await Promise.all([
    ids.length
      ? BookedMockInterviewModel.aggregate<{ _id: Types.ObjectId; n: number }>([
          { $match: { userId: { $in: ids } } },
          { $group: { _id: "$userId", n: { $sum: 1 } } },
        ]).exec()
      : Promise.resolve([]),
    ids.length
      ? BookedMentorshipModel.aggregate<{ _id: Types.ObjectId; n: number }>([
          { $match: { userId: { $in: ids } } },
          { $group: { _id: "$userId", n: { $sum: 1 } } },
        ]).exec()
      : Promise.resolve([]),
  ]);

  const mockCount = new Map(mockAgg.map((m) => [String(m._id), m.n]));
  const mentCount = new Map(mentAgg.map((m) => [String(m._id), m.n]));

  const mappedStudents = studentsRaw.map((s) => {
    const doc = s as UserDocument & { _id: Types.ObjectId };
    const id = String(doc._id);
    const m = mockCount.get(id) ?? 0;
    const n = mentCount.get(id) ?? 0;
    return {
      id,
      email: doc.email,
      username: doc.username,
      mobile: doc.mobile ?? null,
      enrolledCourse: doc.enrolledCourse ?? null,
      status: doc.status || "ACTIVE",
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
      lastLoginAt: doc.lastLoginAt?.toISOString() ?? null,
      mockBookingCount: m,
      mentorshipBookingCount: n,
      authProvider: doc.authProvider ?? null,
    };
  });

  return <StudentsPageClient initialStudents={mappedStudents} />;
}
