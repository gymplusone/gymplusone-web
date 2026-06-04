import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import type { ReactNode } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
  View,
} from "react-native";

export type MenuAnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** `top` / `right` for use with `MenuDropdownModal` (panel is absolutely positioned). */
export function menuPanelPositionFromAnchor(anchor: MenuAnchorRect): ViewStyle {
  const { width: winW } = Dimensions.get("window");
  return {
    top: anchor.y + anchor.height + 4,
    right: winW - anchor.x - anchor.width,
  };
}

type MenuDropdownModalProps = {
  visible: boolean;
  onClose: () => void;
  /** Panel placement, e.g. `{ top, right }` from `menuPanelPositionFromAnchor` or fixed header offsets. */
  panelPositionStyle: ViewStyle;
  backdropAccessibilityLabel?: string;
  children: ReactNode;
};

export function MenuDropdownModal({
  visible,
  onClose,
  panelPositionStyle,
  backdropAccessibilityLabel = "Dismiss menu",
  children,
}: MenuDropdownModalProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {visible ? (
        <View style={styles.root}>
          <Pressable
            style={styles.backdrop}
            onPress={onClose}
            accessibilityLabel={backdropAccessibilityLabel}
          />
          <View style={[styles.panel, styles.panelAbsolute, panelPositionStyle]}>
            {children}
          </View>
        </View>
      ) : null}
    </Modal>
  );
}

type MenuDropdownItemProps = {
  /** Accessibility label; also default row text when `children` is omitted */
  label: string;
  onPress: () => void;
  destructive?: boolean;
  /** Custom row (e.g. icon + label). When set, `label` is still used for accessibility only. */
  children?: ReactNode;
};

export function MenuDropdownItem({
  label,
  onPress,
  destructive,
  children,
}: MenuDropdownItemProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
    >
      <View style={styles.itemInner}>
        {children != null ? (
          children
        ) : (
          <Text
            style={[styles.itemText, destructive && styles.itemTextDestructive]}
          >
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export function MenuDropdownSeparator() {
  const styles = useThemedStyles(createStyles);
  return <View style={styles.separator} />;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
    },
    panel: {
      minWidth: 168,
      borderRadius: radius.sm,
      overflow: "hidden",
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    panelAbsolute: {
      position: "absolute",
    },
    item: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
    },
    itemPressed: {
      backgroundColor: colors.surface,
    },
    itemInner: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minWidth: 0,
    },
    itemText: {
      ...typography.subhead,
      flexShrink: 1,
      color: colors.text,
    },
    itemTextDestructive: {
      color: colors.error,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      marginLeft: spacing.sm,
      backgroundColor: colors.borderLight,
    },
  });
}
