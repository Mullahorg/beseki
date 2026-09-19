import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, UserCheck } from "lucide-react";

import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminBits";
import { RoleGate } from "@/components/admin/RoleGate";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABELS, type StaffRole } from "@/lib/roles";

export const Route = createFileRoute("/_authenticated/admin/activity")({
  component: StaffActivityPage,
});

const rpc = (name: string, args?: Record<string, unknown>) =>
  (
    supabase.rpc as unknown as (
      n: string,
      a?: Record<string, unknown>,
    ) => Promise<{ data: unknown; error: { message: string } | null }>
  )(name, args);

type Summary = {
  email: string;
  role: StaffRole | null;
  sign_ins: number;
  actions: number;
  active_days: number;
  first_seen: string;
  last_seen: string;
};

type ActivityRow = {
  id: string;
  email: string | null;
  action: string;
  entity_id: string | null;
  detail: string | null;
  created_at: string;
};

const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

function when(iso: string) {
  return new Date(iso).toLocaleString("en-KE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StaffActivityPage() {
  const [days, setDays] = useState(30);

  const summaryQuery = useQuery({
    queryKey: ["admin", "activity-summary", days],
    queryFn: async (): Promise<Summary[]> => {
      const { data, error } = await rpc("get_staff_activity_summary", { days });
      if (error) throw new Error(error.message);
      return (data ?? []) as Summary[];
    },
  });

  const logQuery = useQuery({
    queryKey: ["admin", "activity-log", days],
    queryFn: async (): Promise<ActivityRow[]> => {
      const since = new Date(Date.now() - days * 86_400_000).toISOString();
      const { data, error } = await (
        supabase.from("staff_activity") as never as {
          select: (c: string) => {
            gte: (
              c: string,
              v: string,
            ) => {
              order: (
                c: string,
                o: { ascending: boolean },
              ) => {
                limit: (
                  n: number,
                ) => Promise<{ data: ActivityRow[] | null; error: { message: string } | null }>;
              };
            };
          };
        }
      )
        .select("id,email,action,entity_id,detail,created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  return (
    <RoleGate allow={["super_admin", "admin"]}>
      <AdminHeader
        title="Staff activity"
        description="Sign-in patterns and what each team member has been doing in the workspace."
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

      <AdminCard>
        <div className="flex items-center gap-2">
          <UserCheck className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-base font-semibold">Team summary</h2>
        </div>

        {summaryQuery.isLoading ? (
          <div className="mt-5">
            <AdminLoading rows={3} />
          </div>
        ) : summaryQuery.isError ? (
          <div className="mt-5">
            <AdminError message="We could not load the team summary." />
          </div>
        ) : (summaryQuery.data?.length ?? 0) === 0 ? (
          <div className="mt-5">
            <AdminEmpty title="No activity yet" message="Sign-ins and changes will show up here." />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-admin-line text-left text-xs uppercase tracking-wide text-admin-muted">
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Person
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Role
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Sign-ins
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Changes made
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Active days
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold">
                    Last seen
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaryQuery.data?.map((row) => (
                  <tr
                    key={row.email}
                    className="border-b border-admin-line/70 last:border-0 hover:bg-admin-surface"
                  >
                    <td className="py-3 pr-4 text-admin-foreground">{row.email}</td>
                    <td className="py-3 pr-4 text-admin-muted">
                      {row.role ? ROLE_LABELS[row.role] : "No access"}
                    </td>
                    <td className="py-3 pr-4 text-admin-foreground">{row.sign_ins}</td>
                    <td className="py-3 pr-4 text-admin-foreground">{row.actions}</td>
                    <td className="py-3 pr-4 text-admin-muted">{row.active_days}</td>
                    <td className="py-3 pr-4 text-admin-muted">{when(row.last_seen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <AdminCard className="mt-6">
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-base font-semibold">Recent actions</h2>
        </div>

        {logQuery.isLoading ? (
          <div className="mt-5">
            <AdminLoading rows={4} />
          </div>
        ) : logQuery.isError ? (
          <div className="mt-5">
            <AdminError message="We could not load the activity log." />
          </div>
        ) : (logQuery.data?.length ?? 0) === 0 ? (
          <div className="mt-5">
            <AdminEmpty
              title="Nothing logged yet"
              message="Changes made by the team will be listed here."
            />
          </div>
        ) : (
          <ul className="mt-5 space-y-2">
            {logQuery.data?.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-1 rounded-md border border-admin-line bg-admin-surface px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-admin-foreground">
                  <span className="font-medium">{row.email ?? "Unknown"}</span>{" "}
                  <span className="capitalize text-admin-muted">
                    {row.action.replace(/[._]/g, " ")}
                  </span>
                  {row.entity_id ? (
                    <span className="text-admin-muted"> · {row.entity_id}</span>
                  ) : null}
                  {row.detail ? <span className="text-admin-muted"> · {row.detail}</span> : null}
                </span>
                <span className="shrink-0 text-xs text-admin-muted">{when(row.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </RoleGate>
  );
}
