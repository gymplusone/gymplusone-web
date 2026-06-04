import { labels, shortLabels } from '@/constants/labels';
import type { GymBuddyProfile } from '@/types';

/** Stable pseudo-distance for prototype (km). */
export function buddyApproxDistanceKm(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return 5 + (Math.abs(h) % 32);
}

export function buddyExperienceLine(buddy: GymBuddyProfile): string {
  const levelLabel = labels.fitnessLevel[buddy.fitnessLevel];
  const years =
    buddy.fitnessLevel === 'beginner'
      ? '0–1 years'
      : buddy.fitnessLevel === 'intermediate'
        ? '2–4 years'
        : '5+ years';
  return `${levelLabel} · ${years}`;
}

export function buddyFitnessActivityLine(buddy: GymBuddyProfile): string {
  return labels.gymFrequency[buddy.gymFrequency];
}

/** Status-style pills (location / identity hints). */
export function buddyStatusPills(buddy: GymBuddyProfile): string[] {
  return [`Trains near ${buddy.area}`, buddy.gender];
}

/** Interest chips with emoji + label (reference-style grid). */
export function buddyInterestChips(buddy: GymBuddyProfile): string[] {
  const chips: string[] = [];
  const push = (s: string) => {
    if (!chips.includes(s)) chips.push(s);
  };
  push(`🎯 ${shortLabels.fitnessGoal[buddy.fitnessGoal] ?? buddy.fitnessGoal}`);
  push(`💪 ${shortLabels.workoutStyle[buddy.workoutStyle] ?? buddy.workoutStyle}`);
  push(`✨ ${labels.personalityVibe[buddy.personalityVibe]}`);
  push(`🏋️ ${labels.gymType[buddy.gymType]}`);
  push(`⏰ ${labels.preferredTime[buddy.preferredTime]}`);
  push(`🤝 ${labels.motivationStyle[buddy.motivationStyle]}`);
  buddy.availableDays.forEach((d) => push(`📅 ${d}`));
  return chips.slice(0, 10);
}

export function buddyWorkoutPlansSummary(buddy: GymBuddyProfile): string {
  const goal = labels.fitnessGoal[buddy.fitnessGoal];
  const freq = labels.gymFrequency[buddy.gymFrequency];
  const time = labels.preferredTime[buddy.preferredTime];
  return `${goal} · ${freq} · prefers ${time.toLowerCase()} sessions. Open to adjusting plans with a +1.`;
}

/** Two story blocks; captions from bio + schedule when `profileStories` absent. */
export function buddyStoryBlocks(buddy: GymBuddyProfile): { caption: string }[] {
  if (buddy.profileStories?.length) {
    return [...buddy.profileStories];
  }
  const days = buddy.availableDays.join(', ');
  return [
    { caption: buddy.bio },
    {
      caption: `Usually free ${days || 'throughout the week'}. ${labels.motivationStyle[buddy.motivationStyle]} is what keeps me consistent.`,
    },
  ];
}
