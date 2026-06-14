import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { mockProfiles } from "@/data/mockProfiles";
import { PremiumPaymentModal } from "@/components/PremiumPaymentModal";

const { width } = Dimensions.get("window");

const USER_AVATAR_PLACEHOLDER = require("@/assets/images/gym/2149278038.jpg");

function getTimeGreeting(): { label: string; emoji: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { label: "Good Morning", emoji: "🌤️" };
  if (h >= 12 && h < 17) return { label: "Good Afternoon", emoji: "☀️" };
  if (h >= 17 && h < 22) return { label: "Good Evening", emoji: "🌆" };
  return { label: "Hey there", emoji: "✨" };
}

export default function MatchingHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [superModalOpen, setSuperModalOpen] = useState(false);
  const [spotlightModalOpen, setSpotlightModalOpen] = useState(false);

  const profile = mockProfiles[currentIndex];
  const greeting = getTimeGreeting();

  const handleNext = () => {
    if (currentIndex < mockProfiles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop or show "no more profiles"
      setCurrentIndex(0);
    }
  };

  const handleLike = () => {
    router.push(`/match-modal?id=${profile.id}&type=match`);
  };

  const handlePowerLike = () => {
    router.push(`/match-modal?id=${profile.id}&type=powerLike`);
  };

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text>No more profiles.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: 100 }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Image source={USER_AVATAR_PLACEHOLDER} style={styles.userAvatar} />
          <View style={styles.headerTextCol}>
            <Text style={styles.helloLine}>Hello, Jonathan</Text>
            <Text style={styles.greetingLine}>
              {greeting.label} {greeting.emoji}
            </Text>
            <View style={styles.headerBadgeRow}>
              <Pressable
                onPress={() => setSpotlightModalOpen(true)}
                style={[styles.headerBadge, { backgroundColor: "#0001FF" }]}
              >
                <Text style={[styles.headerBadgeText, { color: "#fff" }]}>Spotlight</Text>
              </Pressable>
              <Pressable
                onPress={() => setSuperModalOpen(true)}
                style={[styles.headerBadge, { backgroundColor: "#0001FF" }]}
              >
                <Text style={[styles.headerBadgeText, { color: "#fff" }]}>Super +1</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerIconBtn}>
            <View style={styles.headerIconWrap}>
              <Ionicons name="notifications" size={24} color="#000" />
              <View style={styles.notificationBadge} />
            </View>
          </Pressable>
          <Pressable style={styles.headerIconBtn}>
            <Ionicons name="settings-sharp" size={24} color="#000" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Image with SVG-like styling (Rounded + border + shadow) */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: profile.mainImage }} style={styles.mainImage} />
            <View style={styles.imageOverlay} />
          </View>
          {/* Circular +1 Badge */}
          <View style={styles.plusOneBadge}>
            <Text style={styles.plusOneBadgeText}>+1</Text>
          </View>
        </View>

        {/* Action Buttons overlaying the image bottom */}
        <View style={styles.actionButtonsRow}>
          <Pressable style={[styles.actionBtn, { width: 50, height: 50 }]} onPress={handleNext}>
            <Feather name="x" size={24} color="#0001FF" />
          </Pressable>
          <Pressable style={[styles.actionBtn, { width: 64, height: 64 }]} onPress={handlePowerLike}>
            <Ionicons name="flash" size={32} color="#FFD700" />
          </Pressable>
          <Pressable style={[styles.actionBtn, { width: 50, height: 50 }]} onPress={handleLike}>
            <FontAwesome name="check" size={24} color="#0001FF" />
          </Pressable>
        </View>

        {/* Profile Info */}
        <View style={styles.infoSection}>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color="#555" />
            <Text style={styles.locationText}>{profile.location}</Text>
          </View>
          <Text style={styles.nameAge}>{profile.name}, {profile.age}</Text>
          <Text style={styles.distanceText}>{profile.distance}</Text>

          <Text style={styles.sectionTitle}>Bio</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>

          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.chipsContainer}>
            {profile.interests.map((interest, idx) => (
              <View key={idx} style={styles.chip}>
                <Text style={styles.chipText}>{interest}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Experience</Text>
          <Text style={styles.bioText}>{profile.experience}</Text>

          <Text style={styles.sectionTitle}>Ethnicity</Text>
          <Text style={styles.bioText}>{profile.ethnicity}</Text>

          <Text style={styles.sectionTitle}>Fitness Activity per week</Text>
          <Text style={styles.bioText}>{profile.activityPerWeek}</Text>

          {/* Additional Photos / Workout Plans */}
          <View style={styles.extraPhotoContainer}>
            <Image source={{ uri: profile.workoutPlansImage }} style={styles.extraPhoto} />
          </View>
          <Text style={styles.extraPhotoDesc}>
            I've been skydiving, I can juggle, and I've climbed Mt. Everest.
          </Text>

          <View style={styles.extraPhotoContainer}>
            <Image source={{ uri: profile.weightLossImage }} style={styles.extraPhoto} />
          </View>
          <Text style={styles.extraPhotoDesc}>
            Starts with a good cup of coffee, a walk in the park, and ends with a movie marathon.
          </Text>

          <Text style={styles.sectionTitle}>Workout Plans</Text>
          <View style={styles.extraPhotoContainer}>
            <Image source={{ uri: profile.mainImage }} style={styles.extraPhoto} />
          </View>

          <Text style={styles.sectionTitle}>Weight Loss</Text>
          <Text style={styles.bioText}>Plans focused on burning calories and reducing body fat.</Text>
          <View style={styles.extraPhotoContainer}>
            <Image source={{ uri: profile.workoutPlansImage }} style={styles.extraPhoto} />
          </View>
        </View>
      </ScrollView>

      <PremiumPaymentModal
        visible={superModalOpen}
        mode="super"
        onClose={() => setSuperModalOpen(false)}
        onSuccess={() => setSuperModalOpen(false)}
      />
      <PremiumPaymentModal
        visible={spotlightModalOpen}
        mode="spotlight"
        onClose={() => setSpotlightModalOpen(false)}
        onSuccess={() => setSpotlightModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  headerTextCol: {
    marginLeft: 12,
  },
  helloLine: {
    fontSize: 12,
    color: "#888",
    fontFamily: "manrope",
  },
  greetingLine: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    fontFamily: "manrope",
  },
  headerBadgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  headerIconBtn: {
    padding: 4,
    backgroundColor: "#000",
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconWrap: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
    borderWidth: 1,
    borderColor: "#000",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 0.9,
    borderRadius: 33,
    backgroundColor: "#f0f0f0",
    borderWidth: 6,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12.5,
    elevation: 8,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(39, 0, 70, 0.15)", // Overlay filter from SVG
  },
  plusOneBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0001FF",
    alignItems: "center",
    justifyContent: "center",
  },
  plusOneBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: -70, // Overlap the image
    marginBottom: 20,
    zIndex: 10,
  },
  actionBtn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  infoSection: {
    paddingHorizontal: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#555",
    fontWeight: "600",
  },
  nameAge: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    marginBottom: 2,
  },
  distanceText: {
    fontSize: 12,
    color: "#888",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    marginTop: 20,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: "#F0F0FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    color: "#0001FF",
    fontSize: 12,
    fontWeight: "700",
  },
  extraPhotoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 20,
  },
  extraPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  extraPhotoDesc: {
    fontSize: 13,
    color: "#555",
    marginTop: 8,
    lineHeight: 20,
  },
});
