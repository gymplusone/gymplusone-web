/**
 * Mock +1 Coach responses – local only, no AI API.
 * TODO: Replace with real AI/LLM or chat API when productizing.
 */

import type { OnboardingData } from '@/types';

const NERVOUS_PROMPTS = ['nervous', 'anxious', 'scared', 'intimidat'];
const CONSISTENCY_PROMPTS = ['consistent', 'stay on', 'stick', 'motivat', 'schedule'];
const TIME_PROMPTS = ['time', 'when', 'next session', 'schedule', 'day', 'window'];

function matchesPrompt(input: string, keywords: string[]): boolean {
  const lower = input.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

export function getMockCoachResponse(
  userMessage: string,
  onboardingData: OnboardingData | null
): string {
  const name = onboardingData?.firstName ? `, ${onboardingData.firstName}` : '';
  const timePref = onboardingData?.preferredTime ?? 'evening';
  const timeLabel =
    timePref === 'early_morning'
      ? 'Early morning'
      : timePref === 'morning'
        ? 'Morning'
        : timePref === 'afternoon'
          ? 'Afternoon'
          : 'Evening';

  if (matchesPrompt(userMessage, NERVOUS_PROMPTS)) {
    return `You’re not alone${name}. A lot of people feel nervous at first. Try picking one small win for today—like walking in and doing 10 minutes on your favorite machine. Once you’re there, you often want to do more. Your future +1 would be proud of you for showing up.`;
  }

  if (matchesPrompt(userMessage, CONSISTENCY_PROMPTS)) {
    return `Staying consistent is easier with a buddy. This week, aim for 2 sessions—and block them in your calendar like real appointments. ${timeLabel} tends to work well for you based on your preferences. When you’re ready, your match can help keep you accountable.`;
  }

  if (matchesPrompt(userMessage, TIME_PROMPTS)) {
    return `Based on your preferences, ${timeLabel} is a great window for you. Try scheduling your next session in the next 2–3 days. If you’ve already matched with someone, suggest that time—it could be your first session together.`;
  }

  // Default supportive response
  return `I hear you. Remember: progress over perfection. Every session counts, and having a +1 can make it more fun and consistent. Is there something specific you’d like to work on—like scheduling, confidence, or finding a time that works?`;
}

export const COACH_SUGGESTED_PROMPTS = [
  'I feel nervous going to the gym.',
  'Help me stay consistent this week.',
  'Suggest a good time for my next session.',
];
