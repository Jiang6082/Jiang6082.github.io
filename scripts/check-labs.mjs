import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { callValue, normalCDF } from "../src/lib/black-scholes.js";
// Independent published example: MathWorks, S=100 K=95 T=.25 sigma=.5 r=.01.
assert(
  Math.abs(callValue(100, 95, 0.25, 0.5, 0.01) - 12.52792339252145) < 0.00002,
);
assert(
  Math.abs(callValue(100, 100, 1, 0.2, 0.05) - 10.4505835721856) < 0.00002,
);
assert(Math.abs(normalCDF(0) - 0.5) < 1e-8);
for (const sigma of [0.05, 0.25, 0.8])
  for (const time of [0, 0.01, 1, 2]) {
    let prior = -1;
    for (let spot = 60; spot <= 140; spot++) {
      const v = callValue(spot, 100, time, sigma, 0.04);
      assert(Number.isFinite(v) && v >= 0 && v <= spot);
      assert(v + 1e-8 >= prior, "Call value must be monotone in spot");
      prior = v;
      assert(v + 1e-6 >= Math.max(spot - 100 * Math.exp(-0.04 * time), 0));
      if (time === 0) assert.equal(v, Math.max(spot - 100, 0));
    }
  }
assert.equal(callValue(110, 100, 1, 0, 0), 10);
assert.throws(() => callValue(0, 100, 1, 0.25, 0.04), RangeError);
const html = (p) => readFileSync(`dist/${p}/index.html`, "utf8");
const room = html("travel-world"),
  gallery = html("photography"),
  resume = html("resume");
const photos = JSON.parse(
  room.match(/id="room-data"[^>]*>([\s\S]*?)<\/script>/)[1],
);
assert.equal(
  photos.length,
  (gallery.match(/data-group="photographs"/g) || []).length,
);
for (const p of photos) {
  assert(p.alt && p.aspect > 0);
  for (const path of [p.thumb, p.texture, p.full])
    assert(existsSync(`dist${path}`));
}
assert(room.includes('id="start-room" hidden'));
assert(html("options-lab").includes('id="start-surface" hidden'));
assert(
  !/Leadership|Achievements|Quant Trading Group|I build research tools/.test(
    resume,
  ),
);
assert(!existsSync("dist/projects/qjs"));
const publicPages = [
  "dist/index.html",
  "dist/projects/index.html",
  "dist/resume/index.html",
  "dist/sitemap-0.xml",
];
for (const p of publicPages)
  assert(!/\bQJS\b|\/projects\/qjs/.test(readFileSync(p, "utf8")));
for (const name of ["travel-world", "options-lab"]) {
  const page = html(name);
  assert(
    !/<link[^>]+rel="modulepreload"[^>]+scene\./.test(page),
    "3D engine must not be preloaded",
  );
}
const files = readdirSync("dist/_astro");
for (const prefix of ["travel-world.astro_", "options-lab.astro_"]) {
  const script = readFileSync(
    "dist/_astro/" +
      files.find((f) => f.startsWith(prefix) && f.endsWith(".js")),
    "utf8",
  );
  assert(script.includes("import("), "3D code must load only after activation");
}
console.log(
  "Passed: independent option prices, 972 model boundary/monotonicity cases, photo-room catalog/assets, lazy 3D loading, hidden entry controls, and requested public removals.",
);
