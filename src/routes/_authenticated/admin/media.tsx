import { useState, type SyntheticEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Cloud, Copy, ImageOff, Search, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminBits";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SelectInput, TextInput } from "@/components/forms/FormKit";
import { supabase } from "@/integrations/supabase/client";
import { deleteMedia, formatBytes, mediaCategories, mediaUrl, type MediaCategory, type MediaRecord } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaLibrary,
});

function MediaLibrary() {
  const qc = useQueryClient();
  const [category, setCategory] = useState<MediaCategory>("Vehicles");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const selected = list.data?.find((item) => item.id === selectedId) ?? list.data?.[0] ?? null;

  return (
    <>
      <AdminHeader title="Media library" description="Upload once, then use the same image anywhere on the website." />

      <section className="overflow-hidden rounded-xl border border-admin-line bg-admin-surface text-admin-foreground shadow-lift">
        <div className="flex flex-wrap items-center gap-3 border-b border-admin-line px-4 py-4 md:px-6">
          <div className="min-w-[12rem] flex-1">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-admin-muted" />
              <TextInput
                value={search}
                aria-label="Search photos"
                placeholder="Search assets..."
                onChange={(e) => setSearch(e.target.value)}
                className="border-admin-line bg-admin-panel pl-10 text-admin-foreground placeholder:text-admin-muted focus-visible:border-admin-focus"
              />
            </div>
          </div>
          <div className="w-44">
          <SelectInput
              value={filter}
              aria-label="Filter category"
              onChange={(e) => setFilter(e.target.value)}
              className="border-admin-line bg-admin-panel text-admin-foreground"
            >
              <option value="all">All categories</option>
              {mediaCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </SelectInput>
          </div>
          <div className="w-40">
            <SelectInput value={category} aria-label="Upload category" onChange={(e) => setCategory(e.target.value as MediaCategory)} className="border-admin-line bg-admin-panel text-admin-foreground">
              {mediaCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </SelectInput>
          </SelectInput>
        </div>
        </div>
        <div className="border-b border-admin-line p-4 md:px-6">
          <MediaUploader category={category} onUploaded={(records) => {
            setSelectedId(records[0]?.id ?? null);
            qc.invalidateQueries({ queryKey: ["admin", "media-library"] });
          }} compact />
        </div>

        <div className="grid min-h-[34rem] lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="p-4 md:p-6">
            {list.isLoading ? <AdminLoading /> : null}
            {list.isError ? <AdminError /> : null}
            {list.data?.length === 0 ? <AdminEmpty title="No photos yet" message="Upload photos above and they become available everywhere in the admin." /> : null}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {list.data?.map((m) => (
                <button key={m.id} type="button" onClick={() => setSelectedId(m.id)} className={cn("group relative aspect-square overflow-hidden rounded-lg border border-admin-line bg-admin-panel text-left transition-all duration-300 hover:-translate-y-1 hover:border-admin-muted/50", selected?.id === m.id && "ring-2 ring-admin-focus ring-offset-2 ring-offset-admin-surface")}>
                  <MediaPreview record={m} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-admin-canvas via-admin-canvas/85 to-transparent p-3 pt-10">
                    <p className="truncate text-xs font-semibold">{m.file_name}</p>
                    <p className="mt-0.5 text-[10px] text-admin-muted">{m.category} · {formatBytes(m.size_bytes)}</p>
                  </div>
                  {selected?.id === m.id ? <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-admin-focus"><Check className="size-3.5" /></span> : null}
                </button>
              ))}
            </div>
          </div>

          <aside className="border-t border-admin-line bg-admin-panel p-5 lg:border-l lg:border-t-0">
            {selected ? (
              <div className="flex h-full flex-col">
                <div className="overflow-hidden rounded-lg border border-admin-line"><MediaPreview record={selected} /></div>
                <h2 className="mt-4 break-words text-base font-semibold">{selected.file_name}</h2>
                <p className="mt-1 text-[11px] uppercase text-admin-muted">{selected.mime_type} · {formatBytes(selected.size_bytes)}</p>
                <label className="mt-5 text-[11px] font-semibold uppercase text-admin-muted" htmlFor="selected-alt">Alt text</label>
                <TextInput id="selected-alt" key={selected.id} defaultValue={selected.alt} placeholder="Describe this image" className="mt-2 border-admin-line bg-admin-surface text-admin-foreground" onBlur={(e) => { if (e.target.value !== selected.alt) saveAlt.mutate({ id: selected.id, alt: e.target.value }); }} />
                <p className="mt-5 text-[11px] font-semibold uppercase text-admin-muted">File path</p>
                <div className="mt-2 flex items-center gap-2 rounded-md border border-admin-line bg-admin-surface p-2">
                  <code className="min-w-0 flex-1 truncate text-[10px] text-admin-focus">{selected.path}</code>
                  <Button variant="ghost" size="iconSm" aria-label="Copy file path" onClick={() => navigator.clipboard.writeText(selected.path)}><Copy /></Button>
                </div>
                <div className="mt-auto pt-6">
                  <Button variant="destructive" className="w-full" onClick={() => { if (confirm("Delete this photo? Anywhere it is used will lose the image.")) remove.mutate(selected); }}><Trash2 /> Delete permanently</Button>
                </div>
              </div>
            ) : <div className="grid h-full place-items-center text-center text-sm text-admin-muted"><div><Cloud className="mx-auto mb-3 size-7" /><p>Select an image to view details.</p></div></div>}
          </aside>
        </div>

        <footer className="flex items-center justify-between border-t border-admin-line bg-admin-canvas px-4 py-3 text-[11px] text-admin-muted md:px-6">
          <span>{list.data?.length ?? 0} assets</span>
          <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-success" /> Cloud synced</span>
        </footer>
      </section>
    </>
  );
}

function MediaPreview({ record }: { record: MediaRecord }) {
  const [failed, setFailed] = useState(false);
  const onError = (_event: SyntheticEvent<HTMLImageElement>) => setFailed(true);
  return failed ? (
    <div className="flex aspect-square w-full flex-col items-center justify-center bg-admin-canvas p-4 text-center text-admin-muted"><ImageOff className="size-7" /><span className="mt-2 text-[10px]">Preview unavailable</span></div>
  ) : (
    <img src={mediaUrl(record.path, "card")} alt={record.alt || record.file_name} loading="lazy" width={record.width ?? undefined} height={record.height ?? undefined} onError={onError} className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
  );
}
