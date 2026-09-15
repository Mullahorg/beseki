import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaffRole, type StaffRole } from "@/lib/roles";

/** Shows children only to the listed roles; everyone else sees a friendly notice. */
export function RoleGate({ allow, children }: { allow: StaffRole[]; children: ReactNode }) {
  const { role, loading } = useStaffRole();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="size-5 animate-spin text-admin-muted" aria-hidden="true" />
      </div>
    );
  }

  if (!role || !allow.includes(role)) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-dashed border-admin-line bg-admin-panel px-6 py-16 text-center">
        <Lock className="size-6 text-admin-muted" aria-hidden="true" />
        <h1 className="mt-4 text-lg font-semibold text-admin-foreground">Not available for your role</h1>
        <p className="mt-2 max-w-sm text-sm text-admin-muted">
          This section is reserved for other roles. Ask an administrator if you need access.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/admin">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
