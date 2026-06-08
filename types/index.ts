/**
 * GYM +1 – Shared types
 * TODO: Align with backend API when integrating
 */

import type { ImageSourcePropType } from 'react-native';

export type FitnessGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'improve_consistency'
  | 'confidence_in_gym'
  | 'general_fitness';

export type WorkoutStyle =
  | 'strength_training'
  | 'cardio'
  | 'classes'
  | 'functional_fitness'
  | 'mixed';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type GymFrequency = '1_2' | '3_4' | '5_plus';

export type PreferredTime =
  | 'early_morning'
  | 'morning'
  | 'afternoon'
  | 'evening';

export type MotivationStyle =
  | 'encouragement'
  | 'discipline'
  | 'accountability_checkins'
  | 'fun_social';

export type PersonalityVibe = 'calm' | 'energetic' | 'focused' | 'chatty';

export type GymType =
  | 'commercial_gym'
  | 'women_only'
  | 'local_community'
  | 'luxury_gym';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export type GenderPreference = 'any' | 'same' | 'no_preference';

export interface OnboardingData {
  firstName: string;
  ageRange: string;
  genderPreference: GenderPreference;
  fitnessGoal: FitnessGoal;
  workoutStyle: WorkoutStyle;
  fitnessLevel: FitnessLevel;
  gymFrequency: GymFrequency;
  preferredTime: PreferredTime;
  motivationStyle: MotivationStyle;
  personalityVibe: PersonalityVibe;
  area: string;
  gymType: GymType;
  confidenceLevel: ConfidenceLevel;
}

export interface GymBuddyProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  area: string;
  bio: string;
  fitnessGoal: FitnessGoal;
  workoutStyle: WorkoutStyle;
  fitnessLevel: FitnessLevel;
  gymFrequency: GymFrequency;
  preferredTime: PreferredTime;
  motivationStyle: MotivationStyle;
  personalityVibe: PersonalityVibe;
  confidenceLevel: ConfidenceLevel;
  gymType: GymType;
  avatarPlaceholder: string;
  /** 1 = avatar.jpg, 2 = avatar2.jpg for match-card hero (prototype) */
  cardBackgroundImage?: 1 | 2;
  availableDays: string[];
  /** Optional: shown in +1 deck detail panel */
  ethnicity?: string;
  /** Optional story captions under the card (images reuse hero assets) */
  profileStories?: { caption: string }[];
}

export interface MatchResult {
  profile: GymBuddyProfile;
  score: number;
  explanation: string;
  accountabilityStyle: string;
  bestTimeToTrain: string;
}

export interface UserState {
  hasCompletedOnboarding: boolean;
  onboardingData: OnboardingData | null;
  topMatches: MatchResult[];
  sentRequests: string[];
}

/** Community feed post (local + mock until API exists) */
export interface FeedPost {
  id: string;
  authorName: string;
  /** e.g. maya_lifts — shown as @maya_lifts */
  authorHandle: string;
  authorInitial: string;
  /** Verified member (shield + check, theme primary). */
  authorVerified?: boolean;
  /** Lifter / gym badge beside name (`weight.svg`). */
  authorLifterBadge?: boolean;
  body: string;
  createdAt: number;
  likesCount: number;
  commentsCount: number;
  /** Bundled asset or remote URI — omit for text-only posts */
  image?: ImageSourcePropType;
  /** Show “Premium” pill on the image (top-right). */
  imagePremium?: boolean;
  /** True when created from the signed-in user’s composer */
  isFromCurrentUser?: boolean;
  isMealPlan?: boolean;
  planPrice?: string;
  planName?: string;
}

export interface FeedComment {
  id: string;
  postId: string;
  name: string;
  handle: string;
  /** Verified member badge beside commenter name. */
  authorVerified?: boolean;
  /** Lifter badge beside commenter name. */
  authorLifterBadge?: boolean;
  /** Show +1 pill for commenters without other badges. */
  authorPlusOneBadge?: boolean;
  text: string;
  createdAt: number;
}
