import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import brand from "./src/brand/brand.config.json";

// Fills the %BRAND_*% placeholders of index.html from src/brand/brand.config.json.
const brandHtml = (): Plugin => ({
  name: "brand-html",
  transformIndexHtml: (html) =>
    html
      .replaceAll("%BRAND_HTML_TITLE%", brand.htmlTitle)
      .replaceAll("%BRAND_FONTS_URL%", brand.fontsUrl)
      .replaceAll("%BRAND_THEME_COLOR%", brand.themeColor),
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), brandHtml()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
