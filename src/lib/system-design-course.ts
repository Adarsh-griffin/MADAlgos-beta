/**
 * System design course outline — sidebar structure only; lesson HTML can be added per id later.
 */

export type LessonItem = {
  id: string;
  title: string;
  /** Premium / sign-in required */
  locked?: boolean;
};

export type CourseSectionDef = {
  id: string;
  title: string;
  /** Lucide icon name — mapped in the client */
  icon: "clock" | "book-open" | "map-pin" | "layout-grid" | "zap" | "atom";
  defaultOpen?: boolean;
  lessons: LessonItem[];
};

export const SYSTEM_DESIGN_SECTIONS: CourseSectionDef[] = [
  {
    id: "in-a-hurry",
    title: "In a Hurry",
    icon: "clock",
    defaultOpen: true,
    lessons: [
      { id: "introduction", title: "Introduction" },
      { id: "how-to-prepare", title: "How to Prepare" },
      { id: "delivery-framework", title: "Delivery Framework" },
      { id: "core-concepts-intro", title: "Core Concepts" },
      { id: "key-technologies-intro", title: "Key Technologies" },
      { id: "common-patterns-intro", title: "Common Patterns" },
      { id: "question-breakdowns-intro", title: "Question Breakdowns" },
    ],
  },
  {
    id: "core-concepts",
    title: "Core Concepts",
    icon: "book-open",
    defaultOpen: true,
    lessons: [
      { id: "networking-essentials", title: "Networking Essentials" },
      { id: "api-design", title: "API Design" },
      { id: "data-modeling", title: "Data Modeling" },
      { id: "caching", title: "Caching" },
      { id: "sharding", title: "Sharding" },
      { id: "consistent-hashing", title: "Consistent Hashing" },
      { id: "cap-theorem", title: "CAP Theorem" },
      { id: "database-indexing", title: "Database Indexing", locked: true },
      { id: "numbers-to-know", title: "Numbers to Know", locked: true },
    ],
  },
  {
    id: "question-breakdowns",
    title: "Question Breakdowns",
    icon: "map-pin",
    lessons: [],
  },
  {
    id: "patterns",
    title: "Patterns",
    icon: "layout-grid",
    lessons: [],
  },
  {
    id: "key-technologies",
    title: "Key Technologies",
    icon: "zap",
    lessons: [],
  },
  {
    id: "advanced-topics",
    title: "Advanced Topics",
    icon: "atom",
    lessons: [],
  },
];
