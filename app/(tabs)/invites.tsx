import { EmptyState } from "@/components/EmptyState";
import { InviteProfileCard } from "@/components/invites/InviteProfileCard";
import { InviteUpgradeModal } from "@/components/invites/InviteUpgradeModal";
import { PremiumPaymentModal } from "@/components/PremiumPaymentModal";
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
  Image,
  type ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const jennieImg = require("@/assets/jennie.png");

function getTimeGreeting(): { label: string; emoji: string } {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { label: "Good Morning", emoji: "🌤️" };
  if (h >= 12 && h < 17) return { label: "Good Afternoon", emoji: "☀️" };
  if (h >= 17 && h < 22) return { label: "Good Evening", emoji: "🌆" };
  return { label: "Hey there", emoji: "✨" };
}

export default function InvitesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
  const [selectedInvite, setSelectedInvite] = useState<InviteProfile | null>(
    null,
  );
  const [payModalOpen, setPayModalOpen] = useState(false);

  // Added initialization for the greeting data structure
  const greeting = getTimeGreeting();

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
        <View style={styles.headerLeft}>
          <Image source={jennieImg} style={styles.userAvatar} />
          <View style={styles.headerTextCol}>
            <Text style={styles.helloLine}>Hello, Jennie</Text>
            <Text style={styles.greetingLine}>
              {greeting.label} {greeting.emoji}
            </Text>
          </View>
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
        onUpgrade={() => setPayModalOpen(true)}
      />
      <PremiumPaymentModal
        visible={payModalOpen}
        mode="super"
        onClose={() => setPayModalOpen(false)}
        onSuccess={(tier, price) => {
          console.log("Upgraded to", tier, price);
        }}
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
    // Restored structure definitions to satisfy TypeScript styles resolution
    headerLeft: {
      flexDirection: "row", 
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
    },
    userAvatar: { 
      width: 50, 
      height: 50, 
      borderRadius: 25 
    },
    headerTextCol: { 
      marginLeft: 12 
    },
    helloLine: {
      fontSize: 12,
      color: "#888",
      fontFamily: "manrope",
    },
    greetingLine: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      fontFamily: "manrope",
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