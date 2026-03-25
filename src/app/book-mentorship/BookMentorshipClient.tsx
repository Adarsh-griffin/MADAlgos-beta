"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { getRazorpayKeyIdForClient } from "@/lib/razorpay-public-key";

type MentRow = {
  id: number;
  durationMonths: number;
  ifSolo: boolean;
  groupSizes: number;
  price: number;
  currency: string;
  personalSessions: number;
  mockInterviews: number;
  expLabel: string;
};

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

const contactField =
  "h-11 w-full rounded-full border border-white/10 bg-[#1c1c1c] px-4 text-sm text-white placeholder:text-slate-500 focus:border-[#2ab5a0] focus:outline-none focus:ring-2 focus:ring-[#2ab5a0]/60 transition";
const contactLabel = "text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500";

export default function BookMentorshipClient() {
  const router = useRouter();
  const [rows, setRows] = React.useState<MentRow[]>([]);
  const [meEmail, setMeEmail] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [mid, setMid] = React.useState<number | "">("");
  const [country, setCountry] = React.useState("IND");
  const [terms, setTerms] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [phase, setPhase] = React.useState<"checkout" | "post_pay_setup" | "complete">("checkout");
  const [setupToken, setSetupToken] = React.useState<string | null>(null);
  const [guestEmail, setGuestEmail] = React.useState<string | null>(null);
  const [setupPassword, setSetupPassword] = React.useState("");
  const [setupPassword2, setSetupPassword2] = React.useState("");
  const [setupBusy, setSetupBusy] = React.useState(false);
  const [setupErr, setSetupErr] = React.useState<string | null>(null);
  const [emailWarning, setEmailWarning] = React.useState<string | null>(null);
  const [emailCheckPending, setEmailCheckPending] = React.useState(false);
  const [accountCreatedDialogOpen, setAccountCreatedDialogOpen] = React.useState(false);

  React.useEffect(() => {
    let c = true;
    (async () => {
      const [catRes, meRes] = await Promise.all([fetch("/api/booking/catalog"), fetch("/api/auth/me")]);
      const cat = (await catRes.json()) as { mentorshipOfferings: MentRow[] };
      const me = (await meRes.json()) as { user: { email?: string } | null };
      if (!c) return;
      setRows(cat.mentorshipOfferings ?? []);
      const em = me.user?.email?.trim();
      if (em) {
        setMeEmail(em);
        setEmail(em);
      }
    })();
    return () => {
      c = false;
    };
  }, []);

  React.useEffect(() => {
    if (phase !== "checkout") return;
    const e = email.trim();
    if (!e) {
      setEmailWarning(null);
      setEmailCheckPending(false);
      return;
    }
    const t = window.setTimeout(() => {
      void (async () => {
        setEmailCheckPending(true);
        try {
          const res = await fetch(`/api/auth/check-checkout-email?email=${encodeURIComponent(e)}`);
          const j = (await res.json()) as { canCheckout?: boolean; message?: string };
          if (!res.ok || j.canCheckout !== true) {
            setEmailWarning(j.message ?? "Sign in to continue with this email.");
          } else {
            setEmailWarning(null);
          }
        } catch {
          setEmailWarning(null);
        } finally {
          setEmailCheckPending(false);
        }
      })();
    }, 450);
    return () => window.clearTimeout(t);
  }, [email, phase]);

  const offering = rows.find((r) => r.id === mid);

  async function submitGuestPassword() {
    setSetupErr(null);
    if (!setupToken) {
      setSetupErr("Invalid session. Refresh the page.");
      return;
    }
    if (setupPassword.length < 6) {
      setSetupErr("Password must be at least 6 characters.");
      return;
    }
    if (setupPassword !== setupPassword2) {
      setSetupErr("Passwords do not match.");
      return;
    }
    setSetupBusy(true);
    try {
      const res = await fetch("/api/auth/guest/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupToken, password: setupPassword }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; email?: string };
      if (!res.ok) {
        setSetupErr(data.error || "Could not set password.");
        return;
      }
      if (data.email) {
        setGuestEmail(data.email.trim().toLowerCase());
      }
      setPhase("complete");
      setAccountCreatedDialogOpen(true);
      setSetupPassword("");
      setSetupPassword2("");
      router.refresh();
    } catch {
      setSetupErr("Could not set password.");
    } finally {
      setSetupBusy(false);
    }
  }

  async function loadRzp(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }

  async function pay() {
    setErr(null);
    if (!terms) {
      setErr("Accept terms to continue.");
      return;
    }
    if (!email.trim() || !offering) {
      setErr("Email and package required.");
      return;
    }
    if (!phone.trim() || !/^\d{10}$/.test(phone.trim())) {
      setErr("Valid 10-digit phone required.");
      return;
    }

    const gateRes = await fetch(`/api/auth/check-checkout-email?email=${encodeURIComponent(email.trim())}`);
    const gateJson = (await gateRes.json()) as { canCheckout?: boolean; message?: string };
    if (!gateRes.ok || gateJson.canCheckout !== true) {
      setErr(gateJson.message ?? "Sign in to continue with this email.");
      return;
    }

    setBusy(true);
    try {
      const meRes = await fetch("/api/auth/me");
      const meJson = (await meRes.json()) as { user?: { id?: string } | null };
      const sessionUserId = meJson.user?.id;

      const orderRes = await fetch("/api/payments/orders?product=mentorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: offering.id,
          quantity: 1,
          price: offering.price,
          orderType: "Normal Ordering",
          currency: offering.currency,
        }),
      });
      if (!orderRes.ok) {
        const j = (await orderRes.json().catch(() => ({}))) as { error?: string };
        setErr(j.error || "Order failed");
        setBusy(false);
        return;
      }
      const order = (await orderRes.json()) as {
        amount: number;
        id: string;
        currency: string;
      };

      const key = await getRazorpayKeyIdForClient();
      if (!key) {
        setErr("Razorpay key id missing. Set RAZORPAY_KEY_ID (and secret) on the server.");
        setBusy(false);
        return;
      }

      if (!(await loadRzp()) || !window.Razorpay) {
        setErr("Razorpay failed to load.");
        setBusy(false);
        return;
      }

      const rzp = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: "MADAlgos Mentorship",
        order_id: order.id,
        prefill: { email: email.trim(), contact: phone.trim() },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const v = await fetch("/api/payments/new-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderCreationId: order.id,
                paymentFor: "mentorship",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                userEmail: email.trim(),
                sessionUserId,
              }),
            });
            if (!v.ok) {
              const j = (await v.json().catch(() => ({}))) as { error?: string; msg?: string };
              setErr(j.error || j.msg || "Verify failed");
              setBusy(false);
              return;
            }
            const book = await fetch("/api/book-mentorship", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userEmail: email.trim(),
                userPhone: phone.trim(),
                mentorshipId: offering.id,
                orderId: order.id,
                paymentId: response.razorpay_payment_id,
                bookingCountry: country,
                isTermsChecked: true,
                couponCode: null,
                OfferPrice: null,
                mentorId: null,
              }),
            });
            const bookJson = (await book.json().catch(() => ({}))) as { error?: string; setupToken?: string };
            if (!book.ok) {
              setErr(bookJson.error || "Booking failed after payment.");
              setBusy(false);
              return;
            }
            setBusy(false);
            if (bookJson.setupToken) {
              setGuestEmail(email.trim().toLowerCase());
              setSetupToken(bookJson.setupToken);
              setPhase("post_pay_setup");
              return;
            }
            router.push(
              `/payments/success?payID=${encodeURIComponent(response.razorpay_payment_id)}&orderID=${encodeURIComponent(order.id)}`
            );
          } catch {
            setErr("Booking error.");
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch {
      setErr("Could not start payment.");
      setBusy(false);
    }
  }

  if (!rows.length) {
    return (
      <p className="text-sm text-amber-400">
        No mentorship packages. Run <code className="text-xs bg-white/10 px-1 rounded">npm run seed:booking</code> with{" "}
        <code className="text-xs bg-white/10 px-1 rounded">MONGODB_URI</code>.
      </p>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="relative grid gap-0 overflow-hidden rounded-[2.75rem] bg-card text-card-foreground shadow-[0_40px_120px_rgba(0,0,0,0.75)] lg:grid-cols-2">
        <div className="pointer-events-none absolute inset-y-8 -left-10 w-10 rounded-[999px] bg-card shadow-[24px_0_40px_rgba(15,23,42,0.32)]" />
        <div className="pointer-events-none absolute inset-y-8 -right-10 w-10 rounded-[999px] bg-card shadow-[-24px_0_40px_rgba(15,23,42,0.32)]" />

        <div className="relative border-b border-border px-8 py-10 md:px-10 lg:border-b-0 lg:border-r">
          <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-[2px] w-9 rounded-full bg-primary" />
            Student account
          </p>
          {phase === "checkout" ? (
            <>
              <h2 className="mb-4 text-2xl font-semibold text-card-foreground md:text-3xl">Sign in or continue as guest</h2>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth" className="font-semibold text-primary underline hover:text-primary/90">
                  Sign in
                </Link>
                . Need an account first?{" "}
                <Link href="/auth" className="font-semibold text-primary underline hover:text-primary/90">
                  Create one
                </Link>{" "}
                or use Google. To pay as a guest, complete the form on the right — after payment you can set a password for the same email.
              </p>
              <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-full border-white/20 text-card-foreground hover:bg-white/5"
                  onClick={() => {
                    window.location.href = "/api/auth/google/start?role=student";
                  }}
                >
                  Continue with Google (student)
                </Button>
              </div>
              {meEmail ? (
                <p className="mt-4 text-xs text-muted-foreground">Signed in as {meEmail}</p>
              ) : (
                <p className="mt-4 text-xs text-muted-foreground">Guest checkout: use the email you pay with.</p>
              )}
            </>
          ) : phase === "post_pay_setup" ? (
            <>
              <h2 className="mb-4 text-2xl font-semibold text-card-foreground md:text-3xl">Set your password</h2>
              <p className="mb-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                Payment received for{" "}
                <strong className="text-card-foreground">{guestEmail}</strong>. Choose a password to finish setting up your student account.
              </p>
              <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4">
                <input
                  type="password"
                  placeholder="New password (min 6)"
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  className={contactField}
                  autoComplete="new-password"
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={setupPassword2}
                  onChange={(e) => setSetupPassword2(e.target.value)}
                  className={contactField}
                  autoComplete="new-password"
                />
                {setupErr ? <p className="text-xs text-red-400">{setupErr}</p> : null}
                <Button
                  type="button"
                  variant="secondary"
                  disabled={setupBusy}
                  className="w-full rounded-full font-semibold"
                  onClick={() => void submitGuestPassword()}
                >
                  {setupBusy ? "Saving…" : "Save password"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-2xl font-semibold text-card-foreground md:text-3xl">Purchase successful</h2>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground">
                Your mentorship purchase is confirmed. Our team will contact you to assign your mentor and schedule sessions. A confirmation email has been sent to{" "}
                <strong className="text-card-foreground">{guestEmail}</strong>.
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/">Back to home</Link>
              </Button>
            </>
          )}
        </div>

        <div className="relative px-8 py-10 md:px-10">
          <div className="pointer-events-none absolute left-8 right-8 top-4 h-10 rounded-[1.5rem] bg-gradient-to-r from-[#2ab5a0] via-[#27c2ae] to-[#0ea5e9] opacity-80 blur-[10px]" />
          <div
            className={`relative rounded-[2rem] bg-[#111111]/96 px-6 pb-7 pt-10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] ${
              phase !== "checkout" ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <h3 className="mb-2 text-lg font-semibold text-white">Mentorship booking</h3>
            <p className="mb-6 text-xs text-slate-400 md:text-sm">
              Choose a package. Your mentor will be assigned by the MADAlgos team after purchase — same email as your student account.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className={contactLabel}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErr(null);
                    }}
                    className={`${contactField} ${emailWarning ? "border-amber-500/60" : ""}`}
                    aria-invalid={emailWarning ? true : undefined}
                  />
                  {emailCheckPending ? <p className="text-xs text-slate-500">Checking email…</p> : null}
                  {emailWarning ? (
                    <p className="text-xs text-amber-400">
                      {emailWarning}{" "}
                      <Link href="/auth" className="font-semibold text-primary underline">
                        Sign in
                      </Link>{" "}
                      or use another email.
                    </p>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <label className={contactLabel}>Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={contactField}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={contactLabel}>Package</label>
                <select
                  className={`${contactField} appearance-none bg-[#1c1c1c]`}
                  value={mid === "" ? "" : String(mid)}
                  onChange={(e) => setMid(e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">Select…</option>
                  {rows.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.durationMonths} mo · {r.personalSessions} sessions · {r.currency} {r.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 md:max-w-xs">
                <label className={contactLabel}>Region</label>
                <select
                  className={`${contactField} appearance-none bg-[#1c1c1c]`}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="IND">IND</option>
                  <option value="USA">USA</option>
                  <option value="GBR">GBR</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="mt" checked={terms} onCheckedChange={(v) => setTerms(v === true)} />
                <label htmlFor="mt" className="text-sm text-slate-400">
                  I agree to mentorship terms.
                </label>
              </div>
              {err ? <p className="text-sm text-red-400">{err}</p> : null}
              <button
                type="button"
                disabled={busy || phase !== "checkout" || !!emailWarning || emailCheckPending}
                onClick={() => void pay()}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2ab5a0] to-[#136b60] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-[0_12px_36px_rgba(42,181,160,0.55)] transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 md:text-sm"
              >
                {busy ? "…" : "Pay with Razorpay"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={accountCreatedDialogOpen} onOpenChange={setAccountCreatedDialogOpen}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your account is ready</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-1 text-left text-sm text-muted-foreground">
                <p>
                  Your student account is now set up with{" "}
                  <strong className="text-card-foreground">{guestEmail}</strong>.
                </p>
                <p>
                  For future mock interviews or mentorship, sign in with this email and your password — you don&apos;t need to use guest checkout again.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" className="rounded-full" onClick={() => setAccountCreatedDialogOpen(false)}>
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
