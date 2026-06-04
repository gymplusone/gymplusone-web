/**
 * FAQ entries (mock until CMS or support tooling exists).
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const MOCK_FAQ: FaqItem[] = [
  {
    id: "match",
    question: "How does matching with a gym +1 work?",
    answer:
      "You complete a short profile about your goals, schedule, and gym style. We suggest people with similar intent and compatible training windows. You can send a +1 request, chat, and plan sessions together. Exact ranking and limits will follow our product rules as we ship.",
  },
  {
    id: "safety",
    question: "How do I stay safe when meeting someone new?",
    answer:
      "Meet in public gym areas first, tell a friend your plans, and use in-app chat before sharing personal details. You can report concerns from Profile → Settings → Contact. We take safety reports seriously and are building clearer tools as the app grows.",
  },
  {
    id: "area",
    question: "Can I change my gym or area later?",
    answer:
      "Yes. Open settings and edit your profile (or repeat onboarding when that flow is exposed). Updating your area refreshes who you can match with nearby.",
  },
  {
    id: "plans",
    question: "What are purchased and saved plans?",
    answer:
      "Purchased plans are programs or subscriptions you’ve bought in the app. Saved plans are workouts or programs you bookmarked to try later. This demo uses sample data until billing and a full catalogue are live.",
  },
  {
    id: "notif",
    question: "Why am I not getting notifications?",
    answer:
      "Check Settings → Application settings → Notifications. On device settings, confirm GYM +1 can send alerts. Push integration is still being connected in production builds.",
  },
  {
    id: "delete",
    question: "How do I delete my account?",
    answer:
      "Use Settings → Delete account. In this demo the button is a placeholder; a real build will walk you through confirmation and data handling per our privacy policy.",
  },
];
