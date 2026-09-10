import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/States";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import {
  VehicleFilters,
  emptyFilters,
  type FilterState,
} from "@/components/vehicles/VehicleFilters";
import { mileageBands, priceBands } from "@/data/vehicles";
import { useVehicles } from "@/lib/vehicles-context";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

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

const str = (v: unknown) =>
  typeof v === "string" && v ? v : undefined;

export const Route = createFileRoute("/compare")({
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
      {
        title: "Cars for Sale in Mombasa — Inventory | BESEKI",
      },
      {
        name: "description",
        content:
          "Browse vehicles available at BESEKI COMPANY LIMITED in Mombasa. Compare prices, specifications, mileage, transmission, fuel type and body style.",
      },
      {
        property: "og:title",
        content: "Cars for Sale in Mombasa — Inventory | BESEKI",
      },
      {
        property: "og:description",
        content:
          "Explore BESEKI's vehicle inventory in Mombasa and find a car that fits your needs.",
      },
      {
        property: "og:url",
        content: "/inventory",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/inventory",
      },
    ],
  }),

  component: InventoryPage,
});

const PAGE_SIZE = 9;

function InventoryPage() {
  const search = Route.useSearch();
  const vehicles = useVehicles();

  const navigate = useNavigate({
    from: "/inventory/",
  });

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
        const merged = {
          ...prev,
          ...next,
        };

        return Object.fromEntries(
          Object.entries(merged).filter(([, value]) => value),
        ) as InventorySearch;
      },
    });
  };

  const clearFilters = () => {
    setVisible(PAGE_SIZE);

    navigate({
      search: {} as InventorySearch,
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (value) => value,
  ).length;

  const results = useMemo(() => {
    const priceBand = priceBands.find(
      (band) => band.label === filters.price,
    );

    const mileageBand = mileageBands.find(
      (band) => band.label === filters.mileage,
    );

    const q = filters.q.trim().toLowerCase();

    const list = vehicles.filter((vehicle) => {
      if (
        q &&
        !`${vehicle.make} ${vehicle.model} ${vehicle.year} ${
          vehicle.bodyType
        } ${vehicle.features.join(" ")}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      if (
        filters.make &&
        vehicle.make !== filters.make
      ) {
        return false;
      }

      if (
        filters.model &&
        vehicle.model !== filters.model
      ) {
        return false;
      }

      if (
        priceBand &&
        (vehicle.price < priceBand.min ||
          vehicle.price >= priceBand.max)
      ) {
        return false;
      }

      if (
        mileageBand &&
        (vehicle.mileage < mileageBand.min ||
          vehicle.mileage >= mileageBand.max)
      ) {
        return false;
      }

      if (
        filters.year &&
        vehicle.year < Number(filters.year)
      ) {
        return false;
      }

      if (
        filters.transmission &&
        vehicle.transmission !== filters.transmission
      ) {
        return false;
      }

      if (
        filters.fuel &&
        vehicle.fuel !== filters.fuel
      ) {
        return false;
      }

      if (
        filters.bodyType &&
        vehicle.bodyType !== filters.bodyType
      ) {
        return false;
      }

      if (
        filters.condition &&
        vehicle.condition !== filters.condition
      ) {
        return false;
      }

      return true;
    });

    const sorted = [...list];

    if (sort === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === "year") {
      sorted.sort((a, b) => b.year - a.year);
    } else if (sort === "mileage") {
      sorted.sort((a, b) => a.mileage - b.mileage);
    } else {
      sorted.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          b.year - a.year,
      );
    }

    return sorted;
  }, [vehicles, filters, sort]);

  const shown = results.slice(0, visible);

  return (
    <main className="min-h-screen bg-background">
      {/* ------------------------------------------------------------------ */}
      {/* HERO */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-b border-border bg-muted/30">
        <div className="container-page py-14 md:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-primary" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  BESEKI Inventory
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
                Find the right car.
                <span className="block text-muted-foreground">
                  Take your time.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Explore vehicles available at our Mombasa yard
                along Lumumba Road. Search by what matters to you,
                compare your options, then come and see the car in
                person.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/contact">
                  <Button size="lg">
                    Visit the showroom
                    <ArrowRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>

                <a href="#vehicle-results">
                  <Button
                    variant="outline"
                    size="lg"
                  >
                    Browse vehicles
                  </Button>
                </a>
              </div>
            </div>

            <div className="border-l border-border pl-6 lg:pl-8">
              <p className="text-sm font-semibold text-foreground">
                Looking for something specific?
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Use the filters to narrow down the selection by
                price, make, mileage, year and more.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-5">
                <div>
                  <p className="text-2xl font-semibold tracking-tight">
                    {vehicles.length}
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Vehicles listed
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-semibold tracking-tight">
                    Mombasa
                  </p>

                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Showroom
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SEARCH */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-b border-border bg-background">
        <div className="container-page py-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <input
                value={filters.q}
                onChange={(event) =>
                  update({
                    q: event.target.value,
                  })
                }
                placeholder="Search Toyota, Alphard, SUV, automatic..."
                aria-label="Search vehicles"
                className="h-12 w-full border border-input bg-background pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <Button
              variant="outline"
              className="h-12 lg:min-w-[150px]"
              onClick={() =>
                setFiltersOpen((open) => !open)
              }
              aria-expanded={filtersOpen}
              aria-controls="inventory-filters"
            >
              <SlidersHorizontal
                className="size-4"
                aria-hidden="true"
              />

              Filters

              {activeFilterCount > 0 ? (
                <span className="ml-1 inline-flex size-5 items-center justify-center bg-primary text-[10px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              ) : null}
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* RESULTS */}
      {/* ------------------------------------------------------------------ */}

      <section
        id="vehicle-results"
        className="container-page py-10 md:py-14"
      >
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          {/* FILTERS */}

          <aside
            id="inventory-filters"
            className={cn(
              "lg:block",
              filtersOpen ? "block" : "hidden",
            )}
          >
            <div className="lg:sticky lg:top-28">
              <div className="mb-5 flex items-center justify-between lg:hidden">
                <div>
                  <p className="text-sm font-semibold">
                    Refine your search
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {results.length} matching vehicles
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>

              <VehicleFilters
                filters={filters}
                onChange={update}
                onClear={clearFilters}
                resultCount={results.length}
              />
            </div>
          </aside>

          {/* VEHICLES */}

          <div className="min-w-0">
            <div className="mb-7 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">
                  {results.length}{" "}
                  {results.length === 1
                    ? "vehicle"
                    : "vehicles"}
                </p>

                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Clear active filters
                  </button>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Showing the best matches for your search
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Sort
                </label>

                <div className="relative">
                  <select
                    id="sort"
                    value={sort}
                    onChange={(event) => {
                      setVisible(PAGE_SIZE);

                      navigate({
                        search: (
                          prev: InventorySearch,
                        ) => ({
                          ...prev,
                          sort: event.target.value,
                        }),
                      });
                    }}
                    className="h-10 min-w-[175px] appearance-none border border-input bg-background px-3 pr-9 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
                  >
                    <option value="newest">
                      Featured & newest
                    </option>

                    <option value="price-asc">
                      Price: low to high
                    </option>

                    <option value="price-desc">
                      Price: high to low
                    </option>

                    <option value="year">
                      Newest year
                    </option>

                    <option value="mileage">
                      Lowest mileage
                    </option>
                  </select>

                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="border border-border bg-muted/20 px-6 py-16 md:px-10">
                <EmptyState
                  actionLabel="Clear Filters"
                  onAction={clearFilters}
                />
              </div>
            ) : (
              <>
                {filters.q ? (
                  <div className="mb-6 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Results for
                    </span>

                    <span className="font-semibold">
                      “{filters.q}”
                    </span>
                  </div>
                ) : null}

                <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                  {shown.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      priority={index < 3}
                    />
                  ))}
                </div>

                {visible < results.length ? (
                  <div className="mt-14 flex flex-col items-center border-t border-border pt-8">
                    <p className="mb-4 text-xs text-muted-foreground">
                      Showing {shown.length} of{" "}
                      {results.length} vehicles
                    </p>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() =>
                        setVisible(
                          (current) =>
                            current + PAGE_SIZE,
                        )
                      }
                    >
                      Load more vehicles
                      <ArrowDown
                        className="size-4"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                ) : results.length > PAGE_SIZE ? (
                  <div className="mt-14 flex items-center justify-center gap-2 border-t border-border pt-8 text-xs text-muted-foreground">
                    <Check
                      className="size-4"
                      aria-hidden="true"
                    />

                    You've reached the end of the inventory.
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* BUYING GUIDANCE */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-y border-border bg-muted/30">
        <div className="container-page py-14 md:py-18">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" />

                <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  Need a hand?
                </span>
              </div>

              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                You don't have to choose the car alone.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
                Tell us what you need, your budget and how you
                intend to use the vehicle. Our team can help you
                narrow down the options before you visit.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/contact">
                  <Button>
                    Talk to our team
                    <ArrowRight
                      className="size-4"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>

                <Link to="/financing">
                  <Button variant="outline">
                    Explore financing
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid border-y border-border sm:grid-cols-3 sm:border-y-0 sm:border-l">
              <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
                <p className="text-sm font-semibold">
                  See it first
                </p>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Arrange a showroom visit and inspect the
                  vehicle in person.
                </p>
              </div>

              <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
                <p className="text-sm font-semibold">
                  Ask questions
                </p>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Get clear answers about condition,
                  specifications and ownership.
                </p>
              </div>

              <div className="p-5">
                <p className="text-sm font-semibold">
                  Make your move
                </p>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  When you're ready, we'll help you take the
                  next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FINAL CTA */}
      {/* ------------------------------------------------------------------ */}

      <section className="container-page py-14 md:py-20">
        <div className="bg-primary px-6 py-10 text-primary-foreground md:px-10 md:py-14 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/70">
                Visit BESEKI
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                Found a car you like?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80 md:text-base">
                Come and see it at our showroom along Lumumba
                Road in Mombasa. We can arrange a viewing or
                test drive at a convenient time.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link to="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto lg:w-full"
                >
                  Schedule a visit
                  <ArrowRight
                    className="size-4"
                    aria-hidden="true"
                  />
                </Button>
              </Link>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto lg:w-full"
                >
                  WhatsApp BESEKI
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
