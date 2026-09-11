import { createScene, THREE, textLabel } from "./scene";
import { callValue } from "../lib/black-scholes.js";
export function createSurface(host: HTMLElement) {
  const view = createScene(
    host,
    "3D call-value surface. Horizontal axes: stock price 60 to 140 dollars and expiry 0 to 2 years. Vertical axis: call value in dollars per share.",
    1.35,
  );
  const { scene, camera, controls, draw } = view;
  host.querySelector("svg")?.setAttribute("hidden", "");
  const preview = host.querySelector<SVGElement>("svg");
  if (preview) preview.style.display = "none";
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8e8472, 2.5));
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(-4, 12, 8);
  scene.add(light);
  controls.minDistance = 7;
  controls.maxDistance = 27;
  controls.maxPolarAngle = Math.PI * 0.49;
  const reset = () => {
    camera.position.set(12, 10, 14);
    controls.target.set(0, 2, 0);
    controls.update();
    draw();
  };
  reset();
  const grid = new THREE.GridHelper(10, 10, 0xb8afa0, 0xd0c7b9);
  grid.position.y = -0.025;
  scene.add(grid);
  const vertices: number[] = [],
    indices: number[] = [];
  const n = 40;
  for (let j = 0; j <= n; j++)
    for (let i = 0; i <= n; i++)
      vertices.push(-5 + (i * 10) / n, 0, 5 - (j * 10) / n);
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const a = j * (n + 1) + i;
      indices.push(a, a + n + 1, a + 1, a + 1, a + n + 1, a + n + 2);
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);
  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(new Float32Array(vertices.length), 3),
  );
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0,
    }),
  );
  scene.add(mesh);
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
    }),
  );
  scene.add(wire);
  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x252822 }),
  );
  scene.add(marker);
  const stem = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
    new THREE.LineBasicMaterial({ color: 0x252822 }),
  );
  scene.add(stem);
  const labels: [string, number, number, number][] = [
    ["Stock price ($)", 0, 0, 6.4],
    ["Time to expiry (years)", -7, 0, 0],
    ["Call value ($)", 5.5, 9.5, -5],
  ];
  for (const s of [60, 100, 140])
    labels.push([String(s), (s - 100) / 8, 0, 5.65]);
  for (const t of [0, 1, 2]) labels.push([String(t), -5.7, 0, 5 - t * 5]);
  for (const v of [0, 20, 40, 60, 80])
    labels.push([String(v), 5.8, v / 10, -5]);
  for (const [text, x, y, z] of labels) {
    const label = textLabel(text);
    label.position.set(x, y, z);
    if (text.length < 4) label.scale.multiplyScalar(0.55);
    scene.add(label);
  }
  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(5, 0, -5),
      new THREE.Vector3(5, 8, -5),
    ]),
    new THREE.LineBasicMaterial({ color: 0x8e8472 }),
  );
  scene.add(axis);
  let prior = -1;
  const update = (vol: number, spot: number, time: number) => {
    if (vol !== prior) {
      const pos = geometry.getAttribute("position"),
        colors = geometry.getAttribute("color");
      const low = new THREE.Color("#65756e"),
        high = new THREE.Color("#b43d28");
      for (let j = 0; j <= n; j++)
        for (let i = 0; i <= n; i++) {
          const k = j * (n + 1) + i,
            v = callValue(60 + (i * 80) / n, 100, (j * 2) / n, vol, 0.04);
          pos.setY(k, v / 10);
          const c = low.clone().lerp(high, Math.min(1, v / 80));
          colors.setXYZ(k, c.r, c.g, c.b);
        }
      pos.needsUpdate = true;
      colors.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingSphere();
      wire.geometry.dispose();
      wire.geometry = new THREE.WireframeGeometry(geometry);
      prior = vol;
    }
    const x = (spot - 100) / 8,
      z = 5 - time * 5,
      y = callValue(spot, 100, time, vol, 0.04) / 10;
    marker.position.set(x, y + 0.08, z);
    stem.geometry.dispose();
    stem.geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0, z),
      new THREE.Vector3(x, y, z),
    ]);
    draw();
  };
  const rotate = (angle: number) => {
    const offset = camera.position.clone().sub(controls.target);
    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    camera.position.copy(controls.target).add(offset);
    controls.update();
    draw();
  };
  document.querySelector("#surface-reset")!.addEventListener("click", reset);
  document
    .querySelector("#surface-left")!
    .addEventListener("click", () => rotate(-Math.PI / 12));
  document
    .querySelector("#surface-right")!
    .addEventListener("click", () => rotate(Math.PI / 12));
  view.renderer.domElement.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      rotate(e.key === "ArrowLeft" ? -0.15 : 0.15);
    }
  });
  host.addEventListener("scene-unavailable", () => {
    document.querySelector("#surface-status")!.textContent =
      "3D connection lost. Reload to try again; the numeric controls and sample table remain available.";
    if (preview) preview.style.display = "";
    view.renderer.domElement.style.display = "none";
  });
  view.resize();
  update(0.25, 100, 1);
  return { update };
}
