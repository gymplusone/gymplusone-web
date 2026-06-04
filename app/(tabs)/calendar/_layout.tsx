import { useApp } from "@/features/context/AppContext";
import { useTheme } from "@/features/context/ThemeContext";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function CalendarLayout() {
  const { switchAccountEnabled, switchAccountHydrated } = useApp();
  const { colors } = useTheme();
  const initialRouteName = switchAccountEnabled ? "analytics" : "index";

  if (!switchAccountHydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }} />
    );
  }

  return (
    <Stack
      key={switchAccountEnabled ? "analytics-tab" : "calendar-tab"}
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="community-event" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
