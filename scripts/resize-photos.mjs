// Import original photos from photos-src/ into the site.
//
//   npm run photos                 resize new photos and record their details
//   npm run photos -- --details    only record details (don't touch images)
//   npm run photos -- --refresh    re-read details even if already recorded
//
// Images: max 2560 px on the long edge (never upscaled), re-encoded at
// quality ~85, all EXIF/GPS metadata stripped. Subfolders are preserved
// (photos-src/busan/x.jpg -> src/photos/busan/x.jpg). Files whose resized copy
// is already newer than the original are skipped.
//
// Details: camera, lens, focal length, aperture, shutter, ISO, and the
// nearest city go into src/data/photo-details.json (see photo-details.mjs).
// Exact GPS coordinates are never written anywhere in the repo.
//
// New photos still need to be added to an album in src/data/photos.json
// (or with `npm run photos:manage`) before they appear on the site.

import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { extractDetails, readDetails, writeDetails } from "./photo-details.mjs";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const SRC = path.join(root, "photos-src");
const OUT = path.join(root, "src", "photos");
const MAX_EDGE = 2560;
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff", ".heic"]);
const detailsOnly = process.argv.includes("--details");
const refresh = process.argv.includes("--refresh");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

if (!existsSync(SRC)) {
  console.error(`No photos-src/ folder found at ${SRC}. Create it and add photos.`);
  process.exit(1);
}

const details = await readDetails(root);
let resized = 0,
  skipped = 0,
  recorded = 0,
  failed = 0;

for await (const file of walk(SRC)) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTS.has(ext)) continue;

  const rel = path.relative(SRC, file);
  // Normalize output extension to .jpg (keep .png transparency as .png).
  const outExt = ext === ".png" ? ".png" : ".jpg";
  const outRel = rel.slice(0, -ext.length) + outExt;
  const key = outRel.split(path.sep).join("/");
  const outPath = path.join(OUT, outRel);

  if (refresh || !details[key]) {
    const found = await extractDetails(file);
    if (Object.keys(found).length) {
      details[key] = found;
      recorded++;
      const settings = [found.camera, found.place?.name].filter(Boolean).join(" · ");
      console.log(`ℹ ${rel}: ${settings || "settings recorded"}`);
    } else {
      console.log(`· ${rel}: no camera details or location in this file`);
    }
  }

  if (detailsOnly) continue;

  if (existsSync(outPath)) {
    const [s, o] = await Promise.all([stat(file), stat(outPath)]);
    if (o.mtimeMs >= s.mtimeMs) {
      skipped++;
      continue;
    }
  }

  try {
    await mkdir(path.dirname(outPath), { recursive: true });
    const pipeline = sharp(file)
      .rotate() // apply EXIF orientation, then drop metadata
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });

    if (outExt === ".png") await pipeline.png({ quality: 85 }).toFile(outPath);
    else await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(outPath);

    console.log(`✓ ${rel} -> src/photos/${outRel}`);
    resized++;
  } catch (error) {
    failed++;
    const hint =
      ext === ".heic"
        ? " HEIC can't be converted here; export it from Photos as JPEG."
        : "";
    console.error(`✗ ${rel}: ${error.message}.${hint}`);
  }
}

await writeDetails(root, details);

console.log(
  `\nDone. ${resized} resized, ${skipped} up-to-date, ${recorded} with new details${failed ? `, ${failed} failed` : ""}.`,
);
if (resized + skipped + recorded + failed === 0) {
  console.log("No images found in photos-src/. Add some and re-run.");
}
if (failed) process.exitCode = 1;
