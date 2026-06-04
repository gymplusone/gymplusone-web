import { Pills } from "@/components/Pills";
import { ScreenHeaderBack } from "@/components/layout/ScreenHeaderBack";
import type { ThemeColors } from "@/constants/Theme";
import { radius, spacing, typography } from "@/constants/Theme";
import { CORE_MOCK_PEOPLE } from "@/data/mockPeople";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ClientStatus = "active" | "new";

type ClientItem = {
  id: string;
  initials: string;
  name: string;
  goal: string;
  status: ClientStatus;
  progressPct: number;
  sessions: number;
  revenueCents: number;
};

const CLIENTS: ClientItem[] = [
  {
    id: "c1",
    initials: CORE_MOCK_PEOPLE.jordan.initials,
    name: CORE_MOCK_PEOPLE.jordan.name,
    goal: "Weight Loss",
    status: "active",
    progressPct: 65,
    sessions: 24,
    revenueCents: 204_000,
  },
  {
    id: "c2",
    initials: CORE_MOCK_PEOPLE.sam.initials,
    name: CORE_MOCK_PEOPLE.sam.name,
    goal: "Muscle Gain",
    status: "active",
    progressPct: 42,
    sessions: 18,
    revenueCents: 153_000,
  },
  {
    id: "c3",
    initials: CORE_MOCK_PEOPLE.alex.initials,
    name: CORE_MOCK_PEOPLE.alex.name,
    goal: "General Fitness",
    status: "new",
    progressPct: 18,
    sessions: 6,
    revenueCents: 49_000,
  },
  {
    id: "c4",
    initials: CORE_MOCK_PEOPLE.riley.initials,
    name: CORE_MOCK_PEOPLE.riley.name,
    goal: "Strength",
    status: "active",
    progressPct: 74,
    sessions: 31,
    revenueCents: 286_000,
  },
  {
    id: "c5",
    initials: CORE_MOCK_PEOPLE.taylor.initials,
    name: CORE_MOCK_PEOPLE.taylor.name,
    goal: "Body Recomp",
    status: "new",
    progressPct: 9,
    sessions: 3,
    revenueCents: 22_500,
  },
];

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

export default function ClientsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const [statusFilter, setStatusFilter] = useState<"all" | ClientStatus>("all");
  const total = CLIENTS.length;
  const active = CLIENTS.filter((c) => c.status === "active").length;
  const newcomer = CLIENTS.filter((c) => c.status === "new").length;
  const filteredClients = useMemo(
    () =>
      statusFilter === "all"
        ? CLIENTS
        : CLIENTS.filter((client) => client.status === statusFilter),
    [statusFilter],
  );

  return (
    <View style={styles.screen}>
      <ScreenHeaderBack
        title="Clients"
        titleAlign="center"
        onBack={() => router.back()}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Manage your client relationships</Text>

        <View style={styles.statsRow}>
          <StatCard label="Total" value={String(total)} styles={styles} />
          <StatCard label="Active" value={String(active)} styles={styles} />
          <StatCard label="New" value={String(newcomer)} styles={styles} />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <Ionicons name="search-outline" size={20} color={styles.icon.color} />
            <Text style={styles.searchPlaceholder}>Search clients…</Text>
          </View>
          <Pressable style={styles.filterBtn} accessibilityLabel="Filter clients">
            <Ionicons name="options-outline" size={20} color={styles.icon.color} />
          </Pressable>
        </View>

        <Pills
          options={["all", "active", "new"]}
          value={statusFilter}
          onChange={setStatusFilter}
          style={styles.chipsRow}
        />

        <View style={styles.list}>
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} styles={styles} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ClientCard({
  client,
  styles,
}: {
  client: ClientItem;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.clientCard}>
      <View style={styles.clientTopRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{client.initials}</Text>
        </View>
        <View style={styles.clientMeta}>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientGoal}>{client.goal}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={styles.iconMuted.color} />
      </View>

      <View style={styles.progressHead}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressPct}>{client.progressPct}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${client.progressPct}%` }]} />
      </View>

      <View style={styles.clientBottomRow}>
        <Text style={styles.sessions}>{client.sessions} sessions</Text>
        <Text style={styles.revenue}>{formatMoney(client.revenueCents)}</Text>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      gap: spacing.md,
    },
    subtitle: {
      ...typography.subhead,
      color: colors.textSecondary,
    },
    statsRow: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    statCard: {
      flex: 1,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingVertical: spacing.md,
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
    },
    statValue: {
      ...typography.title2,
      color: colors.text,
      fontWeight: "700",
    },
    statLabel: {
      ...typography.caption,
      color: colors.textMuted,
    },
    searchRow: {
      flexDirection: "row",
      gap: spacing.sm,
      alignItems: "center",
    },
    searchField: {
      flex: 1,
      minHeight: 48,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    searchPlaceholder: {
      ...typography.subhead,
      color: colors.textMuted,
    },
    filterBtn: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    chipsRow: {
      marginTop: -2,
    },
    list: {
      gap: spacing.md,
    },
    clientCard: {
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing.md,
    },
    clientTopRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary + "CC",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      ...typography.bodyBold,
      color: colors.background,
      fontSize: 18,
    },
    clientMeta: {
      flex: 1,
      minWidth: 0,
    },
    clientName: {
      ...typography.title3,
      color: colors.text,
    },
    clientGoal: {
      ...typography.subhead,
      color: colors.textSecondary,
      marginTop: 2,
    },
    progressHead: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    progressLabel: {
      ...typography.subhead,
      color: colors.textMuted,
    },
    progressPct: {
      ...typography.subhead,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    progressTrack: {
      height: 10,
      borderRadius: radius.full,
      backgroundColor: colors.borderLight,
      overflow: "hidden",
      marginBottom: spacing.md,
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: radius.full,
    },
    clientBottomRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    sessions: {
      ...typography.body,
      color: colors.textMuted,
      fontWeight: "500",
    },
    revenue: {
      ...typography.bodyBold,
      color: colors.primary,
      fontWeight: "700",
    },
    icon: {
      color: colors.textMuted,
    },
    iconMuted: {
      color: colors.textMuted,
    },
  });
}
