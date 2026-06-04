import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const APP_VERSION =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "—";

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="About GYM +1"
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
        <Text style={styles.brand}>
          GYM <Text style={styles.brandPlus}>+</Text>1
        </Text>
        <Text style={styles.tagline}>
          Your gym accountability partner — find a +1, stay consistent, and
          celebrate progress together.
        </Text>

        <Text style={styles.body}>
          GYM +1 connects people who train with people who train. Whether you
          want a spotter, a weekly check-in, or a crew that shows up, the app
          helps you match on goals, schedule, and vibe — then stay engaged with
          matches, events, and community updates built for lifters.
        </Text>
        <Text style={styles.body}>
          This build is a demo of the product vision. Features and copy will
          evolve as we ship.
        </Text>

        <View style={styles.metaBlock}>
          <Text style={styles.versionLine}>
            <Text style={styles.versionLabel}>Version </Text>
            <Text style={styles.versionNumber}>{APP_VERSION}</Text>
          </Text>
        </View>
        <Text style={styles.footer}>© {new Date().getFullYear()} GYM +1</Text>
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
    brand: {
      ...typography.largeTitle,
      color: colors.text,
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
    },
    brandPlus: {
      color: colors.primary,
    },
    tagline: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 24,
      marginBottom: spacing.lg,
    },
    body: {
      ...typography.subhead,
      color: colors.textMuted,
      lineHeight: 22,
      marginBottom: spacing.md,
    },
    metaBlock: {
      marginTop: spacing.lg,
      alignItems: "center",
    },
    versionLine: {
      textAlign: "center",
    },
    versionLabel: {
      ...typography.body,
      color: colors.textMuted,
    },
    versionNumber: {
      ...typography.body,
      color: colors.text,
      fontVariant: ["tabular-nums"],
    },
    footer: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: spacing.sm,
      textAlign: "center",
    },
  });
}
