import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://yedilsan.github.io/test-table-app/",
  plugins: [react()],
});
