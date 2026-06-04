import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { MatchVerifyIcon } from "@/components/icons/MatchActionIcons";
import { PlusOneTabIcon } from "@/components/icons/PlusOneTabIcon";
import { WeightIcon } from "@/components/icons/WeightIcon";
import { HeaderBackButton } from "@/components/layout/HeaderBackButton";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
    getThreadAvatarInitial,
    getThreadById,
    getThreadDisplayName,
    type ChatMessage,
} from "@/data/mockChats";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Image,
    type ImageSourcePropType,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICON_MIC = require("@/assets/images/icons/microphone.png");
const ICON_ADD = require("@/assets/images/icons/add-circle.png");
const CHAT_AVATAR_SOURCE_BY_BUDDY_ID: Record<string, ImageSourcePropType> = {
  "1": require("@/assets/images/gym/2149278038.jpg"),
  "4": require("@/assets/images/gym/2150165238.jpg"),
  "5": require("@/assets/images/gym/2150975460.jpg"),
  "7": require("@/assets/images/gym/2150399983.jpg"),
  "10": require("@/assets/images/gym/2151450148.jpg"),
};

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const thread = useMemo(() => (id ? getThreadById(id) : null), [id]);
  const [messages, setMessages] = useState<ChatMessage[]>(
    thread?.messages ?? [],
  );
  const [input, setInput] = useState("");
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!thread || !thread.buddy) {
    return (
      <View style={styles.container}>
        <ScreenHeaderBack title="Chat" onBack={() => router.back()} />
        <EmptyState
          title="Chat not found"
          subtitle="This conversation is unavailable."
        />
      </View>
    );
  }

  const hasTypedMessage = input.trim().length > 0;
  const avatarSource = CHAT_AVATAR_SOURCE_BY_BUDDY_ID[thread.buddyId];
  const isVerified = ["1", "4", "7", "10"].includes(thread.buddyId);
  const isWeightUser =
    thread.buddy.workoutStyle === "strength_training" ||
    thread.buddy.workoutStyle === "functional_fitness";
  const isPlusOneUser =
    thread.buddy.gymFrequency === "3_4" || thread.buddy.gymFrequency === "5_plus";
  const openPrivateEvent = () => {
    setAttachmentMenuOpen(false);
    router.push({
      pathname: "/(tabs)/messages/private-event",
      params: { threadId: thread.id },
    });
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: String(prev.length + 1), from: "me", text, sentAt: "now" },
    ]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(prev.length + 1),
          from: "buddy",
          text: "Nice one - let's lock that in. I'll send a quick reminder before we meet.",
          sentAt: "now",
        },
      ]);
    }, 700);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 60}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <HeaderBackButton onPress={() => router.back()} />
        <Avatar
          initial={getThreadAvatarInitial(thread, thread.buddy)}
          size="sm"
          source={avatarSource}
        />
        <View style={styles.headerMeta}>
          <View style={styles.headerNameRow}>
            <Text style={styles.headerName}>
              {getThreadDisplayName(thread, thread.buddy)}
            </Text>
            {isVerified ? (
              <MatchVerifyIcon size={15} color={colors.primary} />
            ) : null}
            {isWeightUser ? (
              <WeightIcon size={15} color={colors.primary} variant="filled" />
            ) : null}
            {isPlusOneUser ? (
              <PlusOneTabIcon size={15} color={colors.primary} />
            ) : null}
          </View>
          <Text style={styles.headerSub}>{thread.buddy.area}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[styles.bubbleWrap, m.from === "me" && styles.bubbleWrapMe]}
          >
            <View
              style={[
                styles.bubble,
                m.from === "me" ? styles.bubbleMe : styles.bubbleBuddy,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  m.from === "me" && styles.bubbleTextMe,
                ]}
              >
                {m.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View
        style={[styles.inputRow, { paddingBottom: insets.bottom + spacing.sm }]}
      >
        <TextInput
          style={styles.input}
          placeholder="Message..."
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={hasTypedMessage ? send : undefined}
          returnKeyType={hasTypedMessage ? "send" : "default"}
        />
        <View style={styles.trailingSlot}>
          {hasTypedMessage ? (
            <Pressable
              style={({ pressed }) => [
                styles.sendBtn,
                pressed && styles.sendBtnPressed,
              ]}
              onPress={send}
            >
              <Text style={styles.sendBtnText}>Send</Text>
            </Pressable>
          ) : (
            <View style={styles.iconActions}>
              <Pressable
                onPress={() => {}}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.iconBtn,
                  pressed && styles.iconBtnPressed,
                ]}
                accessibilityLabel="Voice message"
              >
                <Image
                  source={ICON_MIC}
                  style={styles.inputBarIcon}
                  resizeMode="contain"
                />
              </Pressable>
              <Pressable
                onPress={() => setAttachmentMenuOpen(true)}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.iconBtn,
                  pressed && styles.iconBtnPressed,
                ]}
                accessibilityLabel="Add attachment"
              >
                <Image
                  source={ICON_ADD}
                  style={styles.inputBarIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={attachmentMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAttachmentMenuOpen(false)}
      >
        <View style={styles.attachModalRoot} pointerEvents="box-none">
          <Pressable
            style={styles.attachBackdrop}
            onPress={() => setAttachmentMenuOpen(false)}
          />
          <View
            style={[
              styles.attachMenuColumn,
              {
                bottom: insets.bottom + spacing.sm + ATTACH_MENU_ABOVE_INPUT,
                right: spacing.lg,
              },
            ]}
            pointerEvents="box-none"
          >
            <Pressable
              style={({ pressed }) => [
                styles.attachCircleBtn,
                pressed && styles.attachCircleBtnPressed,
              ]}
              onPress={() => setAttachmentMenuOpen(false)}
              accessibilityLabel="Photo library"
            >
              <Ionicons name="images-outline" size={26} color={colors.text} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.attachCircleBtn,
                pressed && styles.attachCircleBtnPressed,
              ]}
              onPress={openPrivateEvent}
              accessibilityLabel="Schedule meet-up"
            >
              <View style={styles.scheduleBubble}>
                <Text style={styles.scheduleBubbleText}>24</Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.attachCircleBtn,
                pressed && styles.attachCircleBtnPressed,
              ]}
              onPress={() => setAttachmentMenuOpen(false)}
              accessibilityLabel="Camera"
            >
              <Ionicons name="camera-outline" size={26} color={colors.text} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.attachCircleBtn,
                pressed && styles.attachCircleBtnPressed,
              ]}
              onPress={() => setAttachmentMenuOpen(false)}
              accessibilityLabel="GIF"
            >
              <Text style={styles.gifLabel}>GIF</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/** Space from bottom of screen to place menu above composer row */
const ATTACH_MENU_ABOVE_INPUT = 56;

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerMeta: { marginLeft: spacing.sm },
  headerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  headerName: { ...typography.bodyBold, color: colors.text },
  headerSub: { ...typography.caption, color: colors.textSecondary },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.lg },
  bubbleWrap: { marginBottom: spacing.sm },
  bubbleWrapMe: { alignItems: "flex-end" },
  bubble: { maxWidth: "84%", padding: spacing.sm, borderRadius: radius.lg },
  bubbleBuddy: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.sm,
  },
  bubbleMe: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: radius.sm,
  },
  bubbleText: { ...typography.body, color: colors.text },
  bubbleTextMe: { color: colors.textOnPrimary },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.text,
    ...typography.body,
  },
  trailingSlot: {
    flexShrink: 0,
    justifyContent: "center",
  },
  iconActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  iconBtnPressed: { opacity: 0.7 },
  inputBarIcon: {
    width: 24,
    height: 24,
    tintColor: colors.text,
  },
  sendBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  sendBtnPressed: { opacity: 0.88 },
  sendBtnText: { ...typography.bodyBold, color: colors.textOnPrimary },
  attachModalRoot: {
    flex: 1,
  },
  attachBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  attachMenuColumn: {
    position: "absolute",
    alignItems: "center",
    gap: spacing.sm,
  },
  attachCircleBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: { elevation: 4 },
    }),
  },
  attachCircleBtnPressed: { opacity: 0.85 },
  scheduleBubble: {
    minWidth: 32,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    borderBottomLeftRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleBubbleText: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  gifLabel: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: colors.text,
  },
  });
}
