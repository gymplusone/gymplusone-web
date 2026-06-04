import { EVENT_MAP_PREVIEW_HEIGHT } from "@/constants/eventUI";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { openGoogleMapsSearch } from "@/utils/maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  sectionLabel?: string;
  address: string;
  mapsQuery: string;
};

export function EventMapPreview({
  sectionLabel = "Location",
  address,
  mapsQuery,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <>
      <Text style={styles.sectionLabel}>{sectionLabel}</Text>
      <Pressable
        onPress={() => openGoogleMapsSearch(mapsQuery)}
        style={({ pressed }) => [
          styles.mapCard,
          pressed && styles.mapCardPressed,
        ]}
      >
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={40} color={colors.textMuted} />
          <Text style={styles.mapHint}>Tap to open in Maps</Text>
          <Text style={styles.mapAddress} numberOfLines={2}>
            {address}
          </Text>
        </View>
      </Pressable>
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
    mapCard: {
      borderRadius: radius.lg,
      overflow: "hidden",
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mapCardPressed: { opacity: 0.9 },
    mapPlaceholder: {
      height: EVENT_MAP_PREVIEW_HEIGHT,
      backgroundColor: colors.surfaceElevated,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    mapHint: {
      ...typography.caption,
      color: colors.textMuted,
      marginTop: spacing.xs,
    },
    mapAddress: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: spacing.xs,
    },
  });
}
