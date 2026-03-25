import Link from "next/link";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export const metadata = {
  title: "Payment success | MADAlgos",
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payID?: string; orderID?: string }>;
}) {
  const sp = await searchParams;
  const payID = sp.payID ?? "";
  const orderID = sp.orderID ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 pt-28 md:pt-32 pb-20 px-4 flex items-center justify-center">
        <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-slate-950/60 p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Booking confirmed</h1>
          <p className="text-sm text-muted-foreground">
            Your payment was successful and your booking is confirmed. You should receive a confirmation email shortly. If you
            don&apos;t see it, check spam or contact support with your payment ID below.
          </p>
          {payID ? (
            <p className="text-xs text-slate-500 break-all">
              Payment ID: <span className="text-slate-300">{payID}</span>
            </p>
          ) : null}
          {orderID ? (
            <p className="text-xs text-slate-500 break-all">
              Order ID: <span className="text-slate-300">{orderID}</span>
            </p>
          ) : null}
          <Link
            href="/"
            className="inline-flex mt-4 text-primary text-sm font-semibold hover:underline"
          >
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
