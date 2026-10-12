import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
    css: true,
    coverage: {
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.spec.jsx", "src/test/**", "src/main.jsx"],
    },
  },
});
