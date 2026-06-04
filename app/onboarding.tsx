import { Button } from "@/components/Button";
import { LoadingState } from "@/components/LoadingState";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import {
  ageRanges,
  areaOptions,
  confidenceLevelOptions,
  fitnessGoalOptions,
  fitnessLevelOptions,
  genderPreferenceOptions,
  gymFrequencyOptions,
  gymTypeOptions,
  motivationStyleOptions,
  personalityVibeOptions,
  preferredTimeOptions,
  workoutStyleOptions,
} from "@/data/onboardingOptions";
import { useApp } from "@/features/context/AppContext";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import type { OnboardingData } from "@/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STEPS = [
  { key: "firstName", title: "What's your first name?", type: "text" as const },
  {
    key: "ageRange",
    title: "Age range",
    type: "select" as const,
    options: ageRanges,
  },
  {
    key: "genderPreference",
    title: "Partner preference",
    type: "select" as const,
    options: genderPreferenceOptions,
  },
  {
    key: "fitnessGoal",
    title: "Your fitness goal",
    type: "select" as const,
    options: fitnessGoalOptions,
  },
  {
    key: "workoutStyle",
    title: "Workout style",
    type: "select" as const,
    options: workoutStyleOptions,
  },
  {
    key: "fitnessLevel",
    title: "Fitness level",
    type: "select" as const,
    options: fitnessLevelOptions,
  },
  {
    key: "gymFrequency",
    title: "Gym frequency",
    type: "select" as const,
    options: gymFrequencyOptions,
  },
  {
    key: "preferredTime",
    title: "Preferred workout time",
    type: "select" as const,
    options: preferredTimeOptions,
  },
  {
    key: "motivationStyle",
    title: "Motivation style",
    type: "select" as const,
    options: motivationStyleOptions,
  },
  {
    key: "personalityVibe",
    title: "Personality vibe",
    type: "select" as const,
    options: personalityVibeOptions,
  },
  { key: "area", title: "Area", type: "select" as const, options: areaOptions },
  {
    key: "gymType",
    title: "Gym type",
    type: "select" as const,
    options: gymTypeOptions,
  },
  {
    key: "confidenceLevel",
    title: "Confidence in gym",
    type: "select" as const,
    options: confidenceLevelOptions,
  },
];

const defaultData: OnboardingData = {
  firstName: "",
  ageRange: "",
  genderPreference: "no_preference",
  fitnessGoal: "general_fitness",
  workoutStyle: "mixed",
  fitnessLevel: "beginner",
  gymFrequency: "1_2",
  preferredTime: "evening",
  motivationStyle: "encouragement",
  personalityVibe: "calm",
  area: "Central London",
  gymType: "commercial_gym",
  confidenceLevel: "medium",
};

type StepOption = { value: string; label?: string } | string;

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles((themeColors) => createStyles(themeColors, isDark), [isDark]);
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [generating, setGenerating] = useState(false);

  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const value = data[current.key as keyof OnboardingData];
  const optionList = current.type === "select" ? current.options : null;

  const update = (key: keyof OnboardingData, val: string) => {
    setData((prev) => ({ ...prev, [key]: val }));
  };

  const next = () => {
    if (isLast) {
      setGenerating(true);
      setTimeout(() => {
        completeOnboarding(data);
        setGenerating(false);
        router.replace("/match-results");
      }, 2200);
      return;
    }
    setStep((s) => s + 1);
  };

  const back = () => {
    if (isFirst) router.back();
    else setStep((s) => s - 1);
  };

  const canNext = () => {
    if (current.key === "firstName")
      return (value as string)?.trim().length > 0;
    return value != null && String(value).length > 0;
  };

  if (generating) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <LoadingState
          title="Generating your best matches..."
          subtitle="We're finding gym plus one who fit your vibe."
        />
      </View>
    );
  }

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        {/* <Pressable onPress={back} style={styles.backBtn} hitSlop={12}>
          <Text style={styles.backText}>{isFirst ? '← Back' : '← Previous'}</Text>
        </Pressable> */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.stepIndicator}>
            Step {step + 1} of {STEPS.length}
          </Text>
        </View>
      </View>

      <Text style={styles.stepTitle}>{current.title}</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {current.type === "text" && (
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            cursorColor={colors.primary}
            value={value as string}
            onChangeText={(t) => update("firstName", t)}
            autoCapitalize="words"
          />
        )}
        {current.type === "select" && optionList && (
          <View style={styles.options}>
            {(Array.isArray(optionList) ? optionList : []).map(
              (opt: StepOption) => {
                const v = typeof opt === "string" ? opt : opt.value;
                const label =
                  typeof opt === "string" ? opt : (opt.label ?? opt.value);
                const selected = value === v;
                return (
                  <TouchableOpacity
                    key={v}
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() =>
                      update(current.key as keyof OnboardingData, v)
                    }
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        )}
      </ScrollView>
      <View
        style={[styles.footer, { paddingBottom: insets.bottom - spacing.lg }]}
      >
        <Button
          title={isLast ? "Find my matches" : "Continue"}
          onPress={next}
          disabled={!canNext()}
          fullWidth
          variant="secondary"
          style={{ borderRadius: radius.full, paddingVertical: spacing.sm }}
        />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors, isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.lg,
    },
    header: { marginBottom: spacing.md },
    backBtn: { marginBottom: spacing.xs },
    backText: { ...typography.body, color: colors.primary },
    progressWrap: { marginTop: spacing.xs },
    progressTrack: {
      height: 6,
      backgroundColor: colors.borderLight,
      borderRadius: radius.full,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: colors.secondary,
      borderRadius: radius.full,
    },
    stepIndicator: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: spacing.xxs,
    },
    stepTitle: {
      ...typography.title1,
      color: colors.text,
      marginBottom: spacing.lg,
    },
    scroll: { flex: 1 },
    scrollContent: {},
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.sm,
      ...typography.body,
      color: colors.text,
    },
    options: { gap: spacing.xs },
    option: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      padding: spacing.sm,
    },
    optionSelected: {
      borderColor: colors.secondary,
      backgroundColor: colors.secondary + "14",
    },
    optionText: { ...typography.body, color: colors.text },
    optionTextSelected: {
      color: isDark ? colors.textOnPrimary : colors.primary,
      fontWeight: "600",
    },
    footer: {},
  });
}
