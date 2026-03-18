import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import MentorsGrid from "@/components/mentors/MentorsGrid";
import type { MentorCardProps } from "@/components/mentors/MentorCard";
import {
  formatMentorJoinedDate,
  getAllMentors,
  getMentorCompaniesLine,
  getMentorDisplayName,
  getMentorHeadline,
  getMentorRating,
} from "@/lib/mentors";

export const metadata = {
  title: "Mentors | MADAlgos",
  description:
    "Meet MADAlgos mentors. Book mentorship, problem solving sessions, and mock interviews with verified engineers.",
};

// Ensure the mentors page always renders fresh DB data.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MentorsPage() {
  const mentors = await getAllMentors();
  const mentorCards: MentorCardProps[] = mentors.map((mentor) => {
    const name = getMentorDisplayName(mentor);
    const headline = getMentorHeadline(mentor);
    const companies = getMentorCompaniesLine(mentor);
    const joined = formatMentorJoinedDate(mentor.joiningDate);
    const rating = getMentorRating(mentor);

    return {
      name,
      headline,
      companies,
      location: mentor.location,
      joined,
      ratingAvg: rating.avg,
      ratingCount: rating.count,
      description:
        mentor.description ??
        "Mentorship focused on interview prep, system design, and practical engineering skills.",
      skills: mentor.skills ?? [],
      isVerified: mentor.isVerified,
      image: mentor.interviewer?.dispImageLink ?? null,
      linkedin: mentor.linkedin,
    };
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased font-sans selection:bg-primary/30">
      <Header />
      <main className="pt-28 md:pt-32 pb-20 px-4 md:px-6">
        <section className="max-w-6xl mx-auto">
          <header className="text-center mb-12 md:mb-16">
            <p className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
              <span>Our Mentors</span>
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Learn from working engineers.
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Verified mentors from top companies. Book mentorship, mock
              interviews, and problem-solving sessions tailored to your goals.
            </p>
          </header>

          <MentorsGrid mentors={mentorCards} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

