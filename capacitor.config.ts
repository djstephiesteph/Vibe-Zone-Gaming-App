import type { CapacitorConfig } from "@capacitor/cli";

// Wraps the built web app for Android + iOS via Capacitor.
// Run `npm run build` then `npx cap add ios` / `npx cap add android`,
// then `npm run cap:sync` any time /dist changes.
const config: CapacitorConfig = {
  appId: "com.wrightplace4solutions.vibezone",
  appName: "Vibe Zone",
  webDir: "dist",
  backgroundColor: "#0B0A12",
  server: {
    androidScheme: "https",
  },
};

export default config;
