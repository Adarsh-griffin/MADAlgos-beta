import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import MentorProfileModel from "@/models/MentorProfile";
import MentorModel from "@/models/Mentor";
import { getSessionFromRequestCookies } from "@/lib/auth";
import MentorDashboardClient from "./MentorDashboardClient";
import MentorTopBar from "./MentorTopBar";

export const metadata = {
  title: "Mentor Dashboard | MADAlgos",
  description: "Mentor dashboard for submitting blogs and managing profile.",
};

export default async function MentorPage() {
  const session = await getSessionFromRequestCookies();
  await connectDB();

  const user = session ? await UserModel.findById(session.uid).lean().exec() : null;

  if (!user || user.role !== "MENTOR") {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <MentorTopBar />
        <main className="py-10">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-14">
            <div className="rounded-4xl bg-card/70 border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                Mentor access required
              </h1>
              <p className="text-sm text-muted-foreground">
                This dashboard is only available to approved mentors. If you recently applied, please
                wait for an admin to verify your profile.
              </p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const profile =
    (await MentorProfileModel.findOne({ userId: user._id }).lean().exec()) ??
    ({
      headline: "",
      companies: "",
      location: null,
      description: "",
      skills: [],
      imageUrl: null,
      linkedin: user.linkedinProfileUrl ?? null,
      reviewStatus: "PENDING_REVIEW",
      rejectionReason: null,
    } as any);

  const initialProfile = {
    headline: typeof profile.headline === "string" ? profile.headline : "",
    companies: typeof profile.companies === "string" ? profile.companies : "",
    location: typeof profile.location === "string" ? profile.location : null,
    description: typeof profile.description === "string" ? profile.description : "",
    skills: Array.isArray(profile.skills) ? profile.skills.map(String) : [],
    imageUrl: typeof profile.imageUrl === "string" ? profile.imageUrl : null,
    linkedin: typeof profile.linkedin === "string" ? profile.linkedin : null,
    reviewStatus: typeof profile.reviewStatus === "string" ? profile.reviewStatus : "PENDING_REVIEW",
    rejectionReason: typeof profile.rejectionReason === "string" ? profile.rejectionReason : null,
  };

  const mentorListing = await MentorModel.findOne({ profileId: `user:${String(user._id)}` }).lean().exec();
  const profilePublishedOnSite = Boolean(
    mentorListing &&
      mentorListing.isActive &&
      mentorListing.approvalStatus === "APPROVED"
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <MentorTopBar />
      <main className="py-10">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-14">
          <div className="rounded-4xl bg-card/70 border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] p-6 md:p-8 space-y-6">
            <div>
              <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em]">
                Mentor Panel
              </p>
              <h1 className="mt-4 text-2xl md:text-3xl font-bold text-white tracking-tight">
                Welcome{user.username ? `, ${user.username}` : ""}.
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your profile and any content you submit will go to Admin/Super Admin for review before
                it appears on the main website.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#050505]/70 p-5">
                <h2 className="text-sm font-semibold text-white mb-1">Account status</h2>
                <p className="text-xs text-slate-400">
                  Role: <span className="text-slate-200 font-semibold">{user.role}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Verification:{" "}
                  <span className="text-slate-200 font-semibold">{user.verificationStatus}</span>
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#050505]/70 p-5">
                <h2 className="text-sm font-semibold text-white mb-1">Quick actions</h2>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>- Update your public mentor card and bio.</li>
                  <li>- Submit blogs for admin review.</li>
                </ul>
              </div>
            </div>

            <MentorDashboardClient
              initialUser={{
                email: user.email,
                username: user.username ?? null,
                verificationStatus: user.verificationStatus,
              }}
              initialProfile={initialProfile}
              profilePublishedOnSite={profilePublishedOnSite}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

