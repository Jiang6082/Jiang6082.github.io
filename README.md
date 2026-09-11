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
- Photo collection: `src/data/photos.ts`, pointing to files in `src/photos/`.
- Blog posts: Markdown in `src/content/blog/`; keep the existing frontmatter schema.
- Colors and type: `src/styles/global.css`.
- Scroll timeline calculations: `src/lib/opening-motion.js`.

The opening portrait expands and crossfades through three photographs as the visitor scrolls. It uses native scrolling and requestAnimationFrame without taking over wheel or touch input. Motion can be disabled; reduced-motion preferences and smaller viewports use a static composition with a Next control. No JavaScript still leaves the home, projects, writing, and main photo collection readable.

The photography page offers a contact sheet and manual filmstrip, plus the existing zoomable lightbox and classic gallery route. Project diagrams are conceptual illustrations, not measured results.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`. This redesign is prepared on a separate local branch for review; it does not change the live website until published. No new application dependencies were required.
