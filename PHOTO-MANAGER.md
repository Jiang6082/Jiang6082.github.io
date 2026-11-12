# Managing photographs

There are two ways to add photos. Either way, the site shows each photo's camera, lens, focal length, aperture, shutter speed, ISO, and the nearest city in the photo viewer, and puts the photo on the map at `/photography/map`. Exact GPS coordinates are never stored: the place is snapped to the nearest city, and all metadata is stripped from the images that get committed.

For details to show up, the original file needs its metadata. When exporting from Photos, choose JPEG and keep location information. When AirDropping, open Options and turn on All Photos Data.

## From a folder

1. Put originals in `photos-src/` (ignored by Git). Subfolders are kept.
2. Run `npm run photos`. It resizes new photos into `src/photos/` and records their details in `src/data/photo-details.json`.
3. Add each new photo to an album in `src/data/photos.json` with an image description (`alt`), or use the manager below.

`npm run photos -- --details` records details without touching images. Use it to add details for photos that are already on the site by dropping their originals, with the same file names, into `photos-src/`. `--refresh` re-reads details that were already recorded. If a place name is wrong, edit it in `photo-details.json`.

HEIC files can't be resized here. Export them as JPEG first. `--details` can still read their metadata.

## With the photo manager

From this project folder, run `npm run photos:manage`, then open http://127.0.0.1:4322.

Choose an album and use **Add photographs** to upload JPEG, PNG, WebP, or AVIF files. Create an album first if you need one. Save any pending edits before uploading. Camera details and the nearest city are recorded on upload.

Use **Earlier / Later** to rearrange photographs, the album menu on each photograph to move it, and **Hide / Restore** to control visibility. **Save changes** applies your edits. Image descriptions provide accessible text; the public gallery does not show photo titles or captions.

The manager runs only on your computer. Changes appear in the local website preview, in the filmstrip, contact sheet, and map. They reach the public site only after the website is published. Keep the manager running while using it, and restart it with the same command when needed.

The catalog is `src/data/photos.json`; optimized uploads go into `src/photos/uploads/`. Original uploads and catalog backups are kept in `.photo-manager/`, which is excluded from Git. Back up that folder separately if you want to keep the originals on another computer. Hiding a photograph never deletes its file. Restoring a catalog backup is a manual recovery operation.
