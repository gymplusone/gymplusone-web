import type { FeedPost } from "@/types";

const FEED_IMG_1 = require("@/assets/images/gym/2149278038.jpg");
const FEED_IMG_2 = require("@/assets/images/gym/2150165238.jpg");
const FEED_IMG_3 = require("@/assets/images/gym/9310.jpg");

function handleFromName(name: string): string {
  const base = name
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();
  return base.length > 0 ? `${base}_gym` : "member";
}

const now = Date.now();

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: "feed-seed-1",
    authorName: "Jordan",
    authorHandle: handleFromName("Jordan"),
    authorInitial: "J",
    authorVerified: true,
    authorLifterBadge: true,
    body: "New squat PR - 100kg × 5. Shout-out to my +1 for the spot 🙌 Who else is leg day today?",
    createdAt: now - 45 * 60 * 1000,
    likesCount: 24,
    commentsCount: 5,
    image: FEED_IMG_1,
    imagePremium: true,
  },
  {
    id: "feed-seed-2",
    authorName: "Sam",
    authorHandle: handleFromName("Sam"),
    authorInitial: "S",
    body: "Morning session done before work. Small win: showed up when I didn’t feel like it. That counts.",
    createdAt: now - 3 * 60 * 60 * 1000,
    likesCount: 18,
    commentsCount: 12,
  },
  {
    id: "feed-seed-3",
    authorName: "Alex",
    authorHandle: handleFromName("Alex"),
    authorInitial: "A",
    authorLifterBadge: true,
    body: "Looking for a +1 for evening cardio at Canary Wharf - DM if you’re consistent Tue/Thu.",
    createdAt: now - 5 * 60 * 60 * 1000,
    likesCount: 9,
    commentsCount: 3,
    image: FEED_IMG_2,
    imagePremium: true,
  },
  {
    id: "feed-seed-4",
    authorName: "Riley",
    authorHandle: handleFromName("Riley"),
    authorInitial: "R",
    authorVerified: true,
    body: "Recovery day = walk + stretch. Posting so someone else remembers rest is training too.",
    createdAt: now - 26 * 60 * 60 * 1000,
    likesCount: 31,
    commentsCount: 8,
  },
  {
    id: "feed-seed-5",
    authorName: "Taylor",
    authorHandle: handleFromName("Taylor"),
    authorInitial: "T",
    authorLifterBadge: true,
    body: "First time trying the heavy bag after weights. Exhausted in the best way.",
    createdAt: now - 48 * 60 * 60 * 1000,
    likesCount: 14,
    commentsCount: 2,
    image: FEED_IMG_3,
  },
];
