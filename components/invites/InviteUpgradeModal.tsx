import { Button } from "@/components/Button";
import { CloseCircleIcon } from "@/components/icons/CloseCircleIcon";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import type { InviteProfile } from "@/data/mockInvites";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AVATAR_BLUR = 22;
const HERO_BLUR = 18;

type Props = {
  visible: boolean;
  invite: InviteProfile | null;
  onClose: () => void;
  onUpgrade?: () => void;
};

export function InviteUpgradeModal({
  visible,
  invite,
  onClose,
  onUpgrade,
}: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (invite == null) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Dismiss"
          onPress={onClose}
        />
        <View style={styles.sheet} accessibilityViewIsModal>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && styles.closeBtnPressed,
            ]}
            hitSlop={12}
          >
            <CloseCircleIcon color={colors.text} size={26} />
          </Pressable>

          <ImageBackground
            source={invite.image}
            style={styles.hero}
            imageStyle={styles.heroImage}
            resizeMode="cover"
            blurRadius={HERO_BLUR}
          >
            <LinearGradient
              colors={["transparent", "rgba(20,23,30,0.75)"]}
              locations={[0.2, 1]}
              style={StyleSheet.absoluteFill}
            />
          </ImageBackground>

          <View style={styles.body}>
            <View style={styles.avatarOverlap}>
              <View style={styles.avatarRing}>
                <ImageBackground
                  source={invite.image}
                  style={styles.avatarInner}
                  imageStyle={styles.avatarImage}
                  resizeMode="cover"
                  blurRadius={AVATAR_BLUR}
                />
              </View>
            </View>

            <View style={styles.messageBlock}>
              <Text style={styles.heading}>
                Want to view {invite.name}
                {"'s"} profile?
              </Text>
              <Text style={styles.bodyMessage}>
                Upgrade to Super +1 or PT and start{"\n"}
                building stronger fitness connections.
              </Text>
            </View>
            <View style={styles.ctaWrap}>
              <Button
                title="Upgrade now"
                onPress={() => {
                  onUpgrade?.();
                  onClose();
                }}
                style={styles.cta}
                textStyle={styles.ctaText}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const AVATAR_SIZE = 104;
const RING = 3;
const AVATAR_OUTER = AVATAR_SIZE + RING * 2;

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
    },
    sheet: {
      width: "100%",
      maxWidth: 380,
      borderRadius: radius.xl,
      overflow: "hidden",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    closeBtn: {
      position: "absolute",
      top: spacing.sm,
      right: spacing.sm,
      zIndex: 2,
      padding: spacing.xxs,
      borderRadius: radius.md,
    },
    closeBtnPressed: {
      opacity: 0.7,
    },
    hero: {
      width: "100%",
      height: 128,
    },
    heroImage: {
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
    },
    body: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    avatarOverlap: {
      marginTop: -(AVATAR_OUTER / 2),
      alignItems: "center",
      marginBottom: spacing.md,
    },
    avatarRing: {
      width: AVATAR_OUTER,
      height: AVATAR_OUTER,
      borderRadius: AVATAR_OUTER / 2,
      borderColor: "#FFFFFF",
      overflow: "hidden",
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarInner: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      overflow: "hidden",
    },
    avatarImage: {
      borderRadius: AVATAR_SIZE / 2,
    },
    messageBlock: {
      marginBottom: spacing.lg,
    },
    heading: {
      ...typography.title3,
      color: colors.text,
      textAlign: "center",
      lineHeight: 26,
    },
    bodyMessage: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginTop: spacing.sm,
    },
    ctaWrap: {
      alignItems: "center",
    },
    cta: {
      borderRadius: radius.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.lg,
      minHeight: 40,
    },
    ctaText: {
      ...typography.footnote,
      fontWeight: "600",
    },
  });
}
