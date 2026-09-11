// Consume vertical wheel input only while the gallery can move in that direction.
export function attachFilmstripWheel(element, enabled) {
  const reset = () => element.classList.remove("wheel-browsing");
  const wheel = (event) => {
    if (
      !enabled() ||
      !event.cancelable ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    if (!event.deltaY || Math.abs(event.deltaX) >= Math.abs(event.deltaY))
      return;
    const max = Math.max(0, element.scrollWidth - element.clientWidth);
    const current = Math.max(0, Math.min(max, element.scrollLeft));
    if (
      (event.deltaY < 0 && current <= 1) ||
      (event.deltaY > 0 && current >= max - 1)
    )
      return;
    const unit =
      event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? element.clientHeight
          : 1;
    event.preventDefault();
    // Mandatory snap would undo short mouse-wheel steps. Restore it for touch,
    // explicit frame navigation, or when the pointer leaves the gallery.
    element.classList.add("wheel-browsing");
    element.scrollTo({
      left: Math.max(0, Math.min(max, current + event.deltaY * unit)),
      behavior: "instant",
    });
  };
  element.addEventListener("wheel", wheel, { passive: false });
  element.addEventListener("pointerleave", reset);
  element.addEventListener("pointerdown", reset);
  return reset;
}
