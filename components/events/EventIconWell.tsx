import {
  EVENT_HERO_ICON_WELL_SIZE,
  EVENT_ICON_WELL_BG,
  EVENT_LIST_ICON_WELL_SIZE,
} from "@/constants/eventUI";
import type { EventIconName } from "@/data/mockEvents";
import { useTheme } from "@/features/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";

type Variant = "list" | "hero";

type Props = {
  variant?: Variant;
  icon?: EventIconName;
  iconSize?: number;
};

export function EventIconWell({ variant = "list", icon, iconSize }: Props) {
  const { colors } = useTheme();
  const size =
    variant === "hero" ? EVENT_HERO_ICON_WELL_SIZE : EVENT_LIST_ICON_WELL_SIZE;
  const defaultIconSize = variant === "hero" ? 28 : 22;

  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        variant === "hero" && styles.heroRing,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={iconSize ?? defaultIconSize}
          color={colors.text}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: EVENT_ICON_WELL_BG,
    alignItems: "center",
    justifyContent: "center",
  },
  heroRing: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
});
