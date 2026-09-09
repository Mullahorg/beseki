import { createFileRoute } from "@tanstack/react-router";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const Route = createFileRoute("/_authenticated/admin/appointments")({
  component: () => (
    <LeadsTable
      title="Test drives & visits"
      description="Booking requests with the customer's preferred date and time."
      type={["test-drive", "reserve"]}
    />
  ),
});
