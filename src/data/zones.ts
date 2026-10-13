import type { Zone } from "../types";

export interface RoomTheme {
  wallGradient: string;
  floorGradient: string;
  accent: string;   // used by the room switcher's active-tab highlight
  tiltUp?: boolean; // Lighting is a ceiling — the floor trapezoid flips
}

// Zones unlock in this order. Within whichever zone is currently active,
// every item is tappable — afford it, it clears instantly. Finishing every
// item in a zone unlocks the next one. Each zone also carries its own
// "room" look (see RoomStage) so it reads as a distinct space rather than
// one continuous flat scene.
export const ZONES: (Zone & { theme: RoomTheme })[] = [
  {
    name: "Entrance",
    order: 1,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 0%, rgba(245,184,65,0.18), transparent 55%), linear-gradient(180deg, #2b2140 0%, #1b1330 70%, #120c1e 100%)",
      floorGradient: "linear-gradient(180deg, #171022 0%, #0d0815 100%)",
      accent: "#F5B841",
    },
  },
  {
    name: "Dance Floor",
    order: 2,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 10%, rgba(255,46,136,0.22), transparent 55%), linear-gradient(180deg, #27163d 0%, #170f26 70%, #0d0815 100%)",
      floorGradient: "linear-gradient(180deg, #1c1430 0%, #120c1e 100%)",
      accent: "#FF2E88",
    },
  },
  {
    name: "Seating",
    order: 3,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 10%, rgba(123,108,168,0.18), transparent 55%), linear-gradient(180deg, #241a38 0%, #150f22 100%)",
      floorGradient: "linear-gradient(180deg, #201630 0%, #120c1e 100%)",
      accent: "#7B6CA8",
    },
  },
  {
    name: "Bathrooms",
    order: 4,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 10%, rgba(46,230,214,0.14), transparent 55%), linear-gradient(180deg, #16202e 0%, #0d131c 100%)",
      floorGradient: "linear-gradient(180deg, #121a26 0%, #0a0f17 100%)",
      accent: "#2EE6D6",
    },
  },
  {
    name: "Bar",
    order: 5,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 10%, rgba(245,184,65,0.2), transparent 55%), linear-gradient(180deg, #2a1d18 0%, #1a110e 100%)",
      floorGradient: "linear-gradient(180deg, #1f1512 0%, #120b09 100%)",
      accent: "#F5B841",
    },
  },
  {
    name: "Kitchen",
    order: 6,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 10%, rgba(140,170,190,0.16), transparent 55%), linear-gradient(180deg, #1c2430 0%, #11161d 100%)",
      floorGradient: "linear-gradient(180deg, #151c24 0%, #0c1014 100%)",
      accent: "#8CAABE",
    },
  },
  {
    name: "DJ Booth",
    order: 7,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 10%, rgba(46,230,214,0.2), transparent 55%), linear-gradient(180deg, #1a1640 0%, #0f0c26 100%)",
      floorGradient: "linear-gradient(180deg, #140f2e 0%, #0a0718 100%)",
      accent: "#2EE6D6",
    },
  },
  {
    name: "Lighting",
    order: 8,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 100%, rgba(255,255,255,0.1), transparent 60%), linear-gradient(180deg, #0d0a1a 0%, #050309 100%)",
      floorGradient: "linear-gradient(180deg, #11101f 0%, #050309 100%)",
      accent: "#FFF3D6",
      tiltUp: true,
    },
  },
  {
    name: "VIP Lounge",
    order: 9,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 10%, rgba(245,184,65,0.22), transparent 55%), linear-gradient(180deg, #331526 0%, #1d0c16 100%)",
      floorGradient: "linear-gradient(180deg, #2a1019 0%, #150810 100%)",
      accent: "#F5B841",
    },
  },
  {
    name: "Grand Reopening",
    order: 10,
    theme: {
      wallGradient:
        "radial-gradient(circle at 50% 20%, rgba(255,46,136,0.35), transparent 60%), linear-gradient(180deg, #2d1a3d 0%, #160c22 100%)",
      floorGradient: "linear-gradient(180deg, #2a1019 0%, #150810 100%)",
      accent: "#FF2E88",
    },
  },
];
