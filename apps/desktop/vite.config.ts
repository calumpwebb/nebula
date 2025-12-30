import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";
import fs from "fs";

// Read version from tauri.conf.json
function getAppVersion(): string {
  try {
    const tauriConfig = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "src-tauri/tauri.conf.json"), "utf-8")
    );
    return tauriConfig.version || "0.0.0";
  } catch {
    return "dev";
  }
}

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [TanStackRouterVite(), react()],

  define: {
    __APP_VERSION__: JSON.stringify(getAppVersion()),
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: false,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
