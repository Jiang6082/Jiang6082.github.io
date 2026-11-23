// Checks the Heathrow record data and page. Run after a build.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseCsv } from "../src/lib/csv.js";
import { parseRecord, buildRecord, canonicalType } from "../src/lib/record.js";

const text = readFileSync("src/data/heathrow-record.csv", "utf8");
const header = text.split("\n")[0];
for (const col of ["airline", "iata", "alliance", "type", "at_heathrow", "arrival_times", "photographed"])
  assert(header.split(",").includes(col), `heathrow-record.csv: missing column ${col}`);

const raw = parseCsv(text);
const rows = parseRecord(text);
assert.equal(rows.length, raw.length, "every row needs an airline and a type");
const seen = new Set();
const airlines = new Map();
for (const [i, r] of raw.entries()) {
  const where = `heathrow-record.csv row ${i + 2}`;
  assert(["Yes", "Occasional", "No"].includes(r.at_heathrow), `${where}: at_heathrow must be Yes, Occasional, or No`);
  assert(/^(TRUE|FALSE)$/i.test(r.photographed), `${where}: photographed must be TRUE or FALSE`);
  const key = `${r.airline}|${r.type}`;
  assert(!seen.has(key), `${where}: ${r.airline} ${r.type} is listed twice`);
  seen.add(key);
  const a = airlines.get(r.airline);
  if (a) assert.deepEqual([r.iata, r.alliance], a, `${where}: ${r.airline} details differ between rows`);
  else airlines.set(r.airline, [r.iata, r.alliance]);
}

const cases = {
  "A380-841": "A380-800",
  "A350-1041": "A350-1000",
  "A330-343": "A330-300",
  "A320-251N": "A320neo",
  "A321-271NX": "A321neo",
  "777-336ER": "777-300ER",
  "777-3DZER": "777-300ER",
  "787-10": "787-10",
  "737-8": "737 MAX 8",
  "737-8AS": "737-800",
  "747-830": "747-8",
};
for (const [variant, type] of Object.entries(cases)) assert.equal(canonicalType(variant), type, variant);

// Logbook photos tick the matching airline/type in the record.
const logbook = parseCsv(readFileSync("src/data/aviation.csv", "utf8"));
const catches = logbook.map((s) => ({ airline: s.airline, type: canonicalType(s.variant) }));
const model = buildRecord(rows, catches);
for (const c of catches) {
  const airline = model.find((a) => a.airline === c.airline);
  const t = airline?.types.find((x) => x.type === c.type);
  if (t) assert(t.caught, `${c.airline} ${c.type} is in the logbook but not ticked`);
}

const page = readFileSync("dist/photography/aviation/record/index.html", "utf8");
const heathrowAirlines = new Set(rows.filter((r) => r.atHeathrow !== "No").map((r) => r.airline));
assert.equal((page.match(/class="rec-airline/g) || []).length, heathrowAirlines.size, "one section per Heathrow airline");
console.log(
  `Passed: ${rows.length} record rows, ${airlines.size} airlines, ${rows.filter((r) => r.atHeathrow !== "No").length} Heathrow types, type matching, and logbook ticks.`,
);
