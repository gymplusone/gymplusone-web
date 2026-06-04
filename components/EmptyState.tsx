import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type EmptyStateProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {/* {actionLabel && onAction ? (
        <View style={styles.buttonWrap}>
          <Button
            title={actionLabel}
            onPress={onAction}
            variant="secondary"
            fullWidth
            style={{ borderRadius: radius.full, paddingVertical: spacing.xs }}
          />
        </View>
      ) : null} */}
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
      textAlign: "center",
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      textAlign: "center",
    },
    buttonWrap: { marginTop: spacing.lg, width: "100%", maxWidth: 280 },
  });
}
