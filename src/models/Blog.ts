import mongoose, { Schema, model, models } from "mongoose";

export interface BlogAuthorDetails {
  firstName: string;
  lastName: string | null;
  dispImageLink: string | null;
}

export interface BlogDocument {
  id: number;
  title: string;
  publisher: string;
  bannerImageLink: string | null;
  category?: string;
  tags?: string[];
  seoDescription?: string;
  seoKeywords?: string[];
  descriptionId: string;
  partitionKey: string;
  publishDate: string;
  authorId: number;
  status: "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED";
  reviewStatus: string;
  likes: number;
  reviewer: string;
  reviewDate: string;
  descriptionDetails: string;
  submittedByUid?: string | null;
  rejectionReason?: string | null;
  authorDetails?: BlogAuthorDetails | null;
}

const BlogSchema = new Schema<BlogDocument>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    publisher: { type: String, default: "MadAlgos" },
    bannerImageLink: { type: String, default: null },
    category: { type: String, default: "" },
    tags: { type: [String], default: [] },
    seoDescription: { type: String, default: "" },
    seoKeywords: { type: [String], default: [] },
    descriptionId: { type: String, required: true },
    partitionKey: { type: String, default: "0" },
    publishDate: { type: String, required: true },
    authorId: { type: Number, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "PENDING_REVIEW", "PUBLISHED", "REJECTED"],
      default: "DRAFT",
    },
    reviewStatus: { type: String, default: "APPROVED" },
    likes: { type: Number, default: 0 },
    reviewer: { type: String, default: "" },
    reviewDate: { type: String, default: "" },
    descriptionDetails: { type: String, required: true },
    submittedByUid: { type: String, default: null, index: true },
    rejectionReason: { type: String, default: null },
    authorDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, default: null },
      dispImageLink: { type: String, default: null },
    },
  },
  {
    collection: "blogs",
  }
);

const BlogModel =
  (models.Blog as mongoose.Model<BlogDocument>) ||
  model<BlogDocument>("Blog", BlogSchema);

export default BlogModel;

