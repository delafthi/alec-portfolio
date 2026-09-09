import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
    site: "https://alecs.pictures",
    adapter: netlify(),
    prefetch: { defaultStrategy: "hover" },
    i18n: {
        locales: ["de", "en"],
        defaultLocale: "en",
        routing: { prefixDefaultLocale: true, redirectToDefaultLocale: true },
    },
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [
        sitemap({
            filter: (page) => !page.includes("/contact-thanks"),
            i18n: {
                defaultLocale: "en",
                locales: { en: "en", de: "de" },
            },
        }),
    ],
});
