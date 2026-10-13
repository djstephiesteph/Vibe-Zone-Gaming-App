import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Vibe Zone palette: late-night neon club, not a generic SaaS palette.
        ink: "#0B0A12",        // near-black stage floor
        velvet: "#1B1330",     // deep violet-black walls
        plum: "#2E1B4E",       // panel surfaces
        magenta: "#FF2E88",    // primary neon accent
        cyan: "#2EE6D6",       // secondary neon accent
        gold: "#F5B841",       // trophy / unlock accent
        haze: "#7B6CA8",       // muted lavender for secondary text
        bulb: "#FFF3D6",       // warm marquee bulb color
      },
      fontFamily: {
        display: ["'Righteous'", "system-ui", "sans-serif"],
        body: ["'Manrope'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 12px rgba(255,46,136,0.55), 0 0 32px rgba(46,230,214,0.25)",
      },
      keyframes: {
        pulseGlow: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        popIn: {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        wander: {
          "0%, 100%": { left: "30%", top: "60%" },
          "20%": { left: "55%", top: "68%" },
          "40%": { left: "70%", top: "50%" },
          "60%": { left: "45%", top: "40%" },
          "80%": { left: "22%", top: "45%" },
        },
      },
      animation: {
        pulseGlow: "pulseGlow 2.2s ease-in-out infinite",
        popIn: "popIn 0.25s ease-out",
        wander: "wander 16s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
