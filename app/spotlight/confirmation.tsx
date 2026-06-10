import { Button } from "@/components/Button";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SpotlightConfirmation() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <ScreenHeaderBack
        title="Payment Confirmation"
        onBack={() => router.back()}
        titleAlign="center"
      />
      <View style={styles.content}>
        <View style={styles.badge} />
        <Text style={styles.title}>Purchase Complete!</Text>
        <Text style={styles.body}>
          You now have access to this Spotlight plan. Check your profile to view
          purchased plans.
        </Text>
        <View style={styles.actionBtn}>
          <Button
            title="Return"
            onPress={() => router.replace("/(tabs)")}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingHorizontal: spacing.lg,
      alignItems: "center",
      marginTop: spacing.xl,
    },
    badge: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary,
      marginBottom: spacing.md,
    },
    title: {
      ...typography.title2,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    body: {
      ...typography.subhead,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: spacing.lg,
    },
    actionBtn: { width: "100%" },
  });
}
