import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  onPress: () => void;
  hitSlop?: number;
};

/** Uniform ← back control (same as Private Event / chat detail). */
export function HeaderBackButton({ onPress, hitSlop = 10 }: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable onPress={onPress} hitSlop={hitSlop} style={styles.backBtn}>
      <Text style={styles.backText}>←</Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    backBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      marginRight: spacing.sm,
    },
    backText: { ...typography.title3, color: colors.text },
  });
}
