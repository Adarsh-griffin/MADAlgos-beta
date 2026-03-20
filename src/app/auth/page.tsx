"use client";

import React, { FormEvent } from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, ShieldCheck, UserRound, Linkedin, ArrowRight } from "lucide-react";

type AuthMode = "signin" | "signup";

function AuthFormWrapper({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="relative rounded-[2rem] bg-[#111111]/95 px-6 pt-8 pb-7 shadow-[0_30px_90px_rgba(0,0,0,0.7)] border border-white/5">
      <div className="pointer-events-none absolute left-6 right-6 top-3 h-8 rounded-[1.5rem] bg-gradient-to-r from-[#2ab5a0] via-[#27c2ae] to-[#0ea5e9] opacity-70 blur-[10px]" />
      <div className="relative space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
        <p className="text-xs md:text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="relative mt-6 space-y-5">{children}</div>
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center gap-2 rounded-full border-white/15 bg-transparent text-xs md:text-sm font-medium text-slate-100 hover:bg-white/5"
    >
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          fill="#EA4335"
          d="M12 10.2v3.8h5.3c-.2 1.2-.9 2.3-2 3.1l3.2 2.5C20.6 18.2 22 15.4 22 12c0-.7-.1-1.4-.2-2H12z"
        />
        <path
          fill="#34A853"
          d="M6.5 14.3l-.8.6-2.6 2C4.3 19.9 7 21.5 10 21.5c2.4 0 4.4-.8 5.9-2.4l-3.2-2.5c-.8.5-1.8.8-2.7.8-2.1 0-3.9-1.4-4.5-3.3z"
        />
        <path
          fill="#4A90E2"
          d="M3.1 6.9C2.4 8.2 2 9.6 2 11s.4 2.8 1.1 4.1l3.4-2.7C6.2 11.6 6.1 11.3 6.1 11c0-.3.1-.6.3-.9L3.1 6.9z"
        />
        <path
          fill="#FBBC05"
          d="M10 4.5c1.3 0 2.5.4 3.4 1.3l2.5-2.5C14.4 1.8 12.4 1 10 1 7 1 4.3 2.6 3.1 4.9l3.4 2.7C7 5.9 8.8 4.5 10 4.5z"
        />
        <path fill="none" d="M2 2h20v20H2z" />
      </svg>
      <span>{label}</span>
    </Button>
  );
}

function EmailField() {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Email
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="h-10 pl-9 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500 focus:border-[#2ab5a0] focus:ring-2 focus:ring-[#2ab5a0]/60"
        />
      </div>
    </div>
  );
}

function PasswordField({ label = "Password", name = "password" }: { label?: string; name?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          name={name}
          type="password"
          required
          placeholder="Enter password"
          className="h-10 pl-9 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500 focus:border-[#2ab5a0] focus:ring-2 focus:ring-[#2ab5a0]/60"
        />
      </div>
    </div>
  );
}

function UsernameField() {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Username
      </label>
      <div className="relative">
        <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          name="username"
          required
          placeholder="Preferred username"
          className="h-10 pl-9 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500 focus:border-[#2ab5a0] focus:ring-2 focus:ring-[#2ab5a0]/60"
        />
      </div>
    </div>
  );
}

function LinkedinField() {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        LinkedIn Profile
      </label>
      <div className="relative">
        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-500" />
        <Input
          name="linkedin"
          type="url"
          required
          placeholder="https://www.linkedin.com/in/username"
          className="h-10 pl-9 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500 focus:border-[#2ab5a0] focus:ring-2 focus:ring-[#2ab5a0]/60"
        />
      </div>
    </div>
  );
}

async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; role?: string; error?: string }
    | null;
  if (!res.ok) throw new Error(data?.error || "Login failed");
  return data;
}

async function applyMentor(email: string, username: string, linkedinProfileUrl: string) {
  const res = await fetch("/api/auth/mentor/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, linkedinProfileUrl }),
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok) throw new Error(data?.error || "Application failed");
  return data;
}

async function checkMentorEmail(email: string) {
  const res = await fetch("/api/auth/mentor/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = (await res.json().catch(() => null)) as
    | { status?: string; reason?: string; error?: string }
    | null;
  if (!res.ok) throw new Error(data?.error || "Check failed");
  return data;
}

async function setMentorPasswordLogin(email: string, password: string) {
  const res = await fetch("/api/auth/mentor/set-password-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; role?: string; error?: string }
    | null;
  if (!res.ok) throw new Error(data?.error || "Set password failed");
  return data;
}

export default function AuthPage() {
  const [mode, setMode] = React.useState<AuthMode>("signin");
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [mentorStep, setMentorStep] = React.useState<"email" | "set_password" | "password">("email");
  const [mentorEmail, setMentorEmail] = React.useState<string>("");
  const [mentorPassword1, setMentorPassword1] = React.useState<string>("");
  const [mentorPassword2, setMentorPassword2] = React.useState<string>("");

  const goGoogle = (role: "student" | "mentor") => {
    window.location.href = `/api/auth/google/start?role=${encodeURIComponent(role)}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <Header />
      <main className="pt-28 md:pt-32 pb-20 px-4 md:px-6">
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-[2px] w-9 rounded-full bg-primary" />
              Access MADAlgos
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight text-gradient-premium">
              Sign in or apply as a mentor.
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xs md:text-sm text-muted-foreground leading-relaxed">
              Use the same modern experience as the main site. Students and mentors can use email
              or continue with Google. Admin and Super Admin use secure email sign in.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.35fr_minmax(0,1fr)] items-start">
            {/* Left: Student / Mentor auth */}
            <div className="relative">
              <Tabs
                value={mode}
                onValueChange={(v) => setMode(v as AuthMode)}
                className="w-full"
              >
                <TabsList className="mb-5 grid w-full grid-cols-2 rounded-full bg-[#050505]/60 border border-white/10">
                  <TabsTrigger
                    value="signin"
                    className="data-[state=active]:bg-primary data-[state=active]:text-slate-950 rounded-full text-xs md:text-sm"
                  >
                    Sign in
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-primary data-[state=active]:text-slate-950 rounded-full text-xs md:text-sm"
                  >
                    Join us
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-0">
                  <AuthFormWrapper
                    title="Sign in"
                    subtitle="Continue as a student or mentor. Use your email credentials or sign in with Google."
                  >
                    <Tabs defaultValue="student" className="w-full">
                      <TabsList className="mb-4 grid w-full grid-cols-2 rounded-full bg-black/40 border border-white/10">
                        <TabsTrigger
                          value="student"
                          className="data-[state=active]:bg-primary data-[state=active]:text-slate-950 rounded-full text-[11px]"
                        >
                          Student
                        </TabsTrigger>
                        <TabsTrigger
                          value="mentor"
                          className="data-[state=active]:bg-primary data-[state=active]:text-slate-950 rounded-full text-[11px]"
                        >
                          Mentor
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="student" className="mt-0 space-y-4">
                        <div onClick={() => goGoogle("student")} className="cursor-pointer">
                          <GoogleButton label="Continue with Google (Student)" />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          <span className="h-px flex-1 bg-white/10" />
                          Or use email
                          <span className="h-px flex-1 bg-white/10" />
                        </div>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            setBusy(true);
                            setError(null);
                            setMessage(null);
                            const form = e.currentTarget;
                            const fd = new FormData(form);
                            try {
                              await login(String(fd.get("email") ?? ""), String(fd.get("password") ?? ""));
                              window.location.href = "/";
                            } catch (err) {
                              setError(err instanceof Error ? err.message : "Login failed");
                            } finally {
                              setBusy(false);
                            }
                          }}
                          className="space-y-4"
                        >
                          <EmailField />
                          <PasswordField />
                          <Button
                            type="submit"
                            disabled={busy}
                            className="mt-1 w-full justify-center rounded-full bg-linear-to-r from-[#2ab5a0] to-[#136b60] text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_36px_rgba(42,181,160,0.55)] hover:brightness-110 active:scale-95 disabled:opacity-60"
                          >
                            Sign in as student
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="mentor" className="mt-0 space-y-4">
                        <div onClick={() => goGoogle("mentor")} className="cursor-pointer">
                          <GoogleButton label="Continue with Google (Mentor)" />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          <span className="h-px flex-1 bg-white/10" />
                          Or use email
                          <span className="h-px flex-1 bg-white/10" />
                        </div>
                        {mentorStep === "email" && (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              setBusy(true);
                              setError(null);
                              setMessage(null);
                              const form = e.currentTarget;
                              const fd = new FormData(form);
                              const email = String(fd.get("email") ?? "").trim();
                              try {
                                const result = await checkMentorEmail(email);
                                setMentorEmail(email);
                                if (result.status === "not_found") {
                                  setError("No mentor account found for this email.");
                                } else if (result.status === "pending_approval") {
                                  setMessage("Your mentor application is still under review.");
                                } else if (result.status === "needs_password") {
                                  setMentorStep("set_password");
                                } else if (result.status === "has_password") {
                                  setMentorStep("password");
                                } else if (result.status === "blocked") {
                                  setError("Your mentor account is not active. Please contact support.");
                                }
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Check failed");
                              } finally {
                                setBusy(false);
                              }
                            }}
                            className="space-y-4"
                          >
                            <EmailField />
                            <p className="text-[11px] text-slate-400">
                              Enter your registered mentor email. We will then ask you to set a new password
                              (if you are logging in for the first time) or enter your existing password.
                            </p>
                            <Button
                              type="submit"
                              disabled={busy}
                              className="mt-1 w-full justify-center rounded-full bg-linear-to-r from-[#2ab5a0] to-[#136b60] text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_36px_rgba(42,181,160,0.55)] hover:brightness-110 active:scale-95 disabled:opacity-60"
                            >
                              Continue
                            </Button>
                          </form>
                        )}

                        {mentorStep === "set_password" && (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              setBusy(true);
                              setError(null);
                              setMessage(null);
                              if (!mentorPassword1 || mentorPassword1 !== mentorPassword2) {
                                setError("Passwords do not match.");
                                setBusy(false);
                                return;
                              }
                              try {
                                const data = await setMentorPasswordLogin(mentorEmail, mentorPassword1);
                                const role = data?.role;
                                window.location.href = role === "MENTOR" ? "/mentor" : "/";
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Set password failed");
                              } finally {
                                setBusy(false);
                              }
                            }}
                            className="space-y-4"
                          >
                            <p className="text-[11px] text-slate-400">
                              Mentor email: <span className="font-semibold text-slate-100">{mentorEmail}</span>
                            </p>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                New password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  type="password"
                                  required
                                  minLength={6}
                                  value={mentorPassword1}
                                  onChange={(e) => setMentorPassword1(e.target.value)}
                                  placeholder="Enter new password"
                                  className="h-10 pl-9 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500 focus:border-[#2ab5a0] focus:ring-2 focus:ring-[#2ab5a0]/60"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Confirm password
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  type="password"
                                  required
                                  minLength={6}
                                  value={mentorPassword2}
                                  onChange={(e) => setMentorPassword2(e.target.value)}
                                  placeholder="Confirm new password"
                                  className="h-10 pl-9 rounded-full border-white/10 bg-[#1c1c1c] text-sm text-white placeholder:text-slate-500 focus:border-[#2ab5a0] focus:ring-2 focus:ring-[#2ab5a0]/60"
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                              <button
                                type="button"
                                className="underline decoration-dotted"
                                onClick={() => {
                                  setMentorStep("email");
                                  setMentorPassword1("");
                                  setMentorPassword2("");
                                }}
                              >
                                Use a different email
                              </button>
                            </div>
                            <Button
                              type="submit"
                              disabled={busy}
                              className="mt-1 w-full justify-center rounded-full bg-linear-to-r from-[#2ab5a0] to-[#136b60] text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_36px_rgba(42,181,160,0.55)] hover:brightness-110 active:scale-95 disabled:opacity-60"
                            >
                              Set password & continue
                            </Button>
                          </form>
                        )}

                        {mentorStep === "password" && (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              setBusy(true);
                              setError(null);
                              setMessage(null);
                              const form = e.currentTarget;
                              const fd = new FormData(form);
                              const password = String(fd.get("password") ?? "");
                              try {
                                const data = await login(mentorEmail, password);
                                const role = data?.role;
                                window.location.href = role === "MENTOR" ? "/mentor" : "/";
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Login failed");
                              } finally {
                                setBusy(false);
                              }
                            }}
                            className="space-y-4"
                          >
                            <p className="text-[11px] text-slate-400">
                              Mentor email: <span className="font-semibold text-slate-100">{mentorEmail}</span>
                            </p>
                            <PasswordField />
                            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                              <button
                                type="button"
                                className="underline decoration-dotted"
                                onClick={() => {
                                  setMentorStep("email");
                                  setMentorEmail("");
                                }}
                              >
                                Back to email
                              </button>
                            </div>
                            <Button
                              type="submit"
                              disabled={busy}
                              className="mt-1 w-full justify-center rounded-full bg-linear-to-r from-[#2ab5a0] to-[#136b60] text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_36px_rgba(42,181,160,0.55)] hover:brightness-110 active:scale-95 disabled:opacity-60"
                            >
                              Sign in as mentor
                            </Button>
                          </form>
                        )}

                    <p className="text-[11px] text-slate-400">
                          New mentor?{" "}
                          <span className="font-semibold text-primary">
                            Use the Join us tab to apply.
                          </span>
                        </p>
                      </TabsContent>
                    </Tabs>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    {message && <p className="text-sm text-emerald-300">{message}</p>}
                  </AuthFormWrapper>
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <AuthFormWrapper
                    title="Join us"
                    subtitle="Students get instant access. Mentors submit basic details for verification before setting a password."
                  >
                    <Tabs defaultValue="student-signup" className="w-full">
                      <TabsList className="mb-4 grid w-full grid-cols-2 rounded-full bg-black/40 border border-white/10">
                        <TabsTrigger
                          value="student-signup"
                          className="data-[state=active]:bg-primary data-[state=active]:text-slate-950 rounded-full text-[11px]"
                        >
                          Student
                        </TabsTrigger>
                        <TabsTrigger
                          value="mentor-signup"
                          className="data-[state=active]:bg-primary data-[state=active]:text-slate-950 rounded-full text-[11px]"
                        >
                          Mentor
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="student-signup" className="mt-0 space-y-4">
                        <div onClick={() => goGoogle("student")} className="cursor-pointer">
                          <GoogleButton label="Continue with Google (Student)" />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          <span className="h-px flex-1 bg-white/10" />
                          Or use email
                          <span className="h-px flex-1 bg-white/10" />
                        </div>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            setError(null);
                            setMessage("Student signup via email/password is not enabled yet. Use Google for now.");
                          }}
                          className="space-y-4"
                        >
                          <UsernameField />
                          <EmailField />
                          <PasswordField />
                          <Button
                            type="submit"
                            className="mt-1 w-full justify-center rounded-full bg-linear-to-r from-[#2ab5a0] to-[#136b60] text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_36px_rgba(42,181,160,0.55)] hover:brightness-110 active:scale-95"
                          >
                            Create student account
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="mentor-signup" className="mt-0 space-y-4">
                        <div onClick={() => goGoogle("mentor")} className="cursor-pointer">
                          <GoogleButton label="Continue with Google (Mentor application)" />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                          <span className="h-px flex-1 bg-white/10" />
                          Or share details
                          <span className="h-px flex-1 bg-white/10" />
                        </div>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            setBusy(true);
                            setError(null);
                            setMessage(null);
                            const form = e.currentTarget;
                            const fd = new FormData(form);
                            try {
                              await applyMentor(
                                String(fd.get("email") ?? ""),
                                String(fd.get("username") ?? ""),
                                String(fd.get("linkedin") ?? "")
                              );
                              setMessage("Application submitted. Please wait for verification.");
                              form.reset();
                            } catch (err) {
                              setError(err instanceof Error ? err.message : "Application failed");
                            } finally {
                              setBusy(false);
                            }
                          }}
                          className="space-y-4"
                        >
                          <UsernameField />
                          <EmailField />
                          <LinkedinField />
                          <p className="text-[11px] text-slate-400">
                            After admin or super admin verifies your LinkedIn profile, you&apos;ll
                            receive a secure link to set your password and complete your profile.
                          </p>
                          <Button
                            type="submit"
                            disabled={busy}
                            className="mt-1 w-full justify-center rounded-full bg-linear-to-r from-[#2ab5a0] to-[#136b60] text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_36px_rgba(42,181,160,0.55)] hover:brightness-110 active:scale-95 disabled:opacity-60"
                          >
                            Submit mentor application
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    {message && <p className="text-sm text-emerald-300">{message}</p>}
                  </AuthFormWrapper>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: Admin / Super Admin sign in summary */}
            <div className="space-y-4">
              <div className="rounded-[1.75rem] bg-card/70 border border-white/10 px-5 py-6 text-card-foreground shadow-[0_24px_60px_rgba(0,0,0,0.8)] backdrop-blur">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary mb-4">
                  <ShieldCheck className="h-3 w-3" />
                  Admin access
                </div>
                <h2 className="text-lg font-semibold mb-1">Admin / Super Admin sign in</h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Restricted console for content and mentor management. Only credentials created by
                  Super Admin can access this panel.
                </p>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setBusy(true);
                    setError(null);
                    setMessage(null);
                    const form = e.currentTarget;
                    const fd = new FormData(form);
                    try {
                      const data = await login(String(fd.get("email") ?? ""), String(fd.get("password") ?? ""));
                      window.location.href = data?.role === "SUPER_ADMIN" || data?.role === "ADMIN" ? "/admin" : "/";
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Login failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <EmailField />
                  <PasswordField />
                  <Button
                    type="submit"
                    disabled={busy}
                    className="w-full justify-center rounded-full bg-white text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-950 hover:bg-slate-100"
                  >
                    Sign in to admin panel
                  </Button>
                </form>
                {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
                {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}

                <p className="mt-3 text-[11px] text-slate-500 flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Super Admin credentials are bootstrapped from environment variables.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#050505]/80 px-4 py-4 text-xs text-slate-400 flex items-start gap-3">
                <ArrowRight className="mt-[2px] h-3.5 w-3.5 text-primary" />
                <p>
                  You can link Google accounts for mentors and students later inside your auth
                  backend. This page focuses on a clean UX that matches the main MADAlgos site.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

