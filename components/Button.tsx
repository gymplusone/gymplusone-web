import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React, { type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "white"
  | "surface";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  /** Renders before the label (e.g. icon); tint externally for contrast. */
  leftIcon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  loading,
  fullWidth,
  leftIcon,
  style,
  textStyle,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isOutline = variant === "outline";
  const isWhite = variant === "white";
  const isSurface = variant === "surface";

  const spinnerColor = isWhite
    ? "#1F2937"
    : isPrimary || isSecondary
      ? colors.textOnPrimary
      : colors.primary;

  const label = (
    <Text
      style={[
        styles.text,
        isPrimary && styles.textPrimary,
        isSecondary && styles.textSecondary,
        isWhite && styles.textWhite,
        isOutline && styles.textOutline,
        variant === "ghost" && styles.textGhost,
        isSurface && styles.textSurface,
        disabled && styles.textDisabled,
        textStyle,
      ]}
    >
      {title}
    </Text>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        style,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isWhite && styles.white,
        isOutline && styles.outline,
        variant === "ghost" && styles.ghost,
        isSurface && styles.surface,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : leftIcon ? (
        <View style={styles.contentRow}>
          {leftIcon}
          {label}
        </View>
      ) : (
        label
      )}
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    base: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.lg,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
    },
    fullWidth: { width: "100%" },
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.secondary,
    },
    white: {
      backgroundColor: "#fff",
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: "transparent",
    },
    surface: {
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pressed: { opacity: 0.8 },
    disabled: { opacity: 0.45 },
    contentRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
    },
    text: {
      ...typography.bodyBold,
      color: colors.text,
    },
    textPrimary: { color: colors.textOnPrimary },
    textSecondary: { color: colors.textOnPrimary },
    textWhite: { color: "#1F2937" },
    textOutline: { color: colors.primary },
    textGhost: { color: colors.primary },
    textSurface: { color: colors.text },
    textDisabled: { color: colors.textMuted },
  });
}
