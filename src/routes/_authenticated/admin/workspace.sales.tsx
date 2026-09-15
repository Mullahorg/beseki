import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock, MessageCircle, Phone, Target } from "lucide-react";

import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading, StatusPill } from "@/components/admin/AdminBits";
import { RoleGate } from "@/components/admin/RoleGate";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/workspace/sales")({
  component: SalesDesk,
});

type Lead = {
  id: string;
  type: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string | null;
  vehicle_slug: string | null;
  status: string;
  preferred_at: string | null;
  created_at: string;
};

function when(iso: string) {
  return new Date(iso).toLocaleString("en-KE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function waHref(phone: string, name: string, vehicle: string | null) {
  const digits = phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(
    `Hello ${name}, this is BESEKI${vehicle ? ` about the ${vehicle.replace(/-/g, " ")}` : ""}. How can we help?`,
  );
  return `https://wa.me/${digits}?text=${text}`;
}

function SalesDesk() {
  const leadsQuery = useQuery({
    queryKey: ["admin", "sales-desk"],
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("id,type,name,phone,email,subject,message,vehicle_slug,status,preferred_at,created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const stats = useMemo(() => {
    const rows = leadsQuery.data ?? [];
    const today = new Date().toDateString();
    return {
      open: rows.filter((r) => r.status === "new" || r.status === "in_progress").length,
      today: rows.filter((r) => new Date(r.created_at).toDateString() === today).length,
      appointments: rows.filter((r) => r.type === "test_drive" || Boolean(r.preferred_at)).length,
      rows: rows.filter((r) => r.status !== "closed").slice(0, 20),
    };
  }, [leadsQuery.data]);

  return (
    <RoleGate allow={["super_admin", "admin", "sales"]}>
      <AdminHeader
        title="Sales desk"
        description="Everything you need to follow up customers today — newest enquiries first."
        action={
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/leads">Open all leads</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <AdminCard>
          <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Open enquiries</p>
          <p className="mt-3 text-3xl font-bold">{stats.open}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Came in today</p>
          <p className="mt-3 text-3xl font-bold">{stats.today}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Test drives & bookings</p>
          <p className="mt-3 text-3xl font-bold">{stats.appointments}</p>
        </AdminCard>
      </div>

      <AdminCard className="mt-6">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-base font-semibold">Follow-up queue</h2>
        </div>

        {leadsQuery.isLoading ? (
          <div className="mt-5">
            <AdminLoading rows={4} />
          </div>
        ) : leadsQuery.isError ? (
          <div className="mt-5">
            <AdminError message="We could not load your enquiries." />
          </div>
        ) : stats.rows.length === 0 ? (
          <div className="mt-5">
            <AdminEmpty title="Nothing waiting" message="New customer enquiries will appear here." />
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {stats.rows.map((lead) => (
              <li
                key={lead.id}
                className="flex flex-col gap-3 rounded-lg border border-admin-line bg-admin-surface p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-admin-foreground">{lead.name}</p>
                    <StatusPill status={lead.status} />
                  </div>
                  <p className="mt-1 truncate text-xs text-admin-muted">
                    {lead.type.replace(/[-_]/g, " ")} · {when(lead.created_at)}
                    {lead.vehicle_slug ? ` · ${lead.vehicle_slug.replace(/-/g, " ")}` : ""}
                  </p>
                  {lead.message ? (
                    <p className="mt-1 line-clamp-2 text-xs text-admin-muted">{lead.message}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <a href={`tel:${lead.phone}`} aria-label={`Call ${lead.name}`}>
                      <Phone className="size-4" aria-hidden="true" /> Call
                    </a>
                  </Button>
                  <Button asChild size="sm">
                    <a
                      href={waHref(lead.phone, lead.name, lead.vehicle_slug)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`WhatsApp ${lead.name}`}
                    >
                      <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
                    </a>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <AdminCard className="mt-6">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-base font-semibold">Shortcuts</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm"><Link to="/admin/appointments">Appointments</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/financing">Financing requests</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/trade-ins">Trade-ins</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/tools/financing">Financing calculator</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to="/admin/vehicles">Vehicle stock</Link></Button>
        </div>
      </AdminCard>
    </RoleGate>
  );
}
