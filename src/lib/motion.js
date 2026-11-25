// Small motion helpers for the photography pages. Everything checks the
// visitor's "reduce motion" setting first.
import { rollFlap } from "./flap.js";

// Same curves as --ease-out and --ease-in-out in global.css.
export const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
export const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

export const reducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * FLIP: measure elements, run `mutate` (which may move them in the DOM),
 * then animate each element from where it was to where it is now. Elements
 * that weren't showing before fade in. Calling it again mid-animation
 * picks up from wherever each element currently is.
 * @param {HTMLElement[]} elements
 * @param {() => void} mutate
 */
export function flip(elements, mutate) {
  if (reducedMotion() || !elements.length) return mutate();
  // Measure while any earlier run is still moving things, so the next run
  // starts from what's on screen, then stop the earlier run.
  const before = new Map(elements.map((el) => [el, el.isConnected ? el.getBoundingClientRect() : null]));
  for (const el of elements) for (const a of el.getAnimations()) a.cancel();
  mutate();
  for (const el of elements) {
    if (!el.isConnected) continue;
    const a = before.get(el);
    const b = el.getBoundingClientRect();
    if (!b.width && !b.height) continue;
    if (!a || (!a.width && !a.height)) {
      el.animate([{ opacity: 0, transform: "scale(0.97)" }, { opacity: 1, transform: "none" }], {
        duration: 220,
        easing: EASE_OUT,
      });
      continue;
    }
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
      duration: 280,
      easing: EASE_IN_OUT,
    });
  }
}

/** Fade images in once they've loaded (class ph-img). */
export function fadeInImages(root = document) {
  root.querySelectorAll("img.ph-img:not(.is-loaded)").forEach((img) => {
    const done = () => img.classList.add("is-loaded");
    if (/** @type {HTMLImageElement} */ (img).complete) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });
}

/** One-time page entrance: roll the split-flap counters (not the ones
 *  marked .is-still), fade images in, and drop the rise class after it has
 *  played so moved elements don't replay it. */
export function initMotion() {
  fadeInImages();
  document.querySelectorAll(".flap:not(.is-still)").forEach((el) => {
    const text = [...el.children].map((c) => (c.classList.contains("flap-gap") ? " " : c.textContent)).join("");
    rollFlap(/** @type {HTMLElement} */ (el), text);
  });
  document.querySelectorAll(".ph-rise").forEach((el) =>
    el.addEventListener("animationend", () => el.classList.remove("ph-rise"), { once: true }),
  );
}
