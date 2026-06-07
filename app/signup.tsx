import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignupScreen() {
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
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <View style={styles.topRight}>
          <Pressable onPress={() => router.replace("/welcome")} style={styles.pill}>
            <Text style={styles.pillText}>Log in</Text>
          </Pressable>
        </View>

        <View style={styles.brandBlock}>
          <Text style={styles.logo}>Gym+1</Text>
          <Text style={styles.tagline}>Match your workout vibe</Text>
        </View>

        <Text style={styles.headline}>
          Get Started With Your{"\n"}Fitness Journey
        </Text>
        <Text style={styles.mode}>Sign up</Text>

        <View style={styles.form}>
          {["Full Name", "Email", "Password", "Re-Enter Password"].map(
            (placeholder, index) => (
              <TextInput
                key={placeholder}
                secureTextEntry={index >= 2}
                autoCapitalize={index === 1 ? "none" : "words"}
                keyboardType={index === 1 ? "email-address" : "default"}
                placeholder={placeholder}
                placeholderTextColor="rgba(255,255,255,0.35)"
                style={styles.input}
              />
            ),
          )}
          <Pressable
            onPress={() => router.push("/onboarding")}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 28 },
  topRight: { alignItems: "flex-end" },
  pill: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillText: { color: "#FFFFFF", fontSize: 12 },
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
  mode: {
    color: "#FFFFFF",
    fontSize: 13,
    marginTop: 22,
    textAlign: "center",
  },
  form: { gap: 14, marginTop: 18 },
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
  pressed: { opacity: 0.72 },
});
