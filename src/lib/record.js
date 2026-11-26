// Heathrow record: which airline × aircraft-type pairs I've photographed.
// Shared by the build (first render) and the browser (live Google Sheet,
// filters), so the page renders the same either way.
import { parseCsv } from "./csv.js";

const yes = /^(true|yes|y|1|x|✓|✔)$/i;
const headerKey = (h) =>
  h.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

function heathrowStatus(value = "") {
  const v = value.trim().toLowerCase();
  if (v.startsWith("y")) return "Yes";
  if (v.startsWith("o") || v.startsWith("s")) return "Occasional";
  return "No";
}

/** Rows from the sheet or CSV; header names are matched loosely. */
export function parseRecord(text) {
  return parseCsv(text)
    .map((raw) => Object.fromEntries(Object.entries(raw).map(([k, v]) => [headerKey(k), v])))
    .filter((r) => r.airline && r.type)
    .map((r) => ({
      airline: r.airline,
      iata: r.iata ?? "",
      country: r.country ?? "",
      alliance: r.alliance && r.alliance !== "None" ? r.alliance : "Unaligned",
      manufacturer: r.manufacturer ?? "",
      family: r.family ?? "",
      type: r.type,
      atHeathrow: heathrowStatus(r.at_heathrow),
      arrivals: r.arrival_times ?? "",
      photographed: yes.test(r.photographed ?? ""),
      date: r.date ?? "",
      registration: (r.registration ?? "").toUpperCase(),
      notes: r.notes ?? "",
    }));
}

/**
 * Turn a manufacturer's model designation into the record's type label:
 * A380-841 → A380-800, A350-1041 → A350-1000, A320-251N → A320neo,
 * A321-271NX (LR) → A321LR,
 * 777-336ER → 777-300ER, 777-3DZER → 777-300ER, 737-8 → 737 MAX 8.
 * Labels that are already generic pass through unchanged.
 */
export function canonicalType(variant = "") {
  const v = variant.trim().toUpperCase().replace(/\s+/g, " ");
  let m;
  if ((m = v.match(/^A(31[89]|32[01])-\d{3}(N|NX|NY)?(?: ?\(?(LR|XLR)\)?)?$/))) {
    const base = `A${m[1]}`;
    if (m[2] === "NY" || m[3] === "XLR") return "A321XLR";
    if (m[3] === "LR") return "A321LR";
    return m[2] ? `${base}neo` : base;
  }
  if ((m = v.match(/^A(330|340|350|380)-(\d{1,2})\d{2}$/))) {
    const series = m[1] === "350" && m[2] === "10" ? "1000" : `${m[2]}00`;
    return `A${m[1]}-${series}`;
  }
  if (/^BD-500-1A10$/.test(v)) return "A220-100";
  if (/^BD-500-1A11$/.test(v)) return "A220-300";
  if ((m = v.match(/^737-(7|8|9|10)$/))) return `737 MAX ${m[1]}`;
  if ((m = v.match(/^737 MAX ?(7|8|9|10)$/))) return `737 MAX ${m[1]}`;
  if ((m = v.match(/^787-(8|9|10)$/))) return `787-${m[1]}`;
  if (/^747-8([0-9A-Z]{2})?(I|F)?$/.test(v)) return "747-8";
  if ((m = v.match(/^(7[0-7]7)-(\d)[0-9A-Z]{2}(ER|LR|F)?$/))) return `${m[1]}-${m[2]}00${m[3] ?? ""}`;
  return variant.trim();
}

// ICAO type designators, the codes spotters and flight trackers use.
const ICAO = {
  "A220-100": "BCS1", "A220-300": "BCS3", A319: "A319", A320: "A320", A320neo: "A20N",
  A321: "A321", A321neo: "A21N", A321LR: "A21N", A321XLR: "A21N", "A330-200": "A332",
  "A330-300": "A333", "A330-800": "A338", "A330-900": "A339", "A340-300": "A343",
  "A340-600": "A346", "A350-900": "A359", "A350-1000": "A35K", "A380-800": "A388",
  "717-200": "B712", "737-700": "B737", "737-800": "B738", "737-900": "B739",
  "737-900ER": "B739", "737 MAX 8": "B38M", "737 MAX 9": "B39M", "737 MAX 10": "B3XM",
  "747-400": "B744", "747-8": "B748", "757-200": "B752", "757-300": "B753",
  "767-300ER": "B763", "767-400ER": "B764", "777-200": "B772", "777-200ER": "B772",
  "777-200LR": "B77L", "777-300": "B773", "777-300ER": "B77W", "777-9": "B779",
  "787-8": "B788", "787-9": "B789", "787-10": "B78X", E170: "E170", E175: "E175",
  E190: "E190", E195: "E195", "E190-E2": "E290", "E195-E2": "E295", "ATR 72-500": "AT75",
  "ATR 72-600": "AT76", "Dash 8-400": "DH8D", CRJ900: "CRJ9", C919: "C919", ARJ21: "AJ27",
};
/** "A380-800" → "A388"; unknown types fall back to the label itself. */
export const icaoCode = (type = "") => ICAO[type] ?? type;

const same = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

/**
 * Group rows by airline and mark each type caught when the sheet says so or
 * the aviation logbook has a photo of that airline and type.
 * catches: [{ airline, type, date, registration }] with canonical types.
 */
export function buildRecord(rows, catches = []) {
  const airlines = new Map();
  for (const r of rows) {
    if (!airlines.has(r.airline))
      airlines.set(r.airline, {
        airline: r.airline,
        iata: r.iata,
        country: r.country,
        alliance: r.alliance,
        types: [],
      });
    const logged = catches.find((c) => same(c.airline, r.airline) && same(c.type, r.type));
    airlines.get(r.airline).types.push({
      type: r.type,
      family: r.family,
      manufacturer: r.manufacturer,
      atHeathrow: r.atHeathrow,
      arrivals: r.arrivals,
      caught: r.photographed || Boolean(logged),
      date: r.date || logged?.date || "",
      registration: r.registration || logged?.registration || "",
      notes: r.notes,
    });
  }
  return [...airlines.values()];
}

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const defaultState = { q: "", show: "all", scope: "heathrow", alliance: "all", sort: "az" };

/** Filter, count, and render the record as an HTML string. */
export function renderRecord(model, state = defaultState) {
  const inScope = (t) => state.scope === "fleet" || t.atHeathrow !== "No";
  const q = state.q.trim().toLowerCase();
  const order = { Yes: 0, Occasional: 1, No: 2 };
  const airlines = model
    .map((a) => ({ ...a, types: a.types.filter(inScope).sort((x, y) => order[x.atHeathrow] - order[y.atHeathrow]) }))
    .filter((a) => a.types.length);
  const stats = {
    types: airlines.reduce((n, a) => n + a.types.length, 0),
    caught: airlines.reduce((n, a) => n + a.types.filter((t) => t.caught).length, 0),
    airlines: airlines.length,
    started: airlines.filter((a) => a.types.some((t) => t.caught)).length,
    complete: airlines.filter((a) => a.types.every((t) => t.caught)).length,
  };

  let shown = airlines.filter(
    (a) =>
      (state.alliance === "all" || a.alliance === state.alliance) &&
      (!q ||
        [a.airline, a.iata, a.country, ...a.types.map((t) => t.type)].join(" ").toLowerCase().includes(q)),
  );
  shown = shown
    .map((a) => ({
      ...a,
      types: a.types.filter((t) => (state.show === "caught" ? t.caught : state.show === "missing" ? !t.caught : true)),
    }))
    .filter((a) => a.types.length);
  const progress = (a) => a.types.filter((t) => t.caught).length;
  const full = new Map(airlines.map((a) => [a.airline, a]));
  if (state.sort === "caught")
    shown.sort((a, b) => progress(full.get(b.airline)) - progress(full.get(a.airline)) || a.airline.localeCompare(b.airline));
  else if (state.sort === "progress") {
    const ratio = (a) => progress(full.get(a.airline)) / full.get(a.airline).types.length;
    shown.sort((a, b) => ratio(b) - ratio(a) || a.airline.localeCompare(b.airline));
  } else shown.sort((a, b) => a.airline.localeCompare(b.airline));

  const pad = (n) => String(n).padStart(2, "0");
  const html = shown
    .map((shownAirline, row) => {
      const a = full.get(shownAirline.airline);
      const got = progress(a);
      const pct = Math.round((got / a.types.length) * 100);
      const cells = shownAirline.types
        .map((t, col) => {
          const classes = ["as-cell", t.caught && "is-caught", t.atHeathrow === "Occasional" && "is-occasional", t.atHeathrow === "No" && "is-elsewhere"]
            .filter(Boolean)
            .join(" ");
          const status = t.caught
            ? ["Photographed", t.date, t.registration].filter(Boolean).join(" · ")
            : t.atHeathrow === "Occasional"
              ? "Occasional at Heathrow"
              : t.atHeathrow === "No"
                ? "Not usually at Heathrow"
                : "Not photographed yet";
          const detail = t.arrivals && t.atHeathrow !== "No" ? `${status}. Usual arrivals: ${t.arrivals}` : status;
          return `<li class="${classes}" style="--r:${row};--c:${col}" title="${esc(`${t.type}: ${detail}`)}"><b>${esc(icaoCode(t.type))}</b><span>${esc(t.type)}</span><span class="sr-only">, ${esc(detail.toLowerCase())}</span></li>`;
        })
        .join("");
      return `<section class="as-row${got === a.types.length ? " is-complete" : ""}">
  <div class="as-row-head">
    <span class="ph-tile">${esc(a.iata || "—")}</span>
    <div class="as-row-name"><h2>${esc(a.airline)}</h2><p>${esc([a.country, a.alliance].filter(Boolean).join(" · "))}</p></div>
    <p class="as-row-progress"><span class="as-row-count">${pad(got)}<span> / ${pad(a.types.length)}</span></span><span class="as-bar" aria-hidden="true"><span style="width:${pct}%"></span></span></p>
  </div>
  <ul class="as-cells">${cells}</ul>
</section>`;
    })
    .join("\n");
  return { html: html || `<p class="ph-empty">Nothing matches. Clear a filter or the search.</p>`, stats, shown: shown.length };
}
