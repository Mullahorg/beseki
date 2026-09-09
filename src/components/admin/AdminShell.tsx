import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, X, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { company } from "@/data/company";
import { cn } from "@/lib/utils";

export const adminNav: { group: string; items: { label: string; to: string }[] }[] = [
  {
    group: "Overview",
    items: [{ label: "Dashboard", to: "/admin" }],
  },
  {
    group: "Stock",
    items: [
      { label: "Vehicles", to: "/admin/vehicles" },
      { label: "Media", to: "/admin/media" },
      { label: "Galleries", to: "/admin/galleries" },
    ],
  },
  {
    group: "Customers",
    items: [
      { label: "Leads", to: "/admin/leads" },
      { label: "Appointments", to: "/admin/appointments" },
      { label: "Financing", to: "/admin/financing" },
      { label: "Trade-Ins", to: "/admin/trade-ins" },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Homepage", to: "/admin/homepage" },
      { label: "Pages", to: "/admin/pages" },
      { label: "Blog", to: "/admin/blog" },
      { label: "Testimonials", to: "/admin/testimonials" },
      { label: "FAQs", to: "/admin/faqs" },
      { label: "Services", to: "/admin/services" },
      { label: "Team", to: "/admin/team" },
    ],
  },
  {
    group: "Setup",
    items: [
      { label: "Navigation", to: "/admin/navigation" },
      { label: "Site Settings", to: "/admin/settings" },
      { label: "SEO", to: "/admin/seo" },
      { label: "Legal", to: "/admin/legal" },
    ],
  },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = (
    <nav className="space-y-6 p-4">
      {adminNav.map((group) => (
        <div key={group.group}>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.group}
          </p>
          <ul className="mt-2 space-y-0.5">
            {group.items.map((item) => {
              const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-card px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-md p-2 hover:bg-accent lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link to="/admin" className="font-bold tracking-tight">
          {company.shortName} <span className="text-muted-foreground">admin</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-md px-3 py-2 text-sm hover:bg-accent sm:flex"
          >
            View site <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </Button>
        </div>
      </header>

      <div className="flex">
        <aside
          className={cn(
            "fixed inset-x-0 top-14 z-30 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b bg-card lg:sticky lg:block lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r",
            open ? "block" : "hidden lg:block",
          )}
        >
          {nav}
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border bg-card p-5 shadow-sm", className)}>{children}</div>;
}
