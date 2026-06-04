import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import { FOOTER_PRIMARY_CTA_BUTTON_STYLE } from "@/constants/eventUI";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { labels } from "@/constants/labels";
import { MOCK_BUDDIES } from "@/data/mockBuddies";
import { useApp } from "@/features/context/AppContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MatchProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { topMatches, sendRequest, hasSentRequest } = useApp();

  const profile = MOCK_BUDDIES.find((b) => b.id === id) ?? null;
  const match = topMatches.find((m) => m.profile.id === id);

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <ScreenHeaderBack title="Profile" onBack={() => router.back()} />
        <Text style={styles.error}>Profile not found.</Text>
        <View style={styles.errorActions}>
          <Button
            title="Back"
            onPress={() => router.back()}
            fullWidth
            style={FOOTER_PRIMARY_CTA_BUTTON_STYLE}
          />
        </View>
      </View>
    );
  }

  const requestSent = hasSentRequest(profile.id);

  const handleSendRequest = () => {
    sendRequest(profile.id);
    router.push("/request-success");
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScreenHeaderBack title="Profile" onBack={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <Avatar initial={profile.avatarPlaceholder} size="lg" />
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>
          <Text style={styles.area}>{profile.area}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals & style</Text>
          <Text style={styles.detail}>
            Goal: {labels.fitnessGoal[profile.fitnessGoal]}
          </Text>
          <Text style={styles.detail}>
            Workout style: {labels.workoutStyle[profile.workoutStyle]}
          </Text>
          <Text style={styles.detail}>
            Fitness level: {labels.fitnessLevel[profile.fitnessLevel]}
          </Text>
          <Text style={styles.detail}>
            Gym type: {labels.gymType[profile.gymType]}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule & vibe</Text>
          <Text style={styles.detail}>
            Preferred time: {labels.preferredTime[profile.preferredTime]}
          </Text>
          <Text style={styles.detail}>
            Available days: {profile.availableDays.join(", ")}
          </Text>
          <Text style={styles.detail}>
            Motivation: {labels.motivationStyle[profile.motivationStyle]}
          </Text>
          <Text style={styles.detail}>
            Personality: {labels.personalityVibe[profile.personalityVibe]}
          </Text>
        </View>
        {match && (
          <Card style={styles.insightsCard}>
            <Text style={styles.sectionTitle}>AI Match Insights</Text>
            <Text style={styles.insightText}>{match.explanation}</Text>
            <Text style={styles.detail}>
              Best time to train together: {match.bestTimeToTrain}
            </Text>
            <Text style={styles.detail}>
              Accountability style: {match.accountabilityStyle}
            </Text>
          </Card>
        )}
        <View style={styles.actions}>
          <Button
            title={requestSent ? "Request sent" : "Send Gym Request"}
            onPress={handleSendRequest}
            variant="primary"
            fullWidth
            disabled={requestSent}
            style={FOOTER_PRIMARY_CTA_BUTTON_STYLE}
          />
          <Button
            title="Start Intro Chat"
            onPress={() => router.push("/(tabs)/messages")}
            variant="outline"
            fullWidth
            style={FOOTER_PRIMARY_CTA_BUTTON_STYLE}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  avatarSection: { alignItems: "center", marginBottom: spacing.xl },
  name: { ...typography.title1, color: colors.text, marginTop: spacing.sm },
  area: { ...typography.subhead, color: colors.textSecondary },
  section: { marginBottom: spacing.lg },
  sectionTitle: {
    ...typography.title3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  bio: { ...typography.body, color: colors.textSecondary, lineHeight: 22 },
  detail: { ...typography.subhead, color: colors.text, marginTop: 2 },
  insightsCard: { marginBottom: spacing.lg },
  insightText: {
    ...typography.callout,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  actions: { gap: spacing.sm, marginTop: spacing.md },
  errorContainer: { flex: 1, backgroundColor: colors.background },
  error: {
    ...typography.body,
    color: colors.error,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  errorActions: { paddingHorizontal: spacing.lg },
  });
}
