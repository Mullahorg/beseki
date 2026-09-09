import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { vehicleName } from "@/data/vehicles";
import { useVehicles } from "@/lib/vehicles-context";
import { formatKes, formatKm } from "@/lib/whatsapp";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const vehicles = useVehicles();

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return vehicles
      .filter((v) =>
        `${v.make} ${v.model} ${v.year} ${v.bodyType} ${v.fuel} ${v.condition}`
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6);
  }, [query, vehicles]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-24 max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Search vehicles</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
            navigate({ to: "/inventory", search: { q: query.trim() } });
          }}
          className="flex items-center gap-3 border-b px-4"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by make, model or keyword"
            aria-label="Search vehicles"
            className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
        </form>

        <div className="max-h-[52vh] overflow-y-auto">
          {query.trim() && results.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No vehicles match “{query}”. Try a different make or model.
            </p>
          ) : null}
          {results.map((v) => (
            <Link
              key={v.id}
              to="/inventory/$slug"
              params={{ slug: v.slug }}
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent"
            >
              <img
                src={v.images[0]}
                alt={vehicleName(v)}
                loading="lazy"
                className="h-14 w-20 shrink-0 rounded-md object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{vehicleName(v)}</span>
                <span className="block text-xs text-muted-foreground">
                  {formatKm(v.mileage)} • {v.transmission} • {v.fuel}
                </span>
              </span>
              <span className="price-type shrink-0 text-sm">{formatKes(v.price)}</span>
            </Link>
          ))}
        </div>

        <div className="border-t p-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              navigate({ to: "/inventory", search: { q: query.trim() } });
            }}
          >
            Browse full inventory
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
