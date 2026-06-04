import {
    MatchCancelIcon,
    MatchPowerIcon,
    MatchVerifyIcon,
} from "@/components/icons/MatchActionIcons";
import { shortLabels } from "@/constants/labels";
import type { ThemeColors } from "@/constants/Theme";
import { radius, shadows, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import type { GymBuddyProfile } from "@/types";
import { getBuddyCardImageSource } from "@/utils/buddyCardImage";
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export const MATCH_CARD_HEIGHT = 440;

/** White circular action pills — center ~1.5× side diameter, half-overlap card bottom */
export const MATCH_ACTION_SIDE = 56;
export const MATCH_ACTION_CENTER = 84;
export const MATCH_ACTION_OVERLAP = MATCH_ACTION_CENTER / 2;

export const matchActionBtnShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.14,
  shadowRadius: 10,
  elevation: 10,
} as const;

type MatchCardShellProps = {
  profile: GymBuddyProfile;
  children: React.ReactNode;
  /** Pinned to the top-end of the card (e.g. match % on photo). */
  topEndAccessory?: React.ReactNode;
  /** Renders as part of card shell, outside the clipped image area. */
  bottomOverlay?: React.ReactNode;
};

/**
 * Shared match card chrome: hero image, scrim, bottom content slot.
 * Use with {@link MatchCardDefaultFooter} or custom footer content.
 */
export function MatchCardShell({
  profile,
  children,
  topEndAccessory,
  bottomOverlay,
}: MatchCardShellProps) {
  const styles = useThemedStyles(createStyles);
  const imageSource = getBuddyCardImageSource(profile);
  return (
    <View style={[styles.matchCardOuter, shadows.lg]}>
      <View style={styles.matchCardImageClip}>
        <ImageBackground
          source={imageSource}
          style={styles.cardImageBg}
          imageStyle={styles.cardImageStyle}
        >
          <View style={styles.cardScrim} />
          {topEndAccessory != null ? (
            <View style={styles.topEndAccessoryWrap} pointerEvents="box-none">
              {topEndAccessory}
            </View>
          ) : null}
          <View style={styles.cardContent}>{children}</View>
        </ImageBackground>
      </View>
      {bottomOverlay}
    </View>
  );
}

type MatchCardDefaultFooterProps = {
  profile: GymBuddyProfile;
  bioNumberOfLines?: number;
  /** When false, omits bio (e.g. match-results uses explanation rows instead). */
  showBio?: boolean;
};

/** +1 deck footer: name, area, goal/style tags, bio. */
export function MatchCardDefaultFooter({
  profile,
  bioNumberOfLines = 4,
  showBio = true,
}: MatchCardDefaultFooterProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <>
      <Text style={styles.name}>
        {profile.name}, {profile.age}
      </Text>
      <Text style={styles.area}>{profile.area}</Text>
      <Text style={styles.tags}>
        {shortLabels.fitnessGoal[profile.fitnessGoal]} ·{" "}
        {shortLabels.workoutStyle[profile.workoutStyle]}
      </Text>
      {showBio ? (
        <Text style={styles.bio} numberOfLines={bioNumberOfLines}>
          {profile.bio}
        </Text>
      ) : null}
    </>
  );
}

/** Match % pill for the top-right of {@link MatchCardShell} (same tokens as theme). */
export function MatchCardScoreBadge({ score }: { score: number }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.scoreBadge}>
      <Text style={styles.scoreValue}>
        {score} <Text style={styles.scorePct}>%</Text>
      </Text>
      <Text style={styles.scoreLabel}>match</Text>
    </View>
  );
}

export type MatchCardActionsProps = {
  onReject: () => void;
  onPower: () => void;
  onApprove: () => void;
  /** Match center bolt to deck; default matches +1 tab. */
  powerIconSize?: number;
};

/**
 * Fixed action row (cancel / power / verify). Parent positions this outside
 * {@link SwipeableCard} so buttons do not move with the swipe animation.
 */
export function MatchCardActions({
  onReject,
  onPower,
  onApprove,
  powerIconSize = 58,
}: MatchCardActionsProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.matchActionOverlay} pointerEvents="box-none">
      <View style={styles.matchActionSideSlot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip"
          onPress={onReject}
          style={({ pressed }) => [
            styles.matchActionCircleSide,
            matchActionBtnShadow,
            pressed && styles.matchActionPressed,
          ]}
        >
          <MatchCancelIcon size={24} />
        </Pressable>
      </View>
      <View style={styles.matchActionCenterSlot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Super like"
          onPress={onPower}
          style={({ pressed }) => [
            styles.matchActionCircleCenter,
            matchActionBtnShadow,
            pressed && styles.matchActionPressed,
          ]}
        >
          <MatchPowerIcon size={powerIconSize} />
        </Pressable>
      </View>
      <View style={styles.matchActionSideSlot}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Connect"
          onPress={onApprove}
          style={({ pressed }) => [
            styles.matchActionCircleSide,
            matchActionBtnShadow,
            pressed && styles.matchActionPressed,
          ]}
        >
          <MatchVerifyIcon size={22} />
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    matchCardOuter: {
      height: MATCH_CARD_HEIGHT,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      overflow: "visible",
      position: "relative",
    },
    matchCardImageClip: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: radius.xl,
      overflow: "hidden",
    },
    cardImageBg: {
      flex: 1,
    },
    cardImageStyle: {
      borderRadius: radius.xl,
    },
    cardScrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.42)",
    },
    topEndAccessoryWrap: {
      position: "absolute",
      top: spacing.md,
      right: spacing.md,
      zIndex: 2,
      alignItems: "flex-end",
    },
    cardContent: {
      flex: 1,
      justifyContent: "flex-end",
      padding: spacing.lg,
      paddingBottom: spacing.lg + MATCH_ACTION_OVERLAP,
      gap: spacing.xs,
    },
    name: { ...typography.bodyBold, color: colors.textOnPrimary },
    area: { ...typography.subhead, color: "rgba(255,255,255,0.92)" },
    tags: { ...typography.caption, color: "rgba(255,255,255,0.82)" },
    bio: {
      ...typography.body,
      color: "rgba(255,255,255,0.9)",
      marginTop: spacing.xs,
    },
    scoreBadge: {
      backgroundColor: colors.primary + "48",
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      alignItems: "center",
      minWidth: 56,
    },
    scoreValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textOnPrimary,
    },
    scorePct: { fontSize: 14, fontWeight: "600", color: colors.textOnPrimary },
    scoreLabel: { ...typography.caption, color: colors.textOnPrimary },
    matchActionOverlay: {
      position: "absolute",
      left: 0,
      right: 0,
      top: MATCH_CARD_HEIGHT - MATCH_ACTION_OVERLAP,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      zIndex: 4,
    },
    matchActionSideSlot: {
      flex: 1,
      alignItems: "center",
    },
    matchActionCenterSlot: {
      flex: 1,
      alignItems: "center",
    },
    matchActionCircleSide: {
      width: MATCH_ACTION_SIDE,
      height: MATCH_ACTION_SIDE,
      borderRadius: MATCH_ACTION_SIDE / 2,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    matchActionCircleCenter: {
      width: MATCH_ACTION_CENTER,
      height: MATCH_ACTION_CENTER,
      borderRadius: MATCH_ACTION_CENTER / 2,
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
    },
    matchActionPressed: { opacity: 0.92, transform: [{ scale: 0.97 }] },
  });
}
