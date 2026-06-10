import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CONTACT_OPTIONS = [
  { id: "general", label: "Ask a general question" },
  { id: "payment", label: "Help with payment" },
  { id: "safety", label: "Report a safety concern" },
  { id: "technical", label: "Report a technical issue" },
] as const;

export default function ContactScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const onOptionPress = useCallback(
    (id: string) => {
      router.push(`/contact/${id}`);
    },
    [router],
  );

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="Contact"
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
        <Text style={styles.blurb}>
          Choose a topic so we can get you to the right team. You’ll be able to
          send a message from here in a future release.
        </Text>
        <View style={styles.list}>
          {CONTACT_OPTIONS.map((opt) => (
            <Pressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityLabel={opt.label}
              onPress={() => onOptionPress(opt.id)}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <Text style={styles.rowLabel}>{opt.label}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textMuted}
              />
            </Pressable>
          ))}
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
    blurb: {
      ...typography.subhead,
      color: colors.textMuted,
      lineHeight: 20,
      marginBottom: spacing.lg,
    },
    list: {
      gap: spacing.xs,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
      gap: spacing.sm,
    },
    rowPressed: {
      opacity: 0.88,
    },
    rowLabel: {
      ...typography.body,
      color: colors.text,
      flex: 1,
    },
  });
}
