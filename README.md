# Charles Jiang — personal website

An Astro site for research projects, photography, and writing. Photos are local assets optimized to WebP at build time. It includes interactive project walkthroughs and a Three.js photography island.

[Live portfolio](https://jiang6082.github.io/) · [Projects](https://jiang6082.github.io/projects/) · [Résumé](https://jiang6082.github.io/resume/) · [Travel world](https://jiang6082.github.io/travel-world/)

**Stack:** Astro, TypeScript, Three.js, and Sharp. Project demos distinguish fictional inputs from recorded research results. The site keeps readable alternatives for its interactive views.

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

The static check validates local links and assets, project anchors, private repository link handling, and photo counts. It does not replace interactive browser testing.

## Editing

- Personal details and social links: `src/config.ts`.
- Home content and opening photo selection: `src/pages/index.astro`.
- Project records: `src/data/projects.ts`. Public/private visibility is preserved.
- Photo collection: run `npm run photos:manage` and open http://127.0.0.1:4322. See [PHOTO-MANAGER.md](PHOTO-MANAGER.md).
- Project walkthroughs and cited research results: `src/data/research.ts`.
- Blog posts: Markdown in `src/content/blog/`; keep the existing frontmatter schema.
- Colors and type: `src/styles/global.css`.
- Web résumé: `src/data/resume.ts`. No phone number or original résumé PDFs are published.
- Project visuals: `src/components/ProjectVisual.astro`, using result tables in `src/data/research.ts`.

The homepage uses a static photograph and direct links into project walkthroughs. The photography filmstrip is the main motion feature. No JavaScript still leaves the home, projects, résumé, writing, and main photo collection readable.

The photography page opens in a curved 3D filmstrip with native swipe/scroll, previous/next buttons, and arrow-key navigation. Switch to the contact sheet for an overview. Reduced-motion preferences disable depth, and the Depth control can flatten the filmstrip. Pointer tilt has been removed. Albums filter both views and the zoomable lightbox. The classic gallery route remains available.

The private local manager supports uploads, albums, ordering, moving, hiding, and restoring photographs. It saves `src/data/photos.json`; `src/data/photos.ts` filters hidden entries for the public site. Public photo titles and captions are suppressed; accessible image descriptions remain. The gallery behavior lives in `src/scripts/photography.ts`. Run `node scripts/check-photo-manager.mjs` to check saving, uploads, backups, and request protections in an isolated temporary collection.

Emberforge visualizes the recorded synthetic demo; Geld and volatility charts use the walkthrough's sourced result tables. IDX Exchange has a request-flow diagram and a source-linked implementation walkthrough. Olsen's slider explains an illustrative long-call expiry payoff and is explicitly not an Olsen result. Numerical tables remain readable without JavaScript. The résumé is an HTML page with a print stylesheet and browser Print / save PDF action.

## Optional 3D views

`/travel-world` is a fictional miniature island with five clickable destinations, a working oval railway, and an aircraft flight. Actual photo textures float above their destinations in the 3D scene. Visiting a stop expands its collection; clicking a photograph opens the full-size viewer without visible captions. Destination buttons and the gallery below provide an accessible alternative. Photo textures load on demand and are shared across repeated appearances. `/photo-room` forwards to the replacement.

The island shares the visible catalog with the filmstrip. Subject assignments for existing photos are in `src/data/travel.ts`; newly uploaded photos appear under All photographs until assigned to a destination there. The airfield intentionally has no photographs yet. No actual shooting locations are inferred.

`/options-lab` shows an illustrative Black–Scholes European call surface, with stock price, time, and volatility controls. Strike is $100, annual rate is 4%, and dividends are zero. This is not an Olsen result. The model is in `src/lib/black-scholes.js`; the static preview, numerical calculator, and sample table provide alternatives to WebGL.

Both views load Three.js only after their entry button is pressed. The island animates only for user-started train/plane motion or camera travel, and suspends its animation while offscreen or in a hidden tab. Run/Pause train and Fly/Land plane control motion. Reduced-motion preferences skip camera flights. Neither view auto-rotates. Rotation buttons complement pointer gestures. Run `node scripts/check-labs.mjs` after building to validate the pricing model, gallery data, lazy loading, and public content removals.

## Project demos

`ProjectPlayground.astro` adds four small demos to the project cards and walkthroughs. IDX filters eight fictional listings with three results per page. Geld selects exact recorded V15 cost scenarios, without interpolating or rerunning a strategy. Volatility demonstrates strictly past-only forecasts on a fictional shock path. Emberforge compares unadjusted and Benjamini–Hochberg thresholds for invented p-values. Demo inputs, results, and limitations are labeled. The existing options payoff and 3D surface remain available under Olsen.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`. The live portfolio is published from this repository; the workflow builds and deploys the static site. The local photo manager uses Sharp for image conversion; the manager itself is excluded from the static public build.

In the filmstrip, vertical mouse-wheel or trackpad input moves photographs horizontally while the pointer is over the gallery. At either edge the gesture returns to page scrolling. Horizontal gestures and browser zoom stay native. Run `node scripts/check-filmstrip-wheel.mjs` to check input routing and boundary behavior.
