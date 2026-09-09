import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "muted" | "sand" | "ink";
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 md:py-24",
        tone === "muted" && "bg-muted/60",
        tone === "sand" && "bg-sand",
        tone === "ink" && "bg-ink text-ink-foreground",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
  onDark = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: ReactNode;
  onDark?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-8 grid grid-cols-1 gap-5 md:mb-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end",
        align === "center" && "md:flex-col md:items-center md:text-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow ? (
          <p className={cn("eyebrow", onDark && "text-ink-foreground/70")}>{eyebrow}</p>
        ) : null}
        <h2 className={cn("mt-3 text-[27px] font-semibold leading-[1.2] md:text-[36px]")}>{title}</h2>
        {subtitle ? (
          <p
            className={cn(
              "mt-4 text-[15px] leading-7",
              onDark ? "text-ink-foreground/75" : "text-muted-foreground",
            )}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <header className="border-b bg-sand">
      <div className="container-page py-12 md:py-20">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-3xl text-[31px] font-semibold leading-[1.18] md:text-[48px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground md:text-base">
            {subtitle}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </header>
  );
}
