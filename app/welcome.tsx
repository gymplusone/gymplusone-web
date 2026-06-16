import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ImageSourcePropType, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";
import GoogleIcon from "@/assets/google.svg"
import FacebookIcon from "@/assets/facebook.svg"
import AppleIcon from "@/assets/apple.svg"
import FaceIcon from "@/assets/images/icons/face.svg"
import FingerPrintIcon from "@/assets/images/icons/thumb.svg"

function SocialButton({ 
  label, 
  icon: Icon,
  dot 
}: { 
  label: string; 
  icon?: React.FC<import("react-native-svg").SvgProps>;
  dot?: string;
}) {
  return (
    <Pressable className="flex-row font-manrope items-center justify-center bg-black h-12 rounded-sm active:opacity-75">
      <View className="items-center justify-center bg-white rounded-full w-5 h-5 mr-3">
        {Icon ? (
          <Icon width={12} height={12} />
        ) : (
          <Text className="text-black text-[11px] font-black">{dot}</Text>
        )}
      </View>
      <Text className="text-white text-sm font-medium">{label}</Text>
    </Pressable>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = () => {
    const next: typeof errors = {};
    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }
    setErrors(next);
    if (Object.keys(next).length === 0) {
      router.push("/onboarding");
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert("Not Available", "Biometric authentication is not set up on this device.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Log in to GYM+1",
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        // Assume user is already logged in for this demo, go to tabs or onboarding
        router.push("/(tabs)");
      } else {
        Alert.alert("Authentication Failed", "Could not verify your identity.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during authentication.");
    }
  };

  return (
    <LinearGradient
      colors={["#05004b", "#0b0080", "#1418ff", "#0117f0"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <View
        style={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 10 }}
        className="flex-1 px-4"
      >
        <View className="items-end">
          <Pressable
            onPress={() => router.push("/signup")}
            className="px-4 py-2 rounded-full active:opacity-75" style={{backgroundColor: 'rgba(2, 0, 80, 0.34)'}}
          >
            <Text className="text-white text-xs">Sign up</Text>
          </Pressable>
        </View>

        <View className="items-center font-author mt-12">
          <Text className="text-white text-4xl italic font-black">Gym+1</Text>
          <Text className="text-white font-[375] text-md italic">Match your workout vibe</Text>
        </View>

        <Text className="text-white text-2xl font-bold leading-7 mt-7 text-center font-manrope">
          Get Started With Your{"\n"}Fitness Journey
        </Text>

        <View className="gap-3.5 mt-8 font-manrope">
          <View>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={email}
              onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
              className="h-12 rounded-sm text-white px-5"
              style={{backgroundColor: errors.email ? 'rgba(255,80,80,0.15)' : 'rgba(255, 255, 255, 0.1)', borderWidth: errors.email ? 1 : 0, borderColor: '#ff5050'}}
            />
            {errors.email ? (
              <Text className="text-[#ff6b6b] text-xs mt-1 font-manrope">{errors.email}</Text>
            ) : null}
          </View>
          <View>
            <TextInput
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={password}
              onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
              className="h-12 rounded-sm text-white px-5"
              style={{backgroundColor: errors.password ? 'rgba(255,80,80,0.15)' : 'rgba(255, 255, 255, 0.1)', borderWidth: errors.password ? 1 : 0, borderColor: '#ff5050'}}
            />
            {errors.password ? (
              <Text className="text-[#ff6b6b] text-xs mt-1 font-manrope">{errors.password}</Text>
            ) : null}
          </View>
          <Pressable
            onPress={handleLogin}
            className="items-center justify-center bg-black h-12 rounded-sm active:opacity-75"
          >
            <Text className="text-white font-manrope font-bold ">Log In</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center gap-3 my-5">
          <View className="flex-1 h-[1px] bg-white/15" />
          <Text className="text-white text-sm font-medium">Or</Text>
          <View className="flex-1 h-[1px] bg-white/15" />
        </View>

        <View className="gap-2.5">
          <SocialButton label="Continue With Facebook" icon={FacebookIcon} />
          <SocialButton label="Continue With Google" icon={GoogleIcon} />
          <SocialButton label="Continue With Apple" icon={AppleIcon} />
        </View>

        <View className="flex-1" />
        
        <View className="items-center">
          <View className="flex-row justify-around gap-4 mb-4 opacity-60">
            <Pressable onPress={handleBiometricAuth} className="flex-col items-center gap-2">
              <FaceIcon width={30} height={30} />
              <Text className="text-white text-[11px] text-center">Face ID</Text>
            </Pressable>
            <Pressable onPress={handleBiometricAuth} className="flex-col items-center gap-2">
              <FingerPrintIcon width={30} height={30} />
              <Text className="text-white text-[11px] text-center">Finger Print</Text>
            </Pressable>
          </View>

      <Text className="flex justify-center text-white text-xs font-medium font-manrope">By continuing, you agree to our</Text>
          <Text className="text-white/70 text-[9px] mt-1.5 text-center font-medium">
            <Link href="/terms" className="underline">Term of service</Link>{"     "}
            <Link href="/privacy" className="underline">Privacy policy</Link>{"     "}
            <Link href="/cookie-policy" className="underline">Cookie policies</Link>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
