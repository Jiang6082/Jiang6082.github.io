# Managing photographs

From this project folder, run `npm run photos:manage`, then open http://127.0.0.1:4322.

Choose an album and use **Add photographs** to upload JPEG, PNG, WebP, or AVIF files. Create an album first if you need one. Save any pending edits before uploading.

Use **Earlier / Later** to rearrange photographs, the album menu on each photograph to move it, and **Hide / Restore** to control visibility. **Save changes** applies your edits. Image descriptions provide accessible text; the public gallery does not show photo titles or captions.

The manager runs only on your computer. Changes appear in the local website preview, including both the filmstrip and 3D travel world; they reach the public site only after the website is published. Keep the manager running while using it. Restart it with the same command when needed.

The catalog is `src/data/photos.json`; optimized uploads go into `src/photos/uploads/`. Original uploads and catalog backups are kept in `.photo-manager/`, which is excluded from Git. Back up that folder separately if you want to preserve the originals on another computer. Hiding a photograph never deletes its file. Restoring a catalog backup is a manual recovery operation.
