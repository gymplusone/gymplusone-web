/**
 * Centralized label maps for display – single source of truth
 * Derived from onboarding options where possible
 */

import {
  fitnessGoalOptions,
  workoutStyleOptions,
  fitnessLevelOptions,
  gymFrequencyOptions,
  preferredTimeOptions,
  motivationStyleOptions,
  personalityVibeOptions,
  gymTypeOptions,
  confidenceLevelOptions,
} from '@/data/onboardingOptions';

function toRecord(
  options: readonly { value: string; label: string }[]
): Record<string, string> {
  return Object.fromEntries(options.map((o) => [o.value, o.label]));
}

export const labels = {
  fitnessGoal: toRecord(fitnessGoalOptions),
  workoutStyle: toRecord(workoutStyleOptions),
  fitnessLevel: toRecord(fitnessLevelOptions),
  gymFrequency: toRecord(gymFrequencyOptions),
  preferredTime: toRecord(preferredTimeOptions),
  motivationStyle: toRecord(motivationStyleOptions),
  personalityVibe: toRecord(personalityVibeOptions),
  gymType: toRecord(gymTypeOptions),
  confidenceLevel: toRecord(confidenceLevelOptions),
} as const;

/** Short labels for compact UI (e.g. cards) */
export const shortLabels = {
  fitnessGoal: {
    lose_weight: 'Lose weight',
    build_muscle: 'Build muscle',
    improve_consistency: 'Consistency',
    confidence_in_gym: 'Confidence',
    general_fitness: 'General fitness',
  } as Record<string, string>,
  workoutStyle: {
    strength_training: 'Strength',
    cardio: 'Cardio',
    classes: 'Classes',
    functional_fitness: 'Functional',
    mixed: 'Mixed',
  } as Record<string, string>,
};
