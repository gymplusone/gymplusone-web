import { Button } from "@/components/Button";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SAMPLE_IMAGE = require("@/assets/images/gym/2149278038.jpg");

export default function SpotlightIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <ScreenHeaderBack
        title="Spotlight"
        onBack={() => router.back()}
        titleAlign="center"
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image source={SAMPLE_IMAGE} style={styles.hero} />
        <Text style={styles.title}>Muscle Building Plan</Text>
        <Text style={styles.price}>£39.99</Text>
        <Text style={styles.desc}>
          A focused 12 week plan designed to increase muscle mass and strength.
        </Text>

        <View style={styles.actions}>
          <Button
            title="Buy plan"
            onPress={() => router.push("/spotlight/purchase")}
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
    hero: {
      width: "100%",
      height: 220,
      borderRadius: 8,
      marginBottom: spacing.md,
    },
    title: {
      ...typography.title2,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    price: {
      ...typography.title3,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    desc: {
      ...typography.body,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    actions: { marginTop: spacing.md },
  });
}
