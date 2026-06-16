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
import { View } from "react-native";

export default function TabLayout() {
  const { colors } = useTheme();
  const { switchAccountEnabled } = useApp();
  const segments = useSegments();

  const isMessageDetailRoute =
    segments[0] === "(tabs)" &&
    segments[1] === "messages" &&
    segments.length > 2;

  const isCalendarDetailRoute =
    segments[0] === "(tabs)" &&
    segments[1] === "calendar" &&
    segments.length > 2 &&
    segments[2] !== "community-event" &&
    segments[2] !== "analytics";

  const screenOptions = useMemo(
    () => ({
      // Active tint = blue for both icon and label
      tabBarActiveTintColor: "#0001FF",
      tabBarInactiveTintColor: "#999999",
      tabBarShowLabel: true,
      headerShown: false,
      tabBarHideOnKeyboard: true,
      sceneStyle: { backgroundColor: colors.background },
      tabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopColor: "#E5E5E5",
        borderTopWidth: 1,
        display: (isMessageDetailRoute || isCalendarDetailRoute
          ? "none"
          : "flex") as "none" | "flex",
        height: 68,
        paddingBottom: 8,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: "600" as const,
        marginTop: 2,
      },
      tabBarItemStyle: {
        borderRadius: 8,
        paddingVertical: 2,
      },
    }),
    [
      colors.background,
      isCalendarDetailRoute,
      isMessageDetailRoute,
    ],
  );

  // The blue pill wraps the icon when focused; active icon = white on blue, inactive = grey
  const TabBarIconWrapper = ({
    children,
    focused,
  }: {
    children: React.ReactNode;
    focused: boolean;
  }) => (
    <View
      style={{
        backgroundColor: focused ? "#0001FF" : "transparent",
        borderRadius: 100,
        paddingHorizontal: 8,
        paddingVertical: 5,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIconWrapper focused={focused}>
              <HomeTabIcon color={focused ? "#FFFFFF" : color} size={24} />
            </TabBarIconWrapper>
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen
        name="calendar"
        options={{
          title: switchAccountEnabled ? "Analytics" : "Calendar",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIconWrapper focused={focused}>
              {switchAccountEnabled ? (
                <AnalyticsTabIcon color={focused ? "#FFFFFF" : color} size={22} />
              ) : (
                <CalendarTabIcon color={focused ? "#FFFFFF" : color} size={22} />
              )}
            </TabBarIconWrapper>
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
          tabBarIcon: ({ focused, color }) => (
            <TabBarIconWrapper focused={focused}>
              <PlusOneTabIcon color={focused ? "#FFFFFF" : color} size={22} />
            </TabBarIconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="invites"
        options={{
          title: "Invites",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIconWrapper focused={focused}>
              <InviteTabIcon color={focused ? "#FFFFFF" : color} size={22} />
            </TabBarIconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused, color }) => (
            <TabBarIconWrapper focused={focused}>
              <ChatTabIcon color={focused ? "#FFFFFF" : color} size={22} />
            </TabBarIconWrapper>
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}