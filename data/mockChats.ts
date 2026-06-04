import { MOCK_BUDDIES } from '@/data/mockBuddies';

export type ChatMessage = {
  id: string;
  from: 'me' | 'buddy';
  text: string;
  sentAt: string;
};

export type ChatThread = {
  id: string;
  buddyId: string;
  /** Optional label for list + chat header (prototype demo names) */
  displayName?: string;
  unreadCount: number;
  lastActive: string;
  messages: ChatMessage[];
};

const byId = (id: string) => MOCK_BUDDIES.find((b) => b.id === id);

/** Name shown in messages list and chat header */
export function getThreadDisplayName(thread: Pick<ChatThread, 'displayName'>, buddy: { name: string }) {
  const d = thread.displayName?.trim();
  return d || buddy.name;
}

export function getThreadAvatarInitial(thread: Pick<ChatThread, 'displayName'>, buddy: { name: string; avatarPlaceholder: string }) {
  return getThreadDisplayName(thread, buddy).charAt(0).toUpperCase();
}

export const MOCK_THREADS: ChatThread[] = [
  {
    id: 'thread-1',
    buddyId: '1',
    unreadCount: 1,
    lastActive: '2m',
    messages: [
      { id: '1', from: 'buddy', text: "Hey! I'm Jordan. Stoked we matched—evening strength sessions are my jam too.", sentAt: '09:21' },
      { id: '2', from: 'me', text: "Hi Jordan! Same here. When do you usually go? I'm thinking Wed & Fri.", sentAt: '09:22' },
      { id: '3', from: 'buddy', text: 'Wed & Fri work for me. How about 6:30 pm at Shoreditch?', sentAt: '09:24' },
    ],
  },
  {
    id: 'thread-2',
    buddyId: '9',
    unreadCount: 0,
    lastActive: '24m',
    messages: [
      { id: '1', from: 'buddy', text: 'Quick check-in: are we still on for tomorrow morning?', sentAt: '08:58' },
      { id: '2', from: 'me', text: 'Yes! 7:15 works. I will be there.', sentAt: '09:00' },
    ],
  },
  {
    id: 'thread-3',
    buddyId: '5',
    unreadCount: 2,
    lastActive: '1h',
    messages: [
      { id: '1', from: 'buddy', text: 'I found a great lower-body circuit for today.', sentAt: '07:42' },
      { id: '2', from: 'buddy', text: 'Want me to share it before our session?', sentAt: '07:44' },
    ],
  },
  {
    id: 'thread-4',
    buddyId: '2',
    displayName: 'Sasha Kaley',
    unreadCount: 1,
    lastActive: '12m',
    messages: [
      { id: '1', from: 'buddy', text: 'Hey! Stoked we matched. Evening strength sessions are my jam too.', sentAt: '09:21' },
      { id: '2', from: 'me', text: "Hi! Same here. When do you usually go? I'm thinking Wed & Fri.", sentAt: '09:22' },
      { id: '3', from: 'buddy', text: 'Wed & Fri work for me. How about 6:30 pm at Shoreditch?', sentAt: '09:24' },
    ],
  },
  {
    id: 'thread-5',
    buddyId: '3',
    displayName: 'Carol Denver',
    unreadCount: 0,
    lastActive: '32m',
    messages: [
      { id: '1', from: 'buddy', text: 'Quick check-in: are we still on for tomorrow morning?', sentAt: '08:58' },
      { id: '2', from: 'me', text: 'Yes! 7:15 works. I will be there.', sentAt: '09:00' },
    ],
  },
  {
    id: 'thread-6',
    buddyId: '4',
    displayName: 'Angelina Victoria',
    unreadCount: 2,
    lastActive: '2h',
    messages: [
      { id: '1', from: 'buddy', text: 'I found a great lower-body circuit for today.', sentAt: '07:42' },
      { id: '2', from: 'buddy', text: 'Want me to share it before our session?', sentAt: '07:44' },
    ],
  },
  {
    id: 'thread-7',
    buddyId: '6',
    displayName: 'Millie',
    unreadCount: 0,
    lastActive: '3h',
    messages: [
      { id: '1', from: 'me', text: 'Leg day tomorrow?', sentAt: '18:10' },
      { id: '2', from: 'buddy', text: "Yes - I'll save you a squat rack 💪", sentAt: '18:22' },
    ],
  },
  {
    id: 'thread-8',
    buddyId: '7',
    displayName: 'Scarlet Johnson',
    unreadCount: 1,
    lastActive: 'Yesterday',
    messages: [
      { id: '1', from: 'buddy', text: 'That new gym in Camden - want to try it Saturday?', sentAt: '20:01' },
      { id: '2', from: 'me', text: 'Sounds good, what time?', sentAt: '20:05' },
    ],
  },
  {
    id: 'thread-9',
    buddyId: '8',
    displayName: 'Makala Bali',
    unreadCount: 0,
    lastActive: '2d',
    messages: [
      { id: '1', from: 'buddy', text: 'Thanks for the spot last week!', sentAt: '11:30' },
      { id: '2', from: 'me', text: 'Anytime - same next week?', sentAt: '11:45' },
    ],
  },
  {
    id: 'thread-10',
    buddyId: '10',
    displayName: 'Natalie Cruz',
    unreadCount: 3,
    lastActive: '5m',
    messages: [
      { id: '1', from: 'buddy', text: 'Morning run or evening lift - your pick.', sentAt: '07:02' },
      { id: '2', from: 'me', text: 'Evening lift works better for me.', sentAt: '07:15' },
      { id: '3', from: 'buddy', text: 'Perfect. I’ll text you when I’m leaving work.', sentAt: '07:16' },
    ],
  },
];

export function getThreadById(threadId: string) {
  const thread = MOCK_THREADS.find((t) => t.id === threadId);
  if (!thread) return null;
  const buddy = byId(thread.buddyId) ?? null;
  if (!buddy) return null;
  return { ...thread, buddy };
}

export function getThreadsWithBuddy() {
  return MOCK_THREADS.map((thread) => {
    const buddy = byId(thread.buddyId);
    return {
      ...thread,
      buddy,
      lastMessage: thread.messages[thread.messages.length - 1]?.text ?? '',
    };
  }).filter((x) => !!x.buddy);
}
