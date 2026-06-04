import { Avatar } from "@/components/Avatar";
import { MatchVerifyIcon } from "@/components/icons/MatchActionIcons";
import { WeightIcon } from "@/components/icons/WeightIcon";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import type { FeedComment } from "@/types";
import { formatFeedTime } from "@/utils/feedTime";
import { Pressable, StyleSheet, Text, View } from "react-native";

type FeedPostCommentsListProps = {
  comments: FeedComment[];
  /** When set, Reply buttons call this with the commenter's handle. */
  onReply?: (handle: string) => void;
};

export function FeedPostCommentsList({
  comments,
  onReply,
}: FeedPostCommentsListProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (comments.length === 0) {
    return (
      <Text style={styles.empty}>No comments yet. Be the first to reply.</Text>
    );
  }

  return (
    <View style={styles.list}>
      {comments.map((item, index) => (
        <View key={item.id} style={styles.commentRow}>
          <View style={styles.commentAvatarCol}>
            <Avatar initial={item.name} size="sm" />
            {index < comments.length - 1 ? (
              <View style={styles.commentThreadLine} />
            ) : null}
          </View>
          <View style={styles.commentBody}>
            <View style={styles.commentHead}>
              <Text style={styles.commentName}>{item.name}</Text>
              {item.authorVerified ? (
                <MatchVerifyIcon size={15} color={colors.primary} />
              ) : null}
              {item.authorLifterBadge || item.authorVerified ? (
                <WeightIcon size={15} color={colors.primary} />
              ) : null}
              {item.authorPlusOneBadge &&
              !item.authorVerified &&
              !item.authorLifterBadge ? (
                <View style={styles.commentPlusOnePill}>
                  <Text style={styles.commentPlusOnePillText}>+1</Text>
                </View>
              ) : null}
              <Text style={styles.commentHandle}>@{item.handle}</Text>
              <Text style={styles.commentDot}>·</Text>
              <Text style={styles.commentTime}>
                {formatFeedTime(item.createdAt)}
              </Text>
            </View>
            <Text style={styles.commentText}>{item.text}</Text>
            {onReply != null ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Reply to ${item.name}`}
                onPress={() => onReply(item.handle)}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.replyBtn,
                  pressed && styles.replyBtnPressed,
                ]}
              >
                <Text style={styles.replyText}>Reply</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    list: {
      gap: spacing.xs,
    },
    empty: {
      ...typography.body,
      color: colors.textMuted,
      paddingVertical: spacing.sm,
    },
    commentRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    commentAvatarCol: {
      width: 40,
      alignItems: "center",
      minHeight: 40,
    },
    commentThreadLine: {
      marginTop: spacing.xs,
      width: 2,
      flex: 1,
      minHeight: 28,
      borderRadius: radius.full,
      backgroundColor: colors.borderLight,
      opacity: 0.9,
    },
    commentBody: {
      flex: 1,
      minWidth: 0,
    },
    commentHead: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xxs,
      marginBottom: 2,
    },
    commentName: {
      ...typography.bodyBold,
      color: colors.text,
    },
    commentPlusOnePill: {
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      paddingVertical: 1,
      paddingHorizontal: 2,
    },
    commentPlusOnePillText: {
      ...typography.caption,
      color: colors.textOnPrimary,
      fontWeight: "500",
      fontSize: 8,
      lineHeight: 12,
    },
    commentHandle: {
      ...typography.caption,
      color: colors.textMuted,
    },
    commentDot: { ...typography.caption, color: colors.textMuted },
    commentTime: { ...typography.caption, color: colors.textMuted },
    commentText: {
      ...typography.body,
      color: colors.text,
      lineHeight: 22,
    },
    replyBtn: {
      alignSelf: "flex-start",
      marginTop: spacing.xs,
      paddingVertical: 2,
      paddingHorizontal: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceElevated,
    },
    replyBtnPressed: { opacity: 0.7 },
    replyText: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: "600",
    },
  });
}
