import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading, Saving, StatusPill } from "@/components/admin/AdminBits";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Field, TextInput, TextArea, SelectInput } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { mediaUrl, type MediaRecord } from "@/lib/media";

export const Route = createFileRoute("/_authenticated/admin/galleries")({
  component: Galleries,
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Galleries() {
  const qc = useQueryClient();
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ title: string; slug: string; description: string; status: string } | null>(null);

  const list = useQuery({
    queryKey: ["admin", "galleries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("galleries").select("*").order("position", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!draft) return;
      const { error } = await supabase.from("galleries").insert({
        title: draft.title,
        slug: draft.slug || slugify(draft.title),
        description: draft.description,
        status: draft.status,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gallery created");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin", "galleries"] });
    },
    onError: (e: Error) => toast.error("Could not create", { description: e.message }),
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase.from("galleries").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "galleries"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("galleries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gallery deleted");
      qc.invalidateQueries({ queryKey: ["admin", "galleries"] });
    },
  });

  return (
    <>
      <AdminHeader
        title="Galleries"
        description="Grouped photo sets such as showroom, deliveries and events."
        action={
          <Button onClick={() => setDraft({ title: "", slug: "", description: "", status: "draft" })}>
            <Plus className="size-4" aria-hidden="true" /> New gallery
          </Button>
        }
      />

      {draft ? (
        <AdminCard className="mb-6">
          <form
            className="grid gap-5 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <Field label="Title" htmlFor="g-title" required>
              <TextInput id="g-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </Field>
            <Field label="Address" htmlFor="g-slug">
              <TextInput id="g-slug" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })} />
            </Field>
            <Field label="Description" htmlFor="g-desc" className="md:col-span-2">
              <TextArea id="g-desc" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </Field>
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit" disabled={create.isPending}>
                <Saving show={create.isPending} /> Create gallery
              </Button>
              <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </AdminCard>
      ) : null}

      {list.isLoading ? <AdminLoading /> : null}
      {list.isError ? <AdminError /> : null}
      {list.data?.length === 0 ? (
        <AdminEmpty title="No galleries yet" message="Create a gallery, then add photos to it." />
      ) : null}

      <div className="space-y-4">
        {list.data?.map((g) => (
          <AdminCard key={g.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold">{g.title}</h2>
                  <StatusPill status={g.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{g.description || `/${g.slug}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-36">
                  <SelectInput
                    aria-label="Gallery status"
                    value={g.status}
                    onChange={(e) => patch.mutate({ id: g.id, values: { status: e.target.value } })}
                  >
                    {["draft", "published", "archived"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </SelectInput>
                </div>
                <Button variant="outline" size="sm" onClick={() => setOpenId(openId === g.id ? null : g.id)}>
                  {openId === g.id ? "Close" : "Photos"}
                </Button>
                <button
                  type="button"
                  aria-label="Delete gallery"
                  onClick={() => {
                    if (confirm("Delete this gallery?")) remove.mutate(g.id);
                  }}
                  className="rounded p-2 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            {openId === g.id ? <GalleryItems galleryId={g.id} /> : null}
          </AdminCard>
        ))}
      </div>
    </>
  );
}

function GalleryItems({ galleryId }: { galleryId: string }) {
  const qc = useQueryClient();
  const key = ["admin", "gallery-items", galleryId];

  const items = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("id,position,media:media_id(*)")
        .eq("gallery_id", galleryId)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as { id: string; position: number; media: MediaRecord }[];
    },
  });

  const add = useMutation({
    mutationFn: async (records: MediaRecord[]) => {
      const start = items.data?.length ?? 0;
      const { error } = await supabase
        .from("gallery_items")
        .insert(records.map((m, i) => ({ gallery_id: galleryId, media_id: m.id, position: start + i })));
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
    onError: (e: Error) => toast.error("Could not add photos", { description: e.message }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return (
    <div className="mt-5 border-t pt-5">
      <MediaUploader category="Showroom" onUploaded={(records) => add.mutate(records)} compact />
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {items.data?.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg border">
            <img
              src={mediaUrl(item.media?.path ?? "", "thumb")}
              alt={item.media?.alt || "Gallery photo"}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove.mutate(item.id)}
              className="w-full py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
