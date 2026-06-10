import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  initial?: { lat: number; lng: number } | null;
  onPick?: (lat: number, lng: number) => void;
};

export function MapPicker({ initial = null, onPick }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.wrap}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.hint}>Map placeholder</Text>
      </View>
      <Pressable
        style={styles.btn}
        onPress={() => onPick?.(initial?.lat ?? 0, initial?.lng ?? 0)}
      >
        <Text style={styles.btnText}>Select this location</Text>
      </Pressable>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: { paddingHorizontal: spacing.lg },
    mapPlaceholder: {
      height: 240,
      borderRadius: 8,
      backgroundColor: colors.surfaceElevated,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.md,
    },
    hint: { ...typography.subhead, color: colors.textMuted },
    btn: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      borderRadius: 8,
      alignItems: "center",
    },
    btnText: { ...typography.bodyBold, color: colors.textOnPrimary },
  });
}
