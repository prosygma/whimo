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

// Google login breaks with a placeholder client ID ("The OAuth client was not found") or with a
// redirect URI that doesn't match the address the app runs on. Stop a build with such values;
// only warn in dev, where the rest of the app can still be worked on.
const checkGoogleLogin = (env: Record<string, string>, command: 'build' | 'serve') => {
  const clientId = env.VITE_GOOGLE_CLIENT_ID ?? '';
  const problems = [];
  if (!/^[\w-]+\.apps\.googleusercontent\.com$/.test(clientId) || /xxxx|example/i.test(clientId)) {
    problems.push(`VITE_GOOGLE_CLIENT_ID is missing or a placeholder ("${clientId}")`);
  }
  if (!env.VITE_BASE_URL) {
    problems.push('VITE_BASE_URL is missing (Google redirects to VITE_BASE_URL/oauth/callback)');
  }
  if (!problems.length) return;
  const message = `Google login will not work: ${problems.join('; ')}. Set them in the .env file of this mode.`;
  if (command === 'build') throw new Error(message);
  console.warn(`\n\u26a0  ${message}\n`);
};

// The dev server listens on the port of VITE_BASE_URL, so that Google's redirect comes back to it.
const devPort = (baseUrl: string | undefined) => {
  const port = baseUrl ? Number(new URL(baseUrl).port) : NaN;
  return Number.isInteger(port) && port > 0 ? port : 4000;
};

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  checkGoogleLogin(env, command);

  return {
    plugins: [react(), tailwindcss(), brandHtml()],
    server: {
      port: devPort(env.VITE_BASE_URL),
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
