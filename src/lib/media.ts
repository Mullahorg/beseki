import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";

export type MediaCategory =
  | "Vehicles"
  | "Showroom"
  | "Team"
  | "Blog"
  | "Homepage"
  | "Pages"
  | "Testimonials"
  | "Services"
  | "Branding"
  | "Other";

export const mediaCategories: MediaCategory[] = [
  "Vehicles",
  "Showroom",
  "Team",
  "Blog",
  "Homepage",
  "Pages",
  "Testimonials",
  "Services",
  "Branding",
  "Other",
];

export interface MediaRecord {
  id: string;
  path: string;
  url: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt: string;
  caption: string;
  category: string;
  created_at: string;
}

/**
 * Standard image widths used across the site.
 *
 * Cards should normally use "card".
 * Larger displays can use "medium" or "large".
 * "original" returns the original Storage object.
 */
export const imageSizes = {
  thumb: 160,
  card: 640,
  medium: 1024,
  large: 1600,
} as const;

export type ImageSize = keyof typeof imageSizes | "original";

/**
 * Get the configured Supabase project URL.
 *
 * VITE_SUPABASE_URL must be configured in the production
 * environment (for example, Vercel).
 */
function getSupabaseProjectUrl(): string {
  const projectUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;

  if (!projectUrl) {
    console.error(
      "VITE_SUPABASE_URL is not configured. Media cannot be loaded from Supabase Storage.",
    );

    return "";
  }

  return projectUrl.replace(/\/+$/, "");
}

/**
 * Normalizes a media path stored in the database.
 *
 * Older media records may contain:
 *   /api/public/media/vehicles/example.jpg
 *
 * Newer records may contain:
 *   vehicles/example.jpg
 *
 * Some records may contain a complete Supabase URL.
 */
function normalizeMediaPath(path: string): string {
  if (!path) return "";

  let normalized = path.trim();

  // Remove accidental leading slashes.
  normalized = normalized.replace(/^\/+/, "");

  // Remove the old API media prefix.
  normalized = normalized.replace(/^api\/public\/media\//i, "");

  // Also handle the original form if it somehow survived
  // the leading-slash normalization.
  normalized = normalized.replace(/^\/api\/public\/media\//i, "");

  // Remove Supabase Storage public URL if a URL was stored
  // in the path field accidentally.
  const supabaseStoragePattern = /\/storage\/v1\/object\/public\/media\/(.+)$/i;

  const supabaseMatch = normalized.match(supabaseStoragePattern);

  if (supabaseMatch?.[1]) {
    normalized = supabaseMatch[1];
  }

  return normalized;
}

/**
 * Encodes each individual path segment while preserving "/".
 *
 * This is important for filenames containing spaces, brackets,
 * parentheses, apostrophes, or other special characters.
 */
function encodeStoragePath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

/**
 * Returns the public Supabase Storage URL for a media file.
 *
 * This function accepts:
 * - a normal Storage path
 * - an old /api/public/media/... path
 * - a complete http/https URL
 *
 * Example:
 *
 * mediaUrl("vehicles/toyota-prado.jpg")
 *
 * becomes:
 *
 * https://PROJECT.supabase.co/storage/v1/object/public/media/vehicles/toyota-prado.jpg
 */
export function mediaUrl(path: string, size: ImageSize = "card"): string {
  if (!path) return "";

  const trimmedPath = path.trim();

  // If the database already contains a complete URL,
  // keep it. This prevents breaking externally hosted images.
  if (/^https?:\/\//i.test(trimmedPath)) {
    return trimmedPath;
  }

  const cleanPath = normalizeMediaPath(trimmedPath);

  if (!cleanPath) return "";

  const projectUrl = getSupabaseProjectUrl();

  if (!projectUrl) {
    return "";
  }

  const encodedPath = encodeStoragePath(cleanPath);

  const url = `${projectUrl}/storage/v1/object/public/` + `${MEDIA_BUCKET}/${encodedPath}`;

  /**
   * Supabase Storage itself does not support the custom
   * ?w=640 transformation used by the old API route.
   *
   * Therefore, return the actual Storage URL rather than
   * generating URLs that may fail in production.
   */
  return url;
}

/**
 * Resolve a MediaRecord safely.
 *
 * Prefer the record's path over its stored URL because older
 * records may have URLs pointing to the old /api/public/media
 * endpoint.
 */
export function resolveMediaUrl(
  media: Pick<MediaRecord, "path" | "url"> | null | undefined,
  size: ImageSize = "card",
): string {
  if (!media) return "";

  // The path is the authoritative Storage location.
  if (media.path) {
    return mediaUrl(media.path, size);
  }

  // Fallback for legacy/incomplete records.
  if (media.url) {
    return mediaUrl(media.url, size);
  }

  return "";
}

/**
 * Generates a srcSet using the same Storage object at
 * different requested sizes.
 *
 * NOTE:
 * Supabase's standard public Storage URL does not perform
 * image resizing by simply adding ?w=640.
 *
 * We therefore return the same source URL for now rather
 * than generating broken transformation URLs.
 *
 * This keeps production images reliable.
 */
export function mediaSrcSet(path: string): string {
  const url = mediaUrl(path, "original");

  if (!url) return "";

  return url;
}

/**
 * Reads the dimensions of an uploaded image before it is
 * stored in the media library.
 */
function readDimensions(file: File): Promise<{
  width: number | null;
  height: number | null;
}> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve({
        width: null,
        height: null,
      });

      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });

      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      resolve({
        width: null,
        height: null,
      });

      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  });
}

/**
 * Creates a safe filename for Storage.
 *
 * Keeps filenames predictable and avoids problematic characters.
 */
function safeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-80);
}

/**
 * Uploads one file to Supabase Storage and records it
 * in the media library.
 */
export async function uploadMedia(
  file: File,
  options: {
    category: MediaCategory;
    alt?: string;
    caption?: string;
  },
): Promise<MediaRecord> {
  if (!file) {
    throw new Error("No file was provided.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded.");
  }

  const stamp = Date.now().toString(36);
  const fileName = safeName(file.name);

  const categoryFolder = options.category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const path = `${categoryFolder}/${stamp}-${fileName}`;

  /**
   * Upload to Supabase Storage.
   */
  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (uploadError) {
    throw uploadError;
  }

  try {
    /**
     * Read image dimensions after successful Storage upload.
     */
    const dims = await readDimensions(file);

    /**
     * Always store the canonical Supabase public URL.
     *
     * This prevents new records from receiving the old
     * /api/public/media/... URL format.
     */
    const publicUrl = mediaUrl(path, "original");

    if (!publicUrl) {
      throw new Error("Unable to generate the public media URL. Check VITE_SUPABASE_URL.");
    }

    /**
     * Create the media-library database record.
     */
    const { data, error } = await supabase
      .from("media")
      .insert({
        bucket: MEDIA_BUCKET,
        path,
        url: publicUrl,
        file_name: file.name,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
        width: dims.width,
        height: dims.height,
        alt: options.alt ?? "",
        caption: options.caption ?? "",
        category: options.category,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as MediaRecord;
  } catch (error) {
    /**
     * If creating the media database record fails,
     * remove the Storage file so we don't leave orphaned
     * files behind.
     */
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);

    throw error;
  }
}

/**
 * Deletes both:
 * 1. the media-library database record
 * 2. the physical Supabase Storage file
 */
export async function deleteMedia(record: Pick<MediaRecord, "id" | "path">): Promise<void> {
  if (!record.id) {
    throw new Error("Media record ID is required.");
  }

  if (!record.path) {
    throw new Error("Media storage path is required.");
  }

  /**
   * Delete the database record first.
   */
  const { error: databaseError } = await supabase.from("media").delete().eq("id", record.id);

  if (databaseError) {
    throw databaseError;
  }

  /**
   * Then remove the actual Storage object.
   */
  const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove([record.path]);

  if (storageError) {
    console.error(
      "Media database record deleted, but Storage file could not be removed:",
      storageError,
    );

    throw storageError;
  }
}

/**
 * Converts bytes into a readable file size.
 */
export function formatBytes(bytes: number): string {
  if (!bytes) return "—";

  const units = ["B", "KB", "MB", "GB"];

  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}
