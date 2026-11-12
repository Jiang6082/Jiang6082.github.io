import raw from "./photo-details.json";
// Written by `npm run photos` and the photo manager; see scripts/photo-details.mjs.
// Places are city-level: the coordinates are the city's, not the photo's.

export interface Place {
  name: string;
  lat: number;
  lon: number;
}
export interface PhotoDetails {
  camera?: string;
  lens?: string;
  focalLength?: number;
  aperture?: number;
  shutter?: string;
  iso?: number;
  place?: Place;
}

const all = raw as Record<string, PhotoDetails>;

export function detailsFor(src?: string): PhotoDetails {
  return (src && all[src]) || {};
}

/** "Sony α7 IV · FE 35mm F1.8 · 35 mm · ƒ/1.8 · 1/250 s · ISO 100" */
export function settingsLine(d: PhotoDetails): string {
  return [
    d.camera,
    d.lens,
    d.focalLength && `${d.focalLength} mm`,
    d.aperture && `ƒ/${d.aperture}`,
    d.shutter && `${d.shutter} s`,
    d.iso && `ISO ${d.iso}`,
  ]
    .filter(Boolean)
    .join(" · ");
}
