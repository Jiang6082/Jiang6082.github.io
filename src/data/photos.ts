// ────────────────────────────────────────────────────────────────
//  Your photography.
//
//  Two kinds of things live here:
//   • collections — grouped sets (albums), shown in their own section.
//   • singles     — standalone photos, shown in a separate section.
//
//  Every photo can have a `title` and an optional `caption`, both shown
//  in the fullscreen lightbox (click a photo to open; use ← / → arrow
//  keys or the on-screen arrows to move between photos, Esc to close).
//
//  Real photos: set CLOUDINARY.cloudName in src/config.ts, upload to
//  Cloudinary, then put each image's Public ID in `publicId`.
//  Until then, `placeholder: true` entries render as neutral tiles so
//  you can see the layout. Delete them once you add real photos.
// ────────────────────────────────────────────────────────────────

export interface Photo {
  /** Cloudinary public ID, e.g. "portfolio/sunset_2024". */
  publicId: string;
  /** Short title shown in the lightbox. */
  title?: string;
  /** Optional longer caption / comment shown under the title. */
  caption?: string;
  /** Alt text for accessibility. */
  alt: string;
  /** Original pixel width/height — drives the justified (Google-Photos-style)
   *  row layout so photos keep their aspect ratio. Cloudinary shows these in
   *  the Media Library; if omitted, a default 3:2 ratio is assumed. */
  w?: number;
  h?: number;
  /** Render a neutral placeholder tile instead of a Cloudinary image. */
  placeholder?: boolean;
}

export interface Collection {
  /** URL-safe id, used internally. */
  id: string;
  title: string;
  /** Optional one-line description shown under the collection title. */
  description?: string;
  /** Photos in the album (first one is used as the cover unless `cover` set). */
  photos: Photo[];
  /** Optional explicit cover photo (defaults to photos[0]). */
  cover?: Photo;
}

// ── Albums / collections ────────────────────────────────────────
export const collections: Collection[] = [
  {
    id: "sample-trip",
    title: "A Trip Somewhere",
    description: "Placeholder album — replace with a real collection.",
    photos: [
      { publicId: "", alt: "Placeholder", title: "Arrival", caption: "The first evening.", w: 1600, h: 1067, placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Old town", caption: "Wandering side streets.", w: 1067, h: 1600, placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Golden hour", w: 1600, h: 900, placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Rooftops", caption: "The view from up high.", w: 1200, h: 1200, placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Harbor", w: 1600, h: 1067, placeholder: true },
    ],
  },
  {
    id: "sample-street",
    title: "Street",
    description: "Placeholder album — candid moments around the city.",
    photos: [
      { publicId: "", alt: "Placeholder", title: "Crosswalk", w: 1067, h: 1600, placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Neon", caption: "After the rain.", w: 1600, h: 1067, placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Market", w: 1600, h: 1000, placeholder: true },
    ],
  },
];

// ── Standalone photos ───────────────────────────────────────────
export const singles: Photo[] = [
  { publicId: "", alt: "Placeholder", title: "Quiet morning", caption: "A calm start to the day.", w: 1600, h: 1067, placeholder: true },
  { publicId: "", alt: "Placeholder", title: "City lights", w: 1067, h: 1600, placeholder: true },
  { publicId: "", alt: "Placeholder", title: "On the trail", caption: "Somewhere off the map.", w: 1600, h: 1067, placeholder: true },
  { publicId: "", alt: "Placeholder", title: "Reflections", w: 1600, h: 1000, placeholder: true },
  { publicId: "", alt: "Placeholder", title: "Skyline", w: 1600, h: 720, placeholder: true },
  { publicId: "", alt: "Placeholder", title: "Portrait", w: 1000, h: 1500, placeholder: true },
  { publicId: "", alt: "Placeholder", title: "Still life", w: 1200, h: 1200, placeholder: true },
];
