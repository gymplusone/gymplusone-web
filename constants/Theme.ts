/**
 * GYM +1 Design system – premium, energetic, supportive
 * Use `useTheme().colors` in components; `darkColors` / `lightColors` are the palettes.
 */

/** Brand primary — same in light and dark (icon defaults, etc.) */
export const brandPrimary = "#0001FF";

export type ThemeColors = {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryMuted: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  successBg: string;
  warning: string;
  notificationRecap: string;
  notificationRestTip: string;
  notificationCalendar: string;
  notificationProfileViews: string;
  error: string;
  overlay: string;
  textOnPrimary: string;
};

export const darkColors: ThemeColors = {
  primary: brandPrimary,
  primaryDark: "#0000CC",
  secondary: brandPrimary,
  secondaryMuted: "#F9A8D4",
  background: "#ffffff",
  surface: "#1E2229",
  surfaceElevated: "#252A33",
  text: "#F3F4F6",
  textSecondary: "#D1D5DB",
  textMuted: "#9CA3AF",
  border: "#374151",
  borderLight: "#2D3139",
  success: "#10B981",
  successBg: "#064E3B",
  warning: "#F59E0B",
  notificationRecap: "#FACC15",
  notificationRestTip: "#B794F6",
  notificationCalendar: "#38BDF8",
  notificationProfileViews: "#F9A8D4",
  error: "#EF4444",
  overlay: "rgba(0,0,0,0.5)",
  textOnPrimary: "#FFFFFF",
};

export const lightColors: ThemeColors = {
  primary: brandPrimary,
  primaryDark: "#0000CC",
  secondary: brandPrimary,
  secondaryMuted: "#EC4899",
  background: "#F3F4F6",
  surface: "#FFFFFF",
  surfaceElevated: "#F9FAFB",
  text: "#111827",
  textSecondary: "#374151",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  success: "#059669",
  successBg: "#D1FAE5",
  warning: "#D97706",
  notificationRecap: "#CA8A04",
  notificationRestTip: "#7C3AED",
  notificationCalendar: "#0284C7",
  notificationProfileViews: "#DB2777",
  error: "#DC2626",
  overlay: "rgba(0,0,0,0.35)",
  textOnPrimary: "#FFFFFF",
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

/** Consistent card/list spacing */
export const card = {
  padding: spacing.lg,
  gap: spacing.md,
  marginBottom: spacing.md,
} as const;

/**
 * Toolbar / header icon targets — use with `Pressable` on Events screen headers and feed rows
 * so hit area and padding stay aligned.
 */
export const iconButton = {
  hitSlop: 10,
  padding: spacing.xxs,
} as const;

export const typography = {
  largeTitle: { fontSize: 28, fontWeight: "700" as const },
  title1: { fontSize: 22, fontWeight: "700" as const },
  title2: { fontSize: 20, fontWeight: "600" as const },
  title3: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 16, fontWeight: "400" as const },
  bodyBold: { fontSize: 16, fontWeight: "600" as const },
  callout: { fontSize: 15, fontWeight: "400" as const },
  subhead: { fontSize: 14, fontWeight: "400" as const },
  footnote: { fontSize: 13, fontWeight: "400" as const },
  caption: { fontSize: 12, fontWeight: "400" as const },
  small: { fontSize: 10, fontWeight: "400" as const },
} as const;

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
