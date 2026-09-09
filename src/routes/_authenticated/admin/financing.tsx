import { createFileRoute } from "@tanstack/react-router";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const Route = createFileRoute("/_authenticated/admin/financing")({
  component: () => (
    <LeadsTable
      title="Financing applications"
      description="Customers asking about instalments, deposits and loan terms."
      type="financing"
    />
  ),
});
