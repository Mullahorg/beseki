import { createFileRoute } from "@tanstack/react-router";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const Route = createFileRoute("/_authenticated/admin/trade-ins")({
  component: () => (
    <LeadsTable
      title="Trade-in requests"
      description="Customers offering their current vehicle against a purchase."
      type="trade-in"
    />
  ),
});
