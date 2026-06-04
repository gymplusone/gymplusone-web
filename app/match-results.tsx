import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import {
  SwipeableCard,
  type SwipeableCardHandle,
} from "@/components/SwipeableCard";
import {
  MATCH_ACTION_OVERLAP,
  MATCH_CARD_HEIGHT,
  MatchCardActions,
  MatchCardDefaultFooter,
  MatchCardScoreBadge,
  MatchCardShell,
} from "@/components/buddies/MatchCard";
import { PowerUpsellModal } from "@/components/buddies/PowerUpsellModal";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useApp } from "@/features/context/AppContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import type { MatchResult } from "@/types";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STACK_SIZE = 3;
const CARD_OFFSET = 10;
const STACK_SCALE_STEP = 0.04;

/** Prototype: replace with signed-in user photo from auth/profile API */
const USER_AVATAR_PLACEHOLDER = require("@/assets/images/gym/2149278038.jpg");

function getTimeGreeting(): { label: string; emoji: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { label: "Good morning", emoji: "🌤️" };
  if (h >= 12 && h < 17) return { label: "Good afternoon", emoji: "☀️" };
  if (h >= 17 && h < 22) return { label: "Good evening", emoji: "🌆" };
  return { label: "Hey there", emoji: "✨" };
}

function MatchResultCardBody({ match }: { match: MatchResult }) {
  const styles = useThemedStyles(createStyles);
  return (
    <>
      <MatchCardDefaultFooter profile={match.profile} showBio={false} />
      <Text style={styles.explanation}>{match.explanation}</Text>
      <View style={styles.insightRow}>
        <Text style={styles.insightLabel}>Best time</Text>
        <Text style={styles.insightValue}>{match.bestTimeToTrain}</Text>
      </View>
      <View style={styles.insightRow}>
        <Text style={styles.insightLabel}>Accountability</Text>
        <Text style={styles.insightValue}>{match.accountabilityStyle}</Text>
      </View>
    </>
  );
}

export default function MatchResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { topMatches, sendRequest, onboardingData } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [powerModalOpen, setPowerModalOpen] = useState(false);
  const swipeableRef = useRef<SwipeableCardHandle>(null);
  const firstName = onboardingData?.firstName?.trim() || "there";
  const greeting = useMemo(() => getTimeGreeting(), []);

  const visibleMatches = topMatches.slice(currentIndex);
  const topMatch = visibleMatches[0];
  const stackCards = visibleMatches.slice(0, STACK_SIZE);

  const handleSwipeRight = useCallback(() => {
    if (!topMatch) return;
    sendRequest(topMatch.profile.id);
    setCurrentIndex((i) => i + 1);
  }, [sendRequest, topMatch]);

  const handleSwipeLeft = useCallback(() => {
    setCurrentIndex((i) => i + 1);
  }, []);

  const triggerRejectSwipe = useCallback(() => {
    swipeableRef.current?.swipeLeft();
  }, []);

  const triggerApproveSwipe = useCallback(() => {
    swipeableRef.current?.swipeRight();
  }, []);

  const openPowerModal = useCallback(() => setPowerModalOpen(true), []);
  const closePowerModal = useCallback(() => setPowerModalOpen(false), []);

  const noMoreCards = visibleMatches.length === 0;

  const deckMinHeight =
    MATCH_CARD_HEIGHT + (STACK_SIZE - 1) * CARD_OFFSET + MATCH_ACTION_OVERLAP;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image source={USER_AVATAR_PLACEHOLDER} style={styles.userAvatar} />
          <View style={styles.headerTextCol}>
            <Text style={styles.helloLine}>Hello {firstName}</Text>
            <Text style={styles.greetingLine}>
              {greeting.label} {greeting.emoji}
            </Text>
          </View>
        </View>
        <Text style={styles.sectionHint}>
          Your top matches · Swipe right to connect, left to skip
        </Text>
      </View>

      <View style={styles.deckSection}>
        {noMoreCards ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              title="No more cards"
              subtitle="You've seen all your top matches. Enter the app to browse or find more plus ones."
              actionLabel="Go Home"
              onAction={() => router.replace("/(tabs)")}
            />
          </View>
        ) : (
          <View style={styles.deckCenterColumn}>
            <View style={[styles.deckBlock, { minHeight: deckMinHeight }]}>
              <View style={styles.stackContainer}>
                {[...stackCards].reverse().map((match, reverseIdx) => {
                  const stackPosition = stackCards.length - 1 - reverseIdx;
                  const isTop = stackPosition === 0;
                  const scale = 1 - STACK_SCALE_STEP * stackPosition;
                  const topOffset = CARD_OFFSET * stackPosition;

                  const cardContent = (
                    <MatchCardShell
                      profile={match.profile}
                      topEndAccessory={
                        <MatchCardScoreBadge score={match.score} />
                      }
                    >
                      <MatchResultCardBody match={match} />
                    </MatchCardShell>
                  );

                  return (
                    <View
                      key={match.profile.id}
                      style={[
                        styles.stackCard,
                        {
                          top: topOffset,
                          zIndex: stackCards.length - 1 - stackPosition,
                          transform: [{ scale }],
                        },
                      ]}
                      pointerEvents={isTop ? "auto" : "none"}
                    >
                      <SwipeableCard
                        ref={isTop ? swipeableRef : undefined}
                        enabled={isTop}
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                      >
                        {cardContent}
                      </SwipeableCard>
                    </View>
                  );
                })}
              </View>
              <MatchCardActions
                onReject={triggerRejectSwipe}
                onPower={openPowerModal}
                onApprove={triggerApproveSwipe}
              />
            </View>
          </View>
        )}
      </View>

      <View
        style={[styles.footer, { paddingBottom: insets.bottom - spacing.lg }]}
      >
        <Button
          title="Tap to Explore"
          onPress={() => router.replace("/(tabs)")}
          fullWidth
          variant="secondary"
          style={{ borderRadius: radius.full, paddingVertical: spacing.sm }}
        />
      </View>

      <PowerUpsellModal visible={powerModalOpen} onClose={closePowerModal} />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
  },
  headerTextCol: {
    flex: 1,
    marginLeft: spacing.md,
  },
  helloLine: {
    ...typography.subhead,
    color: colors.textSecondary,
  },
  greetingLine: {
    ...typography.title3,
    fontWeight: "700",
    color: colors.text,
    marginTop: 2,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  deckSection: {
    flex: 1,
    marginHorizontal: spacing.lg,
    minHeight: 0,
  },
  deckCenterColumn: {
    flex: 1,
    justifyContent: "center",
    minHeight: 0,
  },
  deckBlock: {
    position: "relative",
    alignSelf: "stretch",
  },
  stackContainer: {
    minHeight:
      MATCH_CARD_HEIGHT +
      (STACK_SIZE - 1) * CARD_OFFSET +
      MATCH_ACTION_OVERLAP,
    position: "relative",
    alignSelf: "stretch",
  },
  stackCard: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
    minHeight: 280,
  },
  explanation: {
    ...typography.callout,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xxs,
  },
  insightLabel: { ...typography.caption, color: "rgba(255,255,255,0.72)" },
  insightValue: { ...typography.subhead, color: colors.textOnPrimary },
  footer: { paddingHorizontal: spacing.lg },
  });
}
