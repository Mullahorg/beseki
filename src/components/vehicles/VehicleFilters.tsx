import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVehicles } from "@/lib/vehicles-context";
import {
  bodyTypes,
  conditions,
  fuels,
  makesOf,
  mileageBands,
  priceBands,
  transmissions,
  yearsOf,
  type BodyType,
} from "@/data/vehicles";


export interface FilterState {
  q: string;
  make: string;
  model: string;
  price: string;
  year: string;
  mileage: string;
  transmission: string;
  fuel: string;
  bodyType: string;
  condition: string;
}

export const emptyFilters: FilterState = {
  q: "",
  make: "",
  model: "",
  price: "",
  year: "",
  mileage: "",
  transmission: "",
  fuel: "",
  bodyType: "",
  condition: "",
};

const selectClass =
  "w-full appearance-none rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

function Select({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function VehicleFilters({
  filters,
  onChange,
  onClear,
  resultCount,
}: {
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  onClear: () => void;
  resultCount: number;
}) {
  const vehicles = useVehicles();
  const makes = makesOf(vehicles);
  const years = yearsOf(vehicles);
  const models = [
    ...new Set(vehicles.filter((v) => !filters.make || v.make === filters.make).map((v) => v.model)),
  ].sort();


  const active = Object.entries(filters).filter(([, v]) => v);

  return (
    <div className="border-y bg-card py-5 md:rounded-lg md:border md:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold">Filter vehicles</h2>
        <span className="text-[13px] text-muted-foreground">{resultCount} shown</span>
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="f-q" className="block text-[13px] font-medium">
            Keyword
          </label>
          <input
            id="f-q"
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="Make, model or feature"
            className={selectClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Select
            id="f-make"
            label="Make"
            value={filters.make}
            onChange={(v) => onChange({ make: v, model: "" })}
            options={makes.map((m) => ({ value: m, label: m }))}
          />
          <Select
            id="f-model"
            label="Model"
            value={filters.model}
            onChange={(v) => onChange({ model: v })}
            options={models.map((m) => ({ value: m, label: m }))}
          />
          <Select
            id="f-price"
            label="Price"
            value={filters.price}
            onChange={(v) => onChange({ price: v })}
            options={priceBands.map((b) => ({ value: b.label, label: b.label }))}
          />
          <Select
            id="f-year"
            label="Year from"
            value={filters.year}
            onChange={(v) => onChange({ year: v })}
            options={years.map((y) => ({ value: String(y), label: `${y} or newer` }))}
          />
          <Select
            id="f-mileage"
            label="Mileage"
            value={filters.mileage}
            onChange={(v) => onChange({ mileage: v })}
            options={mileageBands.map((b) => ({ value: b.label, label: b.label }))}
          />
          <Select
            id="f-transmission"
            label="Transmission"
            value={filters.transmission}
            onChange={(v) => onChange({ transmission: v })}
            options={transmissions.map((t) => ({ value: t, label: t }))}
          />
          <Select
            id="f-fuel"
            label="Fuel"
            value={filters.fuel}
            onChange={(v) => onChange({ fuel: v })}
            options={fuels.map((f) => ({ value: f, label: f }))}
          />
          <Select
            id="f-body"
            label="Body type"
            value={filters.bodyType}
            onChange={(v) => onChange({ bodyType: v as BodyType })}
            options={bodyTypes.map((b) => ({ value: b, label: b }))}
          />
          <Select
            id="f-condition"
            label="Condition"
            value={filters.condition}
            onChange={(v) => onChange({ condition: v })}
            options={conditions.map((c) => ({ value: c, label: c }))}
          />
        </div>
      </div>

      {active.length ? (
        <Button variant="outline" size="sm" onClick={onClear} className="mt-5 w-full">
          <X className="size-3.5" aria-hidden="true" />
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
