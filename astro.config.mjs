// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config.ts";

// Pages that exist but shouldn't be indexed: the old /photo-room address
// redirects, the classic gallery duplicates /photography, and 404 is an error page.
const unlisted = ["/photo-room/", "/photography-classic/", "/404/"];

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  base: SITE.base || "/",
  redirects: {
    "/photo-room": "/travel-world/",
  },
  integrations: [
    sitemap({
      filter: (page) => !unlisted.some((path) => page.endsWith(path)),
    }),
  ],
});
