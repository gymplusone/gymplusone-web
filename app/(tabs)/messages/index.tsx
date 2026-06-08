import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { FilterIcon } from "@/components/icons/FilterIcon";
import { MatchVerifyIcon } from "@/components/icons/MatchActionIcons";
import { PlusOneTabIcon } from "@/components/icons/PlusOneTabIcon";
import { WeightIcon } from "@/components/icons/WeightIcon";
import type { ThemeColors } from "@/constants/Theme";
import {
  iconButton,
  radius,
  spacing,
  typography,
} from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  getThreadAvatarInitial,
  getThreadDisplayName,
  getThreadsWithBuddy,
} from "@/data/mockChats";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  type ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FILTER_OPTIONS = ["all", "recent", "unread", "unanswered"] as const;
type ChatFilter = (typeof FILTER_OPTIONS)[number];
const CHAT_AVATAR_SOURCE_BY_BUDDY_ID: Record<string, ImageSourcePropType> = {
  "1": require("@/assets/images/gym/2149278038.jpg"),
  "4": require("@/assets/images/gym/2150165238.jpg"),
  "5": require("@/assets/images/gym/2150975460.jpg"),
  "7": require("@/assets/images/gym/2150399983.jpg"),
  "10": require("@/assets/images/gym/2151450148.jpg"),
};

export default function MessagesListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ChatFilter>("all");

  const threads = useMemo(() => getThreadsWithBuddy(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const bySearch = !q
      ? threads
      : threads.filter((t) => {
          const label = t.buddy ? getThreadDisplayName(t, t.buddy) : "";
          return `${label} ${t.lastMessage}`.toLowerCase().includes(q);
        });

    if (selectedFilter === "all") return bySearch;
    if (selectedFilter === "recent") {
      return bySearch.filter((t) => /m$|h$/i.test(t.lastActive.trim()));
    }
    if (selectedFilter === "unread") {
      return bySearch.filter((t) => t.unreadCount > 0);
    }
    // unanswered: latest message is from buddy
    return bySearch.filter(
      (t) => t.messages[t.messages.length - 1]?.from === "buddy",
    );
  }, [threads, query, selectedFilter]);

  return (
    <View style={styles.container}>
      <BlurView
        style={[styles.fixedTopWrap, { paddingTop: insets.top + spacing.md }]}
        intensity={80}
        tint={isDark ? "dark" : "light"}
        onLayout={(e) => setFixedHeaderHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Inbox</Text>
        </View>

        <View className="flex-row px-6 mb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {FILTER_OPTIONS.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => setSelectedFilter(opt)}
                className={`px-4 py-1.5 rounded-full ${
                  selectedFilter === opt ? "bg-primary" : "bg-surfaceElevated border border-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    selectedFilter === opt ? "text-white" : "text-textSecondary"
                  }`}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search chats"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            cursorColor={colors.primary}
            style={styles.searchInput}
          />
        </View>
      </BlurView>

      {filtered.length === 0 ? (
        <View style={{ paddingTop: fixedHeaderHeight + spacing.sm }}>
          <EmptyState
            title="No chats found"
            subtitle="Try another name or message keyword."
          />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingTop: fixedHeaderHeight + spacing.sm },
          ]}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            if (!item.buddy) return null;
            const avatarSource = CHAT_AVATAR_SOURCE_BY_BUDDY_ID[item.buddyId];
            const isVerified = ["1", "4", "7", "10"].includes(item.buddyId);
            const isWeightUser =
              item.buddy.workoutStyle === "strength_training" ||
              item.buddy.workoutStyle === "functional_fitness";
            const isPlusOneUser =
              item.buddy.gymFrequency === "3_4" ||
              item.buddy.gymFrequency === "5_plus";
            return (
              <Pressable
                onPress={() => router.push(`/(tabs)/messages/${item.id}`)}
                style={({ pressed }) => [
                  styles.row,
                  pressed && styles.rowPressed,
                ]}
              >
                <Avatar
                  initial={getThreadAvatarInitial(item, item.buddy)}
                  size="sm"
                  source={avatarSource}
                />
                <View style={styles.rowBody}>
                  <View style={styles.rowTop}>
                    <View style={styles.nameAndBadges}>
                      <Text style={styles.name}>
                        {getThreadDisplayName(item, item.buddy)}
                      </Text>
                      {isVerified ? (
                        <MatchVerifyIcon size={15} color={colors.primary} />
                      ) : null}
                      {isWeightUser ? (
                        <WeightIcon
                          size={15}
                          color={colors.primary}
                          variant="filled"
                        />
                      ) : null}
                      {isPlusOneUser ? (
                        <PlusOneTabIcon size={15} color={colors.primary} />
                      ) : null}
                    </View>
                  </View>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>
                </View>
                <View style={styles.rightMeta}>
                  <Text style={styles.time}>{item.lastActive}</Text>
                  {item.unreadCount > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.unreadCount}</Text>
                    </View>
                  ) : (
                    <View style={styles.badgePlaceholder} />
                  )}
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
    elevation: 15,
  },
  fixedTopWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    elevation: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
    overflow: "visible",
  },
  headerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 25,
    elevation: 25,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { ...typography.title1, color: colors.text },
  filterBtn: {
    padding: iconButton.padding,
  },
  filterBtnPressed: { opacity: 0.8 },
  headerRight: {
    position: "relative",
    zIndex: 30,
    elevation: 30,
  },
  filterMenu: {
    position: "absolute",
    top: 32,
    right: 0,
    zIndex: 40,
    elevation: 40,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    minWidth: 144,
    paddingVertical: 2,
    paddingHorizontal: -spacing.xxs,
  },
  filterMenuItem: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  filterMenuItemSelected: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    marginHorizontal: spacing.xxs,
    marginVertical: 2,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  filterMenuItemPressed: {
    opacity: 0.85,
  },
  filterMenuText: {
    ...typography.subhead,
    color: colors.textSecondary,
  },
  filterMenuTextSelected: {
    color: colors.text,
    fontWeight: "600",
  },
  subtitle: { ...typography.subhead, color: colors.textSecondary },
  searchWrap: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  searchInput: {
    backgroundColor: colors.surface + "80",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    ...typography.body,
  },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  separator: { height: spacing.xs },
  row: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: colors.surface,
    borderRadius: radius.lg,
    // paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  rowPressed: { opacity: 0.9 },
  rowBody: { flex: 1, marginLeft: spacing.md },
  rowTop: { flexDirection: "row", alignItems: "center" },
  nameAndBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    minWidth: 0,
    flex: 1,
  },
  rightMeta: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: spacing.sm,
    minWidth: 34,
    gap: spacing.xs,
  },
  name: { ...typography.bodyBold, color: colors.text },
  time: { ...typography.caption, color: colors.textMuted },
  lastMessage: {
    ...typography.subhead,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
  },
  badgePlaceholder: {
    width: 22,
    height: 22,
  },
  badgeText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: "700",
  },
  });
}
