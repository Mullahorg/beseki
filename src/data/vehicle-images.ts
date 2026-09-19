/**
 * Vehicle image resolver.
 *
 * Supports:
 * - bundled fallback vehicle photos
 * - Supabase Storage paths
 * - Supabase public URLs
 * - legacy /api/public/media/... URLs
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

function extractStoragePath(value: string): string {
  const input = value.trim();

  if (!input) return "";

  // Legacy site image route
  if (input.startsWith("/api/public/media/")) {
    return input.replace("/api/public/media/", "").split("?")[0] ?? "";
  }

  // Supabase public Storage URL
  const publicMarker = "/storage/v1/object/public/media/";

  if (input.includes(publicMarker)) {
    const path = input.split(publicMarker)[1];

    return path ? (path.split("?")[0] ?? "") : "";
  }

  // Supabase render-image URL
  const renderMarker = "/storage/v1/render/image/public/media/";

  if (input.includes(renderMarker)) {
    const path = input.split(renderMarker)[1];

    return path ? (path.split("?")[0] ?? "") : "";
  }

  // Plain Storage path such as:
  // vehicles/toyota-prado-2018-front.jpg
  if (!input.startsWith("http://") && !input.startsWith("https://")) {
    return input.replace(/^\/+/, "");
  }

  return "";
}

/**
 * Resolve one vehicle image value into a usable browser URL.
 */
export function resolveVehicleImage(value: string | null | undefined): string {
  if (!value) return "";

  const input = value.trim();

  if (!input) return "";

  // Existing bundled vehicle photo
  if (vehicleImages[input]) {
    return vehicleImages[input];
  }

  // Convert Storage path / old API URL / Supabase URL
  // into the site's canonical media URL.
  const storagePath = extractStoragePath(input);

  if (storagePath) {
    return mediaUrl(storagePath, "card");
  }

  // Leave unrelated external URLs unchanged.
  if (input.startsWith("https://") || input.startsWith("http://")) {
    return input;
  }

  return "";
}

/**
 * IMPORTANT:
 * vehicles.functions.ts imports this function directly.
 *
 * Do not remove or rename this export.
 */
export function resolveImages(keys: string[] = [], urls: string[] = []): string[] {
  const images: string[] = [];

  // Prefer DB / Storage URLs first.
  for (const url of urls) {
    const resolved = resolveVehicleImage(url);

    if (resolved && !images.includes(resolved)) {
      images.push(resolved);
    }
  }

  // Then bundled keys / fallback image names.
  for (const key of keys) {
    const resolved = resolveVehicleImage(key);

    if (resolved && !images.includes(resolved)) {
      images.push(resolved);
    }
  }

  // Final fallback so vehicle cards never have an empty image array.
  if (images.length === 0) {
    images.push(sedan1);
  }

  return images;
}
