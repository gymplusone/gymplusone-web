import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import { ScrollView, View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const SECTIONS = [
  {
    title: "Agreement to Terms",
    body: "By accessing or using GYM+1, you agree to be bound by these Terms and Conditions. If you disagree with any part, you may not access the service.",
  },
  {
    title: "Use of the Service",
    body: "GYM+1 is a platform for connecting fitness enthusiasts. You must be at least 18 years old to use the app. You agree not to misuse the service or help anyone else do so.",
  },
  {
    title: "Account Responsibility",
    body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.",
  },
  {
    title: "Content & Conduct",
    body: "You retain ownership of content you upload. By uploading, you grant GYM+1 a license to display it within the app. You agree not to post harmful, misleading, or illegal content.",
  },
  {
    title: "Subscriptions & Payments",
    body: "Some features require a paid subscription. All charges are non-refundable unless required by law. Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date.",
  },
  {
    title: "Termination",
    body: "We reserve the right to terminate or suspend access to GYM+1 at any time, without notice, for conduct that violates these terms or is harmful to other users, us, or third parties.",
  },
  {
    title: "Limitation of Liability",
    body: "GYM+1 is provided on an 'as is' basis. We make no warranties, express or implied, regarding the service. Our liability is limited to the maximum extent permitted by law.",
  },
  {
    title: "Changes to Terms",
    body: "We may revise these terms from time to time. Continued use of GYM+1 after any changes constitutes your acceptance of the new terms.",
  },
];

export default function TermsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const openPDF = async () => {
    try {
      const [asset] = await Asset.loadAsync(
        require("@/assets/GymPlusOne_Terms_and_Conditions.pdf")
      );
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable && asset.localUri) {
        await Sharing.shareAsync(asset.localUri, {
          mimeType: "application/pdf",
          dialogTitle: "GYM+1 Terms & Conditions",
        });
      }
    } catch {
      // fallback: do nothing if sharing fails
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeaderBack
        title="Terms & Conditions"
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

        {/* Open PDF button */}
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
