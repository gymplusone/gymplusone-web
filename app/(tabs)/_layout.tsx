import { AnalyticsTabIcon } from "@/components/icons/AnalyticsTabIcon";
import { CalendarTabIcon } from "@/components/icons/CalendarTabIcon";
import { ChatTabIcon } from "@/components/icons/ChatTabIcon";
import { HomeTabIcon } from "@/components/icons/HomeTabIcon";
import { InviteTabIcon } from "@/components/icons/InviteTabIcon";
import { PlusOneTabIcon } from "@/components/icons/PlusOneTabIcon";
import { useApp } from "@/features/context/AppContext";
import { useTheme } from "@/features/context/ThemeContext";
import { Tabs, useSegments } from "expo-router";
import React, { useMemo } from "react";

export default function TabLayout() {
  const { colors } = useTheme();
  const { switchAccountEnabled } = useApp();
  const segments = useSegments();
  const isMessageDetailRoute =
    segments[0] === "(tabs)" &&
    segments[1] === "messages" &&
    segments.length > 2;
  /** Only full-screen event detail (`calendar/[id]`); not `community-event` or `analytics`. */
  const isCalendarDetailRoute =
    segments[0] === "(tabs)" &&
    segments[1] === "calendar" &&
    segments.length > 2 &&
    segments[2] !== "community-event" &&
    segments[2] !== "analytics";

  const screenOptions = useMemo(
    () => ({
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      headerShown: false,
      tabBarHideOnKeyboard: true,
      sceneStyle: { backgroundColor: colors.background },
      tabBarStyle: {
        backgroundColor: colors.surfaceElevated,
        borderTopColor: colors.borderLight,
        display: (isMessageDetailRoute || isCalendarDetailRoute
          ? "none"
          : "flex") as "none" | "flex",
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600" as const,
      },
    }),
    [
      colors.background,
      colors.borderLight,
      colors.primary,
      colors.surfaceElevated,
      colors.textMuted,
      isCalendarDetailRoute,
      isMessageDetailRoute,
    ],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeTabIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen
        name="calendar"
        options={{
          title: switchAccountEnabled ? "Analytics" : "Calendar",
          tabBarIcon: ({ color }) =>
            switchAccountEnabled ? (
              <AnalyticsTabIcon color={color} size={24} />
            ) : (
              <CalendarTabIcon color={color} size={24} />
            ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(
              "calendar",
              { screen: switchAccountEnabled ? "analytics" : "index" },
            );
          },
        })}
      />
      <Tabs.Screen name="coach" options={{ href: null }} />
      <Tabs.Screen
        name="plus-one"
        options={{
          title: "+1",
          tabBarIcon: ({ color }) => (
            <PlusOneTabIcon color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="invites"
        options={{
          title: "Invites",
          tabBarIcon: ({ color }) => <InviteTabIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <ChatTabIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
