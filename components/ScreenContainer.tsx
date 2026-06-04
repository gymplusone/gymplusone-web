import type { ThemeColors } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

/** Wraps content with safe area insets and background. Content controls its own padding. */
export function ScreenContainer({
  children,
  style,
  contentStyle,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1 },
  });
}
