import { Card } from "@/components/Card";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  formatSavedPlanDate,
  MOCK_SAVED_PLANS,
  type SavedPlan,
} from "@/data/mockSavedPlans";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ThemedStyles = ReturnType<typeof createStyles>;

function SavedPlanCard({ plan, styles }: { plan: SavedPlan; styles: ThemedStyles }) {
  const weeks =
    plan.durationWeeks === 1 ? "1 week" : `${plan.durationWeeks} weeks`;

  return (
    <Card style={styles.planCard}>
      <View style={styles.planHeader}>
        <Text style={styles.planName} numberOfLines={2}>
          {plan.name}
        </Text>
        <View style={styles.savedPill}>
          <Text style={styles.savedPillText}>Saved</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        Saved {formatSavedPlanDate(plan.savedAt)} · {plan.focus} · {weeks}
      </Text>
      <View style={styles.highlightList}>
        {plan.highlights.map((line) => (
          <View key={line} style={styles.highlightRow}>
            <Text style={styles.highlightDot}>·</Text>
            <Text style={styles.highlightText}>{line}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

export default function SavedPlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const plans = MOCK_SAVED_PLANS;
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="Saved plans"
        titleAlign="center"
        onBack={() => router.back()}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {plans.length === 0 ? (
          <Text style={styles.empty}>
            No saved plans yet. When you bookmark a program from discover or a
            buddy’s share, it will show up here.
          </Text>
        ) : (
          plans.map((plan) => (
            <SavedPlanCard key={plan.id} plan={plan} styles={styles} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
    },
    empty: {
      ...typography.body,
      color: colors.textSecondary,
      marginTop: spacing.md,
    },
    planCard: {
      marginBottom: 0,
    },
    planHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.sm,
      marginBottom: spacing.xs,
    },
    planName: {
      ...typography.title3,
      color: colors.text,
      flex: 1,
      minWidth: 0,
    },
    savedPill: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: radius.full,
      flexShrink: 0,
      backgroundColor: colors.primary + "28",
    },
    savedPillText: {
      ...typography.caption,
      fontWeight: "700",
      color: colors.primary,
    },
    meta: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.md,
      lineHeight: 18,
    },
    highlightList: {
      gap: spacing.xs,
    },
    highlightRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.xs,
    },
    highlightDot: {
      ...typography.subhead,
      color: colors.primary,
      lineHeight: 20,
    },
    highlightText: {
      ...typography.subhead,
      color: colors.textSecondary,
      flex: 1,
      lineHeight: 20,
    },
  });
}
