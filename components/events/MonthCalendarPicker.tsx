import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  WEEK_DAYS,
  formatMonthYearLabel,
  getCalendarRowsForMonth,
  isSameCalendarDay,
} from "@/utils/calendarMonth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  monthCursor: Date;
  selectedDate: Date;
  onChangeMonth: (nextMonthStart: Date) => void;
  onSelectDay: (day: Date) => void;
  /** Omit outer card (e.g. when wrapped in a modal panel) */
  embedded?: boolean;
};

export function MonthCalendarPicker({
  monthCursor,
  selectedDate,
  onChangeMonth,
  onSelectDay,
  embedded = false,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const calendarRows = getCalendarRowsForMonth(monthCursor);
  const monthLabel = formatMonthYearLabel(monthCursor);

  return (
    <View style={embedded ? styles.embedded : styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <Pressable
          onPress={() =>
            onChangeMonth(
              new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1),
            )
          }
          style={({ pressed }) => [
            styles.monthNavBtn,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="chevron-back" size={18} color={colors.text} />
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <Pressable
          onPress={() =>
            onChangeMonth(
              new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1),
            )
          }
          style={({ pressed }) => [
            styles.monthNavBtn,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="chevron-forward" size={18} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {WEEK_DAYS.map((d) => (
          <Text key={d} style={styles.weekLabel}>
            {d}
          </Text>
        ))}
      </View>
      <View style={styles.daysGrid}>
        {calendarRows.map((row, rowIndex) => (
          <View
            key={`row-${monthCursor.getFullYear()}-${monthCursor.getMonth()}-${rowIndex}`}
            style={styles.daysRow}
          >
            {row.map((day, colIndex) =>
              day === 0 ? (
                <View
                  key={`blank-${rowIndex}-${colIndex}`}
                  style={styles.dayCellOuter}
                />
              ) : (
                <Pressable
                  key={`day-${monthCursor.getFullYear()}-${monthCursor.getMonth()}-${day}-${rowIndex}`}
                  onPress={() =>
                    onSelectDay(
                      new Date(
                        monthCursor.getFullYear(),
                        monthCursor.getMonth(),
                        day,
                      ),
                    )
                  }
                  style={({ pressed }) => [
                    styles.dayCellOuter,
                    pressed &&
                      !isSameCalendarDay(selectedDate, monthCursor, day) &&
                      styles.pressed,
                  ]}
                >
                  <View
                    style={[
                      styles.dayCellInner,
                      isSameCalendarDay(selectedDate, monthCursor, day) &&
                        styles.dayCellInnerSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSameCalendarDay(selectedDate, monthCursor, day) &&
                          styles.dayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                </Pressable>
              ),
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    embedded: {
      width: "100%",
    },
    calendarCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
    },
    calendarHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.xs,
    },
    monthNavBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceElevated,
    },
    monthLabel: { ...typography.bodyBold, color: colors.text },
    weekRow: { flexDirection: "row" },
    weekLabel: {
      flex: 1,
      textAlign: "center",
      ...typography.caption,
      color: colors.textMuted,
      paddingVertical: spacing.xs,
    },
    daysGrid: { width: "100%" },
    daysRow: { flexDirection: "row", width: "100%" },
    dayCellOuter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xxs,
      minHeight: 44,
    },
    dayCellInner: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    dayCellInnerSelected: {
      backgroundColor: colors.primary,
    },
    dayText: {
      ...typography.body,
      color: colors.text,
      textAlign: "center",
    },
    dayTextSelected: { color: colors.textOnPrimary, fontWeight: "700" },
    pressed: { opacity: 0.8 },
  });
}
