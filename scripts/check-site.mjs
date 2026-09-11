import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { openingState } from "../src/lib/opening-motion.js";
const start = openingState(0),
  end = openingState(1);
assert.equal(start.active, 0);
assert.equal(start.copyOpacity, 1);
assert.equal(start.width, 38);
assert.equal(end.active, 2);
assert.equal(end.copyOpacity, 0);
assert.equal(end.width, 100);
assert.deepEqual(openingState(-1), start);
assert.deepEqual(openingState(2), end);
assert.equal(openingState(0.66).active, 1);
for (let i = 0; i <= 100; i++) {
  const state = openingState(i / 100);
  assert(state.left >= 0 && state.left + state.width <= 100);
  assert(state.top >= 0 && state.top + state.height <= 100);
  assert(state.opacities.every((x) => x >= 0 && x <= 1));
  if (i) assert(state.width >= openingState((i - 1) / 100).width);
}
const root = resolve("dist");
const list = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? list(p) : [p];
  });
const htmls = list(root).filter((p) => p.endsWith(".html"));
let checked = 0;
for (const file of htmls) {
  const html = readFileSync(file, "utf8");
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `${file}: exactly one h1`,
  );
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(raw)) continue;
    const [path, fragment] = raw.replaceAll("&amp;", "&").split("#");
    let target = path
      ? resolve(
          path.startsWith("/") ? root : dirname(file),
          "." + (path.startsWith("/") ? path : "/" + path),
        )
      : file;
    if (path && !path.startsWith("/"))
      target = resolve(dirname(file), path.split("?")[0]);
    if (existsSync(target) && statSync(target).isDirectory())
      target = join(target, "index.html");
    assert(existsSync(target), `${file}: missing ${raw}`);
    if (fragment && target.endsWith(".html"))
      assert(
        readFileSync(target, "utf8").includes(
          `id="${decodeURIComponent(fragment)}"`,
        ),
        `${file}: missing anchor ${raw}`,
      );
    checked++;
  }
}
const projects = readFileSync(join(root, "projects/index.html"), "utf8");
for (const id of [
  "project-emberforge",
  "project-geld",
  "market-volatility-forecasting",
  "Project-Olsen",
  "QJS",
])
  assert(projects.includes(`id="${id}"`));
assert(!projects.includes('href="https://github.com/Jiang6082/Project-Olsen"'));
const gallery = readFileSync(join(root, "photography/index.html"), "utf8");
const serialized = gallery.match(/window\.__GALLERY__ = (\[[\s\S]*?\]);<\/script>/);
assert(serialized, "Gallery data must be available to the lightbox");
const groups = JSON.parse(serialized[1]);
const allPhotos = groups[0].items;
const albumPhotos = groups.slice(1).flatMap(group => group.items);
assert.equal((gallery.match(/data-group="photographs"/g) || []).length, allPhotos.length);
assert.equal(new Set(albumPhotos.map(photo => photo.full)).size, allPhotos.length);
assert.equal(albumPhotos.length, allPhotos.length, "Each photo belongs to one album");
for (const group of groups.slice(1)) {
  assert(group.items.every(photo => `album-${photo.album}` === group.key));
  assert(gallery.includes(`data-album="${group.key.slice(6)}"`));
}
for (const photo of allPhotos) {
  assert(photo.title && photo.alt, "Photographs need a title and description");
  assert(albumPhotos.some(item => item.full === photo.full));
}
console.log(
  `Passed: scroll bounds, all 5 project anchors, private-link handling, ${allPhotos.length} photographs in ${groups.length - 1} albums, ${htmls.length} pages and ${checked} local links/assets.`,
);
