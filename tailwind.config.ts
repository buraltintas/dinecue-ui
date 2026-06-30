import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#0D0D0F",
        charcoal: "#151412",
        midnight: "#171D22",
        ivory: "#F4EFE4",
        muted: "#BDB3A3",
        copper: "#D48A45",
        amber: "#F0B35C",
        sage: "#91A06B",
        wine: "#6F363D"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Nunito Sans", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Nunito Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 90px rgba(212, 138, 69, 0.22)",
        glass: "0 18px 70px rgba(0, 0, 0, 0.28)"
      },
      backgroundImage: {
        "radial-table": "radial-gradient(circle at 50% 35%, rgba(212,138,69,.24), transparent 32%), radial-gradient(circle at 20% 15%, rgba(145,160,107,.14), transparent 28%), linear-gradient(145deg, #0D0D0F 0%, #171D22 52%, #151412 100%)"
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
