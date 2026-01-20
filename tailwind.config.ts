import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          'sans-serif',
        ],
        heading: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          'sans-serif',
        ],
      },
      fontSize: {
        // Base-style type scale
        'hero': ['44px', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '600' }],
        'hero-lg': ['64px', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '600' }],
        'section': ['28px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '600' }],
        'section-lg': ['40px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '600' }],
        'card-title': ['17px', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body': ['15px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '1.2', letterSpacing: '0.02em', fontWeight: '500' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        seed: {
          DEFAULT: "hsl(var(--seed-green))",
          glow: "hsl(var(--seed-green-glow))",
        },
        base: {
          DEFAULT: "hsl(var(--base-blue))",
          glow: "hsl(var(--base-blue-glow))",
        },
        trust: {
          DEFAULT: "hsl(var(--trust-purple))",
        },
        envoy: {
          DEFAULT: "hsl(var(--envoy-orange))",
        },
        landing: {
          wallet: "hsl(var(--landing-wallet))",
          impact: "hsl(var(--landing-impact))",
          spread: "hsl(var(--landing-spread))",
          ledger: "hsl(var(--landing-ledger))",
          seedbases: "hsl(var(--landing-seedbases))",
          tithing: "hsl(var(--landing-tithing))",
          movement: "hsl(var(--landing-movement))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "scroll-cards": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-feed": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "subtle-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "number-tick": {
          "0%, 100%": { transform: "translateY(0)" },
          "10%": { transform: "translateY(-2px)" },
          "20%": { transform: "translateY(0)" },
        },
        "icon-wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
        "progress-pulse": {
          "0%, 100%": { opacity: "1", transform: "scaleX(1)" },
          "50%": { opacity: "0.85", transform: "scaleX(1.02)" },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 10px rgba(59,130,246,0.3)",
            opacity: "1" 
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(59,130,246,0.6)",
            opacity: "0.9" 
          },
        },
        "fill-bar": {
          "0%": { width: "0%" },
          "100%": { width: "var(--target-width)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-down": "slide-down 0.4s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out",
        "scroll-cards": "scroll-cards 30s linear infinite",
        "scroll-feed": "scroll-feed 20s linear infinite",
        "gentle-bounce": "gentle-bounce 2s ease-in-out infinite",
        "subtle-pulse": "subtle-pulse 3s ease-in-out infinite",
        "number-tick": "number-tick 2s ease-in-out infinite",
        "icon-wiggle": "icon-wiggle 3s ease-in-out infinite",
        "progress-pulse": "progress-pulse 2s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 0.6s ease-in-out infinite",
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
