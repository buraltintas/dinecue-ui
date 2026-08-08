import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Grounds, darkest to lightest. `night` is the dominant one: a warm
        // near-black that reads as a dim room rather than a dark UI theme.
        void: "#08080A",
        night: "#100E0C",
        graphite: "#0D0D0F",
        charcoal: "#151412",
        ember: "#1A1613",
        midnight: "#171D22",
        // Ink, in three steps.
        ivory: "#F4EFE4",
        muted: "#BDB3A3",
        faint: "#8A8175",
        // Accents. Amber leads; copper is for edges and gradients, never for text.
        amber: { DEFAULT: "#F0B35C", hi: "#FFD18A" },
        copper: "#D48A45",
        sage: "#91A06B",
        wine: "#6F363D"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      fontSize: {
        // Fluid from 320px to 1536px, so there is no breakpoint-to-breakpoint jump.
        "display-1": ["clamp(2.75rem, 1.55rem + 6vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-2": ["clamp(2rem, 1.35rem + 3.25vw, 3.5rem)", { lineHeight: "1.04", letterSpacing: "-0.022em" }],
        "display-3": ["clamp(1.5rem, 1.24rem + 1.3vw, 2.125rem)", { lineHeight: "1.14", letterSpacing: "-0.015em" }],
        lead: ["clamp(1.0625rem, 1rem + 0.45vw, 1.3125rem)", { lineHeight: "1.65" }],
        body: ["1rem", { lineHeight: "1.7" }],
        label: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.16em" }]
      },
      borderRadius: {
        card: "1.25rem",
        panel: "1.75rem",
        pill: "999px"
      },
      spacing: {
        "section-sm": "clamp(3rem, 2rem + 4vw, 4.5rem)",
        "section-md": "clamp(4rem, 2.5rem + 6vw, 7rem)",
        "section-lg": "clamp(5rem, 3rem + 8vw, 9rem)",
        gutter: "clamp(1.25rem, 0.6rem + 2.4vw, 3rem)",
        safe: "env(safe-area-inset-bottom, 0px)",
        "safe-top": "env(safe-area-inset-top, 0px)"
      },
      maxWidth: {
        measure: "68ch"
      },
      boxShadow: {
        glow: "0 24px 90px rgba(212, 138, 69, 0.22)",
        glass: "0 18px 70px rgba(0, 0, 0, 0.28)",
        lift: "0 1px 0 rgba(244, 239, 228, 0.06) inset, 0 24px 60px -30px rgba(0, 0, 0, 0.9)"
      },
      backgroundImage: {
        "radial-table":
          "radial-gradient(circle at 50% 35%, rgba(212,138,69,.24), transparent 32%), radial-gradient(circle at 20% 15%, rgba(145,160,107,.14), transparent 28%), linear-gradient(145deg, #0D0D0F 0%, #171D22 52%, #151412 100%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        orbit: {
          to: { transform: "rotate(360deg)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        orbit: "orbit 18s linear infinite",
        shimmer: "shimmer 2.4s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
