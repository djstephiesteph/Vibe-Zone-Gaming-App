import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Lovable-compatible Vite config. Lovable projects run on Vite + React + TS + Tailwind
// and serve from the project root, so keep this config minimal and portable.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
  },
});
