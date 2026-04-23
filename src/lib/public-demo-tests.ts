import { connectDB } from "@/lib/mongodb";
import PracticeTestModel from "@/models/PracticeTest";
import { resolvePublicDemoLogo } from "@/lib/company-test-branding";

export type PublicDemoTestCard = {
  id: string;
  title: string;
  publicSlug: string;
  /** One line for cards — keep short */
  demoCardSubtitle: string;
  demoCardImageUrl: string;
  /** Resolved logo URL (brand) for square cards */
  logoUrl: string;
  demoSortOrder: number;
  duration: number;
};

/**
 * Homepage featured section: practice packs marked `showOnHomepage` (legacy docs without the field count as visible).
 */
export async function getHomepagePublicDemoTests(): Promise<PublicDemoTestCard[]> {
  await connectDB();
  const docs = await PracticeTestModel.find({
    publicSlug: { $exists: true, $ne: "" },
    $or: [{ showOnHomepage: true }, { showOnHomepage: { $exists: false } }],
  })
    .select(
      "title publicSlug demoCardSubtitle demoCardImageUrl demoBrandLogoUrl demoLogoDomain demoSortOrder duration"
    )
    .sort({ demoSortOrder: 1, createdAt: -1 })
    .lean<
      Array<{
        _id: unknown;
        title: string;
        publicSlug?: string;
        demoCardSubtitle?: string;
        demoCardImageUrl?: string;
        demoBrandLogoUrl?: string;
        demoLogoDomain?: string;
        demoSortOrder?: number;
        duration: number;
      }>
    >()
    .exec();

  return mapPracticeDocsToCards(docs);
}

/**
 * Full catalog: `/available-tests` — every published slug in `practice_test`.
 */
export async function getPublicDemoTests(): Promise<PublicDemoTestCard[]> {
  await connectDB();
  const docs = await PracticeTestModel.find({
    publicSlug: { $exists: true, $ne: "" },
    $or: [{ showOnHomepage: true }, { showOnHomepage: { $exists: false } }],
  })
    .select(
      "title publicSlug demoCardSubtitle demoCardImageUrl demoBrandLogoUrl demoLogoDomain demoSortOrder duration"
    )
    .sort({ demoSortOrder: 1, createdAt: -1 })
    .lean<
      Array<{
        _id: unknown;
        title: string;
        publicSlug?: string;
        demoCardSubtitle?: string;
        demoCardImageUrl?: string;
        demoBrandLogoUrl?: string;
        demoLogoDomain?: string;
        demoSortOrder?: number;
        duration: number;
      }>
    >()
    .exec();

  return mapPracticeDocsToCards(docs);
}

function mapPracticeDocsToCards(
  docs: Array<{
    _id: unknown;
    title: string;
    publicSlug?: string;
    demoCardSubtitle?: string;
    demoCardImageUrl?: string;
    demoBrandLogoUrl?: string;
    demoLogoDomain?: string;
    demoSortOrder?: number;
    duration: number;
  }>
): PublicDemoTestCard[] {
  return docs
    .filter((d) => d.publicSlug && String(d.publicSlug).trim())
    .map((d) => {
      const publicSlug = String(d.publicSlug).trim();
      const logoUrl = resolvePublicDemoLogo({
        publicSlug,
        demoBrandLogoUrl: d.demoBrandLogoUrl,
        demoLogoDomain: d.demoLogoDomain,
        demoCardImageUrl: d.demoCardImageUrl,
      });
      return {
        id: String(d._id),
        title: d.title,
        publicSlug,
        demoCardSubtitle: (d.demoCardSubtitle?.trim() || "Practice MCQs & coding — hiring-style.").slice(0, 140),
        demoCardImageUrl:
          d.demoCardImageUrl?.trim() ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop",
        logoUrl,
        demoSortOrder: typeof d.demoSortOrder === "number" ? d.demoSortOrder : 0,
        duration: d.duration,
      };
    });
}
