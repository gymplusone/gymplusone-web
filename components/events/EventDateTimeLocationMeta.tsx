import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
};

export function EventDateTimeLocationMeta({
  dateLabel,
  timeLabel,
  locationLabel,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.metaBlock}>
      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
        <Text style={styles.metaText}>{dateLabel}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={20} color={colors.primary} />
        <Text style={styles.metaText}>{timeLabel}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={20} color={colors.primary} />
        <Text style={styles.metaText}>{locationLabel}</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    metaBlock: {
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    metaText: {
      ...typography.body,
      color: colors.text,
      flex: 1,
    },
  });
}
