/**
 * Canonical mentorship catalog: exactly three IND / INR packages.
 * Keep DB seed and this file in sync (ids 1–3).
 */
export type SimpleMentorshipOffering = {
  id: number;
  durationMonths: number;
  ifSolo: boolean;
  groupSizes: number;
  price: number;
  currency: string;
  personalSessions: number;
  mockInterviews: number;
  expLabel: string;
  region: string;
};

export const SIMPLE_MENTORSHIP_IDS = [1, 2, 3] as const;

export const SIMPLE_MENTORSHIP_OFFERINGS: SimpleMentorshipOffering[] = [
  {
    id: 1,
    durationMonths: 1,
    ifSolo: true,
    groupSizes: 0,
    price: 4999,
    currency: "INR",
    personalSessions: 2,
    mockInterviews: 2,
    expLabel: "Standard",
    region: "IND",
  },
  {
    id: 2,
    durationMonths: 3,
    ifSolo: true,
    groupSizes: 0,
    price: 9999,
    currency: "INR",
    personalSessions: 5,
    mockInterviews: 5,
    expLabel: "Standard",
    region: "IND",
  },
  {
    id: 3,
    durationMonths: 6,
    ifSolo: true,
    groupSizes: 0,
    price: 18999,
    currency: "INR",
    personalSessions: 10,
    mockInterviews: 10,
    expLabel: "Standard",
    region: "IND",
  },
];

export function getSimpleMentorshipById(id: number): SimpleMentorshipOffering | undefined {
  return SIMPLE_MENTORSHIP_OFFERINGS.find((o) => o.id === id);
}

export function formatMentorshipOptionLabel(
  r: Pick<
    SimpleMentorshipOffering,
    "durationMonths" | "mockInterviews" | "personalSessions" | "currency" | "price"
  >
): string {
  return `${r.durationMonths} mo · ${r.mockInterviews} mocks · ${r.personalSessions}× 1:1 sessions · ${r.currency} ${r.price}`;
}
