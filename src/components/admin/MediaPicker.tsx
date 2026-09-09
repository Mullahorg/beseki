import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { mediaUrl, type MediaRecord } from "@/lib/media";
import { MediaUploader } from "@/components/admin/MediaUploader";

function useMediaList(search: string) {
  return useQuery({
    queryKey: ["admin", "media", search],
    queryFn: async () => {
      let q = supabase
        .from("media")
        .select("id,path,file_name,alt,category,width,height,size_bytes,url,caption,mime_type,created_at")
        .order("created_at", { ascending: false })
        .limit(60);
      if (search.trim()) q = q.ilike("file_name", `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as MediaRecord[];
    },
  });
}

/** Choose one image from the media library, or upload a new one. */
export function MediaPicker({ value, onChange }: { value: string | null; onChange: (id: string | null) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const list = useMediaList(search);

  const selected = useQuery({
    queryKey: ["admin", "media-one", value],
    enabled: Boolean(value),
    queryFn: async () => {
      const { data, error } = await supabase.from("media").select("*").eq("id", value!).maybeSingle();
      if (error) throw error;
      return data as MediaRecord | null;
    },
  });

  return (
    <div className="flex items-center gap-3">
      {selected.data ? (
        <div className="relative">
          <img
            src={mediaUrl(selected.data.path, "thumb")}
            alt={selected.data.alt || selected.data.file_name}
            loading="lazy"
            className="size-20 rounded-md border object-cover"
          />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 rounded-full bg-background p-1 shadow ring-1 ring-border"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex size-20 items-center justify-center rounded-md border border-dashed text-muted-foreground">
          <ImagePlus className="size-5" aria-hidden="true" />
        </div>
      )}
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        {value ? "Change image" : "Choose image"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>Media library</DialogTitle>
          <MediaUploader category="Homepage" onUploaded={() => list.refetch()} compact />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name"
            aria-label="Search media"
            className="mt-3 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring"
          />
          <div className="mt-4 grid max-h-[50vh] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
            {list.isLoading
              ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square w-full" />)
              : null}
            {list.data?.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                No images yet. Upload one above.
              </p>
            ) : null}
            {list.data?.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onChange(m.id);
                  setOpen(false);
                }}
                className="overflow-hidden rounded-md border hover:ring-2 hover:ring-ring"
              >
                <img
                  src={mediaUrl(m.path, "thumb")}
                  alt={m.alt || m.file_name}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
