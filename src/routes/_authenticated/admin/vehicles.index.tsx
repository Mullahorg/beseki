import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading, StatusPill } from "@/components/admin/AdminBits";
import { Button } from "@/components/ui/button";
import { SelectInput, TextInput } from "@/components/forms/FormKit";
import { supabase } from "@/integrations/supabase/client";
import { formatKes } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/vehicles/")({
  component: VehiclesAdmin,
});

function VehiclesAdmin() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [view, setView] = useState<"live" | "archived">("live");

  const list = useQuery({
    queryKey: ["admin", "vehicles", search, availability, view],
    queryFn: async () => {
      let q = supabase
        .from("vehicles")
        .select("id,slug,make,model,variant,year,price,mileage,availability,published,featured,archived,image_urls")
        .eq("archived", view === "archived")
        .order("created_at", { ascending: false })
        .limit(300);
      if (availability !== "all") q = q.eq("availability", availability);
      if (search.trim()) q = q.or(`make.ilike.%${search.trim()}%,model.ilike.%${search.trim()}%,slug.ilike.%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase.from("vehicles").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Vehicle updated");
      qc.invalidateQueries({ queryKey: ["admin", "vehicles"] });
    },
    onError: (e: Error) => toast.error("Could not update", { description: e.message }),
  });

  return (
    <>
      <AdminHeader
        title="Vehicles"
        description="Add stock, edit details, publish, feature or archive."
        action={
          <Button asChild>
            <Link to="/admin/vehicles/$id" params={{ id: "new" }}>
              <Plus className="size-4" aria-hidden="true" /> Add vehicle
            </Link>
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="w-64 max-w-full">
          <TextInput
            value={search}
            aria-label="Search vehicles"
            placeholder="Search make, model or slug"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-44">
          <SelectInput value={availability} aria-label="Availability" onChange={(e) => setAvailability(e.target.value)}>
            <option value="all">All availability</option>
            {["Available", "Reserved", "Sold", "Incoming"].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="flex rounded-md border p-0.5">
          {(["live", "archived"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "rounded px-3 py-1.5 text-sm font-medium capitalize",
                view === v ? "bg-primary text-primary-foreground" : "hover:bg-accent",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {list.isLoading ? <AdminLoading /> : null}
      {list.isError ? <AdminError /> : null}
      {list.data?.length === 0 ? (
        <AdminEmpty
          title={view === "archived" ? "Nothing archived" : "No vehicles yet"}
          message="Add a vehicle with photos, price and specification and it appears in the showroom immediately."
          action={
            <Button asChild>
              <Link to="/admin/vehicles/$id" params={{ id: "new" }}>
                Add vehicle
              </Link>
            </Button>
          }
        />
      ) : null}

      {list.data && list.data.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="border-b bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Vehicle</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Mileage</th>
                <th className="px-4 py-3 font-semibold">Availability</th>
                <th className="px-4 py-3 font-semibold">Visibility</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {v.image_urls?.[0] ? (
                        <img
                          src={v.image_urls[0]}
                          alt=""
                          loading="lazy"
                          className="size-12 rounded-md border object-cover"
                        />
                      ) : (
                        <div className="size-12 rounded-md border bg-muted" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {v.year} {v.make} {v.model} {v.variant}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{v.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{formatKes(Number(v.price))}</td>
                  <td className="whitespace-nowrap px-4 py-3">{v.mileage.toLocaleString()} km</td>
                  <td className="px-4 py-3">
                    <StatusPill status={v.availability} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={v.published ? "published" : "draft"} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={v.featured ? "Remove from featured" : "Mark as featured"}
                      onClick={() => patch.mutate({ id: v.id, values: { featured: !v.featured } })}
                      className="rounded p-2 hover:bg-accent"
                    >
                      <Star className={cn("size-4", v.featured && "fill-amber-400 text-amber-500")} />
                    </button>
                    <Link
                      to="/admin/vehicles/$id"
                      params={{ id: v.id }}
                      className="ml-1 rounded px-3 py-2 text-sm font-semibold text-brand-blue hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
