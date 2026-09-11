import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  sampleHomes,
  filterHomes,
  samplePValues,
  selectedHypotheses,
  sampleVolatility,
  forecastAt,
  qlike,
} from "../src/lib/project-demos.js";
assert.equal(filterHomes({}).total, 8);
assert.equal(filterHomes({ page: 99 }).page, 3);
assert.equal(filterHomes({ page: 99 }).rows.length, 2);
assert.equal(
  filterHomes({ city: "Portland", price: 300000, beds: 4 }).total,
  0,
);
assert.deepEqual(
  filterHomes({ city: "Chicago", beds: 2, sort: "desc" }).rows.map((h) => h.id),
  ["E", "D"],
);
assert.deepEqual(selectedHypotheses(samplePValues, 0.05, "bh"), [0, 1]);
assert.equal(selectedHypotheses(samplePValues, 0.05, "raw").length, 5);
assert.deepEqual(
  selectedHypotheses([0.02, 0.03, 0.9], 0.05, "bh"),
  [0, 1],
  "BH must retain all ranks through the largest passing rank, including an earlier failed rank",
);
assert.equal(selectedHypotheses(samplePValues, 0.01, "bh").length, 0);
for (const day of [20, 21, 30, 41])
  for (const window of [1, 5, 20]) {
    const forecast = forecastAt(sampleVolatility, day, window);
    const changed = sampleVolatility.map((v, i) => (i >= day ? v * 100 : v));
    assert.equal(
      forecastAt(changed, day, window),
      forecast,
      "Current/future target changes must not affect forecast",
    );
    assert(Number.isFinite(forecast) && forecast > 0);
  }
assert.equal(qlike(20, 20), 0);
assert(qlike(40, 20) > qlike(30, 20));
const world = readFileSync("dist/travel-world/index.html", "utf8");
const photos = JSON.parse(
  world.match(/id="room-data"[^>]*>([\s\S]*?)<\/script>/)[1],
);
for (const id of ["railway", "airfield", "coast", "garden", "streets"])
  assert(world.includes(`data-stop="${id}"`));
assert.equal(
  photos.filter((p) => p.destinations.includes("airfield")).length,
  0,
);
assert(photos.some((p) => p.destinations.includes("coast")));
assert(
  readFileSync("dist/photo-room/index.html", "utf8").includes("/travel-world/"),
);
for (const [slug, kind] of [
  ["idx-exchange", "homes"],
  ["geld", "costs"],
  ["volatility", "forecast"],
  ["emberforge", "factors"],
]) {
  const page = readFileSync(`dist/projects/${slug}/index.html`, "utf8");
  assert(page.includes(`data-demo="${kind}"`));
  assert(page.includes("Try the interactive demo"));
}
console.log(
  "Passed: search filtering/pagination/empty states, BH step-up cases, past-only forecasts, destination coverage, legacy route, and all four walkthrough demos.",
);
