// A fictional island organized by subject, not inferred geographic locations.
export const destinations = [
  {
    id: "railway",
    name: "Railway",
    x: -7,
    z: 1,
    photos: ["IMG_0116.jpg", "IMG_0460.jpg", "IMG_0484.jpg", "IMG_0766.jpg"],
  },
  { id: "airfield", name: "Airfield", x: 5, z: -3, photos: [] },
  { id: "coast", name: "Coast", x: 6, z: 4, photos: ["IMG_0047.jpg"] },
  {
    id: "garden",
    name: "Garden",
    x: -3,
    z: -3,
    photos: ["IMG_0298.jpg", "IMG_0334.jpg", "IMG_0534.jpg", "IMG_9433-2.jpg"],
  },
  {
    id: "streets",
    name: "Streets",
    x: 0,
    z: 2,
    photos: ["IMG_0460.jpg", "IMG_0484.jpg", "IMG_0534.jpg"],
  },
];
export function photoDestinations(src: string) {
  return destinations
    .filter((d) => (d.photos as string[]).includes(src))
    .map((d) => d.id);
}
