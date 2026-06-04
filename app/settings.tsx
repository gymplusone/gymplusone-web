import { Avatar } from "@/components/Avatar";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { labels } from "@/constants/labels";
import { useApp } from "@/features/context/AppContext";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { requestAppRating } from "@/utils/rateApp";
import type { OnboardingData } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Demo fallback when onboarding is skipped or storage is empty. */
const DEMO_SETTINGS_PROFILE: OnboardingData = {
  firstName: "Alex",
  ageRange: "26–30",
  genderPreference: "no_preference",
  fitnessGoal: "build_muscle",
  workoutStyle: "strength_training",
  fitnessLevel: "intermediate",
  gymFrequency: "3_4",
  preferredTime: "evening",
  motivationStyle: "accountability_checkins",
  personalityVibe: "focused",
  area: "London, UK",
  gymType: "commercial_gym",
  confidenceLevel: "medium",
};

function profileCompletionPercent(d: OnboardingData): number {
  const keys = Object.keys(d) as (keyof OnboardingData)[];
  const filled = keys.filter((k) => String(d[k]).length > 0).length;
  const core = filled / keys.length;
  // Photo / bio aren’t stored yet; scale so full onboarding reads in the “still room to grow” range.
  return Math.min(100, Math.max(12, Math.round(core * 100 * 0.35)));
}

function ageFromRange(ageRange: string): string {
  const nums = ageRange.match(/\d+/g)?.map(Number) ?? [];
  if (nums.length >= 2) return String(Math.round((nums[0] + nums[1]) / 2));
  if (nums.length === 1) return String(nums[0]);
  return ageRange;
}

type SettingsStyles = ReturnType<typeof createStyles>;

function SettingsLink({
  label,
  onPress,
  styles,
}: {
  label: string;
  onPress: () => void;
  styles: SettingsStyles;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        styles.rowTouchable,
        pressed && styles.rowPressed,
      ]}
    >
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { onboardingData, switchAccountEnabled, setSwitchAccountEnabled } =
    useApp();
  const { colors, isDark, setColorScheme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Demo: always show full settings; use stored onboarding or a placeholder profile.
  // if (!hasCompletedOnboarding || !onboardingData) { … empty state … }

  const d = onboardingData ?? DEMO_SETTINGS_PROFILE;

  const completion = useMemo(
    () => profileCompletionPercent(d),
    [d],
  );
  const displayAge = useMemo(() => ageFromRange(d.ageRange), [d.ageRange]);
  const bioLine = `Focused on ${labels.fitnessGoal[d.fitnessGoal].toLowerCase()} · ${labels.personalityVibe[d.personalityVibe].toLowerCase()} energy`;

  const goEditProfile = () => router.push("/onboarding");

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="Settings"
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
        <View style={styles.profileHeader}>
          <View style={styles.profileTopRow}>
            <View style={styles.profileMainRow}>
              <View style={styles.avatarColumn}>
                <Avatar initial={d.firstName || "U"} size="lg" />
                <View
                  style={styles.completionBadge}
                  accessibilityLabel={`Profile ${completion} percent complete`}
                >
                  <Text style={styles.completionBadgeText}>{completion}%</Text>
                </View>
              </View>
              <View style={styles.profileTextColumn}>
                <View style={styles.profileText}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {d.firstName}, {displayAge}
                  </Text>
                  <Text style={styles.profileLocation} numberOfLines={1}>
                    {d.area}
                  </Text>
                  <Text style={styles.profileBio} numberOfLines={3}>
                    {bioLine}
                  </Text>
                </View>
                <Pressable
                  onPress={goEditProfile}
                  accessibilityRole="button"
                  accessibilityLabel="Complete profile"
                  style={({ pressed }) => [
                    styles.completeProfileBtn,
                    pressed && styles.completeProfileBtnPressed,
                  ]}
                >
                  <Text style={styles.completeProfileBtnText}>
                    Complete profile
                  </Text>
                </Pressable>
              </View>
            </View>
            <Pressable
              onPress={goEditProfile}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              style={({ pressed }) => [
                styles.editBtn,
                pressed && styles.editBtnPressed,
              ]}
            >
              <Ionicons name="pencil" size={15} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionHeading}>General</Text>
        <View style={styles.generalBlock}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Switch Account</Text>
            <Switch
              value={switchAccountEnabled}
              onValueChange={setSwitchAccountEnabled}
              trackColor={{ false: colors.border, true: colors.primaryDark }}
              thumbColor={colors.surfaceElevated}
              ios_backgroundColor={colors.border}
            />
          </View>
          <SettingsLink
            label="Advance Subscriptions"
            onPress={() => {}}
            styles={styles}
          />
          <SettingsLink
            label="Purchased Plans"
            onPress={() => router.push("/purchased-plans")}
            styles={styles}
          />
          <SettingsLink
            label="Saved Plans"
            onPress={() => router.push("/saved-plans")}
            styles={styles}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => {}}
            style={({ pressed }) => [
              styles.row,
              styles.rowTouchable,
              pressed && styles.rowPressed,
            ]}
          >
            <Text style={styles.rowLabel}>Language</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>English</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textMuted}
              />
            </View>
          </Pressable>
        </View>

        <Text style={styles.sectionHeading}>Application settings</Text>
        <View style={styles.generalBlock}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primaryDark }}
              thumbColor={colors.surfaceElevated}
              ios_backgroundColor={colors.border}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={(v) => setColorScheme(v ? "dark" : "light")}
              trackColor={{ false: colors.border, true: colors.primaryDark }}
              thumbColor={colors.surfaceElevated}
              ios_backgroundColor={colors.border}
            />
          </View>
          <SettingsLink
            label="About GYM +1"
            onPress={() => router.push("/about")}
            styles={styles}
          />
          <SettingsLink
            label="Contact"
            onPress={() => router.push("/contact")}
            styles={styles}
          />
          <SettingsLink
            label="FAQ"
            onPress={() => router.push("/faq")}
            styles={styles}
          />
          <SettingsLink
            label="Privacy"
            onPress={() => router.push("/privacy")}
            styles={styles}
          />
          <SettingsLink
            label="Rate app"
            onPress={() => {
              void requestAppRating();
            }}
            styles={styles}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out"
            onPress={() => {}}
            style={({ pressed }) => [
              styles.row,
              styles.rowTouchable,
              pressed && styles.rowPressed,
            ]}
          >
            <Text style={styles.rowLabel}>Log out</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            onPress={() => {}}
            style={({ pressed }) => [
              styles.row,
              styles.rowTouchable,
              pressed && styles.rowPressed,
            ]}
          >
            <Text style={[styles.rowLabel, styles.rowLabelDestructive]}>
              Delete account
            </Text>
          </Pressable>
        </View>
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
    },
    profileHeader: {
      marginBottom: spacing.lg,
    },
    profileTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    editBtn: {
      padding: spacing.xs,
      marginTop: spacing.xxs,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    editBtnPressed: {
      opacity: 0.85,
    },
    profileMainRow: {
      flex: 1,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
      minWidth: 0,
    },
    avatarColumn: {
      alignItems: "center",
    },
    completionBadge: {
      marginTop: -10,
      backgroundColor: colors.text,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: radius.full,
    },
    completionBadgeText: {
      ...typography.caption,
      fontSize: 11,
      fontWeight: "700",
      color: colors.background,
    },
    profileTextColumn: {
      flex: 1,
      minWidth: 0,
      paddingTop: spacing.xxs,
    },
    profileText: {
      minWidth: 0,
    },
    profileName: {
      ...typography.title3,
      color: colors.text,
    },
    profileLocation: {
      ...typography.subhead,
      color: colors.textMuted,
      marginTop: 2,
    },
    profileBio: {
      ...typography.subhead,
      color: colors.textSecondary,
      marginTop: spacing.xs,
      lineHeight: 20,
    },
    completeProfileBtn: {
      alignSelf: "flex-start",
      marginTop: spacing.sm,
      paddingVertical: 6,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    completeProfileBtnPressed: {
      opacity: 0.88,
    },
    completeProfileBtnText: {
      ...typography.footnote,
      fontWeight: "600",
      color: colors.text,
    },
    sectionHeading: {
      ...typography.caption,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: spacing.sm,
      marginTop: spacing.xs,
    },
    generalBlock: {
      marginBottom: spacing.lg,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
    },
    rowTouchable: {},
    rowPressed: {
      opacity: 0.88,
    },
    rowLabel: {
      ...typography.body,
      color: colors.text,
      flex: 1,
      marginRight: spacing.sm,
    },
    rowLabelDestructive: {
      color: colors.error,
    },
    rowRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xxs,
    },
    rowValue: {
      ...typography.subhead,
      color: colors.textMuted,
    },
  });
}
