import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronDown,
  Loader2,
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { toast } from "sonner";

import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type StaffRole =
  | "super_admin"
  | "admin"
  | "editor"
  | "sales";

type StaffMember = {
  email: string;
  role: StaffRole;
  created_at: string;
};

const ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  sales: "Sales",
};

const ROLE_DESCRIPTIONS: Record<StaffRole, string> = {
  super_admin:
    "Full system control, including staff and permission management.",
  admin:
    "Manage day-to-day operations and approved staff accounts.",
  editor:
    "Manage website content and permitted administrative areas.",
  sales:
    "Manage sales-related enquiries, customers and assigned operations.",
};

const ROLE_OPTIONS: StaffRole[] = [
  "super_admin",
  "admin",
  "editor",
  "sales",
];

function roleBadgeClass(role: StaffRole) {
  switch (role) {
    case "super_admin":
      return "bg-primary/10 text-primary border-primary/20";

    case "admin":
      return "bg-brand-blue/10 text-brand-blue border-brand-blue/20";

    case "editor":
      return "bg-muted text-foreground border-border";

    case "sales":
      return "bg-muted text-muted-foreground border-border";

    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function roleIcon(role: StaffRole) {
  if (role === "super_admin") {
    return <ShieldCheck className="size-4" />;
  }

  if (role === "admin") {
    return <Shield className="size-4" />;
  }

  return <Users className="size-4" />;
}

export const Route = createFileRoute("/_authenticated/admin/staff")({
  component: StaffManagement,
});

function StaffManagement() {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<StaffRole>("sales");
  const [adding, setAdding] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState<string | null>(null);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<StaffRole | null>(null);

  const staffQuery = useQuery({
    queryKey: ["admin", "staff"],
    queryFn: async (): Promise<StaffMember[]> => {
      const { data, error } =
        await supabase.rpc("get_staff_members");

      if (error) {
        throw error;
      }

      return (data ?? []) as StaffMember[];
    },
  });

  useEffect(() => {
    let mounted = true;

    async function loadCurrentRole() {
      const { data, error } =
        await supabase.rpc("get_my_staff_role");

      if (!mounted) {
        return;
      }

      if (!error && data) {
        setCurrentRole(data as StaffRole);
      }
    }

    void loadCurrentRole();

    return () => {
      mounted = false;
    };
  }, []);

  const isSuperAdmin = currentRole === "super_admin";
  const isAdmin = currentRole === "admin";

  const canManageStaff = isSuperAdmin || isAdmin;

  const visibleRoleOptions = useMemo(() => {
    if (isSuperAdmin) {
      return ROLE_OPTIONS;
    }

    return ["editor", "sales"] as StaffRole[];
  }, [isSuperAdmin]);

  async function addStaff() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Email required", {
        description: "Enter the staff member's email address.",
      });
      return;
    }

    if (!normalizedEmail.includes("@")) {
      toast.error("Invalid email", {
        description: "Enter a valid email address.",
      });
      return;
    }

    setAdding(true);

    try {
      const { error } = await supabase.rpc(
        "add_staff_member",
        {
          target_email: normalizedEmail,
          target_role: newRole,
        },
      );

      if (error) {
        throw error;
      }

      toast.success("Staff access added", {
        description: `${normalizedEmail} has been assigned the ${ROLE_LABELS[newRole]} role.`,
      });

      setEmail("");
      setNewRole("sales");

      await queryClient.invalidateQueries({
        queryKey: ["admin", "staff"],
      });
    } catch (error) {
      console.error("Add staff error:", error);

      toast.error("Could not add staff member", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });
    } finally {
      setAdding(false);
    }
  }

  async function updateRole(
    member: StaffMember,
    role: StaffRole,
  ) {
    if (member.role === role) {
      return;
    }

    setUpdatingEmail(member.email);

    try {
      const { error } = await supabase.rpc(
        "update_staff_role",
        {
          target_email: member.email,
          new_role: role,
        },
      );

      if (error) {
        throw error;
      }

      toast.success("Role updated", {
        description: `${member.email} is now ${ROLE_LABELS[role]}.`,
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin", "staff"],
      });
    } catch (error) {
      console.error("Update staff role error:", error);

      toast.error("Could not update role", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });
    } finally {
      setUpdatingEmail(null);
    }
  }

  async function removeStaff(member: StaffMember) {
    const confirmed = window.confirm(
      `Remove staff access for ${member.email}?\n\nThey will no longer be able to access the BESEKI staff portal.`,
    );

    if (!confirmed) {
      return;
    }

    setRemovingEmail(member.email);

    try {
      const { error } = await supabase.rpc(
        "remove_staff_access",
        {
          target_email: member.email,
        },
      );

      if (error) {
        throw error;
      }

      toast.success("Staff access removed", {
        description: `${member.email} no longer has staff access.`,
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin", "staff"],
      });
    } catch (error) {
      console.error("Remove staff error:", error);

      toast.error("Could not remove staff access", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again.",
      });
    } finally {
      setRemovingEmail(null);
    }
  }

  return (
    <>
      <AdminHeader
        title="Staff & Permissions"
        description="Manage BESEKI staff accounts, roles and access."
      />

      {!canManageStaff ? (
        <AdminCard className="border-destructive/40">
          <p className="text-sm text-destructive">
            You do not have permission to manage staff accounts.
          </p>
        </AdminCard>
      ) : null}

      {canManageStaff ? (
        <>
          {/* Add staff */}
          <AdminCard className="mb-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                <UserPlus
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-base font-bold">
                  Add staff member
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Give a registered BESEKI account access to the staff
                  portal.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-[1fr_220px_auto]">
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void addStaff();
                  }
                }}
                placeholder="staff@beseki.com"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                disabled={adding}
              />

              <div className="relative">
                <select
                  value={newRole}
                  onChange={(event) =>
                    setNewRole(
                      event.target.value as StaffRole,
                    )
                  }
                  disabled={adding}
                  className="h-10 w-full appearance-none rounded-md border border-border bg-background px-3 pr-9 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                >
                  {visibleRoleOptions.map((role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>

              <Button
                type="button"
                onClick={() => void addStaff()}
                disabled={adding}
              >
                {adding ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <UserPlus className="size-4" />
                )}

                Add staff
              </Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ROLE_OPTIONS.map((role) => {
                const allowed =
                  visibleRoleOptions.includes(role);

                return (
                  <div
                    key={role}
                    className={`rounded-lg border p-3 ${
                      allowed
                        ? "border-border bg-muted/20"
                        : "border-border/50 bg-muted/10 opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {roleIcon(role)}

                      <span className="text-xs font-bold">
                        {ROLE_LABELS[role]}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {ROLE_DESCRIPTIONS[role]}
                    </p>
                  </div>
                );
              })}
            </div>
          </AdminCard>

          {/* Staff list */}
          <AdminCard>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold">
                  Staff members
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {staffQuery.data?.length ?? 0} staff account
                  {staffQuery.data?.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500" />
                Access managed
              </div>
            </div>

            {staffQuery.isLoading ? (
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-lg bg-muted/40"
                  />
                ))}
              </div>
            ) : null}

            {staffQuery.isError ? (
              <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm font-semibold text-destructive">
                  Could not load staff members.
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Check that the staff management RPC functions have
                  been created in Supabase.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    void staffQuery.refetch()
                  }
                >
                  Try again
                </Button>
              </div>
            ) : null}

            {!staffQuery.isLoading &&
            !staffQuery.isError &&
            staffQuery.data?.length === 0 ? (
              <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
                <Users className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 text-sm font-semibold">
                  No staff members
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Add your first staff member above.
                </p>
              </div>
            ) : null}

            <div className="mt-5 space-y-3">
              {staffQuery.data?.map((member) => {
                const isSelf =
                  member.email.toLowerCase() ===
                  (
                    supabase.auth.getUser as unknown as () => string
                  );

                const canModify =
                  !isSelf &&
                  (isSuperAdmin ||
                    (
                      isAdmin &&
                      member.role !== "admin" &&
                      member.role !== "super_admin"
                    ));

                return (
                  <div
                    key={member.email}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-bold">
                            {member.email}
                          </p>

                          {isSelf ? (
                            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                              You
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Added{" "}
                          {new Date(
                            member.created_at,
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                          <select
                            value={member.role}
                            disabled={
                              !canModify ||
                              updatingEmail === member.email
                            }
                            onChange={(event) =>
                              void updateRole(
                                member,
                                event.target.value as StaffRole,
                              )
                            }
                            className={`h-9 appearance-none rounded-full border px-3 pr-8 text-xs font-semibold outline-none ${roleBadgeClass(
                              member.role,
                            )}`}
                          >
                            {ROLE_OPTIONS.map((role) => {
                              const allowed =
                                isSuperAdmin ||
                                (
                                  isAdmin &&
                                  (
                                    role === "editor" ||
                                    role === "sales"
                                  )
                                );

                              if (!allowed) {
                                return null;
                              }

                              return (
                                <option
                                  key={role}
                                  value={role}
                                >
                                  {ROLE_LABELS[role]}
                                </option>
                              );
                            })}
                          </select>

                          {updatingEmail ===
                          member.email ? (
                            <Loader2 className="absolute right-2 top-1/2 size-3 -translate-y-1/2 animate-spin" />
                          ) : (
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2" />
                          )}
                        </div>

                        {canModify ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={
                              removingEmail === member.email
                            }
                            onClick={() =>
                              void removeStaff(member)
                            }
                          >
                            {removingEmail ===
                            member.email ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <UserX className="size-4" />
                            )}

                            Remove
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-border pt-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="size-3.5 text-emerald-600" />

                        {ROLE_DESCRIPTIONS[member.role]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminCard>

          {/* Permission model */}
          <AdminCard className="mt-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-base font-bold">
                  Role hierarchy
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Permissions are controlled by role. More granular
                  per-feature permissions can be added without changing
                  the staff management structure.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <PermissionRow
                title="Super Admin"
                description="Full access to BESEKI administration and staff management."
              />

              <PermissionRow
                title="Admin"
                description="Operational administration and management of approved lower-level staff."
              />

              <PermissionRow
                title="Editor"
                description="Website/content management and features assigned by administrators."
              />

              <PermissionRow
                title="Sales"
                description="Sales, enquiries, customers and assigned sales operations."
              />
            </div>
          </AdminCard>
        </>
      ) : null}
    </>
  );
}

function PermissionRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <Check className="size-4 text-emerald-600" />

        <p className="text-sm font-semibold">
          {title}
        </p>
      </div>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
