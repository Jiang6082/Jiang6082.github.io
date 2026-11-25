// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config.ts";

// Pages that exist but shouldn't be indexed: old addresses that redirect,
// and the 404 page.
const unlisted = ["/photo-room/", "/travel-world/", "/photography-classic/", "/404/"];

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  base: SITE.base || "/",
  redirects: {
    "/photo-room": "/photography/map/",
    "/travel-world": "/photography/map/",
    // The classic grid is now the Gallery itself.
    "/photography-classic": "/photography/",
  },
  integrations: [
    sitemap({
      filter: (page) => !unlisted.some((path) => page.endsWith(path)),
    }),
  ],
});
