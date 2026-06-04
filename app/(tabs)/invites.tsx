import { EmptyState } from "@/components/EmptyState";
import { InviteProfileCard } from "@/components/invites/InviteProfileCard";
import { InviteUpgradeModal } from "@/components/invites/InviteUpgradeModal";
import type { ThemeColors } from "@/constants/Theme";
import { spacing, typography } from "@/constants/Theme";
import { MOCK_INVITES, type InviteProfile } from "@/data/mockInvites";
import { useTheme } from "@/features/context/ThemeContext";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  type ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function InvitesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
  const [selectedInvite, setSelectedInvite] = useState<InviteProfile | null>(
    null,
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<InviteProfile>) => (
      <InviteProfileCard
        invite={item}
        onPress={() => setSelectedInvite(item)}
      />
    ),
    [],
  );

  return (
    <View style={styles.screen}>
      <BlurView
        style={[styles.fixedTopWrap, { paddingTop: insets.top + spacing.md }]}
        intensity={80}
        tint={isDark ? "dark" : "light"}
        onLayout={(e) => setFixedHeaderHeight(e.nativeEvent.layout.height)}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Invites</Text>
          <View style={styles.headerRightSpacer} />
        </View>
      </BlurView>
      {MOCK_INVITES.length === 0 ? (
        <View
          style={[
            styles.emptyWrap,
            { paddingTop: fixedHeaderHeight + spacing.sm },
          ]}
        >
          <EmptyState
            title="No invites yet"
            subtitle="When someone invites you to train, it’ll show up here."
          />
        </View>
      ) : (
        <FlatList
          data={MOCK_INVITES}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={renderItem}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{
            paddingTop: fixedHeaderHeight + spacing.sm,
            paddingHorizontal: spacing.lg,
            paddingBottom: insets.bottom + spacing.xxl,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
      <InviteUpgradeModal
        visible={selectedInvite != null}
        invite={selectedInvite}
        onClose={() => setSelectedInvite(null)}
        onUpgrade={() => router.push("/purchased-plans")}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    fixedTopWrap: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    title: {
      ...typography.title1,
      color: colors.text,
    },
    headerRightSpacer: {
      width: 22 + spacing.xs,
    },
    emptyWrap: {
      flex: 1,
      justifyContent: "center",
      minHeight: 200,
    },
    row: {
      gap: spacing.md,
      marginBottom: spacing.md,
    },
  });
}
