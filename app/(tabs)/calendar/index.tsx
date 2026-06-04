import {
  CalendarPickerModal,
  getCalendarPickerPanelLayout,
  startOfCalendarDay,
  startOfCalendarMonth,
} from "@/components/events/CalendarPickerModal";
import { NearbyEventListRow } from "@/components/events/NearbyEventListRow";
import { CalendarTabIcon } from "@/components/icons/CalendarTabIcon";
import { PlusOneTabIcon } from "@/components/icons/PlusOneTabIcon";
import {
  MenuDropdownItem,
  MenuDropdownModal,
  MenuDropdownSeparator,
} from "@/components/layout/MenuDropdownModal";
import type { ThemeColors } from "@/constants/Theme";
import { iconButton, spacing, typography } from "@/constants/Theme";
import { getPublicEventListItems } from "@/data/mockEvents";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NEARBY_EVENTS = getPublicEventListItems();

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() =>
    startOfCalendarMonth(startOfCalendarDay(new Date())),
  );
  const [calendarSelected, setCalendarSelected] = useState(() =>
    startOfCalendarDay(new Date()),
  );

  const closeCreateMenu = () => setCreateMenuOpen(false);
  const closeCalendarModal = useCallback(() => setCalendarModalOpen(false), []);

  const openCalendarModal = () => {
    setCalendarMonth(startOfCalendarMonth(calendarSelected));
    setCalendarModalOpen(true);
  };

  const { top: calendarPanelTop, width: calendarPanelWidth } =
    getCalendarPickerPanelLayout(insets.top);

  return (
    <View style={styles.screen}>
      <BlurView
        style={[styles.fixedTopWrap, { paddingTop: insets.top + spacing.md }]}
        intensity={80}
        tint={isDark ? "dark" : "light"}
        onLayout={(e) => setFixedHeaderHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            Events near you
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
          People in your area are going to these events. RSVP or create your own
          events!
        </Text>
      </BlurView>

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

      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: fixedHeaderHeight + spacing.sm },
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {NEARBY_EVENTS.map((item, index) => (
          <NearbyEventListRow
            key={item.id}
            title={item.title}
            statusLine={item.statusLine}
            icon={item.icon}
            showSeparator={index < NEARBY_EVENTS.length - 1}
            onPress={() => router.push(`/(tabs)/calendar/${item.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
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
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
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
    // gap: spacing.sm,
    flexShrink: 0,
  },
  headerIconBtn: {
    padding: iconButton.padding,
  },
  headerIconPressed: { opacity: 0.7 },
  description: {
    ...typography.subhead,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  listScroll: { flex: 1 },
  listContent: { paddingBottom: spacing.md },
  });
}
