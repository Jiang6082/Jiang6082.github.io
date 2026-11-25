// Split-flap display: one cell per character. flapHTML renders the cells
// (build time and browser); rollFlap animates them like a departure board.
const esc = (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c;
export const flapHTML = (text) =>
  [...String(text)]
    .map((c) => (c === " " ? '<span class="flap-gap"></span>' : `<span class="flap-c">${esc(c)}</span>`))
    .join("");

const DIGITS = "0123456789";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const reduced = () =>
  typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Show `text` in `el`, flicking each cell through random characters first. */
export function rollFlap(el, text = el.textContent ?? "") {
  el.innerHTML = flapHTML(text);
  el.setAttribute("aria-label", text);
  if (reduced()) return;
  const cells = [...el.querySelectorAll(".flap-c")];
  cells.forEach((cell, i) => {
    const final = cell.textContent;
    const pool = DIGITS.includes(final) ? DIGITS : LETTERS.includes(final) ? LETTERS : "";
    if (!pool) return;
    const stopAt = performance.now() + 260 + i * 110;
    cell.classList.add("is-rolling");
    const tick = () => {
      if (performance.now() >= stopAt) {
        cell.textContent = final;
        cell.classList.remove("is-rolling");
        return;
      }
      cell.textContent = pool[Math.floor(Math.random() * pool.length)];
      setTimeout(tick, 55);
    };
    tick();
  });
}
