// Checks the aviation logbook data and page. Run after a build.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { parseCsv } from "../src/lib/csv.js";

const rows = parseCsv(readFileSync("src/data/aviation.csv", "utf8"));
const required = ["file", "registration", "airline", "manufacturer", "family", "variant", "date", "airport"];
const airframes = new Map();
for (const [i, row] of rows.entries()) {
  const where = `aviation.csv row ${i + 1}`;
  for (const key of required) assert(row[key], `${where}: ${key} is required`);
  assert(existsSync(`src/photos/${row.file}`), `${where}: no photo at src/photos/${row.file}`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(row.date), `${where}: date must be YYYY-MM-DD`);
  assert(/^[A-Z0-9]{3}$/i.test(row.airport), `${where}: airport should be an IATA code like LHR`);
  const reg = row.registration.toUpperCase();
  const seen = airframes.get(reg);
  if (seen)
    for (const key of ["airline", "manufacturer", "variant"])
      assert.equal(row[key], seen[key], `${where}: ${reg} has a different ${key} in another row`);
  else airframes.set(reg, row);
}
assert.equal(new Set(rows.map((r) => r.file)).size, rows.length, "each photo appears once");

const page = readFileSync("dist/photography/aviation/index.html", "utf8");
const cards = [...page.matchAll(/data-reg="([^"]+)"/g)].map((m) => m[1]);
assert.equal(cards.length, airframes.size, "one card per airframe");
assert.deepEqual(new Set(cards), new Set(airframes.keys()));
const groups = JSON.parse(page.match(/window\.__GALLERY__ = (\[[\s\S]*?\]);<\/script>/)[1]);
assert.equal(groups.reduce((n, g) => n + g.items.length, 0), rows.length, "every photo opens in the viewer");
for (const g of groups)
  for (const item of g.items) {
    assert(existsSync(`dist${item.full}`), `missing ${item.full}`);
    assert(item.heading && item.place, `${g.title}: viewer needs a heading and place`);
  }
const airlines = new Set(rows.map((r) => r.airline));
assert.equal((page.match(/<section class="av-group"/g) || []).length, airlines.size, "no-JS view groups by airline");
const sample = rows.some((r) => /^(yes|true|1)$/i.test(r.sample));
assert.equal(page.includes('class="ph-notice"'), sample, "demo notice shows only while sample rows exist");

console.log(
  `Passed: ${rows.length} aviation photos, ${airframes.size} airframes, ${airlines.size} airlines, viewer details, and grouping.`,
);
