import { brandPrimary } from "@/constants/Theme";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path, Circle, Rect, G, Defs, ClipPath } from "react-native-svg";

/* ─── Inline SVG social icons ────────────────────────────────────── */

function FacebookIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.38823 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
        fill="#1877F2"
      />
    </Svg>
  );
}

function AppleIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.05 20.28C16.07 21.23 15 21.08 13.97 20.63C12.88 20.17 11.88 20.15 10.73 20.63C9.29 21.25 8.53 21.07 7.67 20.28C2.79 15.25 3.51 7.59 9.05 7.31C10.4 7.38 11.34 8.05 12.13 8.11C13.31 7.87 14.44 7.18 15.71 7.27C17.22 7.39 18.36 7.99 19.12 9.07C15.98 10.94 16.72 15.05 19.57 16.2C18.97 17.82 18.18 19.42 17.04 20.29L17.05 20.28ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3C16.06 5.58 13.43 7.5 12.03 7.25Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

function GoogleIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
        fill="#4285F4"
      />
      <Path
        d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.71 16.69 5.84 14.09H2.18V16.94C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.06H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.94L5.84 14.09Z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.7 1 3.99 3.47 2.18 7.06L5.84 9.91C6.71 7.31 9.13 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </Svg>
  );
}

/* ─── Main screen ─────────────────────────────────────────────────── */

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);

  return (
    <LinearGradient
      colors={["#0a0a2e", "#0001FF", "#1a3af5", "#2962FF"]}
      locations={[0, 0.35, 0.65, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacing.lg,
            paddingBottom: insets.bottom + spacing.md,
          },
        ]}
      >
        {/* ─── Logo & tagline ─── */}
        <View style={styles.logoSection}>
          <Text style={styles.logoText}>Gym+1</Text>
          <Text style={styles.tagline}>Match your workout vibe</Text>
        </View>

        {/* ─── Headline ─── */}
        <View style={styles.headlineSection}>
          <Text style={styles.headline}>
            Get Started With Your{"\n"}Fitness Journey
          </Text>
        </View>

        {/* ─── Buttons ─── */}
        <View style={styles.buttonsSection}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.loginButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/onboarding")}
          >
            <Text style={styles.buttonText}>Log in</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.signupButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/onboarding")}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>
        </View>

        {/* ─── Divider ─── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or use one of these options</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ─── Social icons ─── */}
        <View style={styles.socialRow}>
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.pressed,
            ]}
          >
            <FacebookIcon size={32} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.pressed,
            ]}
          >
            <AppleIcon size={32} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.pressed,
            ]}
          >
            <GoogleIcon size={32} />
          </Pressable>
        </View>

        {/* ─── Spacer pushes footer down ─── */}
        <View style={{ flex: 1 }} />

        {/* ─── Footer ─── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>by continuing, you agree to our</Text>
          <View style={styles.footerLinks}>
            <Pressable onPress={() => router.push("/privacy")}>
              <Text style={styles.footerLink}>term of service</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/privacy")}>
              <Text style={styles.footerLink}>privacy policy</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/privacy")}>
              <Text style={styles.footerLink}>content policies</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

/* ─── Styles ──────────────────────────────────────────────────────── */

function createStyles(_colors: ThemeColors) {
  return StyleSheet.create({
    gradient: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },

    /* Logo */
    logoSection: {
      alignItems: "center",
      marginTop: spacing.xxl,
    },
    logoText: {
      fontSize: 42,
      fontWeight: "800",
      color: "#FFFFFF",
      letterSpacing: 1,
    },
    tagline: {
      fontSize: 15,
      fontWeight: "400",
      color: "rgba(255, 255, 255, 0.75)",
      marginTop: spacing.xxs,
      fontStyle: "italic",
    },

    /* Headline */
    headlineSection: {
      alignItems: "center",
      marginTop: spacing.xxl,
      marginBottom: spacing.xl,
    },
    headline: {
      fontSize: 26,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center",
      lineHeight: 34,
    },

    /* Buttons */
    buttonsSection: {
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    button: {
      width: "100%",
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    loginButton: {
      backgroundColor: "rgba(10, 10, 30, 0.75)",
    },
    signupButton: {
      backgroundColor: "rgba(10, 10, 30, 0.55)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.12)",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    pressed: {
      opacity: 0.75,
    },

    /* Divider */
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    dividerLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    dividerText: {
      fontSize: 13,
      color: "rgba(255, 255, 255, 0.6)",
    },

    /* Social */
    socialRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 28,
      marginBottom: spacing.lg,
    },
    socialButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
    },

    /* Footer */
    footer: {
      alignItems: "center",
      paddingBottom: spacing.xs,
    },
    footerText: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.55)",
      marginBottom: spacing.xs,
    },
    footerLinks: {
      flexDirection: "row",
      gap: spacing.md,
    },
    footerLink: {
      fontSize: 11,
      color: "rgba(255, 255, 255, 0.7)",
      textDecorationLine: "underline",
    },
  });
}
