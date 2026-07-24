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
};

// Social / profile links shown in the header and footer.
// Remove any you don't want; add more freely.
export const SOCIALS = [
  { name: "GitHub", icon: "github", url: "https://github.com/jiang6082" },
  { name: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/charlesj8450" },
  { name: "Email", icon: "email", url: `mailto:${"leung.jor@northeastern.edu"}` },
];

// ── GitHub (Projects page) ──────────────────────────────────────
// The Projects page pulls your public repos from the GitHub API at build
// time and shows them as cards with language + star/fork visualizations.
export const GITHUB = {
  username: "jiang6082",
  // Leave empty [] to auto-feature your most notable repos (by stars, then
  // most recently updated). Or list exact repo names to feature, in order.
  featured: [] as string[],
  // Repos to always hide (this site, forks you don't want to show, etc.).
  exclude: ["jiang6082.github.io", "Jiang6082.github.io"],
  // How many repos to show when auto-selecting.
  limit: 9,
};

// ── Cloudinary ──────────────────────────────────────────────────
// After you create a free Cloudinary account, put your "cloud name"
// here (Dashboard → Product Environment Credentials → Cloud name).
export const CLOUDINARY = {
  cloudName: "your-cloud-name",
};
