// Resize original photos from photos-src/ into src/photos/ for the web.
//
//   node scripts/resize-photos.mjs
//   (or: npm run photos)
//
// - Max 2560px on the long edge (never upscales).
// - Re-encodes JPEG/PNG at quality ~85; strips EXIF/GPS metadata.
// - Preserves subfolder structure (photos-src/busan/x.jpg -> src/photos/busan/x.jpg).
// - Skips files whose resized copy is already newer than the source.

import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(fileURLToPath(import.meta.url), "../..");
const SRC = path.join(root, "photos-src");
const OUT = path.join(root, "src", "photos");
const MAX_EDGE = 2560;
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff", ".heic"]);

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

let done = 0,
  skipped = 0;

for await (const file of walk(SRC)) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTS.has(ext)) continue;

  const rel = path.relative(SRC, file);
  // Normalize output extension to .jpg (keep .png transparency as .png).
  const outExt = ext === ".png" ? ".png" : ".jpg";
  const outRel = rel.slice(0, -ext.length) + outExt;
  const outPath = path.join(OUT, outRel);

  if (existsSync(outPath)) {
    const [s, o] = await Promise.all([stat(file), stat(outPath)]);
    if (o.mtimeMs >= s.mtimeMs) {
      skipped++;
      continue;
    }
  }

  await mkdir(path.dirname(outPath), { recursive: true });

  const pipeline = sharp(file)
    .rotate() // apply EXIF orientation, then drop metadata
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true });

  if (outExt === ".png") await pipeline.png({ quality: 85 }).toFile(outPath);
  else await pipeline.jpeg({ quality: 85, mozjpeg: true }).toFile(outPath);

  console.log(`✓ ${rel} -> src/photos/${outRel}`);
  done++;
}

console.log(`\nDone. ${done} resized, ${skipped} up-to-date.`);
if (done === 0 && skipped === 0) {
  console.log("No images found in photos-src/. Add some and re-run.");
}
