/**
 * Local compatibility scoring – no external AI.
 * TODO: Replace with real matching API / ML model when backend exists.
 */

import type { OnboardingData, GymBuddyProfile, MatchResult } from '@/types';
import { MOCK_BUDDIES } from '@/data/mockBuddies';

const GOAL_WEIGHT = 20;
const STYLE_WEIGHT = 18;
const LEVEL_WEIGHT = 12;
const TIME_WEIGHT = 20;
const MOTIVATION_WEIGHT = 15;
const CONFIDENCE_WEIGHT = 8;
const AREA_WEIGHT = 7;

function scoreGoal(user: OnboardingData, buddy: GymBuddyProfile): number {
  return user.fitnessGoal === buddy.fitnessGoal ? 100 : 50;
}

function scoreStyle(user: OnboardingData, buddy: GymBuddyProfile): number {
  if (user.workoutStyle === buddy.workoutStyle) return 100;
  if (user.workoutStyle === 'mixed' || buddy.workoutStyle === 'mixed') return 70;
  return 30;
}

function scoreLevel(user: OnboardingData, buddy: GymBuddyProfile): number {
  const order = ['beginner', 'intermediate', 'advanced'];
  const u = order.indexOf(user.fitnessLevel);
  const b = order.indexOf(buddy.fitnessLevel);
  const diff = Math.abs(u - b);
  return diff === 0 ? 100 : diff === 1 ? 70 : 40;
}

function scoreTime(user: OnboardingData, buddy: GymBuddyProfile): number {
  return user.preferredTime === buddy.preferredTime ? 100 : 40;
}

function scoreMotivation(user: OnboardingData, buddy: GymBuddyProfile): number {
  return user.motivationStyle === buddy.motivationStyle ? 100 : 60;
}

function scoreConfidence(user: OnboardingData, buddy: GymBuddyProfile): number {
  const order = ['low', 'medium', 'high'];
  const u = order.indexOf(user.confidenceLevel);
  const b = order.indexOf(buddy.confidenceLevel);
  const diff = Math.abs(u - b);
  return diff === 0 ? 100 : diff === 1 ? 75 : 50;
}

function scoreArea(user: OnboardingData, buddy: GymBuddyProfile): number {
  return user.area === buddy.area ? 100 : 0;
}

function getExplanation(user: OnboardingData, buddy: GymBuddyProfile, score: number): string {
  const parts: string[] = [];
  if (user.preferredTime === buddy.preferredTime) {
    const timeLabels: Record<string, string> = {
      early_morning: 'early morning',
      morning: 'morning',
      afternoon: 'afternoon',
      evening: 'evening',
    };
    parts.push(`You both prefer ${timeLabels[user.preferredTime]} workouts`);
  }
  if (user.motivationStyle === buddy.motivationStyle) {
    parts.push('you value the same kind of accountability');
  }
  const levelMatch = user.fitnessLevel === buddy.fitnessLevel;
  if (levelMatch) parts.push('you\'re at a similar fitness stage');
  if (parts.length === 0) parts.push('your preferences complement each other well');
  return parts.join(', ') + '.';
}

function getAccountabilityStyle(motivation: string): string {
  const map: Record<string, string> = {
    encouragement: 'Encouraging and supportive',
    discipline: 'Structured and consistent',
    accountability_checkins: 'Check-in and follow-up focused',
    fun_social: 'Fun and social',
  };
  return map[motivation] ?? 'Balanced';
}

function getBestTimeLabel(time: string): string {
  const map: Record<string, string> = {
    early_morning: 'Early morning',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
  };
  return map[time] ?? time;
}

export function computeMatch(user: OnboardingData, buddy: GymBuddyProfile): MatchResult {
  const raw =
    (scoreGoal(user, buddy) * GOAL_WEIGHT +
      scoreStyle(user, buddy) * STYLE_WEIGHT +
      scoreLevel(user, buddy) * LEVEL_WEIGHT +
      scoreTime(user, buddy) * TIME_WEIGHT +
      scoreMotivation(user, buddy) * MOTIVATION_WEIGHT +
      scoreConfidence(user, buddy) * CONFIDENCE_WEIGHT +
      scoreArea(user, buddy) * AREA_WEIGHT) /
    100;
  const score = Math.min(99, Math.max(65, Math.round(raw)));
  return {
    profile: buddy,
    score,
    explanation: getExplanation(user, buddy, score),
    accountabilityStyle: getAccountabilityStyle(buddy.motivationStyle),
    bestTimeToTrain: getBestTimeLabel(buddy.preferredTime),
  };
}

export function getTopMatches(user: OnboardingData, count: number = 3): MatchResult[] {
  const results = MOCK_BUDDIES.map((buddy) => computeMatch(user, buddy));
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, count);
}
