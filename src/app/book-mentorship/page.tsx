import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import BookMentorshipClient from "./BookMentorshipClient";

export const metadata = {
  title: "Book mentorship | MADAlgos",
};

export default function BookMentorshipPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Header />
      <main className="pt-28 md:pt-32 pb-24">
        <section className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 md:px-8">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-primary/25" />
            <div className="absolute bottom-12 -left-28 h-64 w-64 rounded-full border-[18px] border-secondary/70 opacity-70" />
            <div
              className="absolute top-1/3 right-[8%] opacity-15"
              style={{
                width: 0,
                height: 0,
                borderLeft: "90px solid transparent",
                borderRight: "90px solid transparent",
                borderBottom: "156px solid #2ab5a0",
              }}
            />
            <div className="absolute top-1/2 -left-10 h-14 w-60 rounded-md bg-primary/20" />
            <div className="absolute top-32 left-1/4 h-16 w-16 rounded-full bg-[#c9973a]/40" />
          </div>

          <div className="text-center">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-[2px] w-9 rounded-full bg-primary" />
              Mentorship
            </span>
            <h1 className="mt-5 text-3xl md:text-4xl lg:text-[2.8rem] font-extrabold leading-tight text-gradient-premium">
              Book mentorship
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
              Three packages (1, 3, or 6 months) in INR. Signed-in students and mentors use the same checkout — pick a
              package, pay with Razorpay, and we&apos;ll confirm by email.
            </p>
          </div>

          <BookMentorshipClient />
        </section>
      </main>
      <Footer />
    </div>
  );
}
