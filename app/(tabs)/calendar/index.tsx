import {
  CalendarPickerModal,
  getCalendarPickerPanelLayout,
  startOfCalendarDay,
  startOfCalendarMonth,
} from "@/components/events/CalendarPickerModal";
import { NearbyEventListRow } from "@/components/events/NearbyEventListRow";
import { CalendarTabIcon } from "@/components/icons/CalendarTabIcon";
import { PlusOneTabIcon } from "@/components/icons/PlusOneTabIcon";
import {
  MenuDropdownItem,
  MenuDropdownModal,
  MenuDropdownSeparator,
} from "@/components/layout/MenuDropdownModal";
import { getPublicEventListItems } from "@/data/mockEvents";
import { useTheme } from "@/features/context/ThemeContext";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NEARBY_EVENTS = getPublicEventListItems();

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() =>
    startOfCalendarMonth(startOfCalendarDay(new Date())),
  );
  const [calendarSelected, setCalendarSelected] = useState(() =>
    startOfCalendarDay(new Date()),
  );

  const closeCreateMenu = () => setCreateMenuOpen(false);
  const closeCalendarModal = useCallback(() => setCalendarModalOpen(false), []);

  const openCalendarModal = () => {
    setCalendarMonth(startOfCalendarMonth(calendarSelected));
    setCalendarModalOpen(true);
  };

  const { top: calendarPanelTop, width: calendarPanelWidth } =
    getCalendarPickerPanelLayout(insets.top);

  return (
    <View className="flex-1 bg-background px-4 font-manrope">
      <BlurView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.borderLight,
          overflow: "hidden",
        }}
        intensity={80}
        tint={isDark ? "dark" : "light"}
        onLayout={(e) => setFixedHeaderHeight(e.nativeEvent.layout.height)}
      >
        {/* Profile and Quick Actions Row */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
              className="bg-gray-300"
            />
            <View>
              <Text className="text-sm text-textSecondary font-manrope" style={{ fontFamily: "manrope" }}>
                Hello Jennie
              </Text>
              <Text className="text-lg font-bold text-[#000000] font-manrope" style={{ fontFamily: "manrope" }}>
                Good Morning🌤️
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center gap-1">
            <Pressable
              hitSlop={8}
              style={({ pressed }) => [{ padding: 8, opacity: pressed ? 0.7 : 1 }]}
              onPress={openCalendarModal}
              accessibilityLabel="Show calendar"
              accessibilityState={{ expanded: calendarModalOpen }}
            >
              <CalendarTabIcon color={colors.text} size={26} />
            </Pressable>
            <Pressable
              hitSlop={8}
              style={({ pressed }) => [{ padding: 8, opacity: pressed ? 0.7 : 1 }]}
              onPress={() => setCreateMenuOpen((o) => !o)}
              accessibilityLabel="Show create options"
              accessibilityState={{ expanded: createMenuOpen }}
            >
              <PlusOneTabIcon color={colors.text} size={26} />
            </Pressable>
          </View>
        </View>

        {/* Section Title Heading */}
        <View className="flex-row items-center justify-between gap-4 mb-1">
          <Text className="flex-1 text-2xl font-bold text-text font-manrope" style={{ fontFamily: "Manrope" }}>
            Events near you
          </Text>
        </View>
        
        <Text className="text-textSecondary text-sm leading-5 mb-4 font-manrope" style={{ fontFamily: "Manrope" }}>
          People in your area are going to these events. RSVP or create your own events!
        </Text>
      </BlurView>

      <MenuDropdownModal
        visible={createMenuOpen}
        onClose={closeCreateMenu}
        panelPositionStyle={{ top: calendarPanelTop + 45, right: 16 }}
      >
        <MenuDropdownItem
          label="Create community event"
          onPress={() => {
            closeCreateMenu();
            router.push("/(tabs)/calendar/community-event");
          }}
        />
        <MenuDropdownSeparator />
        <MenuDropdownItem
          label="Create private event"
          onPress={() => {
            closeCreateMenu();
            router.push("/(tabs)/messages/private-event");
          }}
        />
      </MenuDropdownModal>

      <CalendarPickerModal
        visible={calendarModalOpen}
        onClose={closeCalendarModal}
        panelTop={calendarPanelTop}
        panelWidth={calendarPanelWidth}
        monthCursor={calendarMonth}
        selectedDate={calendarSelected}
        onChangeMonth={setCalendarMonth}
        onSelectDay={setCalendarSelected}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: fixedHeaderHeight + 8,
          paddingBottom: insets.bottom + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {NEARBY_EVENTS.map((item, index) => (
          <NearbyEventListRow
            key={item.id}
            title={item.title}
            statusLine={item.statusLine}
            icon={item.icon}
            showSeparator={index < NEARBY_EVENTS.length - 1}
            onPress={() => router.push(`/(tabs)/calendar/${item.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}