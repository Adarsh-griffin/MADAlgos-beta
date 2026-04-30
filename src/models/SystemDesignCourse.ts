import mongoose, { Schema, model, models } from "mongoose";

export type TocItem = {
  id: string;
  label: string;
  depth: number;
};

export type SystemDesignPage = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  order: number;
  published: boolean;
  content: Record<string, unknown>;
  toc: TocItem[];
  updatedAt: Date;
};

export type SystemDesignChapter = {
  id: string;
  title: string;
  order: number;
  pages: SystemDesignPage[];
};

export interface SystemDesignCourseDocument {
  slug: string;
  title: string;
  chapters: SystemDesignChapter[];
  versions: {
    id: string;
    savedAt: Date;
    savedBy: string;
    title: string;
    chapters: SystemDesignChapter[];
  }[];
  updatedBy?: string | null;
}

const TocItemSchema = new Schema<TocItem>(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    depth: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const SystemDesignPageSchema = new Schema<SystemDesignPage>(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    summary: { type: String, default: "" },
    order: { type: Number, required: true, default: 0 },
    published: { type: Boolean, default: false },
    content: { type: Schema.Types.Mixed, default: () => ({ type: "doc", content: [] }) },
    toc: { type: [TocItemSchema], default: [] },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const SystemDesignChapterSchema = new Schema<SystemDesignChapter>(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    pages: { type: [SystemDesignPageSchema], default: [] },
  },
  { _id: false }
);

const SystemDesignCourseSchema = new Schema<SystemDesignCourseDocument>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    chapters: { type: [SystemDesignChapterSchema], default: [] },
    versions: {
      type: [
        new Schema(
          {
            id: { type: String, required: true, trim: true },
            savedAt: { type: Date, required: true, default: Date.now },
            savedBy: { type: String, required: true, trim: true },
            title: { type: String, required: true, trim: true },
            chapters: { type: [SystemDesignChapterSchema], default: [] },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    updatedBy: { type: String, default: null },
  },
  {
    collection: "system_design_courses",
    timestamps: true,
  }
);

const SystemDesignCourseModel =
  (models.SystemDesignCourse as mongoose.Model<SystemDesignCourseDocument>) ||
  model<SystemDesignCourseDocument>("SystemDesignCourse", SystemDesignCourseSchema);

export default SystemDesignCourseModel;
