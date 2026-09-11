/** Map scroll position to photo geometry and crossfades. */
export function openingState(progress) {
  const p = Math.max(0, Math.min(1, progress));
  const ramp = (a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
  const expand = ramp(0, 0.42),
    eased = expand * expand * (3 - 2 * expand);
  const second = ramp(0.5, 0.64),
    third = ramp(0.77, 0.91);
  return {
    left: 59 * (1 - eased),
    width: 38 + 62 * eased,
    top: 12 - 6 * eased,
    height: 72 + 14 * eased,
    copyOpacity: 1 - ramp(0, 0.24),
    opacities: [1, second, third],
    active: third >= 0.5 ? 2 : second >= 0.5 ? 1 : 0,
  };
}
