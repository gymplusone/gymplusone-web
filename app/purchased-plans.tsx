import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  formatPlanDate,
  MOCK_PURCHASED_PLANS,
  type PurchasedPlan,
} from "@/data/mockPurchasedPlans";
import { useRouter } from "expo-router";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function statusLabel(status: PurchasedPlan["status"]): string {
  switch (status) {
    case "active":
      return "Active";
    case "expired":
      return "Expired";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function PlanCard({
  plan,
  onUpgrade,
}: {
  plan: PurchasedPlan;
  onUpgrade: (plan: PurchasedPlan) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const active = plan.status === "active";
  const ctaLabel = "Upgrade";
  const ctaVariant = "primary";

  return (
    <View style={styles.planCardWrap}>
      {plan.isMostPopular ? (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>Most popular</Text>
        </View>
      ) : null}
      <Card style={styles.planCard}>
        <View style={styles.planHeader}>
          <Text style={styles.planName} numberOfLines={2}>
            {plan.name}
          </Text>
          {/* <View
            style={[
              styles.statusPill,
              active ? styles.statusPillActive : styles.statusPillMuted,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                active ? styles.statusTextActive : styles.statusTextMuted,
              ]}
            >
              {statusLabel(plan.status)}
            </Text>
          </View> */}
        </View>
        <Text style={styles.price}>{plan.priceLabel}</Text>
        <Text style={styles.meta}>
          Started {formatPlanDate(plan.startedAt)}
          {active ? (
            <>
              {" · "}
              Renews {formatPlanDate(plan.renewsAt)}
            </>
          ) : (
            <>
              {" · "}
              Ended {formatPlanDate(plan.renewsAt)}
            </>
          )}
        </Text>
        <View style={styles.perkList}>
          {plan.perks.map((line) => (
            <View key={line} style={styles.perkRow}>
              <Text style={styles.perkDot}>·</Text>
              <Text style={styles.perkText}>{line}</Text>
            </View>
          ))}
        </View>
        <View style={styles.ctaWrap}>
          <Button
            title={ctaLabel}
            variant={ctaVariant}
            fullWidth={true}
            onPress={() => onUpgrade(plan)}
            style={styles.cta}
            textStyle={styles.ctaText}
          />
        </View>
      </Card>
    </View>
  );
}

export default function PurchasedPlansScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const plans = MOCK_PURCHASED_PLANS;
  const [selectedPlan, setSelectedPlan] = useState<PurchasedPlan | null>(null);

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="Purchased plans"
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
            You have not purchased any plans yet. Browse training schedules and
            subscriptions from the app home or matches flow when available.
          </Text>
        ) : (
          plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onUpgrade={(pickedPlan) => setSelectedPlan(pickedPlan)}
            />
          ))
        )}
      </ScrollView>
      <Modal
        visible={selectedPlan != null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPlan(null)}
      >
        <View style={styles.payOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSelectedPlan(null)}
            accessibilityLabel="Close payment sheet"
          />
          <View style={[styles.paySheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <Text style={styles.payTitle}>Confirm Payment</Text>
            {selectedPlan ? (
              <>
                <View style={styles.payRow}>
                  <Text style={styles.payLabel}>Plan</Text>
                  <Text style={styles.payValue}>{selectedPlan.name}</Text>
                </View>
                <View style={styles.payRow}>
                  <Text style={styles.payLabel}>Amount</Text>
                  <Text style={styles.payAmount}>{selectedPlan.priceLabel}</Text>
                </View>
              </>
            ) : null}
            <Pressable
              onPress={() => {
                const planName = selectedPlan?.name ?? "this plan";
                const amount = selectedPlan?.priceLabel ?? "";
                setSelectedPlan(null);
                router.push({
                  pathname: "/payment-success",
                  params: { plan: planName, amount },
                });
              }}
              style={({ pressed }) => [
                styles.applePayBtn,
                pressed && styles.applePayBtnPressed,
              ]}
            >
              <Text style={styles.applePayText}>Pay with {""} Pay</Text>
            </Pressable>
            <Text style={styles.applePayHint}>
              Double-click the side button to pay
            </Text>
            <Pressable
              onPress={() => setSelectedPlan(null)}
              style={({ pressed }) => [styles.payCancel, pressed && styles.payCancelPressed]}
            >
              <Text style={styles.payCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  planCardWrap: {
    position: "relative",
    paddingTop: spacing.md,
  },
  planCard: {
    marginBottom: 0,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: 5,
    left: "50%",
    transform: [{ translateX: -44 }],
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    zIndex: 2,
  },
  popularBadgeText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: "700",
  },
  planHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  planName: {
    ...typography.title1,
    color: colors.text,
    flex: 1,
    minWidth: 0,
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    flexShrink: 0,
  },
  statusPillActive: {
    backgroundColor: colors.primary + "28",
  },
  statusPillMuted: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusText: {
    ...typography.caption,
    fontWeight: "700",
  },
  statusTextActive: {
    color: colors.primary,
  },
  statusTextMuted: {
    color: colors.textMuted,
  },
  price: {
    ...typography.bodyBold,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
    fontWeight: "600",
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  perkList: {
    gap: spacing.xs,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
  },
  perkDot: {
    ...typography.subhead,
    color: colors.primary,
    lineHeight: 20,
  },
  perkText: {
    ...typography.subhead,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  ctaWrap: {
    marginTop: spacing.md,
    alignItems: "flex-start",
  },
  cta: {
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    minHeight: 40,
  },
  ctaText: {
    ...typography.footnote,
    fontWeight: "600",
  },
  payOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  paySheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  payTitle: {
    ...typography.title3,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  payRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  payLabel: {
    ...typography.subhead,
    color: colors.textMuted,
  },
  payValue: {
    ...typography.body,
    color: colors.text,
  },
  payAmount: {
    ...typography.bodyBold,
    color: colors.text,
  },
  applePayBtn: {
    marginTop: spacing.md,
    backgroundColor: "#000000",
    borderRadius: radius.full,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  applePayBtnPressed: {
    opacity: 0.9,
  },
  applePayText: {
    ...typography.bodyBold,
    color: "#FFFFFF",
  },
  applePayHint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  payCancel: {
    marginTop: spacing.sm,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  payCancelPressed: {
    opacity: 0.8,
  },
  payCancelText: {
    ...typography.body,
    color: colors.textMuted,
  },
  });
}
