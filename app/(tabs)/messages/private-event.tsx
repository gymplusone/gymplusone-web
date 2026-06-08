import { Button } from "@/components/Button";
import { MonthCalendarPicker } from "@/components/events/MonthCalendarPicker";
import { MatchVerifyIcon } from "@/components/icons/MatchActionIcons";
import { PlusOneTabIcon } from "@/components/icons/PlusOneTabIcon";
import { WeightIcon } from "@/components/icons/WeightIcon";
import { ScreenFooterBar } from "@/components/layout/ScreenFooterBar";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { getThreadById, getThreadsWithBuddy } from "@/data/mockChats";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivateEventScreen() {
  const { threadId } = useLocalSearchParams<{ threadId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const threads = useMemo(() => getThreadsWithBuddy(), []);
  const defaultBuddyId = useMemo(() => {
    if (!threadId) return threads[0]?.buddyId ?? "";
    return getThreadById(threadId)?.buddyId ?? threads[0]?.buddyId ?? "";
  }, [threadId, threads]);

  const [title, setTitle] = useState("");
  const [eventImageUri, setEventImageUri] = useState<string | null>(null);
  const [buddyIds, setBuddyIds] = useState<string[]>(
    defaultBuddyId ? [defaultBuddyId] : [],
  );
  const [buddyFilter, setBuddyFilter] = useState<"all" | "plusOne" | "weight">(
    "all",
  );
  const [buddyOpen, setBuddyOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("19:00");
  const [monthCursor, setMonthCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });
  const [successOpen, setSuccessOpen] = useState(false);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const buddyOptions = threads
    .filter((t) => t.buddy)
    .map((t) => ({
      id: t.buddyId,
      name: t.displayName?.trim() || t.buddy!.name,
      avatarInitial: (t.displayName?.trim() || t.buddy!.name)
        .charAt(0)
        .toUpperCase(),
      isVerified: ["1", "4", "7", "10"].includes(t.buddyId),
      isPlusOneUser: t.buddy!.gymFrequency === "3_4" || t.buddy!.gymFrequency === "5_plus",
      isWeightUser:
        t.buddy!.workoutStyle === "strength_training" ||
        t.buddy!.workoutStyle === "functional_fitness",
    }))
    .filter((item, idx, arr) => arr.findIndex((x) => x.id === item.id) === idx);

  const filteredBuddyOptions = useMemo(() => {
    if (buddyFilter === "all") return buddyOptions;
    if (buddyFilter === "plusOne")
      return buddyOptions.filter((b) => b.isPlusOneUser);
    return buddyOptions.filter((b) => b.isWeightUser);
  }, [buddyOptions, buddyFilter]);

  const selectedBuddyLabel =
    buddyIds.length === 0
      ? "Select buddies"
      : buddyOptions
          .filter((b) => buddyIds.includes(b.id))
          .map((b) => b.name)
          .join(", ");

  const pickEventImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library access to pick an event image.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.9,
    });

    if (!result.canceled && result.assets.length > 0) {
      setEventImageUri(result.assets[0].uri);
    }
  };

  const toggleBuddySelection = (id: string) => {
    setBuddyIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeaderBack title="Private Event" onBack={() => router.back()} />

      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: spacing.xl + 84 },
        ]}
      >
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Event Image</Text>
          <Pressable
            onPress={pickEventImage}
            style={({ pressed }) => [
              styles.imageCard,
              pressed && styles.pressed,
            ]}
            accessibilityLabel="Add event image"
          >
            {eventImageUri ? (
              <>
                <Image
                  source={{ uri: eventImageUri }}
                  style={styles.imagePreview}
                />
                <Text style={styles.imageCardSubtitle}>
                  Tap to change image
                </Text>
              </>
            ) : (
              <>
                <View style={styles.imageCardIconWrap}>
                  <Ionicons
                    name="image-outline"
                    size={26}
                    color={colors.textSecondary}
                  />
                </View>
                <Text style={styles.imageCardTitle}>Add Event Cover</Text>
                <Text style={styles.imageCardSubtitle}>
                  Tap to upload an image for this private event.
                </Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Leg day session"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            cursorColor={colors.primary}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>+1</Text>
          <Pressable
            onPress={() => setBuddyOpen((x) => !x)}
            style={({ pressed }) => [
              styles.dropdown,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.dropdownText} numberOfLines={1}>
              {selectedBuddyLabel}
            </Text>
            <Ionicons
              name={buddyOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
          {buddyOpen ? (
            <View style={styles.dropdownMenu}>
              <View style={styles.filterRow}>
                <Pressable
                  onPress={() => setBuddyFilter("all")}
                  style={({ pressed }) => [
                    styles.filterChip,
                    buddyFilter === "all" && styles.filterChipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      buddyFilter === "all" && styles.filterChipTextActive,
                    ]}
                  >
                    All
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setBuddyFilter("plusOne")}
                  style={({ pressed }) => [
                    styles.filterChip,
                    buddyFilter === "plusOne" && styles.filterChipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <PlusOneTabIcon
                    color={
                      buddyFilter === "plusOne" ? colors.textOnPrimary : colors.textSecondary
                    }
                    size={14}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      buddyFilter === "plusOne" && styles.filterChipTextActive,
                    ]}
                  >
                    +1 users
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setBuddyFilter("weight")}
                  style={({ pressed }) => [
                    styles.filterChip,
                    buddyFilter === "weight" && styles.filterChipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <WeightIcon
                    color={
                      buddyFilter === "weight" ? colors.textOnPrimary : colors.textSecondary
                    }
                    size={14}
                    variant="filled"
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      buddyFilter === "weight" && styles.filterChipTextActive,
                    ]}
                  >
                    PT
                  </Text>
                </Pressable>
              </View>
              {filteredBuddyOptions.map((buddy) => (
                <Pressable
                  key={buddy.id}
                  style={({ pressed }) => [
                    styles.dropdownItem,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => toggleBuddySelection(buddy.id)}
                >
                  <View style={styles.dropdownItemLeft}>
                    <View style={styles.dropdownAvatar}>
                      <Text style={styles.dropdownAvatarText}>
                        {buddy.avatarInitial}
                      </Text>
                    </View>
                    <View style={styles.dropdownNameWrap}>
                      <Text style={styles.dropdownItemText}>{buddy.name}</Text>
                      <View style={styles.dropdownBadges}>
                        {buddy.isVerified ? (
                          <MatchVerifyIcon size={14} color={colors.primary} />
                        ) : null}
                        {buddy.isPlusOneUser ? (
                          <PlusOneTabIcon color={colors.primary} size={14} />
                        ) : null}
                        {buddy.isWeightUser ? (
                          <WeightIcon color={colors.primary} size={14} variant="filled" />
                        ) : null}
                      </View>
                    </View>
                  </View>
                  <Ionicons
                    name={
                      buddyIds.includes(buddy.id)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={18}
                    color={
                      buddyIds.includes(buddy.id)
                        ? colors.primary
                        : colors.textMuted
                    }
                  />
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Shoreditch Gym"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            cursorColor={colors.primary}
            style={styles.input}
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Time Slot</Text>
          <View style={styles.timeRow}>
            <TextInput
              value={startTime}
              onChangeText={setStartTime}
              placeholder="Start (HH:mm)"
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.primary}
              cursorColor={colors.primary}
              style={[styles.input, styles.timeInput]}
            />
            <Text style={styles.toText}>to</Text>
            <TextInput
              value={endTime}
              onChangeText={setEndTime}
              placeholder="End (HH:mm)"
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.primary}
              cursorColor={colors.primary}
              style={[styles.input, styles.timeInput]}
            />
          </View>
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Set Date</Text>
          <MonthCalendarPicker
            monthCursor={monthCursor}
            selectedDate={selectedDate}
            onChangeMonth={setMonthCursor}
            onSelectDay={setSelectedDate}
          />
        </View>
      </ScrollView>

      <ScreenFooterBar insets={insets}>
        <Button
          title="Create Now"
          onPress={() => setSuccessOpen(true)}
          fullWidth
          style={{ borderRadius: radius.full, paddingVertical: spacing.xs }}
        />
      </ScreenFooterBar>
      <Modal
        visible={successOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessOpen(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-surface border border-border p-6 rounded-xl w-full max-w-[340px] items-center">
            <View className="bg-primary/10 p-4 rounded-full mb-4 items-center justify-center">
              <Ionicons name="checkmark-circle" size={48} className="text-primary" />
            </View>
            <Text className="text-text font-black text-lg text-center mb-2">
              You've successfully created an Event!
            </Text>
            <Text className="text-textSecondary text-xs text-center mb-6 leading-5">
              Review event details and manage invitees directly in your calendar tab.
            </Text>
            <Pressable
              onPress={() => {
                setSuccessOpen(false);
                router.replace("/(tabs)/calendar");
              }}
              className="bg-primary py-3 rounded-full w-full items-center justify-center"
            >
              <Text className="text-white font-bold text-sm">View Event</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  formScroll: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, gap: spacing.md },
  fieldBlock: { gap: spacing.xs },
  label: { ...typography.bodyBold, color: colors.text },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    ...typography.body,
  },
  imageCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: "dashed",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
  },
  imagePreview: {
    width: "100%",
    height: 170,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
  imageCardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceElevated,
    marginBottom: spacing.sm,
  },
  imageCardTitle: { ...typography.bodyBold, color: colors.text },
  imageCardSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    marginRight: spacing.xs,
  },
  dropdownMenu: {
    marginTop: spacing.xs,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  dropdownItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  dropdownNameWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flex: 1,
    minWidth: 0,
  },
  dropdownBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  dropdownAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary + "2A",
  },
  dropdownAvatarText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: "700",
  },
  dropdownItemText: { ...typography.body, color: colors.text },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    flexWrap: "wrap",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: colors.textOnPrimary,
  },
  timeRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  timeInput: { flex: 1 },
  toText: { ...typography.caption, color: colors.textSecondary },
  pressed: { opacity: 0.8 },
  });
}
