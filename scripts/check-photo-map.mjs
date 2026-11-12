// Checks photo details, the photo map, and the redirects to it. Run after a build.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const details = JSON.parse(readFileSync("src/data/photo-details.json", "utf8"));
const catalog = JSON.parse(readFileSync("src/data/photos.json", "utf8"));
const visible = [
  ...catalog.collections.flatMap((c) => c.photos),
  ...catalog.singles,
].filter((p) => !p.hidden && p.src);

const decimals = (n) => (String(n).split(".")[1] ?? "").length;
for (const [src, d] of Object.entries(details)) {
  assert(existsSync(`src/photos/${src}`), `photo-details.json: no such photo ${src}`);
  if (d.place) {
    assert(d.place.name, `${src}: place needs a name`);
    assert(
      decimals(d.place.lat) <= 2 && decimals(d.place.lon) <= 2,
      `${src}: place must be city-level (at most 2 decimal places)`,
    );
  }
}

const map = readFileSync("dist/photography/map/index.html", "utf8");
const pins = JSON.parse(map.match(/id="map-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
const placed = visible.filter((p) => details[p.src]?.place);
const names = new Set(placed.map((p) => details[p.src].place.name));
assert.equal(pins.length, names.size, "one pin per place");
assert.equal(
  pins.reduce((sum, pin) => sum + pin.count, 0),
  placed.length,
  "every located photo is on the map",
);
for (const pin of pins) assert(existsSync(`dist${pin.thumb}`), `missing pin image ${pin.thumb}`);
assert(placed.length === 0 || map.includes('id="photo-map"'), "map container rendered");

const gallery = readFileSync("dist/photography/index.html", "utf8");
const items = JSON.parse(
  gallery.match(/window\.__GALLERY__ = (\[[\s\S]*?\]);<\/script>/)[1],
)[0].items;
const withSettings = visible.filter((p) => details[p.src]?.camera || details[p.src]?.aperture);
assert.equal(
  items.filter((item) => item.settings).length,
  withSettings.length,
  "viewer shows settings for every photo that has them",
);

for (const old of ["travel-world", "photo-room"])
  assert(
    readFileSync(`dist/${old}/index.html`, "utf8").includes("/photography/map/"),
    `/${old} redirects to the map`,
  );
assert(!/"lat":\s*-?\d+\.\d{3,}/.test(map), "no precise coordinates on the map page");

console.log(
  `Passed: ${Object.keys(details).length} photo details, ${pins.length} places for ${placed.length} located photos, viewer settings, and map redirects.`,
);
