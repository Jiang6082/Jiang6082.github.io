// Add originals to photos-src/, run npm run photos, then register them below.
// Titles/captions describe visible subjects. Add dates and locations only when known.
export interface Photo {
  src?: string;
  title?: string;
  caption?: string;
  alt?: string;
  location?: string;
  date?: string;
  ar?: number;
  placeholder?: boolean;
}
export interface Collection {
  id: string;
  title: string;
  description?: string;
  photos: Photo[];
}
export const collections: Collection[] = [
  {
    id: "in-transit",
    title: "In transit",
    description: "Trains, tracks, and the streets around them.",
    photos: [
      {
        src: "IMG_0116.jpg",
        title: "Along the tracks",
        caption: "A green and yellow train beside the road.",
        alt: "A green and yellow electric train approaching on tracks beside a road",
      },
      {
        src: "IMG_0460.jpg",
        title: "Above the market",
        caption: "A train passes above a crowded shopping street.",
        alt: "A commuter train above a busy market street surrounded by colorful signs",
      },
      {
        src: "IMG_0484.jpg",
        title: "Parallel lines",
        caption: "Several trains sharing the same view.",
        alt: "High-speed and commuter trains on parallel tracks below city buildings",
      },
      {
        src: "IMG_0766.jpg",
        title: "Up the hillside",
        caption: "A tram with the harbor in the background.",
        alt: "A green tram climbing a wooded hillside above a hazy harbor skyline",
      },
    ],
  },
  {
    id: "light-reflections",
    title: "Light & reflections",
    description: "Hanging gardens and reflected light.",
    photos: [
      {
        src: "IMG_0298.jpg",
        title: "Reflected",
        caption: "A figure among reflections and suspended shapes.",
        alt: "A person with a camera reflected among dark hanging objects and streaks of light",
      },
      {
        src: "IMG_0334.jpg",
        title: "Hanging garden",
        caption: "Orchids suspended at different heights.",
        alt: "White, yellow, and purple orchids hanging among green leaves",
      },
    ],
  },
  {
    id: "open-air",
    title: "Open air",
    description: "Coastlines, blossoms, and bamboo.",
    photos: [
      {
        src: "IMG_0047.jpg",
        title: "Coastal road",
        caption: "The beach follows the curve of the road.",
        alt: "A sandy beach curving beside a coastal road and buildings under a blue sky",
      },
      {
        src: "IMG_0534.jpg",
        title: "Through the blossoms",
        caption: "A red tower framed by flowering branches.",
        alt: "A red tower and tiled roof seen through pink blossoms",
      },
      {
        src: "IMG_9433-2.jpg",
        title: "Among the bamboo",
        caption: "Small red gates against stone markers.",
        alt: "Red torii gates resting against stone markers in a bamboo grove",
      },
    ],
  },
];
// Ungrouped photographs appear under their own filter when populated.
export const singles: Photo[] = [];
