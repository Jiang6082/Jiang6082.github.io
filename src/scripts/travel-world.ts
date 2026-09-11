import { createScene, THREE, textLabel } from "./scene";
import { destinations } from "../data/travel";
export function createTravelWorld(
  host: HTMLElement,
  onSelect: (id: string) => void,
) {
  const view = createScene(
    host,
    "Miniature travel island. Choose Railway, Airfield, Coast, Garden or Streets using the destination buttons, or click a landmark.",
    1.3,
  );
  const { scene, camera, controls, renderer, draw } = view;
  const preview = host.querySelector<SVGElement>(".world-preview")!;
  preview.style.display = "none";
  scene.background = new THREE.Color("#b7d1cf");
  scene.fog = new THREE.Fog("#b7d1cf", 65, 140);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.add(new THREE.HemisphereLight(0xfff6e2, 0x718575, 2.5));
  const sun = new THREE.DirectionalLight(0xfff4de, 3);
  sun.position.set(-12, 25, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, {
    left: -18,
    right: 18,
    top: 16,
    bottom: -16,
    far: 70,
  });
  sun.shadow.bias = -0.001;
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun);
  const materials = new Map<number, THREE.MeshStandardMaterial>();
  const material = (c: number) => {
    if (!materials.has(c))
      materials.set(
        c,
        new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 }),
      );
    return materials.get(c)!;
  };
  const mesh = (
    g: THREE.BufferGeometry,
    c: number,
    x: number,
    y: number,
    z: number,
    parent: THREE.Object3D = scene,
  ) => {
    const m = new THREE.Mesh(g, material(c));
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const box = (
    w: number,
    h: number,
    d: number,
    c: number,
    x: number,
    y: number,
    z: number,
    p: THREE.Object3D = scene,
  ) => mesh(new THREE.BoxGeometry(w, h, d), c, x, y, z, p);
  const cyl = (
    rt: number,
    rb: number,
    h: number,
    c: number,
    x: number,
    y: number,
    z: number,
    p: THREE.Object3D = scene,
    n = 12,
  ) => mesh(new THREE.CylinderGeometry(rt, rb, h, n), c, x, y, z, p);
  const sea = mesh(new THREE.PlaneGeometry(220, 220), 0xb7d1cf, 0, -0.8, 0);
  sea.rotation.x = -Math.PI / 2;
  sea.castShadow = false;
  const island = cyl(12.3, 11.8, 0.9, 0xd9c397, 0, -0.15, 0, scene, 64);
  island.scale.z = 0.74;
  const grass = cyl(11.7, 12, 0.22, 0x9daf86, 0, 0.38, 0, scene, 64);
  grass.scale.z = 0.71;
  // Railway forms a continuous oval around the island.
  for (let i = 0; i < 128; i++) {
    const a = (i * Math.PI * 2) / 128,
      x = 10 * Math.cos(a),
      z = 6.65 * Math.sin(a);
    const tie = box(0.7, 0.07, 0.13, 0x776450, x, 0.55, z);
    tie.rotation.y = -a;
  }
  for (const r of [-0.24, 0.24]) {
    const points = Array.from({ length: 161 }, (_, i) => {
      const a = (i * Math.PI * 2) / 160;
      return new THREE.Vector3(
        (10 + r) * Math.cos(a),
        0.61,
        (6.65 + r) * Math.sin(a),
      );
    });
    const rail = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0x4f5850 }),
    );
    scene.add(rail);
  }
  const groups = new Map<string, THREE.Group>();
  for (const d of destinations) {
    const g = new THREE.Group();
    g.position.set(d.x, 0, d.z);
    g.userData.stop = d.id;
    scene.add(g);
    groups.set(d.id, g);
    const pin = cyl(0.15, 0.15, 0.7, 0xb43d28, 0, 3.3, 0, g);
    pin.userData.stop = d.id;
    const label = textLabel(d.name, "#252822");
    label.position.set(0, 4, 0);
    label.scale.set(3.4, 0.64, 1);
    label.userData.stop = d.id;
    g.add(label);
  }
  const station = groups.get("railway")!;
  box(2.5, 0.22, 2.5, 0xcac2af, 0, 0.62, 0, station);
  box(1.8, 1.05, 1.2, 0xeae3d1, 0, 1.22, 0, station);
  const roof = mesh(
    new THREE.ConeGeometry(1.5, 0.7, 4),
    0xa95b41,
    0,
    2.08,
    0,
    station,
  );
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = 0.75;
  box(0.45, 0.65, 0.03, 0x435c5b, 0.5, 1.25, 0.62, station);
  box(0.55, 0.75, 0.03, 0x435c5b, -0.45, 1.15, 0.62, station);
  const garden = groups.get("garden")!;
  box(4, 0.08, 3.5, 0x7c986a, 0, 0.56, 0, garden);
  const tree = (
    x: number,
    z: number,
    color: number,
    p: THREE.Object3D = scene,
    scale = 1,
  ) => {
    cyl(0.11, 0.16, 0.9, 0x7b654a, x, 0.95, z, p);
    const crown = mesh(
      new THREE.IcosahedronGeometry(0.65 * scale, 0),
      color,
      x,
      1.85 * scale,
      z,
      p,
    );
    crown.scale.y = 1.1;
  };
  for (let i = 0; i < 9; i++) {
    const x = ((i % 3) - 1) * 1.25,
      z = (Math.floor(i / 3) - 1) * 1.1;
    tree(x, z, i % 3 === 0 ? 0xcfabb0 : 0x5e8057, garden, 0.85);
  }
  for (const x of [-1.2, 1.2])
    for (const z of [-1.1, 1.1])
      box(0.13, 1.7, 0.13, 0xe4dbbd, x, 1.35, z, garden);
  for (let i = 0; i < 5; i++)
    box(2.8, 0.12, 0.1, 0xe4dbbd, 0, 2.23, -1.2 + i * 0.6, garden);
  const town = groups.get("streets")!;
  box(5.5, 0.08, 0.85, 0x7a8177, 0, 0.54, 0, town);
  box(0.85, 0.08, 4, 0x7a8177, 0, 0.55, 0, town);
  for (let i = 0; i < 5; i++) {
    box(0.3, 0.015, 0.045, 0xe7e3ce, -2 + i, 0.6, 0, town);
  }
  for (const [x, z, h, c] of [
    [-1.5, -1.2, 1.5, 0xe9d4af],
    [1.35, -1.25, 2, 0xc9886d],
    [-1.4, 1.2, 1.15, 0xeae5d6],
    [1.5, 1.3, 1.4, 0xc6cbb9],
  ]) {
    box(1.15, h, 1.15, c, x, 0.6 + h / 2, z, town);
    box(1.3, 0.16, 1.3, 0x657364, x, 0.7 + h, z, town);
    for (let j = 0; j < 2; j++)
      box(0.22, 0.3, 0.025, 0x496065, x - 0.3 + j * 0.6, 1.2, z + 0.59, town);
  }
  const coast = groups.get("coast")!;
  const sand = cyl(2.6, 2.8, 0.1, 0xead6ad, 0.6, 0.54, 0, coast, 32);
  sand.scale.z = 0.6;
  cyl(0.35, 0.52, 2.1, 0xf2eadd, 1.1, 1.62, 0.5, coast);
  cyl(0.37, 0.37, 0.25, 0xb65740, 1.1, 1.92, 0.5, coast);
  cyl(0.5, 0.5, 0.18, 0x485f5c, 1.1, 2.7, 0.5, coast);
  cyl(0.25, 0.25, 0.4, 0xf3da91, 1.1, 2.95, 0.5, coast);
  mesh(new THREE.ConeGeometry(0.45, 0.35, 12), 0xb65740, 1.1, 3.3, 0.5, coast);
  box(2, 0.12, 0.65, 0x9b805c, 1.3, 0.55, 2.25, coast);
  for (const x of [0.5, 2.1]) box(0.12, 1, 0.12, 0x907650, x, 0.1, 2.25, coast);
  const boat = new THREE.Group();
  boat.position.set(8, -0.4, 7.8);
  boat.rotation.y = -0.4;
  scene.add(boat);
  const hull = mesh(
    new THREE.SphereGeometry(1, 12, 6),
    0xc16a4d,
    0,
    0,
    0,
    boat,
  );
  hull.scale.set(0.35, 0.25, 0.8);
  box(0.045, 1.4, 0.045, 0x5d665c, 0, 0.65, 0, boat);
  const sail = mesh(
    new THREE.ConeGeometry(0.6, 1.05, 3),
    0xf4ecd8,
    0,
    0.9,
    0,
    boat,
  );
  sail.scale.z = 0.06;
  const airport = groups.get("airfield")!;
  box(5.2, 0.09, 1.35, 0x727d76, 0, 0.57, 0, airport);
  for (let i = 0; i < 7; i++)
    box(0.36, 0.015, 0.06, 0xf2eddd, -2.1 + i * 0.7, 0.63, 0, airport);
  box(1.3, 1, 1.1, 0xe9e0cb, -1.5, 1.05, -1.4, airport);
  box(0.6, 1.7, 0.6, 0xc8cbbb, -0.25, 1.4, -1.5, airport);
  box(0.9, 0.45, 0.8, 0x597b7b, -0.25, 2.4, -1.5, airport);
  const airplane = new THREE.Group();
  airplane.userData.stop = "airfield";
  scene.add(airplane);
  const body = mesh(
    new THREE.SphereGeometry(0.5, 12, 8),
    0xf4edda,
    0,
    0,
    0,
    airplane,
  );
  body.scale.set(1.9, 0.38, 0.4);
  box(0.65, 0.08, 2.4, 0xf4edda, 0, 0, 0, airplane);
  box(0.45, 0.07, 0.95, 0xb4563f, -0.75, 0.12, 0, airplane);
  box(0.3, 0.4, 0.07, 0xb4563f, -0.8, 0.24, 0, airplane);
  mesh(new THREE.SphereGeometry(0.16, 10, 6), 0x456b70, 0.3, 0.13, 0, airplane);
  const parkPlane = () => {
    airplane.position.set(5, 0.92, -3);
    airplane.rotation.set(0, 0, 0);
  };
  parkPlane();
  for (const [x, z] of [
    [-8, -3],
    [-7, -4.3],
    [-5, 4.7],
    [-3, 5.6],
    [3, -5],
    [1, -5.4],
    [8, 1],
  ])
    tree(x, z, 0x607d56);
  // Shallow ripples and small rocks give the coastline scale without image assets.
  for (let i = 0; i < 12; i++) {
    const a = i * 2.4;
    const rock = mesh(
      new THREE.IcosahedronGeometry(0.3 + (i % 3) * 0.12, 0),
      0x9da89a,
      12.4 * Math.cos(a),
      -0.45,
      9.3 * Math.sin(a),
    );
    rock.scale.y = 0.5;
  }
  const trains: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) {
    const t = new THREE.Group();
    t.userData.stop = "railway";
    scene.add(t);
    box(0.6, 0.5, 1.15, i === 0 ? 0xb43d28 : 0xd9c8a0, 0, 0.4, 0, t);
    box(0.62, 0.1, 1.2, 0x394b45, 0, 0.72, 0, t);
    for (const z of [-0.35, 0.25]) {
      box(0.015, 0.23, 0.22, 0x547779, 0.31, 0.46, z, t);
      box(0.015, 0.23, 0.22, 0x547779, -0.31, 0.46, z, t);
    }
    for (const x of [-0.33, 0.33])
      for (const z of [-0.35, 0.35]) {
        const wheel = cyl(0.13, 0.13, 0.09, 0x333c35, x, 0.13, z, t);
        wheel.rotation.z = Math.PI / 2;
      }
    trains.push(t);
  }
  let angle = 2.9;
  const moveTrain = () =>
    trains.forEach((t, i) => {
      const a = angle - i * 0.145;
      t.position.set(10 * Math.cos(a), 0.66, 6.65 * Math.sin(a));
      t.rotation.y = Math.atan2(-10 * Math.sin(a), 6.65 * Math.cos(a));
    });
  moveTrain();
  controls.minDistance = 9;
  controls.maxDistance = 65;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = Math.PI * 0.47;
  camera.position.set(22, 25, 29);
  controls.target.set(0, 0, 0);
  controls.update();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let running = false,
    flight = 0,
    visible = true,
    raf = 0,
    last = 0,
    tween: null | {
      from: THREE.Vector3;
      to: THREE.Vector3;
      fromTarget: THREE.Vector3;
      toTarget: THREE.Vector3;
      elapsed: number;
    } = null;
  const trainButton =
      document.querySelector<HTMLButtonElement>("#world-train")!,
    planeButton = document.querySelector<HTMLButtonElement>("#world-plane")!;
  const tick = (now: number) => {
    raf = 0;
    if (view.disposed || !visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (running) {
      angle += dt * 0.22;
      moveTrain();
    }
    if (flight > 0) {
      flight += dt;
      const p = Math.min(1, flight / 9),
        a = p * Math.PI * 2;
      airplane.position.set(
        5 + 9 * Math.sin(a),
        0.92 + 7 * Math.sin(Math.PI * p),
        -3 + 5 * (1 - Math.cos(a)),
      );
      airplane.rotation.set(0, -a, -0.12 * Math.sin(a));
      if (p === 1) {
        flight = 0;
        parkPlane();
        planeButton.disabled = false;
        planeButton.textContent = "Fly the plane";
      }
    }
    if (tween) {
      tween.elapsed += dt;
      const p = Math.min(1, tween.elapsed / 0.8),
        e = p * p * (3 - 2 * p);
      camera.position.lerpVectors(tween.from, tween.to, e);
      controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
      controls.update();
      if (p === 1) tween = null;
    }
    draw();
    if (running || flight || tween) raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!raf && visible && !document.hidden && !view.disposed) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  const visit = (id: string) => {
    const d = destinations.find((d) => d.id === id);
    const target = new THREE.Vector3(d?.x || 0, 0, d?.z || 0),
      pos = d
        ? target.clone().add(new THREE.Vector3(8, 10, 12))
        : new THREE.Vector3(22, 25, 29);
    if (reduced.matches) {
      camera.position.copy(pos);
      controls.target.copy(target);
      controls.update();
      draw();
    } else {
      tween = {
        from: camera.position.clone(),
        to: pos,
        fromTarget: controls.target.clone(),
        toTarget: target,
        elapsed: 0,
      };
      wake();
    }
  };
  controls.addEventListener("start", () => {
    tween = null;
  });
  document.querySelector("#world-home")!.addEventListener("click", () => {
    onSelect("all");
    visit("all");
  });
  trainButton.addEventListener("click", () => {
    running = !running;
    trainButton.setAttribute("aria-pressed", String(running));
    trainButton.textContent = running ? "Pause the train" : "Run the train";
    wake();
  });
  planeButton.addEventListener("click", () => {
    if (flight) {
      flight = 0;
      parkPlane();
      planeButton.textContent = "Fly the plane";
      draw();
      return;
    }
    flight = 0.001;
    planeButton.textContent = "Land the plane";
    wake();
  });
  const rotate = (r: number) => {
    tween = null;
    const delta = camera.position
      .clone()
      .sub(controls.target)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), r);
    camera.position.copy(controls.target).add(delta);
    controls.update();
    draw();
  };
  document
    .querySelector("#world-left")!
    .addEventListener("click", () => rotate(-0.25));
  document
    .querySelector("#world-right")!
    .addEventListener("click", () => rotate(0.25));
  renderer.domElement.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      rotate(e.key === "ArrowLeft" ? -0.2 : 0.2);
    }
  });
  const raycaster = new THREE.Raycaster();
  let down = { x: 0, y: 0 };
  renderer.domElement.addEventListener("pointerdown", (e) => {
    down = { x: e.clientX, y: e.clientY };
  });
  renderer.domElement.addEventListener("pointerup", (e) => {
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 7) return;
    const r = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        (-(e.clientY - r.top) / r.height) * 2 + 1,
      ),
      camera,
    );
    for (const hit of raycaster.intersectObjects(
      [...groups.values(), airplane, ...trains],
      true,
    )) {
      let obj: THREE.Object3D | null = hit.object;
      while (obj && !obj.userData.stop) obj = obj.parent;
      if (obj) {
        onSelect(obj.userData.stop);
        visit(obj.userData.stop);
        break;
      }
    }
  });
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) wake();
    else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  observer.observe(host);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    } else wake();
  });
  window.addEventListener("pagehide", (e) => {
    if (!e.persisted) {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    }
  });
  host.addEventListener("scene-unavailable", () => {
    running = false;
    flight = 0;
    tween = null;
    if (raf) cancelAnimationFrame(raf);
    renderer.domElement.style.display = "none";
    preview.style.display = "";
    document.querySelector("#room-status")!.textContent =
      "3D connection lost. The destination buttons and photographs still work.";
  });
  view.resize();
  draw();
  return { visit };
}
