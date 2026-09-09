import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading, Saving } from "@/components/admin/AdminBits";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Field, TextInput, TextArea } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: Homepage,
});

type Section = Record<string, any>;

function Homepage() {
  const qc = useQueryClient();
  const [edits, setEdits] = useState<Record<string, Section>>({});

  const sections = useQuery({
    queryKey: ["admin", "page_sections", "home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .eq("page_slug", "home")
        .order("position", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (section: Section) => {
      const { error } = await supabase
        .from("page_sections")
        .update({
          heading: section["heading"],
          subheading: section["subheading"],
          body: section["body"],
          media_id: section["media_id"],
          enabled: section["enabled"],
          position: section["position"],
        })
        .eq("id", section["id"]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Section saved");
      qc.invalidateQueries({ queryKey: ["admin", "page_sections", "home"] });
    },
    onError: (e: Error) => toast.error("Could not save", { description: e.message }),
  });

  if (sections.isLoading) return <AdminLoading />;
  if (sections.isError) return <AdminError />;

  return (
    <>
      <AdminHeader title="Homepage" description="Headlines, images and visibility for each block of the homepage." />

      {sections.data?.length === 0 ? (
        <AdminEmpty title="No sections yet" message="Homepage sections will appear here once they are set up." />
      ) : null}

      <div className="space-y-4">
        {sections.data?.map((raw) => {
          const section = { ...raw, ...(edits[raw.id] ?? {}) } as Section;
          const update = (key: string, value: unknown) =>
            setEdits((e) => ({ ...e, [raw.id]: { ...(e[raw.id] ?? {}), [key]: value } }));

          return (
            <AdminCard key={raw.id}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-bold capitalize">{String(section["section_key"]).replace(/-/g, " ")}</h2>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(section["enabled"])}
                    onChange={(e) => update("enabled", e.target.checked)}
                    className="size-4 rounded border-input"
                  />
                  Show on homepage
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Heading" htmlFor={`h-${raw.id}`}>
                  <TextInput
                    id={`h-${raw.id}`}
                    value={section["heading"] ?? ""}
                    onChange={(e) => update("heading", e.target.value)}
                  />
                </Field>
                <Field label="Subheading" htmlFor={`s-${raw.id}`}>
                  <TextInput
                    id={`s-${raw.id}`}
                    value={section["subheading"] ?? ""}
                    onChange={(e) => update("subheading", e.target.value)}
                  />
                </Field>
                <Field label="Body text" htmlFor={`b-${raw.id}`} className="md:col-span-2">
                  <TextArea
                    id={`b-${raw.id}`}
                    value={section["body"] ?? ""}
                    onChange={(e) => update("body", e.target.value)}
                  />
                </Field>
                <Field label="Image" htmlFor={`m-${raw.id}`} className="md:col-span-2">
                  <MediaPicker value={section["media_id"] ?? null} onChange={(v) => update("media_id", v)} />
                </Field>
              </div>
              <div className="mt-4">
                <Button onClick={() => save.mutate(section)} disabled={save.isPending}>
                  <Saving show={save.isPending} /> Save section
                </Button>
              </div>
            </AdminCard>
          );
        })}
      </div>
    </>
  );
}
