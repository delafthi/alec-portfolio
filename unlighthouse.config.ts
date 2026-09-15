import { defineUnlighthouseConfig } from "unlighthouse/config";

export default defineUnlighthouseConfig({
    scanner: {
        // Astro generates sitemap-index.xml, not sitemap.xml
        sitemap: ["/sitemap-index.xml"],
        // hreflang x-default points at the production origin; scan the
        // localized pages anyway
        ignoreI18nPages: false,
    },
});
