import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "beseki.session";

function sessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const fresh =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return `s-${Date.now()}`;
  }
}

function device(): string {
  if (typeof window === "undefined") return "unknown";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

type EventType = "page_view" | "conversion" | "click";

async function record(event_type: EventType, path: string, label?: string) {
  if (typeof window === "undefined") return;
  if (path.startsWith("/admin") || path.startsWith("/auth")) return;
  try {
    await (supabase.from("analytics_events") as never as {
      insert: (row: Record<string, unknown>) => Promise<unknown>;
    }).insert({
      session_id: sessionId(),
      event_type,
      path,
      label: label ?? null,
      referrer: document.referrer || null,
      device: device(),
    });
  } catch {
    /* analytics must never break the page */
  }
}

/** Record a visit to a public page. */
export function trackPageView(path: string) {
  void record("page_view", path);
}

/** Record a completed goal, e.g. an enquiry or test-drive booking. */
export function trackConversion(label: string, path?: string) {
  void record(
    "conversion",
    path ?? (typeof window !== "undefined" ? window.location.pathname : "/"),
    label,
  );
}

/** Record a meaningful interaction such as a WhatsApp or call tap. */
export function trackClick(label: string) {
  void record(
    "click",
    typeof window !== "undefined" ? window.location.pathname : "/",
    label,
  );
}
