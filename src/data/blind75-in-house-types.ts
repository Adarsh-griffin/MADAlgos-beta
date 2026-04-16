import type { CodingProblem } from "@/models/Test";

/** Full in-house copy + tests + per-language starters for one Blind 75 slug. */
export type InHouseBlind75Entry = Omit<CodingProblem, "title">;
