import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import type { GymBuddyProfile } from "@/types";
import { getBuddyCardImageSourceAlt } from "@/utils/buddyCardImage";
import {
  buddyApproxDistanceKm,
  buddyExperienceLine,
  buddyFitnessActivityLine,
  buddyStatusPills,
  buddyStoryBlocks,
  buddyWorkoutPlansSummary,
} from "@/utils/buddyProfileDetails";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  buddy: GymBuddyProfile;
};

const ONA_IMAGE = require("@/assets/images/ona.png");

export function BuddyProfileDetailsSheet({ buddy }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const km = buddyApproxDistanceKm(buddy.id);
  const stories = buddyStoryBlocks(buddy);
  const altImg = getBuddyCardImageSourceAlt(buddy);
  const storyImages = [ONA_IMAGE, altImg];
  const interestLabels = [
    "🎨 Parkour",
    "🐅 Animals",
    "🥊 Boxing",
    "🚴 Cycling",
    "🏊 Swimming",
    "🥗 Food",
    "🧘‍♀️ Yoga & Mindfulness",
    "🎭 Action",
  ];

  function SectionTitle({
    children,
    first,
  }: {
    children: string;
    first?: boolean;
  }) {
    return (
      <Text style={[styles.sectionTitle, first && styles.sectionTitleFirst]}>
        {children}
      </Text>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={18} color={colors.textMuted} />
        <Text style={styles.locationText}>{buddy.area}</Text>
      </View>

      <Text style={styles.detailName}>
        {buddy.name}, {buddy.age}
      </Text>
      <Text style={styles.distance}>{km} km away</Text>

      <View style={styles.pillWrap}>
        {buddyStatusPills(buddy).map((label) => (
          <View key={label} style={styles.pill}>
            <Text style={styles.pillText}>{label}</Text>
          </View>
        ))}
      </View>

      <SectionTitle first>Bio</SectionTitle>
      <Text style={styles.bodyText}>{buddy.bio}</Text>

      <SectionTitle>Interests</SectionTitle>
      <View style={styles.pillWrap}>
        {interestLabels.map((label) => (
          <View key={label} style={styles.pillInterest}>
            <Text style={styles.pillInterestText}>{label}</Text>
          </View>
        ))}
      </View>

      <SectionTitle>Experience</SectionTitle>
      <Text style={styles.bodyText}>{buddyExperienceLine(buddy)}</Text>

      {buddy.ethnicity ? (
        <>
          <SectionTitle>Ethnicity</SectionTitle>
          <Text style={styles.bodyText}>{buddy.ethnicity}</Text>
        </>
      ) : null}

      <SectionTitle>Fitness activity per week</SectionTitle>
      <Text style={styles.bodyText}>{buddyFitnessActivityLine(buddy)}</Text>

      {stories.map((block, index) => (
        <View
          key={`${block.caption.slice(0, 24)}-${index}`}
          style={styles.storyBlock}
        >
          <Image
            source={storyImages[index % storyImages.length]}
            style={styles.storyImage}
            resizeMode="cover"
            accessibilityLabel="Profile moment"
          />
          <Text style={styles.storyCaption}>{block.caption}</Text>
        </View>
      ))}

      <SectionTitle>Workout plans</SectionTitle>
      <Text style={styles.bodyText}>{buddyWorkoutPlansSummary(buddy)}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      marginTop: spacing.lg + spacing.sm,
      alignSelf: "stretch",
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      marginBottom: spacing.xs,
    },
    locationText: {
      ...typography.subhead,
      color: colors.textSecondary,
    },
    detailName: {
      ...typography.title2,
      color: colors.text,
      marginBottom: spacing.xxs,
    },
    distance: {
      ...typography.subhead,
      color: colors.textMuted,
      marginBottom: spacing.md,
    },
    pillWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.xs,
      marginBottom: spacing.lg,
    },
    pill: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceElevated,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    pillText: {
      ...typography.subhead,
      color: colors.text,
    },
    pillInterest: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      backgroundColor: "rgba(186, 249, 37, 0.1)",
      borderWidth: 1,
      borderColor: "rgba(186, 249, 37, 0.22)",
    },
    pillInterestText: {
      ...typography.subhead,
      color: colors.text,
    },
    sectionTitle: {
      ...typography.title3,
      color: colors.text,
      marginBottom: spacing.sm,
      marginTop: spacing.lg,
    },
    sectionTitleFirst: {
      marginTop: spacing.xs,
    },
    bodyText: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.lg,
    },
    storyBlock: {
      marginBottom: spacing.lg,
    },
    storyImage: {
      width: "100%",
      height: 200,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceElevated,
      marginBottom: spacing.sm,
    },
    storyCaption: {
      ...typography.body,
      color: colors.textSecondary,
      lineHeight: 22,
    },
  });
}
