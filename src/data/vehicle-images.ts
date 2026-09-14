```ts
/**
 * Vehicle image resolver
 *
 * Vehicle records can contain:
 * - Supabase Storage paths
 * - Supabase public URLs
 * - legacy /api/public/media/... URLs
 * - bundled/local image keys
 *
 * Supabase Storage is the preferred source.
 */

import { mediaUrl } from "@/lib/media";

/**
 * Legacy bundled vehicle assets.
 *
 * These remain as fallbacks for older/demo vehicle records
 * that still reference these filenames.
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

/**
 * Legacy local image map.
 *
 * These are only used when a vehicle record references
 * one of these old bundled filenames.
 */
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
 * Extracts a clean Storage path from any supported
 * vehicle image URL/path.
 */
function normalisePath(value: string): string {
  if (!value) return "";

  let input = value.trim();

  /**
   * Supabase Storage public URL:
   *
   * https://project.supabase.co/storage/v1/object/public/media/vehicles/car.jpg
   */
  const publicMatch = input.match(
    /\/storage\/v1\/object\/public\/media\/(.+?)(?:\?.*)?$/i,
  );

  if (publicMatch?.[1]) {
    return decodeURIComponent(publicMatch[1]);
  }

  /**
   * Supabase authenticated/render URL.
   */
  const authenticatedMatch = input.match(
    /\/storage\/v1\/(?:object|render\/image)\/(?:authenticated|public)\/media\/(.+?)(?:\?.*)?$/i,
  );

  if (authenticatedMatch?.[1]) {
    return decodeURIComponent(authenticatedMatch[1]);
  }

  /**
   * Legacy application URL:
   *
   * /api/public/media/vehicles/car.jpg
   */
  const legacyMatch = input.match(
    /^\/?api\/public\/media\/(.+?)(?:\?.*)?$/i,
  );

  if (legacyMatch?.[1]) {
    return decodeURIComponent(legacyMatch[1]);
  }

  /**
   * A normal Storage path:
   *
   * vehicles/car.jpg
   */
  if (!/^https?:\/\//i.test(input)) {
    return input.replace(/^\/+/, "");
  }

  return "";
}

/**
 * Resolves a single vehicle image.
 *
 * Priority:
 *
 * 1. Supabase Storage
 * 2. Legacy bundled local asset
 * 3. Original external URL
 */
export function resolveVehicleImage(
  value: string | null | undefined,
): string {
  if (!value) return "";

  const input = value.trim();

  if (!input) return "";

  /**
   * First check whether this is a legacy bundled filename.
   */
  const localImage = vehicleImages[input];

  if (localImage) {
    return localImage;
  }

  /**
   * Extract a Storage path from the value.
   */
  const path = normalisePath(input);

  if (path) {
    const resolved = mediaUrl(path, "card");

    if (resolved) {
      return resolved;
    }
  }

  /**
   * If it is a normal external URL that isn't a Supabase
   * Storage URL, keep it unchanged.
   */
  if (/^https?:\/\//i.test(input)) {
    return input;
  }

  return "";
}

/**
 * Resolves multiple vehicle image keys/URLs.
 *
 * Database URLs are preferred over old bundled assets.
 */
export function resolveImages(
  keys: string[] = [],
  urls: string[] = [],
): string[] {
  const resolved: string[] = [];

  /**
   * 1. Resolve database URLs/paths first.
   */
  for (const url of urls) {
    const image = resolveVehicleImage(url);

    if (image && !resolved.includes(image)) {
      resolved.push(image);
    }
  }

  /**
   * 2. Resolve image keys.
   *
   * This supports older vehicle records such as:
   *
   * ["prado-1.jpg", "prado-2.jpg"]
   */
  for (const key of keys) {
    const image = resolveVehicleImage(key);

    if (image && !resolved.includes(image)) {
      resolved.push(image);
    }
  }

  /**
   * 3. Final fallback.
   *
   * Prevents broken image elements when a vehicle has
   * no usable image.
   */
  if (!resolved.length) {
    resolved.push(sedan1);
  }

  return resolved;
}

/**
 * Resolve a vehicle's primary image.
 *
 * Useful for vehicle cards and featured vehicles.
 */
export function resolvePrimaryVehicleImage(
  keys: string[] = [],
  urls: string[] = [],
): string {
  const images = resolveImages(keys, urls);

  return images[0] ?? sedan1;
}

/**
 * Resolve an image specifically from a Supabase media path.
 *
 * Useful when vehicle_media.media.path is available directly.
 */
export function resolveVehicleMediaPath(
  path: string | null | undefined,
): string {
  if (!path) return "";

  return mediaUrl(path, "card");
}
```
