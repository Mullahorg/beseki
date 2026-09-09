import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AdminLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full" />
      ))}
    </div>
  );
}

export function AdminEmpty({ title, message, action }: { title: string; message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-card px-6 py-14 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function AdminError({ message = "Something went wrong loading this data." }: { message?: string }) {
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 text-sm text-destructive">
      {message}
    </div>
  );
}

export function Saving({ show }: { show: boolean }) {
  if (!show) return null;
  return <Loader2 className="size-4 animate-spin" aria-hidden="true" />;
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "published" || status === "Available"
      ? "bg-emerald-100 text-emerald-800"
      : status === "archived" || status === "Sold"
        ? "bg-muted text-muted-foreground"
        : status === "Reserved" || status === "draft"
          ? "bg-amber-100 text-amber-900"
          : "bg-secondary text-secondary-foreground";
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium capitalize", tone)}>{status}</span>
  );
}
