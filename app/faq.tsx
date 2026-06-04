import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { MOCK_FAQ } from "@/data/mockFaq";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FaqScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [openId, setOpenId] = useState<string | null>(MOCK_FAQ[0]?.id ?? null);

  const toggle = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="FAQ"
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
        <Text style={styles.intro}>
          Quick answers about GYM +1. Tap a question to expand.
        </Text>

        {MOCK_FAQ.map((item) => {
          const open = openId === item.id;
          return (
            <View key={item.id} style={styles.item}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                accessibilityLabel={item.question}
                onPress={() => toggle(item.id)}
                style={({ pressed }) => [
                  styles.questionRow,
                  pressed && styles.questionRowPressed,
                ]}
              >
                <Text style={styles.question}>{item.question}</Text>
                <Ionicons
                  name={open ? "chevron-up" : "chevron-down"}
                  size={22}
                  color={colors.textMuted}
                  style={styles.chevron}
                />
              </Pressable>
              {open ? (
                <Text style={styles.answer}>{item.answer}</Text>
              ) : null}
            </View>
          );
        })}
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
    intro: {
      ...typography.subhead,
      color: colors.textMuted,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
    item: {
      marginBottom: spacing.xs,
    },
    questionRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.sm,
      paddingVertical: spacing.md,
    },
    questionRowPressed: {
      opacity: 0.88,
    },
    question: {
      ...typography.bodyBold,
      color: colors.text,
      flex: 1,
      lineHeight: 22,
    },
    chevron: {
      marginTop: 2,
      flexShrink: 0,
    },
    answer: {
      ...typography.subhead,
      color: colors.textSecondary,
      lineHeight: 22,
      paddingBottom: spacing.md,
      paddingRight: spacing.xxl,
    },
  });
}
