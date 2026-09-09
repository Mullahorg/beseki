import type { Vehicle } from "@/data/vehicles";
import { formatKm } from "@/lib/whatsapp";

export function VehicleSpecs({ vehicle }: { vehicle: Vehicle }) {
  const rows: { label: string; value: string }[] = [
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "Year", value: String(vehicle.year) },
    { label: "Mileage", value: formatKm(vehicle.mileage) },
    { label: "Engine", value: vehicle.engine },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Fuel", value: vehicle.fuel },
    { label: "Body type", value: vehicle.bodyType },
    { label: "Drive type", value: vehicle.driveType },
    { label: "Colour", value: vehicle.color },
    { label: "Condition", value: vehicle.condition },
    { label: "Availability", value: vehicle.availability },
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-4 border-b py-3">
          <dt className="text-[13px] text-muted-foreground">{row.label}</dt>
          <dd className="text-right text-[14px] font-semibold">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
