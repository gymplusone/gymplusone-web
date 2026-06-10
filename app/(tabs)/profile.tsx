import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { labels } from "@/constants/labels";
import { useApp } from "@/features/context/AppContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const { onboardingData, hasCompletedOnboarding } = useApp();

  if (!hasCompletedOnboarding || !onboardingData) {
    return (
      <View
        style={[
          styles.container,
          styles.emptyContainer,
          { paddingTop: insets.top + spacing.lg },
        ]}
      >
        <Text style={styles.empty}>
          Complete onboarding to see your profile.
        </Text>
        <Button
          title="Get started"
          onPress={() => router.replace("/welcome")}
          fullWidth
        />
      </View>
    );
  }

  const d = onboardingData;
  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          key: "account",
          label: "Account details",
          icon: "👤",
          onPress: () => {},
        },
        { key: "privacy", label: "Privacy", icon: "🔒", onPress: () => {} },
        {
          key: "notifications",
          label: "Notifications",
          icon: "🔔",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          key: "chats",
          label: "Chats",
          icon: "💬",
          onPress: () => router.push("/(tabs)/messages"),
        },
        {
          key: "invite",
          label: "Invite a friend",
          icon: "🎁",
          onPress: () => {},
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          key: "help",
          label: "Help & feedback",
          icon: "🛟",
          onPress: () => router.push("/contact"),
        },
      ],
    },
    {
      title: "Legal",
      items: [
        {
          key: "terms",
          label: "Terms & policies",
          icon: "📄",
          onPress: () => {},
        },
        { key: "about", label: "About GYM +1", icon: "ℹ️", onPress: () => {} },
      ],
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Avatar initial={d.firstName || "U"} size="lg" />
          <View style={styles.heroText}>
            <Text style={styles.title}>{d.firstName}</Text>
            <Text style={styles.subtitle}>
              {d.ageRange} · {d.area}
            </Text>
            <Text style={styles.helper}>Your accountability profile</Text>
          </View>
        </View>
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {labels.fitnessGoal[d.fitnessGoal]}
            </Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {labels.workoutStyle[d.workoutStyle]}
            </Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {labels.confidenceLevel[d.confidenceLevel]}
            </Text>
          </View>
        </View>
      </View>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Training preferences</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fitness goal</Text>
          <Text style={styles.detailValue}>
            {labels.fitnessGoal[d.fitnessGoal]}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Workout style</Text>
          <Text style={styles.detailValue}>
            {labels.workoutStyle[d.workoutStyle]}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fitness level</Text>
          <Text style={styles.detailValue}>
            {labels.fitnessLevel[d.fitnessLevel]}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gym frequency</Text>
          <Text style={styles.detailValue}>
            {labels.gymFrequency[d.gymFrequency]}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Preferred time</Text>
          <Text style={styles.detailValue}>
            {labels.preferredTime[d.preferredTime]}
          </Text>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Motivation & vibe</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Motivation style</Text>
          <Text style={styles.detailValue}>
            {labels.motivationStyle[d.motivationStyle]}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Personality</Text>
          <Text style={styles.detailValue}>
            {labels.personalityVibe[d.personalityVibe]}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Confidence</Text>
          <Text style={styles.detailValue}>
            {labels.confidenceLevel[d.confidenceLevel]}
          </Text>
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Gym setup</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Area</Text>
          <Text style={styles.detailValue}>{d.area}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gym type</Text>
          <Text style={styles.detailValue}>{labels.gymType[d.gymType]}</Text>
        </View>
      </Card>

      <View style={styles.settingsBlock}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {settingsSections.map((section) => (
          <Card key={section.title} style={styles.settingsSectionCard}>
            <Text style={styles.settingsSectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <Pressable
                key={item.key}
                onPress={item.onPress}
                style={({ pressed }) => [
                  styles.settingsRow,
                  pressed && styles.settingsRowPressed,
                ]}
              >
                <View style={styles.settingsLeft}>
                  <Text style={styles.settingsIcon}>{item.icon}</Text>
                  <Text style={styles.settingsLabel}>{item.label}</Text>
                </View>
                <Text style={styles.settingsChevron}>›</Text>
              </Pressable>
            ))}
          </Card>
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          title="Edit profile"
          onPress={() => router.push("/onboarding")}
          variant="secondary"
          fullWidth
          style={{ borderRadius: radius.full, paddingVertical: spacing.xs }}
        />
      </View>
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    emptyContainer: { paddingHorizontal: spacing.lg },
    content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
    heroCard: { marginBottom: spacing.md },
    heroTop: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    heroText: { marginTop: spacing.sm, alignItems: "center" },
    title: { ...typography.title1, color: colors.text },
    subtitle: {
      ...typography.subhead,
      color: colors.textSecondary,
      marginTop: 2,
    },
    helper: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
    chipRow: {
      flexDirection: "row",
      gap: spacing.xs,
      marginTop: spacing.md,
      flexWrap: "wrap",
      justifyContent: "center",
    },
    chip: {
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    chipText: { ...typography.caption, color: colors.textSecondary },
    sectionCard: { marginBottom: spacing.md },
    sectionTitle: {
      ...typography.title3,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    detailLabel: { ...typography.subhead, color: colors.textMuted, flex: 1 },
    detailValue: {
      ...typography.bodyBold,
      color: colors.text,
      flex: 1,
      textAlign: "right",
    },
    settingsBlock: { marginBottom: spacing.md },
    settingsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    settingsRowPressed: { opacity: 0.85 },
    settingsSectionCard: { marginBottom: spacing.md },
    settingsSectionTitle: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    settingsLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    settingsIcon: { fontSize: 16 },
    settingsLabel: { ...typography.body, color: colors.text },
    settingsChevron: { ...typography.title3, color: colors.textMuted },
    actions: { marginTop: spacing.lg },
    empty: {
      ...typography.body,
      color: colors.textSecondary,
      padding: spacing.lg,
    },
  });
}
