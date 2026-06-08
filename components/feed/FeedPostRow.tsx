import { Avatar } from "@/components/Avatar";
import { FeedPostCommentsModal } from "@/components/feed/FeedPostCommentsModal";
import { PremiumPaymentModal } from "@/components/PremiumPaymentModal";
import {
  FeedPostMoreMenu,
  type FeedPostMoreMenuAnchor,
} from "@/components/feed/FeedPostMoreMenu";
import { ChatOutlineIcon } from "@/components/icons/ChatOutlineIcon";
import { MatchVerifyIcon } from "@/components/icons/MatchActionIcons";
import { MoreIcon } from "@/components/icons/MoreIcon";
import { PlusOneTabIcon } from "@/components/icons/PlusOneTabIcon";
import { ShareOutlineIcon } from "@/components/icons/ShareOutlineIcon";
import { WeightIcon } from "@/components/icons/WeightIcon";
import type { ThemeColors } from "@/constants/Theme";
import {
  iconButton,
  radius,
  spacing,
  typography,
} from "@/constants/Theme";
import { useApp } from "@/features/context/AppContext";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import type { FeedPost } from "@/types";
import { formatFeedTime, formatPostDetailTimestamp } from "@/utils/feedTime";
import { useCallback, useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

type FeedPostRowProps = {
  post: FeedPost;
  showDivider?: boolean;
  /** Opens full post screen; header/body/media are tappable; actions stay separate. */
  onPressPost?: () => void;
  /** `feed`: full-bleed row for timeline. `detail`: no negative margins (parent provides padding). */
  layout?: "feed" | "detail";
};

export function FeedPostRow({
  post,
  showDivider = true,
  onPressPost,
  layout = "feed",
}: FeedPostRowProps) {
  const { feedCommentsByPost, addFeedComment } = useApp();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likesCount);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreAnchor, setMoreAnchor] = useState<FeedPostMoreMenuAnchor | null>(
    null,
  );
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const moreHitRef = useRef<View>(null);

  const openMoreMenu = useCallback(() => {
    moreHitRef.current?.measureInWindow((x, y, width, height) => {
      setMoreAnchor({ x, y, width, height });
      setMoreOpen(true);
    });
  }, []);

  const closeMoreMenu = useCallback(() => {
    setMoreOpen(false);
    setMoreAnchor(null);
  }, []);

  const toggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => Math.max(0, c + (next ? 1 : -1)));
      return next;
    });
  }, []);

  const sharePost = useCallback(async () => {
    const body = post.body.trim();
    const message = body.length > 0 ? body : "Shared from Gym+1";
    const maybeUri =
      post.image != null &&
      typeof post.image === "object" &&
      "uri" in post.image &&
      typeof (post.image as any).uri === "string"
        ? ((post.image as any).uri as string)
        : undefined;

    try {
      await Share.share({
        message,
        ...(maybeUri ? { url: maybeUri } : {}),
      });
    } catch {
      // user canceled or platform rejected
    }
  }, [post.body, post.image]);

  const openImageViewer = useCallback(() => {
    if (post.image != null) setImageViewerOpen(true);
  }, [post.image]);

  const closeImageViewer = useCallback(() => setImageViewerOpen(false), []);

  const timeLabel = formatFeedTime(post.createdAt);
  const postDetailTimeAbsolute =
    layout === "detail" ? formatPostDetailTimestamp(post.createdAt) : null;
  const commentsForPost = feedCommentsByPost[post.id] ?? [];

  const headerAndBody = (
    <View>
      <View style={styles.headerRow}>
        <Avatar initial={post.authorInitial} size="sm" />
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <View style={styles.nameAndBadges}>
              <Text style={styles.name} numberOfLines={1}>
                {post.authorName}
              </Text>
              {post.authorVerified ? (
                <MatchVerifyIcon size={15} color={colors.primary} />
              ) : null}
              {post.authorLifterBadge || post.authorVerified ? (
                <WeightIcon size={15} color={colors.primary} />
              ) : null}
              {/* Legacy +1 badge (replaced by +1 icon) */}
              {/* {!post.authorVerified && !post.authorLifterBadge ? (
                <View style={styles.plusOnePill}>
                  <Text style={styles.plusOnePillText}>+1</Text>
                </View>
              ) : null} */}
              {!post.authorVerified && !post.authorLifterBadge ? (
                <PlusOneTabIcon size={15} color={colors.primary} />
              ) : null}
              <Text style={styles.handle} numberOfLines={1}>
                @{post.authorHandle}
              </Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.time}>{timeLabel}</Text>
            </View>
            <View ref={moreHitRef} collapsable={false}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="More options"
                accessibilityState={{ expanded: moreOpen }}
                onPress={openMoreMenu}
                style={({ pressed }) => [
                  styles.moreHit,
                  pressed && styles.actionHitPressed,
                ]}
                hitSlop={iconButton.hitSlop}
              >
                <MoreIcon color={colors.textMuted} size={20} />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      {post.body.trim().length > 0 ? (
        <Text style={styles.body}>{post.body}</Text>
      ) : null}
    </View>
  );

  const postBodyColumn = (
    <View>
      {onPressPost != null ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View post"
          onPress={onPressPost}
          style={({ pressed }) => [pressed && styles.postContentPressed]}
        >
          {headerAndBody}
        </Pressable>
      ) : (
        headerAndBody
      )}
      {post.image != null ? (
        <Pressable
          accessibilityRole="imagebutton"
          accessibilityLabel="View full size image"
          onPress={openImageViewer}
          style={({ pressed }) => [pressed && styles.mediaHitPressed]}
        >
          <View
            style={[
              styles.mediaWrap,
              layout === "detail" && styles.mediaWrapDetail,
            ]}
          >
            <Image source={post.image} style={styles.media} resizeMode="cover" />
            {post.imagePremium ? (
              <View
                style={styles.mediaPremiumPill}
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <Text style={styles.mediaPremiumText}>Premium</Text>
              </View>
            ) : null}
          </View>
        </Pressable>
      ) : null}
      {post.isMealPlan ? (
        <View className="mt-3 bg-surfaceElevated border border-border p-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-1 mr-4">
            <Text className="text-text font-bold text-base">{post.planName}</Text>
            <Text className="text-textSecondary text-xs mt-1">
              Includes comprehensive meal guides, calorie-dense high-protein recipes, and full grocery lists.
            </Text>
            <Text className="text-primary font-black text-sm mt-1">{post.planPrice}</Text>
          </View>
          <Pressable
            onPress={() => setPayModalOpen(true)}
            className="bg-primary px-4 py-2.5 rounded-full justify-center items-center"
          >
            <Text className="text-white font-bold text-xs">Buy Now</Text>
          </Pressable>
        </View>
      ) : null}
      {postDetailTimeAbsolute != null ? (
        <Text
          style={styles.postDetailTime}
          accessibilityLabel={`Post time ${postDetailTimeAbsolute}`}
        >
          {postDetailTimeAbsolute}
        </Text>
      ) : null}
    </View>
  );

  return (
    <View
      style={[
        styles.main,
        !showDivider && styles.mainNoDivider,
        layout === "detail" && styles.mainDetail,
      ]}
    >
      {postBodyColumn}
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={liked ? "Unlike" : "Like"}
          onPress={toggleLike}
          style={({ pressed }) => [
            styles.actionHit,
            pressed && styles.actionHitPressed,
          ]}
          hitSlop={iconButton.hitSlop}
        >
          <Text style={[styles.actionIcon, liked && styles.actionIconActive]}>
            {liked ? "♥" : "♡"}
          </Text>
          <Text style={styles.actionCount}>{likeCount}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Comment, ${commentsForPost.length} comments`}
          onPress={() => setCommentsOpen(true)}
          style={({ pressed }) => [
            styles.actionHit,
            pressed && styles.actionHitPressed,
          ]}
          hitSlop={iconButton.hitSlop}
        >
          <ChatOutlineIcon color={colors.textMuted} size={16} />
          <Text style={styles.actionCount}>{commentsForPost.length}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Share"
          onPress={sharePost}
          style={({ pressed }) => [
            styles.actionIconOnly,
            styles.shareAction,
            pressed && styles.actionHitPressed,
          ]}
          hitSlop={iconButton.hitSlop}
        >
          <ShareOutlineIcon color={colors.textMuted} size={16} />
        </Pressable>
      </View>
      {moreOpen && moreAnchor != null ? (
        <FeedPostMoreMenu
          visible={moreOpen}
          anchor={moreAnchor}
          onClose={closeMoreMenu}
        />
      ) : null}
      {commentsOpen ? (
        <FeedPostCommentsModal
          visible={commentsOpen}
          post={post}
          comments={commentsForPost}
          onSendComment={(text, replyToHandle) =>
            addFeedComment(post.id, text, replyToHandle)
          }
          onClose={() => setCommentsOpen(false)}
        />
      ) : null}
      {post.image != null ? (
        <Modal
          visible={imageViewerOpen}
          animationType="fade"
          transparent
          statusBarTranslucent
          onRequestClose={closeImageViewer}
        >
          <View style={styles.imageViewerRoot}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={closeImageViewer}
              accessibilityRole="button"
              accessibilityLabel="Close image"
            />
            <View style={styles.imageViewerImageFrame} pointerEvents="box-none">
              <View style={styles.imageViewerImageInner} pointerEvents="none">
                <Image
                  source={post.image}
                  style={styles.imageViewerImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
      <PremiumPaymentModal
        visible={payModalOpen}
        mode="meal_plan"
        planName={post.planName}
        priceLabel={post.planPrice}
        onClose={() => setPayModalOpen(false)}
        onSuccess={(plan, price) => {
          console.log("Purchased", plan, price);
        }}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  main: {
    marginHorizontal: -spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  mainDetail: {
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  mainNoDivider: {
    borderBottomWidth: 0,
  },
  postContentPressed: {
    opacity: 0.92,
  },
  /** Avatar + nameBlock: name, badges, @handle · time on one row. Body/media/actions below full width. */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  nameBlock: { flex: 1, minWidth: 0 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  nameAndBadges: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xxs,
    flex: 1,
    minWidth: 0,
  },
  moreHit: {
    padding: iconButton.padding,
    marginLeft: spacing.xs,
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
    flexShrink: 1,
    minWidth: 0,
  },
  plusOnePill: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    // borderColor: colors.border,
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
  dot: { ...typography.caption, color: colors.textMuted },
  time: { ...typography.caption, color: colors.textMuted },
  handle: {
    ...typography.caption,
    color: colors.textMuted,
    flexShrink: 1,
    minWidth: 0,
  },
  body: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  mediaWrap: {
    marginTop: spacing.sm,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
    /** Wide horizontal tile — fixed height keeps the feed compact */
    height: 156,
    position: "relative",
  },
  mediaWrapDetail: {
    height: 220,
  },
  /** Absolute post time on full post view; follows body and/or image when present. */
  postDetailTime: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
    letterSpacing: 0.2,
  },
  media: {
    width: "100%",
    height: "100%",
  },
  mediaHitPressed: {
    opacity: 0.92,
  },
  imageViewerRoot: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerImageFrame: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  imageViewerImageInner: {
    width: "100%",
    height: "100%",
  },
  imageViewerImage: {
    width: "100%",
    height: "100%",
  },
  mediaPremiumPill: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.2)",
  },
  mediaPremiumText: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.primary,
    letterSpacing: 0.3,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.lg,
  },
  actionHit: { flexDirection: "row", alignItems: "center", gap: 6 },
  actionIconOnly: {
    padding: iconButton.padding,
    justifyContent: "center",
    alignItems: "center",
  },
  shareAction: { marginLeft: "auto" },
  actionHitPressed: { opacity: 0.75 },
  actionIcon: { fontSize: 18, color: colors.textMuted },
  actionIconActive: { color: colors.error },
  actionCount: { ...typography.caption, color: colors.textMuted },
  });
}
