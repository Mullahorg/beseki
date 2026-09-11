import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useNav, useSettings } from "@/lib/site-context";

export function Footer() {
  const settings = useSettings();
  const primaryNav = useNav("primary");
  const moreNav = useNav("more");
  const legalNav = useNav("legal");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.2fr] lg:gap-12 lg:py-20">
        <div className="max-w-xs">
          <span className="text-xl font-bold">
            {settings.shortName.slice(0, 4)}
            <span className="text-primary-foreground/90">{settings.shortName.slice(4)}</span>
          </span>
          <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">
            {settings.companyName}. {settings.tagline}.
          </p>
          <p className="mt-4 text-xs text-ink-foreground/50">{settings.address.postal}</p>
        </div>

        <nav aria-label="Explore">
          <h2 className="text-xs font-semibold uppercase text-ink-foreground/50">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5">
            {primaryNav.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className="text-sm text-ink-foreground/80 transition-colors hover:text-ink-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Support">
          <h2 className="text-xs font-semibold uppercase text-ink-foreground/50">
            Support
          </h2>
          <ul className="mt-4 space-y-2.5">
            {moreNav.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className="text-sm text-ink-foreground/80 transition-colors hover:text-ink-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase text-ink-foreground/50">
            Contact
          </h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-ink-foreground/80">
            <p className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ink-foreground/50" aria-hidden />
              <span>
                {settings.address.line1}
                <br />
                {settings.address.line2}
                <br />
                {settings.address.city}, {settings.address.country}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-ink-foreground/50" aria-hidden />
              <a href={`tel:${settings.phoneTel}`} className="hover:text-ink-foreground">
                {settings.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-ink-foreground/50" aria-hidden />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-ink-foreground">
                {settings.email}
              </a>
            </p>
          </address>
          {settings.socials.length > 0 ? (
            <ul className="mt-4 flex gap-3">
              {settings.socials.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ink-foreground/70 hover:text-ink-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-ink-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.companyName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.id}>
                <Link to={item.href} className="transition-colors hover:text-ink-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
