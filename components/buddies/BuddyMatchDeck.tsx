import { EmptyState } from "@/components/EmptyState";
import { Pills } from "@/components/Pills";
import {
  SwipeableCard,
  type SwipeableCardHandle,
} from "@/components/SwipeableCard";
import { BuddyProfileDetailsSheet } from "@/components/buddies/BuddyProfileDetailsSheet";
import {
  MATCH_ACTION_OVERLAP,
  MATCH_CARD_HEIGHT,
  MatchCardActions,
  MatchCardDefaultFooter,
  MatchCardShell,
} from "@/components/buddies/MatchCard";
import { PowerUpsellModal } from "@/components/buddies/PowerUpsellModal";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { MOCK_BUDDIES } from "@/data/mockBuddies";
import { areaOptions, fitnessGoalOptions } from "@/data/onboardingOptions";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { BlurView } from "expo-blur";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STACK_SIZE = 3;
const CARD_OFFSET = 10;
const STACK_SCALE_STEP = 0.04;

type BuddyMatchDeckProps = {
  title: string;
};

export function BuddyMatchDeck({ title }: BuddyMatchDeckProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
  const [area, setArea] = useState<string>("all");
  const [goal, setGoal] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [powerModalOpen, setPowerModalOpen] = useState(false);

  const filtered = useMemo(
    () =>
      MOCK_BUDDIES.filter((b) => {
        if (area !== "all" && b.area !== area) return false;
        if (goal !== "all" && b.fitnessGoal !== goal) return false;
        return true;
      }),
    [area, goal],
  );

  const hasFilters = area !== "all" || goal !== "all";
  const visibleBuddies = filtered.slice(currentIndex);
  const stackCards = visibleBuddies.slice(0, STACK_SIZE);
  const swipeableRef = useRef<SwipeableCardHandle>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [area, goal]);

  const handleSkip = () => {
    setCurrentIndex((i) => i + 1);
  };

  /** Approve: animate off only; advance deck. Profile opens via “View profile”, not verify. */
  const handleApproveSwipe = useCallback(() => {
    setCurrentIndex((i) => i + 1);
  }, []);

  const triggerRejectSwipe = useCallback(() => {
    swipeableRef.current?.swipeLeft();
  }, []);

  const triggerApproveSwipe = useCallback(() => {
    swipeableRef.current?.swipeRight();
  }, []);

  const openPowerModal = useCallback(() => {
    setPowerModalOpen(true);
  }, []);

  const closePowerModal = useCallback(() => {
    setPowerModalOpen(false);
  }, []);

  return (
    <View style={styles.container}>
      <BlurView
        style={[styles.fixedTopWrap, { paddingTop: insets.top + spacing.md }]}
        intensity={80}
        tint={isDark ? "dark" : "light"}
        onLayout={(e) => setFixedHeaderHeight(e.nativeEvent.layout.height)}
      >
        <Text style={styles.pageTitle}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          <Pills
            options={[
              { value: "all", label: "All" },
              ...areaOptions.slice(0, 5).map((a) => ({ value: a, label: a })),
            ]}
            value={area}
            onChange={setArea}
          />
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          <Pills
            options={[
              { value: "all", label: "All goals" },
              ...fitnessGoalOptions.map((o) => ({ value: o.value, label: o.label })),
            ]}
            value={goal}
            onChange={setGoal}
          />
        </ScrollView>
      </BlurView>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: fixedHeaderHeight + spacing.sm },
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {visibleBuddies.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              title={
                filtered.length === 0
                  ? "No plus ones match your filters"
                  : "No more cards"
              }
              subtitle={
                filtered.length === 0
                  ? "Try changing or clearing filters."
                  : "You swiped through all buddies for these filters."
              }
              actionLabel="Clear filters"
              onAction={() => {
                setArea("all");
                setGoal("all");
                setCurrentIndex(0);
              }}
            />
          </View>
        ) : (
          <>
            <View style={styles.stackContainer}>
              {[...stackCards].reverse().map((buddy, reverseIdx) => {
                const stackPosition = stackCards.length - 1 - reverseIdx;
                const isTop = stackPosition === 0;
                const scale = 1 - STACK_SCALE_STEP * stackPosition;
                const topOffset = CARD_OFFSET * stackPosition;
                const cardContent = (
                  <MatchCardShell profile={buddy}>
                    <MatchCardDefaultFooter profile={buddy} />
                  </MatchCardShell>
                );
                return (
                  <View
                    key={buddy.id}
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
                      onSwipeLeft={handleSkip}
                      onSwipeRight={handleApproveSwipe}
                    >
                      {cardContent}
                    </SwipeableCard>
                  </View>
                );
              })}
              {visibleBuddies[0] ? (
                <MatchCardActions
                  onReject={triggerRejectSwipe}
                  onPower={openPowerModal}
                  onApprove={triggerApproveSwipe}
                />
              ) : null}
            </View>
            {visibleBuddies[0] ? (
              <BuddyProfileDetailsSheet buddy={visibleBuddies[0]} />
            ) : null}
          </>
        )}
      </ScrollView>

      <PowerUpsellModal visible={powerModalOpen} onClose={closePowerModal} />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    fixedTopWrap: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
      overflow: "hidden",
    },
    pageTitle: {
      ...typography.title1,
      color: colors.text,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.sm,
    },
    filtersScroll: {
      // marginBottom: spacing.xs,
      flexGrow: 0,
    },
    filtersContent: {
      flexDirection: "row",
      alignItems: "center",
      flexGrow: 0,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xs,
      gap: spacing.xs,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: spacing.lg, paddingTop: spacing.sm, flexGrow: 1 },
    emptyWrap: { minHeight: 220, justifyContent: "center" },
    stackContainer: {
      /** Card + stack offsets + action pill overhang below card (no flex:1 so details sheet scrolls below) */
      minHeight:
        MATCH_CARD_HEIGHT +
        (STACK_SIZE - 1) * CARD_OFFSET +
        MATCH_ACTION_OVERLAP,
      position: "relative",
      marginBottom: -spacing.xxl,
      alignSelf: "stretch",
    },
    stackCard: {
      position: "absolute",
      left: 0,
      right: 0,
    },
  });
}
