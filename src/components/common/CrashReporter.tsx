import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { reportFailure } from "@/lib/notifications.functions";

/**
 * Watches for errors that break the page for a visitor and alerts the
 * Super Admin on Telegram (and by email). Alerts are throttled server side,
 * so a burst of errors never floods the chat.
 */
export function CrashReporter() {
  const report = useServerFn(reportFailure);

  useEffect(() => {
    let sentAt = 0;

    const send = (message: string, detail?: string) => {
      const now = Date.now();
      // One report per browser tab every 2 minutes.
      if (now - sentAt < 120_000) return;
      sentAt = now;
      void report({
        data: {
          message: message.slice(0, 300),
          path: window.location.pathname,
          detail: detail ? detail.slice(0, 500) : null,
        },
      }).catch(() => undefined);
    };

    const onError = (event: ErrorEvent) => {
      send(event.message || "Unhandled page error", event.error?.stack as string | undefined);
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      send(
        reason instanceof Error ? reason.message : "Unhandled promise rejection",
        reason instanceof Error ? reason.stack : String(reason ?? ""),
      );
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [report]);

  return null;
}
