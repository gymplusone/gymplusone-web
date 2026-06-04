/**
 * Purchased training / subscription plans (mock until billing API exists).
 */

export type PurchasedPlanStatus = "active" | "expired" | "cancelled";

export interface PurchasedPlan {
  id: string;
  name: string;
  isMostPopular?: boolean;
  status: PurchasedPlanStatus;
  /** Unix ms */
  startedAt: number;
  /** Unix ms — renewal or access end */
  renewsAt: number;
  priceLabel: string;
  perks: string[];
}

export const MOCK_PURCHASED_PLANS: PurchasedPlan[] = [
  {
    id: "p1",
    name: "1 week",
    status: "active",
    startedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    renewsAt: Date.now() + 6 * 24 * 60 * 60 * 1000,
    priceLabel: "£7.99",
    perks: [
      "Unlimited likes and matches",
      "30 minutes spotlight visibility",
      "View invitations and see invitees profile",
      "View full thread of other users posts",
      "Premium profile (increased visibility)",
    ],
  },
  {
    id: "p2",
    name: "1 month",
    isMostPopular: true,
    status: "active",
    startedAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    renewsAt: Date.now() + 20 * 24 * 60 * 60 * 1000,
    priceLabel: "£24.99",
    perks: [
      // "Structured progression blocks",
      // "Form check checkpoints",
      // "Trainer-written notes",
      "Unlimited likes and matches",
      "45 minutes spotlight visibility",
      "View invitations and see invitees profile",
      "View full thread of other users posts",
      "Premium profile (increased visibility)",
    ],
  },
  {
    id: "p3",
    name: "1 year",
    status: "active",
    startedAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    renewsAt: Date.now() + 325 * 24 * 60 * 60 * 1000,
    priceLabel: "£279.99 per year",
    // perks: ["Monthly match credits", "Community feed"],
    perks: [
      "Unlimited likes and matches",
      "1 hour spotlight visibility",
      "View invitations and see invitees profile",
      "View full thread of other users posts",
      "Premium profile (increased visibility)",
    ],
  },
];

export function formatPlanDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
