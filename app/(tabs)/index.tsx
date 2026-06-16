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
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const USER_AVATAR_PLACEHOLDER = require("@/assets/ellipse.png");
const jennieImg = require("@/assets/jennie.png");
// const loyal = require("@/assets/plate1.png");

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

// ─── Mock Feed Data ──────────────────────────────────────────────────────────
const MOCK_FEED = [
  {
    id: "1",
    user: {
      name: "Eleanor Pena",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      isVerified: false,
    },
    time: "45 minutes ago",
    content: "Enter the email associated with your account and we'll send an email with code to reset.",
    likes: 99,
    comments: 99,
    image: "https://picsum.photos/400/200",
  },
  {
    id: "2",
    user: {
      name: "Selena Apache",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      isVerified: false,
    },
    time: "2 hours ago",
    content: "Enter the email associated with your account and we'll send an email with code to reset.",
    likes: 45,
    comments: 12,
    image: "https://picsum.photos/400/200",
    isPlan: true,
    plan: {
      title: "Muscle Building Plan",
      price: "£39.99",
      description: "Designed to increase muscle mass.",
    },
  },
  {
    id: "3",
    user: {
      name: "Eleanor Pena",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      isVerified: true,
    },
    time: "3 hours ago",
    content: "Enter the email associated with your account and we'll send an email with code to reset.",
    likes: 78,
    comments: 34,
    image: null,
  },
];

// ─── Feed Post Component ─────────────────────────────────────────────────────
const FeedPost = ({ post }: { post: any }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <View style={styles.feedItem}>
      {/* Header - Avatar, Name, Time, and 3-dot menu */}
      <View style={styles.feedHeader}>
        <Image
          source={{ uri: post.user.avatar }}
          style={styles.feedAvatar}
        />
        <View style={styles.feedUserInfo}>
          <View style={styles.feedUserNameRow}>
            <Text style={styles.feedUserName}>
              {post.user.name}
            </Text>
            {post.user.isVerified && (
              <View style={styles.feedVerifiedIcon}>
                <Feather name="check-circle" size={16} color="#0001FF" />
              </View>
            )}
          </View>
          <Text style={styles.feedTime}>{post.time}</Text>
        </View>
        <TouchableOpacity style={styles.feedMoreBtn}>
          <Feather name="more-horizontal" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Post Image - Directly under the header */}
      {post.image && (
        <View style={styles.feedImageContainer}>
          <Image
            source={{ uri: post.image }}
            style={styles.feedImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Content */}
      <Text style={styles.feedContent}>
        {post.content}
      </Text>

      {/* Plan Card */}
      {post.isPlan && post.plan && (
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>
              {post.plan.title} - {post.plan.price}
            </Text>
          </View>
          <Text style={styles.planDescription}>
            {post.plan.description}
          </Text>
          <View style={styles.planActions}>
            <TouchableOpacity style={styles.planViewBtn}>
              <Text style={styles.planViewText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Actions - Like and Comment */}
      <View style={styles.feedActions}>
        <TouchableOpacity
          onPress={handleLike}
          style={styles.feedActionBtn}
        >
          <Feather
            name="heart"
            size={20}
            color={liked ? "#EF4444" : "#9CA3AF"}
            fill={liked ? "#EF4444" : "none"}
          />
          <Text style={[styles.feedActionText, liked && styles.feedActionTextLiked]}>
            {likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.feedActionBtn}>
          <Feather name="message-circle" size={20} color="#9CA3AF" />
          <Text style={styles.feedActionText}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
        ? prev.interests.filter((x: string) => x !== i)
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
              onValueChange={(v: number) => setLocal((p) => ({ ...p, distanceKm: Math.round(v) }))}
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
              onValueChange={(v: number) => setLocal((p) => ({ ...p, ageMin: Math.round(v) }))}
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
  const [composerText, setComposerText] = useState("");

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
        <View className="items-center font-author mt-12">
          {/* <GymIcon width={100} height={39} /> */}
          <Image source={require("@/assets/logo-hm.png")} width={100} height={39} />
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
        <View style={styles.filterRow}>
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
              {profile.interests.map((interest: string, idx: number) => (
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
  // ── +1 User View ────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Header - Everything inside ScrollView now */}
        <View style={styles.headerContainer}>
          {/* Brand */}
          <View className="items-center font-author mt-8">
            <Text className="text-black text-4xl italic font-bold">Gym+1</Text>
            <Text className="text-black font-[375] text-md italic">Match your workout vibe</Text>
          </View>

          {/* Profile Section */}
          <View style={styles.headerRow} className="">
            <View style={styles.headerLeft}>
              <Image source={jennieImg} style={styles.userAvatar} />
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

          {/* Composer with avatar inside */}
          <View style={styles.composerContainer} className="">
            <View style={styles.composerWrapper}>
              <Image source={jennieImg} style={styles.composerAvatar} />
              <TextInput
                value={composerText}
                onChangeText={setComposerText}
                placeholder="What's on your mind?"
                placeholderTextColor="#9CA3AF"
                style={styles.composerInput}
                multiline
              />
              <TouchableOpacity>
                <Feather name="image" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Feed Posts */}
        {MOCK_FEED.map((post) => (
          <FeedPost key={post.id} post={post} />
        ))}
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
    paddingHorizontal: 8,
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

  // Header styles (now part of scroll content)
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  ptHeaderCenter: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 2,
  },
  ptBrandTitle: {
    fontSize: 36,
    fontWeight: "900",
    fontStyle: "italic",
    fontFamily: "author",
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
    paddingHorizontal: 4,
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

  // Composer styles
  composerContainer: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  composerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    height: 44, // Fixed height of 44px
  },
  composerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
  },
  composerInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    paddingVertical: 4,
    fontFamily: "Manrope",
    height: 36,
  },

  // Feed styles - updated with image container
  feedItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  feedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  feedUserInfo: {
    flex: 1,
  },
  feedUserNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedUserName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    fontFamily: "Manrope",
  },
  feedVerifiedIcon: {
    marginLeft: 4,
  },
  feedTime: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Manrope",
    marginTop: 1,
  },
  feedMoreBtn: {
    padding: 4,
  },
  // Post image container - directly under header
  feedImageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#F3F4F6",
  },
  feedImage: {
    width: "100%",
    height: "100%",
  },
  feedContent: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
    fontFamily: "Manrope",
    marginBottom: 12,
  },
  feedActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  feedActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  feedActionText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Manrope",
    marginLeft: 4,
  },
  feedActionTextLiked: {
    color: "#EF4444",
  },
  planCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    fontFamily: "Manrope",
  },
  planDescription: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Manrope",
    marginBottom: 12,
  },
  planActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  planViewBtn: {
    backgroundColor: "#0001FF",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
  },
  planViewText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Manrope",
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

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40
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
  nameAge: { fontSize: 28, fontWeight: "500", color: "#000", marginBottom: 2 },
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