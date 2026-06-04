import type { ThemeColors } from "@/constants/Theme";
import { useTheme } from "@/features/context/ThemeContext";
import { useMemo, type DependencyList } from "react";

/**
 * Build StyleSheet (or any memoized object) from the active theme colors.
 */
export function useThemedStyles<T>(
  factory: (colors: ThemeColors) => T,
  extraDeps: DependencyList = [],
): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors, ...extraDeps]);
}
