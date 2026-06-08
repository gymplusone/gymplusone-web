import { ThemeProvider, useTheme } from "@/features/context/ThemeContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

import { AppProvider } from "@/features/context/AppContext";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

function ThemedStatusBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppProvider>
          <ThemedStatusBar />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="match-results" />
            <Stack.Screen name="match/[id]" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="purchased-plans" />
            <Stack.Screen name="saved-plans" />
            <Stack.Screen name="contact" />
            <Stack.Screen name="about" />
            <Stack.Screen name="faq" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="sessions" />
            <Stack.Screen
              name="payment-success"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen name="feed-post" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="request-success"
              options={{ presentation: "modal" }}
            />
          </Stack>
        </AppProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
