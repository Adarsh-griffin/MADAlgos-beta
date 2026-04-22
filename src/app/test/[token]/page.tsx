import { connectDB } from "@/lib/mongodb";
import TestTokenModel from "@/models/TestToken";
import { loadAssessmentForToken } from "@/lib/assessment-load";
import { notFound } from "next/navigation";
import { TestRoom } from "@/components/assessment/TestRoom";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { TestProfileForm } from "@/components/assessment/TestProfileForm";
import { TestAssessmentInstructions } from "@/components/assessment/TestAssessmentInstructions";
import { finalizeAssessmentIfTimeExpired } from "@/lib/assessment-finalize";

export const dynamic = "force-dynamic";

function AssessmentThankYou() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#050505] border border-white/10 text-center space-y-6">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-white">Thank you</h1>
        <p className="text-slate-400">
          This assessment is closed and your responses have been saved. You can close this window or return home.
        </p>
        <Button asChild className="w-full rounded-full">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}

interface TestPageProps {
  params: Promise<{ token: string }>;
}

export default async function TestLinkPage({ params }: TestPageProps) {
  const { token } = await params;
  await connectDB();

  const testToken = await TestTokenModel.findOne({ token }).lean<any>();
  if (!testToken) return notFound();

  const isExpired = new Date() > new Date(testToken.expiresAt);
  if (isExpired && !testToken.isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#050505] border border-white/10 text-center space-y-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Link Expired</h1>
          <p className="text-slate-400">
            This assessment link expired on {new Date(testToken.expiresAt).toLocaleString()}.
          </p>
          <Button asChild className="w-full rounded-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (testToken.submittedAt) {
    return <AssessmentThankYou />;
  }

  const test = await loadAssessmentForToken(testToken);
  if (!test) return notFound();

  if (testToken.isStarted && !testToken.submittedAt) {
    await finalizeAssessmentIfTimeExpired(token);
    const afterTime = await TestTokenModel.findOne({ token }).lean<any>();
    if (afterTime?.submittedAt) {
      return <AssessmentThankYou />;
    }
  }

  const testJson = JSON.parse(JSON.stringify(test));
  const tokenJson = JSON.parse(JSON.stringify(testToken));

  if (!testToken.isStarted) {
    if (!testToken.profileSubmittedAt) {
      return (
        <TestProfileForm
          token={token}
          defaultEmail={String(testToken.studentEmail)}
          testTitle={String(test.title)}
        />
      );
    }
    return <TestAssessmentInstructions token={token} test={testJson} />;
  }

  return <TestRoom test={testJson} tokenData={tokenJson} />;
}
