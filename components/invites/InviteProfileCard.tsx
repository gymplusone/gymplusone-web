import { radius, shadows, spacing, typography } from "@/constants/Theme";
import type { InviteProfile } from "@/data/mockInvites";
import { LinearGradient } from "expo-linear-gradient";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  invite: InviteProfile;
  onPress?: () => void;
};

const BLUR_RADIUS = 28;

export function InviteProfileCard({ invite, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${invite.name}, ${invite.age}, ${invite.distanceLabel}`}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View style={styles.shadowOuter}>
        <View style={styles.cardClip}>
          <ImageBackground
            source={invite.image}
            style={styles.image}
            imageStyle={styles.imageInner}
            resizeMode="cover"
            blurRadius={BLUR_RADIUS}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.88)"]}
              locations={[0, 0.42, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.textBlock}>
              <Text style={styles.nameAge} numberOfLines={1}>
                {invite.name}, {invite.age}
              </Text>
              <Text style={styles.distance} numberOfLines={1}>
                {invite.distanceLabel}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.92,
  },
  shadowOuter: {
    borderRadius: radius.xxl,
    ...shadows.md,
  },
  cardClip: {
    borderRadius: radius.xxl,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    justifyContent: "flex-end",
  },
  imageInner: {
    borderRadius: radius.xxl,
  },
  textBlock: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    paddingTop: spacing.xl,
    alignItems: "center",
    width: "100%",
  },
  nameAge: {
    ...typography.title3,
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: spacing.xxs,
  },
  distance: {
    ...typography.subhead,
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
  },
});
