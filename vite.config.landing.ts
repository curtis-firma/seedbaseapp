import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Standalone landing page build config - no Supabase dependencies
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist-landing",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index-landing.html"),
      },
    },
  },
  // Stub out Supabase imports to prevent any accidental inclusion
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(""),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(""),
  },
});
