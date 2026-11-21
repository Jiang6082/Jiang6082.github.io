// Site-wide settings: name, URLs, contact links, and analytics.

export const SITE = {
  name: "Charles Jiang",
  // Default meta description for pages that don't set their own.
  tagline: "Student · Developer · Photographer",
  // Canonical origin, no trailing slash.
  url: "https://jiang6082.github.io",
  // Path prefix; empty for a <user>.github.io repository.
  base: "",
  email: "jiang5@uchicago.edu",
  // Homepage portrait, a file under src/photos.
  photo: "IMG_0339.jpg",
};

// Shown in the footer and on the résumé.
export const SOCIALS = [
  { name: "GitHub", icon: "github", url: "https://github.com/jiang6082" },
  {
    name: "LinkedIn",
    icon: "linkedin",
    url: "https://www.linkedin.com/in/charles-jiang5485",
  },
  { name: "Email", icon: "email", url: `mailto:${SITE.email}` },
];

export const GITHUB = {
  username: "jiang6082",
};

// Heathrow record (/photography/aviation/record). To make the page live,
// publish the Google Sheet's "Record" tab as CSV (File → Share → Publish to
// web → Record → Comma-separated values) and paste the link here. Empty =
// show src/data/heathrow-record.csv from the last build.
export const AVIATION = {
  recordSheetCsv: "",
};

// Cookieless visitor counts via GoatCounter (no consent banner needed).
// Create a site at https://www.goatcounter.com and put its code here, e.g.
// "charlesjiang" for charlesjiang.goatcounter.com. Empty = analytics off.
export const ANALYTICS = {
  goatCounter: "",
};
