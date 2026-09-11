import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { createManager } from "./photo-manager/server.mjs";
const root = await fs.mkdtemp(path.join(os.tmpdir(), "photo-manager-test-"));
await fs.mkdir(path.join(root, "src/data"), { recursive: true });
await fs.mkdir(path.join(root, "src/photos"), { recursive: true });
await fs.writeFile(
  path.join(root, "src/data/photos.json"),
  JSON.stringify({
    collections: [
      { id: "test", title: "Test", photos: [] },
      { id: "other", title: "Other", photos: [] },
    ],
    singles: [],
  }),
);
const server = await createManager(root);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  let current = await (await fetch(base + "/api/catalog")).json();
  const token = current.token;
  const post = (url, body, extra = {}) =>
    fetch(base + url, {
      method: "POST",
      headers: {
        Origin: base,
        "X-Manager-Token": token,
        "If-Match": current.revision,
        ...extra,
      },
      body,
    });
  assert.equal((await fetch(base)).status, 200);
  assert.equal(
    (await post("/api/save", "{}", { Origin: "https://example.com" })).status,
    403,
  );
  assert.equal(
    (await post("/api/save", "{}", { "X-Manager-Token": "bad" })).status,
    403,
  );
  const bytes = await sharp({
    create: { width: 20, height: 30, channels: 3, background: "#aabbcc" },
  })
    .png()
    .toBuffer();
  const originalRevision = current.revision;
  let response = await post("/api/upload?album=test", bytes);
  assert.equal(response.status, 200);
  current = await response.json();
  const photo = current.catalog.collections[0].photos[0];
  assert(photo.src.startsWith("uploads/"));
  assert.equal((await fetch(base + "/photo/" + photo.src)).status, 200);
  assert.equal(
    (
      await post("/api/save", JSON.stringify(current.catalog), {
        "If-Match": originalRevision,
      })
    ).status,
    409,
  );
  assert.equal(
    (await post("/api/upload?album=test", "not an image")).status,
    400,
  );
  const invalid = structuredClone(current.catalog);
  invalid.collections[0].photos[0].src = "../secret.jpg";
  assert.equal((await post("/api/save", JSON.stringify(invalid))).status, 400);
  photo.hidden = true;
  photo.alt = "Test description";
  current.catalog.collections[0].photos = [];
  current.catalog.collections[1].photos.push(photo);
  response = await post("/api/save", JSON.stringify(current.catalog));
  assert.equal(response.status, 200);
  current = await response.json();
  assert.equal(current.catalog.collections[1].photos[0].hidden, true);
  photo.hidden = false;
  current.catalog.collections[1].photos[0].hidden = false;
  response = await post("/api/save", JSON.stringify(current.catalog));
  assert.equal(response.status, 200);
  assert(
    (await fs.readdir(path.join(root, ".photo-manager/backups"))).length >= 3,
  );
  assert.equal(
    (await fs.readdir(path.join(root, ".photo-manager/originals"))).length,
    1,
  );
  console.log(
    "Passed: local manager page, upload and thumbnail, move/hide/restore, backups and original preservation, stale revision, bad token/origin, invalid image and traversal rejection.",
  );
} finally {
  await new Promise((resolve) => server.close(resolve));
}
