// Small motion helpers for the photography pages. Everything checks the
// visitor's "reduce motion" setting first.
import { rollFlap } from "./flap.js";

export const reducedMotion = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * FLIP: measure elements, run `mutate` (which may move them in the DOM),
 * then animate each element from its old position to its new one.
 * Elements that weren't on screen before fade and scale in.
 */
export function flip(elements, mutate) {
  if (reducedMotion() || !elements.length) return mutate();
  const before = new Map(elements.map((el) => [el, el.isConnected ? el.getBoundingClientRect() : null]));
  mutate();
  for (const el of elements) {
    if (!el.isConnected) continue;
    const a = before.get(el);
    const b = el.getBoundingClientRect();
    if (!b.width && !b.height) continue;
    if (!a || (!a.width && !a.height)) {
      el.animate(
        [{ opacity: 0, transform: "scale(0.96)" }, { opacity: 1, transform: "none" }],
        { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" },
      );
      continue;
    }
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
      duration: 420,
      easing: "cubic-bezier(.2,.7,.2,1)",
    });
  }
}

/** Fade images in once they've loaded (class ph-img). */
export function fadeInImages(root = document) {
  root.querySelectorAll("img.ph-img:not(.is-loaded)").forEach((img) => {
    const done = () => img.classList.add("is-loaded");
    if (img.complete) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });
}

/** One-time page entrance: roll the split-flap counters, fade images in,
 *  and drop the rise class after it has played so moved elements don't replay it. */
export function initMotion() {
  fadeInImages();
  document.querySelectorAll(".flap").forEach((el) => {
    const text = [...el.children].map((c) => (c.classList.contains("flap-gap") ? " " : c.textContent)).join("");
    rollFlap(el, text);
  });
  document.querySelectorAll(".ph-rise").forEach((el) =>
    el.addEventListener("animationend", () => el.classList.remove("ph-rise"), { once: true }),
  );
}
