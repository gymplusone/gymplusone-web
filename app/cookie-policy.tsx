import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import { ScrollView, View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const SECTIONS = [
  {
    title: "What Are Cookies?",
    body: "Cookies are small text files stored on your device when you visit a website or use an app. They help us remember your preferences and improve your experience.",
  },
  {
    title: "How We Use Cookies",
    body: "GYM+1 uses cookies and similar technologies to keep you logged in, remember your settings, analyze how the app is used, and deliver relevant content and advertisements.",
  },
  {
    title: "Types of Cookies We Use",
    body: "Essential cookies are required for the app to function. Analytics cookies help us understand usage patterns. Preference cookies remember your settings. Marketing cookies help us show relevant content.",
  },
  {
    title: "Third-Party Cookies",
    body: "Some features use third-party services (like analytics or payment providers) that may set their own cookies. We do not control these cookies.",
  },
  {
    title: "Managing Cookies",
    body: "You can control or delete cookies through your device settings. Note that disabling certain cookies may affect app functionality.",
  },
  {
    title: "Updates to This Policy",
    body: "We may update this Cookie Policy from time to time. The updated date at the top of this page reflects the latest revision.",
  },
];

export default function CookiePolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openPDF = async () => {
    try {
      const [asset] = await Asset.loadAsync(
        require("@/assets/GymPlusOne_Cookie_Policy.pdf")
      );
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable && asset.localUri) {
        await Sharing.shareAsync(asset.localUri, {
          mimeType: "application/pdf",
          dialogTitle: "GYM+1 Cookie Policy",
        });
      }
    } catch {
      // silently fail
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeaderBack
        title="Cookie Policy"
        titleAlign="center"
        onBack={() => router.back()}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 12, color: "#888", marginTop: 8, marginBottom: 20 }}>
          Last updated: 25 March 2026
        </Text>

        <Pressable
          onPress={openPDF}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
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

        {SECTIONS.map((s) => (
          <View key={s.title} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 6 }}>
              {s.title}
            </Text>
            <Text style={{ fontSize: 14, color: "#555", lineHeight: 22 }}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
