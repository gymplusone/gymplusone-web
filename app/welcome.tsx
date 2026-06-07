import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function SocialButton({ label, dot }: { label: string; dot: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.social, pressed && styles.pressed]}>
      <View style={styles.socialDot}>
        <Text style={styles.socialDotText}>{dot}</Text>
      </View>
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={["#05004b", "#0b0080", "#1418ff", "#0117f0"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.screen}
    >
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 10 },
        ]}
      >
        <View style={styles.topRight}>
          <Pressable
            onPress={() => router.push("/signup")}
            style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
          >
            <Text style={styles.pillText}>Sign up</Text>
          </Pressable>
        </View>

        <View style={styles.brandBlock}>
          <Text style={styles.logo}>Gym+1</Text>
          <Text style={styles.tagline}>Match your workout vibe</Text>
        </View>

        <Text style={styles.headline}>
          Get Started With Your{"\n"}Fitness Journey
        </Text>

        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.input}
          />
          <Pressable
            onPress={() => router.push("/onboarding")}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </Pressable>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.or}>Or</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialStack}>
          <SocialButton label="Continue With Facebook" dot="f" />
          <SocialButton label="Continue With Google" dot="G" />
          <SocialButton label="Continue With Apple" dot="A" />
        </View>

        <View style={styles.spacer} />
        <View style={styles.footer}>
          <View style={styles.bioRow}>
            <Text style={styles.bioText}>Face ID</Text>
            <Text style={styles.bioText}>Finger Print</Text>
          </View>
          <Text style={styles.terms}>by continuing, you agree to our</Text>
          <Text style={styles.links}>
            term of service     privacy policy     content policies
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 28 },
  topRight: { alignItems: "flex-end" },
  pill: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillText: { color: "#FFFFFF", fontSize: 12, fontWeight: "500" },
  brandBlock: { alignItems: "center", marginTop: 78 },
  logo: {
    color: "#FFFFFF",
    fontSize: 38,
    fontStyle: "italic",
    fontWeight: "900",
  },
  tagline: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 12,
    fontStyle: "italic",
  },
  headline: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    lineHeight: 28,
    marginTop: 32,
    textAlign: "center",
  },
  form: { gap: 14, marginTop: 30 },
  input: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 4,
    color: "#FFFFFF",
    height: 48,
    paddingHorizontal: 20,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 4,
    height: 48,
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700" },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginVertical: 20,
  },
  line: { backgroundColor: "rgba(255,255,255,0.16)", flex: 1, height: 1 },
  or: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  socialStack: { gap: 10 },
  social: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 4,
    flexDirection: "row",
    height: 46,
    justifyContent: "center",
  },
  socialDot: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    marginRight: 12,
    width: 20,
  },
  socialDotText: { color: "#000000", fontSize: 11, fontWeight: "900" },
  socialText: { color: "#FFFFFF", fontSize: 12, fontWeight: "500" },
  spacer: { flex: 1 },
  footer: { alignItems: "center" },
  bioRow: {
    flexDirection: "row",
    gap: 44,
    marginBottom: 28,
    opacity: 0.6,
  },
  bioText: { color: "#FFFFFF", fontSize: 11, textAlign: "center" },
  terms: { color: "rgba(255,255,255,0.78)", fontSize: 10 },
  links: { color: "rgba(255,255,255,0.7)", fontSize: 9, marginTop: 8 },
  pressed: { opacity: 0.72 },
});
