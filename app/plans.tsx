import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function PlansScreen() {
  const router = useRouter();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="Plans"
        titleAlign="center"
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <Card style={styles.heroCard}>
          <Text style={styles.title}>Manage your training plans</Text>
          <Text style={styles.subtitle}>
            Browse purchased plans or open your saved plan ideas.
          </Text>
        </Card>

        <Button
          title="Purchased plans"
          variant="secondary"
          fullWidth
          onPress={() => router.push("/purchased-plans")}
        />
        <Button
          title="Saved plans"
          variant="surface"
          fullWidth
          onPress={() => router.push("/saved-plans")}
        />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      gap: spacing.sm,
    },
    heroCard: {
      marginBottom: spacing.sm,
    },
    title: {
      ...typography.title3,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });
}
