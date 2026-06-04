import type { ThemeColors } from "@/constants/Theme";
import { radius, shadows, spacing } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevated?: boolean;
  noPadding?: boolean;
};

export function Card({
  children,
  onPress,
  style,
  elevated = true,
  noPadding = false,
}: CardProps) {
  const styles = useThemedStyles(createStyles);
  const cardStyle = [
    styles.card,
    elevated && shadows.sm,
    !noPadding && styles.padding,
  ];

  if (onPress) {
    return (
      <Pressable style={[cardStyle, style]} onPress={onPress}>
        {children}
      </Pressable>
    );
  }
  return <View style={[cardStyle, style]}>{children}</View>;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      overflow: "hidden",
    },
    padding: {
      padding: spacing.lg,
    },
  });
}
