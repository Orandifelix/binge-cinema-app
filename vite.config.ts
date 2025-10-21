import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ Add this line

      // ✅ Fix Vite resolving Firebase’s ESM paths incorrectly
      "firebase/app": path.resolve(
        __dirname,
        "node_modules/firebase/app/dist/index.mjs"
      ),
      "firebase/auth": path.resolve(
        __dirname,
        "node_modules/firebase/auth/dist/index.mjs"
      ),
      "firebase/firestore": path.resolve(
        __dirname,
        "node_modules/firebase/firestore/dist/index.mjs"
      ),
      "firebase/storage": path.resolve(
        __dirname,
        "node_modules/firebase/storage/dist/index.mjs"
      ),
    },
  },

  // ✅ Vitest Configuration
  test: {
    globals: true,                  // enables describe, it, expect globally
    environment: "jsdom",           // enables DOM testing (document/window)
    setupFiles: "./src/setupTests.ts", // runs before all tests
  },

  optimizeDeps: {
    include: [
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/storage",
    ],
  },

  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    } as any,
  },
});
