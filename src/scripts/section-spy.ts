// Highlights the link for the section you're reading in a sidebar of
// in-page links (walkthroughs, Projects, Résumé): the link gets
// aria-current="location", and the page styles that.
export function spySections(selector: string, offset = 160) {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(selector)).filter(
    (link) => link.hash,
  );
  const sections = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  let pending = false;
  function update() {
    pending = false;
    let active = -1;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= offset) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  const schedule = () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("pageshow", schedule);
  update();
}
