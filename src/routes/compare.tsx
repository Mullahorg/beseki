import { Link, createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/common/Section";
import { EmptyState } from "@/components/common/States";
import { useCompare, MAX_COMPARE } from "@/lib/compare-store";
import { vehicleName, type Vehicle } from "@/data/vehicles";
import { useVehicles } from "@/lib/vehicles-context";
import { formatKes, formatKm } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Vehicles | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "Compare up to three vehicles from BESEKI COMPANY LIMITED side by side — price, year, mileage, engine, transmission, fuel and features.",
      },
      { property: "og:title", content: "Compare Vehicles | BESEKI COMPANY LIMITED" },
      { property: "og:description", content: "Compare up to three vehicles from our Mombasa stock side by side." },
      { property: "og:url", content: "/compare" },
    ],
    links: [{ rel: "canonical", href: "/compare" }],
  }),
  component: ComparePage,
});

function ComparePage() {
  const compare = useCompare();
  const vehicles = useVehicles();
  const selected = compare.ids
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is Vehicle => Boolean(v));

  const rows: { label: string; get: (v: Vehicle) => string }[] = [
    { label: "Price", get: (v) => formatKes(v.price) },
    { label: "Make", get: (v) => v.make },
    { label: "Model", get: (v) => v.model },
    { label: "Year", get: (v) => String(v.year) },
    { label: "Mileage", get: (v) => formatKm(v.mileage) },
    { label: "Engine", get: (v) => v.engine },
    { label: "Transmission", get: (v) => v.transmission },
    { label: "Fuel", get: (v) => v.fuel },
    { label: "Body type", get: (v) => v.bodyType },
    { label: "Drive type", get: (v) => v.driveType },
    { label: "Colour", get: (v) => v.color },
    { label: "Condition", get: (v) => v.condition },
    { label: "Features", get: (v) => v.features.join(", ") },
  ];

  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Compare vehicles side by side"
        subtitle={`Add up to ${MAX_COMPARE} vehicles from the inventory and see the differences at a glance.`}
      />

      <div className="container-page py-10 md:py-14">
        {selected.length === 0 ? (
          <EmptyState
            title="No vehicles selected yet"
            message="Open the inventory and tap Compare on any vehicle to add it here."
          />
        ) : (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] font-semibold">
                {selected.length} of {MAX_COMPARE} vehicles selected
              </p>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link to="/inventory">Add Vehicle</Link>
                </Button>
                <Button variant="ghost" onClick={compare.clear}>
                  Clear all
                </Button>
              </div>
            </div>

            <div className="-mx-4 overflow-x-auto px-4 pb-2">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <caption className="sr-only">Vehicle comparison</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-40 border-b p-3 align-top text-[13px] text-muted-foreground">
                      Vehicle
                    </th>
                    {selected.map((v) => (
                      <th key={v.id} scope="col" className="border-b p-3 align-top">
                        <img
                          src={v.images[0]}
                          alt={vehicleName(v)}
                          width={640}
                          height={427}
                          loading="lazy"
                          className="aspect-[4/3] w-full rounded-lg object-cover"
                        />
                        <Link
                          to="/inventory/$slug"
                          params={{ slug: v.slug }}
                          className="mt-3 block text-[15px] font-bold hover:text-primary"
                        >
                          {vehicleName(v)}
                        </Link>
                        <button
                          type="button"
                          onClick={() => compare.remove(v.id)}
                          className="mt-2 inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-primary"
                        >
                          <X className="size-3.5" aria-hidden="true" />
                          Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const values = selected.map(row.get);
                    const differs = new Set(values).size > 1;
                    return (
                      <tr key={row.label}>
                        <th scope="row" className="border-b p-3 align-top text-[13px] font-medium text-muted-foreground">
                          {row.label}
                        </th>
                        {values.map((value, i) => (
                          <td
                            key={`${row.label}-${i}`}
                            className={cn(
                              "border-b p-3 align-top text-[14px]",
                              differs && "bg-sand font-semibold",
                            )}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Highlighted cells show where the vehicles differ.</p>
          </>
        )}
      </div>
    </>
  );
}
