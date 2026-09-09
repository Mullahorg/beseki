import { createFileRoute } from "@tanstack/react-router";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: () => (
    <LeadsTable title="Leads" description="Every enquiry submitted through the website." />
  ),
});
