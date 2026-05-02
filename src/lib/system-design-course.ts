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
    title: "Quick-start path",
    icon: "clock",
    defaultOpen: true,
    lessons: [
      { id: "introduction", title: "Course overview" },
      { id: "how-to-prepare", title: "Prep guide" },
      { id: "delivery-framework", title: "Interview playbook" },
      { id: "core-concepts-intro", title: "Foundations snapshot" },
      { id: "key-technologies-intro", title: "Tech landscape (intro)" },
      { id: "common-patterns-intro", title: "Pattern primer" },
      { id: "question-breakdowns-intro", title: "Deconstructing prompts" },
    ],
  },
  {
    id: "core-concepts",
    title: "Technical deep dives",
    icon: "book-open",
    defaultOpen: true,
    lessons: [
      { id: "networking-essentials", title: "Network fundamentals" },
      { id: "api-design", title: "Designing APIs" },
      { id: "data-modeling", title: "Data & schema design" },
      { id: "caching", title: "Cache strategies" },
      { id: "sharding", title: "Horizontal partitioning" },
      { id: "consistent-hashing", title: "Hash rings & distribution" },
      { id: "cap-theorem", title: "CAP trade-offs" },
      { id: "database-indexing", title: "Indexes & performance" },
      { id: "numbers-to-know", title: "Back-of-the-envelope numbers" },
    ],
  },
  {
    id: "question-breakdowns",
    title: "Interview walkthroughs",
    icon: "map-pin",
    defaultOpen: true,
    lessons: [
      { id: "wt-url-shortener", title: "URL shortener" },
      { id: "wt-news-feed", title: "Fan-out news feed" },
      { id: "wt-notification-system", title: "Notification system" },
    ],
  },
  {
    id: "patterns",
    title: "Architecture patterns",
    icon: "layout-grid",
    defaultOpen: true,
    lessons: [
      { id: "pat-gateway-bff", title: "Gateways & BFF" },
      { id: "pat-event-driven", title: "Event-driven backbone" },
      { id: "pat-strangler", title: "Strangler fig migration" },
    ],
  },
  {
    id: "key-technologies",
    title: "Platforms & building blocks",
    icon: "zap",
    defaultOpen: true,
    lessons: [
      { id: "tech-kafka-streams", title: "Kafka & streams" },
      { id: "tech-redis-production", title: "Redis at scale" },
      { id: "tech-object-storage", title: "Object storage & CDN" },
    ],
  },
  {
    id: "advanced-topics",
    title: "Beyond the basics",
    icon: "atom",
    defaultOpen: true,
    lessons: [
      { id: "adv-leader-election", title: "Leader election" },
      { id: "adv-observability", title: "Tracing & SLOs" },
      { id: "adv-release-safety", title: "Progressive delivery" },
    ],
  },
];
