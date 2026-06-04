import { MatchPowerIcon } from "@/components/icons/MatchActionIcons";
import type { ThemeColors } from "@/constants/Theme";
import { radius, shadows, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type PowerUpsellModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function PowerUpsellModal({
  visible,
  onClose,
}: PowerUpsellModalProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityLabel="Close power likes modal"
        />
        <View style={styles.card}>
          <View style={[styles.iconWrap, shadows.lg]}>
            <MatchPowerIcon size={42} />
          </View>
          <Text style={styles.title}>No Power Likes Left!</Text>
          <Text style={styles.body}>
            Why wait for an RSVP? Power like now and send an instant message to
            your match.!
          </Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryBtnPressed,
            ]}
          >
            <Text style={styles.primaryText}>See plans</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
    },
    card: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
    iconWrap: {
      width: 84,
      height: 84,
      borderRadius: 52,
      backgroundColor: colors.overlay,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.title3,
      color: colors.text,
      marginBottom: spacing.md,
      textAlign: "center",
    },
    body: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 23,
      marginBottom: spacing.xl,
    },
    primaryBtn: {
      width: "100%",
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      paddingVertical: spacing.md,
    },
    primaryBtnPressed: { opacity: 0.88 },
    primaryText: {
      ...typography.bodyBold,
      color: colors.textOnPrimary,
    },
  });
}
