import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function SocialButton({ label, dot }: { label: string; dot: string }) {
  return (
    <Pressable className="flex-row items-center justify-center bg-black h-12 rounded-sm active:opacity-75">
      <View className="items-center justify-center bg-white rounded-full w-5 h-5 mr-3">
        <Text className="text-black text-[11px] font-black">{dot}</Text>
      </View>
      <Text className="text-white text-xs font-semibold">{label}</Text>
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
      style={{ flex: 1 }}
    >
      <View
        style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 10 }}
        className="flex-1 px-7"
      >
        <View className="items-end">
          <Pressable
            onPress={() => router.push("/signup")}
            className="bg-black/55 px-4 py-2 rounded-full active:opacity-75"
          >
            <Text className="text-white text-xs font-medium">Sign up</Text>
          </Pressable>
        </View>

        <View className="items-center mt-12">
          <Text className="text-white text-4xl italic font-black">Gym+1</Text>
          <Text className="text-white/80 text-xs italic">Match your workout vibe</Text>
        </View>

        <Text className="text-white text-2xl font-extrabold leading-7 mt-8 text-center">
          Get Started With Your{"\n"}Fitness Journey
        </Text>

        <View className="gap-3.5 mt-8">
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            className="bg-white/12 h-12 rounded-sm text-white px-5"
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.4)"
            className="bg-white/12 h-12 rounded-sm text-white px-5"
          />
          <Pressable
            onPress={() => router.push("/onboarding")}
            className="items-center justify-center bg-black h-12 rounded-sm active:opacity-75"
          >
            <Text className="text-white font-bold text-sm">Log In</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center gap-3 my-5">
          <View className="flex-1 h-[1px] bg-white/15" />
          <Text className="text-white/85 text-xs font-medium">Or</Text>
          <View className="flex-1 h-[1px] bg-white/15" />
        </View>

        <View className="gap-2.5">
          <SocialButton label="Continue With Facebook" dot="f" />
          <SocialButton label="Continue With Google" dot="G" />
          <SocialButton label="Continue With Apple" dot="A" />
        </View>

        <View className="flex-1" />
        
        <View className="items-center">
          <View className="flex-row gap-11 mb-6 opacity-60">
            <Text className="text-white text-[11px] text-center">Face ID</Text>
            <Text className="text-white text-[11px] text-center">Finger Print</Text>
          </View>
          <Text className="text-white/80 text-[10px]">by continuing, you agree to our</Text>
          <Text className="text-white/70 text-[9px] mt-1.5 text-center font-medium">
            term of service     privacy policy     content policies
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
