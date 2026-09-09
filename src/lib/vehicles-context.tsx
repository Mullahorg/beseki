import { createContext, useContext, type ReactNode } from "react";
import type { Vehicle } from "@/data/vehicles";

const VehiclesContext = createContext<Vehicle[]>([]);

export function VehiclesProvider({ vehicles, children }: { vehicles: Vehicle[]; children: ReactNode }) {
  return <VehiclesContext.Provider value={vehicles}>{children}</VehiclesContext.Provider>;
}

/** All published stock, loaded once on the server for every page. */
export function useVehicles() {
  return useContext(VehiclesContext);
}
