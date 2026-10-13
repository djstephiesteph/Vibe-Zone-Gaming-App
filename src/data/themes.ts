import type { ThemeAvailability } from "../types";

export interface ThemeProfile {
  id: string;
  name: string;
  availability: ThemeAvailability;
  shortLabel: string;
  description: string;
  signage: string;
  palette: {
    accent: string;
    wallTint: string;
    floorTint: string;
  };
  danceFlavor: string;
  guestLooks: string[];
  vibeBias: number;
  queueTolerance: number;
}

export const THEME_REGISTRY: ThemeProfile[] = [
  {
    id: "open-format",
    name: "Open Format Nights",
    availability: "playable",
    shortLabel: "Open Format",
    description: "Balanced crowd mix and flexible playlists. Stable earnings and beginner-friendly flow.",
    signage: "🌆",
    palette: {
      accent: "#F5B841",
      wallTint: "radial-gradient(circle at 20% 12%, rgba(245,184,65,0.18), transparent 52%)",
      floorTint: "radial-gradient(circle at 80% 80%, rgba(255,46,136,0.14), transparent 56%)",
    },
    danceFlavor: "Main floor sing-alongs with cross-genre transitions",
    guestLooks: ["🕺", "💃", "🧑‍🎤", "🧥", "👗", "🧢"],
    vibeBias: 3,
    queueTolerance: 0.62,
  },
  {
    id: "edm-house",
    name: "Techno / EDM / House",
    availability: "playable",
    shortLabel: "EDM / House",
    description: "High-energy drops keep the dance floor full. Bigger vibe spikes and denser crowd surges.",
    signage: "🔊",
    palette: {
      accent: "#2EE6D6",
      wallTint: "radial-gradient(circle at 75% 8%, rgba(46,230,214,0.24), transparent 55%)",
      floorTint: "radial-gradient(circle at 25% 72%, rgba(143,122,255,0.16), transparent 60%)",
    },
    danceFlavor: "Four-on-the-floor grooves and neon drop moments",
    guestLooks: ["🧑‍🎧", "🕺", "💃", "🧥", "🧢", "🥽"],
    vibeBias: 5,
    queueTolerance: 0.58,
  },
  {
    id: "latin-nights",
    name: "Latin Salsa / Bachata / Reggaeton",
    availability: "playable",
    shortLabel: "Latin Nights",
    description: "Warm social dance atmosphere with expressive crowd reactions and strong regular retention.",
    signage: "💃",
    palette: {
      accent: "#FF7A4E",
      wallTint: "radial-gradient(circle at 28% 10%, rgba(255,122,78,0.2), transparent 55%)",
      floorTint: "radial-gradient(circle at 82% 84%, rgba(245,184,65,0.14), transparent 52%)",
    },
    danceFlavor: "Partner dance bursts with percussion-heavy peaks",
    guestLooks: ["💃", "🕺", "🧥", "👠", "👗", "🧢"],
    vibeBias: 4,
    queueTolerance: 0.7,
  },
  {
    id: "hiphop-rnb",
    name: "Hip-Hop / R&B",
    availability: "coming_soon",
    shortLabel: "Hip-Hop / R&B",
    description: "Coming soon",
    signage: "🎤",
    palette: { accent: "#FF2E88", wallTint: "", floorTint: "" },
    danceFlavor: "",
    guestLooks: [],
    vibeBias: 0,
    queueTolerance: 0.6,
  },
  {
    id: "country-line-dance",
    name: "Country / Line Dance",
    availability: "coming_soon",
    shortLabel: "Country",
    description: "Coming soon",
    signage: "🤠",
    palette: { accent: "#C58A4A", wallTint: "", floorTint: "" },
    danceFlavor: "",
    guestLooks: [],
    vibeBias: 0,
    queueTolerance: 0.6,
  },
  {
    id: "afrobeats-amapiano",
    name: "Afrobeats / Amapiano",
    availability: "coming_soon",
    shortLabel: "Afrobeats",
    description: "Coming soon",
    signage: "🥁",
    palette: { accent: "#4ED7A3", wallTint: "", floorTint: "" },
    danceFlavor: "",
    guestLooks: [],
    vibeBias: 0,
    queueTolerance: 0.6,
  },
];

export const STARTER_THEME_IDS = THEME_REGISTRY.filter((theme) => theme.availability === "playable").map((theme) => theme.id);

export function getThemeById(themeId: string | null | undefined): ThemeProfile | null {
  if (!themeId) return null;
  return THEME_REGISTRY.find((theme) => theme.id === themeId) ?? null;
}
