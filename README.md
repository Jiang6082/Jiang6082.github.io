# Personal website

A minimal personal site built with [Astro](https://astro.build): an **About**
page, a Markdown-powered **Blog**, and a **Photography** gallery backed by
[Cloudinary](https://cloudinary.com), with links to your social profiles.

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Make it yours

Almost all personal details live in **`src/config.ts`** — edit it first:

- `SITE.name`, `SITE.tagline`, `SITE.email`
- `SOCIALS` — your GitHub, LinkedIn, etc.
- `CLOUDINARY.cloudName` — see below

Then:

- **About page** — edit `src/pages/index.astro` (the placeholder paragraph).
- **Blog** — add/edit Markdown files in `src/content/blog/`. See
  `writing-a-post.md` for the frontmatter format.
- **Photography** — see below.

## Photography (Cloudinary)

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy your **Cloud name** (Dashboard → Product Environment Credentials) into
   `CLOUDINARY.cloudName` in `src/config.ts`.
3. Upload photos in the Media Library. For each photo, copy its **Public ID**.
4. Add entries to `src/data/photos.ts`:

   ```ts
   { publicId: "portfolio/sunset_2024", alt: "Sunset over the bay", caption: "Boston, 2024" }
   ```

5. Delete the `placeholder: true` entries once you have real photos.

Cloudinary automatically serves optimized, resized, CDN-cached versions — you
don't need to resize anything yourself.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repo: **Settings → Pages → Build and deployment → Source →
   GitHub Actions**.
3. Set the URL config in `src/config.ts`:
   - **`<username>.github.io` repo** or **custom domain**: `url` = your URL,
     leave `base` = `""`.
   - **project repo** (`<username>.github.io/<repo>`): `url` =
     `"https://<username>.github.io"`, `base` = `"/<repo>"`.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and
   deploys automatically.

## Commands

| Command           | Action                                    |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start dev server at `localhost:4321`      |
| `npm run build`   | Build production site to `./dist/`        |
| `npm run preview` | Preview the build locally                 |
