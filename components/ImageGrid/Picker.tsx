import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
  images?: string[];
  onSelect?: (uri: string) => void;
};

export function ImageGridPicker({ images = [], onSelect }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <ScrollView
      contentContainerStyle={styles.grid}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {images.length === 0 ? (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No images</Text>
        </View>
      ) : (
        images.map((src) => (
          <Pressable
            key={src}
            onPress={() => onSelect?.(src)}
            style={styles.tile}
          >
            <Image source={{ uri: src }} style={styles.image} />
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    grid: {
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
      paddingVertical: spacing.sm,
    },
    tile: {
      width: 96,
      height: 96,
      borderRadius: radius.md,
      overflow: "hidden",
      marginRight: spacing.sm,
    },
    image: { width: "100%", height: "100%", resizeMode: "cover" },
    placeholder: {
      width: 120,
      height: 96,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.md,
    },
    placeholderText: { ...typography.caption, color: colors.textMuted },
  });
}
