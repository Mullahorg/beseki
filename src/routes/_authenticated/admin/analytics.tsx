import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, MousePointerClick, Target, Users } from "lucide-react";

import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminBits";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useStaffRole } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsPage,
});

type EventRow = {
  session_id: string;
  event_type: string;
  path: string;
  label: string | null;
  device: string | null;
  referrer: string | null;
  created_at: string;
};

type ActivityRow = {
  id: string;
  email: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  detail: string | null;
  created_at: string;
};

const RANGES = [
  { days: 7, label: "Last 7 days" },
  { days: 30, label: "Last 30 days" },
  { days: 90, label: "Last 90 days" },
] as const;

function since(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}

function when(iso: string) {
  return new Date(iso).toLocaleString("en-KE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <AdminCard>
      <div className="flex items-center gap-2 text-admin-muted">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-bold text-admin-foreground">{value}</p>
      <p className="mt-1 text-xs text-admin-muted">{hint}</p>
    </AdminCard>
  );
}

function AnalyticsPage() {
  const [days, setDays] = useState<number>(30);

  const eventsQuery = useQuery({
    queryKey: ["admin", "analytics", days],
    queryFn: async (): Promise<EventRow[]> => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("session_id,event_type,path,label,device,referrer,created_at")
        .gte("created_at", since(days))
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return (data ?? []) as EventRow[];
    },
  });

  const activityQuery = useQuery({
    queryKey: ["admin", "staff-activity", days],
    queryFn: async (): Promise<ActivityRow[]> => {
      const { data, error } = await supabase
        .from("staff_activity")
        .select("id,email,action,entity,entity_id,detail,created_at")
        .gte("created_at", since(days))
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as ActivityRow[];
    },
  });

  const stats = useMemo(() => {
    const rows = eventsQuery.data ?? [];
    const views = rows.filter((r) => r.event_type === "page_view");
    const conversions = rows.filter((r) => r.event_type === "conversion");

    const perSession = new Map<string, number>();
    for (const v of views) perSession.set(v.session_id, (perSession.get(v.session_id) ?? 0) + 1);

    const sessions = perSession.size;
    const bounced = [...perSession.values()].filter((n) => n <= 1).length;
    const convertingSessions = new Set(conversions.map((c) => c.session_id)).size;

    const byPage = new Map<string, number>();
    for (const v of views) byPage.set(v.path, (byPage.get(v.path) ?? 0) + 1);

    const byGoal = new Map<string, number>();
    for (const c of conversions) byGoal.set(c.label ?? "enquiry", (byGoal.get(c.label ?? "enquiry") ?? 0) + 1);

    const byDevice = new Map<string, number>();
    for (const v of views) byDevice.set(v.device ?? "unknown", (byDevice.get(v.device ?? "unknown") ?? 0) + 1);

    return {
      sessions,
      views: views.length,
      conversions: conversions.length,
      bounceRate: sessions ? bounced / sessions : 0,
      conversionRate: sessions ? convertingSessions / sessions : 0,
      topPages: [...byPage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      goals: [...byGoal.entries()].sort((a, b) => b[1] - a[1]),
      devices: [...byDevice.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [eventsQuery.data]);

  return (
    <>
      <AdminHeader
        title="Analytics"
        description="Visitor behaviour, enquiry conversions and what the team has been doing."
        action={
          <div className="flex flex-wrap gap-2" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <Button
                key={r.days}
                size="sm"
                variant={days === r.days ? "default" : "outline"}
                aria-pressed={days === r.days}
                onClick={() => setDays(r.days)}
              >
                {r.label}
              </Button>
            ))}
          </div>
        }
      />

      {eventsQuery.isLoading ? (
        <AdminLoading rows={4} />
      ) : eventsQuery.isError ? (
        <AdminError message="We could not load visitor analytics." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              icon={<Users className="size-4" aria-hidden="true" />}
              label="Visits"
              value={String(stats.sessions)}
              hint={`${stats.views} page views in total`}
            />
            <Stat
              icon={<Activity className="size-4" aria-hidden="true" />}
              label="Bounce rate"
              value={pct(stats.bounceRate)}
              hint="Visits that viewed only one page"
            />
            <Stat
              icon={<Target className="size-4" aria-hidden="true" />}
              label="Conversion rate"
              value={pct(stats.conversionRate)}
              hint="Visits that sent an enquiry or booking"
            />
            <Stat
              icon={<MousePointerClick className="size-4" aria-hidden="true" />}
              label="Enquiries"
              value={String(stats.conversions)}
              hint="Completed forms in this period"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <AdminCard>
              <h2 className="text-base font-semibold text-admin-foreground">Most visited pages</h2>
              {stats.topPages.length === 0 ? (
                <p className="mt-4 text-sm text-admin-muted">No visits recorded yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {stats.topPages.map(([path, count]) => (
                    <li
                      key={path}
                      className="flex items-center justify-between gap-4 rounded-md border border-admin-line bg-admin-surface px-3 py-2 text-sm"
                    >
                      <span className="truncate text-admin-foreground">{path}</span>
                      <span className="shrink-0 font-semibold text-admin-muted">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <AdminCard>
              <h2 className="text-base font-semibold text-admin-foreground">Conversions by goal</h2>
              {stats.goals.length === 0 ? (
                <p className="mt-4 text-sm text-admin-muted">No enquiries in this period yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {stats.goals.map(([goal, count]) => (
                    <li
                      key={goal}
                      className="flex items-center justify-between gap-4 rounded-md border border-admin-line bg-admin-surface px-3 py-2 text-sm"
                    >
                      <span className="truncate capitalize text-admin-foreground">
                        {goal.replace(/[-_]/g, " ")}
                      </span>
                      <span className="shrink-0 font-semibold text-admin-muted">{count}</span>
                    </li>
                  ))}
                </ul>
              )}

              <h3 className="mt-6 text-sm font-semibold text-admin-foreground">Devices</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {stats.devices.length === 0 ? (
                  <p className="text-sm text-admin-muted">No data yet.</p>
                ) : (
                  stats.devices.map(([device, count]) => (
                    <span
                      key={device}
                      className="rounded-full border border-admin-line bg-admin-surface px-3 py-1 text-xs capitalize text-admin-muted"
                    >
                      {device}: {count}
                    </span>
                  ))
                )}
              </div>
            </AdminCard>
          </div>
        </>
      )}

      {isBoss ? (
      <AdminCard className="mt-6">
        <h2 className="text-base font-semibold text-admin-foreground">Staff activity</h2>
        <p className="mt-1 text-sm text-admin-muted">
          A record of changes made in the workspace.
        </p>

        {activityQuery.isLoading ? (
          <div className="mt-5">
            <AdminLoading rows={3} />
          </div>
        ) : activityQuery.isError ? (
          <div className="mt-5">
            <AdminError message="We could not load staff activity." />
          </div>
        ) : (activityQuery.data?.length ?? 0) === 0 ? (
          <div className="mt-5">
            <AdminEmpty
              title="No activity yet"
              message="Changes made by the team will be listed here."
            />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-admin-line text-left text-xs uppercase tracking-wide text-admin-muted">
                  <th scope="col" className="py-3 pr-4 font-semibold">When</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Who</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Action</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {activityQuery.data?.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-admin-line/70 transition-colors last:border-0 hover:bg-admin-surface"
                  >
                    <td className="py-3 pr-4 text-admin-muted">{when(row.created_at)}</td>
                    <td className="py-3 pr-4 text-admin-foreground">{row.email ?? "—"}</td>
                    <td className="py-3 pr-4 capitalize text-admin-foreground">
                      {row.action.replace(/[._]/g, " ")}
                    </td>
                    <td className="py-3 pr-4 text-admin-muted">
                      {[row.entity_id, row.detail].filter(Boolean).join(" · ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
      ) : null}
    </>
  );
}
