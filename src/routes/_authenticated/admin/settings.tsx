import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { AdminError, AdminLoading, Saving } from "@/components/admin/AdminBits";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Field, TextInput, TextArea } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: Settings,
});

type Settings = Record<string, any>;

function Settings() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Settings | null>(null);

  const settings = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings.data) setForm(settings.data as Settings);
  }, [settings.data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!form) return;
      const { id: _id, updated_at: _u, ...rest } = form;
      const { error } = await (supabase.from("site_settings") as any).update(rest).eq("id", true);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["admin", "site_settings"] });
    },
    onError: (e: Error) => toast.error("Could not save", { description: e.message }),
  });

  if (settings.isLoading) return <AdminLoading />;
  if (settings.isError || !form) return <AdminError />;

  const set = (key: string, value: unknown) => setForm((f) => ({ ...(f ?? {}), [key]: value }));
  const text = (key: string, label: string, hint?: string) => (
    <Field label={label} htmlFor={key} hint={hint}>
      <TextInput id={key} value={form[key] ?? ""} onChange={(e) => set(key, e.target.value)} />
    </Field>
  );

  return (
    <>
      <AdminHeader
        title="Site settings"
        description="Business details, contacts and branding used across the whole website."
        action={
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            <Saving show={save.isPending} /> Save settings
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-4 text-base font-bold">Business</h2>
          <div className="grid gap-5">
            {text("company_name", "Company name")}
            {text("short_name", "Short name")}
            <Field label="Tagline" htmlFor="tagline">
              <TextArea id="tagline" value={form["tagline"] ?? ""} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-base font-bold">Contact</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {text("phone_display", "Phone (shown)")}
            {text("phone_tel", "Phone (dial)", "Include the country code, e.g. +254...")}
            {text("whatsapp_number", "WhatsApp number")}
            {text("email", "Email")}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-base font-bold">Address</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {text("address_line1", "Address line 1")}
            {text("address_line2", "Address line 2")}
            {text("city", "City")}
            {text("postal", "Postal code")}
            {text("country", "Country")}
            {text("map_query", "Map search text", "Used for the map and directions link")}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-base font-bold">Branding</h2>
          <div className="grid gap-5">
            <Field label="Logo" htmlFor="logo">
              <MediaPicker value={form["logo_media_id"] ?? null} onChange={(v) => set("logo_media_id", v)} />
            </Field>
            <Field label="Favicon" htmlFor="favicon">
              <MediaPicker value={form["favicon_media_id"] ?? null} onChange={(v) => set("favicon_media_id", v)} />
            </Field>
            <Field label="Social share image" htmlFor="og">
              <MediaPicker value={form["og_media_id"] ?? null} onChange={(v) => set("og_media_id", v)} />
            </Field>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-base font-bold">Announcement bar</h2>
          <div className="grid gap-5">
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(form["announcement_enabled"])}
                onChange={(e) => set("announcement_enabled", e.target.checked)}
                className="size-4 rounded border-input"
              />
              Show the announcement bar
            </label>
            <Field label="Message" htmlFor="announcement">
              <TextInput
                id="announcement"
                value={form["announcement"] ?? ""}
                onChange={(e) => set("announcement", e.target.value)}
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="mb-4 text-base font-bold">Search listing defaults</h2>
          <div className="grid gap-5">
            {text("default_seo_title", "Default page title")}
            <Field label="Default description" htmlFor="default_seo_description">
              <TextArea
                id="default_seo_description"
                value={form["default_seo_description"] ?? ""}
                onChange={(e) => set("default_seo_description", e.target.value)}
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard className="lg:col-span-2">
          <h2 className="mb-1 text-base font-bold">WhatsApp messages</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            The text pre-filled when a customer taps a WhatsApp button. Placeholders like {"{vehicle}"} are replaced
            automatically.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {Object.entries((form["whatsapp_templates"] ?? {}) as Record<string, string>).map(([key, value]) => (
              <Field key={key} label={key.replace(/_/g, " ")} htmlFor={`wa-${key}`}>
                <TextArea
                  id={`wa-${key}`}
                  value={value}
                  onChange={(e) =>
                    set("whatsapp_templates", { ...(form["whatsapp_templates"] ?? {}), [key]: e.target.value })
                  }
                />
              </Field>
            ))}
          </div>
        </AdminCard>
      </div>

      <div className="mt-6">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          <Saving show={save.isPending} /> Save settings
        </Button>
      </div>
    </>
  );
}
