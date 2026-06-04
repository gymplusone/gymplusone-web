import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LoadingStateProps = {
  title: string;
  subtitle?: string;
};

export function LoadingState({ title, subtitle }: LoadingStateProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.xl,
    },
    title: {
      ...typography.title3,
      color: colors.text,
      marginTop: spacing.lg,
      textAlign: "center",
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      textAlign: "center",
    },
  });
}
