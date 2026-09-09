import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { AdminError, AdminLoading, Saving } from "@/components/admin/AdminBits";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { Field, TextInput, TextArea, SelectInput } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { mediaUrl, type MediaRecord } from "@/lib/media";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/vehicles/$id")({
  component: VehicleEditor,
});

type VehicleForm = {
  slug: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel: string;
  engine: string;
  body_type: string;
  drive_type: string;
  condition: string;
  color: string;
  interior_color: string;
  stock_number: string;
  description: string;
  features: string[];
  availability: string;
  published: boolean;
  featured: boolean;
  archived: boolean;
  video_url: string;
  seo_title: string;
  seo_description: string;
};

const blank: VehicleForm = {
  slug: "",
  make: "",
  model: "",
  variant: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  transmission: "Automatic",
  fuel: "Petrol",
  engine: "",
  body_type: "SUV",
  drive_type: "2WD",
  condition: "Locally Used",
  color: "",
  interior_color: "",
  stock_number: "",
  description: "",
  features: [],
  availability: "Available",
  published: false,
  featured: false,
  archived: false,
  video_url: "",
  seo_title: "",
  seo_description: "",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function VehicleEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState<VehicleForm>(blank);
  const [touchedSlug, setTouchedSlug] = useState(false);

  const vehicle = useQuery({
    queryKey: ["admin", "vehicle", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (vehicle.data) {
      const d = vehicle.data as Record<string, any>;
      setForm({
        ...blank,
        ...Object.fromEntries(Object.keys(blank).map((k) => [k, d[k] ?? blank[k as keyof VehicleForm]])),
      } as VehicleForm);
      setTouchedSlug(true);
    }
  }, [vehicle.data]);

  const set = <K extends keyof VehicleForm>(key: K, value: VehicleForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        slug: form.slug || slugify(`${form.year}-${form.make}-${form.model}-${form.variant}`),
        stock_number: form.stock_number || null,
        video_url: form.video_url || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
      };
      if (isNew) {
        const { data, error } = await supabase.from("vehicles").insert(payload).select("id").single();
        if (error) throw error;
        return data.id as string;
      }
      const { error } = await supabase.from("vehicles").update(payload).eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (newId) => {
      toast.success("Vehicle saved");
      qc.invalidateQueries({ queryKey: ["admin"] });
      if (isNew) navigate({ to: "/admin/vehicles/$id", params: { id: newId } });
    },
    onError: (e: Error) => toast.error("Could not save", { description: e.message }),
  });

  if (!isNew && vehicle.isLoading) return <AdminLoading />;
  if (!isNew && vehicle.isError) return <AdminError />;

  return (
    <>
      <Link to="/admin/vehicles" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Back to vehicles
      </Link>

      <AdminHeader
        title={isNew ? "Add vehicle" : `${form.year} ${form.make} ${form.model}`}
        description={isNew ? "Fill in the details, then add photos once saved." : `Web address: /inventory/${form.slug}`}
        action={
          <Button onClick={() => save.mutate()} disabled={save.isPending}>
            <Saving show={save.isPending} /> Save vehicle
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AdminCard>
            <h2 className="mb-4 text-base font-bold">Basics</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Make" htmlFor="make" required>
                <TextInput
                  id="make"
                  value={form.make}
                  onChange={(e) => {
                    set("make", e.target.value);
                    if (!touchedSlug) set("slug", slugify(`${form.year}-${e.target.value}-${form.model}`));
                  }}
                />
              </Field>
              <Field label="Model" htmlFor="model" required>
                <TextInput
                  id="model"
                  value={form.model}
                  onChange={(e) => {
                    set("model", e.target.value);
                    if (!touchedSlug) set("slug", slugify(`${form.year}-${form.make}-${e.target.value}`));
                  }}
                />
              </Field>
              <Field label="Variant / trim" htmlFor="variant">
                <TextInput id="variant" value={form.variant} onChange={(e) => set("variant", e.target.value)} />
              </Field>
              <Field label="Year" htmlFor="year" required>
                <TextInput
                  id="year"
                  inputMode="numeric"
                  value={String(form.year)}
                  onChange={(e) => set("year", Number(e.target.value.replace(/\D/g, "")) || 0)}
                />
              </Field>
              <Field label="Price (KES)" htmlFor="price" required>
                <TextInput
                  id="price"
                  inputMode="numeric"
                  value={String(form.price)}
                  onChange={(e) => set("price", Number(e.target.value.replace(/\D/g, "")) || 0)}
                />
              </Field>
              <Field label="Mileage (km)" htmlFor="mileage">
                <TextInput
                  id="mileage"
                  inputMode="numeric"
                  value={String(form.mileage)}
                  onChange={(e) => set("mileage", Number(e.target.value.replace(/\D/g, "")) || 0)}
                />
              </Field>
              <Field label="Stock number" htmlFor="stock">
                <TextInput id="stock" value={form.stock_number} onChange={(e) => set("stock_number", e.target.value)} />
              </Field>
              <Field label="Web address" htmlFor="slug" hint="Appears as /inventory/your-slug">
                <TextInput
                  id="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setTouchedSlug(true);
                    set("slug", slugify(e.target.value));
                  }}
                />
              </Field>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="mb-4 text-base font-bold">Specification</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Transmission" htmlFor="transmission">
                <SelectInput id="transmission" value={form.transmission} onChange={(e) => set("transmission", e.target.value)}>
                  {["Automatic", "Manual", "CVT", "DCT"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Fuel" htmlFor="fuel">
                <SelectInput id="fuel" value={form.fuel} onChange={(e) => set("fuel", e.target.value)}>
                  {["Petrol", "Diesel", "Hybrid", "Electric"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Engine" htmlFor="engine" hint="e.g. 2.5L 4-cylinder">
                <TextInput id="engine" value={form.engine} onChange={(e) => set("engine", e.target.value)} />
              </Field>
              <Field label="Body type" htmlFor="body">
                <SelectInput id="body" value={form.body_type} onChange={(e) => set("body_type", e.target.value)}>
                  {["SUV", "Sedan", "Hatchback", "Van", "Pickup", "Bus", "Coupe", "Wagon"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Drive" htmlFor="drive">
                <SelectInput id="drive" value={form.drive_type} onChange={(e) => set("drive_type", e.target.value)}>
                  {["2WD", "4WD", "AWD"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Condition" htmlFor="condition">
                <SelectInput id="condition" value={form.condition} onChange={(e) => set("condition", e.target.value)}>
                  {["Brand New", "Foreign Used", "Locally Used"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Exterior colour" htmlFor="color">
                <TextInput id="color" value={form.color} onChange={(e) => set("color", e.target.value)} />
              </Field>
              <Field label="Interior colour" htmlFor="interior">
                <TextInput id="interior" value={form.interior_color} onChange={(e) => set("interior_color", e.target.value)} />
              </Field>
              <Field label="Description" htmlFor="description" className="md:col-span-2">
                <TextArea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} />
              </Field>
              <Field label="Features" htmlFor="features" hint="One feature per line" className="md:col-span-2">
                <TextArea
                  id="features"
                  value={form.features.join("\n")}
                  onChange={(e) => set("features", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
                />
              </Field>
              <Field label="Video link" htmlFor="video" hint="YouTube or similar" className="md:col-span-2">
                <TextInput id="video" value={form.video_url} onChange={(e) => set("video_url", e.target.value)} />
              </Field>
            </div>
          </AdminCard>

          {isNew ? (
            <AdminCard>
              <h2 className="text-base font-bold">Photos</h2>
              <p className="mt-1 text-sm text-muted-foreground">Save the vehicle first, then add its photos here.</p>
            </AdminCard>
          ) : (
            <VehicleGallery vehicleId={id} />
          )}
        </div>

        <div className="space-y-6">
          <AdminCard>
            <h2 className="mb-4 text-base font-bold">Publishing</h2>
            <div className="space-y-4">
              <Field label="Availability" htmlFor="availability">
                <SelectInput id="availability" value={form.availability} onChange={(e) => set("availability", e.target.value)}>
                  {["Available", "Reserved", "Sold", "Incoming"].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </SelectInput>
              </Field>
              {(
                [
                  ["published", "Visible on the website"],
                  ["featured", "Show in featured stock"],
                  ["archived", "Archived (hidden everywhere)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => set(key, e.target.checked)}
                    className="size-4 rounded border-input"
                  />
                  {label}
                </label>
              ))}
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="mb-4 text-base font-bold">Search listing</h2>
            <div className="space-y-4">
              <Field label="SEO title" htmlFor="seotitle" hint="Leave blank to use the vehicle name">
                <TextInput id="seotitle" value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
              </Field>
              <Field label="SEO description" htmlFor="seodesc">
                <TextArea id="seodesc" value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} />
              </Field>
            </div>
          </AdminCard>

          <Button className="w-full" onClick={() => save.mutate()} disabled={save.isPending}>
            <Saving show={save.isPending} /> Save vehicle
          </Button>
        </div>
      </div>
    </>
  );
}

function VehicleGallery({ vehicleId }: { vehicleId: string }) {
  const qc = useQueryClient();
  const key = ["admin", "vehicle-media", vehicleId];

  const items = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_media")
        .select("id,position,is_cover,media_id,media:media_id(*)")
        .eq("vehicle_id", vehicleId)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as {
        id: string;
        position: number;
        is_cover: boolean;
        media_id: string;
        media: MediaRecord;
      }[];
    },
  });

  async function syncVehicleImages() {
    const { data } = await supabase
      .from("vehicle_media")
      .select("position,is_cover,media:media_id(path)")
      .eq("vehicle_id", vehicleId)
      .order("position", { ascending: true });
    const rows = (data ?? []) as unknown as { is_cover: boolean; media: { path: string } }[];
    const sorted = [...rows].sort((a, b) => Number(b.is_cover) - Number(a.is_cover));
    const paths = sorted.map((r) => r.media?.path).filter(Boolean);
    await supabase
      .from("vehicles")
      .update({ image_keys: paths, image_urls: paths.map((p) => mediaUrl(p, "large")) })
      .eq("id", vehicleId);
  }

  const attach = useMutation({
    mutationFn: async (records: MediaRecord[]) => {
      const start = items.data?.length ?? 0;
      const rows = records.map((m, i) => ({
        vehicle_id: vehicleId,
        media_id: m.id,
        position: start + i,
        is_cover: start === 0 && i === 0,
      }));
      const { error } = await supabase.from("vehicle_media").insert(rows);
      if (error) throw error;
      await syncVehicleImages();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
    onError: (e: Error) => toast.error("Could not attach photos", { description: e.message }),
  });

  const setCover = useMutation({
    mutationFn: async (rowId: string) => {
      await supabase.from("vehicle_media").update({ is_cover: false }).eq("vehicle_id", vehicleId);
      const { error } = await supabase.from("vehicle_media").update({ is_cover: true }).eq("id", rowId);
      if (error) throw error;
      await syncVehicleImages();
    },
    onSuccess: () => {
      toast.success("Cover photo updated");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  const detach = useMutation({
    mutationFn: async (rowId: string) => {
      const { error } = await supabase.from("vehicle_media").delete().eq("id", rowId);
      if (error) throw error;
      await syncVehicleImages();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin"] }),
  });

  const move = useMutation({
    mutationFn: async ({ index, dir }: { index: number; dir: -1 | 1 }) => {
      const rows = items.data ?? [];
      const target = index + dir;
      if (target < 0 || target >= rows.length) return;
      const a = rows[index]!;
      const b = rows[target]!;
      await supabase.from("vehicle_media").update({ position: target }).eq("id", a.id);
      await supabase.from("vehicle_media").update({ position: index }).eq("id", b.id);
      await syncVehicleImages();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  return (
    <AdminCard>
      <h2 className="mb-1 text-base font-bold">Photos</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        The cover photo is used on cards and shared links. Drag order is set with the arrows.
      </p>
      <MediaUploader category="Vehicles" onUploaded={(records) => attach.mutate(records)} compact />

      {items.data && items.data.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.data.map((row, index) => (
            <div key={row.id} className={cn("overflow-hidden rounded-lg border", row.is_cover && "ring-2 ring-primary")}>
              <img
                src={mediaUrl(row.media?.path ?? "", "card")}
                alt={row.media?.alt || "Vehicle photo"}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex items-center justify-between gap-1 p-2">
                <button
                  type="button"
                  aria-label="Set as cover"
                  onClick={() => setCover.mutate(row.id)}
                  className="rounded p-1.5 hover:bg-accent"
                >
                  <Star className={cn("size-4", row.is_cover && "fill-amber-400 text-amber-500")} />
                </button>
                <div className="flex items-center">
                  <button
                    type="button"
                    aria-label="Move earlier"
                    onClick={() => move.mutate({ index, dir: -1 })}
                    className="rounded px-2 py-1 text-sm hover:bg-accent"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Move later"
                    onClick={() => move.mutate({ index, dir: 1 })}
                    className="rounded px-2 py-1 text-sm hover:bg-accent"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => detach.mutate(row.id)}
                  className="rounded p-1.5 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No photos attached yet.</p>
      )}
    </AdminCard>
  );
}
