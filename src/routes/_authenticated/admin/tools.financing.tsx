import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "lucide-react";

import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { RoleGate } from "@/components/admin/RoleGate";
import { FinancingCalculator } from "@/components/forms/FinancingCalculator";

export const Route = createFileRoute("/_authenticated/admin/tools/financing")({
  component: FinancingTool,
});

function FinancingTool() {
  return (
    <RoleGate allow={["super_admin", "admin", "sales"]}>
      <AdminHeader
        title="Financing calculator"
        description="Work out a monthly instalment for a customer before you reply to them."
      />
      <AdminCard>
        <div className="mb-5 flex items-center gap-2 text-admin-muted">
          <Calculator className="size-4" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wide">Deal estimate</p>
        </div>
        <FinancingCalculator />
        <p className="mt-6 text-xs text-admin-muted">
          Figures are estimates only. Always confirm the final offer with the financing partner
          before quoting a customer.
        </p>
      </AdminCard>
    </RoleGate>
  );
}
