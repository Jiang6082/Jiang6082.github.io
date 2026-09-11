import catalog from "./photos.json";
// Use npm run photos:manage to edit the catalog in photos.json.
// Hidden photographs remain in the catalog but are omitted from both galleries.
export interface Photo {
  hidden?: boolean;
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

export const collections: Collection[] = catalog.collections
  .map((c) => ({ ...c, photos: c.photos.filter((p) => !(p as Photo).hidden) }))
  .filter((c) => c.photos.length);
export const singles: Photo[] = catalog.singles.filter((p: Photo) => !p.hidden);
