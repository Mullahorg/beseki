import { Link } from "@tanstack/react-router";
import { Check, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/Header";
import { useCompare } from "@/lib/compare-store";
import { formatKes, formatKm, waMessages, whatsappLink } from "@/lib/whatsapp";
import { vehicleName, type Vehicle } from "@/data/vehicles";
import { cn } from "@/lib/utils";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const compare = useCompare();
  const selected = compare.has(vehicle.id);
  const name = vehicleName(vehicle);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-[border-color,box-shadow] duration-200 hover:border-foreground/20 hover:shadow-card">
      <Link
        to="/inventory/$slug"
        params={{ slug: vehicle.slug }}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={vehicle.images[0]}
          alt={`${name} — ${vehicle.color}`}
          loading={priority ? "eager" : "lazy"}
          width={1280}
          height={854}
          className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none"
        />
        <span className="absolute left-3 top-3 rounded-sm bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase text-foreground">
          {vehicle.condition}
        </span>
        {vehicle.availability !== "Available" ? (
          <span className="absolute right-3 top-3 rounded-sm bg-ink/85 px-2.5 py-1 text-[10px] font-semibold uppercase text-ink-foreground">
            {vehicle.availability}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-[18px] font-semibold leading-snug">
          <Link
            to="/inventory/$slug"
            params={{ slug: vehicle.slug }}
            className="transition-colors hover:text-primary"
          >
            {vehicle.make} {vehicle.model}
          </Link>
        </h3>
        <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
          {vehicle.year} &middot; {formatKm(vehicle.mileage)} &middot; {vehicle.transmission} &middot; {vehicle.fuel}
        </p>

        <p className="price-type mt-5 text-[22px] leading-none">{formatKes(vehicle.price)}</p>

        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 pt-5">
          <Button size="sm" className="min-w-0" asChild>
            <Link to="/inventory/$slug" params={{ slug: vehicle.slug }}>
              View Details
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a
              href={whatsappLink(waMessages.vehicle(name))}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ask about the ${name} on WhatsApp`}
            >
              <WhatsAppIcon className="size-4 text-whatsapp" />
              WhatsApp
            </a>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => compare.toggle(vehicle.id)}
          disabled={!selected && compare.isFull}
          className={cn(
            "mt-3 inline-flex items-center gap-1.5 self-start text-[13px] font-medium transition-colors disabled:opacity-45",
            selected ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
          aria-pressed={selected}
        >
          {selected ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : (
            <GitCompare className="size-3.5" aria-hidden="true" />
          )}
          {selected ? "Added to compare" : "Compare"}
        </button>
      </div>
    </article>
  );
}
