
import { useApp } from "@/features/context/AppContext";
import type { OnboardingData } from "@/types";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState, useEffect } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Constants from "expo-constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RadioButton } from "react-native-paper";
import { ImageSourcePropType } from "react-native";
import gymIcon from "@/assets/images/icons/gym.svg";
import { SvgProps } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

// ─── Mapbox import (graceful fallback if native module not yet linked) ───────
let MapboxGL: any = null;
const isExpoGo = Constants.appOwnership === "expo";
const isWeb = Platform.OS === "web";

if (!isExpoGo && !isWeb) {
  try {
    const mapboxModule = require("@rnmapbox/maps");
    MapboxGL = mapboxModule.default || mapboxModule;
    if (MapboxGL && MapboxGL.setAccessToken) {
      MapboxGL.setAccessToken(
        process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "pk.eyJ1Ijoib290aXMxNTY5IiwiYSI6ImNtNzIyOTY1djA1aGYybHIzaXE1eG5odTcifQ.Esxl0GXlX91G4919X0bnGg"
      );
    }
  } catch {
    // Running in Expo Go without native build — map will show a fallback view
  }
}

const hasNativeMap = MapboxGL && MapboxGL.MapView && MapboxGL.Camera && MapboxGL.PointAnnotation;

// ─── Types ──────────────────────────────────────────────────────────────────
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

// Mock nearby locations for the location search
const MOCK_LOCATIONS = [
  { id: "1", name: "New York City, NY", lat: 40.7128, lng: -74.006 },
  { id: "2", name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  { id: "3", name: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  { id: "4", name: "Houston, TX", lat: 29.7604, lng: -95.3698 },
  { id: "5", name: "Miami, FL", lat: 25.7617, lng: -80.1918 },
  { id: "6", name: "San Francisco, CA", lat: 37.7749, lng: -122.4194 },
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

// ─── Location marker SVG ─────────────────────────────────────────────────────
function LocationMarker({ size = 90 }: { size?: number }) {
  return (
    <Svg width={size} height={size * (93 / 90)} viewBox="0 0 90 93" fill="none" opacity={0.5}>
      <Path
        d="M77.3251 32.7437C73.3876 14.8412 58.2751 6.78125 45.0001 6.78125C45.0001 6.78125 45.0001 6.78125 44.9626 6.78125C31.7251 6.78125 16.5751 14.8025 12.6376 32.705C8.25011 52.7 20.1001 69.6337 30.8251 80.29C34.8001 84.2425 39.9001 86.2188 45.0001 86.2188C50.1001 86.2188 55.2001 84.2425 59.1376 80.29C69.8626 69.6337 81.7126 52.7388 77.3251 32.7437ZM45.0001 52.1575C38.4751 52.1575 33.1876 46.6938 33.1876 39.9513C33.1876 33.2088 38.4751 27.745 45.0001 27.745C51.5251 27.745 56.8126 33.2088 56.8126 39.9513C56.8126 46.6938 51.5251 52.1575 45.0001 52.1575Z"
        fill="#0001FF"
      />
    </Svg>
  );
}

// ─── Search icon SVG ─────────────────────────────────────────────────────────
function SearchSvgIcon() {
  return (
    <Svg width={19} height={19} viewBox="0 0 19 19" fill="none">
      <Path
        d="M9.10433 17.2188C4.63141 17.2188 0.989746 13.5771 0.989746 9.10421C0.989746 4.63129 4.63141 0.989624 9.10433 0.989624C13.5772 0.989624 17.2189 4.63129 17.2189 9.10421C17.2189 13.5771 13.5772 17.2188 9.10433 17.2188ZM9.10433 2.17712C5.28058 2.17712 2.17725 5.28837 2.17725 9.10421C2.17725 12.92 5.28058 16.0313 9.10433 16.0313C12.9281 16.0313 16.0314 12.92 16.0314 9.10421C16.0314 5.28837 12.9281 2.17712 9.10433 2.17712Z"
        fill="#292D32"
      />
      <Path
        d="M17.4168 18.0104C17.2664 18.0104 17.116 17.955 16.9972 17.8363L15.4139 16.2529C15.1843 16.0233 15.1843 15.6433 15.4139 15.4138C15.6435 15.1842 16.0235 15.1842 16.2531 15.4138L17.8364 16.9971C18.066 17.2267 18.066 17.6067 17.8364 17.8363C17.7176 17.955 17.5672 18.0104 17.4168 18.0104Z"
        fill="#292D32"
      />
    </Svg>
  );
}

// ─── Validation helpers ──────────────────────────────────────────────────────
function validateStep(
  step: StepKey,
  state: {
    age: string;
    gender: string;
    days: string;
    time: string;
    goals: string[];
    interests: string[];
    ethnicity: string[];
    bio: string;
    location: string;
    photos: string[];
  }
): string | null {
  switch (step) {
    case "profile":
    case "genderOpen": {
      const ageNum = parseInt(state.age, 10);
      if (!state.age.trim() || isNaN(ageNum)) return "Please enter your age.";
      if (ageNum < 16 || ageNum > 100) return "Age must be between 16 and 100.";
      if (!state.gender) return "Please select a gender.";
      return null;
    }
    case "days":
      if (!state.days) return "Please select how many days you work out.";
      return null;
    case "time":
      if (!state.time) return "Please select your preferred workout time.";
      return null;
    case "goals":
      if (state.goals.length === 0) return "Please select at least one goal.";
      return null;
    case "interests":
      if (state.interests.length === 0)
        return "Please select at least one interest.";
      return null;
    case "ethnicity":
      if (state.ethnicity.length === 0)
        return "Please select your ethnicity.";
      return null;
    case "bio":
      if (state.bio.trim().length < 10)
        return "Please write a short bio (at least 10 characters).";
      return null;
    case "location":
      if (!state.location.trim())
        return "Please enter or select a location.";
      return null;
    default:
      return null;
  }
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();

  const [index, setIndex] = useState(0);
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("Male");
  const [days, setDays] = useState("2-5 Days");
  const [time, setTime] = useState("Evening");
  const [goals, setGoals] = useState<string[]>(["Muscle Gain"]);
  const [interests, setInterests] = useState<string[]>(["Weightlifting"]);
  const [ethnicity, setEthnicity] = useState<string[]>(["North American"]);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedCoords, setSelectedCoords] = useState({ lat: 40.7128, lng: -74.006 });
  const [photos, setPhotos] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; lat: number; lng: number }>>([]);

  useEffect(() => {
    if (locationSearch === location) {
      return;
    }

    if (locationSearch.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "pk.eyJ1Ijoib290aXMxNTY5IiwiYSI6ImNtNzIyOTY1djA1aGYybHIzaXE1eG5odTcifQ.Esxl0GXlX91G4919X0bnGg";
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationSearch)}.json?access_token=${token}&limit=5`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch locations");
        const data = await res.json();
        
        if (data && data.features) {
          const results = data.features.map((feat: any) => ({
            id: feat.id,
            name: feat.place_name,
            lat: feat.center[1],
            lng: feat.center[0],
          }));
          setSearchResults(results);
        }
      } catch (err) {
        console.warn("Mapbox geocoding error:", err);
        // Fallback to offline filtering of mock locations if API fails
        const offline = MOCK_LOCATIONS.filter((loc) =>
          loc.name.toLowerCase().includes(locationSearch.toLowerCase())
        );
        setSearchResults(offline);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [locationSearch, location]);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  const stepState = { age, gender, days, time, goals, interests, ethnicity, bio, location, photos };

  const completedData = useMemo<OnboardingData>(() => {
    const frequency =
      days === "0 - 1 Days" ? "1_2" : days === "6-7 Days" ? "5_plus" : "3_4";
    const preferredTime =
      time === "Morning"
        ? "morning"
        : time === "Afternoon"
          ? "afternoon"
          : "evening";
    return {
      ...defaultData,
      ageRange: age,
      genderPreference: gender === "Female" ? "same" : "no_preference",
      gymFrequency: frequency,
      preferredTime,
      fitnessGoal: goals.includes("Cardio Fitness") ? "general_fitness" : "build_muscle",
      workoutStyle: goals.includes("Endurance") ? "cardio" : "strength_training",
      personalityVibe: interests.includes("Movie") ? "calm" : "energetic",
      area: location.trim() || "Current location",
    };
  }, [age, days, gender, goals, interests, location, time]);

  const handleLocationPermissionRequest = async () => {
    try {
      setValidationError(null);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setValidationError("Permission to access location was denied. Please enter it manually.");
        setIndex((v) => v + 1);
        return;
      }

      const locData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = locData.coords;
      setSelectedCoords({ lat: latitude, lng: longitude });

      // Reverse geocode via Mapbox to find city/neighborhood
      const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? "pk.eyJ1Ijoib290aXMxNTY5IiwiYSI6ImNtNzIyOTY1djA1aGYybHIzaXE1eG5odTcifQ.Esxl0GXlX91G4919X0bnGg";
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&types=place,locality,neighborhood`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.features && data.features.length > 0) {
          const placeName = data.features[0].place_name;
          setLocation(placeName);
          setLocationSearch(placeName);
        } else {
          const coordsStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(coordsStr);
          setLocationSearch(coordsStr);
        }
      } else {
        const coordsStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setLocation(coordsStr);
        setLocationSearch(coordsStr);
      }
    } catch (err) {
      console.warn("Location fetch/geocoding error:", err);
      setValidationError("Failed to get location. Please type it in manually.");
    } finally {
      setIndex((v) => v + 1);
    }
  };

  const next = async () => {
    const error = validateStep(step, stepState);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    if (step === "locationIntro") {
      await handleLocationPermissionRequest();
      return;
    }
    if (isLast) {
      completeOnboarding(completedData);
      router.replace("/(tabs)");
      return;
    }
    setIndex((v) => v + 1);
  };

  const back = () => {
    setValidationError(null);
    if (index === 0) {
      if (router.canGoBack()) router.back();
      else router.replace("/welcome");
    } else {
      setIndex((v) => v - 1);
    }
  };

 const pickPhotos = async () => {
 const result = await ImagePicker.launchImageLibraryAsync({
  allowsMultipleSelection: true,
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  quality: 0.8,
  selectionLimit: 6 - photos.length,
});
  if (!result.canceled) {
    setPhotos((curr) =>
      [...curr, ...result.assets.map((a) => a.uri)].slice(0, 6)
    );
  }
};

  const removePhoto = (photoIndex: number) => {
    setPhotos((curr) => curr.filter((_, i) => i !== photoIndex));
  };

  const filteredLocations = MOCK_LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const locationSuggestions = searchResults.length > 0 ? searchResults : filteredLocations;

  const buttonLabel = () => {
    if (step === "locationIntro") return "Allow";
    if (isLast) return "Complete";
    return "Next";
  };

  return (
    <LinearGradient
      colors={["#05004b", "#0b0080", "#1418ff", "#0117f0"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      className="flex-1"
    >
      <View
        className="flex-1 px-[26px]"
        style={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 16 }}
      >
        {/* Back button */}
        <Pressable
          onPress={back}
          className="items-center bg-black rounded w-[38px] h-[38px] justify-center active:opacity-75"
        >
          <Feather name="arrow-left" size={20} color="white" />
        </Pressable>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Step: side ── */}
          {step === "side" ? (
            <Centered title="Select Your Experience">
              <ChoiceButton
                label="+1"
                selected={false}
                onPress={next}
                icon={gymIcon}
                showRadio={false}
              />
              <ChoiceButton
                label="Personal Trainer"
                selected={false}
                onPress={next}
                icon={gymIcon}
                showRadio={false}
              />
            </Centered>
          ) : null}

          {/* ── Step: profile ── */}
          {step === "profile" ? (
            <Centered title="">
              <Text className="text-white text-[17px] mb-3.5 text-center font-manrope">Age</Text>
              <TextInput
                value={age}
                onChangeText={(v) => { setAge(v); setValidationError(null); }}
                keyboardType="number-pad"
                className="bg-black rounded-[3px] text-white h-12 text-center font-manrope"
              />
              <Text className="text-white text-[17px] mb-3.5 text-center mt-7 font-manrope">Gender</Text>
              <Pressable
                onPress={() => setIndex(steps.indexOf("genderOpen"))}
                className="items-center bg-black rounded-[3px] flex-row h-12 justify-center gap-2 active:opacity-75"
              >
                <Text className="text-white/60 font-manrope">{gender}</Text>
                <Feather name="chevron-down" size={20} color="rgba(255,255,255,0.6)" />
              </Pressable>
            </Centered>
          ) : null}

          {/* ── Step: genderOpen ── */}
          {step === "genderOpen" ? (
            <Centered title="">
              <Text className="text-white text-[17px] mb-3.5 text-center font-manrope">Age</Text>
              <TextInput
                value={age}
                onChangeText={(v) => { setAge(v); setValidationError(null); }}
                keyboardType="number-pad"
                className="bg-black rounded-[3px] text-white h-12 text-center font-manrope"
              />
              <Text className="text-white text-[17px] mb-3.5 text-center mt-7 font-manrope">Gender</Text>
              {["Male", "Female", "Nonbinary"].map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setGender(item)}
                  className={`h-10 justify-center px-[18px] active:opacity-75 rounded-[3px] ${
                    gender === item ? "bg-[#0001FF]" : "bg-black"
                  }`}
                >
                  <Text className={`text-sm font-manrope ${gender === item ? "text-white" : "text-white/60"}`}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </Centered>
          ) : null}

          {/* ── Step: days ── */}
          {step === "days" ? (
            <Centered title="How many days per week do you exercise?">
              {["0 - 1 Days", "2-5 Days", "4-5 Days", "6-7 Days"].map((item) => (
                <ChoiceButton
                  key={item}
                  label={item}
                  selected={days === item}
                  onPress={() => { setDays(item); setValidationError(null); }}
                  showRadio
                />
              ))}
            </Centered>
          ) : null}

          {/* ── Step: time ── */}
          {step === "time" ? (
            <Centered title="What time of day do you prefer to work out?">
              {["Morning", "Afternoon", "Evening", "Night"].map((item) => (
                <ChoiceButton
                  key={item}
                  label={item}
                  selected={time === item}
                  onPress={() => { setTime(item); setValidationError(null); }}
                  showRadio
                />
              ))}
            </Centered>
          ) : null}

          {/* ── Step: goals ── */}
          {step === "goals" ? (
            <Centered title="What are your main fitness goals?">
              <View className="content-center flex-row flex-wrap gap-[9px] justify-center">
                {goalOptions.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    active={goals.includes(item)}
                    onPress={() => { toggle(item, goals, setGoals); setValidationError(null); }}
                  />
                ))}
              </View>
            </Centered>
          ) : null}

          {/* ── Step: interests ── */}
          {step === "interests" ? (
            <Centered title="Interests">
              <SearchPlaceholder text="Add Interest" />
              <View className="content-center flex-row flex-wrap gap-[9px] justify-center">
                {interestOptions.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    active={interests.includes(item)}
                    onPress={() => { toggle(item, interests, setInterests); setValidationError(null); }}
                  />
                ))}
              </View>
            </Centered>
          ) : null}

          {/* ── Step: ethnicity ── */}
          {step === "ethnicity" ? (
            <Centered title="Ethnicity">
              <SearchPlaceholder text="Add Ethnicity" />
              <View className="content-center flex-row flex-wrap gap-[9px] justify-center">
                {ethnicityOptions.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    active={ethnicity.includes(item)}
                    onPress={() => { toggle(item, ethnicity, setEthnicity); setValidationError(null); }}
                  />
                ))}
              </View>
            </Centered>
          ) : null}

          {/* ── Step: bio ── */}
          {step === "bio" ? (
            <Centered title="Add biography">
              <TextInput
                value={bio}
                onChangeText={(v) => { setBio(v); setValidationError(null); }}
                placeholder="Tell others about your fitness journey..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                multiline
                className="bg-[#2B37B7]/75 text-white h-[176px] p-4 rounded font-manrope"
                style={{ textAlignVertical: "top" }}
              />
              <Text className="text-white/50 text-xs text-right mt-1 font-manrope">
                {bio.length} / 500
              </Text>
            </Centered>
          ) : null}

          {/* ── Step: locationIntro ── */}
          {step === "locationIntro" ? (
            <Centered title="Set Your Location">
              <Text className="text-white text-[14px] font-medium leading-6 mx-5 text-center font-manrope">
                Help GYM+1 show you workouts, events, and people in your area.
                You can update this anytime in settings.
              </Text>
              <View
                className="items-center self-center bg-white/45 rounded-full h-[108px] justify-center mt-[58px] w-[108px]"
              >
                <LocationMarker size={70} />
              </View>
            </Centered>
          ) : null}

          {/* ── Step: location ── */}
          {step === "location" ? (
            <View className="pt-9 flex-1">
              <Text className="text-white text-[13px] font-extrabold mb-3.5 text-center font-manrope">
                Location
              </Text>
              {/* Search input */}
              <View className="bg-white rounded-sm flex-row items-center h-11 px-3.5 gap-2 mb-2 border border-transparent focus:border-white focus:outline-none">
                <SearchSvgIcon />
     <TextInput
  value={locationSearch}
  onChangeText={(v) => { setLocationSearch(v); setValidationError(null); }}
  placeholder="Search Location..."
  placeholderTextColor="#999"
  className="flex-1 text-gray-900 border-white font-manrope focus:border-transparent focus:ring-0"
  style={{ 
    height: 44,
  }}
  underlineColorAndroid="transparent"
/>
                {locationSearch.length > 0 ? (
                  <Pressable onPress={() => setLocationSearch("")}>
                    <Feather name="x" size={16} color="#666" />
                  </Pressable>
                ) : null}
              </View>

              {/* Dropdown suggestions */}
              {locationSearch.length > 0 && locationSearch !== location && locationSuggestions.length > 0 ? (
                <View className="bg-white rounded-sm mb-2 overflow-hidden" style={{ maxHeight: 180 }}>
                  {locationSuggestions.map((loc) => (
                    <Pressable
                      key={loc.id}
                      onPress={() => {
                        setLocation(loc.name);
                        setLocationSearch(loc.name);
                        setSelectedCoords({ lat: loc.lat, lng: loc.lng });
                        setValidationError(null);
                      }}
                      className="flex-row items-center gap-2 px-3 py-3 border-b border-gray-100 active:bg-gray-50"
                    >
                      <Feather name="map-pin" size={14} color="#0001FF" />
                      <Text className="text-gray-800 text-sm font-manrope">{loc.name}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}

              {/* Map view */}
              <View className="overflow-hidden rounded-lg flex-1" style={{ minHeight: 340 }}>
                {hasNativeMap ? (
                  <MapboxGL.MapView
                    style={{ flex: 1 }}
                    styleURL={MapboxGL.StyleURL?.Street}
                  >
                    <MapboxGL.Camera
                      centerCoordinate={[selectedCoords.lng, selectedCoords.lat]}
                      zoomLevel={12}
                      animationDuration={800}
                    />
                    <MapboxGL.PointAnnotation
                      id="selected-location"
                      coordinate={[selectedCoords.lng, selectedCoords.lat]}
                    >
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: "#0001FF",
                          borderWidth: 3,
                          borderColor: "white",
                        }}
                      />
                    </MapboxGL.PointAnnotation>
                  </MapboxGL.MapView>
                ) : (
                  /* Fallback mock map for Expo Go */
                  <View className="bg-[#dce8f0] flex-1 items-center justify-center relative">
                    {/* Mock map grid lines */}
                    <View
                      className="bg-[#c8d8e2] h-[2px] absolute w-full"
                      style={{ top: "20%" }}
                    />
                    <View
                      className="bg-[#c8d8e2] h-[2px] absolute w-full"
                      style={{ top: "40%" }}
                    />
                    <View
                      className="bg-[#c8d8e2] h-[2px] absolute w-full"
                      style={{ top: "60%" }}
                    />
                    <View
                      className="bg-[#c8d8e2] h-[2px] absolute w-full"
                      style={{ top: "80%" }}
                    />
                    <View
                      className="bg-[#c8d8e2] w-[2px] absolute h-full"
                      style={{ left: "25%" }}
                    />
                    <View
                      className="bg-[#c8d8e2] w-[2px] absolute h-full"
                      style={{ left: "50%" }}
                    />
                    <View
                      className="bg-[#c8d8e2] w-[2px] absolute h-full"
                      style={{ left: "75%" }}
                    />
                    {/* Location pin */}
                    <View className="items-center bg-white rounded-2xl w-11 h-11 justify-center shadow-md">
                      <Feather name="map-pin" size={22} color="#0001FF" />
                    </View>
                    <Text className="text-[#555] text-xs mt-2 font-manrope text-center px-4">
                      {location || "Searching for your location..."}
                    </Text>
                    <View className="absolute bottom-2 right-2 bg-white/80 rounded px-2 py-1">
                      <Text className="text-[9px] text-gray-500">
                        Map preview (build dev client for live map)
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ) : null}

          {/* ── Step: photos ── */}
          {step === "photos" ? (
            <Centered title="Add photos & videos">
              {/* 3-per-row grid */}
              <View className="flex-row flex-wrap gap-2 justify-center">
                {Array.from({ length: 6 }).map((_, photoIndex) => {
                  const uri = photos[photoIndex];
                  return (
                    <View
                      key={photoIndex}
                      className="relative"
                      style={{ width: "30%", aspectRatio: 0.75, overflow: "visible" }}
                    >
                      <Pressable
                        onPress={uri ? undefined : pickPhotos}
                        className="items-center bg-[#d9d9d9] h-full justify-center active:opacity-75 rounded"
                      >
                        {uri ? (
                          <Image
                            source={{ uri }}
                            className="h-full w-full rounded"
                            resizeMode="cover"
                          />
                        ) : (
                          <Feather name="plus" size={28} color="#666" />
                        )}
                      </Pressable>
                      {/* Red remove button */}
                      {uri ? (
                        <Pressable
                          onPress={() => removePhoto(photoIndex)}
                          className="bg-red-600 rounded-full w-6 h-6 items-center justify-center"
                          style={{ position: "absolute", top: -8, right: -8, zIndex: 10 }}
                        >
                          <Feather name="x" size={12} color="white" />
                        </Pressable>
                      ) : null}
                    </View>
                  );
                })}
              </View>
              {photos.length < 6 ? (
                <Pressable
                  onPress={pickPhotos}
                  className="self-center bg-black rounded-full mt-5 px-6 py-2.5 active:opacity-75"
                >
                  <Text className="text-white text-xs font-bold font-manrope">Upload</Text>
                </Pressable>
              ) : null}
            </Centered>
          ) : null}
        </ScrollView>

        {/* Validation error message */}
        {validationError ? (
          <View className="bg-red-500/20 border border-red-400 rounded-md px-4 py-2 mb-3">
            <Text className="text-[#ff6b6b] text-sm text-center font-manrope">
              {validationError}
            </Text>
          </View>
        ) : null}

        {/* Next / Allow / Complete button — hidden on "side" step */}
        {step !== "side" ? (
          <Pressable
            onPress={next}
            className="items-center bg-black rounded-[3px] h-11 justify-center active:opacity-75"
          >
            <Text className="text-white text-[15px] font-bold font-manrope">
              {buttonLabel()}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </LinearGradient>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────
function Centered({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View className={`flex-1 justify-center ${className || ""}`}>
      {title ? (
        <Text className="text-white text-[21px] font-extrabold mb-[42px] text-center font-manrope">
          {title}
        </Text>
      ) : null}
      <View className="gap-3">{children}</View>
    </View>
  );
}

function ChoiceButton({
  label,
  selected,
  onPress,
  icon: IconComponent,
  showRadio = true,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: React.FC<SvgProps>;
  showRadio?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center px-4 border rounded-[3px] h-[46px] active:opacity-75 ${
        selected ? "border-[#1114ff] bg-black" : "border-gray-600 bg-black"
      } ${showRadio ? "justify-between" : "justify-center"}`}
    >
      <View className="flex-row items-center gap-3">
        {IconComponent ? (
          <IconComponent width={22} height={22} color="white" />
        ) : null}
        <Text className="text-white text-[14px] font-normal font-manrope">{label}</Text>
      </View>
      {showRadio ? (
        <RadioButton.Android
          value=""
          status={selected ? "checked" : "unchecked"}
          onPress={onPress}
          color="#ffffff"
          uncheckedColor="#9ca3af"
        />
      ) : null}
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
      className={`rounded-full px-7 border border-white py-3 active:opacity-75 ${
        active ? "bg-[#0001FF]" : "bg-white"
      }`}
    >
      <Text
        className={`text-[13px] font-semibold font-manrope ${
          active ? "text-white" : "text-gray-900"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SearchPlaceholder({ text }: { text: string }) {
  return (
    <View className="bg-white rounded-full h-9 flex-row items-center justify-start mb-[18px] px-3.5 gap-2">
      <SearchSvgIcon />
      <Text className="text-[#838383] text-[14px] font-manrope">{text}</Text>
    </View>
  );
}

function toggle(
  item: string,
  current: string[],
  setter: React.Dispatch<React.SetStateAction<string[]>>
) {
  setter((value) =>
    value.includes(item)
      ? value.filter((existing) => existing !== item)
      : [...value, item]
  );
}
