import { supabase } from "@/integrations/supabase/client";

export const MEDIA_BUCKET = "media";

export type MediaCategory =
  | "Vehicles"
  | "Showroom"
  | "Team"
  | "Blog"
  | "Homepage"
  | "Services"
  | "Branding"
  | "Other";

export const mediaCategories: MediaCategory[] = [
  "Vehicles",
  "Showroom",
  "Team",
  "Blog",
  "Homepage",
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

const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;

/** Sizes used across the site. Cards never request full-resolution files. */
export const imageSizes = {
  thumb: 160,
  card: 640,
  medium: 1024,
  large: 1600,
} as const;

export type ImageSize = keyof typeof imageSizes | "original";

/**
 * Public URL for a stored file. Named sizes go through the image
 * transformation endpoint so a card never downloads a 2000px photo.
 */
export function mediaUrl(path: string, size: ImageSize = "card"): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = SUPABASE_URL ?? "";
  if (size === "original") return `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
  const width = imageSizes[size];
  return `${base}/storage/v1/render/image/public/${MEDIA_BUCKET}/${path}?width=${width}&resize=contain&quality=78`;
}

/** srcset covering the common breakpoints for a stored photo. */
export function mediaSrcSet(path: string): string {
  if (!path || path.startsWith("http")) return "";
  return (["thumb", "card", "medium", "large"] as const)
    .map((s) => `${mediaUrl(path, s)} ${imageSizes[s]}w`)
    .join(", ");
}

function readDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) return resolve({ width: null, height: null });
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: null, height: null });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
}

/** Uploads one file to storage and records it in the media library. */
export async function uploadMedia(
  file: File,
  options: { category: MediaCategory; alt?: string; caption?: string },
): Promise<MediaRecord> {
  const stamp = Date.now().toString(36);
  const path = `${options.category.toLowerCase()}/${stamp}-${safeName(file.name)}`;

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  const dims = await readDimensions(file);

  const { data, error } = await supabase
    .from("media")
    .insert({
      bucket: MEDIA_BUCKET,
      path,
      url: mediaUrl(path, "original"),
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
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    throw error;
  }
  return data as MediaRecord;
}

/** Removes the stored file and its library record. */
export async function deleteMedia(record: Pick<MediaRecord, "id" | "path">) {
  const { error } = await supabase.from("media").delete().eq("id", record.id);
  if (error) throw error;
  await supabase.storage.from(MEDIA_BUCKET).remove([record.path]);
}

export function formatBytes(bytes: number) {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
