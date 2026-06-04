import type { ThemeColors } from "@/constants/Theme";
import {
  iconButton,
  radius,
  shadows,
  spacing,
  typography,
} from "@/constants/Theme";
import { useApp } from "@/features/context/AppContext";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Button } from "@/components/Button";
import {
  CalendarPickerModal,
  getCalendarPickerPanelLayout,
  startOfCalendarDay,
  startOfCalendarMonth,
} from "@/components/events/CalendarPickerModal";
import { AddTabIcon } from "@/components/icons/AddTabIcon";
import { AddUserIcon } from "@/components/icons/AddUserIcon";
import { CalendarTabIcon } from "@/components/icons/CalendarTabIcon";
import { PlusOneTabIcon } from "@/components/icons/PlusOneTabIcon";
import {
  MenuDropdownItem,
  MenuDropdownModal,
  MenuDropdownSeparator,
} from "@/components/layout/MenuDropdownModal";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CORE_MOCK_PEOPLE } from "@/data/mockPeople";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MOCK = {
  revenueCents: 1_755_000,
  revenueLastMonthCents: 1_080_000,
  /** Week-to-date total (pence) — illustrative. */
  revenueWeekCents: 318_000,
  revenueLastWeekCents: 276_000,
  activeClients: 48,
  sessionsThisMonth: 156,
  monthlyGoalCents: 2_250_000,
};

type RevenuePeriod = "week" | "month";

const MONTH_CHART_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Baseline pence per month (illustrative); current & previous month use MOCK totals. */
const MONTH_CHART_BASE_CENTS: readonly number[] = [
  820_000, 850_000, 900_000, 940_000, 970_000, 1_000_000, 1_020_000, 1_040_000,
  1_030_000, 1_050_000, 1_060_000, 1_070_000,
];

function monthlyRevenueChartData(): { label: string; cents: number }[] {
  const m = new Date().getMonth();
  const prev = m === 0 ? 11 : m - 1;
  return MONTH_CHART_LABELS.map((label, i) => ({
    label,
    cents:
      i === m
        ? MOCK.revenueCents
        : i === prev
          ? MOCK.revenueLastMonthCents
          : MONTH_CHART_BASE_CENTS[i]!,
  }));
}

/** Current week by day (pence) — illustrative; last bar is today. */
const MOCK_REVENUE_BY_WEEK = [
  { label: "Mon", cents: 42_000 },
  { label: "Tue", cents: 38_000 },
  { label: "Wed", cents: 51_000 },
  { label: "Thu", cents: 45_000 },
  { label: "Fri", cents: 62_000 },
  { label: "Sat", cents: 28_000 },
  { label: "Sun", cents: 52_000 },
] as const;

const CHART_BAR_AREA_HEIGHT = 132;
const FAB_MENU_ITEMS = [
  "Clients",
  "Sessions",
  "Events nearby",
  "Plans",
] as const;

/** Accent bar: `primary` vs `secondaryMuted` (theme — not fixed green/blue). */
const MOCK_TODAY_SCHEDULE = [
  {
    id: "t1",
    timeLine1: "9:00",
    timeLine2: "AM",
    title: CORE_MOCK_PEOPLE.jordan.name,
    details: "Personal Training • 60 min",
    accent: "primary" as const,
  },
  {
    id: "t2",
    timeLine1: "2:00",
    timeLine2: "PM",
    title: "Group Class",
    details: "HIIT • 45 min • 8 people",
    accent: "muted" as const,
  },
];

const MOCK_SESSIONS = [
  {
    id: "1",
    initials: CORE_MOCK_PEOPLE.jordan.initials,
    name: CORE_MOCK_PEOPLE.jordan.name,
    detail: "Personal • 2:00 PM",
    status: "done" as const,
    priceCents: 8_500,
  },
  {
    id: "2",
    initials: CORE_MOCK_PEOPLE.sam.initials,
    name: CORE_MOCK_PEOPLE.sam.name,
    detail: "Personal • Tomorrow 9:00 AM",
    status: "upcoming" as const,
    priceCents: 9_500,
  },
  {
    id: "3",
    initials: CORE_MOCK_PEOPLE.alex.initials,
    name: CORE_MOCK_PEOPLE.alex.name,
    detail: "Personal • Fri 4:30 PM",
    status: "upcoming" as const,
    priceCents: 7_500,
  },
];

function formatMoney(cents: number) {
  const n = cents / 100;
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

function pct(current: number, goal: number) {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((current / goal) * 100));
}

function RevenuePeriodSwitch({
  value,
  onChange,
  styles,
  style,
}: {
  value: RevenuePeriod;
  onChange: (p: RevenuePeriod) => void;
  styles: ReturnType<typeof createStyles>;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[styles.revenuePeriodSwitch, style]}
      accessibilityRole="tablist"
      accessibilityLabel="Revenue period"
    >
      <Pressable
        style={({ pressed }) => [
          styles.revenuePeriodTab,
          value === "week" && styles.revenuePeriodTabActive,
          pressed && styles.revenuePeriodTabPressed,
        ]}
        onPress={() => onChange("week")}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === "week" }}
      >
        <Text
          style={[
            styles.revenuePeriodTabText,
            value === "week" && styles.revenuePeriodTabTextActive,
          ]}
        >
          Week
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.revenuePeriodTab,
          value === "month" && styles.revenuePeriodTabActive,
          pressed && styles.revenuePeriodTabPressed,
        ]}
        onPress={() => onChange("month")}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === "month" }}
      >
        <Text
          style={[
            styles.revenuePeriodTabText,
            value === "month" && styles.revenuePeriodTabTextActive,
          ]}
        >
          Month
        </Text>
      </Pressable>
    </View>
  );
}

function RevenueBarChart({
  data,
  styles,
  primaryColor,
  mutedBarColor,
  highlightIndex,
}: {
  data: readonly { label: string; cents: number }[];
  styles: ReturnType<typeof createStyles>;
  primaryColor: string;
  mutedBarColor: string;
  /** When set (e.g. calendar month 0–11), that bar uses the primary color. */
  highlightIndex?: number;
}) {
  const maxCents = Math.max(...data.map((d) => d.cents), 1);
  const activeBarIndex =
    highlightIndex !== undefined ? highlightIndex : data.length - 1;

  return (
    <View style={styles.revenueChart}>
      <View style={[styles.revenueChartBars, { height: CHART_BAR_AREA_HEIGHT }]}>
        {data.map((d, i) => {
          const isCurrent = i === activeBarIndex;
          const fillHeight = Math.max(
            4,
            (d.cents / maxCents) * CHART_BAR_AREA_HEIGHT,
          );
          return (
            <View key={`${i}-${d.label}`} style={styles.revenueChartBarCol}>
              <View style={styles.revenueChartBarTrack}>
                <View
                  style={[
                    styles.revenueChartBarFill,
                    {
                      height: fillHeight,
                      backgroundColor: isCurrent
                        ? primaryColor
                        : mutedBarColor,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.revenueChartLabels}>
        {data.map((d, i) => (
          <Text key={`${i}-${d.label}`} style={styles.revenueChartLabel}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function goalStatusMessage(
  goalProgress: number,
  colors: ThemeColors,
): { text: string; color: string } {
  const day = new Date().getDate();
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();
  const pace = Math.round((day / daysInMonth) * 100);
  if (goalProgress >= pace - 3) {
    return { text: "You're on track! 🥳", color: colors.success };
  }
  if (goalProgress >= pace - 12) {
    return { text: "Close — a strong week could close the gap", color: colors.warning };
  }
  return { text: "Behind pace — prioritize bookings", color: colors.error };
}

function GoalDonut({
  progress,
  size,
  strokeWidth,
  trackColor,
  progressColor,
  label,
  labelColor,
}: {
  progress: number;
  size: number;
  strokeWidth: number;
  trackColor: string;
  progressColor: string;
  label: string;
  labelColor: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (Math.min(100, progress) / 100) * circumference;

  return (
    <View style={{ width: size, height: size, position: "relative" }}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <G rotation={-90} origin={`${cx}, ${cy}`}>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { alignItems: "center", justifyContent: "center" },
        ]}
        pointerEvents="none"
      >
        <Text style={[donutLabelStyle.label, { color: labelColor }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const donutLabelStyle = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "700",
  },
});

const FAB_SIZE = 56;

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { switchAccountEnabled } = useApp();
  const styles = useThemedStyles(createStyles);
  const tabBarHeight = useBottomTabBarHeight();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("month");
  const [fabMenuOpen, setFabMenuOpen] = useState(false);
  const fabIconAnim = useState(() => new Animated.Value(0))[0];
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() =>
    startOfCalendarMonth(startOfCalendarDay(new Date())),
  );
  const [calendarSelected, setCalendarSelected] = useState(() =>
    startOfCalendarDay(new Date()),
  );
  const closeCalendarModal = useCallback(() => setCalendarModalOpen(false), []);
  const closeCreateMenu = useCallback(() => setCreateMenuOpen(false), []);
  const openCalendarModal = () => {
    setCalendarMonth(startOfCalendarMonth(calendarSelected));
    setCalendarModalOpen(true);
  };
  const { top: calendarPanelTop, width: calendarPanelWidth } =
    getCalendarPickerPanelLayout(insets.top);

  useEffect(() => {
    if (!switchAccountEnabled) {
      router.replace("/(tabs)/calendar");
    }
  }, [switchAccountEnabled, router]);

  useEffect(() => {
    Animated.spring(fabIconAnim, {
      toValue: fabMenuOpen ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [fabIconAnim, fabMenuOpen]);

  const goalProgress = useMemo(
    () => pct(MOCK.revenueCents, MOCK.monthlyGoalCents),
    [],
  );
  const status = useMemo(
    () => goalStatusMessage(goalProgress, colors),
    [goalProgress, colors],
  );
  const revenueChartData = useMemo(
    () =>
      revenuePeriod === "week"
        ? MOCK_REVENUE_BY_WEEK
        : monthlyRevenueChartData(),
    [revenuePeriod],
  );
  const revenueChartHighlightIndex =
    revenuePeriod === "month" ? new Date().getMonth() : undefined;
  const revenueHeadlineCents =
    revenuePeriod === "week" ? MOCK.revenueWeekCents : MOCK.revenueCents;
  const revenueSubcopy =
    revenuePeriod === "week" ? "This week" : "Month to date";
  const fabBottom = Math.max(0, tabBarHeight - spacing.xxl - 10);
  const onFabMenuItemPress = (item: (typeof FAB_MENU_ITEMS)[number]) => {
    setFabMenuOpen(false);
    if (item === "Plans") {
      router.push("/plans");
      return;
    }
    if (item === "Clients") {
      router.push("/clients");
      return;
    }
    if (item === "Sessions") {
      router.push("/sessions");
      return;
    }
  };

  const fabIconAnimatedStyle = {
    transform: [
      {
        rotate: fabIconAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
      {
        scale: fabIconAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.92],
        }),
      },
    ],
  } as const;

  if (!switchAccountEnabled) {
    return <View style={styles.screen} />;
  }

  return (
    <View style={styles.screen}>
      <BlurView
        style={[styles.fixedTopWrap, { paddingTop: insets.top + spacing.md }]}
        intensity={80}
        tint={isDark ? "dark" : "light"}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            Analytics
          </Text>
          <View style={styles.headerActions}>
            <Pressable
              hitSlop={iconButton.hitSlop}
              style={({ pressed }) => [
                styles.headerIconBtn,
                pressed && styles.headerIconPressed,
              ]}
              onPress={openCalendarModal}
              accessibilityLabel="Show calendar"
              accessibilityState={{ expanded: calendarModalOpen }}
            >
              <CalendarTabIcon color={colors.text} size={26} />
            </Pressable>
            <Pressable
              hitSlop={iconButton.hitSlop}
              style={({ pressed }) => [
                styles.headerIconBtn,
                pressed && styles.headerIconPressed,
              ]}
              onPress={() => setCreateMenuOpen((o) => !o)}
              accessibilityLabel="Create event"
              accessibilityState={{ expanded: createMenuOpen }}
            >
              <PlusOneTabIcon color={colors.text} size={26} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.description}>
          Revenue, clients, and sessions at a glance.
          {/* Figures are illustrative. */}
        </Text>
      </BlurView>

      <CalendarPickerModal
        visible={calendarModalOpen}
        onClose={closeCalendarModal}
        panelTop={calendarPanelTop}
        panelWidth={calendarPanelWidth}
        monthCursor={calendarMonth}
        selectedDate={calendarSelected}
        onChangeMonth={setCalendarMonth}
        onSelectDay={setCalendarSelected}
      />

      <MenuDropdownModal
        visible={createMenuOpen}
        onClose={closeCreateMenu}
        panelPositionStyle={{ top: calendarPanelTop, right: spacing.lg }}
      >
        <MenuDropdownItem
          label="Create community event"
          onPress={() => {
            closeCreateMenu();
            router.push("/(tabs)/calendar/community-event");
          }}
        />
        <MenuDropdownSeparator />
        <MenuDropdownItem
          label="Create private event"
          onPress={() => {
            closeCreateMenu();
            router.push("/(tabs)/messages/private-event");
          }}
        />
      </MenuDropdownModal>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop:
              (headerHeight > 0 ? headerHeight : insets.top + spacing.md + 72) +
              spacing.sm,
            paddingBottom:
              insets.bottom + spacing.xl + FAB_SIZE + spacing.md,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <StatCard
            styles={styles}
            label="Revenue"
            value={formatMoney(revenueHeadlineCents)}
            hint={revenuePeriod === "week" ? "This week" : "This month"}
          />
          <StatCard
            styles={styles}
            label="Clients"
            value={String(MOCK.activeClients)}
            hint="Active"
          />
          <StatCard
            styles={styles}
            label="Sessions"
            value={String(MOCK.sessionsThisMonth)}
            hint="This month"
          />
        </View>

        <Text style={styles.sectionLabel}>Revenue</Text>
        <View style={styles.card}>
          <View style={styles.revenueRow}>
            <View>
              <Text style={styles.revenueMain}>
                {formatMoney(revenueHeadlineCents)}
              </Text>
              <Text style={styles.revenueSub}>{revenueSubcopy}</Text>
            </View>
            {/*
            <View
              style={[
                styles.deltaPill,
                revenueDeltaForPeriod >= 0
                  ? styles.deltaPillPositive
                  : styles.deltaPillNegative,
              ]}
            >
              <Text
                style={[
                  styles.deltaPillText,
                  revenueDeltaForPeriod >= 0
                    ? styles.deltaPillTextPositive
                    : styles.deltaPillTextNegative,
                ]}
              >
                {revenueDeltaForPeriod >= 0 ? "+" : ""}
                {revenueDeltaForPeriod}% {revenueCompareLabel}
              </Text>
            </View>
            */}
            <RevenuePeriodSwitch
              value={revenuePeriod}
              onChange={setRevenuePeriod}
              styles={styles}
              style={styles.revenuePeriodSwitchInRow}
            />
          </View>
          <RevenueBarChart
            key={revenuePeriod}
            data={revenueChartData}
            styles={styles}
            primaryColor={colors.primary}
            mutedBarColor={colors.border}
            highlightIndex={revenueChartHighlightIndex}
          />
          <Text style={styles.cardFootnote}>
            {revenuePeriod === "week"
              ? `Last week: ${formatMoney(MOCK.revenueLastWeekCents)} · daily breakdown`
              : `Last month: ${formatMoney(MOCK.revenueLastMonthCents)} · Jan–Dec view`}
          </Text>
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalCardMain}>
            <View style={styles.goalCardTextCol}>
              <Text style={styles.goalCardTitle}>Monthly goal</Text>
              <Text style={styles.goalCardAmounts}>
                {formatMoney(MOCK.revenueCents)} of{" "}
                {formatMoney(MOCK.monthlyGoalCents)}
              </Text>
              <Text style={[styles.goalCardStatus, { color: status.color }]}>
                {status.text}
              </Text>
            </View>
            <GoalDonut
              progress={goalProgress}
              size={100}
              strokeWidth={10}
              trackColor={colors.borderLight}
              progressColor={colors.primary}
              label={`${goalProgress}%`}
              labelColor={colors.text}
            />
          </View>
        </View>

        <View style={styles.quickActionsRow}>
          <Button
            title="Book Session"
            variant="primary"
            onPress={() => {}}
            leftIcon={
              <CalendarTabIcon color={colors.textOnPrimary} size={20} />
            }
            style={{ flex: 1, borderRadius: radius.md, paddingVertical: spacing.xxs, paddingHorizontal: spacing.xxs }}
          />
          <Button
            title="Add Client"
            variant="surface"
            onPress={() => {}}
            leftIcon={<AddUserIcon color={colors.text} size={20} />}
            style={{ flex: 1, borderRadius: radius.md, paddingVertical: spacing.xxs, paddingHorizontal: spacing.xxs }}
          />
        </View>

        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleCardTitle}>Today's Schedule</Text>
          {MOCK_TODAY_SCHEDULE.map((item, i) => (
            <TodayScheduleRow
              key={item.id}
              item={item}
              styles={styles}
              colors={colors}
              showSeparator={i < MOCK_TODAY_SCHEDULE.length - 1}
            />
          ))}
        </View>

        <View style={styles.recentHeader}>
          <Text style={[styles.sectionLabel, styles.recentHeaderTitle]}>
            Recent Sessions
          </Text>
          <Pressable
            onPress={() => {}}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="View all sessions"
          >
            <Text style={styles.viewAll}>
              View all{" "}
              <Text style={styles.viewAllChevron}>›</Text>
            </Text>
          </Pressable>
        </View>

        <View style={styles.sessionList}>
          {MOCK_SESSIONS.map((s, i) => (
            <RecentSessionRow
              key={s.id}
              session={s}
              styles={styles}
              showSeparator={i < MOCK_SESSIONS.length - 1}
            />
          ))}
        </View>
      </ScrollView>

      {fabMenuOpen ? (
        <>
          <Pressable
            style={styles.fabMenuBackdrop}
            onPress={() => setFabMenuOpen(false)}
            accessibilityLabel="Close add menu"
          />
          <View
            style={[
              styles.fabMenu,
              {
                bottom: fabBottom + FAB_SIZE + spacing.xs,
                right: spacing.lg,
              },
            ]}
          >
            {FAB_MENU_ITEMS.map((item, idx) => (
              <View key={item}>
                <Pressable
                  style={({ pressed }) => [
                    styles.fabMenuItem,
                    pressed && styles.fabMenuItemPressed,
                  ]}
                  onPress={() => onFabMenuItemPress(item)}
                  accessibilityRole="button"
                  accessibilityLabel={item}
                >
                  <Text style={styles.fabMenuItemText}>{item}</Text>
                </Pressable>
                {idx < FAB_MENU_ITEMS.length - 1 ? (
                  <View style={styles.fabMenuItemSeparator} />
                ) : null}
              </View>
            ))}
          </View>
        </>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            bottom: fabBottom,
            right: spacing.lg,
          },
          pressed && styles.fabPressed,
        ]}
        onPress={() => setFabMenuOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel="Add"
        accessibilityState={{ expanded: fabMenuOpen }}
      >
        <Animated.View style={[styles.fabIconWrap, fabIconAnimatedStyle]}>
          <AddTabIcon color={colors.textOnPrimary} size={30} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

function TodayScheduleRow({
  item,
  styles,
  colors,
  showSeparator,
}: {
  item: (typeof MOCK_TODAY_SCHEDULE)[number];
  styles: ReturnType<typeof createStyles>;
  colors: ThemeColors;
  showSeparator: boolean;
}) {
  const barColor =
    item.accent === "primary" ? colors.primary : colors.secondaryMuted;
  return (
    <View>
      <View style={styles.scheduleRow}>
        <View style={styles.scheduleTimeCol}>
          <Text style={styles.scheduleTimeLine1}>{item.timeLine1}</Text>
          <Text style={styles.scheduleTimeLine2}>{item.timeLine2}</Text>
        </View>
        <View style={[styles.scheduleAccentBar, { backgroundColor: barColor }]} />
        <View style={styles.scheduleContentCol}>
          <Text style={styles.scheduleItemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.scheduleItemDetails} numberOfLines={2}>
            {item.details}
          </Text>
        </View>
      </View>
      {showSeparator ? <View style={styles.scheduleRowSeparator} /> : null}
    </View>
  );
}

function RecentSessionRow({
  session,
  styles,
  showSeparator,
}: {
  session: (typeof MOCK_SESSIONS)[number];
  styles: ReturnType<typeof createStyles>;
  showSeparator: boolean;
}) {
  const isDone = session.status === "done";
  return (
    <View>
      <View style={styles.sessionCard}>
        <View style={styles.sessionAvatar}>
          <Text style={styles.sessionAvatarText}>{session.initials}</Text>
        </View>
        <View style={styles.sessionBody}>
          <View style={styles.sessionTitleRow}>
            <Text style={styles.sessionName} numberOfLines={1}>
              {session.name}
            </Text>
            <Text style={styles.sessionPrice} numberOfLines={1}>
              {formatMoney(session.priceCents)}
            </Text>
          </View>
          <View style={styles.sessionMetaRow}>
            <Text style={styles.sessionDetail} numberOfLines={1}>
              {session.detail}
            </Text>
            {/*
            <View
              style={[
                styles.sessionBadge,
                isDone ? styles.sessionBadgeDone : styles.sessionBadgeUpcoming,
              ]}
            >
              <View
                // style={[
                //   styles.sessionBadgeDot,
                //   isDone
                //     ? styles.sessionBadgeDotDone
                //     : styles.sessionBadgeDotUpcoming,
                // ]}
              />
              <Text
                style={[
                  styles.sessionBadgeText,
                  isDone
                    ? styles.sessionBadgeTextDone
                    : styles.sessionBadgeTextUpcoming,
                ]}
              >
                {isDone ? "Done" : "Upcoming"}
              </Text>
            </View>
            */}
          </View>
        </View>
      </View>
      {showSeparator ? <View style={styles.sessionSeparator} /> : null}
    </View>
  );
}

function StatCard({
  styles,
  label,
  value,
  hint,
}: {
  styles: ReturnType<typeof createStyles>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
      paddingBottom: spacing.md,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      marginBottom: spacing.xs,
    },
    title: {
      ...typography.title1,
      color: colors.text,
      flex: 1,
      minWidth: 0,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      // gap: spacing.xxs,
      flexShrink: 0,
    },
    headerIconBtn: {
      padding: iconButton.padding,
    },
    headerIconPressed: {
      opacity: 0.7,
    },
    description: {
      ...typography.subhead,
      color: colors.textSecondary,
      lineHeight: 22,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: spacing.lg,
    },
    statsRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
      minWidth: 0,
    },
    statLabel: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.xxs,
    },
    statValue: {
      ...typography.title3,
      color: colors.text,
      marginBottom: 2,
    },
    statHint: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    sectionLabel: {
      ...typography.bodyBold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    revenueRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    revenueMain: {
      ...typography.largeTitle,
      color: colors.text,
    },
    revenueSub: {
      ...typography.subhead,
      color: colors.textMuted,
      marginTop: spacing.xxs,
    },
    revenuePeriodSwitch: {
      flexDirection: "row",
      backgroundColor: colors.borderLight,
      borderRadius: radius.sm,
      padding: 2,
      gap: 2,
    },
    revenuePeriodSwitchInRow: {
      marginTop: 0,
      alignSelf: "flex-start",
      flexShrink: 0,
    },
    revenuePeriodTab: {
      paddingVertical: spacing.xxs,
      paddingHorizontal: spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.sm,
    },
    revenuePeriodTabActive: {
      backgroundColor: colors.surface,
    },
    revenuePeriodTabPressed: {
      opacity: 0.85,
    },
    revenuePeriodTabText: {
      ...typography.caption,
      fontWeight: "600",
      color: colors.textMuted,
    },
    revenuePeriodTabTextActive: {
      color: colors.text,
    },
    revenueChart: {
      marginTop: spacing.md,
    },
    revenueChartBars: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: spacing.xs,
    },
    revenueChartBarCol: {
      flex: 1,
      alignItems: "center",
    },
    revenueChartBarTrack: {
      width: "72%",
      height: CHART_BAR_AREA_HEIGHT,
      justifyContent: "flex-end",
      alignItems: "stretch",
    },
    revenueChartBarFill: {
      width: "100%",
      borderTopLeftRadius: radius.lg,
      borderTopRightRadius: radius.lg,
      minHeight: 4,
    },
    revenueChartLabels: {
      flexDirection: "row",
      marginTop: spacing.sm,
      gap: spacing.xxs,
    },
    revenueChartLabel: {
      ...typography.small,
      color: colors.textMuted,
      flex: 1,
      textAlign: "center",
    },
    deltaPill: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.full,
      alignSelf: "flex-start",
    },
    deltaPillPositive: {
      backgroundColor: colors.successBg,
    },
    deltaPillNegative: {
      backgroundColor: colors.error + "22",
    },
    deltaPillText: {
      ...typography.caption,
      fontWeight: "600",
    },
    deltaPillTextPositive: {
      color: colors.success,
    },
    deltaPillTextNegative: {
      color: colors.error,
    },
    cardFootnote: {
      ...typography.footnote,
      color: colors.textMuted,
      textAlign: "center",
      marginTop: spacing.sm,
    },
    goalCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    goalCardMain: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    goalCardTextCol: {
      flex: 1,
      minWidth: 0,
    },
    goalCardTitle: {
      ...typography.title2,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    goalCardAmounts: {
      ...typography.subhead,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    goalCardStatus: {
      ...typography.subhead,
      fontWeight: "600",
    },
    quickActionsRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    scheduleCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    scheduleCardTitle: {
      ...typography.title3,
      color: colors.text,
      marginBottom: spacing.md,
    },
    scheduleRow: {
      flexDirection: "row",
      alignItems: "stretch",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
    },
    scheduleTimeCol: {
      width: 52,
      alignItems: "flex-end",
      justifyContent: "flex-start",
      paddingTop: 2,
    },
    scheduleTimeLine1: {
      ...typography.bodyBold,
      fontSize: 15,
      color: colors.textMuted,
      lineHeight: 18,
    },
    scheduleTimeLine2: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: 2,
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    scheduleAccentBar: {
      width: 3,
      borderRadius: 2,
      alignSelf: "stretch",
      minHeight: 44,
    },
    scheduleContentCol: {
      flex: 1,
      minWidth: 0,
      justifyContent: "center",
    },
    scheduleItemTitle: {
      ...typography.bodyBold,
      fontSize: 17,
      color: colors.text,
      marginBottom: spacing.xxs,
    },
    scheduleItemDetails: {
      ...typography.subhead,
      color: colors.textMuted,
      lineHeight: 20,
    },
    scheduleRowSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
      marginLeft: 52 + spacing.sm + 3 + spacing.sm,
    },
    recentHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      // marginBottom: spacing.sm,
    },
    recentHeaderTitle: {
      marginBottom: 0,
    },
    viewAll: {
      ...typography.subhead,
      color: colors.primary,
      fontWeight: "600",
    },
    viewAllChevron: {
      fontWeight: "700",
    },
    sessionList: {
      // backgroundColor: colors.surface,
      // borderRadius: radius.lg,
      // borderWidth: 1,
      // borderColor: colors.border,
      overflow: "hidden",
      marginBottom: spacing.lg,
    },
    sessionCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    sessionAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    sessionAvatarText: {
      ...typography.bodyBold,
      color: colors.text,
      fontSize: 14,
    },
    sessionBody: {
      flex: 1,
      minWidth: 0,
      justifyContent: "center",
    },
    sessionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      marginBottom: 1,
    },
    sessionName: {
      ...typography.bodyBold,
      color: colors.text,
      flex: 1,
      minWidth: 0,
    },
    sessionBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.full,
      flexShrink: 0,
    },
    sessionBadgeDone: {
      backgroundColor: colors.successBg,
    },
    sessionBadgeUpcoming: {
      backgroundColor: colors.warning + "28",
    },
    sessionBadgeDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    sessionBadgeDotDone: {
      backgroundColor: colors.success,
    },
    sessionBadgeDotUpcoming: {
      backgroundColor: colors.warning,
    },
    sessionBadgeText: {
      ...typography.caption,
      fontWeight: "600",
    },
    sessionBadgeTextDone: {
      color: colors.success,
    },
    sessionBadgeTextUpcoming: {
      color: colors.warning,
    },
    sessionMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      marginTop: 0,
    },
    sessionDetail: {
      ...typography.caption,
      color: colors.textMuted,
      flex: 1,
      minWidth: 0,
      lineHeight: 16,
    },
    sessionPrice: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "600",
      color: colors.textSecondary,
      flexShrink: 0,
      fontVariant: ["tabular-nums"],
    },
    sessionSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
      marginLeft: spacing.md + 44 + spacing.md,
    },
    fabMenuBackdrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 24,
    },
    fabMenu: {
      position: "absolute",
      zIndex: 25,
      minWidth: 156,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      ...shadows.md,
    },
    fabMenuItem: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    fabMenuItemSeparator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
      marginHorizontal: spacing.sm,
    },
    fabMenuItemPressed: {
      backgroundColor: colors.surfaceElevated,
    },
    fabMenuItemText: {
      ...typography.bodyBold,
      color: colors.text,
    },
    fab: {
      position: "absolute",
      zIndex: 30,
      width: FAB_SIZE,
      height: FAB_SIZE,
      borderRadius: FAB_SIZE / 2,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      ...shadows.lg,
    },
    fabIconWrap: {
      alignItems: "center",
      justifyContent: "center",
    },
    fabPressed: {
      opacity: 0.92,
      transform: [{ scale: 0.97 }],
    },
  });
}
