/**
 * Bookmarked training plans (mock until API exists).
 */

export interface SavedPlan {
  id: string;
  name: string;
  /** e.g. Strength, Hypertrophy */
  focus: string;
  durationWeeks: number;
  /** Unix ms */
  savedAt: number;
  highlights: string[];
}

export const MOCK_SAVED_PLANS: SavedPlan[] = [
  {
    id: "s1",
    name: "Push / Pull / Legs — Power block",
    focus: "Hypertrophy",
    durationWeeks: 8,
    savedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    highlights: [
      "3× weekly full-body split",
      "RPE-based top sets",
      "Built-in deload on week 5",
    ],
  },
  {
    id: "s2",
    name: "Hybrid: Couch to 5K + gym",
    focus: "Conditioning",
    durationWeeks: 12,
    savedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    highlights: [
      "Two runs + two lifts per week",
      "Audio pacing cues",
      "Ankle and hip prep on lift days",
    ],
  },
  {
    id: "s3",
    name: "Deload & mobility reset",
    focus: "Recovery",
    durationWeeks: 1,
    savedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    highlights: [
      "Daily 15-min flows",
      "Light pump work only",
      "Sleep and steps checklist",
    ],
  },
];

export function formatSavedPlanDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
