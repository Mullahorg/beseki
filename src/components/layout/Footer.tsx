import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { company, legalNav, moreNav, primaryNav } from "@/data/company";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.2fr] lg:gap-12 lg:py-20">
        <div className="max-w-xs">
          <span className="text-xl font-bold">
            BESE<span className="text-primary-foreground/90">KI</span>
          </span>
          <p className="mt-3 text-sm leading-relaxed text-ink-foreground/70">
            {company.name}. {company.tagline}.
          </p>
          <p className="mt-4 text-xs text-ink-foreground/50">{company.address.postal}</p>
        </div>

        <nav aria-label="Explore">
          <h2 className="text-xs font-semibold uppercase text-ink-foreground/50">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5">
            {primaryNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
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
              <li key={item.to}>
                <Link
                  to={item.to}
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
                {company.address.line1}
                <br />
                {company.address.line2}
                <br />
                {company.address.city}, {company.address.country}
              </span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-ink-foreground/50" aria-hidden />
              <a href={`tel:${company.phoneTel}`} className="hover:text-ink-foreground">
                {company.phoneDisplay}
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-ink-foreground/50" aria-hidden />
              <a href={`mailto:${company.email}`} className="break-all hover:text-ink-foreground">
                {company.email}
              </a>
            </p>
          </address>
          {company.socials.length > 0 ? (
            <ul className="mt-4 flex gap-3">
              {company.socials.map((s) => (
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
            © {year} {company.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-ink-foreground">
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
