import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  const handleSignup = () => {
    const next: typeof errors = {};

    if (!fullName.trim()) {
      next.fullName = "Full name is required.";
    } else if (fullName.trim().length < 2) {
      next.fullName = "Please enter your full name.";
    }

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      next.email = "Please enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password)) {
      next.password = "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(password)) {
      next.password = "Password must contain at least one number.";
    }

    if (!confirm) {
      next.confirm = "Please confirm your password.";
    } else if (confirm !== password) {
      next.confirm = "Passwords do not match.";
    }

    setErrors(next);
    if (Object.keys(next).length === 0) {
      router.push("/onboarding");
    }
  };

  const inputStyle = (field: keyof typeof errors) => ({
    backgroundColor: errors[field] ? 'rgba(255,80,80,0.12)' : 'rgba(255,255,255,0.12)',
    borderRadius: 4,
    color: '#FFFFFF' as const,
    height: 48,
    paddingHorizontal: 20,
    borderWidth: errors[field] ? 1 : 0,
    borderColor: '#ff5050' as const,
  });

  return (
    <LinearGradient
      colors={["#05004b", "#0b0080", "#1418ff", "#0117f0"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <View
        style={{ flex: 1, paddingHorizontal: 28, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }}
      >
        <View style={{ alignItems: "flex-end" }}>
          <Pressable
            onPress={() => router.replace("/welcome")}
            style={{ backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 12 }}>Log in</Text>
          </Pressable>
        </View>

        <View style={{ alignItems: "center", marginTop: 78 }}>
          <Text style={{ color: "#FFFFFF", fontSize: 38, fontStyle: "italic", fontWeight: "900" }}>Gym+1</Text>
          <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 12, fontStyle: "italic" }}>Match your workout vibe</Text>
        </View>

        <Text style={{ color: "#FFFFFF", fontSize: 23, fontWeight: "800", lineHeight: 28, marginTop: 32, textAlign: "center" }}>
          Get Started With Your{"\n"}Fitness Journey
        </Text>
        <Text style={{ color: "#FFFFFF", fontSize: 13, marginTop: 22, textAlign: "center" }}>Sign up</Text>

        <View style={{ gap: 10, marginTop: 18 }}>
          {/* Full Name */}
          <View>
            <TextInput
              autoCapitalize="words"
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={fullName}
              onChangeText={(v) => { setFullName(v); setErrors((e) => ({ ...e, fullName: undefined })); }}
              style={inputStyle("fullName")}
            />
            {errors.fullName ? (
              <Text style={{ color: "#ff6b6b", fontSize: 11, marginTop: 3 }}>{errors.fullName}</Text>
            ) : null}
          </View>

          {/* Email */}
          <View>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={email}
              onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
              style={inputStyle("email")}
            />
            {errors.email ? (
              <Text style={{ color: "#ff6b6b", fontSize: 11, marginTop: 3 }}>{errors.email}</Text>
            ) : null}
          </View>

          {/* Password */}
          <View>
            <TextInput
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={password}
              onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
              style={inputStyle("password")}
            />
            {errors.password ? (
              <Text style={{ color: "#ff6b6b", fontSize: 11, marginTop: 3 }}>{errors.password}</Text>
            ) : null}
          </View>

          {/* Confirm Password */}
          <View>
            <TextInput
              secureTextEntry
              placeholder="Re-Enter Password"
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={confirm}
              onChangeText={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirm: undefined })); }}
              style={inputStyle("confirm")}
            />
            {errors.confirm ? (
              <Text style={{ color: "#ff6b6b", fontSize: 11, marginTop: 3 }}>{errors.confirm}</Text>
            ) : null}
          </View>

          {/* Password strength hint */}
          {!errors.password && password.length > 0 && password.length < 8 ? (
            <View style={{ backgroundColor: "rgba(255,200,0,0.1)", borderRadius: 4, padding: 8 }}>
              <Text style={{ color: "#ffd166", fontSize: 11 }}>
                Password needs 8+ characters, one uppercase letter, and one number.
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={handleSignup}
            style={({ pressed }) => ({
              alignItems: "center" as const,
              backgroundColor: "#000000",
              borderRadius: 4,
              height: 48,
              justifyContent: "center" as const,
              opacity: pressed ? 0.72 : 1,
              marginTop: 4,
            })}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}
