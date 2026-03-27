import mongoose, { Schema, model, models } from "mongoose";
import type { AccountStatus, UserRole, VerificationStatus } from "@/lib/auth";

export interface UserDocument {
  email: string;
  username: string | null;
  role: UserRole;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  accountStatus: AccountStatus;
  verificationStatus: VerificationStatus;
  /** True after user clicks email verification link (or OAuth). Undefined in legacy DB = treated as verified at login. */
  emailVerified?: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpiresAt: Date | null;
  /** After mentor applies: confirmation + team emails sent post email verification. */
  mentorApplyEmailsSent: boolean;
  linkedinProfileUrl: string | null;
  authProvider: null | "password" | "google" | "password+google";
  passwordHash: string | null;
  googleId: string | null;
  mentorCredentialToken: string | null;
  mentorCredentialTokenExpiresAt: Date | null;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  /** Phone for bookings / Razorpay prefill (optional). */
  mobile?: string | null;
  /** Admin-editable avatar URL (optional). */
  profilePicture?: string | null;
  /** Optional program/course label (admin-visible; e.g. bootcamp name). */
  enrolledCourse?: string | null;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    username: { type: String, default: null },
    role: {
      type: String,
      required: true,
      enum: ["SUPER_ADMIN", "ADMIN", "MENTOR_PENDING", "MENTOR", "STUDENT"],
      default: "STUDENT",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "PENDING", "SUSPENDED"],
      default: "PENDING",
    },
    accountStatus: {
      type: String,
      required: true,
      enum: [
        "PENDING_APPLICATION",
        "AWAITING_CREDENTIAL_SETUP",
        "ACTIVE",
        "REJECTED",
        "SUSPENDED",
      ],
    },
    verificationStatus: {
      type: String,
      required: true,
      enum: ["UNVERIFIED", "VERIFIED"],
    },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null, sparse: true, index: true },
    emailVerificationExpiresAt: { type: Date, default: null },
    mentorApplyEmailsSent: { type: Boolean, default: false },
    linkedinProfileUrl: { type: String, default: null },
    authProvider: {
      type: String,
      default: null,
      enum: ["password", "google", "password+google", null],
    },
    passwordHash: { type: String, default: null },
    googleId: { type: String, default: null, index: true },
    mentorCredentialToken: { type: String, default: null, index: true },
    mentorCredentialTokenExpiresAt: { type: Date, default: null },
    profileCompleted: { type: Boolean, default: false },
    lastLoginAt: { type: Date, default: null },
    mobile: { type: String, default: null },
    profilePicture: { type: String, default: null },
    enrolledCourse: { type: String, default: null },
  },
  { collection: "users", timestamps: true }
);

const UserModel =
  (models.User as mongoose.Model<UserDocument>) || model<UserDocument>("User", UserSchema);

export default UserModel;

