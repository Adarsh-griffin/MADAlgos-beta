import React from "react";
import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import Advantages from "@/components/sections/advantages";
import PastEventsSection from "@/components/sections/past-events";
import Specializations from "@/components/sections/specializations";
import Curriculum from "@/components/sections/curriculum";
import LearningBeyondClassroom from "@/components/sections/learning-beyond";
import AlumniSection from "@/components/sections/alumni";
import FacultySection from "@/components/sections/faculty";
import DifferentiationSection from "@/components/sections/differentiation";
import BlogsSection from "@/components/sections/blogs-section";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import {
  getAllBlogs,
  formatBlogDate,
  getAuthorDisplayName,
  getPlainTextExcerpt,
} from "@/lib/blogs";
import {
  getAllMentors,
  getMentorCompaniesLine,
  getMentorDisplayName,
  getMentorHeadline,
} from "@/lib/mentors";
import { JudgeYourSkillsSection } from "@/components/sections/judge-your-skills";

// Ensure the homepage always renders fresh DB data.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [blogsFromDb, mentorsFromDb] = await Promise.all([
    getAllBlogs(),
    getAllMentors(),
  ]);

  const blogs = blogsFromDb.slice(0, 6).map((b) => ({
    id: b.id,
    title: b.title,
    author: getAuthorDisplayName(b),
    date: formatBlogDate(b.publishDate),
    image: b.bannerImageLink,
    excerpt: getPlainTextExcerpt(b.descriptionDetails, 170),
  }));

  const mentors = mentorsFromDb.slice(0, 10).map((m) => ({
    id: m.id,
    name: getMentorDisplayName(m),
    role: getMentorHeadline(m),
    company: getMentorCompaniesLine(m),
    image: m.interviewer?.dispImageLink ?? null,
    isVerified: m.isVerified,
  }));

  return (
    <div className="flex flex-col bg-background text-foreground antialiased font-sans selection:bg-primary/30">
      <Header />
      <main>
        {/* Section 1: Hero */}
        <Hero />

        {/* Section 2: Best of Both Worlds / Earth */}
        <Advantages />

        {/* Practice tests — hero on home; full catalog on /available-tests */}
        <JudgeYourSkillsSection />

        {/* Section 3: Past events / What we've done */}
        <PastEventsSection />

        {/* Section 4: Enterprise Protocols / Specializations */}
        <Specializations />

        {/* Following Content */}
        <div className="bg-background">
          <div className="space-y-0">
            <Curriculum />
            <LearningBeyondClassroom />
            <AlumniSection />
            <FacultySection mentors={mentors} />
            <DifferentiationSection />
            <BlogsSection blogs={blogs} />
            <Testimonials />
            <FAQ />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
