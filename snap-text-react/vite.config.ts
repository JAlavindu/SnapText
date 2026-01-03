import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, "src/background/serviceWorker.ts"),
        content: resolve(__dirname, "src/content/injector.ts")
      },
      output: {
        entryFileNames: "[name]/[name].js"
      }
    }
  }
});
