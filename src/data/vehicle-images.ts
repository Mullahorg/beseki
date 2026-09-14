```ts
/**
 * Vehicle photo library.
 *
 * Database vehicle records can contain:
 * - bundled image keys such as "prado-1.jpg"
 * - Supabase Storage paths such as "vehicles/prado.jpg"
 * - Supabase public URLs
 * - legacy /api/public/media/... URLs
 *
 * Supabase Storage is preferred for database-managed images.
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

import { mediaUrl } from "@/lib/media";

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
 * Converts a legacy media URL into a Storage path.
 *
 * Example:
 * /api/public/media/vehicles/prado.jpg
 *
 * becomes:
 * vehicles/prado.jpg
 */
function extractStoragePath(value: string): string {
  if (!value) return "";

  const input = value.trim();

  if (!input) return "";

  // Legacy application URL.
  const legacyMatch = input.match(
    /^\/?api\/public\/media\/(.+?)(?:\?.*)?$/i,
  );

  if (legacyMatch?.[1]) {
    return decodeURIComponent(legacyMatch[1]);
  }

  // Supabase public Storage URL.
  const publicMatch = input.match(
    /\/storage\/v1\/object\/public\/media\/(.+?)(?:\?.*)?$/i,
  );

  if (publicMatch?.[1]) {
    return decodeURIComponent(publicMatch[1]);
  }

  // Supabase authenticated/render URL.
  const renderMatch = input.match(
    /\/storage\/v1\/(?:object|render\/image)\/(?:public|authenticated)\/media\/(.+?)(?:\?.*)?$/i,
  );

  if (renderMatch?.[1]) {
    return decodeURIComponent(renderMatch[1]);
  }

  // Already a Storage path.
  if (!/^https?:\/\//i.test(input)) {
    return input.replace(/^\/+/, "");
  }

  return "";
}

/**
 * Resolve one vehicle image.
 */
export function resolveVehicleImage(
  value: string | null | undefined,
): string {
  if (!value) return "";

  const input = value.trim();

  if (!input) return "";

  /**
   * First check bundled assets.
   */
  if (vehicleImages[input]) {
    return vehicleImages[input];
  }

  /**
   * Handle Storage paths and legacy URLs.
   */
  const storagePath = extractStoragePath(input);

  if (storagePath) {
    return mediaUrl(storagePath, "card");
  }

  /**
   * Keep unrelated external URLs unchanged.
   */
  if (/^https?:\/\//i.test(input)) {
    return input;
  }

  return "";
}

/**
 * Resolve all images associated with a vehicle.
 *
 * URLs are checked first because they represent the current
 * database-managed vehicle images.
 *
 * Bundled image keys are used as a fallback.
 */
export function resolveImages(
  keys: string[] = [],
  urls: string[] = [],
): string[] {
  const images: string[] = [];

  // Database / Storage images first.
  for (const url of urls) {
    const resolved = resolveVehicleImage(url);

    if (resolved && !images.includes(resolved)) {
      images.push(resolved);
    }
  }

  // Legacy bundled images second.
  for (const key of keys) {
    const resolved = resolveVehicleImage(key);

    if (resolved && !images.includes(resolved)) {
      images.push(resolved);
    }
  }

  // Final fallback.
  if (!images.length) {
    images.push(sedan1);
  }

  return images;
}
```
