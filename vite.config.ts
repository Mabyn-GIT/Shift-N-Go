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
  },
  preview: {
    allowedHosts: ['shift-n-go.onrender.com'], // ✅ Add this
    host: "0.0.0.0", // optional, mirrors `server.host`
    port: 4173, // optional: set a fixed port for preview
  },
  define: {
    __VITE_SUPABASE_URL__: JSON.stringify(process.env.VITE_SUPABASE_URL),
    __VITE_SUPABASE_ANON_KEY__: JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY),
  },
});
