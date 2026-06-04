import { Button } from "@/components/Button";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const params = useLocalSearchParams<{ plan?: string; amount?: string }>();
  const plan = params.plan ?? "Selected plan";
  const amount = params.amount ?? "";

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.xxl,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.lg,
        },
      ]}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>✓</Text>
      </View>
      <Text style={styles.title}>Payment successful</Text>
      <Text style={styles.message}>
        {amount
          ? `You are now on ${plan} (${amount}).`
          : `You are now on ${plan}.`}{" "}
        Your premium features are active.
      </Text>
      <Text style={styles.perksText}>
        You now have the following for a month:
      </Text>
      <Text style={styles.perksList}>
        • Unlimited likes and matches{"\n"}
        • 1 hour daily spotlight visibility{"\n"}
        • View invitations & see invitees' profiles{"\n"}
        • View full thread of other{"\n"}
        • Premium profile (increased visibility)
      </Text>
      <View style={styles.actions}>
        <Button
          title="Go Home"
          onPress={() => router.replace("/(tabs)")}
          variant="primary"
          style={styles.goHomeBtn}
          textStyle={styles.goHomeBtnText}
        />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
      alignItems: "center",
    },
    iconWrap: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.primary + "88",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
    },
    icon: { fontSize: 36, color: colors.primary, fontWeight: "700" },
    title: {
      ...typography.title1,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    message: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.sm,
      lineHeight: 22,
    },
    perksText: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: "center",
      alignSelf: "center",
      marginBottom: spacing.md,
      lineHeight: 22,
      maxWidth: 320,
      fontWeight: "600",
    },
    perksList: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: "center",
      alignSelf: "stretch",
      marginBottom: spacing.xl,
      lineHeight: 22,
    },
    goHomeBtn: {
      borderRadius: radius.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.lg,
      minHeight: 40,
      alignSelf: "center",
    },
    goHomeBtnText: {
      ...typography.bodyBold,
      fontSize: 14,
      fontWeight: "600",
    },
    actions: { width: "100%", gap: spacing.sm, maxWidth: 320 },
  });
}
