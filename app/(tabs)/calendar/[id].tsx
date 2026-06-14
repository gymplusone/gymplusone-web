import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { EventDateTimeLocationMeta } from "@/components/events/EventDateTimeLocationMeta";
import { EventHostCard } from "@/components/events/EventHostCard";
import { EventIconWell } from "@/components/events/EventIconWell";
import { EventMapPreview } from "@/components/events/EventMapPreview";
import { ScreenFooterBar } from "@/components/layout/ScreenFooterBar";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import {
  EVENT_HERO_HEIGHT,
  FOOTER_PRIMARY_CTA_BUTTON_STYLE,
} from "@/constants/eventUI";
import { getPublicEventById } from "@/data/mockEvents";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EditPenIcon } from "@/components/icons/EditPenIcon";
import { useTheme } from "@/features/context/ThemeContext";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [joined, setJoined] = useState(false);

  const event = useMemo(() => (id ? getPublicEventById(id) : undefined), [id]);

  if (!event) {
    return (
      <View style={styles.screen}>
        <ScreenHeaderBack title="Event" onBack={() => router.back()} />
        <EmptyState
          title="Event not found"
          subtitle="This event may have been removed."
          actionLabel="Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="Event"
        onBack={() => router.back()}
        titleAlign="center"
        rightElement={
          <Pressable hitSlop={8}>
            <EditPenIcon color={colors.text} size={24} />
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {event.imageUri ? (
          <Image
            source={{ uri: event.imageUri }}
            style={styles.hero}
          />
        ) : (
          <View style={[styles.hero, styles.heroPlaceholder]}>
            <View style={styles.heroPlaceholderPattern} />
          </View>
        )}

        <View style={styles.titleSection}>
          <View style={styles.iconWellContainer}>
             {event.icon ? <EventIconWell variant="hero" icon={event.icon} /> : null}
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.dateLine}>{event.dateLabel}</Text>
          </View>
        </View>

        <View style={styles.metaSection}>
          <Text style={styles.sectionHeading}>Time</Text>
          <Text style={styles.metaText}>{event.timeLabel}</Text>
        </View>

        <View style={styles.metaSection}>
          <Text style={styles.sectionHeading}>Location</Text>
          <EventMapPreview
            address={event.locationLabel}
            mapsQuery={event.mapsQuery}
          />
        </View>

        <View style={styles.metaSection}>
          <EventHostCard
            name={event.creator.name}
            avatarInitial={event.creator.avatarInitial}
          />
        </View>
      </ScrollView>

      <ScreenFooterBar insets={insets}>
        <Button
          title={joined ? "You're in" : 'Join the event'}
          onPress={() => setJoined(true)}
          fullWidth
          disabled={joined}
          style={FOOTER_PRIMARY_CTA_BUTTON_STYLE}
        />
      </ScreenFooterBar>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    hero: {
      height: EVENT_HERO_HEIGHT,
      width: "100%",
    },
    hero: {
      height: EVENT_HERO_HEIGHT,
      width: "100%",
    },
    heroPlaceholder: {
      overflow: "hidden",
      backgroundColor: colors.surface,
    },
    heroPlaceholderPattern: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(186, 249, 37, 0.06)",
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
    },
    titleSection: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: spacing.md,
      marginBottom: spacing.lg,
    },
    iconWellContainer: {
      marginRight: spacing.md,
    },
    titleTextContainer: {
      flex: 1,
      justifyContent: "center",
    },
    eventTitle: {
      ...typography.title2,
      color: colors.text,
      marginBottom: 4,
    },
    dateLine: {
      ...typography.subhead,
      color: colors.textSecondary,
    },
    metaSection: {
      marginBottom: spacing.xl,
    },
    sectionHeading: {
      ...typography.title3,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    metaText: {
      ...typography.body,
      color: colors.textSecondary,
    },
  });
}
