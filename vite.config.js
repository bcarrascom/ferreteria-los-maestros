import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // En desarrollo, Vite reenvía cada /api/v1/... a su microservicio, igual que nginx en el EC2.
  // Así el front usa rutas relativas y no necesita CORS.
  server: {
    proxy: {
      "/api/v1/auth": "http://localhost:8081",
      "/api/v1/usuarios": "http://localhost:8081",
      "/api/v1/productos": "http://localhost:8082",
      "/api/v1/categorias": "http://localhost:8082",
      "/api/v1/boletas": "http://localhost:8083",
    },
  },
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
