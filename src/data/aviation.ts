import raw from "./aviation.csv?raw";
import { parseCsv } from "../lib/csv.js";
import recordCsv from "./heathrow-record.csv?raw";
import { canonicalType, icaoCode, parseRecord } from "../lib/record.js";
import { detailsFor, settingsLine } from "./photo-details";
// The aviation logbook: one CSV row per photo, grouped here into airframes
// (one per registration). Camera settings come from photo-details.json.

export interface Spot {
  file: string;
  registration: string;
  airline: string;
  manufacturer: string;
  family: string;
  variant: string;
  /** "Airbus A380-841" */
  type: string;
  date: string;
  airport: string;
  runway: string;
  movement: string;
  flight: string;
  route: string;
  livery: string;
  name: string;
  spot: string;
  sample: boolean;
  settings: string;
}

export interface Airframe {
  key: string;
  /** IATA airline code, e.g. "BA". */
  iata: string;
  /** ICAO type designator, e.g. "A388". */
  icao: string;
  registration: string;
  airline: string;
  manufacturer: string;
  family: string;
  variant: string;
  type: string;
  /** Newest first. */
  spots: Spot[];
  latest: string;
  livery: string;
  name: string;
  sample: boolean;
}

const AIRPORTS: Record<string, string> = {
  LHR: "London Heathrow",
  LGW: "London Gatwick",
  LCY: "London City",
  STN: "London Stansted",
  ORD: "Chicago O’Hare",
  MDW: "Chicago Midway",
  JFK: "New York JFK",
  HKG: "Hong Kong",
  CAN: "Guangzhou Baiyun",
  PVG: "Shanghai Pudong",
  PEK: "Beijing Capital",
};
export const airportName = (code: string) => AIRPORTS[code] ?? code;

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const rows = parseCsv(raw) as Record<string, string>[];

// Airline codes come from the Heathrow record, matched by name.
const iataByAirline = new Map(
  parseRecord(recordCsv).map((r: { airline: string; iata: string }) => [r.airline.toLowerCase(), r.iata]),
);
// Operators that fly under another airline's brand at Heathrow. The logbook
// names the operator; the Heathrow record counts the photo for the brand.
const BRANDS: Record<string, { brand: string; iata: string }> = {
  "lufthansa city airlines": { brand: "Lufthansa", iata: "VL" },
};
export const iataFor = (airline: string) =>
  BRANDS[airline.toLowerCase()]?.iata ?? iataByAirline.get(airline.toLowerCase()) ?? airline.slice(0, 2).toUpperCase();
const brandFor = (airline: string) => BRANDS[airline.toLowerCase()]?.brand ?? airline;

export const spots: Spot[] = rows.map((r) => ({
  file: r.file,
  registration: r.registration.toUpperCase(),
  airline: r.airline,
  manufacturer: r.manufacturer,
  family: r.family,
  variant: r.variant,
  type: [r.manufacturer, r.variant].filter(Boolean).join(" "),
  date: r.date,
  airport: r.airport.toUpperCase(),
  runway: r.runway,
  movement: r.movement,
  flight: r.flight,
  route: r.route,
  livery: r.livery,
  name: r.name,
  spot: r.spot,
  sample: /^(yes|true|1)$/i.test(r.sample),
  settings: settingsLine(detailsFor(r.file)),
}));

const byReg = new Map<string, Spot[]>();
for (const s of spots) byReg.set(s.registration, [...(byReg.get(s.registration) ?? []), s]);

export const airframes: Airframe[] = [...byReg.values()].map((list) => {
  const sorted = [...list].sort((a, b) => b.date.localeCompare(a.date));
  const [first] = sorted;
  return {
    key: `airframe-${slug(first.registration)}`,
    iata: iataFor(first.airline),
    icao: icaoCode(canonicalType(first.variant)),
    registration: first.registration,
    airline: first.airline,
    manufacturer: first.manufacturer,
    family: first.family,
    variant: first.variant,
    type: first.type,
    spots: sorted,
    latest: first.date,
    livery: sorted.find((s) => s.livery)?.livery ?? "",
    name: sorted.find((s) => s.name)?.name ?? "",
    sample: sorted.some((s) => s.sample),
  };
});

/** "London Heathrow (LHR) · 27L arrival · 14 Nov 2026" */
export function spotLine(s: Spot) {
  const movement = [s.runway, s.movement.toLowerCase()].filter(Boolean).join(" ");
  return [
    s.airport && `${airportName(s.airport)} (${s.airport})`,
    movement,
    formatDate(s.date),
  ]
    .filter(Boolean)
    .join(" · ");
}

/** "BA178 · New York JFK → London Heathrow · from Myrtle Avenue" */
export function noteLine(s: Spot) {
  return [
    s.flight,
    s.route,
    s.livery,
    s.name && `“${s.name}”`,
    s.spot && `from ${s.spot}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** Logbook photos as Heathrow-record catches (airline + generic type). */
export const catches = spots.map((s) => ({
  airline: brandFor(s.airline),
  type: canonicalType(s.variant),
  date: formatDate(s.date),
  registration: s.registration,
  sample: s.sample,
}));
