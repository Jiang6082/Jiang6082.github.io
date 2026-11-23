// Split-flap display: one cell per character. Used at build time (set:html)
// and in the browser when numbers change.
const esc = (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c;
export const flapHTML = (text) =>
  [...String(text)]
    .map((c) => (c === " " ? '<span class="flap-gap"></span>' : `<span class="flap-c">${esc(c)}</span>`))
    .join("");
