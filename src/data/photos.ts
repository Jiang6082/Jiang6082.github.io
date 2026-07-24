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
// None yet. To add an album later, push an entry like:
//   { id: "busan-2025", title: "Busan, 2025", description: "…",
//     photos: [{ src: "busan/gamcheon.jpg", title: "Petit Prince" }, …] }
export const collections: Collection[] = [];

// ── Standalone photos ───────────────────────────────────────────
// TITLES & CAPTIONS GO HERE — add `title` and/or `caption` to any entry.
// Both are optional and show in the fullscreen lightbox (title also appears
// on hover). Example:
//   { src: "IMG_0047.jpg", title: "Gamcheon Village", caption: "Busan, 2025" }
export const singles: Photo[] = [
  { src: "IMG_0047.jpg", title: "", caption: "" },
  { src: "IMG_0116.jpg", title: "", caption: "" },
  { src: "IMG_0298.jpg", title: "", caption: "" },
  { src: "IMG_0334.jpg", title: "", caption: "" },
  { src: "IMG_0460.jpg", title: "", caption: "" },
  { src: "IMG_0484.jpg", title: "", caption: "" },
  { src: "IMG_0534.jpg", title: "", caption: "" },
  { src: "IMG_0766.jpg", title: "", caption: "" },
  { src: "IMG_9433-2.jpg", title: "", caption: "" },
];
