import type { ThemeColors } from "@/constants/Theme";
import { spacing } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  insets: EdgeInsets;
};

/** Fixed bottom bar with top border + safe-area padding (primary CTA strip). */
export function ScreenFooterBar({ children, insets }: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.sm }]}>
      {children}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    bar: {
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
    },
  });
}
