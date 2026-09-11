import { createScene, THREE } from "./scene";
type Photo = {
  thumb: string;
  texture: string;
  full: string;
  aspect: number;
  alt: string;
};
export function createPhotoRoom(host: HTMLElement, photos: Photo[]) {
  const view = createScene(
    host,
    "A 3D gallery of framed photographs. Use Previous and Next to visit each frame, Step closer to approach, and Open photograph for an accessible full-size view.",
  );
  const { scene, camera, controls, draw } = view;
  const preview = host.querySelector<HTMLElement>(".room-preview")!;
  preview.style.display = "none";
  const status = document.querySelector<HTMLElement>("#room-status")!;
  scene.background = new THREE.Color("#e7e2d8");
  scene.fog = new THREE.Fog("#e7e2d8", 18, 65);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb9ad94, 2.6));
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(2, 8, 6);
  scene.add(light);
  const spacing = 4.8,
    length = Math.max(14, photos.length * spacing + 5),
    center = ((photos.length - 1) * spacing) / 2;
  const box = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    color: number,
  ) => {
    const obj = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({ color, roughness: 1 }),
    );
    obj.position.set(x, y, z);
    scene.add(obj);
    return obj;
  };
  box(length, 0.2, 14, center, -0.15, 1, 0xc9c0ae);
  box(length, 5.5, 0.2, center, 2.6, -3.2, 0xeeeae1);
  box(0.2, 5.5, 14, center - length / 2, 2.6, 1, 0xe0d9cc);
  box(0.2, 5.5, 14, center + length / 2, 2.6, 1, 0xe0d9cc);
  box(length, 0.12, 0.12, center, 0.12, -3, 0xbdb5a6);
  const frames = photos.map((p, i) => {
    const h = Math.min(2.15, 3.3 / p.aspect),
      w = h * p.aspect;
    box(w + 0.22, h + 0.22, 0.12, i * spacing, 2, -3, 0x363a33);
    box(w + 0.16, h + 0.16, 0.06, i * spacing, 2, -2.91, 0xfaf8f2);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ color: 0xd8d2c5 }),
    );
    plane.position.set(i * spacing, 2, -2.865);
    scene.add(plane);
    return plane;
  });
  let index = 0,
    close = false;
  const loading = new Set<number>();
  const loader = new THREE.TextureLoader();
  const loadNearby = () => {
    frames.forEach((f, i) => {
      if (Math.abs(i - index) > 2) {
        if (f.material.map) {
          f.material.map.dispose();
          f.material.map = null;
          f.material.color.setHex(0xd8d2c5);
          f.material.needsUpdate = true;
        }
        return;
      }
      if (f.material.map || loading.has(i)) return;
      loading.add(i);
      loader.load(
        photos[i].texture,
        (texture) => {
          loading.delete(i);
          if (view.disposed || Math.abs(i - index) > 2) {
            texture.dispose();
            return;
          }
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(
            4,
            view.renderer.capabilities.getMaxAnisotropy(),
          );
          f.material.map = texture;
          f.material.color.setHex(0xffffff);
          f.material.needsUpdate = true;
          draw();
        },
        undefined,
        () => {
          loading.delete(i);
          status.textContent =
            "One frame could not load. Use Open photograph or its thumbnail to view the image.";
        },
      );
    });
  };
  controls.minDistance = 1.2;
  controls.maxDistance = 9;
  controls.minAzimuthAngle = -0.55;
  controls.maxAzimuthAngle = 0.55;
  controls.minPolarAngle = Math.PI * 0.35;
  controls.maxPolarAngle = Math.PI * 0.61;
  const prev = document.querySelector<HTMLButtonElement>("#room-prev")!,
    next = document.querySelector<HTMLButtonElement>("#room-next")!,
    closer = document.querySelector<HTMLButtonElement>("#room-close")!;
  const position = () => {
    camera.position.set(index * spacing, 2, close ? 0.2 : 4.2);
    controls.target.set(index * spacing, 2, -2.9);
    controls.update();
    draw();
  };
  const select = (i: number) => {
    index = Math.max(0, Math.min(photos.length - 1, i));
    position();
    loadNearby();
    prev.disabled = index === 0;
    next.disabled = index === photos.length - 1;
    document.querySelector("#room-count")!.textContent =
      `${index + 1} / ${photos.length}`;
    document
      .querySelectorAll<HTMLElement>("[data-frame]")
      .forEach((el, j) => el.setAttribute("aria-current", String(index === j)));
    status.textContent = `Photograph ${index + 1} of ${photos.length}. Drag to look around, or step closer.`;
  };
  prev.addEventListener("click", () => select(index - 1));
  next.addEventListener("click", () => select(index + 1));
  closer.addEventListener("click", () => {
    close = !close;
    closer.setAttribute("aria-pressed", String(close));
    closer.textContent = close ? "Step back" : "Step closer";
    position();
  });
  document.querySelector("#room-reset")!.addEventListener("click", () => {
    close = false;
    closer.setAttribute("aria-pressed", "false");
    closer.textContent = "Step closer";
    position();
  });
  document
    .querySelectorAll<HTMLAnchorElement>("[data-frame]")
    .forEach((el, i) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        select(i);
      }),
    );
  view.renderer.domElement.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      select(index + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  const dialog = document.querySelector<HTMLDialogElement>("#room-dialog")!,
    image = document.querySelector<HTMLImageElement>("#room-full")!;
  document.querySelector("#room-open")!.addEventListener("click", () => {
    image.src = photos[index].full;
    image.alt = photos[index].alt;
    dialog.showModal();
  });
  document
    .querySelector("#room-dismiss")!
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  host.addEventListener("scene-unavailable", () => {
    view.renderer.domElement.style.display = "none";
    preview.style.display = "";
    status.textContent =
      "3D connection lost. Open photograph still works; reload to re-enter the room.";
  });
  select(0);
  view.resize();
}
