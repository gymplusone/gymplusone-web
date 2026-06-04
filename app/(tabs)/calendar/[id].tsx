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
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  const heroFooter = (
    <View style={styles.heroScrim}>
      {event.icon ? <EventIconWell variant="hero" icon={event.icon} /> : null}
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack title={event.title} onBack={() => router.back()} />

      {event.imageUri ? (
        <ImageBackground
          source={{ uri: event.imageUri }}
          style={styles.hero}
          imageStyle={styles.heroImageRadius}
        >
          <View style={styles.heroPhotoScrim} />
          {heroFooter}
        </ImageBackground>
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder]}>
          <View style={styles.heroPlaceholderPattern} />
          {heroFooter}
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dateLine}>{event.dateLabel}</Text>

        <EventDateTimeLocationMeta
          dateLabel={event.dateLabel}
          timeLabel={event.timeLabel}
          locationLabel={event.locationLabel}
        />

        <EventMapPreview
          address={event.locationLabel}
          mapsQuery={event.mapsQuery}
        />

        <EventHostCard
          name={event.creator.name}
          avatarInitial={event.creator.avatarInitial}
        />
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
    heroImageRadius: {
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
    },
    heroScrim: {
      flex: 1,
      justifyContent: "flex-end",
      padding: spacing.lg,
      paddingBottom: spacing.md,
    },
    heroPlaceholder: {
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
      overflow: "hidden",
      backgroundColor: colors.surface,
    },
    heroPlaceholderPattern: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(186, 249, 37, 0.06)",
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
    },
    heroPhotoScrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.25)",
      borderBottomLeftRadius: radius.xl,
      borderBottomRightRadius: radius.xl,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
    dateLine: {
      ...typography.subhead,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
  });
}
