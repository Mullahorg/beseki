import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type StaffRole = "super_admin" | "admin" | "editor" | "sales";

export const ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor / Marketing",
  sales: "Sales",
};

export const ROLE_ORDER: StaffRole[] = ["super_admin", "admin", "editor", "sales"];

/** Maximum number of super admins the business may have at one time. */
export const MAX_SUPER_ADMINS = 3;

export const PERMISSION_LEVELS = [
  "Full control",
  "Create & edit",
  "View only",
  "No access",
] as const;

const ALL: StaffRole[] = ["super_admin", "admin", "editor", "sales"];
const BOSSES: StaffRole[] = ["super_admin", "admin"];

/** Which roles may open each admin screen. Unlisted screens are admin-only. */
export const ROUTE_ACCESS: Record<string, StaffRole[]> = {
  "/admin": ALL,
  "/admin/vehicles": ["super_admin", "admin", "editor", "sales"],
  "/admin/media": ["super_admin", "admin", "editor"],
  "/admin/galleries": ["super_admin", "admin", "editor"],
  "/admin/leads": ["super_admin", "admin", "sales"],
  "/admin/appointments": ["super_admin", "admin", "sales"],
  "/admin/financing": ["super_admin", "admin", "sales"],
  "/admin/trade-ins": ["super_admin", "admin", "sales"],
  "/admin/homepage": ["super_admin", "admin", "editor"],
  "/admin/pages": ["super_admin", "admin", "editor"],
  "/admin/blog": ["super_admin", "admin", "editor"],
  "/admin/testimonials": ["super_admin", "admin", "editor"],
  "/admin/faqs": ["super_admin", "admin", "editor"],
  "/admin/services": ["super_admin", "admin", "editor"],
  "/admin/team": ["super_admin", "admin", "editor"],
  "/admin/tools/financing": ["super_admin", "admin", "sales"],
  "/admin/workspace/sales": ["super_admin", "admin", "sales"],
  "/admin/workspace/marketing": ["super_admin", "admin", "editor"],
  "/admin/analytics": ALL,
  "/admin/activity": BOSSES,
  "/admin/navigation": BOSSES,
  "/admin/settings": BOSSES,
  "/admin/notifications": ["super_admin"],
  "/admin/staff": ALL,
};

export function canOpen(role: StaffRole | null, path: string): boolean {
  if (!role) return false;
  const allowed = ROUTE_ACCESS[path];
  return allowed ? allowed.includes(role) : role === "super_admin" || role === "admin";
}

export const isBoss = (role: StaffRole | null) => role === "super_admin" || role === "admin";

/** The signed-in staff member's role, read from the database. */
export function useStaffRole() {
  const [role, setRole] = useState<StaffRole | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const [{ data: userData }, roleRes] = await Promise.all([
        supabase.auth.getUser(),
        (supabase.rpc as unknown as (
          n: string,
        ) => Promise<{ data: unknown; error: { message: string } | null }>)("get_my_staff_role"),
      ]);
      if (!mounted) return;
      setEmail(userData.user?.email?.toLowerCase() ?? "");
      if (!roleRes.error && roleRes.data) setRole(roleRes.data as StaffRole);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { role, email, loading, isBoss: isBoss(role), isSuperAdmin: role === "super_admin" };
}
