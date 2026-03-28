import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://alecs.pictures",
  i18n: {
    locales: ["de", "en"],
    defaultLocale: "de",
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
