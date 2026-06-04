import { Avatar } from "@/components/Avatar";
import { FeedPostCommentComposer } from "@/components/feed/FeedPostCommentComposer";
import { FeedPostCommentsList } from "@/components/feed/FeedPostCommentsList";
import { MatchVerifyIcon } from "@/components/icons/MatchActionIcons";
import { WeightIcon } from "@/components/icons/WeightIcon";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import type { FeedComment, FeedPost } from "@/types";
import { formatFeedTime } from "@/utils/feedTime";
import { useCallback, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FeedPostCommentsModalProps = {
  visible: boolean;
  post: FeedPost;
  comments: FeedComment[];
  onSendComment: (text: string, replyToHandle?: string) => void;
  onClose: () => void;
};

export function FeedPostCommentsModal({
  visible,
  post,
  comments,
  onSendComment,
  onClose,
}: FeedPostCommentsModalProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const titleCount = useMemo(() => comments.length, [comments.length]);
  const canSend = draft.trim().length > 0;
  const timeLabel = formatFeedTime(post.createdAt);

  const close = useCallback(() => {
    setDraft("");
    setReplyTo(null);
    onClose();
  }, [onClose]);

  const sendComment = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    onSendComment(text, replyTo ?? undefined);
    setDraft("");
    setReplyTo(null);
  }, [draft, onSendComment, replyTo]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
      onRequestClose={close}
    >
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.keyboardRoot}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close comments"
              onPress={close}
              hitSlop={10}
              style={({ pressed }) => [
                styles.headerBtn,
                pressed && styles.headerBtnPressed,
              ]}
            >
              <Text style={styles.headerBtnText}>Close</Text>
            </Pressable>
            <Text style={styles.title}>Comments ({titleCount})</Text>
            <View style={styles.headerRight}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Send comment"
                onPress={sendComment}
                disabled={!canSend}
                hitSlop={10}
                style={({ pressed }) => [
                  styles.headerBtn,
                  pressed && canSend && styles.headerBtnPressed,
                ]}
              >
                <Text
                  style={[styles.headerSend, !canSend && styles.headerSendDisabled]}
                >
                  Send
                </Text>
              </Pressable>
            </View>
          </View>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.postPreview}>
              <View style={styles.postHeaderRow}>
                <View style={styles.postAvatarCol}>
                  <Avatar initial={post.authorInitial} size="sm" />
                  {comments.length > 0 ? (
                    <View style={styles.postThreadLine} />
                  ) : null}
                </View>
                <View style={styles.postNameBlock}>
                  <View style={styles.postNameAndBadges}>
                    <Text style={styles.postName} numberOfLines={1}>
                      {post.authorName}
                    </Text>
                    {post.authorVerified ? (
                      <MatchVerifyIcon size={15} color={colors.primary} />
                    ) : null}
                    {post.authorLifterBadge || post.authorVerified ? (
                      <WeightIcon size={15} color={colors.primary} />
                    ) : null}
                    {!post.authorVerified && !post.authorLifterBadge ? (
                      <View style={styles.plusOnePill}>
                        <Text style={styles.plusOnePillText}>+1</Text>
                      </View>
                    ) : null}
                    <Text style={styles.postHandle} numberOfLines={1}>
                      @{post.authorHandle}
                    </Text>
                    <Text style={styles.postDot}>·</Text>
                    <Text style={styles.postTime}>{timeLabel}</Text>
                  </View>
                  {post.body.trim().length > 0 ? (
                    <Text style={styles.postBody}>{post.body}</Text>
                  ) : null}
                  {post.image != null ? (
                    <View style={styles.postImageWrap}>
                      <Image
                        source={post.image}
                        style={styles.postImage}
                        resizeMode="cover"
                      />
                    </View>
                  ) : null}
                  <View style={styles.postNameDivider} />
                </View>
              </View>
            </View>
            <FeedPostCommentsList comments={comments} onReply={setReplyTo} />
          </ScrollView>

          <FeedPostCommentComposer
            draft={draft}
            onDraftChange={setDraft}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardRoot: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
    },
    headerBtn: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    headerBtnPressed: { opacity: 0.7 },
    headerBtnText: {
      ...typography.body,
      color: colors.primary,
    },
    title: {
      ...typography.bodyBold,
      color: colors.text,
    },
    headerRight: {
      width: 76,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    headerSend: {
      ...typography.bodyBold,
      color: colors.primary,
    },
    headerSendDisabled: {
      color: colors.textMuted,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.xs,
    },
    postPreview: {
      paddingBottom: 0,
      borderBottomWidth: 0,
    },
    postHeaderRow: {
      flexDirection: "row",
      alignItems: "stretch",
      gap: spacing.sm,
    },
    postAvatarCol: {
      width: 40,
      alignItems: "center",
      minHeight: 40,
    },
    postThreadLine: {
      marginTop: spacing.xs,
      width: 2,
      flex: 1,
      minHeight: 36,
      borderRadius: radius.full,
      backgroundColor: colors.borderLight,
      opacity: 0.9,
    },
    postNameBlock: {
      flex: 1,
      minWidth: 0,
    },
    postNameAndBadges: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.xxs,
      flex: 1,
      minWidth: 0,
    },
    postName: {
      ...typography.bodyBold,
      color: colors.text,
      flexShrink: 1,
      minWidth: 0,
    },
    plusOnePill: {
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      paddingVertical: 1,
      paddingHorizontal: 2,
    },
    plusOnePillText: {
      ...typography.caption,
      color: colors.textOnPrimary,
      fontWeight: "500",
      fontSize: 8,
      lineHeight: 12,
    },
    postHandle: {
      ...typography.caption,
      color: colors.textMuted,
      flexShrink: 1,
      minWidth: 0,
    },
    postDot: { ...typography.caption, color: colors.textMuted },
    postTime: { ...typography.caption, color: colors.textMuted },
    postBody: {
      ...typography.body,
      color: colors.text,
      marginTop: spacing.xs,
      lineHeight: 22,
    },
    postImageWrap: {
      marginTop: spacing.sm,
      borderRadius: radius.md,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLight,
      height: 156,
      backgroundColor: colors.surface,
    },
    postImage: {
      width: "100%",
      height: "100%",
    },
    postNameDivider: {
      marginTop: spacing.sm,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
    },
  });
}
