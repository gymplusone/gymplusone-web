import { Button } from "@/components/Button";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title: string;
  description: string;
  placeholder: string;
  submitText?: string;
  onCancel: () => void;
  onSubmit: (message: string) => void;
};

export function SupportTopicForm({
  title,
  description,
  placeholder,
  submitText = "Submit",
  onCancel,
  onSubmit,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (!trimmed) {
      Alert.alert(
        "Add a message",
        "Please enter a short message before submitting.",
      );
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={insets.top + 56}
    >
      <ScreenHeaderBack title={title} titleAlign="center" onBack={onCancel} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>{description}</Text>
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: colors.border,
              backgroundColor: colors.surfaceElevated,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            multiline
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
            returnKeyType="default"
          />
        </View>

        <Button
          title={submitText}
          onPress={handleSubmit}
          fullWidth
          style={styles.submitButton}
        />
        <Button
          title="Cancel"
          onPress={onCancel}
          variant="outline"
          fullWidth
          style={styles.cancelButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: spacing.lg },
    description: {
      ...typography.subhead,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    inputContainer: {
      minHeight: 180,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: spacing.sm,
      marginBottom: spacing.lg,
    },
    input: {
      ...typography.body,
      flex: 1,
      minHeight: 140,
      padding: 0,
      margin: 0,
    },
    submitButton: { marginBottom: spacing.sm },
    cancelButton: {},
  });
}
