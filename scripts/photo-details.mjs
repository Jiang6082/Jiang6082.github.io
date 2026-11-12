// Camera settings and city-level location for photographs.
//
// Reads EXIF from an original file (or upload buffer), keeps only what the
// site shows, and snaps GPS to the nearest city so exact coordinates are
// never stored. Results live in src/data/photo-details.json, keyed by the
// photo's path under src/photos. Edit that file by hand to fix a place name.
import fs from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";

// Model codes that don't read well on their own.
const CAMERA_NAMES = {
  "ILCE-7M3": "Sony α7 III",
  "ILCE-7M4": "Sony α7 IV",
  "ILCE-7RM4": "Sony α7R IV",
  "ILCE-7RM4A": "Sony α7R IV",
  "ILCE-7RM5": "Sony α7R V",
  "ILCE-7C": "Sony α7C",
  "ILCE-7CM2": "Sony α7C II",
  "ILCE-7CR": "Sony α7CR",
  "ILCE-6400": "Sony α6400",
  "ILCE-6600": "Sony α6600",
  "ILCE-6700": "Sony α6700",
};

const MAKES = {
  "NIKON CORPORATION": "Nikon",
  "OLYMPUS IMAGING CORP.": "Olympus",
  "OLYMPUS CORPORATION": "Olympus",
  "OM DIGITAL SOLUTIONS": "OM System",
  FUJIFILM: "Fujifilm",
  SONY: "Sony",
  "LEICA CAMERA AG": "Leica",
  "RICOH IMAGING COMPANY, LTD.": "Ricoh",
  "PANASONIC": "Panasonic",
  SAMSUNG: "Samsung",
};

// Phones put the brand in the model name ("iPhone 15 Pro", "Pixel 8").
const PHONE_MAKES = /^(apple|google|samsung)$/i;

export function cameraName(make, model) {
  const rawMake = (make ?? "").trim();
  const rawModel = (model ?? "").trim();
  if (!rawModel) return rawMake || undefined;
  if (CAMERA_NAMES[rawModel]) return CAMERA_NAMES[rawModel];
  if (PHONE_MAKES.test(rawMake)) return rawModel;
  const brand = MAKES[rawMake.toUpperCase()] ?? rawMake;
  if (!brand || rawModel.toLowerCase().startsWith(brand.toLowerCase()))
    return rawModel;
  return `${brand} ${rawModel}`;
}

function lensName(lens, model) {
  const name = (lens ?? "").trim();
  if (!name || name === "----") return undefined;
  // Phones describe the lens as "<model> back camera 6.86mm f/1.78".
  if (model && name.toLowerCase().startsWith(String(model).toLowerCase()))
    return undefined;
  return name;
}

function shutter(seconds) {
  if (!seconds || !Number.isFinite(seconds)) return undefined;
  if (seconds >= 1) return String(Number(seconds.toFixed(1)));
  return `1/${Math.round(1 / seconds)}`;
}

let cityPool;
async function cities() {
  if (!cityPool) {
    const { default: all } = await import("all-the-cities");
    // Whole towns and cities only, not neighborhoods.
    cityPool = all.filter((c) => c.featureCode !== "PPLX" && c.population >= 10000);
  }
  return cityPool;
}

const regionName = new Intl.DisplayNames(["en"], { type: "region" });
const REGION_NAMES = { HK: "Hong Kong", MO: "Macau", KR: "South Korea", TW: "Taiwan" };

function distanceKm(lat1, lon1, lat2, lon2) {
  const rad = (d) => (d * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

// Nearest city within 60 km, nudged toward larger cities so a photo taken in
// a city's outskirts is labeled with the city rather than a suburb. Returns
// the city's own coordinates, rounded, never the photo's.
export async function nearestCity(lat, lon) {
  let best;
  for (const city of await cities()) {
    const [cityLon, cityLat] = city.loc.coordinates;
    if (Math.abs(cityLat - lat) > 1 || Math.abs(cityLon - lon) > 1.5) continue;
    const km = distanceKm(lat, lon, cityLat, cityLon);
    if (km > 60) continue;
    const score = km / (1 + Math.log10(city.population));
    if (!best || score < best.score) best = { score, city };
  }
  if (!best) return undefined;
  const { city } = best;
  const cityName = city.name.replace(/-(shi|ku|gun|machi|cho|chō)$/i, "");
  const country = REGION_NAMES[city.country] ?? regionName.of(city.country);
  const [cityLon, cityLat] = city.loc.coordinates;
  return {
    name: cityName === country ? cityName : `${cityName}, ${country}`,
    lat: Number(cityLat.toFixed(2)),
    lon: Number(cityLon.toFixed(2)),
  };
}

export async function extractDetails(input) {
  let tags;
  try {
    tags = await exifr.parse(input, { tiff: true, exif: true, gps: true });
  } catch {
    return {};
  }
  if (!tags) return {};
  const phone = PHONE_MAKES.test(String(tags.Make ?? "").trim());
  const focal = phone
    ? (tags.FocalLengthIn35mmFormat ?? tags.FocalLength)
    : (tags.FocalLength ?? tags.FocalLengthIn35mmFormat);
  const iso = Array.isArray(tags.ISO) ? tags.ISO[0] : tags.ISO;
  const details = {
    camera: cameraName(tags.Make, tags.Model),
    lens: lensName(tags.LensModel, tags.Model),
    focalLength: focal ? Math.round(focal) : undefined,
    aperture: tags.FNumber ? Number(tags.FNumber.toFixed(1)) : undefined,
    shutter: shutter(tags.ExposureTime),
    iso: iso || undefined,
    place:
      Number.isFinite(tags.latitude) && Number.isFinite(tags.longitude)
        ? await nearestCity(tags.latitude, tags.longitude)
        : undefined,
  };
  return Object.fromEntries(
    Object.entries(details).filter(([, value]) => value !== undefined && value !== ""),
  );
}

const detailsFile = (root) => path.join(root, "src/data/photo-details.json");

export async function readDetails(root) {
  try {
    return JSON.parse(await fs.readFile(detailsFile(root), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

export async function writeDetails(root, details) {
  const sorted = Object.fromEntries(
    Object.keys(details)
      .sort()
      .map((key) => [key, details[key]]),
  );
  const file = detailsFile(root);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file + ".tmp", JSON.stringify(sorted, null, 2) + "\n");
  await fs.rename(file + ".tmp", file);
}
