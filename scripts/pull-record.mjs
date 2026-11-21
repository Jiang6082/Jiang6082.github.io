// Copies the published Google Sheet (the Heathrow record) into
// src/data/heathrow-record.csv, so the next site update ships the latest
// ticks even for visitors without JavaScript.
//
//   npm run record:pull                 uses AVIATION.recordSheetCsv in src/config.ts
//   npm run record:pull -- <csv-url>    or pass the published CSV link directly
import { readFileSync, writeFileSync } from "node:fs";
import { parseRecord } from "../src/lib/record.js";

const config = readFileSync("src/config.ts", "utf8");
const url = process.argv[2] ?? config.match(/recordSheetCsv:\s*"([^"]*)"/)?.[1];
if (!url) {
  console.error("No sheet link. Set AVIATION.recordSheetCsv in src/config.ts or pass the link.");
  process.exit(1);
}
const response = await fetch(url);
if (!response.ok) {
  console.error(`The sheet didn't download (HTTP ${response.status}). Is it published to the web as CSV?`);
  process.exit(1);
}
const text = (await response.text()).replace(/\r\n/g, "\n");
const rows = parseRecord(text);
if (!rows.length) {
  console.error("The sheet has no rows with an airline and a type. Check you published the Record tab.");
  process.exit(1);
}
writeFileSync("src/data/heathrow-record.csv", text.endsWith("\n") ? text : `${text}\n`);
const ticked = rows.filter((r) => r.photographed).length;
console.log(`Saved ${rows.length} rows (${ticked} ticked) to src/data/heathrow-record.csv.`);
