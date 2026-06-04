import { Avatar } from "@/components/Avatar";
import { LampChargeIcon } from "@/components/icons/LampChargeIcon";
import { MatchIcon } from "@/components/icons/MatchIcon";
import { ProfileViewsIcon } from "@/components/icons/ProfileViewsIcon";
import { StickyNoteIcon } from "@/components/icons/StickyNoteIcon";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  formatNotificationListTime,
  getNotificationSections,
  MOCK_NOTIFICATIONS,
  type AppNotification,
  type NotificationSection,
} from "@/data/mockNotifications";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
  type SectionListRenderItem,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const sections = useMemo(
    () => getNotificationSections(MOCK_NOTIFICATIONS),
    [],
  );

  const renderItem: SectionListRenderItem<
    AppNotification,
    NotificationSection
  > = useCallback(
    ({ item }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityHint="Notification details coming soon"
        onPress={() => {}}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      >
        <View style={styles.rowMain}>
          {item.leadIcon === "match" ? (
            <View style={styles.leadIconWrap}>
              <MatchIcon color={colors.primary} size={22} />
            </View>
          ) : item.leadIcon === "lampCharge" ? (
            <View
              style={[
                styles.leadIconWrap,
                { backgroundColor: colors.notificationRecap + "28" },
              ]}
            >
              <LampChargeIcon color={colors.notificationRecap} size={22} />
            </View>
          ) : item.leadIcon === "restTip" ? (
            <View
              style={[
                styles.leadIconWrap,
                { backgroundColor: colors.notificationRestTip + "28" },
              ]}
            >
              <LampChargeIcon color={colors.notificationRestTip} size={22} />
            </View>
          ) : item.leadIcon === "calendarUpdate" ? (
            <View
              style={[
                styles.leadIconWrap,
                { backgroundColor: colors.notificationCalendar + "28" },
              ]}
            >
              <StickyNoteIcon color={colors.notificationCalendar} size={22} />
            </View>
          ) : item.leadIcon === "profileViews" ? (
            <View
              style={[
                styles.leadIconWrap,
                { backgroundColor: colors.notificationProfileViews + "28" },
              ]}
            >
              <ProfileViewsIcon
                color={colors.notificationProfileViews}
                size={22}
              />
            </View>
          ) : item.avatarInitial != null ? (
            <View style={styles.avatarLeadWrap}>
              <Avatar
                initial={item.avatarInitial}
                source={item.avatarImage}
                size="sm"
              />
              {item.avatarShowOnline ? (
                <View
                  style={styles.onlineBadge}
                  accessibilityLabel="Online now"
                />
              ) : null}
            </View>
          ) : !item.read ? (
            <View style={styles.unreadDot} />
          ) : (
            <View style={styles.readSpacer} />
          )}
          <View style={styles.rowText}>
            <Text
              style={[styles.rowTitle, !item.read && styles.rowTitleUnread]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={styles.rowBody} numberOfLines={2}>
              {item.body}
            </Text>
          </View>
        </View>
        <Text style={styles.time}>
          {formatNotificationListTime(item.createdAt)}
        </Text>
      </Pressable>
    ),
    [colors, styles],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: NotificationSection }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    [styles],
  );

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="Notifications"
        titleAlign="center"
        onBack={() => router.back()}
      />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      paddingBottom: 0,
    },
    sectionHeader: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xs,
    },
    sectionTitle: {
      ...typography.caption,
      fontWeight: "700",
      color: colors.textMuted,
      letterSpacing: 0.4,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
    },
    leadIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + "28",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarLeadWrap: {
      width: 40,
      height: 40,
      position: "relative",
    },
    onlineBadge: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: 11,
      height: 11,
      borderRadius: 6,
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.background,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    rowPressed: {
      opacity: 0.88,
    },
    rowMain: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      minWidth: 0,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginTop: 6,
    },
    readSpacer: {
      width: 8,
      height: 8,
      marginTop: 6,
    },
    rowText: {
      flex: 1,
      minWidth: 0,
      gap: spacing.xxs,
    },
    rowTitle: {
      ...typography.body,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    rowTitleUnread: {
      color: colors.text,
    },
    rowBody: {
      ...typography.caption,
      color: colors.textMuted,
      lineHeight: 18,
    },
    time: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 2,
      fontVariant: ["tabular-nums"],
    },
  });
}
