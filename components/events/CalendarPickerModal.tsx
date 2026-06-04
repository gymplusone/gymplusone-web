import { MonthCalendarPicker } from "@/components/events/MonthCalendarPicker";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

/** Matches a single header row under safe-area + padding (events / analytics icon row). */
export const CALENDAR_PICKER_HEADER_ROW_APPROX = 44;

export function getCalendarPickerPanelLayout(insetsTop: number) {
  return {
    top: insetsTop + spacing.md + CALENDAR_PICKER_HEADER_ROW_APPROX,
    width: Math.min(Dimensions.get("window").width - spacing.lg * 2, 400),
  };
}

export function startOfCalendarDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function startOfCalendarMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

type Props = {
  visible: boolean;
  onClose: () => void;
  panelTop: number;
  panelWidth: number;
  monthCursor: Date;
  selectedDate: Date;
  onChangeMonth: (nextMonthStart: Date) => void;
  onSelectDay: (day: Date) => void;
};

/** Same calendar overlay used on Events and Sessions (MonthCalendarPicker in a floating panel). */
export function CalendarPickerModal({
  visible,
  onClose,
  panelTop,
  panelWidth,
  monthCursor,
  selectedDate,
  onChangeMonth,
  onSelectDay,
}: Props) {
  const styles = useThemedStyles(createStyles);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {visible ? (
        <View style={styles.calendarModalRoot}>
          <Pressable
            style={styles.menuBackdrop}
            onPress={onClose}
            accessibilityLabel="Dismiss calendar"
          />
          <View
            style={[
              styles.calendarPanel,
              {
                top: panelTop,
                right: spacing.lg,
                width: panelWidth,
              },
            ]}
            accessibilityViewIsModal
          >
            <View style={styles.calendarPanelHeader}>
              <Text style={styles.calendarPanelTitle}>Calendar</Text>
              <Pressable
                onPress={onClose}
                hitSlop={12}
                style={({ pressed }) => [
                  styles.calendarDoneBtn,
                  pressed && styles.headerIconPressed,
                ]}
              >
                <Text style={styles.calendarDoneText}>Done</Text>
              </Pressable>
            </View>
            <MonthCalendarPicker
              embedded
              monthCursor={monthCursor}
              selectedDate={selectedDate}
              onChangeMonth={onChangeMonth}
              onSelectDay={onSelectDay}
            />
          </View>
        </View>
      ) : null}
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    calendarModalRoot: {
      flex: 1,
    },
    menuBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
    },
    calendarPanel: {
      position: "absolute",
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      zIndex: 1,
    },
    calendarPanelHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    calendarPanelTitle: {
      ...typography.title3,
      color: colors.text,
    },
    calendarDoneBtn: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    calendarDoneText: {
      ...typography.bodyBold,
      color: colors.primary,
    },
    headerIconPressed: { opacity: 0.7 },
  });
}
