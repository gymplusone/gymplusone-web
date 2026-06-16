import FilterIconCustom from "@/components/icons/FilterIconCustom";
import { PremiumPaymentModal } from "@/components/PremiumPaymentModal";
import { mockProfiles } from "@/data/mockProfiles";
import { useApp } from "@/features/context/AppContext";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const USER_AVATAR_PLACEHOLDER = require("@/assets/ellipse.png");

function getTimeGreeting(): { label: string; emoji: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { label: "Good Morning", emoji: "🌤️" };
  if (h >= 12 && h < 17) return { label: "Good Afternoon", emoji: "☀️" };
  if (h >= 17 && h < 22) return { label: "Good Evening", emoji: "🌆" };
  return { label: "Hey there", emoji: "✨" };
}

// ─── Filter Types ────────────────────────────────────────────────────────────
type FilterState = {
  distanceKm: number;
  ageMin: number;
  ageMax: number;
  preference: "Personal Trainer" | "+1" | null;
  gender: "Male" | "Female" | "Non-Binary" | "See All";
  experience: "Beginner 0-1 Year" | "Intermediate 1-3 Years" | "Master Trainer 10+ Years" | null;
  daysPerWeek: "1 Day" | "2-3 Days" | "4-5 Days" | "6-7 Days" | null;
  timeOfDay: "Morning" | "Afternoon" | "Evening" | "Night" | null;
  specialises: "Weight loss" | "Muscle gain" | "Flexibility & mobility" | "Endurance" | null;
  interests: string[];
};

const INTERESTS = [
  "Strength Training", "Research", "Designing", "Animals", "Food",
  "Education", "Work-Life Balance", "Religion", "Sports", "Action",
];

const DEFAULT_FILTER: FilterState = {
  distanceKm: 200,
  ageMin: 20,
  ageMax: 25,
  preference: null,
  gender: "See All",
  experience: null,
  daysPerWeek: null,
  timeOfDay: null,
  specialises: null,
  interests: [],
};

// ─── Filter Modal ─────────────────────────────────────────────────────────────
function FilterModal({
  visible,
  onClose,
  filter,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  filter: FilterState;
  onApply: (f: FilterState) => void;
}) {
  const insets = useSafeAreaInsets();
  const [local, setLocal] = useState<FilterState>(filter);

  const toggle = <K extends keyof FilterState>(key: K, val: FilterState[K]) =>
    setLocal((prev) => ({ ...prev, [key]: prev[key] === val ? null : val }));

  const toggleInterest = (i: string) =>
    setLocal((prev) => ({
      ...prev,
      interests: prev.interests.includes(i)
        ? prev.interests.filter((x) => x !== i)
        : [...prev.interests, i],
    }));

  const Radio = ({
    label,
    active,
    onPress,
  }: {
    label: string;
    active: boolean;
    onPress: () => void;
  }) => (
    <Pressable style={fm.radioRow} onPress={onPress}>
      <View style={[fm.radioOuter, active && fm.radioOuterActive]}>
        {active && <View style={fm.radioInner} />}
      </View>
      <Text style={fm.radioLabel}>{label}</Text>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={fm.overlay} />
      </TouchableWithoutFeedback>

      <View style={[fm.sheet, { paddingBottom: insets.bottom + 16 }]}>
        {/* handle */}
        <View style={fm.handle} />

        {/* header */}
        <View style={fm.sheetHeader}>
          <Text style={fm.sheetTitle}>Filters</Text>
          <Pressable onPress={onClose} style={fm.closeBtn}>
            <Ionicons name="close" size={20} color="#333" />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={fm.scrollContent}>
          {/* Distance */}
          <Text style={fm.sectionLabel}>Distance range</Text>
          <View style={fm.sliderRow}>
            <Slider
              style={{ flex: 1, height: 32 }}
              minimumValue={1}
              maximumValue={500}
              step={1}
              value={local.distanceKm}
              onValueChange={(v) => setLocal((p) => ({ ...p, distanceKm: Math.round(v) }))}
              minimumTrackTintColor="#0001FF"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#0001FF"
            />
            <Text style={fm.sliderValue}>{local.distanceKm} km</Text>
          </View>

          {/* Age range */}
          <Text style={fm.sectionLabel}>Age range</Text>
          <View style={fm.sliderRow}>
            <Slider
              style={{ flex: 1, height: 32 }}
              minimumValue={18}
              maximumValue={60}
              step={1}
              value={local.ageMin}
              onValueChange={(v) => setLocal((p) => ({ ...p, ageMin: Math.round(v) }))}
              minimumTrackTintColor="#0001FF"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#0001FF"
            />
            <Text style={fm.sliderValue}>{local.ageMin} - {local.ageMax}</Text>
          </View>

          {/* Select preference */}
          <Text style={fm.sectionLabel}>Select preference</Text>
          <Radio
            label="Personal trainer"
            active={local.preference === "Personal Trainer"}
            onPress={() => toggle("preference", "Personal Trainer")}
          />
          <Radio
            label="+1"
            active={local.preference === "+1"}
            onPress={() => toggle("preference", "+1")}
          />

          {/* Gender */}
          <Text style={fm.sectionLabel}>Gender</Text>
          {(["Male", "Female", "Non-Binary", "See All"] as const).map((g) => (
            <Radio
              key={g}
              label={g}
              active={local.gender === g}
              onPress={() => setLocal((p) => ({ ...p, gender: g }))}
            />
          ))}

          {/* Experience */}
          <Text style={fm.sectionLabel}>How many years of experience should do they have?</Text>
          {(["Beginner 0-1 Year", "Intermediate 1-3 Years", "Master Trainer 10+ Years"] as const).map((e) => (
            <Radio
              key={e}
              label={e}
              active={local.experience === e}
              onPress={() => toggle("experience", e)}
            />
          ))}

          {/* Days per week */}
          <Text style={fm.sectionLabel}>How many days per week do they exercise?</Text>
          {(["1 Day", "2-3 Days", "4-5 Days", "6-7 Days"] as const).map((d) => (
            <Radio
              key={d}
              label={d}
              active={local.daysPerWeek === d}
              onPress={() => toggle("daysPerWeek", d)}
            />
          ))}

          {/* Time of day */}
          <Text style={fm.sectionLabel}>What time of day do they prefer to work out?</Text>
          {(["Morning", "Afternoon", "Evening", "Night"] as const).map((t) => (
            <Radio
              key={t}
              label={t}
              active={local.timeOfDay === t}
              onPress={() => toggle("timeOfDay", t)}
            />
          ))}

          {/* Specialises */}
          <Text style={fm.sectionLabel}>What areas do they specialise in?</Text>
          {(["Weight loss", "Muscle gain", "Flexibility & mobility", "Endurance"] as const).map((s) => (
            <Radio
              key={s}
              label={s}
              active={local.specialises === s}
              onPress={() => toggle("specialises", s)}
            />
          ))}

          {/* Interests */}
          <Text style={fm.sectionLabel}>Interest</Text>
          <View style={fm.interestsGrid}>
            {INTERESTS.map((interest) => {
              const active = local.interests.includes(interest);
              return (
                <Pressable
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  style={[fm.interestChip, active && fm.interestChipActive]}
                >
                  <Text style={[fm.interestChipText, active && fm.interestChipTextActive]}>
                    {interest}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Actions */}
        <View style={fm.footerRow}>
          <Pressable
            style={fm.resetBtn}
            onPress={() => setLocal(DEFAULT_FILTER)}
          >
            <Text style={fm.resetText}>Reset</Text>
          </Pressable>
          <Pressable
            style={fm.applyBtn}
            onPress={() => {
              onApply(local);
              onClose();
            }}
          >
            <Text style={fm.applyText}>Apply</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Home Screen ─────────────────────────────────────────────────────────
export default function MatchingHomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { switchAccountEnabled } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [superModalOpen, setSuperModalOpen] = useState(false);
  const [spotlightModalOpen, setSpotlightModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);

  const profile = mockProfiles[currentIndex];
  const greeting = getTimeGreeting();

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < mockProfiles.length - 1 ? prev + 1 : 0));
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

  // ── Personal Trainer View ───────────────────────────────────────────────────
  if (switchAccountEnabled) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Back button row */}
        <View style={styles.ptTopBar}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Header */}
        <View style={styles.ptHeaderCenter}>
          <Text style={styles.ptBrandTitle}>Gym+1</Text>
          <Text style={styles.ptBrandSub}>Match your workout vibe</Text>
        </View>

        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image source={USER_AVATAR_PLACEHOLDER} style={styles.userAvatar} />
            <View style={styles.headerTextCol}>
              <Text style={styles.helloLine}>Hello Jonathan</Text>
              <Text style={styles.greetingLine}>
                {greeting.label} {greeting.emoji}
              </Text>
              <View style={styles.headerBadgeRow}>
                <View style={[styles.headerBadge, { backgroundColor: "#0001FF" }]}>
                  <Text style={[styles.headerBadgeText, { color: "#fff" }]}>111 Hug × 18 Hug</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right: notification + settings + filter */}
          <View style={styles.headerRight}>
            <Pressable style={styles.headerIconBtn}>
              <View style={styles.headerIconWrap}>
                <Ionicons name="notifications" size={18} color="#fff" />
                <View style={styles.notificationBadge} />
              </View>
            </Pressable>
            <Pressable style={styles.headerIconBtn}>
              <Ionicons name="settings-sharp" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Filter button row */}
        <View style={styles.filterRow} className="bg-black">
          <Pressable style={styles.filterBtn} onPress={() => setFilterOpen(true)}>
            <FilterIconCustom size={30} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        >
          {/* Main Image */}
          <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: profile.mainImage }} style={styles.mainImage} />
              <View style={styles.imageOverlay} />
            </View>
            <View style={styles.plusOneBadge}>
              <Text style={styles.plusOneBadgeText}>+1</Text>
            </View>
          </View>

          {/* Action Buttons */}
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
          </View>
        </ScrollView>

        <FilterModal
          visible={filterOpen}
          onClose={() => setFilterOpen(false)}
          filter={filter}
          onApply={setFilter}
        />

        <PremiumPaymentModal
          visible={superModalOpen}
          mode="super"
          onClose={() => setSuperModalOpen(false)}
          onSuccess={() => setSuperModalOpen(false)}
        />
      </View>
    );
  }

  // ── +1 User View ────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: 100 }]}>
      {/* Header brand */}
      <View style={styles.ptHeaderCenter}>
        <Text style={styles.ptBrandTitle}>Gym+1</Text>
        <Text style={styles.ptBrandSub}>Match your workout vibe</Text>
      </View>

      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Image source={USER_AVATAR_PLACEHOLDER} style={styles.userAvatar} />
          <View style={styles.headerTextCol}>
            <Text style={styles.helloLine}>Hello, Jennie</Text>
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
              <Ionicons name="notifications" size={18} color="#fff" />
              <View style={styles.notificationBadge} />
            </View>
          </Pressable>
          <Pressable style={styles.headerIconBtn}>
            <Ionicons name="settings-sharp" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
   <View className="flex justify-right w-full ml-auto">
          <button>

            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.6254 9.47461H19.6504C19.1629 9.47461 18.7754 9.08711 18.7754 8.59961C18.7754 8.11211 19.1629 7.72461 19.6504 7.72461H26.6254C27.1129 7.72461 27.5004 8.11211 27.5004 8.59961C27.5004 9.08711 27.1129 9.47461 26.6254 9.47461Z" fill="url(#paint0_radial_2576_31301)" />
              <path d="M8.025 9.47461H3.375C2.8875 9.47461 2.5 9.08711 2.5 8.59961C2.5 8.11211 2.8875 7.72461 3.375 7.72461H8.025C8.5125 7.72461 8.9 8.11211 8.9 8.59961C8.9 9.08711 8.5 9.47461 8.025 9.47461Z" fill="url(#paint1_radial_2576_31301)" />
              <path d="M12.6748 13.5371C15.4017 13.5371 17.6123 11.3265 17.6123 8.59961C17.6123 5.8727 15.4017 3.66211 12.6748 3.66211C9.9479 3.66211 7.7373 5.8727 7.7373 8.59961C7.7373 11.3265 9.9479 13.5371 12.6748 13.5371Z" fill="url(#paint2_radial_2576_31301)" />
              <path d="M26.6246 22.2627H21.9746C21.4871 22.2627 21.0996 21.8752 21.0996 21.3877C21.0996 20.9002 21.4871 20.5127 21.9746 20.5127H26.6246C27.1121 20.5127 27.4996 20.9002 27.4996 21.3877C27.4996 21.8752 27.1121 22.2627 26.6246 22.2627Z" fill="url(#paint3_radial_2576_31301)" />
              <path d="M10.35 22.2627H3.375C2.8875 22.2627 2.5 21.8752 2.5 21.3877C2.5 20.9002 2.8875 20.5127 3.375 20.5127H10.35C10.8375 20.5127 11.225 20.9002 11.225 21.3877C11.225 21.8752 10.825 22.2627 10.35 22.2627Z" fill="url(#paint4_radial_2576_31301)" />
              <path d="M17.3252 26.3379C20.0521 26.3379 22.2627 24.1273 22.2627 21.4004C22.2627 18.6735 20.0521 16.4629 17.3252 16.4629C14.5983 16.4629 12.3877 18.6735 12.3877 21.4004C12.3877 24.1273 14.5983 26.3379 17.3252 26.3379Z" fill="#0001FF" />
              <defs>
                <radialGradient id="paint0_radial_2576_31301" cx="0" cy="0" r="1" gradientTransform="matrix(-7.65974 1.70494 -8.50032 -0.327033 27.1859 7.74432)" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0001FF" />
                  <stop offset="0.333333" stop-color="#1819CB" />
                  <stop offset="0.763585" stop-color="#050269" />
                  <stop offset="1" stop-color="#020050" />
                </radialGradient>
                <radialGradient id="paint1_radial_2576_31301" cx="0" cy="0" r="1" gradientTransform="matrix(-5.6186 1.70494 -6.23519 -0.327033 8.6693 7.74432)" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0001FF" />
                  <stop offset="0.333333" stop-color="#1819CB" />
                  <stop offset="0.763585" stop-color="#050269" />
                  <stop offset="1" stop-color="#020050" />
                </radialGradient>
                <radialGradient id="paint2_radial_2576_31301" cx="0" cy="0" r="1" gradientTransform="matrix(-8.66933 9.62071 -9.62071 -1.8454 17.2563 3.77336)" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0001FF" />
                  <stop offset="0.333333" stop-color="#1819CB" />
                  <stop offset="0.763585" stop-color="#050269" />
                  <stop offset="1" stop-color="#020050" />
                </radialGradient>
                <radialGradient id="paint3_radial_2576_31301" cx="0" cy="0" r="1" gradientTransform="matrix(-5.6186 1.70494 -6.23519 -0.327033 27.2689 20.5324)" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0001FF" />
                  <stop offset="0.333333" stop-color="#1819CB" />
                  <stop offset="0.763585" stop-color="#050269" />
                  <stop offset="1" stop-color="#020050" />
                </radialGradient>
                <radialGradient id="paint4_radial_2576_31301" cx="0" cy="0" r="1" gradientTransform="matrix(-7.65974 1.70494 -8.50032 -0.327033 10.9105 20.5324)" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#0001FF" />
                  <stop offset="0.333333" stop-color="#1819CB" />
                  <stop offset="0.763585" stop-color="#050269" />
                  <stop offset="1" stop-color="#020050" />
                </radialGradient>
              </defs>
            </svg>

          </button>

        </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: profile.mainImage }} style={styles.mainImage} />
            <View style={styles.imageOverlay} />
          </View>
          <View style={styles.plusOneBadge}>
            <Text style={styles.plusOneBadgeText}>+1</Text>
          </View>
        </View>

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

          <View style={styles.extraPhotoContainer}>
            <Image source={profile.workoutPlansImage} style={styles.extraPhoto} />
          </View>
          <Text style={styles.extraPhotoDesc}>
            I've been skydiving, I can juggle, and I've climbed Mt. Everest.
          </Text>

          <View style={styles.extraPhotoContainer}>
            <Image source={profile.weightLossImage} style={styles.extraPhoto} />
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

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centerContainer: { flex: 1, alignItems: "center", justifyContent: "center" },

  // PT top bar (back button)
  ptTopBar: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },

  ptHeaderCenter: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 2,
  },
  ptBrandTitle: {
    fontSize: 22,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#000",
  },
  ptBrandSub: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#555",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  userAvatar: { width: 50, height: 50, borderRadius: 25 },
  headerTextCol: { marginLeft: 12 },
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
  headerBadgeRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  headerBadge: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12 },
  headerBadgeText: { fontSize: 11, fontWeight: "400" },

  headerRight: { flexDirection: "row", gap: 12 },
  headerIconBtn: {
    padding: 4,
    backgroundColor: "#000",
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerIconWrap: { position: "relative" },
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

  // Filter row (right-aligned)
  filterRow: {
    paddingHorizontal: 20,
    alignItems: "flex-end",
    marginBottom: 4,
  },
  filterBtn: {
    backgroundColor: "#F0F0FF",
    borderRadius: 10,
    padding: 8,
  },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

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
  mainImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(39, 0, 70, 0.15)",
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
  plusOneBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: -70,
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

  infoSection: { paddingHorizontal: 10 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
  locationText: { fontSize: 12, color: "#555", fontWeight: "600" },
  nameAge: { fontSize: 28, fontWeight: "800", color: "#000", marginBottom: 2 },
  distanceText: { fontSize: 12, color: "#888", marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#000", marginTop: 20, marginBottom: 8 },
  bioText: { fontSize: 14, color: "#555", lineHeight: 22 },

  chipsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: { backgroundColor: "#F0F0FF", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chipText: { color: "#0001FF", fontSize: 12, fontWeight: "700" },

  extraPhotoContainer: { width: "100%", aspectRatio: 16 / 9, borderRadius: 16, overflow: "hidden", marginTop: 20 },
  extraPhoto: { width: "100%", height: "100%", resizeMode: "cover" },
  extraPhotoDesc: { fontSize: 13, color: "#555", marginTop: 8, lineHeight: 20 },
});

// ─── Filter Modal Styles ──────────────────────────────────────────────────────
const fm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    flex: 1,
    textAlign: "center",
  },
  closeBtn: {
    position: "absolute",
    right: 20,
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginTop: 18,
    marginBottom: 10,
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sliderValue: {
    fontSize: 12,
    color: "#555",
    minWidth: 60,
    textAlign: "right",
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#BBBBC0",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#0001FF",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0001FF",
  },
  radioLabel: {
    fontSize: 14,
    color: "#222",
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  interestChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F0F0FF",
    borderWidth: 1,
    borderColor: "#D0D0FF",
  },
  interestChipActive: {
    backgroundColor: "#0001FF",
    borderColor: "#0001FF",
  },
  interestChipText: {
    fontSize: 12,
    color: "#0001FF",
    fontWeight: "600",
  },
  interestChipTextActive: {
    color: "#fff",
  },
  footerRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#0001FF",
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: {
    color: "#0001FF",
    fontWeight: "700",
    fontSize: 15,
  },
  applyBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0001FF",
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
