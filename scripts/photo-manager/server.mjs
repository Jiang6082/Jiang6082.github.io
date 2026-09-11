import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID, createHash } from "node:crypto";
import sharp from "sharp";
export async function createManager(
  root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."),
) {
  const catalogPath = path.join(root, "src/data/photos.json"),
    photoRoot = path.join(root, "src/photos");
  const token = randomUUID();
  let queue = Promise.resolve();
  const read = async () => {
    const raw = await fs.readFile(catalogPath, "utf8");
    return {
      catalog: JSON.parse(raw),
      revision: createHash("sha256").update(raw).digest("hex"),
    };
  };
  const save = async (catalog) => {
    await fs.mkdir(path.join(root, ".photo-manager/backups"), {
      recursive: true,
    });
    await fs.copyFile(
      catalogPath,
      path.join(
        root,
        ".photo-manager/backups",
        `${Date.now()}-${randomUUID()}.json`,
      ),
    );
    const tmp = catalogPath + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(catalog, null, 2) + "\n");
    await fs.rename(tmp, catalogPath);
  };
  const fail = (status, message) =>
    Object.assign(new Error(message), { status });
  async function validate(c) {
    if (
      !c ||
      !Array.isArray(c.collections) ||
      !Array.isArray(c.singles) ||
      c.collections.length > 100
    )
      throw fail(400, "Invalid albums");
    const ids = new Set(),
      photos = new Set();
    for (const a of c.collections) {
      if (
        !/^[a-z0-9-]{1,80}$/.test(a.id) ||
        ids.has(a.id) ||
        a.id === "singles" ||
        typeof a.title !== "string" ||
        !a.title.trim() ||
        a.title.length > 120 ||
        !Array.isArray(a.photos)
      )
        throw fail(400, "Invalid album");
      ids.add(a.id);
    }
    for (const p of [...c.collections.flatMap((a) => a.photos), ...c.singles]) {
      if (
        typeof p.src !== "string" ||
        !/^[\w/-]+\.(jpg|jpeg|png|webp|avif)$/i.test(p.src) ||
        p.src.includes("..") ||
        p.src.startsWith("/") ||
        photos.has(p.src)
      )
        throw fail(400, "Invalid or duplicate photo");
      photos.add(p.src);
      await fs.access(path.join(photoRoot, p.src));
      for (const k of ["title", "caption", "alt", "location", "date"])
        if (
          p[k] !== undefined &&
          (typeof p[k] !== "string" || p[k].length > 2000)
        )
          throw fail(400, "Invalid photo text");
      if (p.hidden !== undefined && typeof p.hidden !== "boolean")
        throw fail(400, "Invalid visibility");
    }
  }
  const server = http.createServer(async (req, res) => {
    const send = (status, data, type = "application/json") => {
      res.writeHead(status, {
        "Content-Type": type,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; frame-ancestors 'none'",
      });
      res.end(type === "application/json" ? JSON.stringify(data) : data);
    };
    try {
      const host = `127.0.0.1:${server.address().port}`;
      if (req.headers.host !== host)
        throw fail(403, "Use the local manager address");
      const url = new URL(req.url, `http://${host}`);
      if (req.method === "GET") {
        if (url.pathname === "/api/catalog")
          return send(200, { ...(await read()), token });
        if (url.pathname.startsWith("/photo/")) {
          const name = decodeURIComponent(url.pathname.slice(7));
          if (
            !/^[\w/-]+\.(jpg|jpeg|png|webp|avif)$/i.test(name) ||
            name.includes("..") ||
            name.startsWith("/")
          )
            throw fail(400, "Invalid photo");
          const thumb = await sharp(path.join(photoRoot, name))
            .resize({ width: 420, withoutEnlargement: true })
            .webp()
            .toBuffer();
          return send(200, thumb, "image/webp");
        }
        const files = {
          "/": "index.html",
          "/app.js": "app.js",
          "/style.css": "style.css",
        };
        if (files[url.pathname])
          return send(
            200,
            await fs.readFile(new URL(files[url.pathname], import.meta.url)),
            url.pathname.endsWith(".js")
              ? "text/javascript"
              : url.pathname.endsWith(".css")
                ? "text/css"
                : "text/html",
          );
        throw fail(404, "Not found");
      }
      if (
        req.method !== "POST" ||
        req.headers.origin !== `http://${host}` ||
        req.headers["x-manager-token"] !== token
      )
        throw fail(403, "Reload the manager to continue");
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 25 * 1024 * 1024)
          throw fail(413, "Each photo must be under 25 MB");
        chunks.push(chunk);
      }
      const body = Buffer.concat(chunks);
      const task = queue.then(async () => {
        const current = await read();
        if (req.headers["if-match"] !== current.revision)
          throw fail(409, "The collection changed. Reload before saving.");
        if (url.pathname === "/api/save") {
          const catalog = JSON.parse(body);
          await validate(catalog);
          await save(catalog);
        } else if (url.pathname === "/api/upload") {
          const album = current.catalog.collections.find(
            (a) => a.id === url.searchParams.get("album"),
          );
          if (!album) throw fail(400, "Choose an album first");
          const input = sharp(body, { limitInputPixels: 40000000 });
          const metadata = await input.metadata();
          if (
            !["jpeg", "png", "webp", "avif", "heif"].includes(
              metadata.format,
            ) ||
            metadata.pages > 1
          )
            throw fail(400, "Choose a still JPEG, PNG, WebP, or AVIF image");
          const id = randomUUID(),
            name = `uploads/${id}.jpg`;
          const output = await input
            .rotate()
            .resize({
              width: 2560,
              height: 2560,
              fit: "inside",
              withoutEnlargement: true,
            })
            .jpeg({ quality: 88 })
            .toBuffer();
          await fs.mkdir(path.join(photoRoot, "uploads"), { recursive: true });
          await fs.mkdir(path.join(root, ".photo-manager/originals"), {
            recursive: true,
          });
          await fs.writeFile(
            path.join(root, ".photo-manager/originals", id),
            body,
            { flag: "wx" },
          );
          await fs.writeFile(path.join(photoRoot, name), output, {
            flag: "wx",
          });
          album.photos.push({ src: name, alt: "Photograph", hidden: false });
          await save(current.catalog);
        } else throw fail(404, "Not found");
        return read();
      });
      queue = task.catch(() => {});
      send(200, await task);
    } catch (error) {
      send(error.status || 400, {
        error: error.status
          ? error.message
          : "Could not process this request. Check the file and try again.",
      });
    }
  });
  return server;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await createManager();
  server.listen(4322, "127.0.0.1", () =>
    console.log("Photo manager: http://127.0.0.1:4322"),
  );
}
