import { connectDB } from "@/lib/mongodb";
import TestTokenModel from "@/models/TestToken";
import TestModel from "@/models/Test";
import { notFound } from "next/navigation";
import { TestRoom } from "@/components/assessment/TestRoom";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface TestPageProps {
  params: Promise<{ token: string }>;
}

export default async function TestLinkPage({ params }: TestPageProps) {
  const { token } = await params;
  await connectDB();

  // 1. Validate Token
  const testToken = await TestTokenModel.findOne({ token }).lean<any>();
  if (!testToken) return notFound();

  // 2. Check Expiration
  const isExpired = new Date() > new Date(testToken.expiresAt);
  if (isExpired && !testToken.isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#050505] border border-white/10 text-center space-y-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Link Expired</h1>
          <p className="text-slate-400">This assessment link expired on {new Date(testToken.expiresAt).toLocaleString()}.</p>
          <Button asChild className="w-full rounded-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 3. Check if already submitted
  if (testToken.submittedAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#050505] border border-white/10 text-center space-y-6">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Test Completed</h1>
          <p className="text-slate-400">You have already submitted this assessment. No further edits are allowed.</p>
          <Button asChild className="w-full rounded-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 4. Fetch Test Details
  const test = await TestModel.findById(testToken.testId).lean<any>();
  if (!test) return notFound();

  // 5. If not started, show the entry gate
  if (!testToken.isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="max-w-xl w-full p-10 rounded-[40px] bg-[#050505] border border-white/10 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">{test.title}</h1>
            <p className="text-primary font-medium tracking-widest uppercase text-sm">MADAlgos Assessment Platform</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-slate-500 text-xs uppercase font-bold">Duration</p>
              <p className="text-xl font-bold text-white">{test.duration} Minutes</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-slate-500 text-xs uppercase font-bold">Questions</p>
              <p className="text-xl font-bold text-white">{test.mcqs.length + test.codingProblems.length}</p>
            </div>
          </div>

          <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
            <p>• Do not refresh the page once the test starts.</p>
            <p>• The timer will continue even if you close the browser.</p>
            <p>• Ensure a stable internet connection.</p>
          </div>

          <form action="/api/assessment/start" method="POST">
             <input type="hidden" name="token" value={token} />
             <Button type="submit" className="w-full h-16 rounded-full text-xl font-bold bg-primary hover:bg-primary/90 text-black transition-all hover:scale-[1.02]">
                Start My Assessment
             </Button>
          </form>
        </div>
      </div>
    );
  }

  // 6. If started, render the Test Room
  return <TestRoom test={JSON.parse(JSON.stringify(test))} tokenData={JSON.parse(JSON.stringify(testToken))} />;
}
