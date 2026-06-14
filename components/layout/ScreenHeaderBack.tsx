import { HeaderBackButton } from "@/components/layout/HeaderBackButton";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_SIDE_WIDTH = 42;

type Props = {
  title: string;
  onBack?: () => void;
  /** `center` — title in the horizontal center (balanced slots for back). `leading` — title after back (default). */
  titleAlign?: "leading" | "center";
  /** Optional component to render on the right side of the header */
  rightElement?: React.ReactNode;
};

/** Screen title row with uniform ← back (Private Event pattern). */
export function ScreenHeaderBack({
  title,
  onBack,
  titleAlign = "leading",
  rightElement,
}: Props) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.md }]}>
      {titleAlign === "center" ? (
        <View style={styles.row}>
          <View style={styles.side}>
            <HeaderBackButton onPress={onBack} />
          </View>
          <View style={styles.titleCenterWrap}>
            <Text
              style={[styles.titleBase, styles.titleCentered]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
          <View style={[styles.side, styles.sideRight]}>
            {rightElement}
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          <HeaderBackButton onPress={onBack} />
          <Text
            style={[styles.titleBase, styles.titleLeading]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {rightElement && (
            <View style={styles.sideRight}>
              {rightElement}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    side: {
      width: HEADER_SIDE_WIDTH,
      alignItems: "flex-start",
    },
    sideRight: {
      alignItems: "flex-end",
    },
    titleCenterWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    titleBase: {
      ...typography.title2,
      color: colors.text,
      fontSize: 16,
    },
    titleLeading: {
      flex: 1,
    },
    titleCentered: {
      flexShrink: 1,
      width: "100%",
      textAlign: "center",
    },
  });
}
