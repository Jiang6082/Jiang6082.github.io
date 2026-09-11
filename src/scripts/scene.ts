import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
export { THREE };
export function createScene(host: HTMLElement, label: string, fitAspect = 0) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0xe9e4d9);
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", label);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 600);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.enablePan = false;
  controls.autoRotate = false;
  const draw = () => renderer.render(scene, camera);
  const resize = () => {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    if (fitAspect) camera.zoom = Math.min(1, camera.aspect / fitAspect);
    camera.updateProjectionMatrix();
    draw();
  };
  controls.addEventListener("change", draw);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  host.append(renderer.domElement);
  const contextLost = (e: Event) => {
    e.preventDefault();
    host.dispatchEvent(new CustomEvent("scene-unavailable"));
  };
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    observer.disconnect();
    controls.dispose();
    scene.traverse((o: any) => {
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (m) {
          for (const value of Object.values(m))
            if (value instanceof THREE.Texture) value.dispose();
          m.dispose();
        }
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
  window.addEventListener("pagehide", (e) => {
    if (!e.persisted) dispose();
  });
  return {
    scene,
    camera,
    controls,
    renderer,
    draw,
    resize,
    dispose,
    get disposed() {
      return disposed;
    },
  };
}
export function textLabel(text: string, color = "#55594f") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d")!;
  ctx.font = "32px Arial";
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 48);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, depthTest: false }),
  );
  sprite.scale.set(3.2, 0.6, 1);
  return sprite;
}
