import { Avatar } from "@/components/Avatar";
import { Card } from "@/components/Card";
import { FeedPostRow } from "@/components/feed/FeedPostRow";
import { HomeComposer } from "@/components/feed/HomeComposer";
import { NotificationIcon } from "@/components/icons/NotificationIcon";
import { SettingIcon } from "@/components/icons/SettingIcon";
import type { ThemeColors } from "@/constants/Theme";
import {
  card,
  iconButton,
  radius,
  spacing,
  typography,
} from "@/constants/Theme";
import { labels } from "@/constants/labels";
import { useApp } from "@/features/context/AppContext";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import type { FeedPost } from "@/types";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Prototype: replace with signed-in user profile image when available. */
const USER_AVATAR_PLACEHOLDER = require("@/assets/images/gym/2149278038.jpg");

function getTimeGreeting(): { label: string; emoji: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { label: "Good morning", emoji: "🌤️" };
  if (h >= 12 && h < 17) return { label: "Good afternoon", emoji: "☀️" };
  if (h >= 17 && h < 22) return { label: "Good evening", emoji: "🌆" };
  return { label: "Hey there", emoji: "✨" };
}

function weeklyTargetFromFrequency(freq: string): string {
  if (freq === "1_2") return "1–2 completed gym sessions";
  if (freq === "3_4") return "3 completed gym sessions";
  return "4+ completed gym sessions";
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles((themeColors) => createStyles(themeColors, isDark), [isDark]);
  const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
  const { onboardingData, topMatches, feedPosts, addFeedPost } = useApp();
  const notificationCount = 3;
  const name = onboardingData?.firstName ?? "there";
  const avatarInitial = name.trim().charAt(0).toUpperCase() || "T";
  const greeting = getTimeGreeting();
  const topMatch = topMatches[0];
  const preferredTimeLabel = onboardingData
    ? (labels.preferredTime[onboardingData.preferredTime]?.toLowerCase() ??
      "evening")
    : "evening";
  const weeklyTarget = onboardingData
    ? weeklyTargetFromFrequency(onboardingData.gymFrequency)
    : "2 completed gym sessions";
  const topScore = topMatch?.score ?? 0;
  const goalLabel = onboardingData
    ? labels.fitnessGoal[onboardingData.fitnessGoal]
    : "General fitness";
  const confidenceLabel = onboardingData
    ? labels.confidenceLevel[onboardingData.confidenceLevel]
    : "Medium";

  const renderPost: ListRenderItem<FeedPost> = useCallback(
    ({ item, index }) => (
      <FeedPostRow
        post={item}
        showDivider={index < feedPosts.length - 1}
        onPressPost={() => router.push(`/feed-post/${item.id}`)}
      />
    ),
    [feedPosts.length, router],
  );

  const FixedHeader = (
    <View style={styles.fixedHeader}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Image source={USER_AVATAR_PLACEHOLDER} style={styles.userAvatar} />
          <View style={styles.headerTextCol}>
            <Text style={styles.helloLine}>Hello {name}</Text>
            <Text style={styles.greetingLine}>
              {greeting.label} {greeting.emoji}
            </Text>
            <View style={styles.headerBadgeRow}>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>Spotlight</Text>
              </View>
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>Super +1</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            onPress={() => router.push("/notifications")}
            hitSlop={iconButton.hitSlop}
            style={({ pressed }) => [
              styles.headerIconBtn,
              pressed && styles.headerIconPressed,
            ]}
          >
            <View style={styles.headerIconWrap}>
              <NotificationIcon color={colors.text} size={22} />
              {notificationCount > 0 ? (
                <View style={styles.notificationBadge} pointerEvents="none">
                  <Text style={styles.notificationBadgeText} numberOfLines={1}>
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Text>
                </View>
              ) : null}
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => router.push("/settings")}
            hitSlop={iconButton.hitSlop}
            style={({ pressed }) => [
              styles.headerIconBtn,
              pressed && styles.headerIconPressed,
            ]}
          >
            <SettingIcon color={colors.text} size={22} />
          </Pressable>
        </View>
      </View>
      <Text style={styles.sectionHint}>
        {/* Your community feed,  */}
        See what your gym circle is up to · Share a win below
      </Text>
      <HomeComposer onSubmit={addFeedPost} />
    </View>
  );

  const ListFooter = (
    <View style={styles.footerBlock}>
      <View style={styles.statRow}>
        <View style={styles.statChip}>
          <Text style={styles.statLabel}>Top match</Text>
          <Text style={styles.statValue}>{topScore}%</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statLabel}>Goal</Text>
          <Text style={styles.statValueSmall}>{goalLabel}</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={styles.statLabel}>Confidence</Text>
          <Text style={styles.statValueSmall}>{confidenceLabel}</Text>
        </View>
      </View>

      {topMatch ? (
        <Card
          onPress={() => router.push(`/match/${topMatch.profile.id}`)}
          style={styles.primaryCard}
        >
          <Text style={styles.cardLabel}>Your top match</Text>
          <View style={styles.matchRow}>
            <Avatar initial={topMatch.profile.avatarPlaceholder} size="sm" />
            <View style={styles.matchMeta}>
              <Text style={styles.matchName}>
                {topMatch.profile.name} · {topMatch.score}% match
              </Text>
              <Text style={styles.matchDetail}>
                {labels.fitnessGoal[topMatch.profile.fitnessGoal]} ·{" "}
                {topMatch.profile.area}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/messages")}
              style={({ pressed }) => [
                styles.chatPill,
                pressed && styles.chatPillPressed,
              ]}
            >
              <Text style={styles.chatPillText}>Chat</Text>
            </Pressable>
          </View>
          <View style={styles.ctaRow}>
            <Text style={styles.cardCta}>View profile →</Text>
            <Text style={styles.cardHint}>
              Best time: {topMatch.bestTimeToTrain}
            </Text>
          </View>
        </Card>
      ) : null}

      <View style={styles.quickActionRow}>
        <Pressable
          onPress={() => router.push("/match-results")}
          style={({ pressed }) => [
            styles.quickAction,
            pressed && styles.quickActionPressed,
          ]}
        >
          <Text style={styles.quickActionTitle}>Find +1</Text>
          <Text style={styles.quickActionText}>Swipe matches</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/(tabs)/plus-one")}
          style={({ pressed }) => [
            styles.quickAction,
            pressed && styles.quickActionPressed,
          ]}
        >
          <Text style={styles.quickActionTitle}>+1</Text>
          <Text style={styles.quickActionText}>Discover buddies</Text>
        </Pressable>
      </View>

      <Card>
        <Text style={styles.cardTitle}>This week</Text>
        <Text style={styles.cardBody}>
          {weeklyTarget}. Your strongest window is {preferredTimeLabel}. Plan
          one session in the next 48 hours.
        </Text>
      </Card>

      <View style={styles.footer}>
        <Pressable onPress={() => router.push("/match-results")} hitSlop={8}>
          <Text style={styles.linkText}>See all matches</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.keyboardRoot}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <BlurView
        style={[styles.fixedTopWrap, { paddingTop: insets.top + spacing.md }]}
        intensity={80}
        tint={isDark ? "dark" : "light"}
        onLayout={(e) => setFixedHeaderHeight(e.nativeEvent.layout.height)}
      >
        {FixedHeader}
      </BlurView>
      <FlatList
        style={styles.container}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: fixedHeaderHeight },
        ]}
        data={feedPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        // ListFooterComponent={ListFooter}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors, isDark: boolean) {
  return StyleSheet.create({
  keyboardRoot: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  fixedTopWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
    overflow: "hidden",
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  fixedHeader: { 
    // marginBottom: spacing.sm 
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },
  userAvatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  headerTextCol: {
    flex: 1,
    marginLeft: spacing.md,
    minWidth: 0,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginLeft: spacing.sm,
    flexShrink: 0,
  },
  headerIconBtn: {
    padding: iconButton.padding,
  },
  headerIconPressed: { opacity: 0.7 },
  headerIconWrap: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -6,
    right: -5,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: colors.error,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    ...typography.caption,
    fontSize: 10,
    lineHeight: 12,
    color: colors.textOnPrimary,
    fontWeight: "700",
  },
  helloLine: {
    ...typography.subhead,
    color: colors.textSecondary,
  },
  greetingLine: {
    ...typography.title3,
    fontWeight: "700",
    color: colors.text,
    // marginTop: 2,
  },
  headerBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  headerBadge: {
    backgroundColor: isDark ? colors.primary + "33" : colors.surfaceElevated,
    borderWidth: 1,
    borderColor: isDark ? colors.primary + "66" : colors.border,
    borderRadius: radius.full,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs,
  },
  headerBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  footerBlock: { paddingTop: spacing.lg },
  statRow: { flexDirection: "row", gap: spacing.xs, marginBottom: spacing.md },
  statChip: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  statValue: { ...typography.title3, color: colors.text },
  statValueSmall: { ...typography.subhead, color: colors.text },
  primaryCard: { marginBottom: card.marginBottom },
  cardLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xxs,
  },
  cardTitle: {
    ...typography.title3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardBody: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  matchMeta: { marginLeft: spacing.md, flex: 1 },
  matchName: { ...typography.bodyBold, color: colors.text },
  matchDetail: { ...typography.subhead, color: colors.textSecondary },
  chatPill: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
  },
  chatPillPressed: { opacity: 0.86 },
  chatPillText: {
    ...typography.subhead,
    color: colors.textOnPrimary,
    fontWeight: "700",
  },
  ctaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  cardCta: { ...typography.subhead, color: colors.primary },
  cardHint: { ...typography.caption, color: colors.textMuted },
  quickActionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickAction: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  quickActionPressed: { opacity: 0.9 },
  quickActionTitle: { ...typography.bodyBold, color: colors.text },
  quickActionText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  footer: { marginTop: spacing.md, paddingVertical: spacing.xs },
  linkText: { ...typography.body, color: colors.primary },
  });
}
