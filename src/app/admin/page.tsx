import React from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { connectDB } from "@/lib/mongodb";
import MentorModel from "@/models/Mentor";
import BlogModel from "@/models/Blog";
import UserModel from "@/models/User";
import TestimonialModel from "@/models/Testimonial";
import MentorProfileModel from "@/models/MentorProfile";
import type { BlogDocument } from "@/models/Blog";
import { blogPendingReviewMongoFilter } from "@/lib/blog-admin-status";
import type { UserDocument } from "@/models/User";
import type { TestimonialDocument } from "@/models/Testimonial";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, MessageSquareQuote, GraduationCap, ShoppingBag } from "lucide-react";
import PaymentModel from "@/models/Payment";

export const metadata = {
  title: "Admin Dashboard | MADAlgos",
};

// Ensure this dashboard is always rendered dynamically with fresh data.
export const dynamic = "force-dynamic";

function StatCard({ title, value, icon, link }: { title: string, value: number, icon: React.ReactNode, link: string }) {
  return (
    <Link href={link} className="block group">
      <div className="rounded-3xl bg-[#050505]/80 border border-white/10 p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors h-full">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-white/5 rounded-2xl text-primary">
            {icon}
          </div>
          <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        </div>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    redirect("/auth");
  }

  await connectDB();

  const [
    mentorApplicants,
    pendingBlogsRaw,
    pendingTestimonialsRaw,
    pendingMentorProfilesRaw,
    totalMentors,
    totalStudents,
    totalBlogs,
    totalTestimonials,
    totalPayments,
  ] = await Promise.all([
    UserModel.find({ role: { $in: ["MENTOR_PENDING", "MENTOR"] }, accountStatus: "PENDING_APPLICATION" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean<UserDocument[]>()
      .exec(),
    BlogModel.find(blogPendingReviewMongoFilter)
      .sort({ publishDate: -1 })
      .limit(5)
      .lean<BlogDocument[]>()
      .exec(),
    TestimonialModel.find({ status: { $ne: "APPROVED" } })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean<TestimonialDocument[]>()
      .exec(),
    MentorProfileModel.find({ reviewStatus: "PENDING_REVIEW" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean<any[]>()
      .exec(),
    UserModel.countDocuments({ role: { $in: ["MENTOR", "MENTOR_PENDING", "ADMIN", "SUPER_ADMIN"] } }),
    UserModel.countDocuments({ role: "STUDENT" }),
    BlogModel.countDocuments(),
    TestimonialModel.countDocuments(),
    PaymentModel.countDocuments(),
  ]);

  const profileUserIds = pendingMentorProfilesRaw
    .map((p: any) => p.userId)
    .filter(Boolean);
  const profileUsersRaw = profileUserIds.length
    ? await UserModel.find({ _id: { $in: profileUserIds } })
        .select("_id email username")
        .lean()
        .exec()
    : [];
  const profileUsersById = new Map(
    profileUsersRaw.map((u: any) => [String(u._id), { email: u.email, username: u.username }])
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        description={`Welcome back. You are logged in as a ${session.role.replace("_", " ")}.`}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Order history" value={totalPayments} icon={<ShoppingBag className="w-6 h-6" />} link="/admin/orders" />
        <StatCard title="Total Mentors" value={totalMentors} icon={<Users className="w-6 h-6" />} link="/admin/mentors" />
        <StatCard title="Total Blogs" value={totalBlogs} icon={<BookOpen className="w-6 h-6" />} link="/admin/blogs" />
        <StatCard title="Testimonials" value={totalTestimonials} icon={<MessageSquareQuote className="w-6 h-6" />} link="/admin/testimonials" />
        <StatCard title="Total Students" value={totalStudents} icon={<GraduationCap className="w-6 h-6" />} link="/admin/students" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">

        {/* Pending Mentors */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-white/10 pb-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Mentor Applications</h2>
              <p className="text-xs text-slate-400 mt-1">Recent unapproved applications</p>
            </div>
            <Button variant="link" asChild className="text-primary hover:text-primary/80 pr-0">
              <Link href="/admin/mentors">View All</Link>
            </Button>
          </div>
          <DataTable
            headers={["Applicant", "Status"]}
            rows={mentorApplicants.map(m => [
              <div key="c" className="flex flex-col">
                <span className="font-medium text-white truncate max-w-[200px]">{m.username || "No Name"}</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[200px]">{m.email}</span>
              </div>,
              <StatusBadge key="s" label={m.accountStatus} tone="warning" />,
            ])}
            emptyMessage="No pending mentor applications."
          />
        </section>

        {/* Pending Mentor Profiles */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-white/10 pb-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Mentor Profile Updates</h2>
              <p className="text-xs text-slate-400 mt-1">Profiles submitted for review</p>
            </div>
            <Button variant="link" asChild className="text-primary hover:text-primary/80 pr-0">
              <Link href="/admin/mentors">View All</Link>
            </Button>
          </div>
          <DataTable
            headers={["Mentor", "Updated", "Status"]}
            rows={pendingMentorProfilesRaw.map((p: any) => [
              (() => {
                const u = profileUsersById.get(String(p.userId));
                return (
                  <div key="u" className="flex flex-col min-w-0">
                    <span className="font-medium text-white truncate max-w-[240px]">
                      {u?.username || "Mentor"}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[240px]">
                      {u?.email || String(p.userId)}
                    </span>
                  </div>
                );
              })(),
              <span key="d" className="text-slate-400">
                {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "—"}
              </span>,
              <StatusBadge key="s" label="PENDING_REVIEW" tone="warning" />,
            ])}
            emptyMessage="No pending mentor profile updates."
          />
        </section>

        {/* Pending Blogs */}
        <section className="space-y-4">
          <div className="flex justify-between items-end border-b border-white/10 pb-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Pending Blogs</h2>
              <p className="text-xs text-slate-400 mt-1">Submitted blogs awaiting review</p>
            </div>
            <Button variant="link" asChild className="text-primary hover:text-primary/80 pr-0">
              <Link href="/admin/blogs">View All</Link>
            </Button>
          </div>
          <DataTable
            headers={["Title", "Author"]}
            rows={pendingBlogsRaw.map((b: any) => [
              <span key="t" className="font-medium text-white truncate max-w-[250px]" title={b.title}>{b.title}</span>,
              <span key="a" className="text-slate-300 truncate max-w-[150px]">{b.authorDetails?.firstName ?? `#${b.authorId}`}</span>,
            ])}
            emptyMessage="No blogs currently pending review."
          />
        </section>

        {/* Pending Testimonials */}
        <section className="space-y-4 lg:col-span-2">
          <div className="flex justify-between items-end border-b border-white/10 pb-2">
            <div>
              <h2 className="text-xl font-semibold text-white">Pending Testimonials</h2>
              <p className="text-xs text-slate-400 mt-1">Recent unapproved testimonials</p>
            </div>
            <Button variant="link" asChild className="text-primary hover:text-primary/80 pr-0">
              <Link href="/admin/testimonials">View All</Link>
            </Button>
          </div>
          <DataTable
            headers={["Author", "Role", "Status"]}
            rows={pendingTestimonialsRaw.map((t: any) => [
              <span key="n" className="font-medium text-white">{t.name}</span>,
              <span key="r" className="text-slate-300 truncate max-w-[300px]">{t.role}</span>,
              <StatusBadge key="s" label={t.status || "PENDING"} tone="warning" />,
            ])}
            emptyMessage="No pending testimonials."
          />
        </section>

      </div>
    </div>
  );
}
