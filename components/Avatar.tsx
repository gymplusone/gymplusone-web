import type { ThemeColors } from "@/constants/Theme";
import { typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { container: number; fontSize: number }> = {
  sm: { container: 40, fontSize: 16 },
  md: { container: 56, fontSize: 20 },
  lg: { container: 96, fontSize: 36 },
};

type AvatarProps = {
  initial: string;
  size?: Size;
  /** When set, shows a circular photo; `initial` remains for accessibility / fallback label. */
  source?: ImageSourcePropType;
};

export function Avatar({ initial, size = "md", source }: AvatarProps) {
  const styles = useThemedStyles(createStyles);
  const { container, fontSize } = sizes[size];
  const circle = {
    width: container,
    height: container,
    borderRadius: container / 2,
  };

  if (source != null) {
    return (
      <View style={[styles.container, circle, styles.imageWrap]}>
        <Image
          source={source}
          style={[styles.image, circle]}
          resizeMode="cover"
          accessibilityLabel={initial}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.initialWrap, circle]}>
      <Text style={[styles.text, { fontSize }]} numberOfLines={1}>
        {initial.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    imageWrap: {
      backgroundColor: colors.surface,
    },
    initialWrap: {
      backgroundColor: colors.primary + "28",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    text: {
      fontWeight: "700",
      color: colors.primary,
    },
  });
}
