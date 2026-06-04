import { Button } from "@/components/Button";
import { FeedPostCommentComposer } from "@/components/feed/FeedPostCommentComposer";
import { FeedPostCommentsList } from "@/components/feed/FeedPostCommentsList";
import { FeedPostRow } from "@/components/feed/FeedPostRow";
import { HeaderBackButton } from "@/components/layout/HeaderBackButton";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { FOOTER_PRIMARY_CTA_BUTTON_STYLE } from "@/constants/eventUI";
import { useApp } from "@/features/context/AppContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FeedPostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { feedPosts, feedCommentsByPost, addFeedComment } = useApp();

  const post = feedPosts.find((p) => p.id === id) ?? null;
  const comments = useMemo(
    () => (post != null ? (feedCommentsByPost[post.id] ?? []) : []),
    [feedCommentsByPost, post],
  );

  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const canSend = draft.trim().length > 0;

  const sendComment = useCallback(() => {
    if (post == null) return;
    const text = draft.trim();
    if (!text) return;
    addFeedComment(post.id, text, replyTo ?? undefined);
    setDraft("");
    setReplyTo(null);
  }, [addFeedComment, draft, post, replyTo]);

  if (!post) {
    return (
      <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
        <ScreenHeaderBack
          title="Post"
          titleAlign="center"
          onBack={() => router.back()}
        />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>This post is not available.</Text>
          <Button
            title="Back"
            onPress={() => router.back()}
            fullWidth
            style={FOOTER_PRIMARY_CTA_BUTTON_STYLE}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerSide}>
          <HeaderBackButton onPress={() => router.back()} />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Post</Text>
        </View>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send comment"
            onPress={sendComment}
            disabled={!canSend}
            hitSlop={10}
            style={({ pressed }) => [
              styles.headerSendWrap,
              pressed && canSend && styles.headerSendWrapPressed,
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
      <KeyboardAvoidingView
        style={styles.keyboardRoot}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FeedPostRow post={post} showDivider={false} layout="detail" />
          <Text style={styles.commentsHeading}>
            Comments ({comments.length})
          </Text>
          <View style={styles.commentsBlock}>
            <FeedPostCommentsList comments={comments} onReply={setReplyTo} />
          </View>
        </ScrollView>
        <View style={[styles.composerSafe, { paddingBottom: insets.bottom }]}>
          <FeedPostCommentComposer
            draft={draft}
            onDraftChange={setDraft}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardRoot: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    headerSide: {
      width: 76,
      flexDirection: "row",
      alignItems: "center",
    },
    headerSideRight: {
      justifyContent: "flex-end",
    },
    headerCenter: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      ...typography.title2,
      color: colors.text,
      fontSize: 16,
      textAlign: "center",
    },
    headerSendWrap: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    headerSendWrapPressed: {
      opacity: 0.75,
    },
    headerSend: {
      ...typography.bodyBold,
      color: colors.primary,
    },
    headerSendDisabled: {
      color: colors.textMuted,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm - 40,
      paddingBottom: spacing.md,
    },
    commentsHeading: {
      ...typography.bodyBold,
      color: colors.text,
      marginTop: spacing.xxs,
      marginBottom: spacing.sm,
    },
    commentsBlock: {
      paddingBottom: spacing.sm,
    },
    composerSafe: {
      backgroundColor: colors.background,
    },
    notFound: {
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
      marginTop: spacing.xl,
    },
    notFoundText: {
      color: colors.textMuted,
      textAlign: "center",
    },
  });
}
