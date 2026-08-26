import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/haus-labs-discovery-set/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
