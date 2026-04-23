import { NextResponse } from "next/server";
import { getSessionFromRequestCookies } from "@/lib/auth";
import UserModel from "@/models/User";

type TokenLike = {
  practiceTestId?: unknown;
  linkedUserId?: unknown;
  studentEmail?: string;
};

/**
 * Public-practice tokens are account bound. Invite-based assessment tokens are not.
 */
export async function requirePracticeTokenAccess(tokenDoc: TokenLike): Promise<NextResponse | null> {
  if (!tokenDoc.practiceTestId) return null;

  const session = await getSessionFromRequestCookies();
  if (!session) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }

  if (tokenDoc.linkedUserId && String(tokenDoc.linkedUserId) !== String(session.uid)) {
    return NextResponse.json({ message: "This test link belongs to another account." }, { status: 403 });
  }

  if (!tokenDoc.linkedUserId) {
    const user = await UserModel.findById(session.uid).select("email").lean<{ email?: string } | null>();
    const sessionEmail = String(user?.email || "").trim().toLowerCase();
    const tokenEmail = String(tokenDoc.studentEmail || "").trim().toLowerCase();
    if (!sessionEmail || !tokenEmail || sessionEmail !== tokenEmail) {
      return NextResponse.json({ message: "This test link belongs to another account." }, { status: 403 });
    }
  }

  return null;
}
