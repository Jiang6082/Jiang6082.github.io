let catalog,
  revision,
  token,
  dirty = false,
  busy = false,
  selected = "";
const $ = (id) => document.getElementById(id),
  status = (text) => ($("status").textContent = text);
const changed = () => {
  dirty = true;
  $("save").disabled = false;
  status("Unsaved changes");
};
async function request(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "X-Manager-Token": token, "If-Match": revision },
    body,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  catalog = data.catalog;
  revision = data.revision;
}
async function load() {
  const response = await fetch("/api/catalog");
  if (!response.ok) throw new Error("Could not open collection");
  ({ catalog, revision, token } = await response.json());
  dirty = false;
  render();
  status("Collection loaded");
}
function element(tag, text) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  return node;
}
function button(text, action) {
  const b = element("button", text);
  b.type = "button";
  b.onclick = action;
  return b;
}
function groups() {
  return [
    ...catalog.collections,
    { id: "singles", title: "Other photographs", photos: catalog.singles },
  ];
}
function render() {
  document.querySelector(".toolbar").inert = busy;
  $("photos").inert = busy;
  const albums = groups();
  if (!albums.some((a) => a.id === selected)) selected = albums[0]?.id;
  $("albums").replaceChildren(
    ...albums.map((a) => {
      const o = element("option", `${a.title} (${a.photos.length})`);
      o.value = a.id;
      return o;
    }),
  );
  $("albums").value = selected;
  $("save").disabled = !dirty || busy;
  $("upload").disabled = busy || dirty || selected === "singles";
  $("rename").disabled = selected === "singles";
  const album = albums.find((a) => a.id === selected);
  $("photos").replaceChildren();
  album?.photos.forEach((photo, index) => {
    const card = element("article");
    card.className = "photo" + (photo.hidden ? " hidden-photo" : "");
    const img = element("img");
    img.src = "/photo/" + photo.src;
    img.alt = photo.alt || "Photograph";
    img.loading = "lazy";
    card.append(img);
    const label = element("label", "Image description");
    const input = element("input");
    input.value = photo.alt || "";
    input.maxLength = 2000;
    input.oninput = () => {
      photo.alt = input.value;
      changed();
    };
    label.append(input);
    card.append(label);
    const move = element("label", "Move to album");
    const select = element("select");
    for (const a of albums) {
      const o = element("option", a.title);
      o.value = a.id;
      select.append(o);
    }
    select.value = selected;
    select.onchange = () => {
      album.photos.splice(index, 1);
      albums.find((a) => a.id === select.value).photos.push(photo);
      changed();
      render();
    };
    move.append(select);
    card.append(move);
    const actions = element("div");
    actions.className = "actions";
    const up = button("← Earlier", () => {
      [album.photos[index - 1], album.photos[index]] = [
        photo,
        album.photos[index - 1],
      ];
      changed();
      render();
    });
    up.disabled = index === 0;
    const down = button("Later →", () => {
      [album.photos[index + 1], album.photos[index]] = [
        photo,
        album.photos[index + 1],
      ];
      changed();
      render();
    });
    down.disabled = index === album.photos.length - 1;
    actions.append(
      up,
      down,
      button(photo.hidden ? "Restore" : "Hide", () => {
        photo.hidden = !photo.hidden;
        changed();
        render();
      }),
    );
    card.append(actions);
    $("photos").append(card);
  });
}
$("albums").onchange = () => {
  selected = $("albums").value;
  render();
};
$("new").onclick = () => {
  const title = prompt("Album name");
  if (!title?.trim()) return;
  const id = "album-" + crypto.randomUUID();
  catalog.collections.push({
    id,
    title: title.trim().slice(0, 120),
    photos: [],
  });
  selected = id;
  changed();
  render();
};
$("rename").onclick = () => {
  const a = catalog.collections.find((a) => a.id === selected);
  const title = prompt("Album name", a.title);
  if (title?.trim()) {
    a.title = title.trim().slice(0, 120);
    changed();
    render();
  }
};
$("save").onclick = async () => {
  busy = true;
  render();
  try {
    await request("/api/save", JSON.stringify(catalog));
    dirty = false;
    status("Saved. Your local website will update.");
  } catch (e) {
    status(e.message);
  } finally {
    busy = false;
    render();
  }
};
$("reload").onclick = () => {
  if (!dirty || confirm("Discard unsaved changes and reload?"))
    load().catch((e) => status(e.message));
};
$("upload").onchange = async () => {
  if (dirty) {
    status("Save your changes before uploading");
    return;
  }
  busy = true;
  const files = [...$("upload").files];
  render();
  let added = 0;
  try {
    for (const file of files) {
      status(`Adding ${file.name}…`);
      if (file.size > 25 * 1024 * 1024)
        throw new Error(`${file.name} exceeds 25 MB`);
      await request("/api/upload?album=" + encodeURIComponent(selected), file);
      added++;
    }
    status(`Added ${added} photograph${added === 1 ? "" : "s"}.`);
  } catch (e) {
    status(`${added} added. ${e.message}`);
  } finally {
    busy = false;
    $("upload").value = "";
    render();
  }
};
window.addEventListener("beforeunload", (event) => {
  if (dirty || busy) {
    event.preventDefault();
    event.returnValue = "";
  }
});
load().catch((e) => status(e.message));
