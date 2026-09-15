import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  AdminHeader,
  AdminCard,
} from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatKes } from "@/lib/whatsapp";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

async function count(
  table: string,
  apply: (q: any) => any = (q) => q,
) {
  const {
    count: c,
    error,
  } = await apply(
    (supabase as any)
      .from(table)
      .select("id", {
        count: "exact",
        head: true,
      }),
  );

  if (error) {
    throw error;
  }

  return c ?? 0;
}

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => ({
      vehicles: await count(
        "vehicles",
        (q) => q.eq("archived", false),
      ),

      available: await count(
        "vehicles",
        (q) =>
          q
            .eq("archived", false)
            .eq("availability", "Available"),
      ),

      featured: await count(
        "vehicles",
        (q) =>
          q
            .eq("archived", false)
            .eq("featured", true),
      ),

      sold: await count(
        "vehicles",
        (q) =>
          q.eq("availability", "Sold"),
      ),

      newLeads: await count(
        "enquiries",
        (q) =>
          q.eq("status", "new"),
      ),

      testDrives: await count(
        "enquiries",
        (q) =>
          q
            .eq("type", "test-drive")
            .eq("status", "new"),
      ),

      tradeIns: await count(
        "enquiries",
        (q) =>
          q
            .eq("type", "trade-in")
            .eq("status", "new"),
      ),

      financing: await count(
        "enquiries",
        (q) =>
          q
            .eq("type", "financing")
            .eq("status", "new"),
      ),
    }),
  });

  const recentLeads = useQuery({
    queryKey: ["admin", "recent-leads"],

    queryFn: async () => {
      const {
        data,
        error,
      } = await supabase
        .from("enquiries")
        .select(
          "id,name,phone,type,status,created_at,vehicle_slug",
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(6);

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });

  const recentVehicles = useQuery({
    queryKey: ["admin", "recent-vehicles"],

    queryFn: async () => {
      const {
        data,
        error,
      } = await supabase
        .from("vehicles")
        .select(
          "id,slug,make,model,year,price,availability,published",
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(6);

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });

  const tiles: {
    label: string;
    value: number | undefined;
    to?: string;
  }[] = [
    {
      label: "Vehicles",
      value: stats.data?.vehicles,
      to: "/admin/vehicles",
    },
    {
      label: "Available",
      value: stats.data?.available,
      to: "/admin/vehicles",
    },
    {
      label: "Featured",
      value: stats.data?.featured,
      to: "/admin/vehicles",
    },
    {
      label: "Sold",
      value: stats.data?.sold,
      to: "/admin/vehicles",
    },
    {
      label: "New enquiries",
      value: stats.data?.newLeads,
      to: "/admin/leads",
    },
    {
      label: "Pending test drives",
      value: stats.data?.testDrives,
      to: "/admin/appointments",
    },
    {
      label: "Trade-in requests",
      value: stats.data?.tradeIns,
      to: "/admin/trade-ins",
    },
    {
      label: "Financing requests",
      value: stats.data?.financing,
      to: "/admin/financing",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="A live snapshot of stock and customer enquiries."
      />

      {/* Dashboard error */}
      {stats.isError ? (
        <AdminCard className="mb-6 border-destructive/40">
          <p className="text-sm text-destructive">
            Could not load the figures. Refresh the page to try
            again.
          </p>
        </AdminCard>
      ) : null}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.label}
            to={t.to ?? "/admin"}
            className="group rounded-lg border border-admin-line bg-admin-panel p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-admin-focus/45 hover:shadow-lift motion-reduce:transform-none"
          >
            <p className="text-xs font-medium uppercase text-admin-muted transition-colors group-hover:text-admin-foreground">
              {t.label}
            </p>

            {stats.isLoading ? (
              <Skeleton className="mt-2 h-8 w-12" />
            ) : (
              <p className="mt-1 text-3xl font-bold tabular-nums text-admin-foreground">
                {t.value ?? 0}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Staff & Permissions */}
      <div className="mt-6">
        <Link
          to="/admin/staff"
          className="group block overflow-hidden rounded-xl border border-admin-line bg-admin-panel transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-admin-focus/45 hover:shadow-lift motion-reduce:transform-none"
        >
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex min-w-0 items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue transition-transform duration-200 group-hover:scale-105">
                <Users
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold text-admin-foreground">
                    Staff & Permissions
                  </h2>

                  <span className="rounded-full border border-brand-blue/20 bg-brand-blue/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-blue">
                    Admin
                  </span>
                </div>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-admin-muted">
                  Manage staff accounts, assign roles, control
                  administrative access and manage team permissions.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-brand-blue">
              <span>Manage staff</span>

              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="grid border-t border-admin-line sm:grid-cols-3">
            <div className="flex items-center gap-3 border-b border-admin-line px-5 py-3.5 sm:border-b-0 sm:border-r">
              <ShieldCheck
                className="size-4 shrink-0 text-brand-blue"
                aria-hidden="true"
              />

              <span className="text-xs text-admin-muted">
                Role management
              </span>
            </div>

            <div className="flex items-center gap-3 border-b border-admin-line px-5 py-3.5 sm:border-b-0 sm:border-r">
              <Users
                className="size-4 shrink-0 text-brand-blue"
                aria-hidden="true"
              />

              <span className="text-xs text-admin-muted">
                Staff access
              </span>
            </div>

            <div className="flex items-center gap-3 px-5 py-3.5">
              <ShieldCheck
                className="size-4 shrink-0 text-brand-blue"
                aria-hidden="true"
              />

              <span className="text-xs text-admin-muted">
                Permissions
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">
              Recent enquiries
            </h2>

            <Link
              to="/admin/leads"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {recentLeads.isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : null}

            {recentLeads.data?.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No enquiries yet.
              </p>
            ) : null}

            {recentLeads.data?.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between gap-3 border-b pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {l.name}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {l.type} • {l.phone}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">
              Recently added vehicles
            </h2>

            <Link
              to="/admin/vehicles"
              className="text-sm font-semibold text-brand-blue hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {recentVehicles.isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : null}

            {recentVehicles.data?.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No vehicles yet.
              </p>
            ) : null}

            {recentVehicles.data?.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-3 border-b pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {v.make} {v.model} {v.year}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {formatKes(Number(v.price))} •{" "}
                    {v.availability}
                    {v.published ? "" : " • draft"}
                  </p>
                </div>

                <Link
                  to="/admin/vehicles/$id"
                  params={{ id: v.id }}
                  className="shrink-0 text-sm font-semibold text-brand-blue hover:underline"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </>
  );
}
