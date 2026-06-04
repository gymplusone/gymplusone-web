import {
  darkColors,
  lightColors,
  type ThemeColors,
} from "@/constants/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "@gymplusone/color_scheme";

export type ColorScheme = "light" | "dark";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  setColorScheme: (scheme: ColorScheme) => void;
  isDark: boolean;
  /** AsyncStorage load finished — optional for splash/avoid flash */
  themeReady: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("light");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && (stored === "light" || stored === "dark")) {
          setColorSchemeState(stored);
        }
      } finally {
        if (!cancelled) setThemeReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
    void AsyncStorage.setItem(STORAGE_KEY, scheme);
  }, []);

  const colors = colorScheme === "dark" ? darkColors : lightColors;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      colors,
      setColorScheme,
      isDark: colorScheme === "dark",
      themeReady,
    }),
    [colorScheme, colors, setColorScheme, themeReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
