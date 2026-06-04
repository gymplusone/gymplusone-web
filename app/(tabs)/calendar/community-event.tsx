import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Placeholder — align with community event create flow when API exists */
export default function CommunityEventScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <ScreenHeaderBack title="Community event" onBack={() => router.back()} />
      <View style={styles.body}>
        <Text style={styles.lead}>
          Create an event people near you can discover and join.
        </Text>
        <Text style={styles.hint}>Full flow coming soon.</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    body: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
    lead: { ...typography.body, color: colors.text, marginBottom: spacing.sm },
    hint: { ...typography.subhead, color: colors.textMuted },
  });
}
