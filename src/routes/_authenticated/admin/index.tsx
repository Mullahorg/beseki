import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { formatKes } from "@/lib/whatsapp";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

async function count(table: string, apply: (q: any) => any = (q) => q) {
  const { count: c, error } = await apply((supabase as any).from(table).select("id", { count: "exact", head: true }));
  if (error) throw error;
  return c ?? 0;
}

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => ({
      vehicles: await count("vehicles", (q) => q.eq("archived", false)),
      available: await count("vehicles", (q) => q.eq("archived", false).eq("availability", "Available")),
      featured: await count("vehicles", (q) => q.eq("archived", false).eq("featured", true)),
      sold: await count("vehicles", (q) => q.eq("availability", "Sold")),
      newLeads: await count("enquiries", (q) => q.eq("status", "new")),
      testDrives: await count("enquiries", (q) => q.eq("type", "test-drive").eq("status", "new")),
      tradeIns: await count("enquiries", (q) => q.eq("type", "trade-in").eq("status", "new")),
      financing: await count("enquiries", (q) => q.eq("type", "financing").eq("status", "new")),
    }),
  });

  const recentLeads = useQuery({
    queryKey: ["admin", "recent-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("id,name,phone,type,status,created_at,vehicle_slug")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const recentVehicles = useQuery({
    queryKey: ["admin", "recent-vehicles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id,slug,make,model,year,price,availability,published")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  const tiles: { label: string; value: number | undefined; to?: string }[] = [
    { label: "Vehicles", value: stats.data?.vehicles, to: "/admin/vehicles" },
    { label: "Available", value: stats.data?.available, to: "/admin/vehicles" },
    { label: "Featured", value: stats.data?.featured, to: "/admin/vehicles" },
    { label: "Sold", value: stats.data?.sold, to: "/admin/vehicles" },
    { label: "New enquiries", value: stats.data?.newLeads, to: "/admin/leads" },
    { label: "Pending test drives", value: stats.data?.testDrives, to: "/admin/appointments" },
    { label: "Trade-in requests", value: stats.data?.tradeIns, to: "/admin/trade-ins" },
    { label: "Financing requests", value: stats.data?.financing, to: "/admin/financing" },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" description="A live snapshot of stock and customer enquiries." />

      {stats.isError ? (
        <AdminCard className="mb-6 border-destructive/40">
          <p className="text-sm text-destructive">Could not load the figures. Refresh the page to try again.</p>
        </AdminCard>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to ?? "/admin"} className="rounded-xl border bg-card p-4 shadow-sm hover:bg-accent">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.label}</p>
            {stats.isLoading ? (
              <Skeleton className="mt-2 h-8 w-12" />
            ) : (
              <p className="mt-1 text-3xl font-bold tabular-nums">{t.value ?? 0}</p>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Recent enquiries</h2>
            <Link to="/admin/leads" className="text-sm font-semibold text-brand-blue hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentLeads.isLoading ? <Skeleton className="h-24 w-full" /> : null}
            {recentLeads.data?.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No enquiries yet.</p>
            ) : null}
            {recentLeads.data?.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{l.name}</p>
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
            <h2 className="text-base font-bold">Recently added vehicles</h2>
            <Link to="/admin/vehicles" className="text-sm font-semibold text-brand-blue hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentVehicles.isLoading ? <Skeleton className="h-24 w-full" /> : null}
            {recentVehicles.data?.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No vehicles yet.</p>
            ) : null}
            {recentVehicles.data?.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {v.make} {v.model} {v.year}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {formatKes(Number(v.price))} • {v.availability}
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
