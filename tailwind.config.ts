import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fresh, vibrant primary - Coral/Salmon for video chat vibes
        primary: {
          50: "#fff5f5",
          100: "#ffe3e3",
          200: "#ffc9c9",
          300: "#ffa8a8",
          400: "#ff8787",
          500: "#ff6b6b",
          600: "#fa5252",
          700: "#f03e3e",
          800: "#e03131",
          900: "#c92a2a",
          950: "#a51111",
        },
        // Soft, warm accents
        accent: {
          50: "#fff9db",
          100: "#fff3bf",
          200: "#ffec99",
          300: "#ffe066",
          400: "#ffd43b",
          500: "#fcc419",
          600: "#fab005",
          700: "#f59f00",
          800: "#f08c00",
          900: "#e67700",
        },
        // Clean, modern neutrals with warm undertones
        surface: {
          50: "#fafafa",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        // Success green
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "10px",
        lg: "12px",
        xl: "16px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 16px -4px rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04)",
        elevated:
          "0 4px 20px -4px rgba(0, 0, 0, 0.08), 0 8px 32px -8px rgba(0, 0, 0, 0.06)",
        button: "0 1px 2px rgba(0, 0, 0, 0.05)",
        "button-hover": "0 4px 12px rgba(0, 0, 0, 0.1)",
        inner: "inset 0 1px 2px rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
      },
    },
  },
  plugins: [],
};

export default config;
