import { MOCK_BUDDIES } from "@/data/mockBuddies";

function initialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0]![0]!.toUpperCase();
  return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
}

function pickBuddy(name: string) {
  return MOCK_BUDDIES.find((b) => b.name === name);
}

function toPerson(name: string) {
  const buddy = pickBuddy(name);
  const safeName = buddy?.name ?? name;
  return {
    name: safeName,
    initials: initialsFromName(safeName),
  };
}

/**
 * Shared demo people used by feed/chat-adjacent screens to keep names consistent.
 * Source of truth: names come from MOCK_BUDDIES.
 */
export const CORE_MOCK_PEOPLE = {
  jordan: toPerson("Jordan"),
  sam: toPerson("Sam"),
  alex: toPerson("Alex"),
  riley: toPerson("Riley"),
  taylor: toPerson("Taylor"),
  morgan: toPerson("Morgan"),
} as const;

