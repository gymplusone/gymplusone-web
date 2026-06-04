import { EventIconWell } from "@/components/events/EventIconWell";
import { EVENT_LIST_ICON_WELL_SIZE } from "@/constants/eventUI";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import type { EventIconName } from "@/data/mockEvents";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  statusLine: string;
  icon?: EventIconName;
  showSeparator: boolean;
  onPress: () => void;
};

export function NearbyEventListRow({
  title,
  statusLine,
  icon,
  showSeparator,
  onPress,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <EventIconWell variant="list" icon={icon} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowMeta}>{statusLine}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      {showSeparator ? <View style={styles.separator} /> : null}
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.md,
      position: "relative",
    },
    rowPressed: { opacity: 0.85 },
    iconWrap: { marginRight: spacing.md },
    rowBody: {
      flex: 1,
      justifyContent: "center",
      minHeight: EVENT_LIST_ICON_WELL_SIZE,
    },
    rowTitle: {
      ...typography.bodyBold,
      color: colors.text,
      marginBottom: spacing.xxs,
    },
    rowMeta: {
      ...typography.subhead,
      color: colors.textMuted,
    },
    separator: {
      position: "absolute",
      left: EVENT_LIST_ICON_WELL_SIZE + spacing.md,
      right: 0,
      bottom: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
    },
  });
}
