import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/* ---------------------------------- fields --------------------------------- */

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  required?: boolean | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={htmlFor} className="block text-[13px] font-semibold">
        {label}
        {required ? (
          <span className="ml-0.5 text-primary" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="ml-1 text-muted-foreground">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const controlBase =
  "min-h-12 w-full rounded-md border border-input bg-background px-3.5 py-3 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20 md:text-sm";

export function TextInput({
  invalid,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean | undefined }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${props.id}-error` : undefined}
      className={cn(controlBase, invalid && "border-destructive", className)}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean | undefined }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${props.id}-error` : undefined}
      className={cn(controlBase, "min-h-28 resize-y", invalid && "border-destructive", className)}
    />
  );
}

export function SelectInput({
  invalid,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean | undefined }) {
  return (
    <select
      {...props}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${props.id}-error` : undefined}
      className={cn(controlBase, "appearance-none pr-8", invalid && "border-destructive", className)}
    >
      {children}
    </select>
  );
}

/* --------------------------------- helpers -------------------------------- */

export type Errors = Record<string, string>;

export const validators = {
  required: (v: string, label: string) => (v.trim() ? "" : `${label} is required.`),
  phone: (v: string) =>
    /^[0-9+\s()-]{9,}$/.test(v.trim()) ? "" : "Enter a valid phone number, e.g. 0721 886656.",
  email: (v: string, optional = false) =>
    !v.trim() && optional ? "" : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address.",
};

export type SubmitState = "idle" | "loading" | "success" | "error";

/**
 * Saves an enquiry to Lovable Cloud. All public forms on the site funnel
 * through this single helper so the team sees every request in one place.
 */
export function useEnquiry(type: string) {
  const [state, setState] = useState<SubmitState>("idle");

  async function submit(payload: {
    name: string;
    phone: string;
    email?: string;
    subject?: string;
    message?: string;
    details?: Record<string, string | number | boolean | null>;
  }) {
    setState("loading");
    const { error } = await supabase.from("enquiries").insert({
      type,
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      email: payload.email?.trim() || null,
      subject: payload.subject?.trim() || null,
      message: payload.message?.trim() || null,
      details: payload.details ?? {},
    });

    if (error) {
      setState("error");
      toast.error("We couldn't send your message", {
        description: "Please try again, or reach us on WhatsApp at 0721 886656.",
      });
      return false;
    }

    setState("success");
    toast.success("Message sent", { description: "Our team will get back to you shortly." });
    return true;
  }

  return { state, submit, reset: () => setState("idle") };
}

export function FormSuccess({ title, message, onReset }: { title: string; message: string; onReset: () => void }) {
  return (
    <div className="rounded-lg border border-brand-blue/30 bg-brand-blue/5 p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 text-sm font-semibold text-brand-blue underline-offset-4 hover:underline"
      >
        Send another
      </button>
    </div>
  );
}
