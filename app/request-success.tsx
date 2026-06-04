import { Button } from "@/components/Button";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RequestSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);

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
      <Text style={styles.title}>Request sent</Text>
      <Text style={styles.message}>
        Your future +1 might be one workout away. We’ll notify you when they
        respond.
      </Text>
      <View style={styles.actions}>
        <Button
          title="Continue Exploring"
          onPress={() => router.back()}
          fullWidth
          variant="outline"
          style={{ borderRadius: radius.full, paddingVertical: spacing.xs }}
        />
        <Button
          title="Go Home"
          onPress={() => router.replace("/(tabs)")}
          fullWidth
          variant="primary"
          style={{ borderRadius: radius.full, paddingVertical: spacing.xs }}
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
      backgroundColor: colors.successBg,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
    },
    icon: { fontSize: 36, color: colors.success, fontWeight: "700" },
    title: {
      ...typography.title1,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    message: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.sm,
      lineHeight: 22,
    },
    actions: { width: "100%", gap: spacing.sm, maxWidth: 320 },
  });
}
