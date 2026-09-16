import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  Loader2,
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/AdminBits";
import { Field, TextInput, SelectInput } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

import {
  MAX_SUPER_ADMINS,
  PERMISSION_LEVELS,
  ROLE_LABELS,
  ROLE_ORDER,
  type StaffRole,
} from "@/lib/roles";

type StaffMember = { email: string; role: StaffRole; created_at: string };
type PendingPerson = { email: string; full_name: string | null; created_at: string };

const ROLE_OPTIONS: StaffRole[] = ROLE_ORDER;

type PermissionRow = { role: StaffRole; area: string; level: string; position: number };

function roleBadgeClass(role: StaffRole) {
  switch (role) {
    case "super_admin":
      return "border-primary/40 bg-primary/15 text-primary-foreground";
    case "admin":
      return "border-brand-blue/40 bg-brand-blue/20 text-admin-foreground";
    default:
      return "border-admin-line bg-admin-surface text-admin-muted";
  }
}

function RoleIcon({ role }: { role: StaffRole }) {
  if (role === "super_admin") return <ShieldCheck className="size-4" aria-hidden="true" />;
  if (role === "admin") return <Shield className="size-4" aria-hidden="true" />;
  return <Users className="size-4" aria-hidden="true" />;
}

// The staff RPCs are newer than the generated types, so call them untyped.
const rpc = (name: string, args?: Record<string, unknown>) =>
  (supabase.rpc as unknown as (
    n: string,
    a?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message: string } | null }>)(name, args);

export const Route = createFileRoute("/_authenticated/admin/staff")({
  component: StaffManagement,
});

function StaffManagement() {
  const qc = useQueryClient();

  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<StaffRole>("sales");
  const [busyEmail, setBusyEmail] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [currentRole, setCurrentRole] = useState<StaffRole | null>(null);
  const [myEmail, setMyEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const [{ data: userData }, roleRes] = await Promise.all([
        supabase.auth.getUser(),
        rpc("get_my_staff_role"),
      ]);
      if (!mounted) return;
      setMyEmail(userData.user?.email?.toLowerCase() ?? "");
      if (!roleRes.error && roleRes.data) setCurrentRole(roleRes.data as StaffRole);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const permissionsQuery = useQuery({
    queryKey: ["admin", "role-permissions"],
    queryFn: async (): Promise<PermissionRow[]> => {
      const { data, error } = await (supabase.from("role_permissions") as never as {
        select: (c: string) => {
          order: (c: string, o: { ascending: boolean }) => Promise<{
            data: PermissionRow[] | null;
            error: { message: string } | null;
          }>;
        };
      })
        .select("role,area,level,position")
        .order("position", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const staffQuery = useQuery({
    queryKey: ["admin", "staff"],
    queryFn: async (): Promise<StaffMember[]> => {
      const { data, error } = await rpc("get_staff_members");
      if (error) throw new Error(error.message);
      return (data ?? []) as StaffMember[];
    },
  });

  const pendingQuery = useQuery({
    queryKey: ["admin", "staff", "pending"],
    queryFn: async (): Promise<PendingPerson[]> => {
      const { data, error } = await rpc("get_pending_staff");
      if (error) throw new Error(error.message);
      return (data ?? []) as PendingPerson[];
    },
  });

  const isSuperAdmin = currentRole === "super_admin";
  const isAdmin = currentRole === "admin";
  const canManageStaff = isSuperAdmin || isAdmin;

  const roleChoices = useMemo<StaffRole[]>(
    () => (isSuperAdmin ? ROLE_OPTIONS : (["editor", "sales"] as StaffRole[])),
    [isSuperAdmin],
  );

  async function refresh() {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["admin", "staff"] }),
      qc.invalidateQueries({ queryKey: ["admin", "staff", "pending"] }),
    ]);
  }

  async function approve(targetEmail: string, role: StaffRole) {
    setBusyEmail(targetEmail);
    try {
      const { error } = await rpc("add_staff_member", {
        target_email: targetEmail.toLowerCase(),
        target_role: role,
      });
      if (error) throw new Error(error.message);
      toast.success("Staff access granted", {
        description: `${targetEmail} is now ${ROLE_LABELS[role]}.`,
      });
      await refresh();
    } catch (err) {
      toast.error("Could not grant access", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusyEmail(null);
    }
  }

  async function addStaff() {
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    setAdding(true);
    await approve(normalized, newRole);
    setAdding(false);
    setEmail("");
  }

  async function changeRole(member: StaffMember, role: StaffRole) {
    if (member.role === role) return;
    setBusyEmail(member.email);
    try {
      const { error } = await rpc("update_staff_role", {
        target_email: member.email,
        new_role: role,
      });
      if (error) throw new Error(error.message);
      toast.success("Role updated", {
        description: `${member.email} is now ${ROLE_LABELS[role]}.`,
      });
      await refresh();
    } catch (err) {
      toast.error("Could not update role", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusyEmail(null);
    }
  }

  async function removeStaff(member: StaffMember) {
    if (!window.confirm(`Remove staff access for ${member.email}?`)) return;
    setBusyEmail(member.email);
    try {
      const { error } = await rpc("remove_staff_access", { target_email: member.email });
      if (error) throw new Error(error.message);
      toast.success("Access removed", { description: `${member.email} can no longer sign in.` });
      await refresh();
    } catch (err) {
      toast.error("Could not remove access", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusyEmail(null);
    }
  }

  const areas = useMemo(() => {
    const seen: string[] = [];
    for (const row of permissionsQuery.data ?? []) if (!seen.includes(row.area)) seen.push(row.area);
    return seen;
  }, [permissionsQuery.data]);

  const levelFor = (role: StaffRole, area: string) =>
    (permissionsQuery.data ?? []).find((r) => r.role === role && r.area === area)?.level ?? "No access";

  const superAdminCount = (staffQuery.data ?? []).filter((m) => m.role === "super_admin").length;

  async function savePermission(role: StaffRole, area: string, level: string) {
    try {
      const { error } = await rpc("set_role_permission", {
        target_role: role,
        target_area: area,
        new_level: level,
      });
      if (error) throw new Error(error.message);
      toast.success("Permission updated", { description: `${ROLE_LABELS[role]} · ${area}: ${level}` });
      await qc.invalidateQueries({ queryKey: ["admin", "role-permissions"] });
    } catch (err) {
      toast.error("Could not update permission", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <>
      <AdminHeader
        title="Staff & roles"
        description="Approve people who have signed up, set what each role can do, and remove access."
      />

      <AdminCard className="mt-2">
        <p className="text-sm text-admin-muted">
          <span className="font-semibold text-admin-foreground">
            Super Admins: {superAdminCount} of {MAX_SUPER_ADMINS}
          </span>{" "}
          — the business can have at most {MAX_SUPER_ADMINS}. Super Admins have full access and can
          set what every role below them may do, but no one can change or remove another Super Admin.
        </p>
      </AdminCard>

      {!canManageStaff ? (
        <AdminCard>
          <p className="text-sm text-admin-muted">
            Only administrators can approve staff or change roles. You can still review who
            has access and what each role allows.
          </p>
        </AdminCard>
      ) : null}

      {/* Pending approvals */}
      <AdminCard className="mt-6">
        <div className="flex items-center gap-2">
          <UserPlus className="size-4 text-primary" aria-hidden="true" />
          <h2 className="text-base font-semibold text-admin-foreground">Waiting for approval</h2>
        </div>
        <p className="mt-1 text-sm text-admin-muted">
          People who created an account but have no role yet. They cannot open the workspace
          until you approve them.
        </p>

        {pendingQuery.isLoading ? (
          <div className="mt-5">
            <AdminLoading rows={2} />
          </div>
        ) : pendingQuery.isError ? (
          <div className="mt-5">
            <AdminError message="We could not load pending accounts." />
          </div>
        ) : (pendingQuery.data?.length ?? 0) === 0 ? (
          <div className="mt-5">
            <AdminEmpty
              title="Nobody is waiting"
              message="New sign-ups will appear here for approval."
            />
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {pendingQuery.data?.map((person) => (
              <li
                key={person.email}
                className="flex flex-col gap-3 rounded-lg border border-admin-line bg-admin-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-admin-foreground">
                    {person.full_name || person.email}
                  </p>
                  <p className="truncate text-xs text-admin-muted">{person.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {roleChoices.map((role) => (
                    <Button
                      key={role}
                      size="sm"
                      variant={role === "sales" ? "default" : "outline"}
                      disabled={!canManageStaff || busyEmail === person.email}
                      onClick={() => void approve(person.email, role)}
                    >
                      {busyEmail === person.email ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Check className="size-4" aria-hidden="true" />
                      )}
                      Approve as {ROLE_LABELS[role]}
                    </Button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      {/* Invite by email */}
      <AdminCard className="mt-6">
        <h2 className="text-base font-semibold text-admin-foreground">Add staff by email</h2>
        <p className="mt-1 text-sm text-admin-muted">
          Approve an address in advance. The role is applied the moment they sign in.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_200px_auto] sm:items-end">
          <Field label="Email address" htmlFor="staff-email">
            <TextInput
              id="staff-email"
              type="email"
              value={email}
              placeholder="name@company.com"
              disabled={!canManageStaff}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void addStaff();
              }}
            />
          </Field>
          <Field label="Role" htmlFor="staff-role">
            <SelectInput
              id="staff-role"
              value={newRole}
              disabled={!canManageStaff}
              onChange={(e) => setNewRole(e.target.value as StaffRole)}
            >
              {roleChoices.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Button
            className="h-12"
            disabled={!canManageStaff || adding}
            onClick={() => void addStaff()}
          >
            {adding ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <UserPlus className="size-4" aria-hidden="true" />
            )}
            Add staff
          </Button>
        </div>
      </AdminCard>

      {/* Current staff */}
      <AdminCard className="mt-6">
        <h2 className="text-base font-semibold text-admin-foreground">Staff with access</h2>

        {staffQuery.isLoading ? (
          <div className="mt-5">
            <AdminLoading rows={3} />
          </div>
        ) : staffQuery.isError ? (
          <div className="mt-5">
            <AdminError message="We could not load the staff list." />
          </div>
        ) : (staffQuery.data?.length ?? 0) === 0 ? (
          <div className="mt-5">
            <AdminEmpty title="No staff yet" message="Add your first staff member above." />
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {staffQuery.data?.map((member) => {
              const isSelf = member.email.toLowerCase() === myEmail;
              const canModify =
                canManageStaff &&
                !isSelf &&
                (isSuperAdmin ||
                  (isAdmin && member.role !== "admin" && member.role !== "super_admin"));

              return (
                <li
                  key={member.email}
                  className="flex flex-col gap-3 rounded-lg border border-admin-line bg-admin-surface p-4 transition-colors hover:border-admin-focus/40 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-md border ${roleBadgeClass(member.role)}`}
                    >
                      <RoleIcon role={member.role} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-admin-foreground">
                        {member.email} {isSelf ? <span className="text-admin-muted">(you)</span> : null}
                      </p>
                      <p className="text-xs text-admin-muted">{ROLE_LABELS[member.role]}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="sr-only" htmlFor={`role-${member.email}`}>
                      Role for {member.email}
                    </label>
                    <SelectInput
                      id={`role-${member.email}`}
                      className="min-h-10 w-44 py-2"
                      value={member.role}
                      disabled={!canModify || busyEmail === member.email}
                      onChange={(e) => void changeRole(member, e.target.value as StaffRole)}
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </SelectInput>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!canModify || busyEmail === member.email}
                      onClick={() => void removeStaff(member)}
                    >
                      {busyEmail === member.email ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <UserX className="size-4" aria-hidden="true" />
                      )}
                      Remove
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AdminCard>

      {/* What each role can do */}
      <AdminCard className="mt-6">
        <h2 className="text-base font-semibold text-admin-foreground">What each role can do</h2>
        <p className="mt-1 text-sm text-admin-muted">
          {isSuperAdmin
            ? "You can change what Admins, Editors and Sales staff are allowed to do. Super Admin access is always full and cannot be reduced."
            : "Only a Super Admin can change these rules."}
        </p>

        {permissionsQuery.isLoading ? (
          <div className="mt-5">
            <AdminLoading rows={4} />
          </div>
        ) : permissionsQuery.isError ? (
          <div className="mt-5">
            <AdminError message="We could not load the permission rules." />
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-admin-line text-left text-xs uppercase tracking-wide text-admin-muted">
                  <th scope="col" className="py-3 pr-4 font-semibold">Area</th>
                  {ROLE_OPTIONS.map((role) => (
                    <th key={role} scope="col" className="py-3 pr-4 font-semibold">
                      {ROLE_LABELS[role]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area} className="border-b border-admin-line/70 last:border-0">
                    <th scope="row" className="py-3 pr-4 text-left font-medium text-admin-foreground">
                      {area}
                    </th>
                    {ROLE_OPTIONS.map((role) => (
                      <td key={role} className="py-3 pr-4 text-admin-muted">
                        {role === "super_admin" ? (
                          <span className="text-admin-foreground">Full control</span>
                        ) : isSuperAdmin ? (
                          <>
                            <label className="sr-only" htmlFor={`perm-${role}-${area}`}>
                              {ROLE_LABELS[role]} access to {area}
                            </label>
                            <SelectInput
                              id={`perm-${role}-${area}`}
                              className="min-h-10 w-40 py-2"
                              value={levelFor(role, area)}
                              onChange={(e) => void savePermission(role, area, e.target.value)}
                            >
                              {[...new Set([levelFor(role, area), ...PERMISSION_LEVELS])].map((lvl) => (
                                <option key={lvl} value={lvl}>
                                  {lvl}
                                </option>
                              ))}
                            </SelectInput>
                          </>
                        ) : (
                          levelFor(role, area)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

    </>
  );
}
