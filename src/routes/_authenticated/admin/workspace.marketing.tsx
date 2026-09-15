import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Share2, TrendingUp } from "lucide-react";

import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { AdminError, AdminLoading } from "@/components/admin/AdminBits";
import { RoleGate } from "@/components/admin/RoleGate";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/workspace/marketing")({
  component: MarketingDesk,
});

type Ev = { session_id: string; event_type: string; path: string; label: string | null; referrer: string | null };

const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
];

function host(url: string | null) {
  if (!url) return "Direct / unknown";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Direct / unknown";
  }
}

function MarketingDesk() {
  const [days, setDays] = useState(30);

  const eventsQuery = useQuery({
    queryKey: ["admin", "marketing", days],
    queryFn: async (): Promise<Ev[]> => {
      const since = new Date(Date.now() - days * 86_400_000).toISOString();
      const { data, error } = await (supabase.from("analytics_events") as never as {
        select: (c: string) => {
          gte: (c: string, v: string) => {
            limit: (n: number) => Promise<{ data: Ev[] | null; error: { message: string } | null }>;
          };
        };
      })
        .select("session_id,event_type,path,label,referrer")
        .gte("created_at", since)
        .limit(5000);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const stats = useMemo(() => {
    const rows = eventsQuery.data ?? [];
    const views = rows.filter((r) => r.event_type === "page_view");
    const sessions = new Set(views.map((r) => r.session_id)).size;
    const conversions = rows.filter((r) => r.event_type === "conversion").length;

    const bySource = new Map<string, number>();
    for (const v of views) {
      const k = host(v.referrer);
      bySource.set(k, (bySource.get(k) ?? 0) + 1);
    }
    const byPage = new Map<string, number>();
    for (const v of views) byPage.set(v.path, (byPage.get(v.path) ?? 0) + 1);

    return {
      sessions,
      conversions,
      rate: sessions ? Math.round((conversions / sessions) * 1000) / 10 : 0,
      sources: [...bySource.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      pages: [...byPage.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
    };
  }, [eventsQuery.data]);

  return (
    <RoleGate allow={["super_admin", "admin", "editor"]}>
      <AdminHeader
        title="Marketing desk"
        description="See where visitors come from, what they read, and jump straight to the content you publish."
        action={
          <div className="flex gap-2" role="group" aria-label="Date range">
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
        <AdminError message="We could not load campaign data." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <AdminCard>
              <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Visits</p>
              <p className="mt-3 text-3xl font-bold">{stats.sessions}</p>
            </AdminCard>
            <AdminCard>
              <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Enquiries</p>
              <p className="mt-3 text-3xl font-bold">{stats.conversions}</p>
            </AdminCard>
            <AdminCard>
              <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Conversion rate</p>
              <p className="mt-3 text-3xl font-bold">{stats.rate}%</p>
            </AdminCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <AdminCard>
              <div className="flex items-center gap-2">
                <Share2 className="size-4 text-primary" aria-hidden="true" />
                <h2 className="text-base font-semibold">Where visitors came from</h2>
              </div>
              <ul className="mt-4 space-y-2">
                {stats.sources.length === 0 ? (
                  <p className="text-sm text-admin-muted">No traffic recorded yet.</p>
                ) : (
                  stats.sources.map(([source, count]) => (
                    <li
                      key={source}
                      className="flex items-center justify-between gap-4 rounded-md border border-admin-line bg-admin-surface px-3 py-2 text-sm"
                    >
                      <span className="truncate text-admin-foreground">{source}</span>
                      <span className="shrink-0 font-semibold text-admin-muted">{count}</span>
                    </li>
                  ))
                )}
              </ul>
            </AdminCard>

            <AdminCard>
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" aria-hidden="true" />
                <h2 className="text-base font-semibold">Best performing pages</h2>
              </div>
              <ul className="mt-4 space-y-2">
                {stats.pages.length === 0 ? (
                  <p className="text-sm text-admin-muted">No page views yet.</p>
                ) : (
                  stats.pages.map(([path, count]) => (
                    <li
                      key={path}
                      className="flex items-center justify-between gap-4 rounded-md border border-admin-line bg-admin-surface px-3 py-2 text-sm"
                    >
                      <span className="truncate text-admin-foreground">{path}</span>
                      <span className="shrink-0 font-semibold text-admin-muted">{count}</span>
                    </li>
                  ))
                )}
              </ul>
            </AdminCard>
          </div>
        </>
      )}

      <AdminCard className="mt-6">
        <div className="flex items-center gap-2">
          <Megaphone className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-base font-semibold">Publish something</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/admin/blog">Write an article</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/homepage">Homepage sections</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/testimonials">Customer reviews</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/galleries">Photo galleries</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/media">Media library</Link></Button>
        </div>
      </AdminCard>
    </RoleGate>
  );
}
