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
      { publicId: "", alt: "Placeholder", title: "Arrival", caption: "The first evening.", placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Old town", caption: "Wandering side streets.", placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Golden hour", placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Rooftops", caption: "The view from up high.", placeholder: true },
    ],
  },
  {
    id: "sample-street",
    title: "Street",
    description: "Placeholder album — candid moments around the city.",
    photos: [
      { publicId: "", alt: "Placeholder", title: "Crosswalk", placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Neon", caption: "After the rain.", placeholder: true },
      { publicId: "", alt: "Placeholder", title: "Market", placeholder: true },
    ],
  },
];

// ── Standalone photos ───────────────────────────────────────────
export const singles: Photo[] = [
  { publicId: "", alt: "Placeholder", title: "Quiet morning", caption: "A calm start to the day.", placeholder: true },
  { publicId: "", alt: "Placeholder", title: "City lights", placeholder: true },
  { publicId: "", alt: "Placeholder", title: "On the trail", caption: "Somewhere off the map.", placeholder: true },
  { publicId: "", alt: "Placeholder", title: "Reflections", placeholder: true },
  { publicId: "", alt: "Placeholder", title: "Skyline", placeholder: true },
];
