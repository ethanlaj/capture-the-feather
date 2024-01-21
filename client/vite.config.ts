import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const fileURLToPath = (url) => {
  return new URL(url).pathname;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
});
