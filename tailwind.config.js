/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryDark: "var(--color-primary-dark)",
        secondary: "var(--color-secondary)",
        secondaryMuted: "var(--color-secondary-muted)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        surfaceElevated: "var(--color-surface-elevated)",
        text: "var(--color-text)",
        textSecondary: "var(--color-text-secondary)",
        textMuted: "var(--color-text-muted)",
        border: "var(--color-border)",
        borderLight: "var(--color-border-light)",
        success: "var(--color-success)",
        successBg: "var(--color-success-bg)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'xxl': '24px',
      },
      fontFamily: {
        manrope: ["Manrope_400Regular"],
        author: ["Author"],
      }
    },
  },
  plugins: [],
}
