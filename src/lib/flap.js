// Split-flap display: one cell per character. flapHTML renders the cells
// (build time and browser); rollFlap animates them like a departure board.
const esc = (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c;
export const flapHTML = (text) =>
  [...String(text)]
    .map((c) => (c === " " ? '<span class="flap-gap"></span>' : `<span class="flap-c">${esc(c)}</span>`))
    .join("");

const DIGITS = "0123456789";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TICK = 55; // ms per flap
const reduced = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The characters a flap shows on its way from `from` to `to`, ending on
 * `to`. Like a real split-flap wheel it only turns forward, through the
 * characters in order. With no usable `from` it starts `minimum` flaps back.
 * @param {string} from
 * @param {string} to
 * @param {number} [minimum]
 * @returns {string[]}
 */
export function flapSteps(from, to, minimum = 1) {
  const pool = DIGITS.includes(to) ? DIGITS : LETTERS.includes(to) ? LETTERS : "";
  if (!pool) return [to];
  const end = pool.indexOf(to);
  const known = from ? pool.indexOf(from) : -1;
  let n = known < 0 ? minimum : (end - known + pool.length) % pool.length;
  if (n < minimum) n += pool.length * Math.ceil((minimum - n) / pool.length);
  const start = end - n;
  return Array.from({ length: n }, (_, k) => pool[(((start + k + 1) % pool.length) + pool.length) % pool.length]);
}

/** @type {WeakMap<Element, number>} */
const runs = new WeakMap();

/**
 * Show `text` in `el`. The first time, every cell turns a few flaps, later
 * cells a little longer. After that, only cells whose character changed
 * turn, from the old character to the new one.
 * @param {HTMLElement} el
 * @param {string} [text]
 */
export function rollFlap(el, text = el.textContent ?? "") {
  const first = !el.dataset.flapped;
  const before = first ? "" : el.getAttribute("aria-label") ?? "";
  el.dataset.flapped = "1";
  el.innerHTML = flapHTML(text);
  el.setAttribute("aria-label", text);
  // A newer roll stops any older one still running on this element.
  const run = (runs.get(el) ?? 0) + 1;
  runs.set(el, run);
  if (reduced()) return;
  const chars = [...String(text)];
  const old = [...before];
  [...el.children].forEach((cell, i) => {
    if (!cell.classList.contains("flap-c")) return;
    const to = chars[i];
    if (!first && old[i] === to) return;
    const steps = flapSteps(first ? "" : old[i] ?? "", to, first ? 3 + i : 1);
    if (first && steps.length < 2) return; // "/", "%" and such don't turn
    cell.classList.add("is-rolling");
    cell.textContent = first ? steps[0] : old[i] ?? steps[0];
    let k = first ? 1 : 0;
    const tick = () => {
      if (runs.get(el) !== run) return;
      if (k >= steps.length) {
        cell.textContent = to;
        cell.classList.remove("is-rolling");
        return;
      }
      cell.textContent = steps[k++];
      setTimeout(tick, TICK);
    };
    setTimeout(tick, TICK);
  });
}
