import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { connectDB } from "@/lib/mongodb";
import PracticeTestModel from "@/models/PracticeTest";
import { resolvePublicDemoLogo } from "@/lib/company-test-branding";
import { Clock, ListChecks, Code2, ArrowLeft, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { PublicDemoStartButton } from "@/components/assessment/PublicDemoStartButton";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();
  const test = await PracticeTestModel.findOne({
    publicSlug: slug.trim().toLowerCase(),
  })
    .select("title")
    .lean<{ title?: string } | null>()
    .exec();
  if (!test?.title) return { title: "Test | MADAlgos" };
  return { title: `${test.title} | MADAlgos` };
}

export default async function AvailableTestDetailPage({ params }: PageProps) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw).trim().toLowerCase();
  await connectDB();
  const test = await PracticeTestModel.findOne({
    publicSlug: slug,
  })
    .select(
      "title duration demoCardSubtitle demoCardImageUrl demoBannerImageUrl demoBrandLogoUrl demoLogoDomain mcqs codingProblems"
    )
    .lean<{
      title: string;
      duration: number;
      demoCardSubtitle?: string;
      demoCardImageUrl?: string;
      demoBannerImageUrl?: string;
      demoBrandLogoUrl?: string;
      demoLogoDomain?: string;
      mcqs: unknown[];
      codingProblems: unknown[];
    } | null>()
    .exec();

  if (!test) notFound();

  const session = await getSessionFromRequestCookies();

  const logoUrl = resolvePublicDemoLogo({
    publicSlug: slug,
    demoBrandLogoUrl: test.demoBrandLogoUrl,
    demoLogoDomain: test.demoLogoDomain,
    demoCardImageUrl: test.demoCardImageUrl,
  });
  const imageUrl =
    test.demoBannerImageUrl?.trim() ||
    test.demoCardImageUrl?.trim() ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&auto=format&fit=crop";
  const mcqCount = Array.isArray(test.mcqs) ? test.mcqs.length : 0;
  const codeCount = Array.isArray(test.codingProblems) ? test.codingProblems.length : 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#010818] text-foreground antialiased">
      <Header />
      <main className="flex-1 pt-24 md:pt-28 pb-20 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/available-tests"
            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All practice tests
          </Link>

          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-primary mb-6">Company assessment</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-2xl border border-white/10 bg-[#0a1224]/90 p-6 md:p-8 mb-10 ring-1 ring-white/[0.04]">
            <div className="relative h-24 w-24 md:h-28 md:w-28 shrink-0 mx-auto sm:mx-0 rounded-2xl bg-[#010818] border border-white/10 flex items-center justify-center">
              <div className="relative h-[4.5rem] w-[4.5rem] md:h-20 md:w-20">
                <Image src={logoUrl} alt="" fill className="object-contain" sizes="96px" priority />
              </div>
            </div>
            <div className="min-w-0 text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-[0.06em] leading-tight [font-feature-settings:'salt'_on]">
                {test.title}
              </h1>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Branded practice pack</p>
            </div>
          </div>

          <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-8 bg-slate-900/50 ring-1 ring-white/10 opacity-90">
            <Image src={imageUrl} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010818] via-transparent to-transparent" />
          </div>

          <p className="flex items-start gap-2.5 text-muted-foreground text-base leading-relaxed mb-8">
            <NotebookPen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span>
              {test.demoCardSubtitle?.trim() ||
                "Hiring-style practice: mixed MCQs and coding, timed session with autosave and code execution."}
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Clock, label: "Duration", value: `${test.duration} minutes` },
              { icon: ListChecks, label: "MCQs", value: String(mcqCount) },
              { icon: Code2, label: "Coding", value: String(codeCount) },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-[#050505]/80 backdrop-blur-sm p-4 flex items-center gap-3"
              >
                <Icon className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                  <p className="font-bold text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 md:p-8 mb-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-3">Before you start</h2>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
              <li>Use a stable connection and stay on the assessment tab during the attempt.</li>
              <li>After signup, confirm your email — check spam folders if needed.</li>
              <li>Admin-invited candidates follow a separate flow; this page is for public practice listings.</li>
            </ul>
          </div>

          {session ? (
            <PublicDemoStartButton slug={slug} />
          ) : (
            <Link
              href={`/auth?next=${encodeURIComponent(`/available-tests/${slug}`)}`}
              className={cn(
                "inline-flex justify-center items-center w-full sm:w-auto rounded-xl py-3.5 px-10",
                "bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-[0.22em]",
                "shadow-[0_14px_48px_rgba(20,184,166,0.28)] hover:brightness-110 transition-all"
              )}
            >
              Sign in or register
            </Link>
          )}
          <p className="mt-6 text-xs text-slate-500 leading-relaxed">
            {session
              ? "You’ll open the same split-screen assessment used for company-style practice. Invites from the dashboard use the same test engine."
              : "After you sign in, use Start test to open the assessment IDE. Team invites from the dashboard use the same flow."}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
