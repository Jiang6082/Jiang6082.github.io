// ────────────────────────────────────────────────────────────────
//  EDIT ME — this is the one file you need to touch for basic setup.
// ────────────────────────────────────────────────────────────────

export const SITE = {
  // Your name as it appears in the header and page titles.
  name: "Charles Jiang",
  // Short tagline shown under your name on the About page.
  tagline: "Student · Developer · Photographer",
  // Used for <title>, RSS, and SEO. No trailing slash.
  // For GitHub Pages project sites this is https://<user>.github.io
  url: "https://jiang6082.github.io",
  // If deploying to https://<user>.github.io/<repo>, set base to "/<repo>".
  // If using a custom domain or a <user>.github.io repo, leave as "".
  base: "",
  email: "leung.jor@northeastern.edu",
  // Your portrait for the About hero — a file under src/photos (optimized
  // by Astro). Leave "" to show a framed placeholder instead.
  photo: "IMG_0339.jpg",
};

// Social / profile links shown in the header and footer.
// Remove any you don't want; add more freely.
export const SOCIALS = [
  { name: "GitHub", icon: "github", url: "https://github.com/jiang6082" },
  { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/charlesj8450" },
  { name: "Email", icon: "email", url: `mailto:${"leung.jor@northeastern.edu"}` },
];

// ── GitHub ──────────────────────────────────────────────────────
// The Projects page uses a hand-curated list in src/data/projects.ts
// (so it works for private repos too). This is just your profile handle
// for the "More on GitHub" link.
export const GITHUB = {
  username: "jiang6082",
};

// Photos are stored locally under src/photos and optimized by Astro at
// build time — see src/data/photos.ts. (No image host / API keys needed.)

// ── Analytics (optional, privacy-friendly) ──────────────────────
// Cookieless visitor counting via GoatCounter — free, no consent banner
// needed, doesn't track individuals. Create a free site at
// https://www.goatcounter.com, then set `goatCounter` to your code (the
// subdomain — e.g. "charlesjiang" for charlesjiang.goatcounter.com).
// Leave it "" to keep analytics OFF entirely.
export const ANALYTICS = {
  goatCounter: "",
};
