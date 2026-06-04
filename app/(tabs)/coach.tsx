import { Card } from "@/components/Card";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useApp } from "@/features/context/AppContext";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
  COACH_SUGGESTED_PROMPTS,
  getMockCoachResponse,
} from "@/utils/mockCoach";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Message = { role: "user" | "coach"; text: string };

export default function CoachScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { onboardingData } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "coach",
      text: "Hi! I'm your +1 Coach. I'm here for motivation, confidence tips, and help with scheduling. Ask me anything—try one of the suggestions below or type your own question.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [...prev, { role: "user", text: t }]);
    setInput("");
    const reply = getMockCoachResponse(t, onboardingData);
    setMessages((prev) => [...prev, { role: "coach", text: reply }]);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 56}
    >
      <View style={styles.header}>
        <Text style={styles.title}>+1 Coach</Text>
        <Text style={styles.subtitle}>Motivation & accountability support</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m, i) => (
          <View
            key={i}
            style={[
              styles.bubbleWrap,
              m.role === "user" && styles.bubbleWrapUser,
            ]}
          >
            <View
              style={[
                styles.bubble,
                m.role === "user" ? styles.bubbleUser : styles.bubbleCoach,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  m.role === "user" && styles.bubbleTextUser,
                ]}
              >
                {m.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Card noPadding elevated={false} style={styles.suggestedCard}>
        <Text style={styles.suggestedTitle}>Try asking</Text>
        <View style={styles.suggestedChips}>
          {COACH_SUGGESTED_PROMPTS.map((prompt) => (
            <Pressable
              key={prompt}
              style={({ pressed }) => [
                styles.suggestChip,
                pressed && styles.suggestChipPressed,
              ]}
              onPress={() => send(prompt)}
            >
              <Text style={styles.suggestChipText} numberOfLines={2}>
                {prompt}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <View
        style={[styles.inputBar, { paddingBottom: insets.bottom - spacing.sm }]}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask your coach..."
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            cursorColor={colors.primary}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
            returnKeyType="send"
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              pressed && styles.sendBtnPressed,
            ]}
            onPress={() => send(input)}
          >
            <Text style={styles.sendBtnText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    headerAccent: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 3,
      backgroundColor: colors.primary,
    },
    title: { ...typography.title1, color: colors.text },
    subtitle: {
      ...typography.subhead,
      color: colors.textSecondary,
      marginTop: 2,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: spacing.lg, paddingBottom: spacing.lg },
    bubbleWrap: { marginBottom: spacing.sm },
    bubbleWrapUser: { alignItems: "flex-end" },
    bubble: {
      maxWidth: "88%",
      padding: spacing.md,
      borderRadius: radius.lg,
    },
    bubbleCoach: {
      backgroundColor: colors.surface,
      alignSelf: "flex-start",
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    bubbleUser: { backgroundColor: colors.primary, alignSelf: "flex-end" },
    bubbleText: { ...typography.body, color: colors.text, lineHeight: 22 },
    bubbleTextUser: { color: "#fff" },
    suggestedCard: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.sm,
      padding: spacing.md,
    },
    suggestedTitle: {
      ...typography.caption,
      color: colors.textMuted,
      marginBottom: spacing.xs,
    },
    suggestedChips: { gap: spacing.xs },
    suggestChip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.background,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    suggestChipPressed: { opacity: 0.8 },
    suggestChipText: { ...typography.subhead, color: colors.textSecondary },
    inputBar: {
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      backgroundColor: colors.surfaceElevated,
      paddingTop: spacing.sm,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    input: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      ...typography.body,
      color: colors.text,
    },
    sendBtn: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.primary,
      borderRadius: radius.full,
    },
    sendBtnPressed: { opacity: 0.9 },
    sendBtnText: { ...typography.bodyBold, color: colors.textOnPrimary },
  });
}
