import { EmptyState } from "@/components/EmptyState";
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
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Defs, RadialGradient, Stop } from "react-native-svg";

const STACK_SIZE = 3;
const CARD_OFFSET = 10;
const STACK_SCALE_STEP = 0.04;

type BuddyMatchDeckProps = {
  title: string;
};

const jennieImg = require("@/assets/jennie.png");

function getTimeGreeting(): { label: string; emoji: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { label: "Good Morning", emoji: "🌤️" };
  if (h >= 12 && h < 17) return { label: "Good Afternoon", emoji: "☀️" };
  if (h >= 17 && h < 22) return { label: "Good Evening", emoji: "🌆" };
  return { label: "Hey there", emoji: "✨" };
}

// Custom Filter Icon Component using your precise SVG source
function FilterIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 30 30" fill="none">
      <Path
        d="M26.6254 9.47461H19.6504C19.1629 9.47461 18.7754 9.08711 18.7754 8.59961C18.7754 8.11211 19.1629 7.72461 19.6504 7.72461H26.6254C27.1129 7.72461 27.5004 8.11211 27.5004 8.59961C27.5004 9.08711 27.1129 9.47461 26.6254 9.47461Z"
        fill="url(#paint0_radial_2290_9291)"
      />
      <Path
        d="M8.025 9.47461H3.375C2.8875 9.47461 2.5 9.08711 2.5 8.59961C2.5 8.11211 2.8875 7.72461 3.375 7.72461H8.025C8.5125 7.72461 8.9 8.11211 8.9 8.59961C8.9 9.08711 8.5 9.47461 8.025 9.47461Z"
        fill="url(#paint1_radial_2290_9291)"
      />
      <Path
        d="M12.6748 13.5371C15.4017 13.5371 17.6123 11.3265 17.6123 8.59961C17.6123 5.8727 15.4017 3.66211 12.6748 3.66211C9.9479 3.66211 7.7373 5.8727 7.7373 8.59961C7.7373 11.3265 9.9479 13.5371 12.6748 13.5371Z"
        fill="url(#paint2_radial_2290_9291)"
      />
      <Path
        d="M26.6246 22.2627H21.9746C21.4871 22.2627 21.0996 21.8752 21.0996 21.3877C21.0996 20.9002 21.4871 20.5127 21.9746 20.5127H26.6246C27.1121 20.5127 27.4996 20.9002 27.4996 21.3877C27.4996 21.8752 27.1121 22.2627 26.6246 22.2627Z"
        fill="url(#paint3_radial_2290_9291)"
      />
      <Path
        d="M10.35 22.2627H3.375C2.8875 22.2627 2.5 21.8752 2.5 21.3877C2.5 20.9002 2.8875 20.5127 3.375 20.5127H10.35C10.8375 20.5127 11.225 20.9002 11.225 21.3877C11.225 21.8752 10.825 22.2627 10.35 22.2627Z"
        fill="url(#paint4_radial_2290_9291)"
      />
      <Path
        d="M17.3252 26.3379C20.0521 26.3379 22.2627 24.1273 22.2627 21.4004C22.2627 18.6735 20.0521 16.4629 17.3252 16.4629C14.5983 16.4629 12.3877 18.6735 12.3877 21.4004C12.3877 24.1273 14.5983 26.3379 17.3252 26.3379Z"
        fill="#0001FF"
      />
      <Defs>
        <RadialGradient
          id="paint0_radial_2290_9291"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-7.65974 1.70494 -8.50032 -0.327033 27.1859 7.74432)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#0001FF" />
          <Stop offset="0.333333" stopColor="#1819CB" />
          <Stop offset="0.763585" stopColor="#050269" />
          <Stop offset="1" stopColor="#020050" />
        </RadialGradient>
        <RadialGradient
          id="paint1_radial_2290_9291"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-5.6186 1.70494 -6.23519 -0.327033 8.6693 7.74432)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#0001FF" />
          <Stop offset="0.333333" stopColor="#1819CB" />
          <Stop offset="0.763585" stopColor="#050269" />
          <Stop offset="1" stopColor="#020050" />
        </RadialGradient>
        <RadialGradient
          id="paint2_radial_2290_9291"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-8.66933 9.62071 -9.62071 -1.8454 17.2563 3.77336)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#0001FF" />
          <Stop offset="0.333333" stopColor="#1819CB" />
          <Stop offset="0.763585" stopColor="#050269" />
          <Stop offset="1" stopColor="#020050" />
        </RadialGradient>
        <RadialGradient
          id="paint3_radial_2290_9291"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-5.6186 1.70494 -6.23519 -0.327033 27.2689 20.5324)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#0001FF" />
          <Stop offset="0.333333" stopColor="#1819CB" />
          <Stop offset="0.763585" stopColor="#050269" />
          <Stop offset="1" stopColor="#020050" />
        </RadialGradient>
        <RadialGradient
          id="paint4_radial_2290_9291"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(-7.65974 1.70494 -8.50032 -0.327033 10.9105 20.5324)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#0001FF" />
          <Stop offset="0.333333" stopColor="#1819CB" />
          <Stop offset="0.763585" stopColor="#050269" />
          <Stop offset="1" stopColor="#020050" />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}

export function BuddyMatchDeck({ title }: BuddyMatchDeckProps) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [powerModalOpen, setPowerModalOpen] = useState<boolean>(false);
  const [spotlightModalOpen, setSpotlightModalOpen] = useState<boolean>(false);
  const [superModalOpen, setSuperModalOpen] = useState<boolean>(false);
  const visibleBuddies = MOCK_BUDDIES.slice(currentIndex);
  const stackCards = visibleBuddies.slice(0, STACK_SIZE);
  const swipeableRef = useRef<SwipeableCardHandle>(null);
  const greeting = getTimeGreeting();

  const handleSkip = () => {
    setCurrentIndex((i: number) => i + 1);
  };

  const handleApproveSwipe = useCallback(() => {
    setCurrentIndex((i: number) => i + 1);
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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.sm },
          { paddingBottom: insets.bottom + spacing.xxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          {/* Brand */}
          <View className="items-center font-author mt-4 mb-2">
            <Text className="text-black text-4xl italic font-black">Gym+1</Text>
            <Text className="text-black font-[375] text-md italic">Match your workout vibe</Text>
          </View>

          {/* Profile Section */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Image source={jennieImg} style={styles.userAvatar} />
              <View style={styles.headerTextCol}>
                <Text style={styles.helloLine}>Hello, Jennie</Text>
                <Text style={styles.greetingLine}>
                  {greeting.label} {greeting.emoji}
                </Text>
                <View style={styles.headerBadgeRow}>
                  <Pressable
                    onPress={() => setSpotlightModalOpen(true)}
                    style={[styles.headerBadge, { backgroundColor: "#0001FF" }]}
                  >
                    <Text style={[styles.headerBadgeText, { color: "#fff" }]}>Spotlight</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSuperModalOpen(true)}
                    style={[styles.headerBadge, { backgroundColor: "#0001FF" }]}
                  >
                    <Text style={[styles.headerBadgeText, { color: "#fff" }]}>Super +1</Text>
                  </Pressable>
                </View>
              </View>
            </View>
            
            <View style={styles.headerRight}>
              <Pressable style={styles.headerIconBtn}>
                <View style={styles.headerIconWrap}>
                  <Ionicons name="notifications" size={18} color="#fff" />
                  <View style={styles.notificationBadge} />
                </View>
              </Pressable>
              <Pressable style={styles.headerIconBtn}>
                <Ionicons name="settings-sharp" size={18} color="#fff" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Dynamic Context Title display within layout stream */}
        <View className="pb-4">
          <Text style={styles.pageTitle}>{title}</Text>
        </View>

        {visibleBuddies.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              title="No more cards"
              subtitle="You swiped through all buddies."
              actionLabel="Restart"
              onAction={() => {
                setCurrentIndex(0);
              }}
            />
          </View>
        ) : (
          <>
            {/* Filter Toolbar Section built directly above the stack view */}
            <View style={styles.filterToolbar}>
              <Pressable style={styles.filterBtn}>
                <FilterIcon />
              </Pressable>
            </View>

            <View style={styles.stackContainer}>
              {[...stackCards].reverse().map((buddy, reverseIdx) => {
                const stackPosition = stackCards.length - 1 - reverseIdx;
                const isTop = stackPosition === 0;
                const scale = 1 - STACK_SCALE_STEP * stackPosition;
                const topOffset = CARD_OFFSET * stackPosition;
                
                const cardContent = (
                  <View style={{ position: "relative", flex: 1 }}>
                    <MatchCardShell profile={buddy}>
                      <MatchCardDefaultFooter profile={buddy} />
                    </MatchCardShell>
                    
                    {/* Absolute positioned +1 badge layout variant mapped over deck assets */}
                    <View style={styles.plusOneBadge}>
                      <Text style={styles.plusOneText}>+1</Text>
                    </View>
                  </View>
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
    container: { flex: 1, backgroundColor: "#fff" },
    centerContainer: { alignItems: "center", justifyContent: "center" },

    headerContainer: {
      paddingHorizontal: 0,
      paddingBottom: 16,
      backgroundColor: "#fff",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 4,
      paddingTop: 14,
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    userAvatar: { width: 50, height: 50, borderRadius: 25 },
    headerTextCol: { marginLeft: 12 },
    helloLine: {
      fontSize: 12,
      color: "#888",
      fontFamily: "manrope",
    },
    greetingLine: {
      fontSize: 18,
      fontWeight: "800",
      color: "#000",
      fontFamily: "manrope",
    },
    headerBadgeRow: { flexDirection: "row", gap: 8, marginTop: 4 },
    headerBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12 },
    headerBadgeText: { fontSize: 11, fontWeight: "400" },
    headerRight: { flexDirection: "row", gap: 12 },
    headerIconBtn: {
      padding: 4,
      backgroundColor: "#000",
      borderRadius: 12,
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    headerIconWrap: { position: "relative" },
    notificationBadge: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "red",
      borderWidth: 1,
      borderColor: "#000",
    },
    pageTitle: {
      ...typography.title1,
      color: "#000",
      paddingHorizontal: spacing.sm,
      marginTop: spacing.sm,
    },
    
    filterToolbar: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: spacing.sm,
      marginBottom: spacing.sm,
      width: "100%",
    },
    filterBtn: {
      padding: 6,
      alignItems: "center",
      justifyContent: "center",
    },

    plusOneBadge: {
      position: "absolute",
      top: 14,
      right: 14,
      backgroundColor: "#0001FF",
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    plusOneText: {
      color: "#fff",
      fontSize: 13,
      fontWeight: "800",
    },

    scroll: { flex: 1, backgroundColor: "#fff" },
    scrollContent: { padding: spacing.lg, flexGrow: 1 },
    emptyWrap: { minHeight: 220, justifyContent: "center", width: 100 },
    stackContainer: {
      minHeight:
        MATCH_CARD_HEIGHT +
        (STACK_SIZE - 1) * CARD_OFFSET +
        MATCH_ACTION_OVERLAP,
      position: "relative",
      marginBottom: spacing.md,
      alignSelf: "stretch",
    },
    stackCard: {
      position: "absolute",
      left: 0,
      right: 0,
    },
  });
}