// Builds public/og.jpg, the 1200×630 card shown when the site is shared on
// LinkedIn, iMessage, Slack, etc. Run `npm run og` after changing the
// portrait or the text below, then commit the new image.
//
// The fonts in scripts/og are static 400/500 instances of Schibsted Grotesk
// (SIL Open Font License), so the card renders the same on any machine.
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));
const font = { 400: here("./og/SchibstedGrotesk-400.ttf"), 500: here("./og/SchibstedGrotesk-500.ttf") };
const portrait = here("../src/photos/IMG_0339.jpg");
const output = here("../public/og.jpg");

const W = 1200;
const H = 630;
const PHOTO_W = 480;
const LEFT = 80;
const colors = { bg: "#f4f1e9", fg: "#252822", muted: "#66685e", accent: "#b43d28" };

async function text(markup, { size, weight = 400, width, spacing = 0 }) {
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${colors.fg}" letter_spacing="${Math.round(spacing * size * 1024)}">${markup}</span>`,
      font: `Schibsted Grotesk ${size}`,
      fontfile: font[weight],
      width,
      dpi: 72,
      rgba: true,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { input: data, height: info.height };
}

const photo = await sharp(portrait)
  .rotate()
  .resize(PHOTO_W, H, { fit: "cover", position: "centre" })
  .toBuffer();

const eyebrow = await text(
  `<span foreground="${colors.muted}">MATHEMATICS &amp; COMPUTER SCIENCE / UCHICAGO</span>`,
  { size: 19, spacing: 0.08 },
);
const name = await text(`Charles Jiang<span foreground="${colors.accent}">.</span>`, {
  size: 100,
  weight: 500,
  spacing: -0.04,
});
const tagline = await text(
  `<span foreground="${colors.muted}">Trading research, software engineering, and photography.</span>`,
  { size: 34, width: W - PHOTO_W - LEFT * 2, spacing: -0.01 },
);
const url = await text(`<span foreground="${colors.accent}">jiang6082.github.io</span>`, {
  size: 24,
});

await sharp({ create: { width: W, height: H, channels: 3, background: colors.bg } })
  .composite([
    { input: photo, left: W - PHOTO_W, top: 0 },
    { input: eyebrow.input, left: LEFT, top: 88 },
    { input: name.input, left: LEFT - 4, top: 200 },
    { input: tagline.input, left: LEFT, top: 200 + name.height + 28 },
    { input: url.input, left: LEFT, top: H - 88 - url.height },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(output);

console.log(`Wrote ${output}`);
