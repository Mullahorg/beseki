import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { resolveImages } from "@/data/vehicle-images";
import type { Availability, BodyType, Condition, Fuel, Transmission, Vehicle } from "@/data/vehicles";

const SELECT =
  "id,slug,make,model,year,price,mileage,transmission,fuel,engine,body_type,drive_type,condition,color,description,features,image_keys,image_urls,featured,availability,created_at";

type Row = Database["public"]["Tables"]["vehicles"]["Row"];

function mapRow(row: Row): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    make: row.make,
    model: row.model,
    year: row.year,
    price: Number(row.price),
    mileage: row.mileage,
    transmission: row.transmission as Transmission,
    fuel: row.fuel as Fuel,
    engine: row.engine,
    bodyType: row.body_type as BodyType,
    driveType: row.drive_type,
    condition: row.condition as Condition,
    color: row.color,
    description: row.description,
    images: resolveImages(row.image_keys ?? [], row.image_urls ?? []),
    features: row.features ?? [],
    featured: row.featured,
    availability: row.availability as Availability,
    createdAt: row.created_at,
  };
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

/** Every published vehicle in stock. Public — safe columns only. */
export const listVehicles = createServerFn({ method: "GET" }).handler(async (): Promise<Vehicle[]> => {
  const { data, error } = await publicClient()
    .from("vehicles")
    .select(SELECT)
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => mapRow(r as Row));
});

/** A single published vehicle by slug. */
export const getVehicle = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug).slice(0, 200) }))
  .handler(async ({ data }): Promise<Vehicle | null> => {
    const { data: row, error } = await publicClient()
      .from("vehicles")
      .select(SELECT)
      .eq("published", true)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapRow(row as Row) : null;
  });
