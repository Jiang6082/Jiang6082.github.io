import assert from "node:assert/strict";
import { attachFilmstripWheel } from "../src/lib/filmstrip-wheel.js";
const listeners = {};
const classes = new Set();
const element = {
  scrollWidth: 2400,
  clientWidth: 800,
  clientHeight: 500,
  scrollLeft: 0,
  classList: {
    add: (name) => classes.add(name),
    remove: (name) => classes.delete(name),
  },
  addEventListener: (name, fn) => (listeners[name] = fn),
  scrollTo({ left }) {
    this.scrollLeft = left;
  },
};
let enabled = true;
attachFilmstripWheel(element, () => enabled);
const wheel = (props) => {
  let prevented = false;
  listeners.wheel({
    deltaX: 0,
    deltaY: 100,
    deltaMode: 0,
    cancelable: true,
    preventDefault() {
      prevented = true;
    },
    ...props,
  });
  return prevented;
};
assert.equal(
  wheel({ deltaY: -100 }),
  false,
  "Top edge must release page scrolling",
);
assert.equal(wheel({}), true);
assert.equal(element.scrollLeft, 100);
assert.equal(wheel({}), true);
assert.equal(element.scrollLeft, 200, "Short wheel steps accumulate");
assert.equal(wheel({ deltaY: -50 }), true);
assert.equal(element.scrollLeft, 150);
assert.equal(wheel({ deltaY: 3, deltaMode: 1 }), true);
assert.equal(element.scrollLeft, 198);
assert.equal(wheel({ deltaY: 1, deltaMode: 2 }), true);
assert.equal(element.scrollLeft, 698);
for (const props of [
  { ctrlKey: true },
  { metaKey: true },
  { shiftKey: true },
  { deltaX: 120 },
  { cancelable: false },
])
  assert.equal(wheel(props), false);
assert.equal(
  element.scrollLeft,
  698,
  "Zoom and horizontal gestures must remain native",
);
wheel({ deltaY: 9999 });
assert.equal(element.scrollLeft, 1600);
assert.equal(wheel({}), false, "Bottom edge must release page scrolling");
enabled = false;
assert.equal(
  wheel({ deltaY: -100 }),
  false,
  "Contact sheet must retain normal scrolling",
);
listeners.pointerleave();
assert(!classes.has("wheel-browsing"));
element.scrollWidth = 800;
enabled = true;
assert.equal(wheel({}), false, "Single-frame galleries must not trap the page");
console.log(
  "Passed: wheel direction, accumulation, delta modes, boundaries, zoom, horizontal input and non-filmstrip fallback.",
);
