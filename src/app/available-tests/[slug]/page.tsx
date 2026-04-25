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
    $or: [{ showOnHomepage: true }, { showOnHomepage: { $exists: false } }],
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
    $or: [{ showOnHomepage: true }, { showOnHomepage: { $exists: false } }],
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
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 70% 45% at 50% -8%, rgba(45,212,191,0.18), transparent 55%), radial-gradient(ellipse 45% 35% at 100% 100%, rgba(99,102,241,0.12), transparent 45%)",
          }}
        />

        <div className="max-w-[90rem] mx-auto">
          <Link
            href="/available-tests"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-3.5 py-2 text-[11px] font-semibold tracking-[0.08em] text-slate-200 hover:border-primary/45 hover:bg-primary/[0.08] hover:text-white mb-8 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            All practice tests
          </Link>

          <div className="max-w-3xl mx-auto">
            <div className="mb-6 text-center">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-primary/90 mb-3">Judge your skills</p>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-primary mb-2">Company assessment</p>
            </div>
          </div>

          <div className="group relative overflow-hidden max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-6 rounded-[1.8rem] border border-white/10 bg-[#0a1224]/90 p-6 md:p-8 mb-10 ring-1 ring-white/[0.04] shadow-[0_35px_90px_rgba(0,0,0,0.45)] transition-all duration-500 hover:border-primary/35 hover:shadow-[0_35px_100px_rgba(20,184,166,0.12)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-indigo-400/15 blur-3xl animate-pulse" />
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute left-[35%] top-0 h-16 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
            </div>
            <div className="relative h-24 w-24 md:h-28 md:w-28 shrink-0 mx-auto sm:mx-0 rounded-2xl bg-[#010818] border border-white/10 flex items-center justify-center">
              <div className="relative h-[4.5rem] w-[4.5rem] md:h-20 md:w-20">
                <Image src={logoUrl} alt="" fill className="object-contain" sizes="96px" priority />
              </div>
            </div>
            <div className="min-w-0 text-center sm:text-left relative">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-[0.06em] leading-tight [font-feature-settings:'salt'_on] transition-all duration-500 group-hover:[text-shadow:0_0_26px_rgba(34,211,238,0.25)]">
                {test.title}
              </h1>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">Branded practice pack</p>
            </div>
          </div>

          <div className="group relative max-w-3xl mx-auto h-44 md:h-48 w-full rounded-[1.4rem] overflow-hidden mb-8 bg-slate-900/50 ring-1 ring-white/10 opacity-95 shadow-[0_20px_55px_rgba(0,0,0,0.4)]">
            <Image src={imageUrl} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#010818] via-[#010818]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-300/10 to-fuchsia-300/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          <p className="group max-w-3xl mx-auto flex items-start gap-2.5 text-muted-foreground text-base leading-relaxed mb-6 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-4 transition-all duration-300 hover:border-primary/35 hover:bg-primary/[0.03]">
            <NotebookPen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span>
              {test.demoCardSubtitle?.trim() ||
                "Hiring-style practice: mixed MCQs and coding, timed session with autosave and code execution."}
            </span>
          </p>

          <div className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {["Timed session", "Autosave enabled", "Real assessment UI"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/15 bg-white/[0.02] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Clock, label: "Duration", value: `${test.duration} minutes` },
              { icon: ListChecks, label: "MCQs", value: String(mcqCount) },
              { icon: Code2, label: "Coding", value: String(codeCount) },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="group rounded-2xl border border-white/10 bg-[#050505]/80 backdrop-blur-sm p-4 flex items-center gap-3 transition-all duration-300 hover:border-primary/45 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(20,184,166,0.16)]"
              >
                <Icon className="h-8 w-8 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                  <p className="font-bold text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="group max-w-3xl mx-auto rounded-[1.4rem] border border-primary/25 bg-linear-to-b from-primary/[0.08] to-transparent p-6 md:p-8 mb-8 shadow-[0_20px_45px_rgba(20,184,166,0.08)] transition-all duration-300 hover:border-primary/40">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-3">Before you start</h2>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
              <li>Use a stable connection and stay on the assessment tab during the attempt.</li>
              <li>After signup, confirm your email — check spam folders if needed.</li>
              <li>Admin-invited candidates follow a separate flow; this page is for public practice listings.</li>
            </ul>
          </div>

          <div className="relative max-w-3xl mx-auto rounded-[1.3rem] border border-white/10 bg-[#050b18]/80 p-5 md:p-6 shadow-[0_22px_45px_rgba(0,0,0,0.35)] overflow-hidden">
            <div className="pointer-events-none absolute -right-14 -top-14 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-16 w-16 rounded-full bg-fuchsia-400/10 blur-2xl" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">Launch assessment</p>
            <div className="relative">
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
            </div>
          </div>
          <p className="max-w-3xl mx-auto mt-6 text-xs text-slate-500 leading-relaxed">
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
