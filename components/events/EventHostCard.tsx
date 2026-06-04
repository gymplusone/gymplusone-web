import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  avatarInitial: string;
  sectionLabel?: string;
  createdByLabel?: string;
};

export function EventHostCard({
  name,
  avatarInitial,
  sectionLabel = "Event host",
  createdByLabel = "Created by",
}: Props) {
  const styles = useThemedStyles(createStyles);
  return (
    <>
      <Text style={styles.sectionLabel}>{sectionLabel}</Text>
      <View style={styles.creatorRow}>
        <View style={styles.creatorAvatar}>
          <Text style={styles.creatorInitial}>{avatarInitial}</Text>
        </View>
        <View>
          <Text style={styles.creatorLabel}>{createdByLabel}</Text>
          <Text style={styles.creatorName}>{name}</Text>
        </View>
      </View>
    </>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    sectionLabel: {
      ...typography.bodyBold,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    creatorRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
    },
    creatorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary + "30",
      alignItems: "center",
      justifyContent: "center",
    },
    creatorInitial: {
      ...typography.title3,
      color: colors.text,
      fontWeight: "700",
    },
    creatorLabel: {
      ...typography.caption,
      color: colors.textMuted,
    },
    creatorName: {
      ...typography.bodyBold,
      color: colors.text,
    },
  });
}
