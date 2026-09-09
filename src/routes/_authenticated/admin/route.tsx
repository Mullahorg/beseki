import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { useSession, useRoles } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = useSession();
  const { data: roles, isLoading, isError } = useRoles(user);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (isError || !roles || roles.length === 0) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">No access yet</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          You are signed in{user?.email ? ` as ${user.email}` : ""}, but this account has not been given staff
          access. Ask a BESEKI administrator to add you.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/">Back to the website</Link>
        </Button>
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
