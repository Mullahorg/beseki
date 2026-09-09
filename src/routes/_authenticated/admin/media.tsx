import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminBits";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SelectInput, TextInput } from "@/components/forms/FormKit";
import { supabase } from "@/integrations/supabase/client";
import { deleteMedia, formatBytes, mediaCategories, mediaUrl, type MediaCategory, type MediaRecord } from "@/lib/media";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaLibrary,
});

function MediaLibrary() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<MediaCategory>("Vehicles");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const list = useQuery({
    queryKey: ["admin", "media-library", filter, search],
    queryFn: async () => {
      let q = supabase.from("media").select("*").order("created_at", { ascending: false }).limit(200);
      if (filter !== "all") q = q.eq("category", filter);
      if (search.trim()) q = q.ilike("file_name", `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as MediaRecord[];
    },
  });

  const saveAlt = useMutation({
    mutationFn: async ({ id, alt }: { id: string; alt: string }) => {
      const { error } = await supabase.from("media").update({ alt }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Description saved"),
    onError: (e: Error) => toast.error("Could not save", { description: e.message }),
  });

  const remove = useMutation({
    mutationFn: (record: MediaRecord) => deleteMedia(record),
    onSuccess: () => {
      toast.success("Photo deleted");
      qc.invalidateQueries({ queryKey: ["admin", "media-library"] });
    },
    onError: (e: Error) => toast.error("Could not delete", { description: e.message }),
  });

  return (
    <>
      <AdminHeader title="Media library" description="Every photo used across the website lives here." />

      <AdminCard className="mb-6">
        <div className="mb-4 w-56">
          <SelectInput
            value={category}
            aria-label="Upload category"
            onChange={(e) => setCategory(e.target.value as MediaCategory)}
          >
            {mediaCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </div>
        <MediaUploader
          category={category}
          onUploaded={() => qc.invalidateQueries({ queryKey: ["admin", "media-library"] })}
        />
      </AdminCard>

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="w-48">
          <SelectInput value={filter} aria-label="Filter category" onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All categories</option>
            {mediaCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="w-64 max-w-full">
          <TextInput
            value={search}
            aria-label="Search photos"
            placeholder="Search file names"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {list.isLoading ? <AdminLoading /> : null}
      {list.isError ? <AdminError /> : null}
      {list.data?.length === 0 ? (
        <AdminEmpty title="No photos yet" message="Upload photos above and they become available everywhere in the admin." />
      ) : null}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.data?.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-xl border bg-card">
            <img
              src={mediaUrl(m.path, "card")}
              alt={m.alt || m.file_name}
              loading="lazy"
              width={m.width ?? undefined}
              height={m.height ?? undefined}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="space-y-2 p-3">
              <p className="truncate text-xs font-medium" title={m.file_name}>
                {m.file_name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {m.category} • {m.width && m.height ? `${m.width}×${m.height} • ` : ""}
                {formatBytes(m.size_bytes)}
              </p>
              <TextInput
                aria-label={`Description for ${m.file_name}`}
                defaultValue={m.alt}
                placeholder="Describe this photo"
                onBlur={(e) => {
                  if (e.target.value !== m.alt) saveAlt.mutate({ id: m.id, alt: e.target.value });
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this photo? Anywhere it is used will lose the image.")) remove.mutate(m);
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
