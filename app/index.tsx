import { useApp } from "@/features/context/AppContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { hasCompletedOnboarding } = useApp();
  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/welcome" />;
}
