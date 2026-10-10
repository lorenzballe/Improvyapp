import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { seo } from "./tools/seo";
import { degreePages } from "./tools/degree-pages";

export default defineConfig({
  plugins: [react(), tailwindcss(), seo(), degreePages()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
