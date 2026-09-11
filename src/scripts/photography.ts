const collection = document.querySelector<HTMLElement>(".photo-collection");
const albumSwitch = document.querySelector<HTMLElement>(".album-switch");
const viewSwitch = document.querySelector<HTMLElement>(".view-switch");
const controls = document.querySelector<HTMLElement>(".gallery-controls");
const previous = document.querySelector<HTMLButtonElement>("#previous-photo");
const next = document.querySelector<HTMLButtonElement>("#next-photo");
const depth = document.querySelector<HTMLButtonElement>(".depth-toggle");
const position = document.querySelector<HTMLElement>("#gallery-position");
const description = document.querySelector<HTMLElement>("#album-description");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const fine = matchMedia("(hover: hover) and (pointer: fine)");
if (
  collection &&
  albumSwitch &&
  viewSwitch &&
  controls &&
  previous &&
  next &&
  depth &&
  position &&
  description
) {
  const figures = Array.from(
    collection.querySelectorAll<HTMLElement>("figure"),
  );
  let view = "strip",
    selected = 0,
    depthEnabled = true,
    pending = false;
  const visible = () => figures.filter((f) => !f.hidden);
  function update() {
    pending = false;
    const photos = visible();
    if (view === "strip") {
      const center = collection!.scrollLeft + collection!.clientWidth / 2;
      let closest = Infinity;
      photos.forEach((figure, i) => {
        const delta =
          (figure.offsetLeft + figure.offsetWidth / 2 - center) /
          Math.max(1, figure.offsetWidth);
        const distance = Math.abs(delta);
        if (distance < closest) {
          closest = distance;
          selected = i;
        }
        const link = figure.querySelector<HTMLElement>(".photo-open")!;
        link.style.setProperty(
          "--rotation",
          `${Math.max(-28, Math.min(28, -delta * 24))}deg`,
        );
        link.style.setProperty("--depth", `${-Math.min(distance, 2) * 150}px`);
      });
    }
    photos.forEach((f, i) => {
      f.dataset.selected = String(i === selected);
    });
    const text = `${photos.length ? selected + 1 : 0} / ${photos.length}`;
    if (position!.textContent !== text) position!.textContent = text;
    previous!.disabled = selected <= 0;
    next!.disabled = selected >= photos.length - 1;
  }
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  }
  function centerPhoto(index: number, smooth = true) {
    const photos = visible();
    selected = Math.max(0, Math.min(index, photos.length - 1));
    const figure = photos[selected];
    if (!figure) return;
    collection!.scrollTo({
      left:
        figure.offsetLeft +
        figure.offsetWidth / 2 -
        collection!.clientWidth / 2,
      behavior: smooth && !reduce.matches ? "smooth" : "instant",
    });
    if (!smooth) update();
  }
  function syncDepth() {
    const on = depthEnabled && !reduce.matches;
    collection!.classList.toggle("depth-on", on);
    depth!.disabled = reduce.matches;
    depth!.setAttribute("aria-pressed", String(on));
    depth!.textContent = on ? "Depth on" : "Depth off";
    figures.forEach((f) => {
      const link = f.querySelector<HTMLElement>("a")!;
      link.style.removeProperty("--tilt-x");
      link.style.removeProperty("--tilt-y");
    });
  }
  albumSwitch.hidden = false;
  viewSwitch.hidden = false;
  // offsetLeft is measured against this element, independent of page gutters.
  collection.style.position = "relative";
  function setView(value: string) {
    view = value;
    collection!.classList.toggle("filmstrip", view === "strip");
    controls!.hidden = view !== "strip";
    viewSwitch!
      .querySelectorAll<HTMLButtonElement>("button")
      .forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.view === view)),
      );
    syncDepth();
    if (view === "strip")
      requestAnimationFrame(() => centerPhoto(selected, false));
  }
  albumSwitch.querySelectorAll<HTMLButtonElement>("button").forEach((button) =>
    button.addEventListener("click", () => {
      const album = button.dataset.album!;
      albumSwitch!
        .querySelectorAll<HTMLButtonElement>("button")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      figures.forEach((f) => {
        f.hidden = album !== "all" && f.dataset.albumId !== album;
      });
      visible().forEach((f, i) => {
        const link = f.querySelector<HTMLAnchorElement>("a")!;
        link.dataset.group = album === "all" ? "photographs" : `album-${album}`;
        link.dataset.index =
          album === "all" ? f.dataset.photoIndex! : String(i);
      });
      description!.textContent =
        button.dataset.description || "All photographs";
      selected = 0;
      requestAnimationFrame(() => {
        if (view === "strip") centerPhoto(0, false);
        else update();
      });
    }),
  );
  viewSwitch
    .querySelectorAll<HTMLButtonElement>("button")
    .forEach((b) =>
      b.addEventListener("click", () => setView(b.dataset.view!)),
    );
  previous.addEventListener("click", () => centerPhoto(selected - 1));
  next.addEventListener("click", () => centerPhoto(selected + 1));
  depth.addEventListener("click", () => {
    depthEnabled = !depthEnabled;
    syncDepth();
  });
  collection.addEventListener("scroll", schedule, { passive: true });
  collection.addEventListener("keydown", (e) => {
    if (
      view !== "strip" ||
      !["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
    )
      return;
    e.preventDefault();
    const index =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? visible().length - 1
          : selected + (e.key === "ArrowRight" ? 1 : -1);
    // Keep keyboard focus on the frame that moves to center.
    const target =
      visible()[
        Math.max(0, Math.min(index, visible().length - 1))
      ]?.querySelector<HTMLAnchorElement>("a");
    target?.focus({ preventScroll: true });
    centerPhoto(index);
  });
  collection.addEventListener("focusin", (e) => {
    if (view !== "strip") return;
    const i = visible().findIndex((f) => f.contains(e.target as Node));
    if (i >= 0) centerPhoto(i, false);
  });
  figures.forEach((figure) => {
    const link = figure.querySelector<HTMLElement>(".photo-open")!;
    let x = 0,
      y = 0,
      frame = 0;
    link.addEventListener("pointermove", (e) => {
      if (reduce.matches || !fine.matches || !depthEnabled) return;
      const rect = figure.getBoundingClientRect();
      x = Math.max(
        -1,
        Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1),
      );
      const imageHeight = link.offsetHeight;
      y = Math.max(
        -1,
        Math.min(
          1,
          ((e.clientY - rect.top) / Math.max(1, imageHeight)) * 2 - 1,
        ),
      );
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          link.style.setProperty("--tilt-x", `${-y * 2.5}deg`);
          link.style.setProperty("--tilt-y", `${x * 3}deg`);
        });
    });
    link.addEventListener("pointerleave", () => {
      cancelAnimationFrame(frame);
      frame = 0;
      link.style.removeProperty("--tilt-x");
      link.style.removeProperty("--tilt-y");
    });
  });
  reduce.addEventListener("change", syncDepth);
  fine.addEventListener("change", syncDepth);
  new ResizeObserver(() => {
    if (view === "strip") centerPhoto(selected, false);
  }).observe(collection);
  setView(view);
}
