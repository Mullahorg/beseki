import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { trackPageView } from "@/lib/analytics";

/** Records public page views so the admin analytics screen has real data. */
export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return;
    const timer = window.setTimeout(() => trackPageView(pathname), 400);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
