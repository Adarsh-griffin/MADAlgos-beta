import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import BlogModel from "@/models/Blog";
import MentorModel from "@/models/Mentor";
import TestimonialModel from "@/models/Testimonial";

export async function GET() {
  await connectDB();

  const conn = mongoose.connection;
  const dbName = conn.name;
  const host = (conn as any).host ?? undefined;

  const [
    mentorsTotal,
    mentorsIsActiveTrue,
    mentorsApprovalApproved,
    mentorsActiveApproved,
    mentorsIsActiveStringTrue,
    blogsTotal,
    blogsPublishedOrNoStatus,
    blogsPublished,
    blogsNoStatusField,
    testimonialsTotal,
    testimonialsApproved,
    latestBlogs,
  ] = await Promise.all([
    MentorModel.countDocuments(),
    MentorModel.countDocuments({ isActive: true }),
    MentorModel.countDocuments({ approvalStatus: "APPROVED" }),
    MentorModel.countDocuments({ isActive: true, approvalStatus: "APPROVED" }),
    MentorModel.countDocuments({ isActive: "true" }),
    BlogModel.countDocuments(),
    BlogModel.countDocuments({ $or: [{ status: "PUBLISHED" }, { status: { $exists: false } }] }),
    BlogModel.countDocuments({ status: "PUBLISHED" }),
    BlogModel.countDocuments({ status: { $exists: false } }),
    TestimonialModel.countDocuments(),
    TestimonialModel.countDocuments({ status: "APPROVED" }),
    BlogModel.find()
      .sort({ publishDate: -1 })
      .limit(5)
      .select({ id: 1, title: 1, status: 1, reviewStatus: 1, publishDate: 1 })
      .lean()
      .exec(),
  ]);

  return NextResponse.json({
    ok: true,
    db: { name: dbName, host },
    counts: {
      mentorsTotal,
      mentorsIsActiveTrue,
      mentorsApprovalApproved,
      mentorsActiveApproved,
      mentorsIsActiveStringTrue,
      blogsTotal,
      blogsPublishedOrNoStatus,
      blogsPublished,
      blogsNoStatusField,
      testimonialsTotal,
      testimonialsApproved,
    },
    latestBlogs,
  });
}

