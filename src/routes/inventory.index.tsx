import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/common/Section";
import { EmptyState } from "@/components/common/States";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleFilters, emptyFilters, type FilterState } from "@/components/vehicles/VehicleFilters";
import { mileageBands, priceBands, vehicles } from "@/data/vehicles";
import { cn } from "@/lib/utils";

export interface InventorySearch {
  q?: string | undefined;
  make?: string | undefined;
  model?: string | undefined;
  price?: string | undefined;
  year?: string | undefined;
  mileage?: string | undefined;
  transmission?: string | undefined;
  fuel?: string | undefined;
  bodyType?: string | undefined;
  condition?: string | undefined;
  sort?: string | undefined;
}

const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);

export const Route = createFileRoute("/inventory/")({
  validateSearch: (search: Record<string, unknown>): InventorySearch => ({
    q: str(search["q"]),
    make: str(search["make"]),
    model: str(search["model"]),
    price: str(search["price"]),
    year: str(search["year"]),
    mileage: str(search["mileage"]),
    transmission: str(search["transmission"]),
    fuel: str(search["fuel"]),
    bodyType: str(search["bodyType"]),
    condition: str(search["condition"]),
    sort: str(search["sort"]),
  }),
  head: () => ({
    meta: [
      { title: "Cars for Sale in Mombasa — Inventory | BESEKI" },
      {
        name: "description",
        content:
          "Browse every vehicle currently available at BESEKI COMPANY LIMITED in Mombasa. Filter by make, model, price, year, mileage, transmission, fuel and body type.",
      },
      { property: "og:title", content: "Cars for Sale in Mombasa — Inventory | BESEKI" },
      {
        property: "og:description",
        content: "Every vehicle currently available at our Mombasa yard, with full specifications and photos.",
      },
      { property: "og:url", content: "/inventory" },
    ],
    links: [{ rel: "canonical", href: "/inventory" }],
  }),
  component: InventoryPage,
});

const PAGE_SIZE = 9;

function InventoryPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/inventory/" });
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters: FilterState = {
    ...emptyFilters,
    q: search.q ?? "",
    make: search.make ?? "",
    model: search.model ?? "",
    price: search.price ?? "",
    year: search.year ?? "",
    mileage: search.mileage ?? "",
    transmission: search.transmission ?? "",
    fuel: search.fuel ?? "",
    bodyType: search.bodyType ?? "",
    condition: search.condition ?? "",
  };
  const sort = search.sort ?? "newest";

  const update = (next: Partial<FilterState>) => {
    setVisible(PAGE_SIZE);
    navigate({
      search: (prev: InventorySearch) => {
        const merged = { ...prev, ...next };
        return Object.fromEntries(Object.entries(merged).filter(([, v]) => v)) as InventorySearch;
      },
    });
  };

  const results = useMemo(() => {
    const priceBand = priceBands.find((b) => b.label === filters.price);
    const mileageBand = mileageBands.find((b) => b.label === filters.mileage);
    const q = filters.q.trim().toLowerCase();

    const list = vehicles.filter((v) => {
      if (q && !`${v.make} ${v.model} ${v.year} ${v.bodyType} ${v.features.join(" ")}`.toLowerCase().includes(q))
        return false;
      if (filters.make && v.make !== filters.make) return false;
      if (filters.model && v.model !== filters.model) return false;
      if (priceBand && (v.price < priceBand.min || v.price >= priceBand.max)) return false;
      if (mileageBand && (v.mileage < mileageBand.min || v.mileage >= mileageBand.max)) return false;
      if (filters.year && v.year < Number(filters.year)) return false;
      if (filters.transmission && v.transmission !== filters.transmission) return false;
      if (filters.fuel && v.fuel !== filters.fuel) return false;
      if (filters.bodyType && v.bodyType !== filters.bodyType) return false;
      if (filters.condition && v.condition !== filters.condition) return false;
      return true;
    });

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "year") sorted.sort((a, b) => b.year - a.year);
    else if (sort === "mileage") sorted.sort((a, b) => a.mileage - b.mileage);
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year);
    return sorted;
  }, [filters, sort]);

  const shown = results.slice(0, visible);

  return (
    <>
      <PageHero
        eyebrow="Inventory"
        title="Cars for Sale in Mombasa"
        subtitle="Every vehicle below can be viewed at our yard along Lumumba Road. Filter the list, then arrange a time to see the car in person."
      />

      <div className="container-page py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="lg:hidden">
            <Button variant="outline" className="w-full" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen}>
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              {filtersOpen ? "Hide filters" : "Show filters"}
            </Button>
          </div>

          <aside className={cn("lg:block", filtersOpen ? "block" : "hidden")}>
            <div className="lg:sticky lg:top-28">
              <VehicleFilters
                filters={filters}
                onChange={update}
                onClear={() => navigate({ search: {} as InventorySearch })}
                resultCount={results.length}
              />
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[15px] font-semibold">
                {results.length} vehicle{results.length === 1 ? "" : "s"} available
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-[13px] text-muted-foreground">
                  Sort by
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => navigate({ search: (prev: InventorySearch) => ({ ...prev, sort: e.target.value }) })}
                  className="appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <option value="newest">Newest first</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="year">Year</option>
                  <option value="mileage">Lowest mileage</option>
                </select>
              </div>
            </div>

            {results.length === 0 ? (
              <EmptyState actionLabel="Clear Filters" onAction={() => navigate({ search: {} as InventorySearch })} />
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {shown.map((v, i) => (
                    <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
                  ))}
                </div>
                {visible < results.length ? (
                  <div className="mt-10 text-center">
                    <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                      Load more vehicles
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
