import {
  CalendarPickerModal,
  getCalendarPickerPanelLayout,
  startOfCalendarDay,
  startOfCalendarMonth,
} from "@/components/events/CalendarPickerModal";
import { CalendarTabIcon } from "@/components/icons/CalendarTabIcon";
import { HeaderBackButton } from "@/components/layout/HeaderBackButton";
import type { ThemeColors } from "@/constants/Theme";
import { iconButton, radius, spacing, typography } from "@/constants/Theme";
import { CORE_MOCK_PEOPLE } from "@/data/mockPeople";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_SIDE = 42;
const MOCK_SESSIONS = [
  {
    id: "s1",
    name: CORE_MOCK_PEOPLE.jordan.name,
    date: "2026-12-24",
    time: "09:00",
    type: "calendar" as const,
    status: "confirmed" as const,
  },
  {
    id: "s2",
    name: CORE_MOCK_PEOPLE.sam.name,
    date: "2026-12-24",
    time: "11:00",
    type: "calendar" as const,
    status: "confirmed" as const,
  },
  {
    id: "s3",
    name: CORE_MOCK_PEOPLE.alex.name,
    date: "2026-12-24",
    time: "14:00",
    type: "video" as const,
    status: "pending" as const,
  },
  {
    id: "s4",
    name: CORE_MOCK_PEOPLE.riley.name,
    date: "2026-12-25",
    time: "10:00",
    type: "calendar" as const,
    status: "confirmed" as const,
  },
];

const WEEKLY_RECAP = {
  sessions: 12,
  hours: 18.5,
  revenueCents: 102_000,
};

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

export default function SessionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { top: panelTop, width: panelWidth } =
    getCalendarPickerPanelLayout(insets.top);

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() =>
    startOfCalendarMonth(startOfCalendarDay(new Date())),
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    startOfCalendarDay(new Date()),
  );

  const openCalendar = () => {
    setCalendarMonth(startOfCalendarMonth(selectedDate));
    setCalendarOpen(true);
  };
  const closeCalendar = useCallback(() => setCalendarOpen(false), []);

  const dateLabel = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.screen}>
      <View
        style={[styles.headerWrap, { paddingTop: insets.top + spacing.md }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerSide}>
            <HeaderBackButton onPress={() => router.back()} />
          </View>
          <Text style={styles.title} numberOfLines={1}>
            Sessions
          </Text>
          <View style={[styles.headerSide, styles.headerSideEnd]}>
            <Pressable
              hitSlop={iconButton.hitSlop}
              style={({ pressed }) => [
                styles.headerIconBtn,
                pressed && styles.headerIconPressed,
              ]}
              onPress={openCalendar}
              accessibilityLabel="Show calendar"
              accessibilityState={{ expanded: calendarOpen }}
            >
              <CalendarTabIcon color={colors.text} size={26} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Select a date to view and plan sessions.
        </Text>
      </View>

      <CalendarPickerModal
        visible={calendarOpen}
        onClose={closeCalendar}
        panelTop={panelTop}
        panelWidth={panelWidth}
        monthCursor={calendarMonth}
        selectedDate={selectedDate}
        onChangeMonth={setCalendarMonth}
        onSelectDay={setSelectedDate}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>{dateLabel}</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No sessions for this date yet</Text>
          <Text style={styles.emptyBody}>
            Book or log sessions for the selected day to populate this list.
          </Text>
        </View>

        <View style={styles.list}>
          {MOCK_SESSIONS.map((item) => {
            const isConfirmed = item.status === "confirmed";
            const isCalendar = item.type === "calendar";
            const iconWrapStyle = isCalendar
              ? styles.iconWrapCalendar
              : styles.iconWrapVideo;
            return (
              <View key={item.id} style={styles.sessionCard}>
                <View style={[styles.sessionIconWrap, iconWrapStyle]}>
                  <Ionicons
                    name={isCalendar ? "calendar-outline" : "videocam-outline"}
                    size={22}
                    color={isCalendar ? colors.success : colors.notificationRecap}
                  />
                </View>

                <View style={styles.sessionBody}>
                  <Text style={styles.sessionName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.sessionMeta}>
                    {item.date} {item.time}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    isConfirmed ? styles.statusConfirmed : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isConfirmed
                        ? styles.statusTextConfirmed
                        : styles.statusTextPending,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.weekCard}>
          <Text style={styles.weekTitle}>This Week</Text>
          <View style={styles.weekStatsRow}>
            <View style={styles.weekStatCol}>
              <Text style={styles.weekStatValue}>{WEEKLY_RECAP.sessions}</Text>
              <Text style={styles.weekStatLabel}>Sessions</Text>
            </View>
            <View style={styles.weekStatCol}>
              <Text style={styles.weekStatValue}>{WEEKLY_RECAP.hours}</Text>
              <Text style={styles.weekStatLabel}>Hours</Text>
            </View>
            <View style={styles.weekStatCol}>
              <Text style={[styles.weekStatValue, styles.weekRevenue]}>
                {formatMoney(WEEKLY_RECAP.revenueCents)}
              </Text>
              <Text style={styles.weekStatLabel}>Revenue</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerWrap: {
      paddingHorizontal: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
      paddingBottom: spacing.md,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    headerSide: {
      width: HEADER_SIDE,
      justifyContent: "flex-start",
    },
    headerSideEnd: {
      alignItems: "flex-end",
    },
    title: {
      ...typography.title1,
      color: colors.text,
      flex: 1,
      textAlign: "center",
    },
    headerIconBtn: {
      padding: iconButton.padding,
    },
    headerIconPressed: { opacity: 0.7 },
    subtitle: {
      ...typography.subhead,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      gap: spacing.md,
    },
    sectionLabel: {
      ...typography.subhead,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    list: {
      gap: spacing.md,
    },
    emptyCard: {
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.md,
      gap: spacing.xs,
    },
    emptyTitle: {
      ...typography.bodyBold,
      color: colors.text,
    },
    emptyBody: {
      ...typography.subhead,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    sessionCard: {
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    sessionIconWrap: {
      width: 56,
      height: 56,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    iconWrapCalendar: {
      backgroundColor: colors.successBg,
    },
    iconWrapVideo: {
      backgroundColor: colors.notificationRecap + "33",
    },
    sessionBody: {
      flex: 1,
      minWidth: 0,
    },
    sessionName: {
      ...typography.bodyBold,
      color: colors.text,
      marginBottom: 2,
    },
    sessionMeta: {
      ...typography.subhead,
      color: colors.textMuted,
      fontWeight: "400",
    },
    statusPill: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      borderWidth: 1,
      minWidth: 92,
      alignItems: "center",
    },
    statusConfirmed: {
      backgroundColor: colors.successBg,
      borderColor: colors.success + "66",
    },
    statusPending: {
      backgroundColor: colors.warning + "22",
      borderColor: colors.warning + "66",
    },
    statusText: {
      ...typography.caption,
      fontWeight: "600",
      textTransform: "lowercase",
    },
    statusTextConfirmed: {
      color: colors.success,
    },
    statusTextPending: {
      color: colors.warning,
    },
    weekCard: {
      marginTop: spacing.sm,
      borderRadius: radius.xxl,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.lg,
    },
    weekTitle: {
      ...typography.title3,
      color: colors.text,
      marginBottom: spacing.md,
    },
    weekStatsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    weekStatCol: {
      flex: 1,
      alignItems: "center",
    },
    weekStatValue: {
      ...typography.title2,
      color: colors.text,
      fontWeight: "700",
    },
    weekRevenue: {
      color: colors.primary,
    },
    weekStatLabel: {
      ...typography.subhead,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });
}
