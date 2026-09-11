/**
 * Photo library. Database vehicle records store image keys (file names);
 * this map resolves them to bundled, optimised assets.
 * Replace these files with real BESEKI photography using the same names,
 * or store full https URLs on the vehicle record instead.
 */
import alphard1 from "@/assets/vehicles/alphard-1.jpg";
import alphard2 from "@/assets/vehicles/alphard-2.jpg";
import prado1 from "@/assets/vehicles/prado-1.jpg";
import prado2 from "@/assets/vehicles/prado-2.jpg";
import cx51 from "@/assets/vehicles/cx5-1.jpg";
import cx52 from "@/assets/vehicles/cx5-2.jpg";
import note1 from "@/assets/vehicles/note-1.jpg";
import note2 from "@/assets/vehicles/note-2.jpg";
import hilux1 from "@/assets/vehicles/hilux-1.jpg";
import hilux2 from "@/assets/vehicles/hilux-2.jpg";
import sedan1 from "@/assets/vehicles/sedan-1.jpg";
import sedan2 from "@/assets/vehicles/sedan-2.jpg";

export const vehicleImages: Record<string, string> = {
  "alphard-1.jpg": alphard1,
  "alphard-2.jpg": alphard2,
  "prado-1.jpg": prado1,
  "prado-2.jpg": prado2,
  "cx5-1.jpg": cx51,
  "cx5-2.jpg": cx52,
  "note-1.jpg": note1,
  "note-2.jpg": note2,
  "hilux-1.jpg": hilux1,
  "hilux-2.jpg": hilux2,
  "sedan-1.jpg": sedan1,
  "sedan-2.jpg": sedan2,
};

/**
 * Photos stored in our own library are served through the site's image route,
 * because the storage bucket is private. Older records may still hold a direct
 * storage link, so those are rewritten here.
 */
function normaliseUrl(url: string): string {
  const match = url.match(/\/storage\/v1\/(?:object|render\/image)\/(?:public|authenticated)\/media\/([^?]+)/);
  if (!match) return url;
  const path = match[1] ?? "";
  const width = url.match(/[?&]width=(\d+)/)?.[1];
  const base = `/api/public/media/${path}`;
  return width ? `${base}?w=${width}` : base;
}

export function resolveImages(keys: string[], urls: string[]): string[] {
  const fromKeys = keys.map((k) => vehicleImages[k]).filter((v): v is string => Boolean(v));
  const all = [...urls.filter(Boolean).map(normaliseUrl), ...fromKeys];
  return all.length ? all : [sedan1];
}
