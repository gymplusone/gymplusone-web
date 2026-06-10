import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import { CardPaymentForm } from "@/components/purchase/CardPaymentForm";
import type { ThemeColors } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SpotlightPurchase() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  useThemedStyles((c: ThemeColors) => ({}));

  const handleSubmit = (payload: {
    name: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
  }) => {
    // Mock processing — in a real app integrate payments SDK (Stripe/Apple Pay)
    console.log("purchase payload", payload);
    router.replace("/spotlight/confirmation");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: insets.top,
      }}
    >
      <ScreenHeaderBack
        title="Purchase"
        onBack={() => router.back()}
        titleAlign="center"
      />
      <CardPaymentForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitLabel="Buy"
      />
    </View>
  );
}
