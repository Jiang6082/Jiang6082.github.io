import { CLOUDINARY } from "../config";

/**
 * Build a Cloudinary delivery URL for an uploaded image.
 *
 * `publicId` is the identifier Cloudinary gives an upload (e.g. "sunset_2024"
 * or "portfolio/sunset_2024" if you put it in a folder). You can see it in the
 * Media Library.
 *
 * Transforms default to a sensible optimized delivery:
 *   f_auto = best format for the browser (WebP/AVIF)
 *   q_auto = automatic quality
 *   c_limit = never upscale past the requested width
 */
export function cld(
  publicId: string,
  opts: { width?: number; height?: number; transform?: string } = {}
): string {
  const parts = ["f_auto", "q_auto"];
  if (opts.width) parts.push(`w_${opts.width}`, "c_limit");
  if (opts.height) parts.push(`h_${opts.height}`);
  if (opts.transform) parts.push(opts.transform);
  const t = parts.join(",");
  return `https://res.cloudinary.com/${CLOUDINARY.cloudName}/image/upload/${t}/${publicId}`;
}
