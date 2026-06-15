import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { Asset } from "expo-asset";
import * as Sharing from "expo-sharing";
import { Feather } from "@expo/vector-icons";
import { Fragment } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LAST_UPDATED = "25 March 2026";

const SECTIONS: { title: string; paragraphs: string[] }[] = [
  {
    title: "Introduction",
    paragraphs: [
      'GYM +1 ("we", "us") respects your privacy. This policy describes how we handle personal information in the mobile app during this demo and as the product matures. It is not legal advice; a lawyer-reviewed policy will ship before production.',
    ],
  },
  {
    title: "What we collect",
    paragraphs: [
      "Account and profile data you provide (such as name, training preferences, gym area, and photos you choose to upload).",
      "Usage data needed to run the app (for example device type, crash logs, and product analytics when enabled).",
      "Communications you send through support or in-app messaging, so we can respond and improve safety.",
    ],
  },
  {
    title: "How we use information",
    paragraphs: [
      "To create and improve matches, community features, and notifications you opt into.",
      "To keep the service secure, enforce our rules, and investigate reports (including safety concerns).",
      "To process payments when you buy plans or subscriptions, through our payment partners.",
    ],
  },
  {
    title: "Sharing",
    paragraphs: [
      "We do not sell your personal information. We may share data with service providers who help us host, analyze, or deliver the app, bound by contracts.",
      "We may disclose information if required by law or to protect users and the public, where permitted.",
    ],
  },
  {
    title: "Your choices",
    paragraphs: [
      "You can update many profile fields in settings. Notification and marketing preferences will be manageable in-app as we wire them.",
      "You may request access, correction, or deletion where applicable law applies; contact us via Settings → Contact.",
    ],
  },
  {
    title: "Retention & security",
    paragraphs: [
      "We keep information only as long as needed for the purposes above or as the law requires. Demo builds may reset or use mock storage.",
      "We use industry-standard safeguards, but no method of transmission over the internet is completely secure.",
    ],
  },
  {
    title: "Changes",
    paragraphs: [
      "We may update this policy and will adjust the “Last updated” date. Continued use after changes means you accept the revised policy, unless law requires otherwise.",
    ],
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);

  const openPDF = async () => {
    try {
      const [asset] = await Asset.loadAsync(
        require("@/assets/GymPlusOne_Privacy_Policy.pdf")
      );
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable && asset.localUri) {
        await Sharing.shareAsync(asset.localUri, {
          mimeType: "application/pdf",
          dialogTitle: "GYM+1 Privacy Policy",
        });
      }
    } catch {
      // silently fail
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="Privacy"
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
        <Text style={styles.updated}>Last updated: {LAST_UPDATED}</Text>

        {/* Open PDF button */}
        <Pressable
          onPress={openPDF}
          style={({ pressed }) => ({
            flexDirection: "row" as const,
            alignItems: "center" as const,
            justifyContent: "center" as const,
            gap: 8,
            backgroundColor: "#0001FF",
            borderRadius: 10,
            paddingVertical: 14,
            marginBottom: 24,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Feather name="file-text" size={18} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
            View Full Document (PDF)
          </Text>
        </Pressable>

        {SECTIONS.map((section) => (
          <Fragment key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.paragraphs.map((p, i) => (
              <Text
                key={`${section.title}-${i}`}
                style={styles.paragraph}
              >
                {p}
              </Text>
            ))}
          </Fragment>
        ))}
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
    updated: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.lg,
      marginTop: spacing.xs,
    },
    sectionTitle: {
      ...typography.title3,
      color: colors.text,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    paragraph: {
      ...typography.subhead,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.md,
    },
  });
}
