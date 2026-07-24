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
  { name: "GitHub", url: "https://github.com/jiang6082" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/charlesj8450" },
  { name: "Email", url: `mailto:${"leung.jor@northeastern.edu"}` },
];

// ── Cloudinary ──────────────────────────────────────────────────
// After you create a free Cloudinary account, put your "cloud name"
// here (Dashboard → Product Environment Credentials → Cloud name).
export const CLOUDINARY = {
  cloudName: "your-cloud-name",
};
