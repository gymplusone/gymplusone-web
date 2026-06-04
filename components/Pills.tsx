import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

type PillOption<T extends string> = T | { value: T; label: string };

type PillsProps<T extends string> = {
  options: readonly PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: ViewStyle;
};

export function Pills<T extends string>({
  options,
  value,
  onChange,
  style,
}: PillsProps<T>) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.row, style]}>
      {options.map((opt) => {
        const itemValue = typeof opt === "string" ? opt : opt.value;
        const itemLabel = typeof opt === "string" ? opt : opt.label;
        const active = itemValue === value;
        return (
          <Pressable
            key={itemValue}
            onPress={() => onChange(itemValue)}
            style={({ pressed }) => [
              styles.pill,
              active && styles.pillActive,
              pressed && styles.pillPressed,
            ]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {itemLabel}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: spacing.xs,
    },
    pill: {
      flexShrink: 0,
      alignSelf: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    pillActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    pillPressed: {
      opacity: 0.92,
    },
    text: {
      ...typography.subhead,
      color: colors.text,
      textAlign: "center",
    },
    textActive: {
      color: colors.textOnPrimary,
    },
  });
}
