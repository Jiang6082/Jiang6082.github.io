// ────────────────────────────────────────────────────────────────
//  Your photography gallery.
//
//  After uploading a photo to Cloudinary, copy its "Public ID" from the
//  Media Library and add an entry below. Set CLOUDINARY.cloudName in
//  src/config.ts first.
//
//  While you haven't set up Cloudinary yet, `placeholder: true` entries
//  render as neutral boxes so you can see the layout. Delete them once you
//  add real photos.
// ────────────────────────────────────────────────────────────────

export interface Photo {
  /** Cloudinary public ID, e.g. "portfolio/sunset_2024". */
  publicId: string;
  /** Alt text — describe the image for accessibility. */
  alt: string;
  /** Optional caption shown on hover / below the image. */
  caption?: string;
  /** Set true to render a grey placeholder box instead of a Cloudinary image. */
  placeholder?: boolean;
}

export const photos: Photo[] = [
  { publicId: "", alt: "Placeholder photo 1", caption: "Somewhere, sometime", placeholder: true },
  { publicId: "", alt: "Placeholder photo 2", caption: "Golden hour", placeholder: true },
  { publicId: "", alt: "Placeholder photo 3", caption: "City lights", placeholder: true },
  { publicId: "", alt: "Placeholder photo 4", caption: "On the trail", placeholder: true },
  { publicId: "", alt: "Placeholder photo 5", caption: "Quiet morning", placeholder: true },
  { publicId: "", alt: "Placeholder photo 6", caption: "Street scene", placeholder: true },
];
