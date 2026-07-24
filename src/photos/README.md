# src/photos

Web-ready photos live here (committed to the repo). Astro optimizes them into
responsive WebP at build time.

**Don't hand-place large originals here.** Instead:

1. Drop your originals (any size) into the `photos-src/` folder at the repo root.
2. Run `npm run photos` — it resizes them into this folder (max 2560px on the
   long edge, EXIF/GPS stripped) preserving any subfolder structure.
3. Reference them from `src/data/photos.ts` by their path relative to this
   folder, e.g. `src: "busan/bookshop1.jpg"`.
