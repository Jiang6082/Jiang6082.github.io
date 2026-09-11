# Charles Jiang — personal website

An Astro site for research projects, photography, and writing. Photos are local assets optimized to WebP at build time. The existing GitHub Pages workflow remains in place.

## Development

```sh
npm ci
npm run dev
```

## Build and check

```sh
npm run build
node scripts/check-site.mjs
npm run preview
```

The static check validates local links and assets, project anchors, private repository link handling, photo counts, and the scroll timeline bounds. It does not replace interactive browser testing.

## Editing

- Personal details and social links: `src/config.ts`.
- Home content and opening photo selection: `src/pages/index.astro`.
- Project records: `src/data/projects.ts`. Public/private visibility is preserved.
- Photo collection: run `npm run photos:manage` and open http://127.0.0.1:4322. See [PHOTO-MANAGER.md](PHOTO-MANAGER.md).
- Project walkthroughs and cited research results: `src/data/research.ts`.
- Blog posts: Markdown in `src/content/blog/`; keep the existing frontmatter schema.
- Colors and type: `src/styles/global.css`.
- Scroll timeline calculations: `src/lib/opening-motion.js`.

The opening portrait expands and crossfades through three photographs as the visitor scrolls. It uses native scrolling and requestAnimationFrame without taking over wheel or touch input. Motion can be disabled; reduced-motion preferences and smaller viewports use a static composition with a Next control. No JavaScript still leaves the home, projects, writing, and main photo collection readable.

The photography page opens in a curved 3D filmstrip with native swipe/scroll, previous/next buttons, and arrow-key navigation. Switch to the contact sheet for an overview. Pointer movement gently tilts photographs; reduced-motion preferences disable both depth and tilt, and the Depth control can flatten the filmstrip. Albums filter both views and the zoomable lightbox. The classic gallery route remains available.

The private local manager supports uploads, albums, ordering, moving, hiding, and restoring photographs. It saves `src/data/photos.json`; `src/data/photos.ts` filters hidden entries for the public site. Public photo titles and captions are suppressed; accessible image descriptions remain. The gallery behavior lives in `src/scripts/photography.ts`. Run `node scripts/check-photo-manager.mjs` to check saving, uploads, backups, and request protections in an isolated temporary collection.

Project diagrams are conceptual illustrations, not measured results.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`. This redesign is prepared on a separate local branch for review; it does not change the live website until published. The local photo manager uses Sharp for image conversion; the manager itself is excluded from the static public build.

In the filmstrip, vertical mouse-wheel or trackpad input moves photographs horizontally while the pointer is over the gallery. At either edge the gesture returns to page scrolling. Horizontal gestures and browser zoom stay native. Run `node scripts/check-filmstrip-wheel.mjs` to check input routing and boundary behavior.
