/**
 * Vehicle types and shared option lists.
 * Stock records live in the database (`vehicles` table) and are loaded
 * through `src/lib/vehicles.functions.ts`.
 */

export type Transmission = "Automatic" | "Manual";
export type Fuel = "Petrol" | "Diesel" | "Hybrid";
export type BodyType = "SUV" | "Sedan" | "MPV" | "Hatchback" | "Pickup" | "Luxury";
export type Condition = "Brand New" | "Locally Used" | "Foreign Used";
export type Availability = "Available" | "Reserved" | "Sold";

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: Transmission;
  fuel: Fuel;
  engine: string;
  bodyType: BodyType;
  driveType: string;
  condition: Condition;
  color: string;
  description: string;
  images: string[];
  features: string[];
  featured: boolean;
  availability: Availability;
  createdAt: string;
}

export const vehicleName = (v: Vehicle) => `${v.make} ${v.model} ${v.year}`;

export const bodyTypes: BodyType[] = ["SUV", "Sedan", "MPV", "Hatchback", "Pickup", "Luxury"];
export const transmissions: Transmission[] = ["Automatic", "Manual"];
export const fuels: Fuel[] = ["Petrol", "Diesel", "Hybrid"];
export const conditions: Condition[] = ["Brand New", "Locally Used", "Foreign Used"];

export const makesOf = (list: Vehicle[]) => [...new Set(list.map((v) => v.make))].sort();
export const modelsOf = (list: Vehicle[], make?: string) =>
  [...new Set(list.filter((v) => !make || v.make === make).map((v) => v.model))].sort();
export const yearsOf = (list: Vehicle[]) => [...new Set(list.map((v) => v.year))].sort((a, b) => b - a);

export const priceBands = [
  { label: "Under KES 2M", min: 0, max: 2_000_000 },
  { label: "KES 2M – 4M", min: 2_000_000, max: 4_000_000 },
  { label: "KES 4M – 7M", min: 4_000_000, max: 7_000_000 },
  { label: "KES 7M – 10M", min: 7_000_000, max: 10_000_000 },
  { label: "Above KES 10M", min: 10_000_000, max: Number.MAX_SAFE_INTEGER },
];

export const mileageBands = [
  { label: "Under 30,000 km", min: 0, max: 30_000 },
  { label: "30,000 – 60,000 km", min: 30_000, max: 60_000 },
  { label: "60,000 – 100,000 km", min: 60_000, max: 100_000 },
  { label: "Above 100,000 km", min: 100_000, max: Number.MAX_SAFE_INTEGER },
];
