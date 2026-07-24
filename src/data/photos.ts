// ────────────────────────────────────────────────────────────────
//  Your photography.
//
//  Two kinds of things live here:
//   • collections — grouped sets (albums), shown in their own labeled row.
//   • singles     — standalone photos, shown in their own labeled row.
//
//  Photos are stored as image files under `src/photos/`. Set each entry's
//  `src` to the path *relative to src/photos*, e.g. "busan/bookshop1.jpg".
//  Astro reads the real dimensions from the file automatically (so the
//  justified grid is exact) and generates optimized WebP at build time.
//
//  Workflow to add photos:
//   1. Drop your originals into the `photos-src/` folder (any size — they're
//      git-ignored and never committed).
//   2. Run `npm run photos` to resize them into `src/photos/` (web-friendly,
//      EXIF stripped).
//   3. Add entries below pointing at the resized files.
//
//  Entries with no `src` (or a missing file) render as neutral placeholders,
//  so the layout is visible before you add real photos. `ar` sets a
//  placeholder's aspect ratio; real photos derive it from the file.
// ────────────────────────────────────────────────────────────────

export interface Photo {
  /** Path relative to src/photos, e.g. "busan/bookshop1.jpg". */
  src?: string;
  /** Short title shown in the lightbox (and on hover). */
  title?: string;
  /** Optional longer caption / comment shown under the title. */
  caption?: string;
  /** Alt text for accessibility (defaults to the title). */
  alt?: string;
  /** Placeholder-only aspect ratio (w/h). Ignored once `src` is set. */
  ar?: number;
  /** Force a neutral placeholder tile. */
  placeholder?: boolean;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  photos: Photo[];
}

// ── Albums / collections ────────────────────────────────────────
export const collections: Collection[] = [
  {
    id: "sample-trip",
    title: "A Trip Somewhere",
    description: "Placeholder album — replace with a real collection.",
    photos: [
      { title: "Arrival", caption: "The first evening.", ar: 1.5, placeholder: true },
      { title: "Old town", caption: "Wandering side streets.", ar: 0.67, placeholder: true },
      { title: "Golden hour", ar: 1.78, placeholder: true },
      { title: "Rooftops", caption: "The view from up high.", ar: 1.0, placeholder: true },
      { title: "Harbor", ar: 1.5, placeholder: true },
    ],
  },
  {
    id: "sample-street",
    title: "Street",
    description: "Placeholder album — candid moments around the city.",
    photos: [
      { title: "Crosswalk", ar: 0.67, placeholder: true },
      { title: "Neon", caption: "After the rain.", ar: 1.5, placeholder: true },
      { title: "Market", ar: 1.6, placeholder: true },
    ],
  },
];

// ── Standalone photos ───────────────────────────────────────────
export const singles: Photo[] = [
  { title: "Quiet morning", caption: "A calm start to the day.", ar: 1.5, placeholder: true },
  { title: "City lights", ar: 0.67, placeholder: true },
  { title: "On the trail", caption: "Somewhere off the map.", ar: 1.5, placeholder: true },
  { title: "Reflections", ar: 1.6, placeholder: true },
  { title: "Skyline", ar: 2.2, placeholder: true },
  { title: "Portrait", ar: 0.67, placeholder: true },
  { title: "Still life", ar: 1.0, placeholder: true },
];
