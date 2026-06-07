import { useApp } from "@/features/context/AppContext";
import type { OnboardingData } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type StepKey =
  | "side"
  | "profile"
  | "genderOpen"
  | "days"
  | "time"
  | "goals"
  | "interests"
  | "ethnicity"
  | "bio"
  | "locationIntro"
  | "location"
  | "photos";

const steps: StepKey[] = [
  "side",
  "profile",
  "genderOpen",
  "days",
  "time",
  "goals",
  "interests",
  "ethnicity",
  "bio",
  "locationIntro",
  "location",
  "photos",
];

const goalOptions = [
  "Muscle Gain",
  "Strength",
  "Endurance",
  "Cardio Fitness",
  "Mental Wellness",
  "Flexibility",
];

const interestOptions = [
  "Parkour",
  "Animals",
  "Boxing",
  "Cycling",
  "Swimming",
  "Food",
  "Yoga & Mindfulness",
  "Weightlifting",
  "Sports",
  "Action",
  "Traveling",
  "Movie",
  "Running",
  "Pilates",
];

const ethnicityOptions = [
  "Native American",
  "Middle Eastern",
  "South Asian",
  "Southeast Asian",
  "Latino/Latina",
  "North American",
  "Asian",
  "African",
  "Arab",
];

const defaultData: OnboardingData = {
  firstName: "Jamie",
  ageRange: "25",
  genderPreference: "no_preference",
  fitnessGoal: "build_muscle",
  workoutStyle: "strength_training",
  fitnessLevel: "beginner",
  gymFrequency: "3_4",
  preferredTime: "evening",
  motivationStyle: "encouragement",
  personalityVibe: "energetic",
  area: "Current location",
  gymType: "commercial_gym",
  confidenceLevel: "medium",
};

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const [index, setIndex] = useState(0);
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("Male");
  const [days, setDays] = useState("3-5 Days");
  const [time, setTime] = useState("Evening");
  const [goals, setGoals] = useState<string[]>(["Muscle Gain"]);
  const [interests, setInterests] = useState<string[]>(["Weightlifting"]);
  const [ethnicity, setEthnicity] = useState<string[]>(["North American"]);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  const completedData = useMemo<OnboardingData>(() => {
    const frequency =
      days === "1-2 Days" ? "1_2" : days === "5-7 Days" ? "5_plus" : "3_4";
    const preferredTime =
      time === "Morning"
        ? "morning"
        : time === "Afternoon"
          ? "afternoon"
          : time === "Night"
            ? "evening"
            : "evening";

    return {
      ...defaultData,
      ageRange: age,
      genderPreference: gender === "Female" ? "same" : "no_preference",
      gymFrequency: frequency,
      preferredTime,
      fitnessGoal: goals.includes("Cardio Fitness")
        ? "general_fitness"
        : "build_muscle",
      workoutStyle: goals.includes("Endurance") ? "cardio" : "strength_training",
      personalityVibe: interests.includes("Movie") ? "calm" : "energetic",
      area: location.trim() || "Current location",
    };
  }, [age, days, gender, goals, interests, location, time]);

  const next = () => {
    if (isLast) {
      completeOnboarding(completedData);
      router.replace("/(tabs)");
      return;
    }
    setIndex((value) => value + 1);
  };

  const back = () => {
    if (index === 0) router.back();
    else setIndex((value) => value - 1);
  };

  const pickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      selectionLimit: 6,
    });
    if (!result.canceled) {
      setPhotos((current) =>
        [...current, ...result.assets.map((asset) => asset.uri)].slice(0, 6),
      );
    }
  };

  return (
    <LinearGradient
      colors={["#05004b", "#0b0080", "#1418ff", "#0117f0"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.screen}
    >
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <Pressable onPress={back} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === "side" ? (
            <Centered title="Select Your Experience">
              <ChoiceButton label="+1" selected onPress={next} />
              <ChoiceButton label="Personal Trainer" onPress={next} />
            </Centered>
          ) : null}

          {step === "profile" ? (
            <Centered title="">
              <Text style={styles.fieldLabel}>Age</Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                style={styles.darkInput}
              />
              <Text style={[styles.fieldLabel, styles.fieldGap]}>Gender</Text>
              <Pressable onPress={() => setIndex(2)} style={styles.darkInputButton}>
                <Text style={styles.muted}>{gender}</Text>
                <Text style={styles.muted}>⌄</Text>
              </Pressable>
            </Centered>
          ) : null}

          {step === "genderOpen" ? (
            <Centered title="">
              <Text style={styles.fieldLabel}>Age</Text>
              <TextInput value={age} onChangeText={setAge} style={styles.darkInput} />
              <Text style={[styles.fieldLabel, styles.fieldGap]}>Gender</Text>
              {["Male", "Female", "Nonbinary"].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setGender(item)}
                  style={[
                    styles.dropdownOption,
                    gender === item && styles.dropdownOptionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      gender === item && styles.dropdownTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </Centered>
          ) : null}

          {step === "days" ? (
            <Centered title="How many days per week do you exercise?">
              {["1-2 Days", "3-5 Days", "5-6 Days", "5-7 Days"].map((item) => (
                <ChoiceButton
                  key={item}
                  label={item}
                  selected={days === item}
                  onPress={() => setDays(item)}
                />
              ))}
            </Centered>
          ) : null}

          {step === "time" ? (
            <Centered title="What time of day do you prefer to work out?">
              {["Morning", "Afternoon", "Evening", "Night"].map((item) => (
                <ChoiceButton
                  key={item}
                  label={item}
                  selected={time === item}
                  onPress={() => setTime(item)}
                />
              ))}
            </Centered>
          ) : null}

          {step === "goals" ? (
            <Centered title="What are your main fitness goals?">
              <View style={styles.chipWrap}>
                {goalOptions.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    active={goals.includes(item)}
                    onPress={() => toggle(item, goals, setGoals)}
                  />
                ))}
              </View>
            </Centered>
          ) : null}

          {step === "interests" ? (
            <Centered title="Interests">
              <SearchPlaceholder text="Add Interest" />
              <View style={styles.chipWrap}>
                {interestOptions.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    active={interests.includes(item)}
                    onPress={() => toggle(item, interests, setInterests)}
                  />
                ))}
              </View>
            </Centered>
          ) : null}

          {step === "ethnicity" ? (
            <Centered title="Ethnicity">
              <SearchPlaceholder text="Add Ethnicity" />
              <View style={styles.chipWrap}>
                {ethnicityOptions.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    active={ethnicity.includes(item)}
                    onPress={() => toggle(item, ethnicity, setEthnicity)}
                  />
                ))}
              </View>
            </Centered>
          ) : null}

          {step === "bio" ? (
            <Centered title="Add biography">
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Type here"
                placeholderTextColor="rgba(255,255,255,0.35)"
                multiline
                style={styles.bioInput}
              />
            </Centered>
          ) : null}

          {step === "locationIntro" ? (
            <Centered title="Set Your Location">
              <Text style={styles.bodyCopy}>
                Help Gym+1 show your workouts, events, and people near you.
              </Text>
              <View style={styles.pinCircle}>
                <Text style={styles.pinDot}>●</Text>
              </View>
            </Centered>
          ) : null}

          {step === "location" ? (
            <View style={styles.locationBlock}>
              <Text style={styles.smallTitle}>Location</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Search Location..."
                placeholderTextColor="#111827"
                style={styles.locationInput}
              />
              <View style={styles.map}>
                <View style={styles.mapRoadA} />
                <View style={styles.mapRoadB} />
                <View style={styles.mapRoadC} />
                <View style={styles.mapMarker}>
                  <Text style={styles.mapMarkerText}>●</Text>
                </View>
              </View>
            </View>
          ) : null}

          {step === "photos" ? (
            <Centered title="Add photos & videos">
              <View style={styles.photoGrid}>
                {Array.from({ length: 6 }).map((_, photoIndex) => {
                  const uri = photos[photoIndex];
                  return (
                    <Pressable
                      key={photoIndex}
                      onPress={pickPhotos}
                      style={styles.photoCell}
                    >
                      {uri ? (
                        <Image source={{ uri }} style={styles.photo} />
                      ) : (
                        <Text style={styles.plus}>+</Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
              <Pressable onPress={pickPhotos} style={styles.uploadButton}>
                <Text style={styles.uploadText}>Upload</Text>
              </Pressable>
            </Centered>
          ) : null}
        </ScrollView>

        {step !== "side" ? (
          <Pressable onPress={next} style={styles.nextButton}>
            <Text style={styles.buttonText}>{isLast ? "Complete" : "Next"}</Text>
          </Pressable>
        ) : null}
      </View>
    </LinearGradient>
  );
}

function Centered({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.centered}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.centerBody}>{children}</View>
    </View>
  );
}

function ChoiceButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        selected && styles.choiceSelected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.choiceText}>{label}</Text>
    </Pressable>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function SearchPlaceholder({ text }: { text: string }) {
  return (
    <View style={styles.search}>
      <Text style={styles.searchText}>⌕  {text}</Text>
    </View>
  );
}

function toggle(
  item: string,
  current: string[],
  setter: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setter((value) =>
    value.includes(item)
      ? value.filter((existing) => existing !== item)
      : [...value, item],
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 26 },
  backButton: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 4,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  backIcon: { color: "#FFFFFF", fontSize: 24, lineHeight: 26 },
  scrollContent: { flexGrow: 1 },
  centered: { flex: 1, justifyContent: "center" },
  centerBody: { gap: 12 },
  title: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 42,
    textAlign: "center",
  },
  choice: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderRadius: 3,
    borderWidth: 1,
    height: 46,
    justifyContent: "center",
  },
  choiceSelected: { borderColor: "#1114ff" },
  choiceText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  fieldLabel: {
    color: "#FFFFFF",
    fontSize: 17,
    marginBottom: 14,
    textAlign: "center",
  },
  fieldGap: { marginTop: 28 },
  darkInput: {
    backgroundColor: "#000000",
    borderRadius: 3,
    color: "#FFFFFF",
    height: 48,
    textAlign: "center",
  },
  darkInputButton: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 3,
    flexDirection: "row",
    height: 48,
    justifyContent: "center",
    gap: 28,
  },
  muted: { color: "rgba(255,255,255,0.35)" },
  dropdownOption: {
    backgroundColor: "#FFFFFF",
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  dropdownOptionSelected: { backgroundColor: "#000000" },
  dropdownText: { color: "#111827", fontSize: 12 },
  dropdownTextSelected: { color: "#FFFFFF" },
  chipWrap: {
    alignContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    justifyContent: "center",
  },
  chip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: "#000000" },
  chipText: { color: "#111827", fontSize: 11, fontWeight: "700" },
  chipTextActive: { color: "#FFFFFF" },
  search: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    height: 36,
    justifyContent: "center",
    marginBottom: 18,
    paddingHorizontal: 14,
  },
  searchText: { color: "#8A8A8A", fontSize: 11 },
  bioInput: {
    backgroundColor: "rgba(43,55,183,0.75)",
    color: "#FFFFFF",
    height: 176,
    padding: 16,
    textAlignVertical: "top",
  },
  bodyCopy: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 20,
    marginHorizontal: 20,
    textAlign: "center",
  },
  pinCircle: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.45)",
    borderRadius: 54,
    height: 108,
    justifyContent: "center",
    marginTop: 58,
    width: 108,
  },
  pinDot: { color: "#1c24ff", fontSize: 52, lineHeight: 56 },
  locationBlock: { paddingTop: 36 },
  smallTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 14,
    textAlign: "center",
  },
  locationInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    color: "#111827",
    height: 44,
    paddingHorizontal: 14,
  },
  map: {
    backgroundColor: "#f5f5f5",
    height: 440,
    marginTop: 10,
    overflow: "hidden",
  },
  mapRoadA: {
    backgroundColor: "#d6d6d6",
    height: 3,
    left: -20,
    position: "absolute",
    top: 130,
    transform: [{ rotate: "-22deg" }],
    width: 420,
  },
  mapRoadB: {
    backgroundColor: "#dcdcdc",
    height: 3,
    left: 28,
    position: "absolute",
    top: 250,
    transform: [{ rotate: "64deg" }],
    width: 380,
  },
  mapRoadC: {
    backgroundColor: "#dcdcdc",
    height: 3,
    left: -80,
    position: "absolute",
    top: 350,
    transform: [{ rotate: "15deg" }],
    width: 440,
  },
  mapMarker: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    left: "45%",
    position: "absolute",
    top: "42%",
    width: 44,
  },
  mapMarkerText: { color: "#1c24ff", fontSize: 24 },
  photoGrid: {
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    width: 260,
  },
  photoCell: {
    alignItems: "center",
    backgroundColor: "#d9d9d9",
    height: 82,
    justifyContent: "center",
    width: 82,
  },
  photo: { height: "100%", width: "100%" },
  plus: { color: "#444444", fontSize: 26 },
  uploadButton: {
    alignSelf: "center",
    backgroundColor: "#000000",
    borderRadius: 999,
    marginTop: 22,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  uploadText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  nextButton: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 3,
    height: 44,
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  pressed: { opacity: 0.72 },
});
