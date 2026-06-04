import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type FeedPostCommentComposerProps = {
  draft: string;
  onDraftChange: (text: string) => void;
  replyTo: string | null;
  onCancelReply: () => void;
};

export function FeedPostCommentComposer({
  draft,
  onDraftChange,
  replyTo,
  onCancelReply,
}: FeedPostCommentComposerProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.composerWrap}>
      {replyTo != null ? (
        <View style={styles.replyingTo}>
          <Text style={styles.replyingToText}>Replying to @{replyTo}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel reply"
            onPress={onCancelReply}
            hitSlop={8}
          >
            <Text style={styles.cancelReply}>×</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.composerRow}>
        <TextInput
          value={draft}
          onChangeText={onDraftChange}
          placeholder={
            replyTo != null ? `Reply to @${replyTo}` : "Write a comment..."
          }
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
          maxLength={240}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
        />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    composerWrap: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.borderLight,
      backgroundColor: colors.background,
    },
    replyingTo: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.xs,
    },
    replyingToText: {
      ...typography.caption,
      color: colors.textMuted,
    },
    cancelReply: {
      ...typography.bodyBold,
      color: colors.textMuted,
    },
    composerRow: {
      flexDirection: "row",
      alignItems: "flex-end",
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceElevated,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      ...typography.body,
      color: colors.text,
    },
  });
}
