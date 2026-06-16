import JennieAvatar from "@/assets/images/jennie.svg";
import {
  CalendarPickerModal,
  getCalendarPickerPanelLayout,
  startOfCalendarDay,
  startOfCalendarMonth,
} from "@/components/events/CalendarPickerModal";
import { FeedPostRow } from "@/components/feed/FeedPostRow";
import { HomeComposer } from "@/components/feed/HomeComposer";
import { CalendarTabIcon } from "@/components/icons/CalendarTabIcon";
import { PlusOneTabIcon } from "@/components/icons/PlusOneTabIcon";
import {
  MenuDropdownItem,
  MenuDropdownModal,
  MenuDropdownSeparator,
} from "@/components/layout/MenuDropdownModal";
import { useApp } from "@/features/context/AppContext";
import { useTheme } from "@/features/context/ThemeContext";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function getTimeGreeting(): { label: string; emoji: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { label: "Good Morning", emoji: "🌤️" };
  if (h >= 12 && h < 17) return { label: "Good Afternoon", emoji: "☀️" };
  if (h >= 17 && h < 22) return { label: "Good Evening", emoji: "🌆" };
  return { label: "Hey there", emoji: "✨" };
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { feedPosts, addFeedPost } = useApp();

  const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() =>
    startOfCalendarMonth(startOfCalendarDay(new Date()))
  );
  const [calendarSelected, setCalendarSelected] = useState(() =>
    startOfCalendarDay(new Date())
  );

  const greeting = getTimeGreeting();

  const closeCreateMenu = () => setCreateMenuOpen(false);
  const closeCalendarModal = useCallback(() => setCalendarModalOpen(false), []);

  const openCalendarModal = () => {
    setCalendarMonth(startOfCalendarMonth(calendarSelected));
    setCalendarModalOpen(true);
  };

  const { top: calendarPanelTop, width: calendarPanelWidth } =
    getCalendarPickerPanelLayout(insets.top);

  return (
    <View className="flex" style={{ backgroundColor: colors.background }}>
      {/* HEADER */}
      <BlurView
        intensity={85}
        tint={isDark ? "dark" : "light"}
        onLayout={(e) => setFixedHeaderHeight(e.nativeEvent.layout.height)}
        style={{ paddingTop: insets.top + 10 }}
        className="px-4 pb-2 border-b"
      >
        {/* Brand */}
        <View className="items-center mb-1">
          <Text
            className="text-[22px] font-black italic"
            style={{ color: colors.text }}
          >
            Gym<Text style={{ color: colors.primary }}>+1</Text>
          </Text>

          <Text className="text-xs italic" style={{ color: colors.textMuted }}>
            Match your workout vibe
          </Text>
        </View>

        {/* Profile row */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-2">
              <JennieAvatar width={48} height={48} />
            </View>

            <View className="flex-1">
              <Text className="text-xs" style={{ color: colors.textMuted }}>
                Hello Jennie
              </Text>

              <Text className="text-[17px] font-extrabold" style={{ color: colors.text }}>
                {greeting.label} {greeting.emoji}
              </Text>

              <View className="flex-row gap-2 mt-1">
                <Pressable
                  onPress={() => {}}
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white text-[11px] font-semibold">
                    Spotlight
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setCreateMenuOpen((o) => !o)}
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white text-[11px] font-semibold">
                    Super +1
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* icons */}
          <View className="flex-row gap-2">
            <Pressable
              onPress={openCalendarModal}
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#111" }}
            >
              <CalendarTabIcon color="#fff" size={18} />
            </Pressable>

            <Pressable
              onPress={() => setCreateMenuOpen((o) => !o)}
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#111" }}
            >
              <PlusOneTabIcon color="#fff" size={18} />
            </Pressable>
          </View>
        </View>

        {/* Composer */}
        <View className="-mx-4">
          <HomeComposer
            onSubmit={(text, imageUri) => addFeedPost(text, imageUri)}
            placeholder="What's on your mind?"
          />
        </View>
      </BlurView>

      {/* MODALS */}
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

      {/* FEED */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: fixedHeaderHeight,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {feedPosts.map((post, index) => (
          <FeedPostRow
            key={post.id}
            post={post}
            showDivider={index < feedPosts.length - 1}
            onPressPost={() =>
              router.push(`/(tabs)/calendar/${post.id}` as any)
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}