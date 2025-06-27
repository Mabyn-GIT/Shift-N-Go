import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    port: 3000,
    host: "0.0.0.0", // This is important for deployment
    allowedHosts: true, // Allow all hosts for development
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
    allowedHosts: true, // Allow all hosts for preview/production
  },
});
