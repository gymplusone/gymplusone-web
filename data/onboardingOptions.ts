/**
 * Options for onboarding steps
 * TODO: Could be driven by backend config later
 */

import type {
  FitnessGoal,
  WorkoutStyle,
  FitnessLevel,
  GymFrequency,
  PreferredTime,
  MotivationStyle,
  PersonalityVibe,
  GymType,
  ConfidenceLevel,
  GenderPreference,
} from '@/types';

export const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];

export const genderPreferenceOptions: { value: GenderPreference; label: string }[] = [
  { value: 'any', label: 'Any' },
  { value: 'same', label: 'Same as me' },
  { value: 'no_preference', label: 'No preference' },
];

export const fitnessGoalOptions: { value: FitnessGoal; label: string }[] = [
  { value: 'lose_weight', label: 'Lose weight' },
  { value: 'build_muscle', label: 'Build muscle' },
  { value: 'improve_consistency', label: 'Improve consistency' },
  { value: 'confidence_in_gym', label: 'Confidence in the gym' },
  { value: 'general_fitness', label: 'General fitness' },
];

export const workoutStyleOptions: { value: WorkoutStyle; label: string }[] = [
  { value: 'strength_training', label: 'Strength training' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'classes', label: 'Classes' },
  { value: 'functional_fitness', label: 'Functional fitness' },
  { value: 'mixed', label: 'Mixed' },
];

export const fitnessLevelOptions: { value: FitnessLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const gymFrequencyOptions: { value: GymFrequency; label: string }[] = [
  { value: '1_2', label: '1-2 times/week' },
  { value: '3_4', label: '3-4 times/week' },
  { value: '5_plus', label: '5+ times/week' },
];

export const preferredTimeOptions: { value: PreferredTime; label: string }[] = [
  { value: 'early_morning', label: 'Early morning' },
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

export const motivationStyleOptions: { value: MotivationStyle; label: string }[] = [
  { value: 'encouragement', label: 'Encouragement' },
  { value: 'discipline', label: 'Discipline' },
  { value: 'accountability_checkins', label: 'Accountability check-ins' },
  { value: 'fun_social', label: 'Fun / social' },
];

export const personalityVibeOptions: { value: PersonalityVibe; label: string }[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'focused', label: 'Focused' },
  { value: 'chatty', label: 'Chatty' },
];

export const areaOptions = [
  'Central London',
  'North London',
  'South London',
  'East London',
  'West London',
  'Shoreditch',
  'Camden',
  'Islington',
  'Brixton',
  'Clapham',
  'Stratford',
  'Canary Wharf',
];

export const gymTypeOptions: { value: GymType; label: string }[] = [
  { value: 'commercial_gym', label: 'Commercial gym' },
  { value: 'women_only', label: 'Women-only gym' },
  { value: 'local_community', label: 'Local / community gym' },
  { value: 'luxury_gym', label: 'Luxury gym' },
];

export const confidenceLevelOptions: { value: ConfidenceLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];
