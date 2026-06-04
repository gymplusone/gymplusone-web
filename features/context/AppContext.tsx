/**
 * App-wide state – onboarding, matches, sent requests
 * TODO: Replace with auth + API when backend exists. Persist hasCompletedOnboarding
 * and onboardingData via secure storage or API; replace topMatches with API fetch.
 */

import { INITIAL_FEED_POSTS } from "@/data/mockFeed";
import type {
    FeedComment,
    FeedPost,
    MatchResult,
    OnboardingData,
} from "@/types";
import { getTopMatches } from "@/utils/compatibility";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

const SWITCH_ACCOUNT_STORAGE_KEY = "@gymplusone/switch_account_enabled";

type AppContextValue = {
  hasCompletedOnboarding: boolean;
  onboardingData: OnboardingData | null;
  topMatches: MatchResult[];
  sentRequestIds: string[];
  feedPosts: FeedPost[];
  feedCommentsByPost: Record<string, FeedComment[]>;
  completeOnboarding: (data: OnboardingData) => void;
  sendRequest: (buddyId: string) => void;
  hasSentRequest: (buddyId: string) => boolean;
  addFeedPost: (body: string, imageUri?: string) => void;
  addFeedComment: (
    postId: string,
    text: string,
    replyToHandle?: string,
  ) => void;
  /** Demo: when true, Calendar tab shows as “Analytics” (coach / second account UX). */
  switchAccountEnabled: boolean;
  setSwitchAccountEnabled: (value: boolean) => void;
  /** False until persisted switch-account flag is read (avoids wrong tab on cold start). */
  switchAccountHydrated: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

function seededCommentsForPost(post: FeedPost): FeedComment[] {
  const body = post.body.trim();
  if (post.commentsCount <= 0) return [];

  const templates = [
    {
      name: "Casey",
      handle: "casey_fit",
      text: body.length > 0 ? "Love this. Keep going 🔥" : "Nice one 👏",
      authorVerified: true,
    },
    {
      name: "Morgan",
      handle: "morgan_moves",
      text: "What split are you running this week?",
      authorPlusOneBadge: true,
    },
    {
      name: "Jamie",
      handle: "jamie_lifts",
      text: "Solid work. Keep stacking reps 💪",
      authorLifterBadge: true,
    },
    {
      name: "Avery",
      handle: "avery_active",
      text: "This is motivating me to train today.",
      authorPlusOneBadge: true,
    },
  ] as const;

  /** Stagger replies so each shows a distinct relative time (oldest first in list). */
  const staggerMs = 22 * 60 * 1000;

  return Array.from({ length: post.commentsCount }, (_, i) => {
    const t = templates[i % templates.length];
    const orderFromOldest = i;
    const createdAt =
      Date.now() -
      (post.commentsCount - orderFromOldest) * staggerMs -
      orderFromOldest * 90_000;
    return {
      id: `${post.id}-c${i + 1}`,
      postId: post.id,
      name: t.name,
      handle: t.handle,
      authorVerified: "authorVerified" in t ? t.authorVerified : undefined,
      authorLifterBadge: "authorLifterBadge" in t ? t.authorLifterBadge : undefined,
      authorPlusOneBadge:
        "authorPlusOneBadge" in t ? t.authorPlusOneBadge : undefined,
      text: t.text,
      createdAt,
    };
  });
}

function seedCommentsMap(posts: FeedPost[]): Record<string, FeedComment[]> {
  const out: Record<string, FeedComment[]> = {};
  posts.forEach((p) => {
    out[p.id] = seededCommentsForPost(p);
  });
  return out;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(
    null,
  );
  const [topMatches, setTopMatches] = useState<MatchResult[]>([]);
  const [sentRequestIds, setSentRequestIds] = useState<string[]>([]);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(() => [
    ...INITIAL_FEED_POSTS,
  ]);
  const [feedCommentsByPost, setFeedCommentsByPost] = useState<
    Record<string, FeedComment[]>
  >(() => seedCommentsMap(INITIAL_FEED_POSTS));
  const [switchAccountEnabled, setSwitchAccountEnabledState] = useState(false);
  const [switchAccountHydrated, setSwitchAccountHydrated] = useState(false);

  useLayoutEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(SWITCH_ACCOUNT_STORAGE_KEY);
        if (!cancelled && stored === "true") {
          setSwitchAccountEnabledState(true);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setSwitchAccountHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setSwitchAccountEnabled = useCallback((value: boolean) => {
    setSwitchAccountEnabledState(value);
    void AsyncStorage.setItem(
      SWITCH_ACCOUNT_STORAGE_KEY,
      value ? "true" : "false",
    );
  }, []);

  const completeOnboarding = useCallback((data: OnboardingData) => {
    setOnboardingData(data);
    setTopMatches(getTopMatches(data, 3));
    setHasCompletedOnboarding(true);
  }, []);

  const sendRequest = useCallback((buddyId: string) => {
    setSentRequestIds((prev) =>
      prev.includes(buddyId) ? prev : [...prev, buddyId],
    );
  }, []);

  const hasSentRequest = useCallback(
    (buddyId: string) => sentRequestIds.includes(buddyId),
    [sentRequestIds],
  );

  const addFeedPost = useCallback(
    (body: string, imageUri?: string) => {
      const trimmed = body.trim();
      if (!trimmed && !imageUri) return;
      const first = onboardingData?.firstName?.trim() || "You";
      const handleBase =
        first
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "")
          .toLowerCase() || "you";
      const post: FeedPost = {
        id: `local-${Date.now()}`,
        authorName: first,
        authorHandle: `${handleBase}_gym`,
        authorInitial: first.charAt(0).toUpperCase(),
        body: trimmed,
        createdAt: Date.now(),
        likesCount: 0,
        commentsCount: 0,
        isFromCurrentUser: true,
        ...(imageUri ? { image: { uri: imageUri } } : {}),
      };
      setFeedPosts((prev) => [post, ...prev]);
      setFeedCommentsByPost((prev) => ({ ...prev, [post.id]: [] }));
    },
    [onboardingData?.firstName],
  );

  const addFeedComment = useCallback(
    (postId: string, text: string, replyToHandle?: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const first = onboardingData?.firstName?.trim() || "You";
      const handleBase =
        first
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "")
          .toLowerCase() || "you";
      const commentText = replyToHandle
        ? `@${replyToHandle} ${trimmed}`
        : trimmed;
      const comment: FeedComment = {
        id: `${postId}-c-${Date.now()}`,
        postId,
        name: first,
        handle: `${handleBase}_gym`,
        authorPlusOneBadge: true,
        text: commentText,
        createdAt: Date.now(),
      };

      let nextCount = 0;
      setFeedCommentsByPost((prev) => {
        const current = prev[postId] ?? [];
        const nextForPost = [...current, comment];
        nextCount = nextForPost.length;
        return { ...prev, [postId]: nextForPost };
      });

      setFeedPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, commentsCount: nextCount } : p,
        ),
      );
    },
    [onboardingData?.firstName],
  );

  const value: AppContextValue = {
    hasCompletedOnboarding,
    onboardingData,
    topMatches,
    sentRequestIds,
    feedPosts,
    feedCommentsByPost,
    completeOnboarding,
    sendRequest,
    hasSentRequest,
    addFeedPost,
    addFeedComment,
    switchAccountEnabled,
    setSwitchAccountEnabled,
    switchAccountHydrated,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
