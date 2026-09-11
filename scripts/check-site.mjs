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
assert.equal(
  (
    readFileSync(join(root, "photography/index.html"), "utf8").match(
      /data-group="photographs"/g,
    ) || []
  ).length,
  9,
);
console.log(
  `Passed: scroll bounds, reverse playback, all 5 project anchors, private-link handling, 9 photographs, ${htmls.length} pages and ${checked} local links/assets.`,
);
