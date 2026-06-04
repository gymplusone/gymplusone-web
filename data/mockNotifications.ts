/** Prototype notifications — replace with API + real-time when backend exists. */

import type { ImageSourcePropType } from "react-native";

const AVATAR_JORDAN = require("@/assets/images/gym/2149278038.jpg");
const AVATAR_ALEX = require("@/assets/images/gym/2150165238.jpg");
const AVATAR_SAM = require("@/assets/images/gym/9310.jpg");
const AVATAR_TAYLOR = require("@/assets/images/gym/2150975460.jpg");

/** Fixed “now” so Today / Yesterday / section labels are stable in the prototype. */
export const NOTIFICATIONS_REFERENCE_NOW = new Date(2026, 2, 25, 15, 0, 0);

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  read: boolean;
  avatarInitial?: string;
  avatarImage?: ImageSourcePropType;
  /** Presence dot on the avatar (theme primary / lime — e.g. online now). */
  avatarShowOnline?: boolean;
  /** System / category icon (match, lamp, rest tip, calendar sticky note). */
  leadIcon?: "match" | "lampCharge" | "restTip" | "calendarUpdate" | "profileViews";
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  // —— 25 March 2026 (Today) ——
  {
    id: "n1",
    title: "New +1 request",
    body: "Jordan wants to train with you this week. Open Invites to respond.",
    createdAt: new Date(2026, 2, 25, 14, 48).getTime(),
    read: false,
    avatarInitial: "J",
    avatarImage: AVATAR_JORDAN,
  },
  {
    id: "n1b",
    title: "New +1 request",
    body: "Taylor sent you a request after your leg day post. Open Invites to view.",
    createdAt: new Date(2026, 2, 25, 12, 15).getTime(),
    read: false,
    avatarInitial: "T",
    avatarImage: AVATAR_TAYLOR,
    avatarShowOnline: true,
  },
  {
    id: "n2",
    title: "Comment on your post",
    body: "Alex replied: “I’m free Thursday evening - let’s coordinate.”",
    createdAt: new Date(2026, 2, 25, 11, 2).getTime(),
    read: false,
    avatarInitial: "A",
    avatarImage: AVATAR_ALEX,
  },
  {
    id: "n2b",
    title: "Sam liked your post",
    body: "Your morning session check-in got some love from the community.",
    createdAt: new Date(2026, 2, 25, 9, 30).getTime(),
    read: true,
    avatarInitial: "S",
    avatarImage: AVATAR_SAM,
  },
  {
    id: "n2c",
    title: "Weekly recap",
    body: "You completed 4 sessions this week - one more than last week. Keep it up.",
    createdAt: new Date(2026, 2, 25, 8, 0).getTime(),
    read: true,
    leadIcon: "lampCharge",
  },
  // —— 24 March 2026 (Yesterday) ——
  {
    id: "n3",
    title: "Match recap",
    body: "You have 3 new high-fit +1s from your latest quiz. Swipe when ready.",
    createdAt: new Date(2026, 2, 24, 19, 45).getTime(),
    read: true,
    leadIcon: "match",
  },
  {
    id: "n3b",
    title: "Invite accepted",
    body: "Riley confirmed your Saturday morning lift. See it in Calendar.",
    createdAt: new Date(2026, 2, 24, 14, 10).getTime(),
    read: false,
    avatarInitial: "R",
  },
  {
    id: "n3c",
    title: "New message",
    body: "Casey: “Still on for tomorrow’s leg day?”",
    createdAt: new Date(2026, 2, 24, 10, 6).getTime(),
    read: false,
    avatarInitial: "C",
  },
  // —— 23 March 2026 ——
  {
    id: "n5",
    title: "Community highlight",
    body: "You appeared in this week’s Spotlight - check the home feed.",
    createdAt: new Date(2026, 2, 23, 16, 0).getTime(),
    read: true,
    leadIcon: "lampCharge",
  },
  {
    id: "n5b",
    title: "Rest day tip",
    body: "Light walk or stretch today? Recovery counts as training too.",
    createdAt: new Date(2026, 2, 23, 9, 0).getTime(),
    read: true,
    leadIcon: "restTip",
  },
  // —— 20 March 2026 ——
  {
    id: "n4",
    title: "Calendar update",
    body: "Community strength class moved to 18:30 on Thursdays.",
    createdAt: new Date(2026, 2, 20, 17, 30).getTime(),
    read: true,
    leadIcon: "calendarUpdate",
  },
  {
    id: "n4b",
    title: "Profile views",
    body: "12 members viewed your profile this week - update your goals anytime.",
    createdAt: new Date(2026, 2, 20, 11, 22).getTime(),
    read: true,
    leadIcon: "profileViews",
  },
  // —— 18 March 2026 ——
  {
    id: "n6",
    title: "Welcome to Gym+1",
    body: "Finish your profile and find your first +1 in Match results.",
    createdAt: new Date(2026, 2, 18, 10, 0).getTime(),
    read: true,
  },
];

function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDayKey(key: string): Date {
  const [ys, ms, ds] = key.split("-");
  return new Date(Number(ys), Number(ms) - 1, Number(ds));
}

function sectionTitleForDay(
  dayStart: Date,
  now: Date = NOTIFICATIONS_REFERENCE_NOW,
): string {
  const todayStart = startOfLocalDay(now);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  if (dayStart.getTime() === todayStart.getTime()) return "Today";
  if (dayStart.getTime() === yesterdayStart.getTime()) return "Yesterday";

  const day = dayStart.getDate();
  const month = dayStart.toLocaleString("en-GB", { month: "long" });
  const year = dayStart.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatNotificationListTime(createdAt: number): string {
  const d = new Date(createdAt);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export type NotificationSection = {
  title: string;
  data: AppNotification[];
};

export function getNotificationSections(
  items: AppNotification[],
  now: Date = NOTIFICATIONS_REFERENCE_NOW,
): NotificationSection[] {
  const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt);
  const map = new Map<string, AppNotification[]>();

  for (const item of sorted) {
    const key = dayKey(new Date(item.createdAt));
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }

  const keys = [...map.keys()].sort().reverse();

  return keys.map((key) => ({
    title: sectionTitleForDay(parseDayKey(key), now),
    data: map.get(key)!,
  }));
}
