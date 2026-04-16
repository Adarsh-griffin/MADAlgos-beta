import { BLIND_75 } from "@/data/blind75-slugs";
import type { InHouseBlind75Entry } from "@/data/blind75-in-house-types";
import { BLIND75_IN_HOUSE_PART_A } from "./part-a";
import { BLIND75_IN_HOUSE_PART_B } from "./part-b";
import { BLIND75_IN_HOUSE_PART_C } from "./part-c";
import { BLIND75_IN_HOUSE_PART_D } from "./part-d";

/** Full in-house catalog keyed by LeetCode-style slug (matches QuestionBankItem.leetcodeSlug). */
export const BLIND75_IN_HOUSE_BY_SLUG: Record<string, InHouseBlind75Entry> = {
  ...BLIND75_IN_HOUSE_PART_A,
  ...BLIND75_IN_HOUSE_PART_B,
  ...BLIND75_IN_HOUSE_PART_C,
  ...BLIND75_IN_HOUSE_PART_D,
};

export function getInHouseBlind75Entry(slug: string): InHouseBlind75Entry | undefined {
  return BLIND75_IN_HOUSE_BY_SLUG[slug];
}

if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  const missing = BLIND_75.filter((r) => !BLIND75_IN_HOUSE_BY_SLUG[r.slug]);
  if (missing.length) {
    console.warn(
      `[blind75-in-house-catalog] Expected ${BLIND_75.length} entries, missing:`,
      missing.map((m) => m.slug).join(", ")
    );
  }
}
