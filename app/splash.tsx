import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SplashRoute() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/welcome"), 1400);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={["#020035", "#090073", "#1114f7", "#0218ff"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.screen}
    >
      <View style={styles.center}>
        <Text style={styles.logo}>Gym+1</Text>
        <Text style={styles.tagline}>Match your workout vibe</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 44,
    fontStyle: "italic",
    fontWeight: "900",
  },
  tagline: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    fontStyle: "italic",
    marginTop: 2,
  },
});
