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

## Aviation logbook

The Aviation page (`/photography/aviation`) is a spotter's logbook: one card per airframe (registration), grouped by airline, with search, filters, and sorting.

1. Put originals in `photos-src/aviation/` and run `npm run photos`. This resizes them into `src/photos/aviation/` and records their camera settings.
2. Add one row per photo to `src/data/aviation.csv`. Any spreadsheet app can open and save it. Required columns: `file` (e.g. `aviation/IMG_1234.jpg`), `registration`, `airline`, `manufacturer`, `family` (used for the Aircraft filter, e.g. `A350`, `787`), `variant` (e.g. `A350-1041`), `date` (`YYYY-MM-DD`), and `airport` (IATA code, e.g. `LHR`). Optional columns: `runway`, `movement`, `flight`, `route`, `livery`, `name`, and `spot`. Blank optional columns simply don't show.
3. More photos of the same registration join that airframe's card automatically.

The demo rows are marked `sample=yes` and use `src/photos/aviation/sample-*.jpg`. Delete both once real photos are in, and the demo banner disappears. `node scripts/check-aviation.mjs` (part of `npm run check`) catches missing photos, bad dates, and a registration listed with two different airlines or types.

## Heathrow record

`/photography/aviation/record` is a checklist of every airline at Heathrow and the aircraft types it flies, with a tick for each type you've photographed. It reads `src/data/heathrow-record.csv`, or your Google Sheet once that's set up.

- **Ticking:** set `photographed` to TRUE (a checkbox in Google Sheets). Logbook photos also tick the matching airline and type automatically. Model codes like `A350-1041` or `777-336ER` match the record's `A350-1000` and `777-300ER`.
- **Going live:** in Google Sheets, File → Share → Publish to web → the Record tab → Comma-separated values. Paste the link into `src/config.ts` as `AVIATION.recordSheetCsv`. The page then loads the sheet whenever someone opens it.
- **Snapshot:** `npm run record:pull` copies the published sheet into `src/data/heathrow-record.csv`, so the next site update matches it even without JavaScript.
- Keep the Record tab's column headers. `node scripts/check-record.mjs` (part of `npm run check`) validates the file.
