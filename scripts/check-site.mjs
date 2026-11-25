import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
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
  // Astro's redirect pages are a bare meta refresh with no heading.
  if (/<meta http-equiv="refresh"/i.test(html)) continue;
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
const projectIds = [
  "project-emberforge",
  "project-geld",
  "market-volatility-forecasting",
  "treasury-yield-curve-research",
  "poker",
  "idx-exchange",
];
for (const id of projectIds) assert(projects.includes(`id="${id}"`), `projects page: missing ${id}`);
assert(!projects.includes('id="Project-Olsen"'), "Olsen is no longer listed");
// Private repositories must never be linked from any page.
const privateRepos = ["Project-Olsen", "poker", "treasury-yield-curve-research"];
for (const file of htmls) {
  const html = readFileSync(file, "utf8");
  for (const repo of privateRepos)
    assert(
      !new RegExp(`github\\.com/Jiang6082/${repo}(?![\\w-])`, "i").test(html),
      `${file}: links to private repo ${repo}`,
    );
}
const gallery = readFileSync(join(root, "photography/index.html"), "utf8");
const serialized = gallery.match(
  /window\.__GALLERY__ = (\[[\s\S]*?\]);<\/script>/,
);
assert(serialized, "Gallery data must be available to the lightbox");
const groups = JSON.parse(serialized[1]);
assert.equal(groups.length, 1, "The viewer steps through every photograph");
const allPhotos = groups[0].items;
// One tile per photo, numbered in page order, each under its album.
const tiles = [...gallery.matchAll(/data-group="photographs" data-index="(\d+)"/g)].map((m) => Number(m[1]));
assert.deepEqual(tiles, allPhotos.map((_, i) => i), "Gallery tiles match the viewer, in order");
assert.equal(
  new Set(allPhotos.map((photo) => photo.full)).size,
  allPhotos.length,
  "Each photo appears once",
);
const albums = [...new Set(allPhotos.map((photo) => photo.album))];
for (const album of albums)
  assert(gallery.includes(`data-album="${album}"`), `album ${album} has a section`);
for (const photo of allPhotos)
  assert(photo.title && photo.alt, "Photographs need a title and description");
// The gallery is just the grid: no filmstrip, view switch, or counters.
for (const gone of ["filmstrip", "view-switch", "album-switch", "ph-stats"])
  assert(!gallery.includes(gone), `gallery no longer has ${gone}`);
assert(
  readFileSync(join(root, "photography-classic/index.html"), "utf8").includes("/photography/"),
  "/photography-classic redirects to the gallery",
);
console.log(
  `Passed: all ${projectIds.length} project anchors, private-link handling, ${allPhotos.length} photographs in ${albums.length} albums, ${htmls.length} pages and ${checked} local links/assets.`,
);
